import numpy as np
import itertools as it


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



installment = 12
loan_amount = 1000
nominal_interest_rate = 0.02
fee_percent_ongoing = 0.1
fee_percent_upfront = 0.1
fee_fixed_upfront = 100
fee_fixed_ongoing = 100
insurance_percent_upfront = 0.1
insurance_percent_ongoing = 0
insurance_fixed_upfront = 50
insurance_fixed_ongoing = 10
tax_percent_interest = 0.1
tax_percent_fees = 0.1
security_deposit_percent_ongoing = 0.1
security_deposit_percent_upfront = 0.1
security_deposit_fixed_upfront = 10
security_deposit_fixed_ongoing = 10
interest_paid_on_deposit_percent = 0.1
interest_calculation_type = 'declining balance'
repayment_type = 'single end-term principal payment'

installments_arr = np.array([1, 7, 14, 15, 28, 30, 90, 180, 360])
periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])

nominal_arr = 1 / installments_arr
scaled_interest = nominal_interest_rate*installments_arr[5] * nominal_arr[5]
# scaled_interest = round_float(scaled_interest, 4)
# amortization
monthly_payment = loan_amount / (((1+scaled_interest)**installment -1) / (scaled_interest * (1+scaled_interest)**installment))
# monthly_payment = round_float(monthly_payment, 2)

principal_paid_arr = np.zeros(installment + 1)
balance_arr = np.zeros(installment+1)
interest_paid_arr = np.zeros(installment+1)

balance_arr[0] = loan_amount

# test 1 installment
if repayment_type == 'single end-term principal payment':
    principal_paid_arr[-1] = loan_amount

for idx in range(1, len(balance_arr)):
    if repayment_type == 'equal installments (amortized)':
        balance_arr[idx] = balance_arr[idx-1] - (monthly_payment - balance_arr[idx-1] * scaled_interest)
    elif repayment_type == 'equal principal payments':
        balance_arr[idx] = balance_arr[idx-1] - loan_amount / installment
    elif repayment_type == 'single end-term principal payment':
        balance_arr[idx] = loan_amount
    else:
        print('impossible repayment_type')
        exit(1)

    interest_paid_arr[idx] = balance_arr[idx-1] * scaled_interest
    if repayment_type == 'equal installments (amortized)':
        principal_paid_arr[idx] = monthly_payment - interest_paid_arr[idx]
    elif repayment_type == 'equal principal payments':
        principal_paid_arr[idx] = loan_amount / installment

if repayment_type == 'single end-term principal payment':
    balance_arr[-1] = 0
    principal_paid_arr[-1] = loan_amount

if interest_calculation_type == 'initial amount or flat':
    interest_paid_arr[1:] = balance_arr[0] * scaled_interest 



fees_paid= np.zeros(installment + 1)
fees_paid[0] = fee_percent_upfront * balance_arr[0] + fee_fixed_upfront
fees_paid[1:] = principal_paid_arr[1:] * fee_percent_ongoing + fee_fixed_ongoing
# fees_paid = np.array([round_float(x, 2) for x in fees_paid])

insurance_paid= np.zeros(installment + 1)
insurance_paid[0] = insurance_percent_upfront * balance_arr[0] + insurance_fixed_upfront
insurance_paid[1:] = balance_arr[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
insurance_paid[-1] = 0
# insurance_paid = np.array([round_float(x, 2) for x in insurance_paid])

security_deposit = np.zeros(installment + 1)
security_deposit[0] = security_deposit_percent_upfront * balance_arr[0] + security_deposit_fixed_upfront
security_deposit[1:] = principal_paid_arr[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[5]
security_deposit_interest_paid = np.zeros(installment + 1)
for idx in range(1, len(security_deposit)):
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
result[-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)

print (result)
print (np.irr(result))
print ('------------')
print (monthly_payment)
print ('\nbalance\n')
print (balance_arr)
print ('\nprincipal\n')
print (principal_paid_arr)
print ('\ninterest_paid_arr\n')
print (interest_paid_arr)
print ('\ntaxes\n')
print (taxes)
print ('\ntaxes fee\n')
print (taxes_on_fee)
print ('\ntaxes interst\n')
print (taxes_on_interest)
print ('\n security_deposit_interest_paid\n')
print (security_deposit_interest_paid)