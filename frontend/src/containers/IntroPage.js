import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { resetFormData } from './../actions'
import IntroPage from './../components/IntroPage'

function mapStateToProps(state) {
  // console.log(state)
  return {
    formDataReducer: state.formDataReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetFormData
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroPage)
