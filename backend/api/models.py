from api import db
from sqlalchemy.dialects.postgresql import JSON
from flask_sqlalchemy import SQLAlchemy
import datetime

# db = SQLAlchemy()

class Partner(db.Model):
    """Partner"""
    __tablename__ = "partner"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    partner_name = db.Column(db.String, unique=True)
    last_modified = db.Column(db.Date, nullable=False)
    active = db.Column(db.Boolean)

    def __init__(self, data):
        if not all(x in data for x in ['partner_name']):
            return #handle error
        self.partner_name = data['partner_name']
        self.last_modified = datetime.datetime.now()
        self.active = True
        partners = Partner.query.all()
        if partners:
            self.id = max(partners, key=lambda x: x.id).id + 1
        else:
            self.id = 1

    def update(self):
        self.last_modified = datetime.datetime.now()

    def __repr__(self):
        return '<partner {}>'.format(self.partner_name)

class Theme(db.Model):
    """Theme"""
    __tablename__ = "theme"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    loan_theme = db.Column(db.String, unique=True)
    last_modified = db.Column(db.Date, nullable=False)
    active = db.Column(db.Boolean)


    def __init__(self, data):
        if not all(x in data for x in ['loan_theme']):
            return #handle error
        self.loan_theme = data['loan_theme']
        self.last_modified = datetime.datetime.now()
        self.active = True
        themes = Theme.query.all()
        if themes:
            self.id = max(themes, key=lambda x: x.id).id + 1
        else:
            self.id = 1

    def update(self):
        self.last_modified = datetime.datetime.now()

    def __repr__(self):
        return '<theme {}>'.format(self.loan_theme)

class Loan(db.Model):
    """Loan"""
    __tablename__ = "loan"

    id = db.Column(db.String, unique=True, primary_key=True) #MFI-Partner-ID_Loan-theme-ID_Product-type_Version-num
    partner_id = db.Column(db.Integer, nullable=False)
    theme_id = db.Column(db.Integer, nullable=False)
    product_type = db.Column(db.String, nullable=False)
    version_num = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    update_date = db.Column(db.Date, nullable=False)
    start_name = db.Column(db.String, nullable=False)
    update_name = db.Column(db.String, nullable=False)
    nominal_apr = db.Column(db.Float, nullable=False)

    installment_time_period = db.Column(db.String, nullable=False)
    repayment_type = db.Column(db.String, nullable=False)
    interest_time_period = db.Column(db.String, nullable=False)
    interest_payment_type = db.Column(db.String, nullable=False)
    interest_calculation_type = db.Column(db.String, nullable=False)
    loan_amount = db.Column(db.Float, nullable=False)
    installment = db.Column(db.Integer, nullable=False)
    nominal_interest_rate = db.Column(db.Float, nullable=False)
    grace_period_principal = db.Column(db.Integer, nullable=False)
    grace_period_interest_pay = db.Column(db.Integer, nullable=False)
    grace_period_interest_calculate = db.Column(db.Integer, nullable=False)
    grace_period_balloon = db.Column(db.Integer, nullable=False)
    fee_percent_upfront = db.Column(db.Float, nullable=False)
    fee_percent_ongoing = db.Column(db.Float, nullable=False)
    fee_fixed_upfront = db.Column(db.Float, nullable=False)
    fee_fixed_ongoing = db.Column(db.Float, nullable=False)
    insurance_percent_upfront = db.Column(db.Float, nullable=False)
    insurance_percent_ongoing = db.Column(db.Float, nullable=False)
    insurance_fixed_upfront = db.Column(db.Float, nullable=False)
    insurance_fixed_ongoing = db.Column(db. Float, nullable=False)
    tax_percent_fees = db.Column(db.Float, nullable=False)
    tax_percent_interest = db.Column(db.Float, nullable=False)
    security_deposit_percent_upfront = db.Column(db.Float, nullable=False)
    security_deposit_percent_ongoing = db.Column(db.Float, nullable=False)
    security_deposit_fixed_upfront = db.Column(db.Float, nullable=False)
    security_deposit_fixed_ongoing = db.Column(db.Float, nullable=False)
    interest_paid_on_deposit_percent = db.Column(db.Float, nullable=False)


    def __init__(self, data):
        if not all(x in data for x in ['partner_name','loan_theme','product_type','version_num','start_name','update_name','nominal_apr','installment_time_period'
                                        ,'repayment_type','interest_time_period','interest_payment_type','interest_calculation_type','loan_amount','installment','nominal_interest_rate','grace_period_principal'
                                        ,'grace_period_interest_pay','grace_period_interest_calculate','grace_period_balloon','fee_percent_upfront','fee_percent_ongoing','fee_fixed_upfront'
                                        ,'fee_fixed_ongoing','insurance_percent_upfront','insurance_percent_ongoing','insurance_fixed_upfront','insurance_fixed_ongoing','tax_percent_fees'
                                        ,'tax_percent_interest','security_deposit_percent_upfront','security_deposit_percent_ongoing','security_deposit_fixed_upfront','security_deposit_fixed_ongoing'
                                        ,'interest_paid_on_deposit_percent']):
            return #handle error

        self.partner_id = Partner.query.filter_by(partner_name = data['partner_name']).first().id
        self.theme_id = Theme.query.filter_by(loan_theme = data['loan_theme']).first().id
        self.id = str(self.partner_id) + "_" + str(self.theme_id) + "_" + data['product_type'] + "_" + str(data['version_num'])
        self.product_type = data['product_type']
        self.version_num = data['version_num']
        self.start_date = datetime.datetime.now()
        self.update_date = datetime.datetime.now()
        self.start_name = data['start_name']
        self.update_name = data['update_name']
        self.nominal_apr = data['nominal_apr']
        self.installment_time_period = data['installment_time_period']
        self.repayment_type = data['repayment_type']
        self.interest_time_period = data['interest_time_period']
        self.interest_payment_type = data['interest_payment_type']
        self.interest_calculation_type = data['interest_calculation_type']
        self.loan_amount = data['loan_amount']
        self.installment = data['installment']
        self.nominal_interest_rate = data['nominal_interest_rate']
        self.grace_period_principal = data['grace_period_principal']
        self.grace_period_interest_pay = data['grace_period_interest_pay']
        self.grace_period_interest_calculate = data['grace_period_interest_calculate']
        self.grace_period_balloon = data['grace_period_balloon']
        self.fee_percent_upfront = data['fee_percent_upfront']
        self.fee_percent_ongoing = data['fee_percent_ongoing']
        self.fee_fixed_upfront = data['fee_fixed_upfront']
        self.fee_fixed_ongoing = data['fee_fixed_ongoing']
        self.insurance_percent_upfront = data['insurance_percent_upfront']
        self.insurance_percent_ongoing = data['insurance_percent_ongoing']
        self.insurance_fixed_upfront = data['insurance_fixed_upfront']
        self.insurance_fixed_ongoing = data['insurance_fixed_ongoing']
        self.tax_percent_fees = data['tax_percent_fees']
        self.tax_percent_interest = data['tax_percent_interest']
        self.security_deposit_percent_upfront = data['security_deposit_percent_upfront']
        self.security_deposit_percent_ongoing = data['security_deposit_percent_ongoing']
        self.security_deposit_fixed_upfront = data['security_deposit_fixed_upfront']
        self.security_deposit_fixed_ongoing = data['security_deposit_fixed_ongoing']
        self.interest_paid_on_deposit_percent = data['interest_paid_on_deposit_percent']

    def update(self):
        self.update_date = datetime.datetime.now()

    def __repr__(self):
        return '<loan {}>'.format(self.id)

    def __dir__(self):
        return ['partner_id','theme_id','product_type','version_num','start_name','update_name','nominal_apr','installment_time_period', 'start_date', 'update_date'
                ,'repayment_type','interest_time_period','interest_payment_type','interest_calculation_type','loan_amount','installment','nominal_interest_rate','grace_period_principal'
                ,'grace_period_interest_pay','grace_period_interest_calculate','grace_period_balloon','fee_percent_upfront','fee_percent_ongoing','fee_fixed_upfront'
                ,'fee_fixed_ongoing','insurance_percent_upfront','insurance_percent_ongoing','insurance_fixed_upfront','insurance_fixed_ongoing','tax_percent_fees'
                ,'tax_percent_interest','security_deposit_percent_upfront','security_deposit_percent_ongoing','security_deposit_fixed_upfront','security_deposit_fixed_ongoing'
                ,'interest_paid_on_deposit_percent']

class RepaymentSchedule(db.Model):
    """RepaymentSchedule"""
    __tablename__ = "repayment_schedule"

    id = db.Column(db.String,nullable=False) #MFI_Partner + Loan_theme + Product_type + Version_num
    period_num = db.Column(db.Integer, nullable = False)
    pkey = db.Column(db.String, unique=True, primary_key=True)

    payment_due_date = db.Column(db.Date, nullable=False)
    days = db.Column(db.Integer, nullable=False)
    amount_due = db.Column(db.Float, nullable=False)
    principal_payment = db.Column(db.Float, nullable=False)
    interest = db.Column(db.Float, nullable=False)
    fees = db.Column(db.Float, nullable=False)
    insurance = db.Column(db.Float, nullable=False)
    taxes = db.Column(db.Float, nullable=False)
    security_deposit = db.Column(db.Float, nullable=False)
    security_interest_paid = db.Column(db.Float, nullable=False)
    balance = db.Column(db.Float, nullable=False)
    deposit_withdrawal = db.Column(db.Float, nullable=False)
    deposit_balance = db.Column(db.Float, nullable=False)
    total_cashflow = db.Column(db.Float, nullable=False)

    payment_due_date_user = db.Column(db.Date, nullable=True)
    days_user = db.Column(db.Integer, nullable=True)
    amount_due_user = db.Column(db.Float, nullable=True)
    principal_payment_user = db.Column(db.Float, nullable=True)
    interest_user = db.Column(db.Float, nullable=True)
    fees_user = db.Column(db.Float, nullable=True)
    insurance_user = db.Column(db.Float, nullable=True)
    taxes_user = db.Column(db.Float, nullable=True)
    security_deposit_user = db.Column(db.Float, nullable=True)
    security_interest_paid_user = db.Column(db.Float, nullable=True)
    balance_user = db.Column(db.Float, nullable=True)
    deposit_withdrawal_user = db.Column(db.Float, nullable=True)
    deposit_balance_user = db.Column(db.Float, nullable=True)
    total_cashflow_user = db.Column(db.Float, nullable=True)

    payment_due_date_calc = db.Column(db.Date, nullable=False)
    days_calc = db.Column(db.Integer, nullable=False)
    amount_due_calc = db.Column(db.Float, nullable=False)
    principal_payment_calc = db.Column(db.Float, nullable=False)
    interest_calc = db.Column(db.Float, nullable=False)
    fees_calc = db.Column(db.Float, nullable=False)
    insurance_calc = db.Column(db.Float, nullable=False)
    taxes_calc = db.Column(db.Float, nullable=False)
    security_deposit_calc = db.Column(db.Float, nullable=False)
    security_interest_paid_calc = db.Column(db.Float, nullable=False)
    balance_calc = db.Column(db.Float, nullable=False)
    deposit_withdrawal_calc = db.Column(db.Float, nullable=False)
    deposit_balance_calc = db.Column(db.Float, nullable=False)
    total_cashflow_calc = db.Column(db.Float, nullable=False)

    def __init__(self, data):
        if not all(x in data for x in ['id','period_num','payment_due_date','days','amount_due','principal_payment','interest',
                                        'fees','insurance','taxes','security_deposit','security_interest_paid','balance','deposit_balance','deposit_withdrawal','total_cashflow',
                                        'payment_due_date_user','days_user','amount_due_user','principal_payment_user','interest_user',
                                        'fees_user','insurance_user','taxes_user','security_deposit_user','security_interest_paid_user','balance_user','deposit_balance_user','deposit_withdrawal_user','total_cashflow_user',
                                        'payment_due_date_calc','days_calc','amount_due_calc','principal_payment_calc','interest_calc',
                                        'fees_calc','insurance_calc','taxes_calc','security_deposit_calc','security_interest_paid_calc','balance_calc','deposit_balance_calc','deposit_withdrawal_calc','total_cashflow_calc']):
            for x in ['id','period_num','payment_due_date','days','amount_due','principal_payment','interest',
                    'fees','insurance','taxes','security_deposit','security_interest_paid','balance','deposit_balance','deposit_withdrawal','total_cashflow',
                    'payment_due_date_user','days_user','amount_due_user','principal_payment_user','interest_user',
                    'fees_user','insurance_user','taxes_user','security_deposit_user','security_interest_paid_user','balance_user','deposit_balance_user','deposit_withdrawal_user','total_cashflow_user',
                    'payment_due_date_calc','days_calc','amount_due_calc','principal_payment_calc','interest_calc',
                    'fees_calc','insurance_calc','taxes_calc','security_deposit_calc','security_interest_paid_calc','balance_calc','deposit_balance_calc','deposit_withdrawal_calc','total_cashflow_calc']:
                if x not in data:
                    print(x)
            return #handle error
        self.id = data['id']
        self.period_num = data['period_num']
        self.pkey = self.id + "_" + str(self.period_num)

        self.payment_due_date = data['payment_due_date']
        self.days = data['days']
        self.amount_due = data['amount_due']
        self.principal_payment = data['principal_payment']
        self.balance = data['balance']
        self.interest = data['interest']
        self.fees = data['fees']
        self.insurance = data['insurance']
        self.taxes = data['taxes']
        self.security_deposit = data['security_deposit']
        self.security_interest_paid= data['security_interest_paid']
        self.deposit_balance = data['deposit_balance']
        self.deposit_withdrawal = data['deposit_withdrawal']
        self.total_cashflow = data['total_cashflow']

        self.payment_due_date_user = data['payment_due_date_user']
        self.days_user = data['days_user']
        self.amount_due_user = data['amount_due_user']
        self.principal_payment_user = data['principal_payment_user']
        self.balance_user = data['balance_user']
        self.interest_user = data['interest_user']
        self.fees_user = data['fees_user']
        self.insurance_user = data['insurance_user']
        self.taxes_user = data['taxes_user']
        self.security_deposit_user = data['security_deposit_user']
        self.security_interest_paid_user = data['security_interest_paid_user']
        self.deposit_balance_user = data['deposit_balance_user']
        self.deposit_withdrawal_user = data['deposit_withdrawal_user']
        self.total_cashflow_user = data['total_cashflow_user']

        self.payment_due_date_calc = data['payment_due_date_calc']
        self.days_calc = data['days_calc']
        self.amount_due_calc = data['amount_due_calc']
        self.principal_payment_calc = data['principal_payment_calc']
        self.balance_calc = data['balance_calc']
        self.interest_calc = data['interest_calc']
        self.fees_calc = data['fees_calc']
        self.insurance_calc = data['insurance_calc']
        self.taxes_calc = data['taxes_calc']
        self.security_deposit_calc = data['security_deposit_calc']
        self.security_interest_paid_calc = data['security_interest_paid_calc']
        self.deposit_balance_calc = data['deposit_balance_calc']
        self.deposit_withdrawal_calc = data['deposit_withdrawal_calc']
        self.total_cashflow_calc = data['total_cashflow_calc']

    def __repr__(self):
        return '<repayment {}>'.format(self.id)
