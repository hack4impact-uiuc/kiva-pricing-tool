from api import app
from flask import Blueprint, request
from api.models import Partner, Theme, Loan, RepaymentSchedule
import json
from flask import jsonify
from api.utils import create_response, InvalidUsage
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

CALCULATE_URL = 'endpoint1'
INFO_INPUT_URL = 'endpoint2'
SAVE_LOAN_URL = 'endpoint3'
@app.route(CALCULATE_URL)
def cal_apr():
    input_json = request.get_json()
    args = request.args
    payload = {}
    try:
        installment_time_period = input_json['installment_time_period']
        repayment_type = input_json['repayment_type']
        interest_time_period = input_json['interest_time_period']
        interest_payment_type = input_json['interest_payment_type']
        interest_calculation_type = input_json['interest_calculation_type']
        loan_amount = input_json['loan_amount']
        installment = input_json['installment']
        nominal_interest_rate = input_json['nominal_interest_rate']
        grace_period_principal = input_json['grace_period_principal']
        grace_period_interest_pay = input_json['grace_period_interest_pay']
        grace_period_interest_calculate = input_json['grace_period_interest_calculate']
        grace_period_balloon = input_json['grace_period_balloon']
        fee_percent_upfront = input_json['fee_percent_upfront']
        fee_percent_ongoing = input_json['fee_percent_ongoing']
        fee_fixed_upfront = input_json['fee_fixed_upfront']
        fee_fixed_ongoing = input_json['fee_fixed_ongoing']
        insurance_percent_upfront = input_json['insurance_percent_upfront']
        insurance_percent_ongoing = input_json['insurance_percent_ongoing']
        insurance_fixed_upfront = input_json['insurance_fixed_upfront']
        insurance_fixed_ongoing  = input_json['insurance_fixed_ongoing']
        tax_percent_fees = input_json['tax_percent_fees']
        tax_percent_interest = input_json['tax_percent_interest']
        security_deposit_percent_upfront = input_json['security_deposit_percent_upfront']
        security_deposit_percent_ongoing = input_json['security_deposit_percent_ongoing']
        security_deposit_fixed_upfront = input_json['security_deposit_fixed_upfront']
        security_deposit_fixed_ongoing = input_json['security_deposit_fixed_ongoing']
        interest_paid_on_deposit_percent = input_json['interest_paid_on_deposit_percent']


        installments_arr = np.array([1, 7, 14, 15, 28, 30, 90, 180, 360])
        nominal_arr = 1 / installments_arr
        scaled_interest = nominal_interest_rate*installments_arr['installment_time_period'] * nominal_arr['interest_time_period']

        # amortization
        monthly_payment = loan_amount / (((1+scaled_interest)**installment -1) / (scaled_interest * (1+scaled_interest)**installment))


        principal_paid_arr = np.zeros(installment + 1)
        balance_arr = np.zeros(installment+1)
        interest_paid_arr = np.zeros(installment+1)

        balance_arr[0] = loan_amount
        for idx in range(1, len(balance_arr)):
            balance_arr[idx] = balance_arr[idx-1] - (monthly_payment - balance_arr[idx-1] * scaled_interest)
            interest_paid_arr[idx] = balance_arr[idx-1] * scaled_interest
            principal_paid_arr[idx] = monthly_payment - interest_paid_arr[idx]

        return create_response(data={'apr':apr}, status=200)
    except:
        #TODO status code not sure 
        create_response({}, status=400, message='missing components for calculating apr rate')

def cal_apr_helper(var1, var2, var3, var4):
    pass

# for check version number
"""
    assume a query_type argument to specify what to get
"""
@app.route(INFO_INPUT_URL)
def get_version():
    args = request.args
    try:
        if args['query_type'] == 'theme_list':
            #TODO query database for theme list
        elif args['query_type'] == 'parter_list':
            #TODO query database for parter_list
        elif args['query_type'] == 'version_num':
            theme = args['theme']
            partner_name = args['partner_name']
            product = args['product']

            #TODO: result = query method by model.py
            if result is None:
                return create_response({version:1}, status=200)
            else:
                return create_response({version:result+1}, status=200)
        else:
            # should never happen
            return create_response({}, status=400, message='wrong query_type argument')
    except:
        return create_response({}, status=400, message='missing arguments for GET')


@app.route(SAVE_LOAN_URL, method=['POST'])
def save_loan():
    request_json = request.get_json()
    payload = {}
    try:
        # get all variables in the form

        #TODO: query database to save loan
        return create_response(payload, status=201)
    except:
        return create_response(payload, status=422, message='missing compoonents for save new loan')


