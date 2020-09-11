# @0y0/use-enhanced-reducer · [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/o0y0o/use-enhanced-reducer/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@0y0/use-enhanced-reducer.svg)](https://www.npmjs.com/package/@0y0/use-enhanced-reducer) ![Status](https://github.com/o0y0o/use-enhanced-reducer/workflows/Package/badge.svg)

`@0y0/use-enhanced-reducer` is an alternative to `React.useReducer` that accepts middlewares to do some cool things before and after dispatch.

Inspired by [Redux Middleware](https://redux.js.org/api/applymiddleware).

### 3-second quick look

```js
import useEnhancedReducer from '@0y0/use-enhanced-reducer'

function App() {
  const middlewares = [
    ({ getState, dispatch }) => next => action => {
      // do something before dispatch...
      next(action)
       // do something after dispatch...
    }
  ]
  const [state, dispatch] = useEnhancedReducer(reducer, initialState, middlewares)
  // ...
}
```

## Installation

```
npm install @0y0/use-enhanced-reducer --save
```

## Real-world Usage

```js
import React from 'react'
import useEnhancedReducer from '@0y0/use-enhanced-reducer'
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
    case '+1': return { count: state.count + 1 }
    case '-1': return { count: state.count - 1 }
    case '0': return { count: 0 }
    default: return state
  }
}

function resetCounterAfter1Second() {
  return dispatch => setTimeout(() => { dispatch({ type: '0' }) }, 1000)
}

function App() {
  const [state, dispatch] = useAppReducer(counterReducer, 0)
  return (
    <React.Fragment>
      <button onClick={() => dispatch({ type: '+1' })}>+</button>
      <button onClick={() => dispatch(resetCounterAfter1Second())}>Reset</button>
      <button onClick={() => dispatch({ type: '-1' })}>-</button>
      <br />
      Count: {state.count}
    </React.Fragment>
  )
}
```

Try the demo in [codesanbox](https://codesandbox.io/s/xono668ynz).

## License

[MIT](https://github.com/o0y0o/use-enhanced-reducer/blob/master/LICENSE)
