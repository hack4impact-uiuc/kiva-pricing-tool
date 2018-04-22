import axios from 'axios'
import adapters from './apiAdapters'

function camelCase(param) {
  let terms = param.split('_')
  if (terms.length == 1) return terms

  for (var i = 1; i < terms.length; i++) {
    terms[i] = terms[i].charAt(0).toUpperCase() + terms[i].slice(1)
  }

  return terms.join('')
}

// function pep(param) {

// }

// function convertFromApi(param) {
//     return camelCase(param)
// }

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
  // console.log('he')
  // const { formDataReducer, changedFormData } = this.props
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

export default {
  getProductType,
  getVersionNum,
  searchLoan
}
