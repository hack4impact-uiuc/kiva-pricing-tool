from api import app, db
from flask import Blueprint, request, jsonify
from api.models import Partner, Theme, Loan, RepaymentSchedule
import json
from api.utils import create_response, InvalidUsage, round_float, cal_apr_helper
import numpy as np

mod = Blueprint('main', __name__)

# function that is called when you visit /
@app.route('/')
def index():
    return '<h1>Hello World!</h1>'

# function that is called when you visit /persons
# @app.route('/persons')
# def name():
#     try:
#         create_response(data=Person.query.all())
#     except Exception as ex:
#         return create_response(data={}, status=400, message=str(ex

CALCULATE_URL = '/calculateAPR'
GET_VERSION_NUM = '/getVersionNum'
GET_LISTS = '/partnerThemeLists'
SAVE_LOAN_URL = '/saveNewLoan'
@app.route(CALCULATE_URL, methods=['POST'])
def cal_apr():
    """
        calculate and send a response with APR
    """
    input_json = request.get_json()
    args = request.args
    payload = {}
    apr = cal_apr_helper(input_json)
    if apr == None:
        return create_response({}, status=400, message='missing components for calculating apr rate')
    else:
        return create_response(data={'apr':apr}, status=200)


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
            'version_num' : request_json['version_num'],
            'start_name' : request_json['start_name'],
            'update_name' : request_json['update_name'],
            'nominal_apr' : request_json['nominal_apr'],
            'installment_time_period' : request_json['installment_time_period'],
            'repayment_type' : request_json['repayment_type'],
            'interest_time_period' : request_json['interest_time_period'],
            'interest_payment_type' : request_json['interest_payment_type'],
            'interest_calculation_type' : request_json['interest_calculation_type'],
            'loan_amount' : request_json['loan_amount'],
            'installment' : request_json['installment'],
            'nominal_interest_rate' : request_json['nominal_interest_rate'],
            'grace_period_principal' : request_json['grace_period_principal'],
            'grace_period_interest_pay' : request_json['grace_period_interest_pay'],
            'grace_period_interest_calculate' : request_json['grace_period_interest_calculate'],
            'grace_period_balloon' : request_json['grace_period_balloon'],
            'fee_percent_upfront' : request_json['fee_percent_upfront'],
            'fee_percent_ongoing' : request_json['fee_percent_ongoing'],
            'fee_fixed_upfront' : request_json['fee_fixed_upfront'],
            'fee_fixed_ongoing' : request_json['fee_fixed_ongoing'],
            'insurance_percent_upfront' : request_json['insurance_percent_upfront'],
            'insurance_percent_ongoing' : request_json['insurance_percent_ongoing'],
            'insurance_fixed_upfront' : request_json['insurance_fixed_upfront'],
            'insurance_fixed_ongoing' : request_json['insurance_fixed_ongoing'],
            'tax_percent_fees' : request_json['tax_percent_fees'],
            'tax_percent_interest' : request_json['tax_percent_interest'],
            'security_deposit_percent_upfront' : request_json['security_deposit_percent_upfront'],
            'security_deposit_percent_ongoing' : request_json['security_deposit_percent_ongoing'],
            'security_deposit_fixed_upfront' : request_json['security_deposit_fixed_upfront'],
            'security_deposit_fixed_ongoing' : request_json['security_deposit_fixed_ongoing'],
            'interest_paid_on_deposit_percent' : request_json['interest_paid_on_deposit_percent']
        }
    except:
        return create_response(status=422, message='missing compoonents for save new loan')
    try:
        db.session.add(Loan(newrow))
        db.session.commit()
        return create_response(status=201)
    except:
        return create_response(status=422, message='Loan with this version already exists')


