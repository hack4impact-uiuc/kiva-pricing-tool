from api import app, db
from flask import Blueprint, request, jsonify, Response
from api.models import Partner, Theme, Loan, RepaymentSchedule
import json
from api.utils import create_response, InvalidUsage, cal_apr_helper, update_repayment_schedule, round_matrix, month_num_to_str_dict
import numpy as np
import datetime

PERIOD_IDX = 0
DATE_IDX = 1
DAY_IDX = 2
PRINCIPAL_DISBURSED_IDX = 3
PRINCIPAL_PAID_IDX = 4
BALANCE_IDX = 5
INTEREST_PAID_IDX = 6
FEES_IDX = 7
INSURANCE_IDX = 8
TAXES_IDX = 9
SECURITY_DEPOSIT_IDX = 10
SECURITY_DEPOSIT_INTEREST_PAID_IDX = 11
SECURITY_DEPOSIT_WITHDRAW_IDX = 12
SECURITY_DEPOSIT_BALANCE_IDX = 13
CASH_FLOW_IDX = 14

mod = Blueprint('main', __name__)

# function that is called when you visit /
@app.route('/')
def index():
    return '<h1>Hello World!</h1>'

# Generic endpoint URLs
CALCULATE_URL = '/calculateAPR'
RECALCULATE_URL = '/recalculate'
GET_VERSION_NUM = '/getVersionNum'
GET_LISTS = '/partnerThemeLists'
SAVE_LOAN_URL = '/saveNewLoan'
GET_CSV = '/getCSV'


# Admin endpoint URLs
GET_ALL_MFI = "/getAllMFI"
EDIT_MFI = "/editMFI/<partner_name>"
ADD_MFI = "/addMFI"
REMOVE_MFI = "/removeMFI/<partner_name>"

GET_ALL_LT = "/getAllLT"
EDIT_LT = "/editLT/<loan_theme>"
ADD_LT = "/addLT"
REMOVE_LT = "/removeLT/<loan_theme>"

# Find loan endpoint URLs
FINDLOAN_GET_MFI_LIST = "/getMFIEntry"
FINDLOAN_GET_LOAN_ENTRY = "/getLTEntry"
FINDLOAN_GET_PRODUCT_ENTRY = "/getPTEntry"
FINDLOAN_GET_VERSION_LIST = "/getVersionNumEntry"
FINDLOAN_GET_LOAN_DATA = "/findLoan"

SAVE_REPAYMENT_SCHEDULE = "/saveRepayment"

@app.route(CALCULATE_URL, methods=['POST'])
def cal_apr():
    """
        calculate and send a response with APR
    """
    print("in calc url")
    input_json = request.get_json()
    args = request.args
    payload = {}
    apr, matrix = cal_apr_helper(input_json)
    matrix = round_matrix(matrix)
    matrix_list = []
    for a in matrix:
        matrix_list.append(list(a))
    if apr == None:
        return create_response({}, status=400, message='missing components for calculating apr rate')
    else:
        return create_response(data={'apr':apr, 'matrix':matrix_list}, status=200)

@app.route(RECALCULATE_URL, methods=['POST'])
def cal_repayment():
    """
        recalculate repayment schedule and APR
    """
    #TODO: discuss with frontend the format and needs
    input_json = request.get_json()
    input_form = input_json['input_form']
    user_change = input_json['user_change']

    try:
        apr, origin_matrix = cal_apr_helper(input_form)
        apr, recal_matrix = update_repayment_schedule(origin_matrix, user_change, input_form)
        matrix_list = []
        for a in recal_matrix:
            matrix_list.append(list(a))
        payload = {'apr': apr, 'recal_matrix': matrix_list}
        print(payload)

        return create_response(data=payload, status=200)
    except Exception as e:
        print(str(e))
        return create_response(message=str(e), status=400)

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
    themes = Theme.query.order_by(Theme.loan_theme).all()
    partners = Partner.query.order_by(Partner.partner_name).all()
    data = {'themes':[x.loan_theme for x in themes], 'partners':[x.partner_name for x in partners]}
    return create_response(data=data, status=200)



@app.route(SAVE_LOAN_URL, methods=['POST'])
def save_loan():
    """Save a new loan to the database, attempts to get all form data and use loan's __init__ to add"""
    request_json = request.get_json()
    try:
        # for input form
        input_form = request_json['inputs']
        newrow = {
            'partner_name' : request_json['partner_name'],
            'loan_theme' : request_json['loan_theme'],
            'product_type' : request_json['product_type'],
            'version_num' : int(input_form['version_num']),
            'nominal_apr' : float(input_form['nominal_apr']) / 100,
            'installment_time_period' : input_form['installment_time_period'],
            'repayment_type' : input_form['repayment_type'],
            'interest_time_period' : input_form['interest_time_period'],
            'interest_payment_type' : input_form['interest_payment_type'],
            'interest_calculation_type' : input_form['interest_calculation_type'],
            'loan_amount' : float(input_form['loan_amount']),
            'installment' : int(input_form['installment']),
            'nominal_interest_rate' : float(input_form['nominal_interest_rate']),
            'grace_period_principal' : int(input_form['grace_period_principal']),
            'grace_period_interest_pay' : int(input_form['grace_period_interest_pay']),
            'grace_period_interest_calculate' : int(input_form['grace_period_interest_calculate']),
            'grace_period_balloon' : int(input_form['grace_period_balloon']),
            'fee_percent_upfront' : float(input_form['fee_percent_upfront'])/100,
            'fee_percent_ongoing' : float(input_form['fee_percent_ongoing'])/100,
            'fee_fixed_upfront' : float(input_form['fee_fixed_upfront']),
            'fee_fixed_ongoing' : float(input_form['fee_fixed_ongoing']),
            'insurance_percent_upfront' : float(input_form['insurance_percent_upfront'])/100,
            'insurance_percent_ongoing' : float(input_form['insurance_percent_ongoing'])/100,
            'insurance_fixed_upfront' : float(input_form['insurance_fixed_upfront']),
            'insurance_fixed_ongoing' : float(input_form['insurance_fixed_ongoing']),
            'tax_percent_fees' : float(input_form['tax_percent_fees'])/100,
            'tax_percent_interest' : float(input_form['tax_percent_interest'])/100,
            'security_deposit_percent_upfront' : float(input_form['security_deposit_percent_upfront'])/100,
            'security_deposit_percent_ongoing' : float(input_form['security_deposit_percent_ongoing'])/100,
            'security_deposit_fixed_upfront' : float(input_form['security_deposit_fixed_upfront']),
            'security_deposit_fixed_ongoing' : float(input_form['security_deposit_fixed_ongoing']),
            'interest_paid_on_deposit_percent' : float(input_form['interest_paid_on_deposit_percent'])/100
        }

        # for repayment schedule
        partner_name = request_json['partner_name']
        loan_theme = request_json['loan_theme']
        product_type = request_json['product_type']
        version_num = request_json['version_num']
        origin_matrix = request_json['origin_matrix']
        user_change_matrix = request_json['user_change_matrix']
        recal_matrix = request_json['repay_matrix']

    except Exception as e:
        return create_response(status=422, message='missing compoonents for save new loan')

    try:
        # delete the previous repayment schedule, if any
        partner_id = Partner.query.filter_by(partner_name=partner_name).first().id
        theme_id = Theme.query.filter_by(loan_theme=loan_theme).first().id
        repay_id = str(partner_id) + "_" + str(theme_id) + "_" + str(product_type) + "_" + str(version_num)
        prev_repay = RepaymentSchedule.query.filter_by(id=repay_id).delete()

        # make new repayment schedule entries
        for col_idx in range(len(origin_matrix[0])):
            cur_origin_col = [a[col_idx] for a in origin_matrix]
            cur_user_change_col = [a[col_idx] for a in user_change_matrix]
            cur_recal_col = [a[col_idx] for a in recal_matrix]
            new_repay_row = {
                'id' : repay_id,
                'period_num' : int(cur_origin_col[PERIOD_IDX]),
                'payment_due_date' : datetime.datetime.strptime(cur_origin_col[DATE_IDX], '%d-%b-%Y'),
                'days' : int(cur_origin_col[DAY_IDX]),
                'amount_due' : float(cur_origin_col[PRINCIPAL_DISBURSED_IDX]),
                'principal_payment' : float(cur_origin_col[PRINCIPAL_PAID_IDX]),
                'interest' : float(cur_origin_col[INTEREST_PAID_IDX]),
                'fees' : float(cur_origin_col[FEES_IDX]),
                'insurance' : float(cur_origin_col[INSURANCE_IDX]),
                'taxes' : float(cur_origin_col[TAXES_IDX]),
                'security_deposit' : float(cur_origin_col[SECURITY_DEPOSIT_IDX]),
                'security_interest_paid' : float(cur_origin_col[SECURITY_DEPOSIT_INTEREST_PAID_IDX]),
                'balance' : float(cur_origin_col[BALANCE_IDX]),
                'deposit_balance' : float(cur_origin_col[SECURITY_DEPOSIT_BALANCE_IDX]),
                'deposit_withdrawal' : float(cur_origin_col[SECURITY_DEPOSIT_WITHDRAW_IDX]),
                'total_cashflow' : float(cur_origin_col[CASH_FLOW_IDX]),

                'period_num_user' : int(cur_user_change_col[PERIOD_IDX]) if
                    cur_user_change_col[PERIOD_IDX] is not None else None,
                'payment_due_date_user' : datetime.datetime.strptime(cur_user_change_col[DATE_IDX], '%d-%b-%Y') if
                    cur_user_change_col[DATE_IDX] is not None else None,
                'days_user' : int(cur_user_change_col[DAY_IDX]) if
                    cur_user_change_col[DAY_IDX] is not None else None,
                'amount_due_user' : float(cur_user_change_col[PRINCIPAL_DISBURSED_IDX]) if
                    cur_user_change_col[PRINCIPAL_DISBURSED_IDX] is not None else None,
                'principal_payment_user' : float(cur_user_change_col[PRINCIPAL_PAID_IDX]) if
                    cur_user_change_col[PRINCIPAL_PAID_IDX] is not None else None,
                'interest_user' : float(cur_user_change_col[INTEREST_PAID_IDX]) if
                    cur_user_change_col[INTEREST_PAID_IDX] is not None else None,
                'fees_user' : float(cur_user_change_col[FEES_IDX]) if
                    cur_user_change_col[FEES_IDX] is not None else None,
                'insurance_user' : float(cur_user_change_col[INSURANCE_IDX]) if
                    cur_user_change_col[INSURANCE_IDX] is not None else None,
                'taxes_user' : float(cur_user_change_col[TAXES_IDX]) if
                    cur_user_change_col[TAXES_IDX] is not None else None,
                'security_deposit_user' : float(cur_user_change_col[SECURITY_DEPOSIT_IDX]) if
                    cur_user_change_col[SECURITY_DEPOSIT_IDX] is not None else None,
                'security_interest_paid_user' : float(cur_user_change_col[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) if
                    cur_user_change_col[SECURITY_DEPOSIT_INTEREST_PAID_IDX] is not None else None,
                'balance_user' : float(cur_user_change_col[BALANCE_IDX]) if
                    cur_user_change_col[BALANCE_IDX] is not None else None,
                'deposit_balance_user' : float(cur_user_change_col[SECURITY_DEPOSIT_BALANCE_IDX]) if
                    cur_user_change_col[SECURITY_DEPOSIT_BALANCE_IDX] is not None else None,
                'deposit_withdrawal_user' : float(cur_user_change_col[SECURITY_DEPOSIT_WITHDRAW_IDX]) if
                    cur_user_change_col[SECURITY_DEPOSIT_WITHDRAW_IDX] is not None else None,
                'total_cashflow_user' : float(cur_user_change_col[CASH_FLOW_IDX]) if
                    cur_user_change_col[CASH_FLOW_IDX] is not None else None,

                'period_num_calc' : int(cur_recal_col[PERIOD_IDX]),
                'payment_due_date_calc' : datetime.datetime.strptime(cur_recal_col[DATE_IDX], '%d-%b-%Y'),
                'days_calc' : int(cur_recal_col[DAY_IDX]),
                'amount_due_calc' : float(cur_recal_col[PRINCIPAL_DISBURSED_IDX]),
                'principal_payment_calc' : float(cur_recal_col[PRINCIPAL_PAID_IDX]),
                'interest_calc' : float(cur_recal_col[INTEREST_PAID_IDX]),
                'fees_calc' : float(cur_recal_col[FEES_IDX]),
                'insurance_calc' : float(cur_recal_col[INSURANCE_IDX]),
                'taxes_calc' : float(cur_recal_col[TAXES_IDX]),
                'security_deposit_calc' : float(cur_recal_col[SECURITY_DEPOSIT_IDX]),
                'security_interest_paid_calc' : float(cur_recal_col[SECURITY_DEPOSIT_INTEREST_PAID_IDX]),
                'balance_calc' : float(cur_recal_col[BALANCE_IDX]),
                'deposit_balance_calc' : float(cur_recal_col[SECURITY_DEPOSIT_BALANCE_IDX]),
                'deposit_withdrawal_calc' : float(cur_recal_col[SECURITY_DEPOSIT_WITHDRAW_IDX]),
                'total_cashflow_calc' : float(cur_recal_col[CASH_FLOW_IDX])
            }
            repay_schedule = RepaymentSchedule(new_repay_row)
            db.session.add(repay_schedule)
        loan = Loan(newrow)
        old_loan = Loan.query.filter_by(id=repay_id).first()
        if old_loan != None:
            newrow['start_date'] = old_loan.start_date
            newrow['update_date'] = datetime.datetime.now()
            newrow['start_name'] = old_loan.start_name
            newrow['update_name'] = input_form['start_name']
        else:
            newrow['start_date'] = datetime.datetime.now()
            newrow['update_date'] = datetime.datetime.now()
            newrow['start_name'] = input_form['start_name']
            newrow['update_name'] = input_form['start_name']
        Loan.query.filter_by(id=repay_id).delete()
        db.session.add(Loan(newrow))
        db.session.commit()
        return create_response(status=201)
    except Exception as ex:
        print(str(ex))
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
    """
        returns a list of all MFI
    """
    partners = Partner.query.filter_by(active=True).all()
    return create_response({'partners': [x.partner_name for x in partners]}, status=200)

@app.route(EDIT_MFI, methods=['PUT'])
def editMFI(partner_name):
    """
        edits partner name
    """
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
    """
        adds new partner
    """
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
    """
        Deletes partner (sets active to false)
    """
    partner = Partner.query.filter_by(partner_name=partner_name).first()
    if partner is None or partner.active is False:
        return create_response(status=422, message="No such MFI Partner currently exists")
    partner.active = False
    db.session.commit()
    return create_response(message="Update Successful")

@app.route(GET_ALL_LT, methods=['GET'])
def getAllLT():
    """
        Gets all loan themes
    """
    themes = Theme.query.filter_by(active=True).all()
    return create_response({'loan_theme': [x.loan_theme for x in themes]}, status=200)

@app.route(EDIT_LT, methods=['PUT'])
def editLT(loan_theme):
    """
        Edits loan theme name
    """
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
    """
        Adds new loan theme
    """
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
    """
        Deletes loan theme (sets active to false)
    """
    theme = Theme.query.filter_by(loan_theme=loan_theme).first()
    if theme is None or theme.active is False:
        return create_response(status=422, message="No such Loan Theme currently exists")
    theme.active = False
    db.session.commit()
    return create_response(message="Update Successful")

@app.route(FINDLOAN_GET_MFI_LIST)
def get_mfi_list():
    """ Get list of MFI partners that have loans in the database """
    # Get all unique partner ids from loan table
    partner_ids = db.session.query(Loan.partner_id).distinct()
    # Get corresponding partner names for each id
    partner_names = list()
    for id_value in partner_ids:
        partner_names.append(Partner.query.get(id_value))

    # Return list of names present in loan table
    data = {'partners' : [entry.partner_name for entry in partner_names]}
    return create_response(data = data, status = 200)

@app.route(FINDLOAN_GET_LOAN_ENTRY)
def get_loan_theme_entry():
    """ Get list of loan themes associated with a specific partner """
    try:
        # Get partner name from passed args
        mfi_name = request.args['partner_name']

        # Partner name unique, .first() should always return correct row
        partner_id = Partner.query.filter_by(partner_name = mfi_name).first().id

        # Get all loan themes with RETURNED PARTNER ID
        loan_list = set()
        for entry in Loan.query.filter_by(partner_id = partner_id).all():
            loan_list.add(Theme.query.filter_by(id = entry.theme_id).first())
        # Return list of loan themes under given mfi name
        data = {'themes' : [entry.loan_theme for entry in loan_list]}
        return create_response(data = data, status = 200)
    except:
        return create_response({}, status=400, message='missing arguments for GET')

@app.route(FINDLOAN_GET_PRODUCT_ENTRY)
def get_product_entry():
    """ Get list of product types associated with specific partner and theme """
    try:
        # Get partner name and loan theme from passed args
        mfi_name = request.args['partner_name']
        theme_name = request.args['loan_theme']

        # Get corresponding ids for partner and loan theme
        mfi_id = Partner.query.filter_by(partner_name = mfi_name).first().id
        theme_id = Theme.query.filter_by(loan_theme = theme_name).first().id

        # Get all product themes with RETURNED PARTER ID AND LOAN ID
        product_list = set()
        for entry in Loan.query.filter_by(partner_id = mfi_id, theme_id = theme_id).all():
            product_list.add(entry.product_type)

        # Return list of product types under given mfi name and theme id
        data = {'product_types' : [entry for entry in product_list]}
        return create_response(data = data, status = 200)
    except:
        return create_response({}, status=400, message='missing arguments for GET')

@app.route(FINDLOAN_GET_VERSION_LIST)
def get_version_list():
    """ Get list of version numbers associated with partner, theme, and product type """
    args = request.get_json()
    try:
        # Get all args from form
        partner_name = request.args['partner_name']
        theme_name = request.args['loan_theme']
        product_type = request.args['product_type']

        # Get corresponding ids
        mfi_id = Partner.query.filter_by(partner_name = partner_name).first().id
        theme_id = Theme.query.filter_by(loan_theme = theme_name).first().id

        # Get corresponding rows from RETURNED IDs and names
        version_list = list()
        for entry in Loan.query.filter_by(partner_id = mfi_id, theme_id = theme_id, product_type = product_type):
            version_list.append(entry.version_num)

        # Return list of version nums under given mfi name, theme id, product type
        data = {'version_nums' : [str(num) for num in version_list]}
        return create_response(data = data, status = 200)
    except:
        return create_response({}, status=400, message='missing arguments for GET')

@app.route(FINDLOAN_GET_LOAN_DATA)
def get_loan():
    """ Get all data from given partner, theme, product_type, and version number """
    args = request.get_json()
    try:
        # Get all args from form
        partner_name = request.args['partner_name']
        theme_name = request.args['loan_theme']
        product_type = request.args['product_type']
        version = request.args['version_num']

        # Get corresponding ids
        mfi_id = Partner.query.filter_by(partner_name = partner_name).first().id
        theme_id = Theme.query.filter_by(loan_theme = theme_name).first().id

        # Get corresponding row from RETURNED IDs and names & return data
        id_string = "" + str(mfi_id) + "_" + str(theme_id) + "_" + product_type + "_" + str(version)
        entry = Loan.query.get(id_string)
        try:
            rows = RepaymentSchedule.query.filter_by(id = id_string).all()
        except:
            data = {
                'partner' : partner_name,
                'loan_theme' : theme_name,
                'product_type' : entry.product_type,
                'version_num' : entry.version_num,
                'start_date' : entry.start_date,
                'update_date' : entry.update_date,
                'start_name' : entry.start_name,
                'update_name' : entry.update_name,
                'nominal_apr' : entry.nominal_apr,
                'installment_time_period' : entry.installment_time_period,
                'repayment_type' : entry.repayment_type,
                'interest_time_period' : entry.interest_time_period,
                'interest_payment_type' : entry.interest_payment_type,
                'interest_calculation_type' : entry.interest_calculation_type,
                'loan_amount' : entry.loan_amount,
                'installment' : entry.installment,
                'nominal_interest_rate' : entry.nominal_interest_rate,
                'grace_period_principal' : entry.grace_period_principal,
                'grace_period_interest_pay' : entry.grace_period_interest_pay,
                'grace_period_interest_calculate' : entry.grace_period_interest_calculate,
                'grace_period_balloon' : entry.grace_period_balloon,
                'fee_percent_upfront' : entry.fee_percent_upfront * 100,
                'fee_percent_ongoing' : entry.fee_percent_ongoing * 100,
                'fee_fixed_upfront' : entry.fee_fixed_upfront,
                'fee_fixed_ongoing' : entry.fee_fixed_ongoing,
                'insurance_percent_upfront' : entry.insurance_percent_upfront * 100,
                'insurance_percent_ongoing' : entry.insurance_percent_ongoing * 100,
                'insurance_fixed_upfront' : entry.insurance_fixed_upfront,
                'insurance_fixed_ongoing' : entry.insurance_fixed_ongoing,
                'tax_percent_fees' : entry.tax_percent_fees * 100,
                'tax_percent_interest' : entry.tax_percent_interest * 100,
                'security_deposit_percent_upfront' : entry.security_deposit_percent_upfront * 100,
                'security_deposit_percent_ongoing' : entry.security_deposit_percent_ongoing * 100,
                'security_deposit_fixed_upfront' : entry.security_deposit_fixed_upfront,
                'security_deposit_fixed_ongoing' : entry.security_deposit_fixed_ongoing,
                'interest_paid_on_deposit_percent' : entry.interest_paid_on_deposit_percent * 100,
                'original_matrix' : None,
                'user_matrix' : None,
                'calc_matrix' : None
            }
            return create_response(data = data, status = 200)
        sorted_rows = sorted(rows, key=lambda x: x.period_num)
        orig_matrix = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        user_matrix = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        calc_matrix = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        for row in sorted_rows:
            orig_matrix[0].append(row.period_num)
            user_matrix[0].append(row.period_num)
            calc_matrix[0].append(row.period_num)

            orig_matrix[1].append('{0}-{1}-{2}'.format(row.payment_due_date.day, month_num_to_str_dict[row.payment_due_date.month], row.payment_due_date.year))
            if row.payment_due_date_user != None:
                user_matrix[1].append('{0}-{1}-{2}'.format(row.payment_due_date_user.day, month_num_to_str_dict[row.payment_due_date_user.month], row.payment_due_date_user.year))
            else:
                user_matrix[1].append(None)
            calc_matrix[1].append('{0}-{1}-{2}'.format(row.payment_due_date_calc.day, month_num_to_str_dict[row.payment_due_date_calc.month], row.payment_due_date_calc.year))

            orig_matrix[2].append(row.days)
            user_matrix[2].append(row.days_user)
            calc_matrix[2].append(row.days_calc)

            orig_matrix[3].append(row.amount_due)
            user_matrix[3].append(row.amount_due_user)
            calc_matrix[3].append(row.amount_due_calc)

            orig_matrix[4].append(row.principal_payment)
            user_matrix[4].append(row.principal_payment_user)
            calc_matrix[4].append(row.principal_payment_calc)

            orig_matrix[5].append(row.balance)
            user_matrix[5].append(row.balance_user)
            calc_matrix[5].append(row.balance_calc)

            orig_matrix[6].append(row.interest)
            user_matrix[6].append(row.interest_user)
            calc_matrix[6].append(row.interest_calc)

            orig_matrix[7].append(row.fees)
            user_matrix[7].append(row.fees_user)
            calc_matrix[7].append(row.fees_calc)

            orig_matrix[8].append(row.insurance)
            user_matrix[8].append(row.insurance_user)
            calc_matrix[8].append(row.insurance_calc)

            orig_matrix[9].append(row.taxes)
            user_matrix[9].append(row.taxes_user)
            calc_matrix[9].append(row.taxes_calc)

            orig_matrix[10].append(row.security_deposit)
            user_matrix[10].append(row.security_deposit_user)
            calc_matrix[10].append(row.security_deposit_calc)

            orig_matrix[11].append(row.security_interest_paid)
            user_matrix[11].append(row.security_interest_paid_user)
            calc_matrix[11].append(row.security_interest_paid_calc)

            orig_matrix[12].append(row.deposit_withdrawal)
            user_matrix[12].append(row.deposit_withdrawal_user)
            calc_matrix[12].append(row.deposit_withdrawal_calc)

            orig_matrix[13].append(row.deposit_balance)
            user_matrix[13].append(row.deposit_balance_user)
            calc_matrix[13].append(row.deposit_balance_calc)

            orig_matrix[14].append(row.total_cashflow)
            user_matrix[14].append(row.total_cashflow_user)
            calc_matrix[14].append(row.total_cashflow_calc)
        data = {
            'partner' : partner_name,
            'loan_theme' : theme_name,
            'product_type' : entry.product_type,
            'version_num' : entry.version_num,
            'start_date' : entry.start_date,
            'update_date' : entry.update_date,
            'start_name' : entry.start_name,
            'update_name' : entry.update_name,
            'nominal_apr' : entry.nominal_apr*100,
            'installment_time_period' : entry.installment_time_period,
            'repayment_type' : entry.repayment_type,
            'interest_time_period' : entry.interest_time_period,
            'interest_payment_type' : entry.interest_payment_type,
            'interest_calculation_type' : entry.interest_calculation_type,
            'loan_amount' : entry.loan_amount,
            'installment' : entry.installment,
            'nominal_interest_rate' : entry.nominal_interest_rate,
            'grace_period_principal' : entry.grace_period_principal,
            'grace_period_interest_pay' : entry.grace_period_interest_pay,
            'grace_period_interest_calculate' : entry.grace_period_interest_calculate,
            'grace_period_balloon' : entry.grace_period_balloon,
            'fee_percent_upfront' : entry.fee_percent_upfront * 100,
            'fee_percent_ongoing' : entry.fee_percent_ongoing * 100,
            'fee_fixed_upfront' : entry.fee_fixed_upfront,
            'fee_fixed_ongoing' : entry.fee_fixed_ongoing,
            'insurance_percent_upfront' : entry.insurance_percent_upfront * 100,
            'insurance_percent_ongoing' : entry.insurance_percent_ongoing * 100,
            'insurance_fixed_upfront' : entry.insurance_fixed_upfront,
            'insurance_fixed_ongoing' : entry.insurance_fixed_ongoing,
            'tax_percent_fees' : entry.tax_percent_fees * 100,
            'tax_percent_interest' : entry.tax_percent_interest * 100,
            'security_deposit_percent_upfront' : entry.security_deposit_percent_upfront * 100,
            'security_deposit_percent_ongoing' : entry.security_deposit_percent_ongoing * 100,
            'security_deposit_fixed_upfront' : entry.security_deposit_fixed_upfront,
            'security_deposit_fixed_ongoing' : entry.security_deposit_fixed_ongoing,
            'interest_paid_on_deposit_percent' : entry.interest_paid_on_deposit_percent * 100,
            'original_matrix' : orig_matrix,
            'user_matrix' : user_matrix,
            'calc_matrix' : calc_matrix
        }
        return create_response(data = data, status = 200)
    except Exception as e:
        return create_response({}, status=400, message=str(e))

