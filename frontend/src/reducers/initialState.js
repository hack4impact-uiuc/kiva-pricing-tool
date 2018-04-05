// @flow
// import type { Store } from './../types'

const initialState = {
  stuff: [],
  colors: ['red', 'yellow', 'blue'],
  formData: {
    mfi: null,
    loanType: null,
    productType: null,
    versionNum: null,
    backRoute: null,

    start_name: null,
    installment_time_period: null,
    repayment_type: null,
    interest_time_period: null,
    interest_payment_type: null,
    interest_calculation_type: null,
    loan_amount: null,
    installment: null,
    nominal_interest_rate: null,
    grace_period_principal: null,
    grace_period_interest_pay: null,
    grace_period_interest_calculate: null,
    grace_period_balloon: null,
    fee_percent_upfront: null,
    fee_percent_ongoing: null,
    fee_fixed_upfront: null,
    fee_fixed_ongoing: null,
    tax_percent_fees: null,
    tax_percent_interest: null,
    insurance_percent_upfront: null,
    insurance_percent_ongoing: null,
    insurance_fixed_upfront: null,
    insurance_fixed_ongoing: null,
    security_deposit_percent_upfront: null,
    security_deposit_percent_ongoing: null,
    security_deposit_fixed_upfront: null,
    security_deposit_fixed_ongoing: null,
    interest_paid_on_deposit_percent: null
  }
}

export default initialState
