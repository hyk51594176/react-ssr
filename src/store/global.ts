import { defineModel } from '@hanyk/redux-model'
import { Store } from './type'

export default defineModel<Store, 'global'>({
  namespace: 'global',
  state: {},
  reducers: {
    updateState(state, data) {
      return { ...state, ...data }
    },
  },
  actions: {
    async init({ commit }) {
      commit('updateState', {
        userInfo: { name: '张山' },
      })
    },
  },
})
