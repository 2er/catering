/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = ''
let imgBaseUrl

let routerMode = 'hash'

let wxAppId = 'wxe413db41714cb4c7'
let wxSecret = '42604eded9c04bff44ea7f4230a09bcb'
let wxOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
let wxAccessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
let wxRefreshTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token'
let wxUserInfoUrl = 'https://api.weixin.qq.com/sns/userinfo'
let wxCheckTokenUrl = 'https://api.weixin.qq.com/sns/auth'
let wxOauth = 'http://192.168.2.160:8081/sellerpok/index.php/openapi/catering_route/wxOauth'

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://192.168.2.160:8081/sellerpok/index.php/openapi/catering_route/accept'
  imgBaseUrl = 'http://192.168.2.160:8081/sellerpok/index.php/openapi/catering_route/accept'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://192.168.2.160:8081/sellerpok/index.php/openapi/catering_route/accept'
  imgBaseUrl = 'http://192.168.2.160:8081/sellerpok/index.php/openapi/catering_route/accept'
}

export {
  baseUrl,
  imgBaseUrl,
  routerMode,
  wxAppId,
  wxSecret,
  wxOauthUrl,
  wxAccessTokenUrl,
  wxRefreshTokenUrl,
  wxUserInfoUrl,
  wxCheckTokenUrl,
  wxOauth
}
