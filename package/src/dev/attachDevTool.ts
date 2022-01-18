import type { Store, Actions } from "../index";

declare global {
  interface Window {
    // https://github.com/reduxjs/redux-devtools/blob/main/extension/src/browser/extension/inject/pageScript.ts
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

export const attachDevTool = <S extends object, AS extends Actions<S>>(
  store: Store<S, AS>
): void => {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (
    typeof window === "undefined" ||
    !window.__REDUX_DEVTOOLS_EXTENSION__ ||
    !window.__REDUX_DEVTOOLS_EXTENSION__.send
  ) {
    return;
  }

  const config = {
    name: store.name || window.location.pathname + window.location.search,
    actionsWhitelist: Object.keys(store.actions),
  };

  const connection = window.__REDUX_DEVTOOLS_EXTENSION__.connect(config)

  store.subscribe((data) => {
    connection.send(
      {
        type: data.actionType,
        payload: data.actionPayload,
      },
      data.currentState,
    );
  });

  connection.subscribe((message: any) => {
    // TODO
    switch (message.type) {
      case 'ACTION':
        break
      case 'START':
        break
      case 'STOP':
        break
      case 'UPDATE':
        break
      case 'DISPATCH':
        switch(message.payload.type) {
          case 'IMPORT_STATE':
            break
          case 'JUMP_TO_ACTION':
            break
          case 'JUMP_TO_STATE':
            break
          case 'LOCK_CHANGES':
            break
          case 'PAUSE_RECORDING':
            break
          case 'REORDER_ACTION':
            break
          case 'ROLLBACK':
            break
          case 'SWEEP':
            break
          case 'TOGGLE_ACTION':
            break
        }
        break
      case 'EXPORT':
        break
      case 'IMPORT':
        break
    }
  })
  
  connection.init(store.getState())
};
