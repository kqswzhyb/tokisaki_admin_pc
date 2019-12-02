<template>
  <div class="login-container">
    <el-form v-show="!loading2" ref="form" :model="form" :rules="rules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="qqNo">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="qqNo"
          v-model="form.qqNo"
          placeholder="QQ号码(用作帐号)"
          name="qqNo"
          type="text"
          tabindex="1"
          auto-complete="on"
          onkeydown="if(event.keyCode==32) return false"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="form.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          onkeydown="if(event.keyCode==32) return false"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType2"
          ref="confirmPassword"
          v-model="form.confirmPassword"
          :type="passwordType2"
          placeholder="确认密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          onkeydown="if(event.keyCode==32) return false"
        />
        <span class="show-pwd" @click="showPwd2">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="inviteCode">
        <span class="svg-container">
          <svg-icon icon-class="invite" style="font-size:20px" />
        </span>
        <el-input
          ref="inviteCode"
          v-model="form.inviteCode"
          placeholder="邀请码"
          name="inviteCode"
          type="text"
          tabindex="1"
          auto-complete="on"
          onkeydown="if(event.keyCode==32) return false"
        />
      </el-form-item>

      <p v-show="groupName" class="main">注册成功后,您将自动加入<span>{{ groupName }}！</span> </p>

      <el-button :loading="loading" :disabled="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">注册</el-button>
    </el-form>
    <Loading v-show="loading2" />
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
import Loading from '../../components/loading'
export default {
  name: 'Login',
  components: {
    Loading
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不少于6位'))
      } else if (!(/^[\u4e00-\u9fa5A-Za-z0-9]+$/gi).test(value)) {
        callback(new Error('只能输入英文字母和数字'))
      } else {
        callback()
      }
    }
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('确认密码必须与密码相同'))
      } else if (!(/^[\u4e00-\u9fa5A-Za-z0-9]+$/gi).test(value)) {
        callback(new Error('只能输入英文字母和数字'))
      } else {
        callback()
      }
    }
    const validateInviteCode = (rule, value, callback) => {
      if (value.length !== 8) {
        callback(new Error('邀请码长度为8位'))
      } else {
        this.$axios.get(`/auth/groupcode?code=${this.form.inviteCode}`).then((res) => {
          if (res.status === 200) {
            this.groupName = res.data.groupName
            callback()
          } else {
            this.groupName = ''
            callback(new Error('邀请码不存在'))
          }
        })
      }
    }
    const validateQQNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('QQ号码(帐号)不能为空'))
      } else if (!(/^[0-9]+$/gi).test(value)) {
        callback(new Error('只能输入数字'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        confirmPassword: '',
        inviteCode: '',
        qqNo: '',
        id: ''
      },
      groupName: '',
      rules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirm }],
        inviteCode: [{ required: true, trigger: 'blur', validator: validateInviteCode }],
        qqNo: [{ required: true, trigger: 'blur', validator: validateQQNo }]
      },
      loading: false,
      passwordType: 'password',
      passwordType2: 'password',
      redirect: undefined
    }
  },
  computed: {
    loading2() {
      return this.$store.state.app.loading
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get(`/auth/qqloginCallback?code=${this.$route.query.code}&state=${this.$route.query.state}`).then((res) => {
      if (res.status === 200) {
        if (!res.data) {
          this.$message.error('请先接受QQ授权再注册')
          this.$store.commit('app/openLoading', false)
          this.$router.push('/home')
          return
        }
        if (res.data.token) {
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$store.commit('user/SET_TOKEN', res.data.token)
          setToken(res.data.token)
          this.$router.push({ path: this.redirect || '/' })
        } else {
          this.form.id = res.data.id
          this.$store.commit('app/openLoading', false)
        }
      }
    })
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showPwd2() {
      if (this.passwordType2 === 'password') {
        this.passwordType2 = ''
      } else {
        this.passwordType2 = 'password'
      }
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus()
      })
    },
    async handleLogin() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const res = await this.$axios.post('/auth/qqbind', {
              username: this.form.qqNo,
              password: this.form.password,
              groupInvite: this.form.inviteCode,
              id: this.form.id
            }, {
              headers: {
                'Content-Type': 'application/json; charset=UTF-8'
              }
            })
            if (res.status !== 200) {
              this.$message.error('帐号或密码错误')
              this.loading = false
            } else {
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              this.$store.commit('user/SET_TOKEN', res.data.token)
              setToken(res.data.token)
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }
          } catch {
            this.$message.error('请求出错')
            this.loading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
