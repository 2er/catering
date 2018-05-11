import fetch from '../config/fetch'

/**
 * 检查是否登录
 */
export const checkLogin = () => fetch('', {
  method: 'member.checklogin'
}, 'POST')

/**
 * 获取门店信息
 */

export const storeInfo = (params) => fetch('', {
  method: 'store.storeinfo',
  params: params
}, 'POST')

/**
 * 用户信息
 */
export const userInfo = () => fetch('', {
  method: 'member.userinfo'
}, 'POST')

/**
 * 获取短信验证码
 */
export const mobileCode = (params) => fetch('', {
  method: 'member.mobilecode',
  params: params
}, 'POST')

/**
 * 检测帐号是否存在
 */

export const checkExist = (params) => fetch('', {
  method: 'member.checkexist',
  params: params
}, 'POST')

/**
 * 绑定手机号
 */

export const bindWx = (params) => fetch('', {
  method: 'member.bindwx',
  params: params
}, 'POST')

/**
 * 获取门店菜品类型
 */

export const catList = (params) => fetch('', {
  method: 'store.cats',
  params: params
}, 'POST')

/**
 * 获取门店菜品
 */

export const dishes = (params) => fetch('', {
  method: 'store.dishes',
  params: params
}, 'POST')

/**
 * 获取门店备注
 */

export const markList = (params) => fetch('', {
  method: 'store.marks',
  params: params
}, 'POST')

/**
 * 下订单
 */

export const createOrder = (params) => fetch('', {
  method: 'member.order',
  params: params
}, 'POST')

/**
 * 订单查询
 */

export const queryOrder = (params) => fetch('', {
  method: 'member.queryorder',
  params: params
}, 'POST')
