import App from '../App'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const bind = r => require.ensure([], () => r(require('../page/login/bindWx')), 'bind')
const shop = r => require.ensure([], () => r(require('../page/shop/shop')), 'shop')
const foodDetail = r => require.ensure([], () => r(require('../page/shop/children/foodDetail')), 'foodDetail')
const shopDetail = r => require.ensure([], () => r(require('../page/shop/children/shopDetail')), 'shopDetail')
const shopSafe = r => require.ensure([], () => r(require('../page/shop/children/children/shopSafe')), 'shopSafe')
const confirmOrder = r => require.ensure([], () => r(require('../page/confirmOrder/confirmOrder')), 'confirmOrder')
const remark = r => require.ensure([], () => r(require('../page/confirmOrder/children/remark')), 'remark')
const payment = r => require.ensure([], () => r(require('../page/confirmOrder/children/payment')), 'payment')

export default [{
  path: '/',
  component: App, // 顶层路由，对应index.html
  children: [ // 二级路由。对应App.vue
    // 地址为空时跳转home页面
    {
      path: '',
      redirect: '/home/0'
    },
    // 首页城市列表页
    {
      path: '/home/:store_id/:desk_id?',
      component: home
    },
    // 手机号绑定页
    {
      path: '/bind',
      component: bind
    },
    // 店铺首页
    {
      path: '/shop',
      component: shop,
      children: [{
        path: 'foodDetail', // 食品详情页
        component: foodDetail
      }, {
        path: 'shopDetail', // 商铺详情页
        component: shopDetail,
        children: [{
          path: 'shopSafe', // 商铺安全认证页
          component: shopSafe
        } ]
      }]
    },
    // 确认订单页
    {
      path: '/confirmOrder',
      component: confirmOrder,
      children: [{
        path: 'remark', // 订单备注
        component: remark
      }, {
        path: 'payment', // 付款页面
        component: payment
      }]
    }
  ]
}]
