import { combineReducers } from 'redux'
import { auth } from '../../Core/onboarding/redux/auth'
import { feed } from '../../Core/socialgraph/feed/redux'
import { userReports } from '../../Core/user-reporting/redux'
import { notifications } from '../../Core/notifications/redux'

const LOG_OUT = 'LOG_OUT'

// combine reducers to build the state
const appReducer = combineReducers({
  //nav: navReducer,
  auth,
  feed,
  notifications,
  userReports,
})

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
