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
    updateName: null,
    startName: null,
    installmentTimePeriod: null,
    repaymentType: null,
    interestTimePeriod: null,
    interestPaymentType: null,
    interestCalculationType: null,
    loanAmount: null,
    installment: null,
    nominalInterestRate: null,
    gracePeriodPrincipal: null,
    gracePeriodInterestPay: null,
    gracePeriodInterestCalculate: null,
    gracePeriodBalloon: null,
    feePercentUpfront: null,
    feePercentOngoing: null,
    feeFixedUpfront: null,
    feeFixedOngoing: null,
    taxPercentFees: null,
    taxPercentInterest: null,
    insurancePercentUpfront: null,
    insurancePercentOngoing: null,
    insuranceFixedUpfront: null,
    insuranceFixedOngoing: null,
    securityDepositPercentUpfront: null,
    securityDepositPercentOngoing: null,
    securityDepositFixedUpfront: null,
    securityDepositFixedOngoing: null,
    interestPaidOnDepositPercent: null,

    aprRate: null,
    saveData: null
  }
}

export default initialState
