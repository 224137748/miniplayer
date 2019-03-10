import * as fly from './fly'

export async function getLyric (id) {
  const url = 'https://aixbx.xyz/lyric'
  try {
    let res = await fly.get(url, { id })
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}
