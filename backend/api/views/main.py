from api import app
from flask import Blueprint, request
from api.models import Partner, Theme, Loan, RepaymentSchedule
import json
from flask import jsonify
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

CALCULATE_URL = '/endpoint1'
INFO_INPUT_URL = '/endpoint2'
SAVE_LOAN_URL = '/endpoint3'
@app.route(CALCULATE_URL, methods=['POST'])
def cal_apr():
    input_json = request.get_json()
    args = request.args
    payload = {}
    apr = cal_apr_helper(input_json)
    if apr == None:
        return create_response({}, status=400, message='missing components for calculating apr rate')
    else:
        return create_response(data={'apr':apr}, status=200)

# for check version number
"""
    assume a query_type argument to specify what to get
"""
@app.route(INFO_INPUT_URL)
def get_info():
    args = request.args
    # return create_response({'ret':args}, status=200)
    try:
        if args['query_type'] == 'theme_partner_list':
            #TODO query database for parter_list and theme
            themes = Theme.query.all()
            partners = Partner.query.all()
            data = {'themes':[x.loan_theme for x in themes], 'partners':[x.partner_name for x in partners]}
            return create_response(data=data, status=200)
        elif args['query_type'] == 'version_num':
            theme = args['theme']
            partner_name = args['partner_name']
            product = args['product']

            #TODO: result = query method by model.py
            loans = Loan.query.filter_by(partner_name = partner_name, loan_theme = theme, product_type = product).all()
            num = 1 + len(loans)    
            return create_response({'version':num}, status=200)
        else:
            # should never happen
            return create_response({}, status=400, message='wrong query_type argument')
    except:
        return create_response({}, status=400, message='missing arguments for GET')


@app.route(SAVE_LOAN_URL, methods=['POST'])
def save_loan():
    request_json = request.get_json()
    payload = {}
    try:
        # get all variables in the form

        #TODO: query database to save loan
        return create_response(payload, status=201)
    except:
        return create_response(payload, status=422, message='missing compoonents for save new loan')


