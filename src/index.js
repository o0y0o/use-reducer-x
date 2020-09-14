import { useRef, useState } from 'react'

function compose(...fns) {
  if (fns.length === 0) return arg => arg
  if (fns.length === 1) return fns[0]
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

function useReducerX(reducer, initialState, middlewares = []) {
  const hook = useState(initialState)
  const state = hook[0]
  const setState = hook[1]
  const draftState = useRef(initialState)

  const dispatch = action => {
    draftState.current = reducer(draftState.current, action)
    setState(draftState.current)
    return action
  }
  const store = {
    getState: () => draftState.current,
    dispatch: (...args) => enhancedDispatch(...args)
  }
  const chain = middlewares.map(middleware => middleware(store))
  const enhancedDispatch = compose.apply(undefined, chain)(dispatch)

  return [state, enhancedDispatch]
}

export default useReducerX
