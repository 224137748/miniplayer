import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import { getLyricWYY } from 'api/song.js'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url, isQQ}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.isQQ = isQQ
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
  getLyric2() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyricWYY(this.id).then(res => {
        if (res.code === 200) {
          if (res.lrc && res.lrc.lyric) {
            this.lyric = res.lrc.lyric
            resolve(this.lyric)
          } else {
            reject('抱歉，没搜索到歌词~！')
          }
        } else {
          reject('抱歉，没搜索到歌词~！')
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
    isQQ: true
  })
}
export function createSong2 (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.ar[0].id || '',  // 歌手id
    singer: musicData.ar[0].name || '',
    name: musicData.name,
    album: musicData.al.name,
    duration: parseInt(musicData.dt / 1000),
    image: musicData.al.picUrl,
    url: '',
    isQQ: false
  })
}

export function createSong3 (musicData) {
  let singers = []
  musicData.artists.forEach(item => {
    singers.push(item.name)
  })
  return new Song({
    id: musicData.id,
    mid: musicData.artists[0].id || '',  // 歌手id
    singer: singers.join(' & ') || '',
    name: musicData.name,
    album: musicData.album.name,
    duration: parseInt(musicData.duration / 1000),
    image: musicData.artists[0].img1v1Url,
    url: '',
    isQQ: false
  })
}
export function createSOng4 (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: musicData.singer,
    name: musicData.name,
    album: musicData.album,
    duration: musicData.duration,
    image: musicData.image,
    url: musicData.url,
    isQQ: musicData.isQQ
  })
}
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

