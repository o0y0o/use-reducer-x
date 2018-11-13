import { useState } from 'react'

function compose(...fns) {
  if (fns.length === 0) return arg => arg
  if (fns.length === 1) return fns[0]
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

function useEnhancedReducer(reducer, initialState, middlewares = []) {
  let [state, setState] = useState(initialState)
  const store = {
    getState: () => {
      return state
    },
    dispatch: action => {
      state = reducer(state, action)
      setState(state)
      return action
    }
  }
  const chain = middlewares.map(middleware => middleware(store))
  const enhancedDispatch = compose(...chain)(store.dispatch)
  return [state, enhancedDispatch]
}

export default useEnhancedReducer
