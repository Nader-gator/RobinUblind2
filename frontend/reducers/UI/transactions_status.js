import { RECEIVE_TRANSACTION_STATUS } from '../../actions/transaction_actions'


export default (state={},action) => {
  Object.freeze(state)

  switch (action.type) {
    case RECEIVE_TRANSACTION_STATUS:
        return action.response
    default:
      return state
  }
}