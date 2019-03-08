import * as types from './mutation-types'

const mutations = {
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_SONGS] (state, songs) {
    state.songs = songs
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  }
}
export default mutations
