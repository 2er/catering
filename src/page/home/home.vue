<template>
  <div>
    <head-top signin-up='home' :head-title="storeInfo.store_name">
      <span slot='logo' class="head_logo"  @click="reload"><img :src="storeInfo.store_log"/></span>
    </head-top>
    <section class="input_container person_num_container">
      <div class="person_tip">
        <span>就餐人数：</span><input type="text" placeholder="请输入就餐人数" maxlength="1" v-model="perNum">
      </div>
    </section>
    <nav class="desk_nav">
      <div class="desk_tip">
        <span>当前餐台：{{deskName}}</span>
        <span>未选择餐台时，请在餐台列表中选择</span>
      </div>
    </nav>
    <section class="group_desk_container">
      <ul class="letter_classify">
        <li v-for="(value, key, index) in deskList" :key="index"  class="letter_classify_li">
          <h4 class="desk_title">{{key}}
          </h4>
          <ul class="groupdesk_name_container desklistul clear">
            <li v-for="item in value" :key="item.desk_id" :class="item.cur" @click="chooseDesk(item.desk_id,item.name)">
              {{item.name}}
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <div class="verify_container" @click="doVerify">确定</div>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
import headTop from '../../components/header/head'
import alertTip from '../../components/common/alertTip'
import { mapState, mapActions } from 'vuex'
import { wxOauth } from '../../config/env'
export default {
  data () {
    return {
      storeId: null, // 门店ID
      deskId: null, // 餐台ID
      deskName: '', // 餐台名称
      perNum: null, // 就餐人数
      deskList: [],
      showAlert: false, // 显示提示组件
      alertText: null // 提示的内容
    }
  },
  created () {
    this.storeId = parseInt(this.$route.params.store_id)
    this.deskId = this.$route.params.desk_id ? parseInt(this.$route.params.desk_id) : 0
    this.perNum = this.perNum ? this.perNum : this.personNum
    if (!parseInt(this.storeId)) {
      this.showAlert = true
      this.alertText = '二维码不正确哦！'
      return false
    }
    this.getStoreInfo({store_id: this.storeId, desk_id: this.deskId})
    this.getUserInfo()
  },
  mounted () {
  },
  components: {
    headTop,
    alertTip
  },
  computed: mapState({
    isLogin: state => state.isLogin,
    userInfo: state => state.userInfo,
    storeInfo: state => state.storeInfo,
    personNum: state => state.personNum
  }),
  watch: {
    'isLogin': {
      handler: 'autoLogin'
    },
    'storeInfo': {
      handler: 'afterStoreInfo'
    }
  },
  methods: {
    ...mapActions({
      setStoreDesk: 'setStoreDesk',
      getUserInfo: 'getUserInfo',
      getStoreInfo: 'getStoreInfo'
    }),
    afterStoreInfo () {
      if (this.storeInfo) {
        this.deskList = this.storeInfo.desks.list
        this.deskName = this.storeInfo.desks.cur.name
        document.title = this.storeInfo.store_name
      }
    },
    autoLogin () {
      let ua = navigator.userAgent.toLowerCase()
      this.isWeiXin = !!(/micromessenger/.test(ua))
      if (this.isWeiXin === false) {
        this.showAlert = true
        this.alertText = '请在微信中打开！'
        return false
      }
      if (this.isLogin === false) {
        window.location.href = wxOauth + '?store_id=' + this.storeId + '&desk_id=' + this.deskId
        return false
      }

      if (this.deskId) {
        this.$router.push('/shop')
      }
    },
    chooseDesk (deskId, deskName) {
      if (this.isLogin === false) {
        this.showAlert = true
        this.alertText = '请在微信中打开！'
        return false
      }
      if (!this.perNum) {
        this.showAlert = true
        this.alertText = '请先输入就餐人数！'
        return false
      }
      var typeName
      for (typeName in this.deskList) {
        for (var j = 0; j < this.deskList[typeName].length; j++) {
          if (this.deskList[typeName][j].desk_id === deskId) {
            this.deskList[typeName][j].cur = 'cur'
          } else {
            this.deskList[typeName][j].cur = 'normal'
          }
        }
      }
      this.deskId = deskId
      this.deskName = deskName
    },
    doVerify () {
      if (this.isLogin === false) {
        this.showAlert = true
        this.alertText = '请在微信中打开！'
        return false
      }
      if (!this.perNum) {
        this.showAlert = true
        this.alertText = '请先输入就餐人数！'
        return false
      }
      if (!this.deskId) {
        this.showAlert = true
        this.alertText = '请先选择餐台！'
        return false
      }
      this.setStoreDesk({storeId: this.storeId, deskId: this.deskId, deskName: this.deskName, personNum: this.perNum})
      this.$router.push('/shop')
    },
    // 点击图标刷新页面
    reload () {
      window.location.reload()
    },
    closeTip () {
      this.showAlert = false
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .head_logo{
    left: 0.4rem;
    font-weight: 400;
    @include sc(0.7rem, #fff);
    @include wh(2.3rem, 0.7rem);
    @include ct;
    img{
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      margin-top: -0.4rem;
    }
  }
  .input_container{
    padding-top: 2.35rem;
    border-top: 1px solid $bc;
    background-color: #fff;
    margin-bottom: 0.4rem;
    .person_tip{
      @include fj;
      line-height: 1.45rem;
      padding: 0 0.45rem;
      span:nth-of-type(1){
        @include sc(0.70rem, #666);
      }
      span:nth-of-type(2){
        font-weight: 900;
        @include sc(0.475rem, #9f9f9f);
      }
      input{
        @include sc(0.70rem, #666);
      }
    }
  }
  .desk_nav{
    border-top: 1px solid $bc;
    background-color: #fff;
    margin-bottom: 0.4rem;
    .desk_tip{
      @include fj;
      line-height: 1.45rem;
      padding: 0 0.45rem;
      span:nth-of-type(1){
        @include sc(0.70rem, #666);
      }
      span:nth-of-type(2){
        font-weight: 900;
        @include sc(0.475rem, #9f9f9f);
      }

    }
  }
  #hot_city_container{
    background-color: #fff;
    margin-bottom: 0.4rem;
  }
  .desklistul{
    li{
      float: left;
      text-align: center;
      color: $blue;
      border-bottom: 0.025rem solid $bc;
      border-right: 0.025rem solid $bc;
      @include wh(25%, 1.75rem);
      @include font(0.6rem, 1.75rem);
    }
    li:nth-of-type(4n){
      border-right: none;
    }
    li.cur{
      background-color: #f8cb86;
    }
  }
  .desk_title{
    color: #666;
    font-weight: 400;
    text-indent: 0.45rem;
    border-top: 2px solid $bc;
    border-bottom: 1px solid $bc;
    @include font(0.55rem, 1.45rem, "Helvetica Neue");
    span{
      @include sc(0.475rem, #999);
    }
  }

  .letter_classify_li{
    margin-bottom: 0.4rem;
    background-color: #fff;
    border-bottom: 1px solid $bc;
    .groupdesk_name_container{
      li{
        color: #666;
      }
    }
  }

  .verify_container{
    margin: 1rem;
    @include sc(.7rem, #fff);
    background-color: #4cd964;
    padding: .5rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
  }

</style>
