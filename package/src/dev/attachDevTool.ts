import type { Store, Actions } from '../index'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any
  }
}

export const attachDevTool = <S extends object, AS extends Actions<S>>(
  store: Store<S, AS>
): void => {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  if (
    typeof window === 'undefined' ||
    !window.__REDUX_DEVTOOLS_EXTENSION__ ||
    !window.__REDUX_DEVTOOLS_EXTENSION__.send
  ) {
    return
  }

  const sendMessage = window.__REDUX_DEVTOOLS_EXTENSION__.send

  const config = {
    name: store.name || window.location.pathname + window.location.search,
    actionsWhitelist: Object.keys(store.actions),
    trace: true,
  }

  store.subscribe((data) => {
    console.log(data, data.end.getTime() - data.start.getTime())
    sendMessage(
      {
        action: {
          type: data.actionType,
          payload: data.actionPayload,
        }
      },
      data.currentState,
      config
    )
  })
}
