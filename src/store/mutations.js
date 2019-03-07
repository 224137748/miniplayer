import * as types from './mutation-types'

const mutations = {
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_SONGS] (state, songs) {
    state.songs = songs
  }
}
export default mutations
