import { playMode } from 'common/js/config'
const state = {
  // 歌单详情信息
  disc: {},
  // 播放状态
  playing: false,
  // 歌取列表
  songs: [],
  // 是否全屏
  fullScreen: false,
  // 播放列表
  playList: [],
  // 随机播放 、 顺序播放、小窗显示列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 播放当前歌曲的索引
  currentIndex: -1
}
export default state
