import { act, renderHook } from '@testing-library/react-hooks'
import useReducerX from './index'

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

test('useReducerX should work like React.useReducer', () => {
  const { result } = renderHook(() => useReducerX(reducer, initialState))

  act(() => {
    result.current[1]({})
  })
  expect(result.current[0]).toEqual(0)

  act(() => {
    result.current[1]({ type: '+1' })
  })
  expect(result.current[0]).toEqual(1)

  act(() => {
    result.current[1]({ type: '+x', x: 2 })
  })
  expect(result.current[0]).toEqual(3)
})

test('middlewares should be invoked by order', () => {
  let step = 0
  const middlewares = [
    () => next => action => {
      expect(++step).toEqual(1)
      next(action)
      expect(++step).toEqual(4)
    },
    () => next => action => {
      expect(++step).toEqual(2)
      next(action)
      expect(++step).toEqual(3)
    }
  ]
  const { result } = renderHook(() =>
    useReducerX(reducer, initialState, middlewares)
  )

  act(() => {
    result.current[1]({})
  })

  expect(step).toEqual(4)
})

test('middleware should able to re-dispatch action', () => {
  let step = 0
  const middlewares = [
    ({ dispatch }) =>
      next =>
      action => {
        if (typeof action === 'function') {
          expect(++step).toEqual(1)
          action(dispatch)
          expect(++step).toEqual(2)
        } else {
          expect(++step).toEqual(4)
          next(action)
          expect(++step).toEqual(7)
        }
      },
    () => next => action => {
      expect(++step).toEqual(5)
      next(action)
      expect(++step).toEqual(6)
    }
  ]
  const { result } = renderHook(() =>
    useReducerX(reducer, initialState, middlewares)
  )

  act(() => {
    result.current[1](dispatch => setTimeout(() => dispatch({})))
  })

  expect(++step).toEqual(3)
})

test('middleware should able to get state', () => {
  const x = 2
  const addAction = { type: '+x', x }
  const middlewares = [
    ({ getState }) =>
      next =>
      action => {
        expect(getState()).toEqual(initialState)
        next(action)
        expect(getState()).toEqual(initialState + x)
      }
  ]
  const { result } = renderHook(() =>
    useReducerX(reducer, initialState, middlewares)
  )

  act(() => {
    result.current[1](addAction)
  })
})
