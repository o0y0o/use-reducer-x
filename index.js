import { useState } from 'react'

function compose(...fns) {
  if (fns.length === 0) return arg => arg
  if (fns.length === 1) return fns[0]
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

function useEnhancedReducer(reducer, initialState, middlewares = []) {
  const hook = useState(initialState)
  let state = hook[0]
  const setState = hook[1]
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
  const enhancedDispatch = compose.apply(void 0, chain)(store.dispatch)
  return [state, enhancedDispatch]
}

export default useEnhancedReducer
