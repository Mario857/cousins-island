import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { rootReducer } from './reducers'

// `createStore` is deprecated in favour of Redux Toolkit but still works; the
// app's actions and reducers are plain Redux.
export const store = createStore(rootReducer, undefined, applyMiddleware(thunk))

export type State = ReturnType<typeof rootReducer>
