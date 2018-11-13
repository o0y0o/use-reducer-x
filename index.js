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
  const dispatch = action => {
    state = reducer(state, action)
    setState(state)
    return action
  }
  let enhancedDispatch
  const store = {
    getState: () => state,
    dispatch: (...args) => enhancedDispatch(...args)
  }
  const chain = middlewares.map(middleware => middleware(store))
  enhancedDispatch = compose.apply(void 0, chain)(dispatch)
  return [state, enhancedDispatch]
}

export default useEnhancedReducer
