import axios from 'axios'
import adapters from './apiAdapters'

function getProductType(mfi, loanType) {
  return axios
    .get(
      'http://127.0.0.1:3453/getPTEntry?partner_name=' +
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
      'http://127.0.0.1:3453/getVersionNumEntry?partner_name=' +
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
      'http://127.0.0.1:3453/getVersionNum?partner_name=' +
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
      'http://127.0.0.1:3453/findLoan?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType +
        '&product_type=' +
        productType +
        '&version_num=' +
        versionNum
    )
    .then(response => {
      return response
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function getTable(mfi, loanType, productType, versionNum) {
  return axios
    .get(
      'http://127.0.0.1:3453/findLoan?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType +
        '&product_type=' +
        productType +
        '&version_num=' +
        versionNum
    )
    .then(response => {
      // console.log(response.data.result)
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
      'http://127.0.0.1:3453/calculateAPR',
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
    .post('http://127.0.0.1:3453/saveNewLoan', payload)
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
    .post('http://127.0.0.1:3453/recalculate', payload)
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
