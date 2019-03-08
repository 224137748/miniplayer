import * as fly from './fly'

export function getLyric (id) {
  const url = 'http://aixbx.xyz:3000/lyric'
  fly.get(url, { id }).then(res => {
    return Promise.resolve(res)
  }).catch(err => {
    return Promise.reject(err)
  })
}
