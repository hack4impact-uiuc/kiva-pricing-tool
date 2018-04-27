import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData, resetFormData } from './../actions'
import NewLoan from './../components/NewLoan'

function mapStateToProps(state) {
  // console.log(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(NewLoan)
