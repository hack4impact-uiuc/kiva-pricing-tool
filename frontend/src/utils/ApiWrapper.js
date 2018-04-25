import axios from 'axios'
import adapters from './apiAdapters'

function getProductType(mfi, loanType) {
  axios
    .get(
      'http://127.0.0.1:3453/getPTEntry?partner_name=' +
        mfi +
        '&loan_theme=' +
        loanType
    )
    .then(response => {
      return response.data.result.product_types
    })
}

function getVersionNum(mfi, loanType, productType) {
  axios
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
}
// search for a given loan
function searchLoan(mfi, loanType, productType, versionNum) {
  // changedFormData('back', 'findloan')
  // -> keep this in the corresponding functions in each page
  let valid = false
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
      return adapters.convertFromApiLoan(response.data.result)
    })
    .catch(function(error) {
      console.log('ERROR: ', error)
      return null
    })
}

function postData(data) {
  axios
    .post('http://127.0.0.1:3453/calculateAPR', adapters.convertToApiLoan(data))
    .then(response => {
      return response.data.result.apr.toString()
      // data['nominal_apr'] = apr.toString()
      // changedFormData('nominalApr', apr)
    })
    .catch(function(error) {
      console.log(
        error + ' there was an error with the request' + data.start_name
      )
    })
}

export default {
  getProductType,
  getVersionNum,
  searchLoan,
  postData
}
