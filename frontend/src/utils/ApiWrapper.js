import axios from 'axios'
import adapters from './apiAdapters'
import Variables from './Variables'

function getProductType(mfi, loanType) {
  return axios
    .get(
      Variables.flaskURL +
        'getPTEntry?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType
    )
    .then(response => {
      return response.data.result.product_types
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function getVersionNumEntries(mfi, loanType, productType) {
  return axios
    .get(
      Variables.flaskURL +
        'getVersionNumEntry?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType +
        '&product_type=' +
        productType
    )
    .then(response => {
      return response.data.result.version_nums.map(String)
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function getVersionNum(mfi, loanType, productType) {
  return axios
    .get(
      Variables.flaskURL +
        'getVersionNum?partner_name=' +
        mfi +
        '&theme=' +
        loanType +
        '&product=' +
        productType
    )
    .then(response => {
      return response.data.result
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function searchLoan(mfi, loanType, productType, versionNum) {
  return axios
    .get(
      Variables.flaskURL +
        'findLoan?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType +
        '&product_type=' +
        productType +
        '&version_num=' +
        versionNum
    )
    .then(response => {
      console.log(response.data.result)
      return adapters.convertFromApiLoan(response.data.result)
      // return response
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function getTable(mfi, loanType, productType, versionNum) {
  return axios
    .get(
      Variables.flaskURL +
        'findLoan?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType +
        '&product_type=' +
        productType +
        '&version_num=' +
        versionNum
    )
    .then(response => {
      let converted = adapters.convertFromApiLoan(response.data.result)
      console.log(converted)
      console.log(response.data)
      // return adapters.convertFromApiLoan(response.data.result)
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function calAPR(reducerData) {
  return axios
    .post(
      Variables.flaskURL + 'calculateAPR',
      adapters.convertToApiLoan(reducerData)
    )
    .then(response => {
      return response.data.result
    })
    .catch(function(error) {
      console.log(error + ' there was an error with the request')
    })
}

function saveLoan(payload, inputs) {
  payload.inputs = adapters.convertToApiLoan(inputs)
  return axios
    .post(Variables.flaskURL + 'saveNewLoan', payload)
    .then(response => {
      return response
    })
    .catch(function(error) {
      console.log(error + ' there was an error with the request')
    })
}

function recalculate(payload, inputs) {
  payload.input_form = adapters.convertToApiLoan(inputs)
  return axios
    .post(Variables.flaskURL + 'recalculate', payload)
    .then(response => {
      return response
    })
    .catch(function(error) {
      console.log(error + ' there was an error with the request')
    })
}

export default {
  getProductType,
  getVersionNumEntries,
  getVersionNum,
  searchLoan,
  calAPR,
  saveLoan,
  recalculate
}
