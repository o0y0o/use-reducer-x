import test from 'ava'
import React from 'react'
import renderer from 'react-test-renderer'
import useEnhancedReducer from './index'

const initialState = 0
const reducer = (state, action) => {
  switch (action.type) {
    case '+1':
      return state + 1
    case '+x':
      return state + action.x
    default:
      return state
  }
}

test('useEnhancedReducer should work as React.useReducer', t => {
  let dispatch
  function TestComponent() {
    const [state, enhancedDispatch] = useEnhancedReducer(reducer, initialState)
    dispatch = enhancedDispatch
    return <div>{state}</div>
  }
  const component = renderer.create(<TestComponent />)
  const element = component.root.findByType('div')
  dispatch({})
  t.is(element.children[0], '0')
  dispatch({ type: '+1' })
  t.is(element.children[0], '1')
  dispatch({ type: '+x', x: 2 })
  t.is(element.children[0], '3')
})

test('middlewares should be invoked by order', t => {
  let dispatch
  let step = 0
  const middlewares = [
    () => next => action => {
      t.is(++step, 1)
      next(action)
      t.is(++step, 4)
    },
    ({ dispatch }) => () => action => {
      t.is(++step, 2)
      dispatch(action)
      t.is(++step, 3)
    },
    () => next => action => {
      t.fail('here will not be called')
      next(action)
    }
  ]
  function TestComponent() {
    const [state, enhancedDispatch] = useEnhancedReducer(
      reducer,
      initialState,
      middlewares
    )
    dispatch = enhancedDispatch
    return <div>{state}</div>
  }
  renderer.create(<TestComponent />)
  dispatch({})
  t.is(step, 4)
})

test('middleware should able to get state', t => {
  let dispatch
  const x = 2
  const addAction = { type: '+x', x }
  const middlewares = [
    ({ getState }) => next => action => {
      t.is(getState(), initialState)
      t.deepEqual(action, addAction)
      next(action)
      t.is(getState(), initialState + x)
    }
  ]
  function TestComponent() {
    const [state, enhancedDispatch] = useEnhancedReducer(
      reducer,
      initialState,
      middlewares
    )
    dispatch = enhancedDispatch
    return <div>{state}</div>
  }
  renderer.create(<TestComponent />)
  dispatch(addAction)
})
