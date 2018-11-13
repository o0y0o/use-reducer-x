import React from 'react'
import useEnhancedReducer from 'react-enhanced-reducer-hook'
import thunkMiddleware from 'redux-thunk'

function logMiddleware({ getState }) {
  return next => action => {
    console.log('Prev State:', getState())
    console.log('Action:', action)
    next(action)
    console.log('Next State:', getState())
  }
}

function gaMiddleware({ getState }) {
  return next => action => {
    window.ga && window.ga('send', 'event', 'Action', action.type)
    next(action)
  }
}

function useAppReducer(reducer, inititalState) {
  return useEnhancedReducer(reducer, inititalState, [
    thunkMiddleware,
    logMiddleware,
    gaMiddleware
  ])
}

function counterReducer(state, action) {
  switch (action.type) {
    case '+1':
      return { count: state.count + 1 }
    case '-1':
      return { count: state.count - 1 }
    case '0':
      return { count: 0 }
    default:
      return state
  }
}

function resetCounterAfter1Second() {
  return dispatch =>
    setTimeout(() => {
      dispatch({ type: '0' })
    }, 1000)
}

function App() {
  const [state, dispatch] = useAppReducer(counterReducer, 0)
  return (
    <React.Fragment>
      <button onClick={() => dispatch({ type: '+1' })}>+</button>
      <button onClick={() => dispatch(resetCounterAfter1Second())}>
        Reset
      </button>
      <button onClick={() => dispatch({ type: '-1' })}>-</button>
      <br />
      Count: {state.count}
    </React.Fragment>
  )
}
