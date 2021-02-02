import React, { createContext, useContext, useReducer } from 'react';
import user from './user';
import app from './app';

// Context容器（类组件可以使用ProviderContext.Consumer获取数据）
export const ProviderContext = createContext('provider');
// 合并reducer
const store = {
  user,
  app
}

// 父组件包裹Context
export default ({ children }) => {
  let reducers = {};
  Object.keys(store).forEach(key => {
    const [state, dispatch] = useReducer(store[key].reducer, store[key].state);
    reducers[key] = { state, dispatch };
  });
  return (
    <ProviderContext.Provider value={reducers}>
      {children}
    </ProviderContext.Provider>
  )
}

// 子组件引用Context
export function useRedux(key) {
  return useContext(ProviderContext)[key];
}

// 合并reducer
// const reducers = combineReducers({
//   user: user.reducer,
//   app: app.reducer,
// });
// const initialState = {
//   user: user.state,
//   app:  app.state,
// }

// // 父组件包裹Context
// export default (WrappedComponent) => {
//   return () => {
//     const [state, dispatch] = useReducer(reducers, initialState);
//     return (
//       <ProviderContext.Provider value={{ state, dispatch }}>
//         <WrappedComponent />
//       </ProviderContext.Provider>
//     )
//   }
// }

// 合并reducer（这里会触发每个reducer的action）
// export function combineReducers(reducers) {
//   // reducers: { user: (state, action) => { return newState } }
//   return function (state = {}, action) {
//     // state: { user: user.state }
//     // action: { type: '' }
//     const newState = {};
//     Object.keys(reducers).forEach(key => {
//       const childState = state[key];
//       newState[key] = reducers[key](childState, action);
//     });
//     return newState;
//   }
// }
// 子组件引用Context
// export function useRedux() {
//   return useContext(ProviderContext);
// }
