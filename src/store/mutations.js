import {
  GET_USERINFO,
  SET_ISLOGIN,
  GET_STOREINFO,
  SET_STOREID,
  SET_DESKID,
  SET_DESK_NAME,
  SET_PERSON_NUM,
  INIT_BUYCART,
  ADD_CART,
  REDUCE_CART,
  CLEAR_CART,
  CONFIRM_REMARK,
  ORDER_SUCCESS
} from './mutation-types.js'

import {setStore, getStore} from '../config/mUtils'

export default {
  [GET_USERINFO] (state, info) {
    state.userInfo = info
  },
  [SET_ISLOGIN] (state, info) {
    state.isLogin = info
  },
  [GET_STOREINFO] (state, info) {
    state.storeInfo = info
  },
  [SET_STOREID] (state, info) {
    state.storeId = info
  },
  [SET_DESKID] (state, info) {
    state.deskId = info
  },
  [SET_DESK_NAME] (state, info) {
    state.deskName = info
  },
  [SET_PERSON_NUM] (state, info) {
    state.personNum = info
  },
  // 网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // 加入购物车
  [ADD_CART] (state, {
    shopid,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    sku_id,
    stock
  }) {
    let cart = state.cartList
    let shop = cart[shopid] = (cart[shopid] || {})
    let category = shop[category_id] = (shop[category_id] || {})
    let item = category[item_id] = (category[item_id] || {})
    if (item[food_id]) {
      item[food_id]['num']++
    } else {
      item[food_id] = {
        'num': 1,
        'id': food_id,
        'name': name,
        'price': price,
        'specs': specs,
        'sku_id': sku_id,
        'stock': stock
      }
    }
    state.cartList = {...cart}
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 移出购物车
  [REDUCE_CART] (state, {
    shopid,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs
  }) {
    let cart = state.cartList
    let shop = (cart[shopid] || {})
    let category = (shop[category_id] || {})
    let item = (category[item_id] || {})
    if (item && item[food_id]) {
      if (item[food_id]['num'] > 0) {
        item[food_id]['num']--
        state.cartList = {...cart}
        // 存入localStorage
        setStore('buyCart', state.cartList)
      } else {
        // 商品数量为0，则清空当前商品的信息
        item[food_id] = null
      }
    }
  },
  // 清空当前商品的购物车信息
  [CLEAR_CART] (state, shopid) {
    state.cartList[shopid] = null
    state.cartList = {...state.cartList}
    setStore('buyCart', state.cartList)
  },
  // 记录订单页面用户选择的备注, 传递给订单确认页面
  [CONFIRM_REMARK] (state, {
    remarkText,
    inputText
  }) {
    state.remarkText = remarkText
    state.inputText = inputText
  },
  // 下单成功，保存订单返回信息
  [ORDER_SUCCESS] (state, order) {
    state.cartPrice = null
    state.orderMessage = order
  }
}
