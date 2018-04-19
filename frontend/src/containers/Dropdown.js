import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData } from './../actions'
import Dropdown from './../components/Dropdown'

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

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
