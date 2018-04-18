import json
from flask import jsonify
import numpy as np
import datetime
from calendar import monthrange
import calendar

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
CASH_FLOW_IDX = -1
days_dict = {'days':1, 'weeks':7, 'two-weeks':14, '15 days':15, '4 weeks': 28}
month_num_to_str_dict = {1:'Jan', 2: 'Feb', 3: 'Mar', 4:'Apr', 5:'May', 6:'Jun', 7:'Jul', 8:'Aug', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dec'}

def create_response(data={}, status=200, message=''):
    """
    Wraps response in a consistent format throughout the API
    Format inspired by https://medium.com/@shazow/how-i-design-json-api-responses-71900f00f2db
    Modifications included:
    - make success a boolean since there's only 2 values
    - make message a single string since we will only use one message per response

    IMPORTANT: data must be a dictionary where:
    - the key is the name of the type of data
    - the value is the data itself
    """
    response = {
        'success': 200 <= status < 300,
        'code': status,
        'message': message,
        'result': data
    }
    return jsonify(response), status


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def round_float(f, n):
    return np.floor(f * 10 ** n + 0.5) / 10**n

#TODO: add rounding before json
#TODO: add commits

def cal_apr_helper(input_json):
    try:
        installment_time_period = input_json['installment_time_period']
        repayment_type = input_json['repayment_type']
        interest_time_period = input_json['interest_time_period']
        interest_payment_type = input_json['interest_payment_type']
        interest_calculation_type = input_json['interest_calculation_type']
        loan_amount = float(input_json['loan_amount'])
        installment = int(input_json['installment'])
        nominal_interest_rate = float(input_json['nominal_interest_rate']) / 100
        grace_period_principal = int(input_json['grace_period_principal'])
        grace_period_interest_pay = int(input_json['grace_period_interest_pay'])
        grace_period_interest_calculate = int(input_json['grace_period_interest_calculate'])
        grace_period_balloon = int(input_json['grace_period_balloon'])
        fee_percent_upfront = float(input_json['fee_percent_upfront']) / 100
        fee_percent_ongoing = float(input_json['fee_percent_ongoing']) / 100
        fee_fixed_upfront = float(input_json['fee_fixed_upfront'])
        fee_fixed_ongoing = float(input_json['fee_fixed_ongoing'])
        insurance_percent_upfront = float(input_json['insurance_percent_upfront']) / 100
        insurance_percent_ongoing = float(input_json['insurance_percent_ongoing']) / 100
        insurance_fixed_upfront = float(input_json['insurance_fixed_upfront'])
        insurance_fixed_ongoing  = float(input_json['insurance_fixed_ongoing'])
        tax_percent_fees = float(input_json['tax_percent_fees']) / 100
        tax_percent_interest = float(input_json['tax_percent_interest']) / 100
        security_deposit_percent_upfront = float(input_json['security_deposit_percent_upfront'])/ 100
        security_deposit_percent_ongoing = float(input_json['security_deposit_percent_ongoing'])/ 100
        security_deposit_fixed_upfront = float(input_json['security_deposit_fixed_upfront'])
        security_deposit_fixed_ongoing = float(input_json['security_deposit_fixed_ongoing'])
        interest_paid_on_deposit_percent = float(input_json['interest_paid_on_deposit_percent'])/ 100
        installments_period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
        interest_period_dict = {'day':0, 'week':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'month':5, 'quarter':6, 'half-year':7, 'year':8}
        periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])

        installments_arr = 1/ (periods_per_year / 12)
        nominal_arr = 1 / installments_arr
        scaled_interest = nominal_interest_rate*installments_arr[installments_period_dict[installment_time_period]] * nominal_arr[interest_period_dict[interest_time_period]]
        # scaled_interest = round_float(scaled_interest, 4)
        # amortization
        monthly_payment = loan_amount / (((1+scaled_interest)**(installment- grace_period_principal) -1) / (scaled_interest * (1+scaled_interest)**(installment- grace_period_principal)))
        # monthly_payment = round_float(monthly_payment, 2)
        principal_paid_arr = np.zeros(installment + 1)
        balance_arr = np.zeros(installment+1)
        interest_paid_arr = np.zeros(installment+1)

        balance_arr[0] = loan_amount

        # test 1 installment
        if repayment_type == 'single end-term principal payment':
            principal_paid_arr[-1] = loan_amount

        for idx in range(1, len(balance_arr)):
            interest_paid_arr[idx] = balance_arr[idx-1] * scaled_interest
            if idx > grace_period_principal:
                if repayment_type == 'equal installments (amortized)':
                    balance_arr[idx] = balance_arr[idx-1] - (monthly_payment - balance_arr[idx-1] * scaled_interest)
                elif repayment_type == 'equal principal payments':
                    balance_arr[idx] = balance_arr[idx-1] - loan_amount / (installment - grace_period_principal)
                elif repayment_type == 'single end-term principal payment':
                    balance_arr[idx] = loan_amount
                else:
                    print('impossible repayment_type')
                    exit(1)


                if repayment_type == 'equal installments (amortized)':
                    principal_paid_arr[idx] = monthly_payment - interest_paid_arr[idx]
                elif repayment_type == 'equal principal payments':
                    principal_paid_arr[idx] = loan_amount / (installment - grace_period_principal)
            else:
                balance_arr[idx] = loan_amount

        if repayment_type == 'single end-term principal payment':
            balance_arr[-1] = 0
            principal_paid_arr[-1] = loan_amount

        if interest_calculation_type == 'initial amount or flat':
            interest_paid_arr[1:] = balance_arr[0] * scaled_interest

        # for grace period interest calculation
        for idx in range(1, grace_period_interest_calculate+1):
            interest_paid_arr[idx] = 0

        #  for grace period interest payment
        for idx in range(1, grace_period_interest_pay+1):
            interest_paid_arr[grace_period_interest_pay+1] += interest_paid_arr[idx]
            interest_paid_arr[idx] = 0

        # for grace ballon
        for idx in range(len(balance_arr)-grace_period_balloon, len(balance_arr)):
            principal_paid_arr[len(balance_arr) - grace_period_balloon-1] += principal_paid_arr[idx]
            principal_paid_arr[idx] = 0
            balance_arr[idx] = 0
            interest_paid_arr[idx] = 0
        balance_arr[len(balance_arr) - grace_period_balloon-1] = 0

        # for interst payment type
        if interest_payment_type == 'single end-term payment':
            interest_paid_arr[-1] = sum(interest_paid_arr)
            for idx in range(len(interest_paid_arr)-1):
                interest_paid_arr[idx] = 0


        fees_paid= np.zeros(installment + 1)
        fees_paid[0] = fee_percent_upfront * balance_arr[0] + fee_fixed_upfront
        fees_paid[1:] = principal_paid_arr[1:] * fee_percent_ongoing + fee_fixed_ongoing
        for idx in range(len(balance_arr)-grace_period_balloon, len(balance_arr)):
            fees_paid[idx] -= fee_fixed_ongoing
        # fees_paid = np.array([round_float(x, 2) for x in fees_paid])

        insurance_paid= np.zeros(installment + 1)
        insurance_paid[0] = insurance_percent_upfront * balance_arr[0] + insurance_fixed_upfront
        insurance_paid[1:] = balance_arr[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
        insurance_paid[-1] = 0
        for idx in range(len(balance_arr)-grace_period_balloon-1, len(balance_arr)-1):
            insurance_paid[idx] -= insurance_fixed_ongoing
        # insurance_paid = np.array([round_float(x, 2) for x in insurance_paid])

        security_deposit = np.zeros(installment + 1)
        security_deposit[0] = security_deposit_percent_upfront * balance_arr[0] + security_deposit_fixed_upfront
        security_deposit[1:] = principal_paid_arr[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
        for idx in range(len(balance_arr)-grace_period_balloon-1, len(balance_arr)):
            security_deposit[idx] -= security_deposit_fixed_ongoing


        security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[installments_period_dict[installment_time_period]]
        security_deposit_interest_paid = np.zeros(installment + 1)

        ##### below line changed from len(security_deposit) to len(security_deposit)-grace_period_balloon
        for idx in range(1, len(security_deposit)-grace_period_balloon):
            security_deposit_interest_paid[idx] = (np.sum(security_deposit[:idx]) + np.sum(security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest

        # security_deposit = np.array([round_float(x, 2) for x in security_deposit])

        taxes_on_fee = fees_paid * tax_percent_fees
        # taxes_on_fee = np.array([round_float(x, 2) for x in taxes_on_fee])
        taxes_on_interest = interest_paid_arr * tax_percent_interest
        # taxes_on_interest = np.array([round_float(x, 2) for x in taxes_on_interest])
        taxes = taxes_on_fee + taxes_on_interest

        result = np.zeros(installment + 1)
        result[0] = loan_amount

        result += -1 * (fees_paid + insurance_paid + taxes + interest_paid_arr + principal_paid_arr + security_deposit) 


        #### below is experimental
        if grace_period_balloon != 0:
            for idx in range(len(result)-grace_period_balloon, len(result)):
                result[idx] = 0
        #### above is experimental
        result[-grace_period_balloon-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
        # result_for_cal[-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)

        # build the repayment schedule matrix
        start_day = 1
        start_month = 1
        start_year = 2012
        schedule_matrix = []
        period_arr = list(range(installment+1))
        schedule_matrix.append(period_arr)
        date_arr, days_arr = calc_origin_days(start_day, start_month, start_year, installment_time_period, installment)
        schedule_matrix.append(list(date_arr))
        schedule_matrix.append(list(days_arr))
        amount_due = np.zeros(installment+1)
        amount_due[0] = loan_amount
        schedule_matrix.append(list(amount_due))
        schedule_matrix.append(list(principal_paid_arr))
        schedule_matrix.append(list(balance_arr))
        schedule_matrix.append(list(interest_paid_arr))
        schedule_matrix.append(list(fees_paid))
        schedule_matrix.append(list(insurance_paid))
        schedule_matrix.append(list(taxes))
        schedule_matrix.append(list(security_deposit))
        schedule_matrix.append(list(security_deposit_interest_paid))
        deposite_withdraw = np.zeros(installment+1)
        deposite_withdraw[-1] = np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
        schedule_matrix.append(list(deposite_withdraw))
        security_deposit_balance = np.zeros(installment+1)
        for idx in range(len(security_deposit_balance)-grace_period_balloon):
            security_deposit_balance[idx] = np.sum(security_deposit[:idx+1]) + np.sum(security_deposit_interest_paid[:idx+1])
        security_deposit_balance[-1] = 0
        schedule_matrix.append(list(security_deposit_balance))
        schedule_matrix.append(list(result))

        return round_float(np.irr(result) * periods_per_year[installments_period_dict[installment_time_period]] * 100,2), schedule_matrix

    except:
        #TODO status code not sure
        return None

#  helper function for calculate the number of days in the specified period
def get_num_days_to_incre(period, prev_date):
    if period == 'months':
        return monthrange(prev_date.year, prev_date.month)[1]
    elif period == 'quarters':
        days_aggreg = 0
        for idx in range(3):
            days_aggreg += monthrange(prev_date.year, prev_date.month)[1]
            # update the prev_date forward by one month
            prev_date += datetime.timedelta(days=get_num_days_to_incre('months', prev_date))
        return days_aggreg
    elif period == 'half-years':
        days_aggreg = 0
        for idx in range(6):
            days_aggreg += monthrange(prev_date.year, prev_date.month)[1]
            # update the prev_date forward by one month
            prev_date += datetime.timedelta(days=get_num_days_to_incre('months', prev_date))
        return days_aggreg

    elif period == 'years':
        if calendar.isleap(prev_date.year):
            return 366
        else:
            return 365
    else:
        return days_dict[period]

# calculate the days column on repayment schedule when directed from input form
def calc_origin_days(day, month, year, installment_time_period, num_installment):
    date_arr = []
    day_num_arr = []
    start_date = datetime.datetime(year=year, month=month, day=day)
    prev_date = start_date
    day_num_arr.append(0)
    start_date_str = '{0}-{1}-{2}'.format(start_date.day, month_num_to_str_dict[start_date.month], start_date.year)
    date_arr.append(start_date_str)

    for idx in range(num_installment):
        days_to_incre = get_num_days_to_incre(installment_time_period, prev_date)
        new_date = prev_date + datetime.timedelta(days=days_to_incre)
        new_date_str = '{0}-{1}-{2}'.format(new_date.day, month_num_to_str_dict[new_date.month], new_date.year)
        date_arr.append(new_date_str)
        day_num_arr.append(days_to_incre)
        prev_date = new_date
    return date_arr, day_num_arr

#######
# Below are functions for repayment schedule change
#######

# recalculate the days column on repayment schedule 

def on_principal_change(origin_matrix, changes_on_principal, grace_period_balloon):
    aggreg = 0
    new_principal_paid = origin_matrix[PRINCIPAL_PAID_IDX]
    # populate the previous changes except the last row
    for idx in range(1,len(origin_matrix[0])-grace_period_balloon-1):
        #  amount the override exceeds the origin_matrix value
        if changes_on_principal[idx] != None:
            aggreg += changes_on_principal[idx] - new_principal_paid[idx]
            new_principal_paid[idx] = changes_on_principal[idx]
    
    # check if user has changed the last row of principal paid column
    if changes_on_principal[-1-grace_period_balloon] != None:
        new_principal_paid[-1-grace_period_balloon] = changes_on_principal[-1-grace_period_balloon]
    else:
        new_principal_paid[-1-grace_period_balloon] -= aggreg
    return new_principal_paid

def update_balance(origin_matrix):

    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    new_balance = np.zeros(len(origin_matrix[0]))
    new_balance[0] = origin_matrix[BALANCE_IDX][0]
    for idx in range(1,len(origin_matrix[0])):
        new_balance[idx] = new_balance[idx-1] - principal[idx]

        # when there is ballon number, the last #balloon cells should be zero
        # however, due two floating point subtraction, this will not be exactly zero. So force it.
        if new_balance[idx] < 0.01 and new_balance[idx] > 0:
            new_balance[idx] = 0
    return new_balance

def update_fees(origin_matrix, fee_percent_ongoing, fee_fixed_ongoing):
    balance_upfront = origin_matrix[BALANCE_IDX][0]
    new_fees = np.zeros(len(origin_matrix[0]))
    new_fees[0] = origin_matrix[FEES_IDX][0]
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    for idx in range(1, len(origin_matrix[0])):
        # deal with balloon
        if principal[idx] == 0:
            new_fees[idx] = 0
        else:
            new_fees[idx] = principal[idx] * fee_percent_ongoing + fee_fixed_ongoing
    return new_fees

def update_security_deposit(origin_matrix, security_deposit_percent_ongoing, security_deposit_fixed_ongoing, security_deposit_scaled_interest, grace_period_balloon):
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    new_security_deposit = np.zeros(len(origin_matrix[0]))
    new_security_deposit[0] = origin_matrix[SECURITY_DEPOSIT_IDX][0]
    new_security_deposit_interest_paid = np.zeros(len(origin_matrix[0]))

    new_security_deposit[1:] = principal[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
    for idx in range(len(origin_matrix[0])-grace_period_balloon-1, len(origin_matrix[0])):
        new_security_deposit[idx] -= security_deposit_fixed_ongoing

    for idx in range(1, len(origin_matrix[0])- grace_period_balloon):
        new_security_deposit_interest_paid[idx] = (np.sum(new_security_deposit[:idx]) + np.sum(new_security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest
    return new_security_deposit, new_security_deposit_interest_paid

def update_security_deposit_balance(origin_matrix, grace_period_balloon):
    new_security_deposit = origin_matrix[SECURITY_DEPOSIT_IDX]
    new_security_deposit_interest_paid = origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]
    new_security_deposit_balance = np.zeros(len(new_security_deposit))
    new_security_deposit_balance[0] = new_security_deposit[0]
    for idx in range(len(new_security_deposit_balance)-grace_period_balloon):
        new_security_deposit_balance[idx] = np.sum(new_security_deposit[:idx+1]) + np.sum(new_security_deposit_interest_paid[:idx+1])
    return new_security_deposit_balance

def update_security_deposit_withdraw(origin_matrix, grace_period_balloon):
    new_security_deposit_withdraw = np.zeros(len(origin_matrix[0]))
    new_security_deposit_withdraw[-1-grace_period_balloon] = np.sum(origin_matrix[SECURITY_DEPOSIT_IDX]) + np.sum(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX])
    return new_security_deposit_withdraw

def update_insurance(origin_matrix, insurance_percent_ongoing, insurance_fixed_ongoing, grace_period_balloon):
    balance = origin_matrix[BALANCE_IDX]
    new_insurance_paid= np.zeros(len(origin_matrix[0]))
    new_insurance_paid[0] = origin_matrix[INSURANCE_IDX][0]
    new_insurance_paid[1:] = balance[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
    new_insurance_paid[-1] = 0
    for idx in range(len(origin_matrix[0])-grace_period_balloon-1, len(origin_matrix[0])-1):
        new_insurance_paid[idx] -= insurance_fixed_ongoing
    return new_insurance_paid


def update_interest(origin_matrix, interest_calculation_type, scaled_interest, grace_period_interest_calculate, grace_period_interest_pay, grace_period_balloon):
    balance = origin_matrix[BALANCE_IDX]
    new_interest_paid_arr = np.zeros(len(origin_matrix[0]))

    for idx in range(1, len(balance)):
        new_interest_paid_arr[idx] = balance[idx-1] * scaled_interest

    if interest_calculation_type == 'initial amount or flat':
        new_interest_paid_arr[1:] = balance[0] * scaled_interest 

    # for grace period interest calculation
    for idx in range(1, grace_period_interest_calculate+1):
        new_interest_paid_arr[idx] = 0

    #  for grace period interest payment
    for idx in range(1, grace_period_interest_pay+1):
        new_interest_paid_arr[grace_period_interest_pay+1] += new_interest_paid_arr[idx]
        new_interest_paid_arr[idx] = 0

    # for grace ballon
    for idx in range(len(balance)-grace_period_balloon, len(balance)):
        new_interest_paid_arr[idx] = 0
    return new_interest_paid_arr

def update_taxes(origin_matrix, tax_percent_fees, tax_percent_interest):
    new_taxes = np.zeros(len(origin_matrix[0]))
    fees_paid = origin_matrix[FEES_IDX]
    interest_paid_arr = origin_matrix[INTEREST_PAID_IDX]
    taxes_on_fee = fees_paid * tax_percent_fees
    taxes_on_interest = interest_paid_arr * tax_percent_interest
    new_taxes = taxes_on_fee + taxes_on_interest
    return new_taxes

def update_cash_flow(origin_matrix):
    return origin_matrix[PRINCIPAL_DISBURSED_IDX] \
    - origin_matrix[PRINCIPAL_PAID_IDX] \
    - origin_matrix[INTEREST_PAID_IDX] \
    - origin_matrix[INSURANCE_IDX] \
    - origin_matrix[FEES_IDX] \
    - origin_matrix[TAXES_IDX] \
    - origin_matrix[SECURITY_DEPOSIT_IDX] \
    + origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]

def on_fees_change(origin_matrix, changes_on_fees):
    new_fees = origin_matrix[FEES_IDX]
    for idx in range(len(origin_matrix[0])):
        if changes_on_fees[idx] != None:
            new_fees[idx] = changes_on_fees[idx]
    return new_fees

def on_taxes_change(origin_matrix, changes_on_taxes):
    new_taxes = origin_matrix[TAXES_IDX]
    for idx in range(len(origin_matrix[0])):
        if changes_on_taxes[idx] != None:
            new_taxes[idx] = changes_on_taxes[idx]
    return new_taxes

def on_insurance_change(origin_matrix, changes_on_insurance):
    new_insurance = origin_matrix[INSURANCE_IDX]
    for idx in range(len(origin_matrix[0])):
        if changes_on_insurance[idx] != None:
            new_insurance[idx] = changes_on_insurance[idx]
    return new_insurance

def on_interest_change(origin_matrix, changes_on_interest, grace_period_balloon):
    new_interest = origin_matrix[INTEREST_PAID_IDX]
    for idx in range(len(new_interest)):
        if changes_on_interest[idx] != None:
            # check if the change is made on last row
            if idx != len(new_interest)-1-grace_period_balloon:
                new_interest[idx+1] += new_interest[idx] - changes_on_interest[idx]
            
            new_interest[idx] = changes_on_interest[idx]
    return new_interest

def on_security_deposite_change(origin_matrix, changes_on_deposite, security_deposit_scaled_interest, grace_period_balloon):
    new_security_deposit = origin_matrix[SECURITY_DEPOSIT_IDX]
    for idx in range(len(new_security_deposit)):
        if changes_on_deposite[idx] != None:
            new_security_deposit[idx] = changes_on_deposite[idx]
    new_security_deposit_interest_paid = np.zeros(len(origin_matrix[0]))

    for idx in range(1, len(new_security_deposit)-grace_period_balloon):
        new_security_deposit_interest_paid[idx] = (np.sum(new_security_deposit[:idx]) + np.sum(new_security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest
    return new_security_deposit, new_security_deposit_interest_paid

def get_num_days_to_incre(period, prev_date):
    if period == 'months':
        return monthrange(prev_date.year, prev_date.month)[1]
    elif period == 'quarters':
        days_aggreg = 0
        for idx in range(3):
            days_aggreg += monthrange(prev_date.year, prev_date.month)[1]
            # update the prev_date forward by one month
            prev_date += datetime.timedelta(days=get_num_days_to_incre('months', prev_date))
        return days_aggreg
    elif period == 'half-years':
        days_aggreg = 0
        for idx in range(6):
            days_aggreg += monthrange(prev_date.year, prev_date.month)[1]
            # update the prev_date forward by one month
            prev_date += datetime.timedelta(days=get_num_days_to_incre('months', prev_date))
        return days_aggreg

    elif period == 'years':
        if calendar.isleap(prev_date.year):
            return 366
        else:
            return 365
    else:
        return days_dict[period]

def on_days_change(origin_matrix, changes_on_days, changes_on_date, installment_time_period):

    new_date_arr = []
    new_day_num_arr = []
    date_col = origin_matrix[DATE_IDX]
    day_col = origin_matrix[DAY_IDX]
    start_date = datetime.datetime.strptime(date_col[0], '%d-%b-%Y')
    prev_date = start_date
    new_date_arr.append(date_col[0])
    new_day_num_arr.append(0)
    for idx in range(1,len(date_col)):
        if changes_on_date[idx] != None:
            days_to_incre = (datetime.datetime.strptime(changes_on_date[idx], '%d-%b-%Y') - prev_date).days
        elif changes_on_days[idx] != None:
            days_to_incre = changes_on_days[idx]
        else:
            days_to_incre = get_num_days_to_incre(installment_time_period, prev_date)

        new_date = prev_date + datetime.timedelta(days=days_to_incre)
        new_date_str = '{0}-{1}-{2}'.format(new_date.day, month_num_to_str_dict[new_date.month], new_date.year)
        new_date_arr.append(new_date_str)
        new_day_num_arr.append(days_to_incre)
        prev_date = new_date

    return new_date_arr, new_day_num_arr


def cal_scaled_interest(nominal_interest_rate, installment_time_period, interest_time_period, interest_paid_on_deposit_percent):

    periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])
    installments_period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
    interest_period_dict = {'day':0, 'week':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'month':5, 'quarter':6, 'half-year':7, 'year':8}

    installments_arr = 1/ (periods_per_year / 12)
    nominal_arr = 1 / installments_arr

    scaled_interest = nominal_interest_rate*installments_arr[installments_period_dict[installment_time_period]] * nominal_arr[interest_period_dict[interest_time_period]]
    security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[installments_period_dict[installment_time_period]]
    return scaled_interest, security_deposit_scaled_interest

def update_repayment_schedule(origin_matrix, user_change, input_form):
    installment_time_period = input_form['installment_time_period']
    grace_period_balloon = input_form['grace_period_balloon']
    security_deposit_percent_ongoing = input_form['security_deposit_percent_ongoing']
    security_deposit_fixed_ongoing = input_form['security_deposit_fixed_ongoing']
    fee_percent_ongoing = input_form['fee_percent_ongoing']
    fee_fixed_ongoing = input_form['fee_percent_ongoing']
    insurance_fixed_ongoing = input_form['insurance_fixed_ongoing']
    insurance_percent_ongoing = input_form['insurance_percent_ongoing']
    interest_calculation_type = input_form['interest_calculation_type']
    grace_period_interest_calculate = input_form['grace_period_interest_calculate']
    grace_period_interest_pay = input_form['grace_period_interest_pay']
    tax_percent_fees = input_form['tax_percent_fees']
    tax_percent_interest = input_form['tax_percent_interest']

    nominal_interest_rate = input_form['nominal_interest_rate']
    interest_time_period = input_form['interest_time_period']
    interest_paid_on_deposit_percent = input_form['interest_paid_on_deposit_percent']

    scaled_interest, security_deposit_scaled_interest = cal_scaled_interest(nominal_interest_rate, installment_time_period, interest_time_period, interest_paid_on_deposit_percent)

    origin_matrix[DATE_IDX], origin_matrix[DAY_IDX] = on_days_change(origin_matrix, user_change[DAY_IDX], user_change[DATE_IDX], installment_time_period)
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], grace_period_balloon)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] =  update_security_deposit(origin_matrix, security_deposit_percent_ongoing, security_deposit_fixed_ongoing, security_deposit_scaled_interest, grace_period_balloon)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = on_security_deposite_change(origin_matrix, user_change[SECURITY_DEPOSIT_IDX], security_deposit_scaled_interest, grace_period_balloon)
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, fee_percent_ongoing, fee_fixed_ongoing)
    origin_matrix[FEES_IDX] = on_fees_change(origin_matrix, user_change[FEES_IDX])
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[INSURANCE_IDX] = update_insurance(origin_matrix, insurance_percent_ongoing, insurance_fixed_ongoing, grace_period_balloon)
    origin_matrix[INSURANCE_IDX] = on_insurance_change(origin_matrix, user_change[INSURANCE_IDX])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, interest_calculation_type, scaled_interest, grace_period_interest_calculate, grace_period_interest_pay, grace_period_balloon)
    origin_matrix[INTEREST_PAID_IDX] = on_interest_change(origin_matrix, user_change[INTEREST_PAID_IDX], grace_period_balloon)
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix, tax_percent_fees, tax_percent_interest)
    origin_matrix[TAXES_IDX] = on_taxes_change(origin_matrix, user_change[TAXES_IDX])
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix, grace_period_balloon)
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix, grace_period_balloon)
    origin_matrix[CASH_FLOW_IDX] = update_cash_flow(origin_matrix)

    fake_apr = 100
    return fake_apr, origin_matrix

