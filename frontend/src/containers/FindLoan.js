import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData, resetFormData, searchLoan } from './../actions'
import FindLoan from './../components/FindLoan'

function mapStateToProps(state) {
  return {
    formDataReducer: state.formDataReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changedFormData,
      resetFormData,
      searchLoan
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FindLoan)
