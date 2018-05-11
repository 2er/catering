import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: [], // 用户信息
  isLogin: null, // 用户是否登录
  storeInfo: [], // 门店信息
  storeId: 0, // 门店ID
  deskId: 0, // 餐台ID
  deskName: null, // 餐台名称
  personNum: null, // 就餐人数
  cartList: [], // 购物车
  remarkText: null, // 可选备注内容
  inputText: '' // 输入备注内
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
