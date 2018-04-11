from api import app, db
from flask import Blueprint, request, jsonify, Response
from api.models import Partner, Theme, Loan, RepaymentSchedule
import json
from api.utils import create_response, InvalidUsage, round_float, cal_apr_helper
import numpy as np

mod = Blueprint('main', __name__)

# function that is called when you visit /
@app.route('/')
def index():
    return '<h1>Hello World!</h1>'


CALCULATE_URL = '/calculateAPR'
GET_VERSION_NUM = '/getVersionNum'
GET_LISTS = '/partnerThemeLists'
SAVE_LOAN_URL = '/saveNewLoan'
GET_CSV = '/getCSV'
@app.route(CALCULATE_URL, methods=['POST'])
def cal_apr():
    """
        calculate and send a response with APR
    """
    input_json = request.get_json()
    args = request.args
    payload = {}
    apr, matrix = cal_apr_helper(input_json)
    if apr == None:
        return create_response({}, status=400, message='missing components for calculating apr rate')
    else:
        return create_response(data={'apr':apr, 'matrix':matrix}, status=200)


@app.route(GET_VERSION_NUM)
def get_version_num():
    """
        sending a response with the cersoin number
    """
    args = request.args
    try:
        theme = args['theme']
        partner_name = args['partner_name']
        product = args['product']
        loans = Loan.query.filter_by(partner_name = partner_name, loan_theme = theme, product_type = product).all()
        num = 1 + len(loans)
        return create_response({'version':num}, status=200)
    except:
        return create_response({}, status=400, message='missing arguments for GET')


@app.route(GET_LISTS)
def get_partner_theme_list():
    """
        grabbing MFI Partner and Loan Theme
    """
    themes = Theme.query.all()
    partners = Partner.query.all()
    data = {'themes':[x.loan_theme for x in themes], 'partners':[x.partner_name for x in partners]}
    return create_response(data=data, status=200)



@app.route(SAVE_LOAN_URL, methods=['POST'])
def save_loan():
    """Save a new loan to the database, attempts to get all form data and use loan's __init__ to add"""
    request_json = request.get_json()
    try:
        newrow = {
            'partner_name' : request_json['partner_name'],
            'loan_theme' : request_json['loan_theme'],
            'product_type' : request_json['product_type'],
            'version_num' : int(request_json['version_num']),
            'start_name' : request_json['start_name'],
            'update_name' : request_json['update_name'],
            'nominal_apr' : float(request_json['nominal_apr']) / 100,
            'installment_time_period' : request_json['installment_time_period'],
            'repayment_type' : request_json['repayment_type'],
            'interest_time_period' : request_json['interest_time_period'],
            'interest_payment_type' : request_json['interest_payment_type'],
            'interest_calculation_type' : request_json['interest_calculation_type'],
            'loan_amount' : float(request_json['loan_amount']),
            'installment' : int(request_json['installment']),
            'nominal_interest_rate' : float(request_json['nominal_interest_rate']),
            'grace_period_principal' : int(request_json['grace_period_principal']),
            'grace_period_interest_pay' : int(request_json['grace_period_interest_pay']),
            'grace_period_interest_calculate' : int(request_json['grace_period_interest_calculate']),
            'grace_period_balloon' : int(request_json['grace_period_balloon']),
            'fee_percent_upfront' : float(request_json['fee_percent_upfront'])/100,
            'fee_percent_ongoing' : float(request_json['fee_percent_ongoing'])/100,
            'fee_fixed_upfront' : float(request_json['fee_fixed_upfront']),
            'fee_fixed_ongoing' : float(request_json['fee_fixed_ongoing']),
            'insurance_percent_upfront' : float(request_json['insurance_percent_upfront'])/100,
            'insurance_percent_ongoing' : float(request_json['insurance_percent_ongoing'])/100,
            'insurance_fixed_upfront' : float(request_json['insurance_fixed_upfront']),
            'insurance_fixed_ongoing' : float(request_json['insurance_fixed_ongoing']),
            'tax_percent_fees' : float(request_json['tax_percent_fees'])/100,
            'tax_percent_interest' : float(request_json['tax_percent_interest'])/100,
            'security_deposit_percent_upfront' : float(request_json['security_deposit_percent_upfront'])/100,
            'security_deposit_percent_ongoing' : float(request_json['security_deposit_percent_ongoing'])/100,
            'security_deposit_fixed_upfront' : float(request_json['security_deposit_fixed_upfront']),
            'security_deposit_fixed_ongoing' : float(request_json['security_deposit_fixed_ongoing']),
            'interest_paid_on_deposit_percent' : float(request_json['interest_paid_on_deposit_percent'])/100
        }
    except:
        return create_response(status=422, message='missing compoonents for save new loan')
    try:
        db.session.add(Loan(newrow))
        print("hi")
        db.session.commit()
        print('hi')
        return create_response(status=201)
    except Exception as ex:
        return create_response(status=423, message=str(ex))


@app.route(GET_CSV)
def get_csv():
    """
        Get's data for a loan in csv format.
    """
    args = request.args
    try:
        theme = args['theme']
        partner_name = args['partner_name']
        product = args['product']
        version_num = int(args['version_num'])
    except:
        return create_response({}, status=400, message='missing arguments for GET')
    try:
        loans = Loan.query.filter_by(partner_name = partner_name, loan_theme = theme, product_type = product, version_num = version_num).all()
        loan = loans[0]
        attrs = [i for i in dir(loan) if not i.startswith('_')]
    except:
        return create_response({}, status=422, message='non-existent loan')
    csv = ','.join(attrs) + '\n' + ','.join([str(getattr(loan, i)) for i in attrs])
    return Response(
        csv,
        mimetype="text/csv",
        headers={"Content-disposition":
                     "attachment; filename=loan.csv"})
