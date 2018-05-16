import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData } from './../actions'
import NewLoan from './../components/NewLoan'

function mapStateToProps(state) {
  return {
    formDataReducer: state.formDataReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changedFormData
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NewLoan)
