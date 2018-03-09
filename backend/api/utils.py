import json
from flask import jsonify

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
        loan_amount = input_json['loan_amount']
        installment = input_json['installment']
        nominal_interest_rate = input_json['nominal_interest_rate'] / 100
        grace_period_principal = input_json['grace_period_principal']
        grace_period_interest_pay = input_json['grace_period_interest_pay']
        grace_period_interest_calculate = input_json['grace_period_interest_calculate']
        grace_period_balloon = input_json['grace_period_balloon']
        fee_percent_upfront = input_json['fee_percent_upfront'] / 100
        fee_percent_ongoing = input_json['fee_percent_ongoing'] / 100
        fee_fixed_upfront = input_json['fee_fixed_upfront'] 
        fee_fixed_ongoing = input_json['fee_fixed_ongoing']
        insurance_percent_upfront = input_json['insurance_percent_upfront'] / 100
        insurance_percent_ongoing = input_json['insurance_percent_ongoing'] / 100
        insurance_fixed_upfront = input_json['insurance_fixed_upfront']
        insurance_fixed_ongoing  = input_json['insurance_fixed_ongoing']
        tax_percent_fees = input_json['tax_percent_fees'] / 100
        tax_percent_interest = input_json['tax_percent_interest'] / 100
        security_deposit_percent_upfront = input_json['security_deposit_percent_upfront'] / 100
        security_deposit_percent_ongoing = input_json['security_deposit_percent_ongoing'] / 100
        security_deposit_fixed_upfront = input_json['security_deposit_fixed_upfront']
        security_deposit_fixed_ongoing = input_json['security_deposit_fixed_ongoing']
        interest_paid_on_deposit_percent = input_json['interest_paid_on_deposit_percent'] / 100


        period_dict = {'days':0, 'weeks':1, 'two-weeks':2, '15 days':3, '4 weeks':4, 'months':5, 'quarters':6, 'half-years':7, 'years':8}
        installments_arr = np.array([1, 7, 14, 15, 28, 30, 90, 180, 360])
        periods_per_year = np.array([365, 52, 26, 24, 13, 12, 4, 2, 1])
        nominal_arr = 1 / installments_arr
        scaled_interest = nominal_interest_rate*installments_arr[period_dict[installment_time_period]] * nominal_arr[period_dict[installment_time_period]]
        
        monthly_payment = loan_amount / (((1+scaled_interest)**installment -1) / (scaled_interest * (1+scaled_interest)**installment))

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

        insurance_paid= np.zeros(installment + 1)
        insurance_paid[0] = insurance_percent_upfront * balance_arr[0] + insurance_fixed_upfront
        insurance_paid[1:] = balance_arr[1:] * insurance_percent_ongoing + insurance_fixed_ongoing
        insurance_paid[-1] = 0

        security_deposit = np.zeros(installment + 1)
        security_deposit[0] = security_deposit_percent_upfront * balance_arr[0] + security_deposit_fixed_upfront
        security_deposit[1:] = principal_paid_arr[1:] * security_deposit_percent_ongoing + security_deposit_fixed_ongoing
        security_deposit_scaled_interest = interest_paid_on_deposit_percent / periods_per_year[period_dict[installment_time_period]]
        security_deposit_interest_paid = np.zeros(installment + 1)
        for idx in range(1, len(security_deposit)):
            security_deposit_interest_paid[idx] = (np.sum(security_deposit[:idx]) + np.sum(security_deposit_interest_paid[:idx])) * security_deposit_scaled_interest

        taxes_on_fee = fees_paid * tax_percent_fees
        taxes_on_interest = interest_paid_arr * tax_percent_interest
        taxes = taxes_on_fee + taxes_on_interest

        result = np.zeros(installment + 1)
        result[0] = loan_amount
        result += -1 * (fees_paid + insurance_paid + taxes + interest_paid_arr + principal_paid_arr + security_deposit) 
        result[-1] += np.sum(security_deposit) + np.sum(security_deposit_interest_paid)

        return np.irr(result)
    except:
        #TODO status code not sure 
        return None
