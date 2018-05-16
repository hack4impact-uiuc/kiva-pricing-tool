import numpy as np
from input_test import fake_cal_apr
import datetime
from calendar import monthrange
import calendar
import sys
sys.path.insert(0, '../api')
from util_xirr import *
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

installment = 12
loan_amount = 1000
nominal_interest_rate = 0.02
fee_percent_ongoing = 0.1
fee_percent_upfront = 0.1
fee_fixed_upfront = 100
fee_fixed_ongoing = 100
insurance_percent_upfront = 0.1
insurance_percent_ongoing = 0.1
insurance_fixed_upfront = 50
insurance_fixed_ongoing = 10
tax_percent_interest = 0.1
tax_percent_fees = 0.1
grace_period_principal = 3
grace_period_interest_pay = 0
grace_period_interest_calculate = 0
grace_period_balloon = 0
security_deposit_percent_ongoing = 0.1
security_deposit_percent_upfront = 0.1
security_deposit_fixed_upfront = 10
security_deposit_fixed_ongoing = 10
interest_paid_on_deposit_percent = 0.1
interest_calculation_type = 'initial amount or flat'
repayment_type = 'equal installments (amortized)'
interest_payment_type = 'multiple installments'

periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])
installment_time_period = '4 weeks'
interest_time_period = 'month'

installments_period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
interest_period_dict = {'day':0, 'week':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'month':5, 'quarter':6, 'half-year':7, 'year':8}

installments_arr = 1/ (periods_per_year / 12)
nominal_arr = 1 / installments_arr

scaled_interest = nominal_interest_rate*installments_arr[installments_period_dict[installment_time_period]] * nominal_arr[interest_period_dict[interest_time_period]]
security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[installments_period_dict[installment_time_period]]

# for days and date calculation in repayment schedule
days_dict = {'days':1, 'weeks':7, 'two-weeks':14, '15 days':15, '4 weeks': 28}
month_num_to_str_dict = {1:'Jan', 2: 'Feb', 3: 'Mar', 4:'Apr', 5:'May', 6:'Jun', 7:'Jul', 8:'Aug', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dec'}

def round_float(f, n):
    return np.floor(f * 10 ** n + 0.5) / 10**n

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

def update_fees(origin_matrix, fee_percent_ongoing, fee_fixed_ongoing, grace_period_balloon):
    balance_upfront = origin_matrix[BALANCE_IDX][0]
    new_fees = np.zeros(len(origin_matrix[0]))
    new_fees[0] = origin_matrix[FEES_IDX][0]
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    for idx in range(1, len(origin_matrix[0])-grace_period_balloon):
        new_fees[idx] = principal[idx] * fee_percent_ongoing + fee_fixed_ongoing
    return new_fees

def update_security_deposit(origin_matrix, security_deposit_percent_ongoing, security_deposit_fixed_ongoing, security_deposit_scaled_interest, grace_period_balloon):
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    new_security_deposit = np.zeros(len(origin_matrix[0]))
    new_security_deposit[0] = origin_matrix[SECURITY_DEPOSIT_IDX][0]
    new_security_deposit_interest_paid = np.zeros(len(origin_matrix[0]))

    new_security_deposit[1:] = principal[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
    for idx in range(len(origin_matrix[0])-grace_period_balloon-1, len(origin_matrix[0])):
        if origin_matrix[BALANCE_IDX][idx] < 1:
            new_security_deposit[idx] -= security_deposit_fixed_ongoing

    for idx in range(1, len(origin_matrix[0])- grace_period_balloon):
        new_security_deposit_interest_paid[idx] = (np.sum(new_security_deposit[:idx]) + np.sum(new_security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest
    return new_security_deposit, new_security_deposit_interest_paid

def update_security_deposit_balance(origin_matrix, grace_period_balloon):
    new_security_deposit = origin_matrix[SECURITY_DEPOSIT_IDX]
    new_security_deposit_interest_paid = origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]
    new_security_deposit_balance = np.zeros(len(new_security_deposit))
    new_security_deposit_balance[0] = new_security_deposit[0]
    for idx in range(len(new_security_deposit_balance)-grace_period_balloon-1):
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
    
    for idx in range(len(new_insurance_paid)):
        if balance[idx] <= 0:
            new_insurance_paid[idx] = 0
    return new_insurance_paid


def update_interest(origin_matrix, interest_calculation_type, interest_payment_type, scaled_interest, grace_period_interest_calculate, grace_period_interest_pay, grace_period_balloon):
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

    # CHANGE
    # for interst payment type
    if interest_payment_type == 'single end-term payment':
        new_interest_paid_arr[-1-grace_period_balloon] = sum(new_interest_paid_arr)
        for idx in range(len(new_interest_paid_arr)-1-grace_period_balloon):
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

def on_interest_change(origin_matrix, changes_on_interest, interest_payment_type, grace_period_balloon):
    new_interest = origin_matrix[INTEREST_PAID_IDX]
    for idx in range(len(new_interest)):
        if changes_on_interest[idx] != None:
            # check if the change is made on last row
            if idx != len(new_interest)-1-grace_period_balloon:
                if interest_payment_type == 'single end-term payment':
                    new_interest[len(new_interest)-1-grace_period_balloon] -= changes_on_interest[idx]
                else:
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
    start_date = None
    if changes_on_date[0] != None:
        start_date = datetime.datetime.strptime(changes_on_date[0], '%d-%b-%Y')
        new_date_arr.append(changes_on_date[0])
    else:
        start_date = datetime.datetime.strptime(date_col[0], '%d-%b-%Y')
        new_date_arr.append(date_col[0])
    prev_date = start_date
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


def cal_apr_manual_mode(origin_matrix, grace_period_balloon):
    test = [(-10000, '1-Jan-2008'),(2750, '1-Mar-2008'),(4250, '30-Oct-2008'),(3250, '15-Feb-2009'),(2750, '1-Apr-2009')]
    date_col = origin_matrix[DATE_IDX]
    cash_flow = origin_matrix[CASH_FLOW_IDX]
    date_cash_list = []
    print (len(origin_matrix[0]))
   
    for idx in range(len(origin_matrix[0])):
        date = datetime.datetime.strptime(date_col[idx], '%d-%b-%Y')
        date_cash_list.append((date, cash_flow[idx]))
    print (date_cash_list)
    EIR = xirr(date_cash_list)
    period_num = len(origin_matrix[0])
    # convert from EIR to APR 
    return (period_num * ((1+EIR)**(1/period_num)-1))

# def xirr1(transactions):
#     years = [(ta[0] - transactions[0][0]).days / 365.0 for ta in transactions]
#     residual = 1
#     step = 0.05
#     guess = 0.05
#     epsilon = 0.0001
#     limit = 10000
#     while abs(residual) > epsilon and limit > 0:
#         limit -= 1
#         residual = 0.0
#         for i, ta in enumerate(transactions):
#             print ((guess, years[i]))
#             residual += ta[1] / pow(guess, years[i])
#         print ('***')
#         print (guess)
#         print (residual)
#         if abs(residual) > epsilon:
#             if residual > 0:
#                 guess += step
#             else:
#                 guess -= step
#                 step /= 2.0
#     return guess-1



#########
# NOTE each ROW correspond to an column in the excel tool. 

# test last row change
########


apr, origin_matrix = fake_cal_apr()
print (apr)
user_change = np.zeros((len(origin_matrix), len(origin_matrix[0]))).astype(object)
# for i in range(len(origin_matrix)):
#     for j in range(len(origin_matrix[1])):
#         user_change[i][j] = None
user_change[:] = None

# user_change[PRINCIPAL_PAID_IDX][4] = 100
# user_change[PRINCIPAL_PAID_IDX][-1] = 100
# user_change[PRINCIPAL_PAID_IDX][4] = 100
# user_change[PRINCIPAL_PAID_IDX][5] = 100
# user_change[PRINCIPAL_PAID_IDX][6] = 100
# user_change[FEES_IDX][4] = 200
# user_change[FEES_IDX][8] = 100
# user_change[INSURANCE_IDX][6] = 100
# user_change[INSURANCE_IDX][7] = 30
# user_change[INTEREST_PAID_IDX][1] = 100
# user_change[INTEREST_PAID_IDX][4] = 10
# user_change[TAXES_IDX][4] = 30
# user_change[TAXES_IDX][8] = 10
# user_change[SECURITY_DEPOSIT_IDX][6] = 10
# user_change[SECURITY_DEPOSIT_IDX][8] = 10
# user_change[DAY_IDX][3] = 20
# user_change[DAY_IDX][4] = 20
# user_change[DAY_IDX][-1] = 20
user_change[DATE_IDX][0] = '10-Mar-2012'
# user_change[DATE_IDX][6] = '18-Aug-2012'
print (user_change)

print (origin_matrix[INTEREST_PAID_IDX])
# print (origin_matrix)
# temp = origin_matrix
#####
# print (origin_matrix)

origin_matrix[DATE_IDX], origin_matrix[DAY_IDX] = on_days_change(origin_matrix, user_change[DAY_IDX], user_change[DATE_IDX], installment_time_period)
origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], grace_period_balloon)
origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] =  update_security_deposit(origin_matrix, security_deposit_percent_ongoing, security_deposit_fixed_ongoing, security_deposit_scaled_interest, grace_period_balloon)
origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = on_security_deposite_change(origin_matrix, user_change[SECURITY_DEPOSIT_IDX], security_deposit_scaled_interest, grace_period_balloon)
origin_matrix[FEES_IDX] = update_fees(origin_matrix, fee_percent_ongoing, fee_fixed_ongoing, grace_period_balloon)
origin_matrix[FEES_IDX] = on_fees_change(origin_matrix, user_change[FEES_IDX])
origin_matrix[INSURANCE_IDX] = update_insurance(origin_matrix, insurance_percent_ongoing, insurance_fixed_ongoing, grace_period_balloon)
origin_matrix[INSURANCE_IDX] = on_insurance_change(origin_matrix, user_change[INSURANCE_IDX])
# CHANGE
origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, interest_calculation_type, interest_payment_type, scaled_interest, grace_period_interest_calculate, grace_period_interest_pay, grace_period_balloon)
print ('*'*10)
print (origin_matrix[INTEREST_PAID_IDX])
origin_matrix[INTEREST_PAID_IDX] = on_interest_change(origin_matrix, user_change[INTEREST_PAID_IDX], interest_payment_type, grace_period_balloon)
origin_matrix[TAXES_IDX] = update_taxes(origin_matrix, tax_percent_fees, tax_percent_interest)
origin_matrix[TAXES_IDX] = on_taxes_change(origin_matrix, user_change[TAXES_IDX])
origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix, grace_period_balloon)
origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix, grace_period_balloon)
print (origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX])
origin_matrix[CASH_FLOW_IDX] = update_cash_flow(origin_matrix)

# rounding
for row_idx in range(PRINCIPAL_DISBURSED_IDX, CASH_FLOW_IDX+1):
    for col_idx in range(len(origin_matrix[0])):
        origin_matrix[row_idx][col_idx] = round_float(origin_matrix[row_idx][col_idx], 2)


# print (origin_matrix)
print (origin_matrix)
print (cal_apr_manual_mode(origin_matrix, grace_period_balloon))

print ('{0}%'.format(round_float(np.irr(origin_matrix[CASH_FLOW_IDX]) * periods_per_year[installments_period_dict[installment_time_period]]*100, 2)))
