import numpy as np
import itertools as it
import sys
import datetime
from calendar import monthrange
import calendar
sys.path.insert(0, '../api')

from utils import get_num_days_to_incre, calc_origin_days, on_days_change
def round_float(f, n):
    return np.floor(f * 10 ** n + 0.5) / 10**n

    
a = np.array([1.2, 1.3])
print (round_float(x, 2) for x in a)
print (round_float(0, 2))
print (round_float(1.4, 2))
# print (round(1.545, 2))
# exit(1)
# generate all possible input
# range_1_180 = ['installment', 'grace_period_principal', 'grace_period_interest_pay', 'grace_period_interest_calculate', 'grace_period_balloon']
# range_0_1f = ['fee_percent_upfront', 'fee_percent_ongoing', 'insurance_percent_upfront', 'insurance_percent_ongoing', 'tax_percent_fees', 'tax_percent_interest', 'security_deposit_percent_upfront', 'security_deposit_percent_ongoing']
# range_0_2f = ['nominal_interest_rate']
# range_0_099f = ['interest_paid_on_deposit_percent']

# has_range_ranges = []
# range_dict = {}
# for _ in range_1_180:
#     has_range_ranges.append([0,90,180])

# for item in range_0_1f:
#     has_range_ranges.append([0, 0.5, 1.0])

# for item in range_0_2f:
#     has_range_ranges.append([0, 1.0, 2.0])

# for item in range_0_099f:
#     has_range_ranges.append([0, 0.5, 0.99])

# has_range_names = range_1_180 + range_0_1f + range_0_2f + range_0_099f

#WARNING: 14348907 cases in total, don't try to print them out!
# test_cases = list(it.product(*has_range_ranges))

def fake_cal_apr():

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
    grace_period_principal = 0
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

    # installments_arr = np.array([1, 7, 14, 15, 28, 30, 90, 180, 360])
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

    # CHANGE
    # for interst payment type
    if interest_payment_type == 'single end-term payment':
        interest_paid_arr[-1-grace_period_balloon] = sum(interest_paid_arr)
        for idx in range(len(interest_paid_arr)-1-grace_period_balloon):
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
    print(security_deposit)
    for idx in range(len(balance_arr)-grace_period_balloon-1, len(balance_arr)):
        security_deposit[idx] -= security_deposit_fixed_ongoing
    print(security_deposit)


    security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[installments_period_dict[installment_time_period]]
    security_deposit_interest_paid = np.zeros(installment + 1)
    for idx in range(1, len(security_deposit) - grace_period_balloon):
        security_deposit_interest_paid[idx] = (np.sum(security_deposit[:idx]) + np.sum(security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest


    # security_deposit = np.array([round_float(x, 2) for x in security_deposit])

    taxes_on_fee = fees_paid * tax_percent_fees
    # taxes_on_fee = np.array([round_float(x, 2) for x in taxes_on_fee])
    taxes_on_interest = interest_paid_arr * tax_percent_interest
    # taxes_on_interest = np.array([round_float(x, 2) for x in taxes_on_interest])
    taxes = taxes_on_fee + taxes_on_interest

    print ('------------')
    result = np.zeros(installment + 1)
    result[0] = loan_amount
    result += -1 * (fees_paid + insurance_paid + taxes + interest_paid_arr + principal_paid_arr + security_deposit) 
    # result = result[:-grace_period_balloon]

    #### below is experimental
    if grace_period_balloon != 0:
        # result = result[:-grace_period_balloon]
        for idx in range(len(result)-grace_period_balloon, len(result)):
            result[idx] = 0
    #### above is experimental

    ##### 
    print ('#'*10)
    print (result)
    # result[-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
    result[-grace_period_balloon-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
    print ('*'*10)
    # print (result_for_cal)
    # result_for_cal[-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
    # print (result)
    # print (result_for_cal)
    print (result)
    print ('*'*10)

    ######
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
    deposite_withdraw[-grace_period_balloon-1] = np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
    schedule_matrix.append(deposite_withdraw)
    security_deposit_balance = np.zeros(installment+1)
    for idx in range(len(security_deposit_balance)-grace_period_balloon):
        security_deposit_balance[idx] = np.sum(security_deposit[:idx+1]) + np.sum(security_deposit_interest_paid[:idx+1])
    security_deposit_balance[-1] = 0
    schedule_matrix.append(security_deposit_balance)
    schedule_matrix.append(result) 
    schedule_matrix = np.array(schedule_matrix, dtype=object)
    # result[9:] += 0.01
    print (np.irr(result)) ####changed from result to result for cal
    print (periods_per_year[installments_period_dict[installment_time_period]])
    print (result)
    print ('{0}%'.format(round_float(np.irr(result) * periods_per_year[installments_period_dict[installment_time_period]]*100, 2)))
    print ('------------')
    print (monthly_payment)
    print ('\nprincipal\n')
    print (principal_paid_arr)
    print ('\nbalance\n')
    print (balance_arr)
    print ('\ninterest_paid_arr\n')
    print (interest_paid_arr)
    print ('\nfees paid\n')
    print (fees_paid)
    print ('\n insurance_paid\n')
    print (insurance_paid)
    print ('\ntaxes\n')
    print (taxes)
    print ('\n security_deposit\n')
    print (security_deposit)
    print ('\n security_deposit_interest_paid\n')
    print (security_deposit_interest_paid)
    print (schedule_matrix)
    return round_float(np.irr(result) * periods_per_year[installments_period_dict[installment_time_period]] * 100,2), schedule_matrix

fake_cal_apr()
