function convertFromApiLoan(loan) {
  console.log(loan)
  return {
    mfi: loan.partner,
    loanType: loan.loan_theme,
    productType: loan.product_type,
    versionNum: loan.version_num,

    updateName: loan.update_name,
    startName: loan.start_name, // duplicate: do not want this, edit: we want this
    installmentTimePeriod: loan.installment_time_period,
    repaymentType: loan.repayment_type,
    interestTimePeriod: loan.interest_time_period,
    interestPaymentType: loan.interest_payment_type,
    interestCalculationType: loan.interest_calculation_type,
    loanAmount: loan.loan_amount,
    installment: loan.installment,
    nominalInterestRate: loan.nominal_interest_rate,
    gracePeriodPrincipal: loan.grace_period_principal,
    gracePeriodInterestPay: loan.grace_period_interest_pay,
    gracePeriodInterestCalculate: loan.grace_period_interest_calculate,
    gracePeriodBalloon: loan.grace_period_balloon,
    feePercentUpfront: loan.fee_percent_upfront,
    feePercentOngoing: loan.fee_percent_ongoing,
    feeFixedUpfront: loan.fee_fixed_upfront,
    feeFixedOngoing: loan.fee_fixed_ongoing,
    taxPercentFees: loan.tax_percent_fees,
    taxPercentInterest: loan.tax_percent_interest,
    insurancePercentUpfront: loan.insurance_percent_upfront,
    insurancePercentOngoing: loan.insurance_percent_ongoing,
    insuranceFixedUpfront: loan.insurance_fixed_upfront,
    insuranceFixedOngoing: loan.insurance_fixed_ongoing,
    securityDepositPercentUpfront: loan.security_deposit_percent_upfront,
    securityDepositPercentOngoing: loan.security_deposit_percent_ongoing,
    securityDepositFixedUpfront: loan.security_deposit_fixed_upfront,
    securityDepositFixedOngoing: loan.security_deposit_fixed_ongoing,
    interestPaidOnDepositPercent: loan.interest_paid_on_deposit_percent,
    nominalApr: loan.nominal_apr
  }
}

function convertToApiLoan(reducer) {
  return {
    partner_name: reducer.mfi,
    loan_theme: reducer.loanType,
    product_type: reducer.productType,
    version_num: reducer.versionNum,
    update_name: reducer.updateName,
    start_name: reducer.startName,
    installment_time_period: reducer.installmentTimePeriod,
    repayment_type: reducer.repaymentType,
    interest_time_period: reducer.interestTimePeriod,
    interest_payment_type: reducer.interestPaymentType,
    interest_calculation_type: reducer.interestCalculationType,
    loan_amount: reducer.loanAmount,
    installment: reducer.installment,
    nominal_interest_rate: reducer.nominalInterestRate,
    grace_period_principal: reducer.gracePeriodPrincipal,
    grace_period_interest_pay: reducer.gracePeriodInterestPay,
    grace_period_interest_calculate: reducer.gracePeriodInterestCalculate,
    grace_period_balloon: reducer.gracePeriodBalloon,
    fee_percent_upfront: reducer.feePercentUpfront,
    fee_percent_ongoing: reducer.feePercentOngoing,
    fee_fixed_upfront: reducer.feeFixedUpfront,
    fee_fixed_ongoing: reducer.feeFixedOngoing,
    tax_percent_fees: reducer.taxPercentFees,
    tax_percent_interest: reducer.taxPercentInterest,
    insurance_percent_upfront: reducer.insurancePercentUpfront,
    insurance_percent_ongoing: reducer.insurancePercentOngoing,
    insurance_fixed_upfront: reducer.insuranceFixedUpfront,
    insurance_fixed_ongoing: reducer.insuranceFixedOngoing,
    security_deposit_percent_upfront: reducer.securityDepositPercentUpfront,
    security_deposit_percent_ongoing: reducer.securityDepositPercentOngoing,
    security_deposit_fixed_upfront: reducer.securityDepositFixedUpfront,
    security_deposit_fixed_ongoing: reducer.securityDepositFixedOngoing,
    interest_paid_on_deposit_percent: reducer.interestPaidOnDepositPercent
  }
}

export default {
  convertFromApiLoan,
  convertToApiLoan
}
