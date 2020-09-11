import { useRef, useState } from 'react'

function compose(...fns) {
  if (fns.length === 0) return arg => arg
  if (fns.length === 1) return fns[0]
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

function useEnhancedReducer(reducer, initialState, middlewares = []) {
  const hook = useState(initialState)
  const draftState = useRef(initialState)

  const dispatch = action => {
    hook[1](prevState => {
      draftState.current = reducer(prevState, action)
      return draftState.current
    })
    return action
  }
  const store = {
    getState: () => draftState.current,
    dispatch: (...args) => enhancedDispatch(...args)
  }
  const chain = middlewares.map(middleware => middleware(store))
  const enhancedDispatch = compose.apply(undefined, chain)(dispatch)

  return [hook[0], enhancedDispatch]
}

export default useEnhancedReducer
