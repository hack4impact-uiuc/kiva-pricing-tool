import sys
sys.path.insert(0, '../api')
from utils import *
from repayment_schedule_test import update_security_deposit as update_security_deposit_1
import copy

def round_arr(arr):
    return [round_float(item, 2) for item in arr]

input_json = {
    'installment': 12,
    'loan_amount': 1000,
    'nominal_interest_rate': 2,
    'fee_percent_ongoing': 10,
    'fee_percent_upfront': 10,
    'fee_fixed_upfront': 100,
    'fee_fixed_ongoing': 100,
    'insurance_percent_upfront': 10,
    'insurance_percent_ongoing': 10,
    'insurance_fixed_upfront': 50,
    'insurance_fixed_ongoing': 10,
    'tax_percent_interest':10,
    'tax_percent_fees': 10,
    'grace_period_principal':0,
    'grace_period_interest_pay': 0,
    'grace_period_interest_calculate': 0,
    'grace_period_balloon': 0,
    'security_deposit_percent_ongoing': 10,
    'security_deposit_percent_upfront': 10,
    'security_deposit_fixed_upfront': 10,
    'security_deposit_fixed_ongoing': 10,
    'interest_paid_on_deposit_percent': 10,
    'interest_calculation_type': 'declining balance',
    'repayment_type': 'equal installments (amortized)',
    'interest_payment_type': 'multiple installments',
    'installment_time_period': '4 weeks',
    'interest_time_period': 'month'
}

# user_change[PRINCIPAL_PAID_IDX][4] = 100
# user_change[PRINCIPAL_PAID_IDX][5] = 100
# user_change[PRINCIPAL_PAID_IDX][6] = 100
# user_change[FEES_IDX][4] = 200
# user_change[FEES_IDX][8] = 100
# user_change[INSURANCE_IDX][6] = 100
# user_change[INSURANCE_IDX][7] = 30
# user_change[INTEREST_PAID_IDX][8] = 12
# user_change[INTEREST_PAID_IDX][4] = 10
# user_change[TAXES_IDX][4] = 30
# user_change[TAXES_IDX][8] = 10
# user_change[SECURITY_DEPOSIT_IDX][6] = 10
# user_change[SECURITY_DEPOSIT_IDX][8] = 10
# user_change[DAY_IDX][4] = 60
# user_change[DAY_IDX][5] = 60
# user_change[DATE_IDX][0] = '10-Mar-2012'
# user_change[DATE_IDX][6] = '18-Aug-2012'


def test_on_principal_change():
    local_json = copy.deepcopy(input_json)
    apr, origin_matrix = cal_apr_helper(local_json)
    # print(origin_matrix)
    user_change = np.zeros((len(origin_matrix), len(origin_matrix[0]))).astype(object)
    user_change[:] = None
    
    
    scaled_interest, security_deposit_scaled_interest = cal_scaled_interest(local_json['nominal_interest_rate']/100, local_json['installment_time_period'], local_json['interest_time_period'], local_json['interest_paid_on_deposit_percent']/100)
    
    # no change case
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    # print (origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])
    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 75.21, 76.60, 78.01, 79.45, 80.92, 82.41, 83.93, 85.48, 87.06, 88.67, 90.30, 91.97]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 924.79, 848.20, 770.19, 690.74, 609.82, 527.41, 443.48, 358.00, 270.94, 182.27, 91.97, 0]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) == [110.00, 17.52 ,17.66, 17.80, 17.94, 18.09, 18.24, 18.39, 18.55, 18.71, 18.87, 19.03, 9.20 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 0.99, 1.13, 1.28, 1.42, 1.57, 1.73, 1.88, 2.04, 2.20, 2.36, 2.52 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 107.52, 107.66, 107.80, 107.94, 108.09, 108.24, 108.39, 108.55, 108.71, 108.87, 109.03, 109.20 ]
    assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 18.46, 17.07, 15.66, 14.22, 12.75, 11.26, 9.74, 8.19, 6.61, 5.00, 3.37, 1.70 ]
    assert round_arr(origin_matrix[TAXES_IDX]) == [ 20.00, 12.60, 12.47, 12.35, 12.22, 12.08, 11.95, 11.81, 11.67, 11.53, 11.39, 11.24, 11.09 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 339.97]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [110.00, 128.37, 147.01, 165.95, 185.17, 204.68, 224.50, 244.62, 265.05, 285.79, 306.86, 328.25, 0]

    # change on first item (no effect)
    user_change[PRINCIPAL_PAID_IDX][0] = 100
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])

    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 75.21, 76.60, 78.01, 79.45, 80.92, 82.41, 83.93, 85.48, 87.06, 88.67, 90.30, 91.97]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 924.79, 848.20, 770.19, 690.74, 609.82, 527.41, 443.48, 358.00, 270.94, 182.27, 91.97, 0]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) == [110.00, 17.52 ,17.66, 17.80, 17.94, 18.09, 18.24, 18.39, 18.55, 18.71, 18.87, 19.03, 9.20 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 0.99, 1.13, 1.28, 1.42, 1.57, 1.73, 1.88, 2.04, 2.20, 2.36, 2.52 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 107.52, 107.66, 107.80, 107.94, 108.09, 108.24, 108.39, 108.55, 108.71, 108.87, 109.03, 109.20 ]
    assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 18.46, 17.07, 15.66, 14.22, 12.75, 11.26, 9.74, 8.19, 6.61, 5.00, 3.37, 1.70 ]
    assert round_arr(origin_matrix[TAXES_IDX]) == [ 20.00, 12.60, 12.47, 12.35, 12.22, 12.08, 11.95, 11.81, 11.67, 11.53, 11.39, 11.24, 11.09 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 339.97]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [110.00, 128.37, 147.01, 165.95, 185.17, 204.68, 224.50, 244.62, 265.05, 285.79, 306.86, 328.25, 0]

    # change in the middle
    user_change[PRINCIPAL_PAID_IDX][1] = 100
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])

    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 100 ,76.60 ,78.01 ,79.45 ,80.92 ,82.41 ,83.93 ,85.48 ,87.06 ,88.67 ,90.30 ,67.18]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 900.00, 823.40, 745.40, 665.95, 585.03, 502.62, 418.69, 333.21, 246.15, 157.48, 67.18, 0]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) == [110.00, 20.00, 17.66, 17.80, 17.94, 18.09, 18.24, 18.39, 18.55, 18.71, 18.87, 19.03, 6.72 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 1.01, 1.15, 1.30, 1.44, 1.59, 1.75, 1.90, 2.06, 2.22, 2.38, 2.55 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 110, 107.66, 107.80, 107.94, 108.09, 108.24, 108.39, 108.55, 108.71, 108.87, 109.03, 106.72 ]
    assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 18.46, 16.62, 15.20, 13.76, 12.29, 10.80, 9.28, 7.73, 6.15, 4.54, 2.91, 1.24  ]
    assert round_arr(origin_matrix[TAXES_IDX]) == [20.00, 12.85, 12.43, 12.30, 12.17, 12.04, 11.90, 11.77, 11.63, 11.49, 11.34, 11.19, 10.80 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 340.19]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [110.00, 130.85, 149.51, 168.46, 187.70, 207.24, 227.07, 247.21, 267.66, 288.43, 309.51, 330.93, 0]

    # change in the last row
    user_change[PRINCIPAL_PAID_IDX][-1] = 100
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])
    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 100 ,76.60 ,78.01 ,79.45 ,80.92 ,82.41 ,83.93 ,85.48 ,87.06 ,88.67 ,90.30 ,100]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 900.00, 823.40, 745.40, 665.95, 585.03, 502.62, 418.69, 333.21, 246.15, 157.48, 67.18, -32.82]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) == [110.00, 20.00, 17.66, 17.80, 17.94, 18.09, 18.24, 18.39, 18.55, 18.71, 18.87, 19.03, 10]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 1.01, 1.15, 1.30, 1.44, 1.59, 1.75, 1.90, 2.06, 2.22, 2.38, 2.55 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 110, 107.66, 107.80, 107.94, 108.09, 108.24, 108.39, 108.55, 108.71, 108.87, 109.03, 110]
    assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 18.46, 16.62, 15.20, 13.76, 12.29, 10.80, 9.28, 7.73, 6.15, 4.54, 2.91, 1.24  ]
    assert round_arr(origin_matrix[TAXES_IDX]) == [20.00, 12.85, 12.43, 12.30, 12.17, 12.04, 11.90, 11.77, 11.63, 11.49, 11.34, 11.19, 11.12 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 343.47]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [110.00, 130.85, 149.51, 168.46, 187.70, 207.24, 227.07, 247.21, 267.66, 288.43, 309.51, 330.93, 0]

    # test a differnet combination of interest_calculation, repayment_type, interest_payment_type
    # especially 'single end-term payment' in interest_payment_type
    local_json['interest_calculation_type'] =  'initial amount or flat'
    local_json['repayment_type'] = 'equal principal payments'
    local_json['interest_payment_type'] = 'single end-term payment'
    apr, origin_matrix = cal_apr_helper(local_json)
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])
    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 100 ,83.33 ,83.33 ,83.33 ,83.33 ,83.33 ,83.33 ,83.33 ,83.33 ,83.33 ,83.33 ,100]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 900.00, 816.67, 733.33, 650.00, 566.67, 483.33, 400.00, 316.67, 233.33, 150.00, 66.67, -33.33]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) ==  [110.00, 20.00, 18.33, 18.33, 18.33, 18.33, 18.33, 18.33, 18.33, 18.33, 18.33, 18.33, 10.00 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 1.01, 1.16, 1.31, 1.46, 1.61, 1.76, 1.92, 2.07, 2.23, 2.39, 2.55 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 110.00, 108.33, 108.33, 108.33, 108.33, 108.33, 108.33, 108.33, 108.33, 108.33, 108.33, 110.00 ]
    assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221.54]
    assert round_arr(origin_matrix[TAXES_IDX]) == [20.00, 11, 10.83, 10.83, 10.83, 10.83, 10.83, 10.83, 10.83, 10.83, 10.83, 10.83, 33.15]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 343.63]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [110.00, 130.85, 150.19, 169.67, 189.31, 209.10, 229.04, 249.14, 269.39, 289.80, 310.36, 331.08, 0]

    # test a differnet combination of interest_calculation, repayment_type, interest_payment_type
    # especially 'single end-term principal payment' in repayment_type
    local_json['interest_calculation_type'] =  'initial amount or flat'
    local_json['repayment_type'] = 'single end-term principal payment'
    local_json['interest_payment_type'] = 'single end-term payment'
    apr, origin_matrix = cal_apr_helper(local_json)
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])
    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 100 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,100]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 900.00, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 800]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) ==  [110.00, 20.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 20.00 ]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 1.01, 1.09, 1.18, 1.26, 1.35, 1.44, 1.52, 1.61, 1.70, 1.79, 1.88 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 110.00, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 110.00 ]
    assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221.54]
    assert round_arr(origin_matrix[TAXES_IDX]) == [20.00, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 33.15]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 266.68]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [ 110.00, 130.85, 141.85, 152.94, 164.12, 175.38, 186.73, 198.17, 209.69, 221.31, 233.01, 244.80, 0]

    # test balloon payment
    local_json['interest_calculation_type'] =  'initial amount or flat'
    local_json['repayment_type'] = 'equal installments (amortized)'
    local_json['interest_payment_type'] = 'single end-term payment'
    local_json['grace_period_balloon'] = 4
    user_change[PRINCIPAL_PAID_IDX][-1] = 0
    apr, origin_matrix = cal_apr_helper(local_json)
    origin_matrix[PRINCIPAL_PAID_IDX] = on_principal_change(origin_matrix, user_change[PRINCIPAL_PAID_IDX], local_json['grace_period_balloon']) 
    origin_matrix[BALANCE_IDX] = update_balance(origin_matrix)
    origin_matrix[SECURITY_DEPOSIT_IDX], origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX] = update_security_deposit(origin_matrix, local_json['security_deposit_percent_ongoing']/100, local_json['security_deposit_fixed_ongoing'], security_deposit_scaled_interest,local_json['grace_period_balloon'])
    origin_matrix[FEES_IDX] = update_fees(origin_matrix, local_json['fee_percent_ongoing']/100, local_json['fee_fixed_ongoing'], local_json['grace_period_balloon'])
    origin_matrix[INTEREST_PAID_IDX] = update_interest(origin_matrix, local_json['interest_calculation_type'], local_json['interest_payment_type'], scaled_interest, local_json['grace_period_interest_calculate'], local_json['grace_period_interest_pay'],local_json['grace_period_balloon'])
    origin_matrix[TAXES_IDX] = update_taxes(origin_matrix,local_json['tax_percent_fees']/100,local_json['tax_percent_interest']/100)
    origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX] = update_security_deposit_withdraw(origin_matrix,local_json['grace_period_balloon'])
    origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX] = update_security_deposit_balance(origin_matrix,local_json['grace_period_balloon'])
    assert round_arr(origin_matrix[PRINCIPAL_PAID_IDX]) == [0, 100, 76.60, 78.01, 79.45, 80.92, 82.41, 83.93, 418.69, 0, 0, 0, 0]
    assert round_arr(origin_matrix[BALANCE_IDX]) == [1000.00, 900.00, 823.40, 745.40, 665.95, 585.03, 502.62, 418.69, 0, 0, 0, 0, 0]
    assert round_arr(origin_matrix[SECURITY_DEPOSIT_IDX]) ==  [ 110.00, 20.00, 17.66, 17.80, 17.94, 18.09, 18.24, 18.39, 41.87, 0, 0, 0, 0]
    # assert round_arr(origin_matrix[SECURITY_DEPOSIT_INTEREST_PAID_IDX]) == [0, 0.85, 1.01, 1.09, 1.18, 1.26, 1.35, 1.44, 1.52, 1.61, 1.70, 1.79, 1.88 ]
    assert round_arr(origin_matrix[FEES_IDX]) == [200.00, 110.00, 107.66, 107.80, 107.94, 108.09, 108.24, 108.39, 141.87, 0, 0, 0, 0]
    # assert round_arr(origin_matrix[INTEREST_PAID_IDX]) == [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221.54]
    # assert round_arr(origin_matrix[TAXES_IDX]) == [20.00, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 33.15]
    # assert round_arr(origin_matrix[SECURITY_DEPOSIT_WITHDRAW_IDX]) == [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 266.68]
    # assert round_arr(origin_matrix[SECURITY_DEPOSIT_BALANCE_IDX]) == [ 110.00, 130.85, 141.85, 152.94, 164.12, 175.38, 186.73, 198.17, 209.69, 221.31, 233.01, 244.80, 0]




