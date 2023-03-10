import createStore from '@hanyk/redux-model'
import global from './global'

export const getStore = (isServer?: boolean) => {
  return createStore([global], {
    initState: isServer ? undefined : window.PRE_LOADED_STATE,
  })
}

export type Store = ReturnType<typeof getStore>
