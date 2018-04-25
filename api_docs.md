# Kiva Pricing Tool Backend Design

## Schema Design

**LOAN**

|   id  |   partner_id    |   theme_id  |   product_type    |   version_num |   start_date  |   update_date |   start_name  |   update_name |   nominal_apr |   installment_time_period |   repayment_type  |   interest_time_period    | interest_payment    |   interest_calculation_type   |   loan_amount |   installment |   nominal_interest_rate   |   grace_period_principal  | grace_period_interest_pay   |   grace_period_interest_calculate |   grace_period_balloon    |   fee_percent_upfront | fee_percent_ongoing |   fee_fixed_upfront   |   fee_fixed_ongoing   |   insurance_percent_upfront   | insurance_percent_ongoing   |   insurance_fixed_upfront |   insurance_fixed_ongoing |   tax_percent_fees    | tax_percent_interest    |   security_deposit_percent_upfront    |   security_deposit_percent_ongoing    | security_deposit_fixed_upfront  |   security_deposit_fixed_ongoing  |   interest_paid_on_deposit_percent    |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|

**REPAYMENT SCHEDULE**

|   id  |   period_num  |   payment_due_date    |   days    |   amount_due  |   principal_payment   |   interest    |   fees |  insurance   |   taxes   |   security_deposit    |   security_interest_paid  |   balance |   deposit_withdrawal  |   deposit_balance |   total_cashflow  | payment_due_date_user    |   days_user    |   amount_due_user  |   principal_payment_user   |   interest_user    |   fees_user    |   insurance_user   |   taxes_user   |   security_deposit_user    |   security_interest_paid_user  |   balance_user |   deposit_withdrawal_user  |   deposit_balance_user |   total_cashflow_user  | payment_due_date_calc    |   days_calc    |   amount_due_calc  |   principal_payment_calc   |   interest_calc    |   fees_calc    |   insurance_calc   |   taxes_calc   |   security_deposit_calc    |   security_interest_paid_calc  |   balance_calc |   deposit_withdrawal_calc  |   deposit_balance_calc |   total_cashflow_calc  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|

**PARTNER**

|   id  |   partner_name   |  last_modified |   active  |
|:------:|:-------:|:------:|:-------:|

**THEME**

|   id  |   loan_theme   | last_modified |  active  |
|:------:|:---------:|:------:|:---------:|



## Endpoints Documentation 

PARTNER AND THEME LISTS: 
* GET /partnerThemeLists | done

CREATE AND SAVE LOAN: 
* GET /getVersionNum | done
* POST /saveNewLoan | done

FIND LOAN:
* GET /getMFIEntry
* GET /getLTEntry
* GET /getPTEntry
* GET /getVersionNumEntry
* GET /findLoan

CALCULATE REPAYMENT SCHEDULE AND APR:
* POST /calculateAPR | done
* POST /recalculate

ADMIN TOOLS PARTNERS:
* GET /getAllMFI
* PUT /editMFI/<partner_name>
* POST /addMFI
* DELETE /removeMFI/<partner_name>

ADMIN TOOLS THEMES:
* GET /getAllLT
* PUT /editLT/<loan_theme>
* POST /addLT
* DELETE /removeLT/<loan_theme>



## Conventions
This API will follow the [H4I REST API Spec](https://github.com/hack4impact-uiuc/wiki/wiki/Our-REST-API-Specification).

All `GET` request parameters should be query parameters.

All `POST` and `PUT` request parameters should be body parameters.

### Endpoint

    GET /partnerThemeLists

**Description**

Get a list of all MFI Partners and Loan Themes

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        themes: [...],
        partners: [...]
      }
    }

### Endpoint

    GET /getVersionNum
    
**Description**

Get loan data for a specified loan in CSV format.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
| partner_namE  | string | **Required** | Filter Loans by Partner 
| theme  | string | **Required** | Filter Loans by Theme 
| product  | string | **Required** | Filter Loans by Product 

**Response**
    
    {
      success: true,
      code: 200,
      message: '',
      result: {
        version_num: 4
      }
    }
 
### Endpoint

    POST /saveLoan
    
**Description**

Puts a new loan in the database.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   partner_name    | string | **Required** | description 
|   loan_theme  | string | **Required** | description 
|   product_type    | string | **Required** | description 
|   version_num | number | **Required** | description 
|   start_name  | string | **Required** | description 
|   update_name | string | **Required** | description 
|   nominal_apr | number | **Required** | description 
|   installment_time_period | string | **Required** | description 
|   repayment_type  | string | **Required** | description 
|   interest_time_period    | string | **Required** | description 
|   interest_payment    | string | **Required** | description 
|   interest_calculation_type   | string | **Required** | description 
|   loan_amount | number | **Required** | description 
|   installment | number | **Required** | description 
|   nominal_interest_rate   | number | **Required** | description 
|   grace_period_principal  | number | **Required** | description 
|   grace_period_interest_pay   | number | **Required** | description 
|   grace_period_interest_calculate | number | **Required** | description 
|   grace_period_balloon    | number | **Required** | description 
|   fee_percent_upfront | number | **Required** | description 
|   fee_percent_ongoing | number | **Required** | description 
|   fee_fixed_upfront   | number | **Required** | description 
|   fee_fixed_ongoing   | number | **Required** | description 
|   insurance_percent_upfront   | number | **Required** | description 
|   insurance_percent_ongoing   | number | **Required** | description 
|   insurance_fixed_upfront | number | **Required** | description 
|   insurance_fixed_ongoing | number | **Required** | description 
|   tax_percent_fees    | number | **Required** | description 
|   tax_percent_interest    | number | **Required** | description 
|   security_deposit_percent_upfront    | number | **Required** | description 
|   security_deposit_percent_ongoing    | number | **Required** | description 
|   security_deposit_fixed_upfront  | number | **Required** | description 
|   security_deposit_fixed_ongoing  | number | **Required** | description 
|   interest_paid_on_deposit_percent    | number | **Required** | description 

**Response**
    
    {
      success: true,
      code: 201,
      message: '',
      result: {}
    }

### Endpoint

    GET /getMFIEntry
    
**Description**

Get all partner entries saved in the database.

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        partners: [...]
      }
    }
  
### Endpoint

    GET /getLTEntry
    
**Description**

Get all loan theme entries corresponding to the correct partner saved in the database.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   partner_name    | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        themes: [...]
      }
    }
  

### Endpoint

    GET /getPTEntry
    
**Description**

Get all product type entries corresponding to the correct partner and loan theme saved in the database.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   partner_name    | string | **Required** | description 
|   loan_theme  | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        product_types: [...]
      }
    }
  
### Endpoint

    GET /getVersionNumEntry
    
**Description**

Get all version number entries corresponding to the correct partner, loan theme, and product type saved in the database.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   partner_name    | string | **Required** | description 
|   loan_theme  | string | **Required** | description 
|   product_type    | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        version_nums: [...]
      }
    }
  
### Endpoint

    GET /findLoan
    
**Description**

Get all version number entries corresponding to the correct partner, loan theme, and product type saved in the database.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   partner_name    | string | **Required** | description 
|   loan_theme  | string | **Required** | description 
|   product_type    | string | **Required** | description 
|   version_num | number | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        partner,
        loan_theme,
        product_type,
        version_num,
        start_date,
        update_date,
        start_name,
        update_name,
        nominal_apr,
        installment_time_period,
        repayment_type,
        interest_time_period,
        interest_payment_type,
        interest_calculation_type,
        loan_amount,
        installment,
        nominal_interest_rate,
        grace_period_principal,
        grace_period_interest_pay,
        grace_period_interest_calculate,
        grace_period_balloon,
        fee_percent_upfront,
        fee_percent_ongoing,
        fee_fixed_upfront,
        fee_fixed_ongoing,
        insurance_percent_upfront,
        insurance_percent_ongoing,
        insurance_fixed_upfront,
        insurance_fixed_ongoing,
        tax_percent_fees,
        tax_percent_interest,
        security_deposit_percent_upfront,
        security_deposit_percent_ongoing,
        security_deposit_fixed_upfront,
        security_deposit_fixed_ongoing,
        interest_paid_on_deposit_percent,
        original_matrix,
        user_matrix,
        calc_matrix
      }
    }

### Endpoint

    POST /calculateAPR
    
**Description**

Calculate APR rate based on given entries.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   installment_time_period | string | **Required** | description 
|   repayment_type  | string | **Required** | description 
|   interest_time_period    | string | **Required** | description 
|   interest_payment    | string | **Required** | description 
|   interest_calculation_type   | string | **Required** | description 
|   loan_amount | number | **Required** | description 
|   installment | number | **Required** | description 
|   nominal_interest_rate   | number | **Required** | description 
|   grace_period_principal  | number | **Required** | description 
|   grace_period_interest_pay   | number | **Required** | description 
|   grace_period_interest_calculate | number | **Required** | description 
|   grace_period_balloon    | number | **Required** | description 
|   fee_percent_upfront | number | **Required** | description 
|   fee_percent_ongoing | number | **Required** | description 
|   fee_fixed_upfront   | number | **Required** | description 
|   fee_fixed_ongoing   | number | **Required** | description 
|   insurance_percent_upfront   | number | **Required** | description 
|   insurance_percent_ongoing   | number | **Required** | description 
|   insurance_fixed_upfront | number | **Required** | description 
|   insurance_fixed_ongoing | number | **Required** | description 
|   tax_percent_fees    | number | **Required** | description 
|   tax_percent_interest    | number | **Required** | description 
|   security_deposit_percent_upfront    | number | **Required** | description 
|   security_deposit_percent_ongoing    | number | **Required** | description 
|   security_deposit_fixed_upfront  | number | **Required** | description 
|   security_deposit_fixed_ongoing  | number | **Required** | description 
|   interest_paid_on_deposit_percent    | number | **Required** | description 

**Response**
    
    {
      success: true,
      code: 200,
      message: '',
      result: {
        apr: .0345
      }
    }



### Endpoint

    GET /recalculate
    
**Description**

Recalculate repayment schedule based on user inputs.

**Parameters**

**Response**




### Endpoint

    GET /getAllMFI
    
**Description**

Gets list of active partners.

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        partners: [...]
      }
    }
  
### Endpoint

    PUT /editMFI/<partner_name>
    
**Description**

Edit a current partner.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   updated_partner_name | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: 'Update Successful',
      result: {}
    }
    
### Endpoint

    POST /addMFI
    
**Description**

Add a partner to the list.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   partner_name | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: 'Post Successful',
      result: {}
    }
    
### Endpoint

    DELETE /removeMFI/<partner_name>
    
**Description**

Set a partner's status to inactive and "remove" it from the list.

**Response**

    {
      success: true,
      code: 200,
      message: 'Update Successful',
      result: {}
    }
    
### Endpoint

    GET /getAllLT
    
**Description**

Gets list of active loan themes.

**Response**

    {
      success: true,
      code: 200,
      message: '',
      result: {
        loan_theme: [...]
      }
    }

### Endpoint

    PUT /editLT/<loan_theme>
    
**Description**

Edit a current loan theme.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   updated_loan_theme | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: 'Update Successful',
      result: {}
    }

### Endpoint

    POST /addLT
    
**Description**

Add a loan theme to the list.

**Parameters**

|   Name    |  Type  | Required                      | Description               |
|:---------:|:------:|:-----------------------------:|:-------------------------:|
|   updated_loan_theme | string | **Required** | description 

**Response**

    {
      success: true,
      code: 200,
      message: 'Post Successful',
      result: {}
    }

### Endpoint

    DELETE /removeLT/<loan_theme>
    
**Description**

Set a loan theme's status to inactive and "remove" it from the list.

**Response**

    {
      success: true,
      code: 200,
      message: 'Update Successful',
      result: {}
    }
