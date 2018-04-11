import numpy as np

PRINCIPAL_PAID_IDX = 4
BALANCE_IDX = 5
FEES_IDX = 7
SECURITY_DEPOSIT_IDX = 10
INSURANCE_IDX = 8
TAXES_IDX = 9
INTEREST_PAID_IDX = 6
def on_principal_change(origin_matrix, changes_on_principal, grace_period_balloon):
    aggreg = 0
    new_principal_paid = origin_matrix[PRINCIPAL_PAID_IDX]
    # populate the previous changes except the last row
    for idx in range(1,len(origin_matrix)-grace_period_balloon-1):
        #  amount the override exceeds the origin_matrix value
        if prev_changes[idx] != None:
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
    new_balance = np.zeros(len(origin_matrix))
    new_balance[0] = origin_matrix[BALANCE_IDX][0]
    for idx in range(1,len(origin_matrix)):
        new_balance[idx] = new_balance[idx-1] - principal[idx]
    return new_balance

def update_fees(origin_matrix, fee_percent_ongoing, fee_fixed_ongoing):
    balance_upfront = origin_matrix[BALANCE_IDX][0]
    new_fees = np.zeros(len(origin_matrix))
    new_fees[0] = origin_matrix[FEES_IDX][0]
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    for idx in range(1, len(origin_matrix)):
        new_fees[idx] = principal[idx] * fees_percent_ongoing + fee_fixed_ongoing
    return new_fees

def update_security_deposit(origin_matrix, scaled_interest, security_deposit_perccent_ongoing, security_deposit_fixed_ongoing, security_deposit_scaled_interest, grace_period_balloon):
    principal = origin_matrix[PRINCIPAL_PAID_IDX]
    new_security_deposit = np.zeros(len(origin_matrix))
    new_security_deposit[0] = origin_matrix[SECURITY_DEPOSIT_IDX][0]
    new_security_deposit_interest_paid = np.zeros(len(origin_matrix))

    new_security_deposit[1:] = principal[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
    for idx in range(len(origin_matrix)-grace_period_balloon-1, len(origin_matrix)):
        new_security_deposit[idx] -= security_deposit_fixed_ongoing

    for idx in range(1, len(origin_matrix)):
        new_security_deposit_interest_paid[idx] = (np.sum(new_security_deposit[:idx]) + np.sum(new_security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest
    return new_security_deposit, new_security_deposit_interest_paid


def update_insurance(origin_matrix, insurance_percent_ongoing, insurance_fixed_ongoing, grace_period_balloon):
    balance = origin_matrix[BALANCE_IDX]
    new_insurance_paid= np.zeros(len(origin_matrix))
    new_insurance_paid[0] = origin_matrix[INSURANCE_IDX][0]
    new_insurance_paid[1:] = balance[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
    new_insurance_paid[-1] = 0
    for idx in range(len(origin_matrix)-grace_period_balloon-1, len(origin_matrix)-1):
        new_insurance_paid[idx] -= insurance_fixed_ongoing
    return new_insurance_paid

def update_interest(origin_matrix, interest_calculation_type, scaled_interest, grace_period_interest_calculate, grace_period_interest_pay, grace_period_balloon):
    balance = origin_matrix[BALANCE_IDX]
    new_interest_paid_arr = np.zeros(len(origin_matrix))

    for idx in range(1, len(balance)):
        interest_paid_arr[idx] = balance[idx-1] * scaled_interest

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
    for idx in range(len(balance_arr)-grace_period_balloon, len(balance_arr)):
        new_interest_paid_arr[idx] = 0

def update_taxes(origin_matrix, tax_percent_fees, tax_percent_interest):
    new_taxes = np.zeros(len(origin_matrix))
    fees_paid = origin_matrix[FEES_IDX]
    interest_paid_arr = origin_matrix[INTEREST_PAID_IDX]
    taxes_on_fee = fees_paid * tax_percent_fees
    taxes_on_interest = interest_paid_arr * tax_percent_interest
    new_taxes = taxes_on_fee + taxes_on_interest
    return new_taxes

def on_fees_change(origin_matrix, changes_on_fees):
    new_fees = origin_matrix[FEES_IDX]
    for idx in range(len(origin_matrix)):
        if changes_on_fees[idx] != None:
            new_fees[idx] = changes_on_fees[idx]
    return new_fees

def on_taxes_change(origin_matrix, changes_on_taxes):
    new_taxes = origin_matrix[TAXES_IDX]
    for idx in range(len(origin_matrix)):
        if changes_on_taxes[idx] != None:
            new_taxes[idx] = changes_on_taxes[idx]
    return new_taxes

def on_taxes_change(origin_matrix, changes_on_insurance):
    new_insurance = origin_matrix[INSURANCE_IDX]
    for idx in range(len(origin_matrix)):
        if changes_on_insurance[idx] != None:
            new_insurance[idx] = changes_on_insurance[idx]
    return new_insurance

def on_interest_change(origin_matrix, changes_on_interest):
    new_interest = origin_matrix[INTEREST_PAID_IDX]
    for idx in range(len(new_interest)):
        if changes_on_interest[idx] != None:
            # check if the change is made on last row
            if idx != len(new_interest)-1:
                new_interest[idx+1] += new_interest[idx] - changes_on_interest[idx]
            else:
                new_interest[idx] = changes_on_interest[idx]
    return new_interest

def on_security_deposite_change(origin_matrix, changes_on_deposite, security_deposit_scaled_interest):
    new_security_deposit = origin_matrix[SECURITY_DEPOSIT_IDX]
    for idx in range(len(new_security_deposit)):
        if changes_on_deposite[idx] != None:
            new_security_deposit[idx] = changes_on_deposite[idx]
    new_security_deposit_interest_paid = np.zeros(len(origin_matrix))

    for idx in range(1, len(new_security_deposit)):
        new_security_deposit_interest_paid[idx] = (np.sum(new_security_deposit[:idx]) + np.sum(new_security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest
    return new_security_deposit, new_security_deposit_interest_paid
