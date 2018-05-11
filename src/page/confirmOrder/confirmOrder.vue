<template>
  <div class="confirmOrderContainer">
    <section v-if="!showLoading">
      <head-top head-title="确认订单" goBack="true" signin-up='confirmOrder'></head-top>
      <section class="pay_way container_style">
        <header class="header_style">
          <span>餐台</span>
          <span>{{deskName}}</span>
        </header>
        <header class="header_style">
          <span>就餐人数</span>
          <span>{{personNum}}</span>
        </header>
      </section>
      <section class="food_list">
        <header v-if="storeInfo">
          <img :src="storeInfo.store_log">
          <span>{{storeInfo.store_name}}</span>
        </header>
        <ul class="food_list_ul" v-if="shopCart">
          <li v-for="item in checkoutData" :key="item.sku_id" class="food_item_style">
            <p class="food_name ellipsis">{{item.name}}</p>
            <div class="num_price">
              <span>x {{item.quantity}}</span>
              <span>¥{{item.price}}</span>
            </div>
          </li>
        </ul>
        <div class="food_item_style total_price">
          <p class="food_name ellipsis">订单 ¥{{totalAmount}}</p>
          <div class="num_price">
            <span>待支付 ¥{{totalAmount}}</span>
          </div>
        </div>
      </section>
      <section class="pay_way container_style">
        <header class="header_style">
          <span>支付方式</span>
          <div class="more_type" @click="showPayWayFun">
            <span>{{payWay === 'online' ? '在线支付' : '现金支付'}}</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </header>
      </section>
      <section class="pay_way container_style">
        <router-link :to='{path: "/confirmOrder/remark"}' class="header_style">
          <span>备注</span>
          <div class="more_type">
            <span class="ellipsis">{{remarkText||inputText? remarklist: '口味、偏好等'}}</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </router-link>
      </section>
      <section class="confrim_order">
        <p>待支付 ¥{{totalAmount}}</p>
        <p @click="confrimOrder">确认下单</p>
      </section>
      <transition name="fade">
        <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
      </transition>
      <transition name="slid_up">
        <div class="choose_type_Container" v-if="showPayWay">
          <header>支付方式</header>
          <ul>
            <li :class="{choose: payWay == 'offline'}">
              <span>现金支付</span>
              <svg class="address_empty_right" @click="choosePayWay('offline')">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
            <li :class="{choose: payWay == 'online'}">
              <span>在线支付</span>
              <svg class="address_empty_right" @click="choosePayWay('online')">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import headTop from '../../components/header/head'
import alertTip from '../../components/common/alertTip'
import loading from '../../components/common/loading'
import { createOrder } from '../../service/getData'

export default {
  data () {
    return {
      showLoading: true, // 显示加载动画
      checkoutData: null, // 数据返回值
      totalAmount: null, // 订单总额
      shopCart: null, // 购物车数据
      showPayWay: false, // 显示付款方式
      payWay: 'online', // 付款方式
      showAlert: false, // 弹出框
      alertText: null // 弹出框内容
    }
  },
  created () {
    this.INIT_BUYCART()
    // 获取当前商铺购物车信息
    this.shopCart = this.cartList[this.storeId]
  },
  mounted () {
    this.initData()
    if (!(this.userInfo && this.userInfo.member_id)) {
      // this.showAlert = true;
      // this.alertText = '您还没有登录';
    }
  },
  components: {
    headTop,
    alertTip,
    loading
  },
  computed: {
    ...mapState([
      'cartList', 'remarkText', 'inputText', 'userInfo', 'storeInfo', 'deskId', 'deskName', 'storeId', 'personNum'
    ]),
    // 备注页返回的信息进行处理
    remarklist: function () {
      let str = ''
      if (this.remarkText) {
        Object.values(this.remarkText).forEach(item => {
          str += item[1] + '，'
        })
      }
      // 是否有自定义备注，分开处理
      if (this.inputText) {
        return str + this.inputText
      } else {
        return str.substr(0, str.lastIndexOf('，'))
      }
    }
  },
  methods: {
    ...mapMutations([
      'INIT_BUYCART', 'SAVE_ORDER_PARAM', 'ORDER_SUCCESS'
    ]),
    // 初始化数据
    async initData () {
      let newArr = []
      let totalAmount = 0
      Object.values(this.shopCart).forEach(categoryItem => {
        Object.values(categoryItem).forEach(itemValue => {
          Object.values(itemValue).forEach(item => {
            newArr.push({
              attrs: [],
              extra: {},
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.num,
              sku_id: item.sku_id,
              specs: [item.specs],
              stock: item.stock
            })
            totalAmount += item.num * item.price
          })
        })
      })
      this.checkoutData = newArr
      this.totalAmount = totalAmount.toFixed(2)
      this.showLoading = false
    },
    // 确认订单
    async confrimOrder () {
      // 用户未登录时弹出提示框
      if (!(this.userInfo && this.userInfo.member_id)) {
        this.showAlert = true
        this.alertText = '请登录'
        return
      } else if (!this.storeId) {
        this.showAlert = true
        this.alertText = '请选择门店'
        return
      } else if (!this.deskId) {
        this.showAlert = true
        this.alertText = '请选择餐台'
        return
      } else if (!this.personNum) {
        this.showAlert = true
        this.alertText = '请选择就餐人数'
        return
      } else if (!this.checkoutData) {
        this.showAlert = true
        this.alertText = '购物车为空'
        return
      }
      // 格式化购物车信息
      let goodsData = []
      this.checkoutData.forEach(goodsItem => {
        let initItem = {}
        initItem.goods_bn = goodsItem.sku_id
        initItem.num = goodsItem.quantity
        goodsData.push(initItem)
      })
      // 发送订单信息
      let orderRes = await createOrder({
        store_id: this.storeId,
        desk_id: this.deskId,
        person_num: this.personNum,
        goods_data: goodsData,
        pay_type: this.payWay,
        remark_text: this.remarkText,
        input_text: this.inputText
      })
      if (orderRes.return_code === '0000') {
        this.ORDER_SUCCESS(orderRes.data)
        this.$router.push('/confirmOrder/payment')
      } else {
        this.showAlert = true
        this.alertText = orderRes.return_msg
        return false
      }
    },
    // 显示付款方式
    showPayWayFun () {
      this.showPayWay = !this.showPayWay
    },
    // 选择付款方式
    choosePayWay (payWay) {
      this.showPayWay = !this.showPayWay
      this.payWay = payWay
    }
  },
  watch: {
    userInfo: function (value) {
      if (value && value.user_id) {
        this.initAddress()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';

  .confirmOrderContainer{
    padding-top: 1.95rem;
    padding-bottom: 3rem;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .container_style{
    background-color: #fff;
    margin-top: .4rem;
    padding: 0 .7rem;
  }
  .address_empty_right{
    @include wh(.6rem, .6rem);
    fill: #999;
  }
  .pay_way{
    .header_style{
      @include fj;
      line-height: 2rem;
      span:nth-of-type(1){
        @include sc(.7rem, #666);
      }
      .more_type{
        span:nth-of-type(1){
          @include sc(.6rem, #aaa);
          width: 10rem;
          display: inline-block;
          text-align: right;
          vertical-align: middle;
        }
        svg{
          @include wh(.5rem, .5rem);
          fill: #ccc;
        }
      }
    }
    .hongbo{
      @include fj;
      border-top: 0.025rem solid #f5f5f5;
      span{
        @include sc(.6rem, #aaa);
        line-height: 2rem;
        svg{
          @include wh(.5rem, .5rem);
          vertical-align: middle;
          fill: #ccc;
        }
      }
      span:nth-of-type(2){
        color: #aaa;
      }
    }
    .support_is_available{
      span{
        color: #666;
      }
    }
  }
  .food_list{
    background-color: #fff;
    margin-top: .4rem;
    header{
      padding: .7rem;
      border-bottom: 0.025rem solid #f5f5f5;
      img{
        @include wh(1.2rem, 1.2rem);
        vertical-align: middle;
      }
      span{
        @include sc(.8rem, #333);
      }
    }
    .food_list_ul{
      padding-top: .5rem;
    }
    .food_item_style{
      @include fj;
      line-height: 1.8rem;
      padding: 0 .7rem;
      span,p{
        @include sc(.65rem, #666);
      }
      .food_name{
        width: 11rem;
      }
      .num_price{
        flex: 1;
        @include fj;
        align-items: center;
        span:nth-of-type(1){
          color: #f60;
        }
      }
    }
    .total_price{
      border-top: 0.025rem solid #f5f5f5;
    }
  }
  .confrim_order{
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2rem;
    p{
      line-height: 2rem;
      @include sc(.75rem, #fff);
    }
    p:nth-of-type(1){
      background-color: #3c3c3c;
      flex: 5;
      padding-left: .7rem;
    }
    p:nth-of-type(2){
      flex: 2;
      background-color: #56d176;
      text-align: center;
    }
  }
  .cover{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 203;
  }
  .choose_type_Container{
    min-height: 10rem;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 204;
    header{
      background-color: #fafafa;
      @include sc(.7rem, #333);
      text-align: center;
      line-height: 2rem;
    }
    ul{
      li{
        @include fj;
        padding: 0 .7rem;
        line-height: 2.5rem;
        align-items: center;
        span{
          @include sc(.7rem, #ccc);
        }
        svg{
          @include wh(.8rem, .8rem);
          fill: #eee;
        }
      }
      .choose{
        span{
          color: #333;
        }
        svg{
          fill: #4cd964;
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .slid_up-enter-active, .slid_up-leave-active {
    transition: all .3s;
  }
  .slid_up-enter, .slid_up-leave-active {
    transform: translate3d(0,10rem,0)
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
