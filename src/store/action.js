import {
  userInfo,
  storeInfo
} from '../service/getData'
import {
  GET_USERINFO,
  SET_ISLOGIN,
  GET_STOREINFO,
  SET_STOREID,
  SET_DESKID,
  SET_DESK_NAME,
  SET_PERSON_NUM
} from './mutation-types.js'

export default {
  async getUserInfo ({
    commit,
    state
  }, params) {
    let resp = await userInfo()
    if (resp.return_code === '0000') {
      commit(GET_USERINFO, resp.data.userinfo)
      if (resp.data.userinfo.length !== 0) {
        commit(SET_ISLOGIN, true)
      } else {
        commit(SET_ISLOGIN, false)
      }
    }
  },
  async getStoreInfo ({
    commit,
    state
  }, params) {
    let resp = await storeInfo(params)
    if (resp.return_code === '0000') {
      commit(GET_STOREINFO, resp.data.store)
    } else {
      commit(GET_STOREINFO, '')
    }
  },
  setStoreDesk ({
    commit,
    state
  }, params) {
    if (params.storeId) {
      commit(SET_STOREID, params.storeId)
    }
    if (params.deskId) {
      commit(SET_DESKID, params.deskId)
    }
    if (params.deskName) {
      commit(SET_DESK_NAME, params.deskName)
    }
    if (params.personNum) {
      commit(SET_PERSON_NUM, params.personNum)
    }
  }
}
