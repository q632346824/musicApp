import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import {shuffle} from '@/assets/js/util'
import {saveSearch, loadSearch, deleteSearch, clearSearch} from '@/assets/js/cache'
const debug=process.env.NODE_ENV!=='production'

Vue.use(Vuex)

var playMode={
  sequence:0,
  loop:1,
  random:2
}


const state={
  singer:{},
  playing:false,
  fullScreen:false,
  playlist:[], //random
  sequenceList:[], 
  mode:playMode.sequence,
  currentIndex:-1,
  disc:{},
  topList:{},
  searchHistory:loadSearch()
}

const mutations = {
  SET_SINGER (state,val) {
    state.singer=val
  },
  SET_PLAYING_STATE(state,val){
    state.playing=val
  },
  SET_FULL_SCREEN(state,val){
    state.fullScreen=val
  },
  SET_PLAYLIST(state,val){
    state.playlist=val
  },
  SET_SEQUENCE_LIST(state,val){
    state.sequenceList=val
  },
  SET_PLAY_MODE(state,val){
    state.mode=val
  },
  SET_CURRENT_INDEX(state,val){
    state.currentIndex=val
  },
  SET_DISC(state,val){
    state.disc=val
  },
  SET_TOP_LIST(state,val){
    state.topList=val
  },
  SET_SEARCH_HISTORY(state,history){
    state.searchHistory=history
  }
}

const actions ={
  setSinger({commit},val){
    commit('SET_SINGER',val)
  },
  selectPlay({commit,state},{list,index}){
    commit('SET_SEQUENCE_LIST', list)
    if(state.mode===playMode.random){
      let randomList=shuffle(list)
      commit('SET_PLAYLIST',randomList)
      index=findIndex(randomList, list[index])
    }else{
      commit('SET_PLAYLIST',list)
    }
    
    commit('SET_CURRENT_INDEX',index)
    commit('SET_FULL_SCREEN',true)
    commit('SET_PLAYING_STATE',true)
  },
  randomPlay({commit},{list}){
    commit('SET_PLAY_MODE', playMode.random)
    commit('SET_SEQUENCE_LIST', list)
    let randomlist=shuffle(list)
    commit('SET_PLAYLIST',randomlist)
    commit('SET_CURRENT_INDEX',0)
    commit('SET_FULL_SCREEN',true)
    commit('SET_PLAYING_STATE',true)
  },
  setDisc({commit},val){
    commit('SET_DISC',val)
  },
  setTopList({commit},val){
    commit('SET_TOP_LIST', val)
  },

  insertSong({commit,state},song){
    let playlist=state.playlist
    let sequenceList=state.sequenceList
    let currentIndex=state.currentIndex
    
    if(state.currentIndex===-1){
      currentIndex=0
      sequenceList.push(song)
      playlist.push(song)
      commit('SET_PLAYLIST',playlist)
      commit('SET_SEQUENCE_LIST', sequenceList)
      commit('SET_CURRENT_INDEX',currentIndex)
      commit('SET_FULL_SCREEN', true)
      commit('SET_PLAYING_STATE', true)
      return
    }


    let currentSong=playlist[currentIndex]

    let fpIndex=findIndex(playlist,song)
    currentIndex++
    playlist.splice(currentIndex,0,song)
    if(fpIndex>-1){
      if(currentIndex>fpIndex){
        playlist.splice(fpIndex,1)
        currentIndex--
      }else{
        playlist.splice(fpIndex+1,1)
      }
    }

    let currentSIndex=findIndex(sequenceList, currentSong)+1
    let fsIndex=findIndex(sequenceList,song)
    sequenceList.splice(currentSIndex,0,song)

    if(fsIndex>-1){
      if(currentSIndex>fsIndex){
        sequenceList.splice(fsIndex,1)
      }else{
        sequenceList.splice(fsIndex+1,1)
      }
    }
    
    commit('SET_PLAYLIST',playlist)
    commit('SET_SEQUENCE_LIST', sequenceList)
    commit('SET_CURRENT_INDEX',currentIndex)
    commit('SET_FULL_SCREEN', true)
    commit('SET_PLAYING_STATE', true)
  },
  saveSearchHistory({commit},query){
    commit('SET_SEARCH_HISTORY', saveSearch(query))
  },
  deleteSearchHistory({commit},query){
    commit('SET_SEARCH_HISTORY', deleteSearch(query))
  },
  clearSearchHistory({commit}){
    commit('SET_SEARCH_HISTORY', clearSearch())
  }
}

const getters = {
  singer: state => state.singer,
  playing: state => state.playing,
  fullScreen: state => state.fullScreen,
  playlist: state => state.playlist,
  sequenceList: state => state.sequenceList,
  mode: state => state.mode,
  currentIndex: state => state.currentIndex,
  currentSong: state => state.playlist[state.currentIndex]||{},
  disc: state => state.disc,
  topList: state => state.topList,
  searchHistory: state => state.searchHistory
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins:debug?[createLogger()]:[]
})

function findIndex(list,song){
  return list.findIndex((item)=>{
    return item.id===song.id
  })
}