import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData, resetFormData } from './../actions'
import FindLoan from './../components/FindLoan'

function mapStateToProps(state) {
  console.log(state)
  return {
    formDataReducer: state.formDataReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changedFormData,
      resetFormData
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FindLoan)
