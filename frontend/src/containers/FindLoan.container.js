import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  submitFindLoan,
  backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong
} from './../actions'
import FindLoan from './../components/FindLoan'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      submitFindLoan,
      backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FindLoan)
