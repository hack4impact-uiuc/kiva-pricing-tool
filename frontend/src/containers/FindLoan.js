import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData, searchLoan } from './../actions'
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
      searchLoan
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FindLoan)
