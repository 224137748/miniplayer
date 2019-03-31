import * as types from './mutation-types'
// import { playMode, SEARCH_MAX_LENGTH, SEARCH_KEY, PLAY_KEY, PLAY_MAX_LENGTH, FAVORITE_KEY, FAVORITE_MAX_LENGTH } from 'common/js/config'
import { playMode, PLAY_KEY, PLAY_MAX_LENGTH, FAVORITE_MAX_LENGTH, FAVORITE_KEY, SEARCH_KEY, SEARCH_MAX_LENGTH } from 'common/js/config'

import { shuffle } from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.name === song.name
  })
}

export const selectPlay = function ({ commit, state }, { list, index, autoPlay }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  // 微信小程序执行顺序修改
  if (autoPlay) {
    commit(types.SET_PLAYING_STATE, true)
  }
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const savePlayHistory = function ({ commit, state }, { song, wx }) {
  commit(types.SET_PLAY_HISTTORY, savePlay(state.playHistory, song, wx))
}

export const saveFavoriteList = function ({ commit, state }, { song, wx }) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(state.favoriteList, song, wx))
}

export const deleteFavoriteList = function ({ commit, state }, { song, wx }) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(state.favoriteList, song, wx))
}
// 调换一下搜索值的位置，如果有搜索值，就删除放在最前面
function insertArray (arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}
// 从数组中删除某一个元素，并且返回新的数组
function deleteFromArray (arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 工具函数
function savePlay (playHistory, song, wx) {
  let songs = playHistory.slice()
  insertArray(songs, song, (item) => {
    return item.name === song.name
  }, PLAY_MAX_LENGTH)
  wx.setStorage({
    key: PLAY_KEY,
    data: songs,
    success () {
      console.log('playHistory save success')
    }
  })
  return songs
}
// 设置喜欢歌曲
function saveFavorite (favoriteList, song, wx) {
  let songs = favoriteList.slice()
  insertArray(songs, song, (item) => {
    return item.name === song.name
  }, FAVORITE_MAX_LENGTH)
  wx.setStorage({
    key: FAVORITE_KEY,
    data: songs,
    success () {
      console.log('favorite song set success')
    }
  })
  return songs
}
// 删除喜欢歌曲
function deleteFavorite (favoriteList, song, wx) {
  let songs = favoriteList.slice()
  deleteFromArray(songs, (item) => {
    return item.name === song.name
  })
  wx.setStorage({
    key: FAVORITE_KEY,
    data: songs,
    success () {
      console.log('已经删除喜欢歌曲')
    }
  })
  return songs
}

export const saveSearchHistory = function ({ commit, state }, { query, wx }) {
  commit(types.SET_SEARCH_HISTTORY, saveSearch(state.searchHistory, query, wx))
}

export const deleteSearchHistory = function ({ commit, state }, { query, wx }) {
  commit(types.SET_SEARCH_HISTTORY, deleteSearch(state.searchHistory, query, wx))
}
export const celarSearchHistory = function ({ commit, state }, { wx }) {
  commit(types.SET_SEARCH_HISTTORY, clearSearch(wx))
}

// 保存搜索的歌曲
function saveSearch (searchHistory, query, wx) {
  let searches = searchHistory.slice()
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  wx.setStorage({
    key: SEARCH_KEY,
    data: searches,
    success () {
      console.log('已经保存搜索歌曲')
    }
  })
  return searches
}

// 删除搜索歌曲记录
function deleteSearch (searchHistory, query) {
  let searches = searchHistory.slice()
  let index = searches.findIndex((item) => {
    return item === query
  })
  if (index > -1) {
    searches.splice(index, 1)
  }
  wx.setStorage({
    key: SEARCH_KEY,
    data: searches,
    success () {
      console.log('已经删除当前搜索歌曲')
    }
  })
  return searches
}
// 删除所有搜素记录
function clearSearch (wx) {
  wx.setStorage({
    key: SEARCH_KEY,
    data: [],
    success () {
      console.log('已经删除所有搜索歌曲')
    }
  })
  return []
}
