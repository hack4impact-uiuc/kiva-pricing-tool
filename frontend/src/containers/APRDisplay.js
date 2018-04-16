import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changedFormData } from './../actions'
import APRRateDisplay from './../components/APRRateDisplay'

function mapStateToProps(state) {
  // console.log(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(APRRateDisplay)
