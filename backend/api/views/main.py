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

GET_ALL_MFI = "/getAllMFI"
EDIT_MFI = "/editMFI/<partner_name>"
ADD_MFI = "/addMFI"
REMOVE_MFI = "/removeMFI/<partner_name>"

GET_ALL_LT = "/getAllLT"
EDIT_LT = "/editLT/<loan_theme>"
ADD_LT = "/addLT"
REMOVE_LT = "/removeLT/<loan_theme>"


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
    except:
        return create_response({}, status=400, message='missing arguments for GET')
    p = Partner.query.filter_by(partner_name=partner_name).first()
    t = Theme.query.filter_by(loan_theme=theme).first()
    if p is None or t is None or not p.active or not t.active:
        return create_response({}, status=400, message='Non-Existent MFI Partner and/or Loan Theme')
    loans = Loan.query.filter_by(partner_id = p.id, theme_id = t.id, product_type = product).all()
    num = 1 + len(loans)
    return create_response({'version':num}, status=200)


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
        p = Partner.query.filter_by(partner_name=partner_name).first()
        t = Theme.query.filter_by(loan_theme=theme).first()
        if p is None or t is None or not p.active or not t.active:
            return create_response({}, status=400, message='Non-Existent MFI Partner and/or Loan Theme')
        loans = Loan.query.filter_by(partner_id = p.id, theme_id = t.id, product_type = product, version_num = version_num).all()
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

@app.route(GET_ALL_MFI, methods=['GET'])
def getAllMFI():
    partners = Partner.query.filter_by(active=True).all()
    return create_response({'partners': [x.partner_name for x in partners]}, status=200)

@app.route(EDIT_MFI, methods=['PUT'])
def editMFI(partner_name):
    data = request.get_json()
    partner = Partner.query.filter_by(partner_name=partner_name).first()
    if partner is None:
        return create_response(status=422, message="No such MFI Partner currently exists")
    try:
        new_name = data['updated_partner_name']
        partner.partner_name = new_name
        db.session.commit()
        return create_response(message="Update Successful")
    except:
        return create_response({}, status=400, message='missing arguments for PUT')

@app.route(ADD_MFI, methods=['POST'])
def addMFI():
    data = request.get_json()
    try:
        partner_name = data['partner_name']
        partner = Partner.query.filter_by(partner_name=partner_name).first()
        if partner is None:
            p = Partner(data)
            db.session.add(p)
            db.session.commit()
            return create_response(message='Post Successful')
        elif partner.active:
            return create_response(status=422, message='Resource Already Exists')
        else:
            partner.active = True
            db.session.commit()
            return create_response(message='Post Successful')
    except:
        return create_response({}, status=400, message='missing arguments for POST')

@app.route(REMOVE_MFI, methods=['DELETE'])
def removeMFI(partner_name):
    partner = Partner.query.filter_by(partner_name=partner_name).first()
    if partner is None or partner.active is False:
        return create_response(status=422, message="No such MFI Partner currently exists")
    partner.active = False
    db.session.commit()
    return create_response(message="Update Successful")

@app.route(GET_ALL_LT, methods=['GET'])
def getAllLT():
    themes = Theme.query.filter_by(active=True).all()
    return create_response({'partners': [x.loan_theme for x in themes]}, status=200)

@app.route(EDIT_LT, methods=['PUT'])
def editLT(loan_theme):
    data = request.get_json()
    theme = Theme.query.filter_by(loan_theme=loan_theme).first()
    if theme is None:
        return create_response(status=422, message="No such Loan Theme currently exists")
    try:
        new_name = data['updated_loan_theme']
        theme.loan_theme = new_name
        db.session.commit()
        return create_response(message="Update Successful")
    except:
        return create_response({}, status=400, message='missing arguments for PUT')

@app.route(ADD_LT, methods=['POST'])
def addLT():
    data = request.get_json()
    try:
        loan_theme = data['loan_theme']
        theme = Theme.query.filter_by(loan_theme=loan_theme).first()
        if theme is None:
            t = Theme(data)
            db.session.add(t)
            db.session.commit()
            return create_response(message='Post Successful')
        elif theme.active:
            return create_response(status=422, message='Resource Already Exists')
        else:
            theme.active = True
            db.session.commit()
            return create_response(message='Post Successful')
    except:
        return create_response({}, status=400, message='missing arguments for POST')

@app.route(REMOVE_LT, methods=['DELETE'])
def removeLT(loan_theme):
    theme = Theme.query.filter_by(loan_theme=loan_theme).first()
    if theme is None or theme.active is False:
        return create_response(status=422, message="No such Loan Theme currently exists")
    theme.active = False
    db.session.commit()
    return create_response(message="Update Successful")
