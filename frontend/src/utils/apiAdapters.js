function convertFromApiLoan(loan) {
  return {
    mfi: loan.partner,
    loanType: loan.loan_theme,
    productType: loan.product_type,
    versionNum: loan.version_num,

    updateName: loan.update_name,
    startName: loan.start_name,
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
    partner_name: reducer.mfi[0],
    loan_theme: reducer.loanType[0],
    product_type: reducer.productType[0],
    version_num: reducer.versionNum[0],
    update_name: reducer.updateName,
    start_name: reducer.startName[0],
    installment_time_period: reducer.installmentTimePeriod[0],
    repayment_type: reducer.repaymentType[0],
    interest_time_period: reducer.interestTimePeriod[0],
    interest_payment_type: reducer.interestPaymentType[0],
    interest_calculation_type: reducer.interestCalculationType[0],
    loan_amount: reducer.loanAmount[0],
    installment: reducer.installment[0],
    nominal_interest_rate: reducer.nominalInterestRate[0],
    grace_period_principal: reducer.gracePeriodPrincipal[0],
    grace_period_interest_pay: reducer.gracePeriodInterestPay[0],
    grace_period_interest_calculate: reducer.gracePeriodInterestCalculate[0],
    grace_period_balloon: reducer.gracePeriodBalloon[0],
    fee_percent_upfront: reducer.feePercentUpfront[0],
    fee_percent_ongoing: reducer.feePercentOngoing[0],
    fee_fixed_upfront: reducer.feeFixedUpfront[0],
    fee_fixed_ongoing: reducer.feeFixedOngoing[0],
    tax_percent_fees: reducer.taxPercentFees[0],
    tax_percent_interest: reducer.taxPercentInterest[0],
    insurance_percent_upfront: reducer.insurancePercentUpfront[0],
    insurance_percent_ongoing: reducer.insurancePercentOngoing[0],
    insurance_fixed_upfront: reducer.insuranceFixedUpfront[0],
    insurance_fixed_ongoing: reducer.insuranceFixedOngoing[0],
    security_deposit_percent_upfront: reducer.securityDepositPercentUpfront[0],
    security_deposit_percent_ongoing: reducer.securityDepositPercentOngoing[0],
    security_deposit_fixed_upfront: reducer.securityDepositFixedUpfront[0],
    security_deposit_fixed_ongoing: reducer.securityDepositFixedOngoing[0],
    interest_paid_on_deposit_percent: reducer.interestPaidOnDepositPercent[0]
  }
}

export default {
  convertFromApiLoan,
  convertToApiLoan
}
