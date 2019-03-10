import { getLyric } from '../../api/songs'
// import { Base64 } from 'js-base64'
class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  async getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      try {
        let res = await getLyric(this.id)
        if (res.code === 200) {
          this.lyric = res.lrc.lyric
          return Promise.resolve(lyric)
        }
      } catch(err) {
        reject(err)
      }
    })
  }
}
export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.ar[0].id || '',
    singer: musicData.ar[0].name || '',
    name: musicData.name,
    album: musicData.al.name,
    duration: parseInt(musicData.dt / 1000),
    image: musicData.al.picUrl,
    url: ''
  })
}
