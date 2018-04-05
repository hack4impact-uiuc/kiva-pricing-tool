import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { contNewLoan, changedFormData } from './../actions'
import FormZero from './../components/FormZero'

function mapStateToProps(state) {
  return {
    formDataReducer: state.formDataReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      contNewLoan,
      changedFormData
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FormZero)
