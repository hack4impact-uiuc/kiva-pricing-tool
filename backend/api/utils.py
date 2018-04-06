import json
from flask import jsonify
import numpy as np

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
        for idx in range(1, len(security_deposit)):
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
        # TODO change/remove following line
        # result = result[:-grace_period_balloon+1]

        #### below is experimental
        if grace_period_balloon != 0:
            result = result[:-grace_period_balloon]
        #### above is experimental
        result[-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)
        return round_float(np.irr(result) * periods_per_year[installments_period_dict[installment_time_period]] * 100,2)
    except:
        #TODO status code not sure 
        return None