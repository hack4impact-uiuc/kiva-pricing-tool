from api import app
from flask import Blueprint, request
from api.models import Partner, Theme, Loan, RepaymentSchedule
import json
from flask import jsonify
from api.utils import create_response, InvalidUsage

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


@app.route('/endpoint1')
def cal_apr():
    args = request.args
    payload = {}
    # not sure if we need to validate again
    try:
        apr = cal_apr(args['v1'], args['v2'], args['v3'], args['v4'])
        return create_response(data={'apr':apr}, status=200)
    except:
        #TODO status code not sure 
        create_response({}, status=404, message='missing components for calculating apr rate')


def cal_apr_helper(var1, var2, var3, var4):
    pass

# for check version number
@app.route('/endpoint2')
def get_version():
    args = request.args
    try:
        theme = args['theme']
        partner_name = args['partner_name']
        product = args['product']
        #TODO: result = query method by model.py

        if result is None:
            return create_response({version:1}, status=200)
        else:
            return create_response({version:result+1}, status=200)
    except:
        return create_response({}, status=404, message='missing components for creating new loan')

@app.route('/endpoint3', method=['POST'])
def save_loan():
    request_json = request.get_json()
    payload = {}
    try:
        # get all variables in the form

        #TODO: query database to save loan
        return create_response(payload, status=201)
    except:
        return create_response(payload, status=422, message='missing components for creating new loan')


