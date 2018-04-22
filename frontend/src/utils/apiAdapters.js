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
    aprRate: loan.nominal_apr
  }
}

export default {
  convertFromApiLoan
}
