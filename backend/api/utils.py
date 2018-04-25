import json
from flask import jsonify
import numpy as np
import datetime
from calendar import monthrange
import calendar
# from api.util_xirr import *

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
    try: 
        ret = np.floor(f * 10 ** n + 0.5) / 10**n
        return ret
    except Exception as e: 
        print(e)
        print(f)
        return None

#TODO: add rounding before json
#TODO: add commits

def cal_apr_helper(input_json):
    try:
        # get input form variables used to calculate APR
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

        # used for getting num periods per year, 
        # the dict values correspondent to the idx of periods_per_year array
        installments_period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
        
        # used for getting frequency of how often the interest is calculated, 
        # the dict values correspondent to the idx of periods_per_year array
        interest_period_dict = {'day':0, 'week':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'month':5, 'quarter':6, 'half-year':7, 'year':8}
        periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])

        # scales interest to a monthly value
        installments_arr = 1/ (periods_per_year / 12)
        nominal_arr = 1 / installments_arr
        scaled_interest = nominal_interest_rate*installments_arr[installments_period_dict[installment_time_period]] * nominal_arr[interest_period_dict[interest_time_period]]
        
        # calculates the amortized total monthly payments
        monthly_payment = loan_amount / (((1+scaled_interest)**(installment- grace_period_principal) -1) / (scaled_interest * (1+scaled_interest)**(installment- grace_period_principal)))
        
        principal_paid_arr = np.zeros(installment + 1)
        interest_paid_arr = np.zeros(installment+1)
        balance_arr = np.zeros(installment+1)
        balance_arr[0] = loan_amount

        # single end-term principal payment means making the total principal payment at the end
        if repayment_type == 'single end-term principal payment':
            principal_paid_arr[-1] = loan_amount

        # standard amortization calculation for principal payments, interest payments, total balance
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

        # special conditions for principal calculation on 'single end-term principal payment'
        if repayment_type == 'single end-term principal payment':
            balance_arr[-1] = 0
            principal_paid_arr[-1] = loan_amount

        # special conditions for interest calculation on 'initial amount or flat'
        if interest_calculation_type == 'initial amount or flat':
            interest_paid_arr[1:] = balance_arr[0] * scaled_interest

        # for grace period interest calculation
        for idx in range(1, grace_period_interest_calculate+1):
            interest_paid_arr[idx] = 0

        #  for grace period interest payment
        for idx in range(1, grace_period_interest_pay+1):
            interest_paid_arr[grace_period_interest_pay+1] += interest_paid_arr[idx]
            interest_paid_arr[idx] = 0

        # for grace balloon
        for idx in range(len(balance_arr)-grace_period_balloon, len(balance_arr)):
            principal_paid_arr[len(balance_arr) - grace_period_balloon-1] += principal_paid_arr[idx]
            principal_paid_arr[idx] = 0
            balance_arr[idx] = 0
            interest_paid_arr[idx] = 0
        balance_arr[len(balance_arr) - grace_period_balloon-1] = 0

        # special conditions for interest calculation on 'single end-term payment'
        if interest_payment_type == 'single end-term payment':
            interest_paid_arr[-1] = sum(interest_paid_arr)
            for idx in range(len(interest_paid_arr)-1):
                interest_paid_arr[idx] = 0

        # calculate fees paid
        fees_paid= np.zeros(installment + 1)
        fees_paid[0] = fee_percent_upfront * balance_arr[0] + fee_fixed_upfront
        fees_paid[1:] = principal_paid_arr[1:] * fee_percent_ongoing + fee_fixed_ongoing
        for idx in range(len(balance_arr)-grace_period_balloon, len(balance_arr)):
            fees_paid[idx] -= fee_fixed_ongoing

        # calculate insurance paid
        insurance_paid= np.zeros(installment + 1)
        insurance_paid[0] = insurance_percent_upfront * balance_arr[0] + insurance_fixed_upfront
        insurance_paid[1:] = balance_arr[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
        insurance_paid[-1] = 0
        for idx in range(len(balance_arr)-grace_period_balloon-1, len(balance_arr)-1):
            insurance_paid[idx] -= insurance_fixed_ongoing

        # calculate security deposit
        security_deposit = np.zeros(installment + 1)
        security_deposit[0] = security_deposit_percent_upfront * balance_arr[0] + security_deposit_fixed_upfront
        security_deposit[1:] = principal_paid_arr[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
        for idx in range(len(balance_arr)-grace_period_balloon-1, len(balance_arr)):
            security_deposit[idx] -= security_deposit_fixed_ongoing

        # calculate interest paid on security deposit
        security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[installments_period_dict[installment_time_period]]
        security_deposit_interest_paid = np.zeros(installment + 1)
        for idx in range(1, len(security_deposit)-grace_period_balloon):
            security_deposit_interest_paid[idx] = (np.sum(security_deposit[:idx]) + np.sum(security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest

        # calculate taxes
        taxes_on_fee = fees_paid * tax_percent_fees
        taxes_on_interest = interest_paid_arr * tax_percent_interest
        taxes = taxes_on_fee + taxes_on_interest

        # calculate total cash flows
        result = np.zeros(installment + 1)
        result[0] = loan_amount
        result += -1 * (fees_paid + insurance_paid + taxes + interest_paid_arr + principal_paid_arr + security_deposit)
        # adjust for lump sum balloon payment in total cash flows
        if grace_period_balloon != 0:
            for idx in range(len(result)-grace_period_balloon, len(result)):
                result[idx] = 0
        # withdraw security deposit 
        result[-grace_period_balloon-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)

        # build the repayment schedule matrix
        start_day = 1
        start_month = 1
        start_year = 2012
        schedule_matrix = []
        period_arr = list(range(installment+1))
        schedule_matrix.append(period_arr)
        date_arr, days_arr = calc_origin_days(start_day, start_month, start_year, installment_time_period, installment)
        schedule_matrix.append(date_arr)
        schedule_matrix.append(days_arr)
        amount_due = np.zeros(installment+1)
        amount_due[0] = loan_amount
        schedule_matrix.append(amount_due)
        schedule_matrix.append(principal_paid_arr)
        schedule_matrix.append(balance_arr)
        schedule_matrix.append(interest_paid_arr)
        schedule_matrix.append(fees_paid)
        schedule_matrix.append(insurance_paid)
        schedule_matrix.append(taxes)
        schedule_matrix.append(security_deposit)
        schedule_matrix.append(security_deposit_interest_paid)
        deposite_withdraw = np.zeros(installment+1)
        deposite_withdraw[-1] = np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
        schedule_matrix.append(deposite_withdraw)
        security_deposit_balance = np.zeros(installment+1)
        for idx in range(len(security_deposit_balance)-grace_period_balloon):
            security_deposit_balance[idx] = np.sum(security_deposit[:idx+1]) + np.sum(security_deposit_interest_paid[:idx+1])
        security_deposit_balance[-1] = 0
        schedule_matrix.append(security_deposit_balance)
        schedule_matrix.append(result)
        for idx in range(len(schedule_matrix)):
            schedule_matrix[idx] = list(schedule_matrix[idx])
        return round_float(np.irr(result) * periods_per_year[installments_period_dict[installment_time_period]] * 100,2), schedule_matrix

    except:
        #TODO status code not sure
        return None

def get_num_days_to_incre(period, prev_date):
    """
    Helper function for calculating the number of days in the specified period based on previous date

    Args:
        period: the original matrix generated from user input
        prev_date: user changes on principal array, got from user change matrix

    Return: 
        int: number of days to increase based on the period option and the previous date
    """
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

def calc_origin_days(day, month, year, installment_time_period, num_installment):
    """
    calculate the 'days' column on repayment schedule when directed from input form

    Args: 
        day : the start day
        month: the start moonth
        year: the start year
        installment_time_period: installment time period in the input form
        num_installment: number of installments in the input form

    Return:
        1d array: the 'days' array
    """
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
# Below are functions for recalculating repayment schedule on change
#######
 
def on_principal_change(origin_matrix, changes_on_principal, grace_period_balloon):
    """
    Recalculate the principal column based on user changes on principal

    Args:
        origin_matrix: the original matrix generated from input form
        changes_on_principal: user changes on principal array, got from user change matrix
        grace_period_balloon: number of grace period balloon

    Return: 
        1d array: updated prinipal array
    """
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
    """
    Update the balance column based on updated principal

    Args:
        origin_matrix: the updated origin matrix

    Return:
        1d array: updated balance array
    """
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    new_balance = np.zeros(len(origin_matrix[0]))
    new_balance[0] = origin_matrix[BALANCE_IDX][0]
    for idx in range(1,len(origin_matrix[0])):
        new_balance[idx] = new_balance[idx-1] - principal[idx]

        # when there is a balloon payment, the last #balloon cells should be zero
        # however, due to floating point subtraction, this will not be exactly zero. So force it.
        if new_balance[idx] < 0.01 and new_balance[idx] > 0:
            new_balance[idx] = 0
    return new_balance

# update fees based on updated balance
def update_fees(origin_matrix, fee_percent_ongoing, fee_fixed_ongoing):
    """
    Update fees based on updated balance

    Args:
        origin_matrix: the updated origin matrix
        fee_percent_ongoing: fee_percent_ongoing in input form
        fee_fixed_ongoing: fee_fixed_ongoing in input form

    Return:
        1d array: updated balance array
    """
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
    """
    Update security deposit and security deposit interest paid array based on updated principal

    Args:
        origin_matrix: the updated origin matrix
        security_deposit_percent_ongoing: security_deposit_percent_ongoing in input form
        security_deposit_fixed_ongoing:security_deposit_fixed_ongoing in input form
        security_deposit_scaled_interest: security deposit interest rate scaled to selected installment time period
        grace_period_balloon: grace_period_balloon in input form

    Return:
        1d array: updated security deposit and security deposit interest paid array
    """
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
    """
    Update security deposit and security deposit interest paid array based on user change on security deposit

    Args:
        origin_matrix: the updated origin matrix
        grace_period_balloon: grace_period_balloon in input form

    Return:
        (1d array, 1d array): updated security deposit and security deposit interest paid array
    """
    new_security_deposit = origin_matrix[SECURITY_DEPOSIT_IDX]
    new_security_deposit_interest_paid = origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]
    new_security_deposit_balance = np.zeros(len(new_security_deposit))
    new_security_deposit_balance[0] = new_security_deposit[0]
    for idx in range(len(new_security_deposit_balance)-grace_period_balloon):
        new_security_deposit_balance[idx] = np.sum(new_security_deposit[:idx+1]) + np.sum(new_security_deposit_interest_paid[:idx+1])
    return new_security_deposit_balance

def update_security_deposit_withdraw(origin_matrix, grace_period_balloon):
    """
    Update security deposit withdraw array

    Args:
        origin_matrix: the updated origin matrix
        grace_period_balloon: grace_period_balloon in input form

    Return:
        1d array: updated security deposit withdraw array
    """
    new_security_deposit_withdraw = np.zeros(len(origin_matrix[0]))
    new_security_deposit_withdraw[-1-grace_period_balloon] = np.sum(origin_matrix[SECURITY_DEPOSIT_IDX]) + np.sum(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX])
    return new_security_deposit_withdraw

def update_insurance(origin_matrix, insurance_percent_ongoing, insurance_fixed_ongoing, grace_period_balloon):
    """
    Update insurance array based on updated balance array

    Args:
        origin_matrix: the updated origin matrix
        insurance_percent_ongoing: insurance_percent_ongoing in input form
        insurance_fixed_ongoing:insurance_fixed_ongoing in input form
        grace_period_balloon: grace_period_balloon in input form

    Return:
        1d array: updated insurance array
    """
    balance = origin_matrix[BALANCE_IDX]
    new_insurance_paid= np.zeros(len(origin_matrix[0]))
    new_insurance_paid[0] = origin_matrix[INSURANCE_IDX][0]
    new_insurance_paid[1:] = balance[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
    new_insurance_paid[-1] = 0
    for idx in range(len(origin_matrix[0])-grace_period_balloon-1, len(origin_matrix[0])-1):
        new_insurance_paid[idx] -= insurance_fixed_ongoing
    return new_insurance_paid


def update_interest(origin_matrix, interest_calculation_type, scaled_interest, grace_period_interest_calculate, grace_period_interest_pay, grace_period_balloon):
    """
    Update interest array based on updated balance array

    Args:
        origin_matrix: the updated origin matrix
        interest_calculation_type: the interest calculation type in input form
        scaled_interest: nominal interest scaled to a monthly rete
        grace_period_interest_calculate: gracee_period_interest_calculate in input form
        grace_period_interest_pay: grace_period_interest_pay in input form
        grace_period_balloon: grace_period_balloon in input form

    Return:
        1d array: updated interest array
    """
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
    """
    Update tax array based on updated fees array

    Args:
        origin_matrix: the updated origin matrix
        tax_percent_fees: tax_percent_fees in input form
        tax_percent_interest: tax_percent_interest in input form

    Return:
        1d array: updated taxes array
    """
    new_taxes = np.zeros(len(origin_matrix[0]))
    fees_paid = origin_matrix[FEES_IDX]
    interest_paid_arr = origin_matrix[INTEREST_PAID_IDX]
    taxes_on_fee = fees_paid * tax_percent_fees
    taxes_on_interest = interest_paid_arr * tax_percent_interest
    new_taxes = taxes_on_fee + taxes_on_interest
    return new_taxes

def update_cash_flow(origin_matrix):
    """
    Update the total cash flow

    Args:
        origin_matrix: the updated origin matrix

    Return:
        1d array: updated total cash flow array
    """
    return origin_matrix[PRINCIPAL_DISBURSED_IDX] \
    - origin_matrix[PRINCIPAL_PAID_IDX] \
    - origin_matrix[INTEREST_PAID_IDX] \
    - origin_matrix[INSURANCE_IDX] \
    - origin_matrix[FEES_IDX] \
    - origin_matrix[TAXES_IDX] \
    - origin_matrix[SECURITY_DEPOSIT_IDX] \
    + origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]

def on_fees_change(origin_matrix, changes_on_fees):
    """
    Recalculate the fees column based on user changes on fees

    Args:
        origin_matrix: the updated origin matrix
        changes_on_fees: user changes on fees array, got from user change matrix

    Return: 
        1d array: updated fees array
    """
    new_fees = origin_matrix[FEES_IDX]
    for idx in range(len(origin_matrix[0])):
        if changes_on_fees[idx] != None:
            new_fees[idx] = changes_on_fees[idx]
    return new_fees

def on_taxes_change(origin_matrix, changes_on_taxes):
    """
    Recalculate the taxes column based on user changes on taxes

    Args:
        origin_matrix: the updated origin matrix
        changes_on_taxes: user changes on taxes, got from user change matrix

    Return: 
        1d array: updated taxes array
    """
    new_taxes = origin_matrix[TAXES_IDX]
    for idx in range(len(origin_matrix[0])):
        if changes_on_taxes[idx] != None:
            new_taxes[idx] = changes_on_taxes[idx]
    return new_taxes

def on_insurance_change(origin_matrix, changes_on_insurance):
    """
    Recalculate the insurance column based on user changes on insurance

    Args:
        origin_matrix: the updated origin matrix
        changes_on_insurance: user changes on insurance, got from user change matrix

    Return: 
        1d array: updated insurance array
    """
    new_insurance = origin_matrix[INSURANCE_IDX]
    for idx in range(len(origin_matrix[0])):
        if changes_on_insurance[idx] != None:
            new_insurance[idx] = changes_on_insurance[idx]
    return new_insurance

def on_interest_change(origin_matrix, changes_on_interest, grace_period_balloon):
    """
    Recalculate the interest column based on user changes on insurance

    Args:
        origin_matrix: the updated origin matrix
        changes_on_insurance: user changes on insurance, got from user change matrix

    Return: 
        1d array: updated interest array
    """
    new_interest = origin_matrix[INTEREST_PAID_IDX]
    for idx in range(len(new_interest)):
        if changes_on_interest[idx] != None:
            # check if the change is made on last row
            if idx != len(new_interest)-1-grace_period_balloon:
                new_interest[idx+1] += new_interest[idx] - changes_on_interest[idx]

            new_interest[idx] = changes_on_interest[idx]
    return new_interest

def on_security_deposite_change(origin_matrix, changes_on_deposite, security_deposit_scaled_interest, grace_period_balloon):
    """
    Recalculate the security_deposit and security_deposit_interest_paid column based on user changes on insurance

    Args:
        origin_matrix: the updated origin matrix
        changes_on_deposite: user changes on security deposit array, got from user change matrix
        security_deposit_scaled_interest: security deposit interest rate scaled to selected installment time period
        grace_period_balloon: grace_period_balloon in input form

    Return: 
        (1d array, 1d array): updated security_deposit and security_deposit_interest_paid array
    """
    new_security_deposit = origin_matrix[SECURITY_DEPOSIT_IDX]
    for idx in range(len(new_security_deposit)):
        if changes_on_deposite[idx] != None:
            new_security_deposit[idx] = changes_on_deposite[idx]

    new_security_deposit_interest_paid = np.zeros(len(origin_matrix[0]))
    for idx in range(1, len(new_security_deposit)-grace_period_balloon):
        new_security_deposit_interest_paid[idx] = (np.sum(new_security_deposit[:idx]) + np.sum(new_security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest
    return new_security_deposit, new_security_deposit_interest_paid

def on_days_change(origin_matrix, changes_on_days, changes_on_date, installment_time_period):
    """
    Recalculate the days and date column based on user changes on days and date

    Args:
        origin_matrix: the updated origin matrix
        changes_on_days: user changes on days array, got from user change matrix
        changes_on_date: user changes on date array, got from user change matrix
        installment_time_period: installment_time_period in the input form
    Return: 
        (1d array, 1d array): updated date array and days array
    """
    new_date_arr = []
    new_day_num_arr = []
    date_col = origin_matrix[DATE_IDX]
    day_col = origin_matrix[DAY_IDX]
    start_date = None

    # check if user have changed the start date
    if changes_on_date[0] != None:
        start_date = datetime.datetime.strptime(changes_on_date[0], '%d-%b-%Y')
        new_date_arr.append(changes_on_date[0])
    else:
        start_date = datetime.datetime.strptime(date_col[0], '%d-%b-%Y')
        new_date_arr.append(date_col[0])

    prev_date = start_date
    new_day_num_arr.append(0)
    for idx in range(1,len(date_col)):
        # for each row, date change will overwrite days change when both of them were changed
        # so first check changes on date
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
    """
    Calculate nominal interest scaled to a monthly rete(scaled interest) and 
    security deposit interest rate scaled to selected installment time period(security_deposit_scaled_interest)

    Args:
        nominal_interest_rate: nominal_interest_rate in input form
        installment_time_period:installment_time_period in input form
        interest_time_period: interest_time_period in input form
        interest_paid_on_deposit_percent: interest_paid_on_deposit_percent in input form

    Return:
        (float, float): calculated scaled interest and  security deposit scaled_interest

    """
    periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])
    installments_period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
    interest_period_dict = {'day':0, 'week':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'month':5, 'quarter':6, 'half-year':7, 'year':8}

    installments_arr = 1/ (periods_per_year / 12)
    nominal_arr = 1 / installments_arr
    scaled_interest = nominal_interest_rate*installments_arr[installments_period_dict[installment_time_period]] * nominal_arr[interest_period_dict[interest_time_period]]
    security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[installments_period_dict[installment_time_period]]
    return scaled_interest, security_deposit_scaled_interest


def cal_apr_manual_mode(origin_matrix, grace_period_balloon, installment_time_period):
    """
    Calculate the new APR on updated orgin matrix, this new APR is based on EIR, which is based on XIRR function.

    Args:
        origin_matrix: the updated origin_matrix
        grace_period_balloon: grace_period_balloon in input form
        installment_time_period: installment_time_period in input form

    Return:
        float: the new APR
    """
    periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])
    installments_period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
    date_col = origin_matrix[DATE_IDX]
    cash_flow = origin_matrix[CASH_FLOW_IDX]
    date_cash_list = []

    for idx in range(len(origin_matrix[0])):
        date = datetime.datetime.strptime(date_col[idx], '%d-%b-%Y')
        date_cash_list.append((date, cash_flow[idx]))

    EIR = xirr(date_cash_list)
    period_num = periods_per_year[installments_period_dict[installment_time_period]]
    # convert from EIR to APR
    return (period_num * ((1+EIR)**(1/period_num)-1) * 100)

def round_matrix(origin_matrix):
    """
    round all floats in the updated origin matrix to two digits after floating point 

    Args:
        origin matrix: the updated origin matrix
    Return:
        2d array: the rounded matrix
    """
    for row_idx in range(PRINCIPAL_DISBURSED_IDX, CASH_FLOW_IDX+1):
        for col_idx in range(len(origin_matrix[0])):
            origin_matrix[row_idx][col_idx] = round_float(origin_matrix[row_idx][col_idx], 2)
    return origin_matrix

def update_repayment_schedule(user_change, input_form):
    """
    Update the repayment schedule based on user input and user change

    Args:
        user_change: the matrix for all user changes
        input form: the user input form
    Return:
        2d array: the rounded matrix
    """

    # get inputs we need from input form
    installment_time_period = input_form['installment_time_period']
    grace_period_balloon = int(input_form['grace_period_balloon'])
    security_deposit_percent_ongoing = float(input_form['security_deposit_percent_ongoing'])/ 100
    security_deposit_fixed_ongoing = float(input_form['security_deposit_fixed_ongoing'])
    fee_percent_ongoing = float(input_form['fee_percent_ongoing']) / 100
    fee_fixed_ongoing = float(input_form['fee_fixed_ongoing'])
    insurance_percent_ongoing = float(input_form['insurance_percent_ongoing']) / 100
    insurance_fixed_ongoing  = float(input_form['insurance_fixed_ongoing'])
    interest_calculation_type = input_form['interest_calculation_type']
    grace_period_interest_calculate = int(input_form['grace_period_interest_calculate'])
    grace_period_interest_pay = int(input_form['grace_period_interest_pay'])
    tax_percent_fees = float(input_form['tax_percent_fees']) / 100
    tax_percent_interest = float(input_form['tax_percent_interest']) / 100
    nominal_interest_rate = float(input_form['nominal_interest_rate']) / 100
    interest_time_period = input_form['interest_time_period']
    interest_paid_on_deposit_percent = float(input_form['interest_paid_on_deposit_percent'])/ 100

    # Convert user changes in the user_change matrix to appropriate type
    for i in range(len(user_change)):
        # if i in [0,2]:
        #     new_matrix.append(origin_matrix[i].astype(int))
        # elif i != 1:
        #     new_matrix.append(origin_matrix[i].astype(float))
        # else:
        #     new_matrix.append(origin_matrix[i])
        for j in range(len(user_change[0])):
            if i in [0,2]:
                if user_change[i][j] != None:
                    user_change[i][j] = int(user_change[i][j])
            elif i != 1:
                if user_change[i][j] != None:
                    user_change[i][j] = float(user_change[i][j])

    # get origin matrix from input form
    # Note that each ROW in the origin matrix corresponds to COLUMNS in the repayment schedule
    apr, origin_matrix = cal_apr_helper(input_form)
    # first row is the period index number
    origin_matrix[0] = list(range(len(origin_matrix[0])))
    scaled_interest, security_deposit_scaled_interest = cal_scaled_interest(nominal_interest_rate, installment_time_period, interest_time_period, interest_paid_on_deposit_percent)

    # update the origin matrix
    # Note that the following operation must be kept in order since they have dependencies.
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

    new_apr = cal_apr_manual_mode(origin_matrix, grace_period_balloon, installment_time_period)
    origin_matrix = round_matrix(origin_matrix)
    new_apr = round_float(new_apr,2)
    return new_apr, origin_matrix
