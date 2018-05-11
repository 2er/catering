<template>
    <div class="bindContainer">
        <head-top head-title="绑定手机号" goBack="true">
        </head-top>
        <form class="bindForm">
            <section class="input_container">
                <input type="text" placeholder="手机号" v-model.lazy="phoneNumber">
            </section>
            <section class="input_container captcha_code_container">
                <input type="text" placeholder="短信验证码" maxlength="6" v-model="mobileCode">
                <div class="captcha_btn">
                  <div class="captcha_btn_container" v-show="!computedTime" @click="getVerifyCode">发送验证码</div>
                  <div class="captcha_btn_container" v-show="computedTime">{{computedTime}}&nbsp;S</div>
                </div>
            </section>
        </form>
        <div class="bind_container" @click="mobileBind">绑定</div>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
import headTop from '../../components/header/head'
import alertTip from '../../components/common/alertTip'
import {mapState, mapMutations} from 'vuex'
import {mobileCode, checkExist, bindWx} from '../../service/getData'

export default {
  data () {
    return {
      storeId: 0,
      deskId: 0,
      sessionId: null,
      phoneNumber: null, // 电话号码
      mobileCode: null, // 短信验证码
      computedTime: 0, // 倒数记时
      showAlert: false, // 显示提示组件
      alertText: null // 提示的内容
    }
  },
  created () {
    this.storeId = this.$route.query.store_id
    this.deskId = this.$route.query.desk_id
    this.sessionId = this.$route.query.session_id
  },
  components: {
    headTop,
    alertTip
  },
  computed: mapState({
    // 判断手机号码
    rightPhoneNumber: function () {
      return /^1\d{10}$/gi.test(this.phoneNumber)
    }
  }),
  methods: {
    // 获取短信验证码
    async getVerifyCode () {
      if (this.rightPhoneNumber) {
        this.computedTime = 30
        this.timer = setInterval(() => {
          this.computedTime--
          if (this.computedTime === 0) {
            clearInterval(this.timer)
          }
        }, 1000)
        // 判读用户是否存在
        let exist = await checkExist({phoneNumber: this.phoneNumber})
        if (exist.return_code !== '0000') {
          this.showAlert = true
          this.alertText = exist.return_msg
          return false
        }
        // 发送短信验证码
        let res = await mobileCode({phoneNumber: this.phoneNumber})
        if (res.return_code !== '0000') {
          this.showAlert = true
          this.alertText = res.return_msg
          return false
        }
      } else {
        this.showAlert = true
        this.alertText = '请输入正确的手机号'
        return false
      }
    },
    // 发送登录信息
    async mobileBind () {
      if (!this.rightPhoneNumber) {
        this.showAlert = true
        this.alertText = '手机号码不正确'
        return false
      }
      // 绑定
      let createRes = await bindWx({phoneNumber: this.phoneNumber, captcha: this.mobileCode, sessionId: this.sessionId})
      if (createRes.return_code !== '0000') {
        this.showAlert = true
        this.alertText = createRes.return_msg
        return false
      }
      this.$router.push('/home/' + this.storeId + '/' + this.deskId)
    },
    closeTip () {
      this.showAlert = false
    }
  }
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    .bindContainer{
        padding-top: 1.95rem;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .bindForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .captcha_btn{
                display: flex;
                align-items: center;
                .captcha_btn_container{
                  height: 1.5rem;
                  @include sc(.4rem, #fff);
                  background-color: #3b95e9;
                  padding: .5rem;
                  border: 1px;
                  border-radius: 0.15rem;
                  text-align: center;
                }
            }
        }
    }
    .bind_container{
        margin: 1rem;
        @include sc(.7rem, #fff);
        background-color: #4cd964;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
</style>
