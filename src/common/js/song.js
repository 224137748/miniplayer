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
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      try {
        getLyric(this.id).then(res => {
          if (res.code === 200) {
            this.lyric = res.lrc.lyric
            resolve(this.lyric)
          }
        })
      } catch (err) {
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
export function createSong3 (musicData) {
  let singers = []
  musicData.artists.forEach(item => {
    singers.push(item.name)
  })
  return new Song({
    id: musicData.id,
    mid: musicData.artists[0].id || '',
    singer: singers.join(' & ') || '',
    name: musicData.name,
    album: musicData.album.name,
    duration: parseInt(musicData.duration / 1000),
    image: musicData.artists[0].img1v1Url,
    url: '',
    isQQ: false
  })
}
