import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData } from './../actions'
import APRInputs from './../components/APRInputs'

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

export default connect(mapStateToProps, mapDispatchToProps)(APRInputs)
