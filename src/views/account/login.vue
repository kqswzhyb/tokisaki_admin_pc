<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">群组管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div class="flex-between" style="items-align:flex-start;margin-bottom:22px;">
        <el-form-item prop="captcha" style="width:250px;margin:0;">
          <el-input
            v-model="loginForm.captcha"
            placeholder="验证码"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <img :src="img" style="cursor:pointer;" width="160" alt="" @click="getCaptcha">
      </div>

      <el-button :loading="loading" :disabled="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <div style="text-align:right;">
        <img width="112" style="cursor:pointer;" src="@/assets/images/qq_login.png" @click="goQQ">
      </div>
    </el-form>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入帐号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      img: ''
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
    this.getCaptcha()
  },
  methods: {
    getCaptcha() {
      this.$axios.get('/auth/getcaptcha', {
        responseType: 'arraybuffer'
      }).then((res) => {
        this.img = 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).catch(() => {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      })
    },
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
    goQQ() {
      this.$axios.get('/auth/qqlogin').then((res) => {
        if (res.status === 200) {
          window.location.href = res.data.url
        } else {
          this.$router.push('/404')
        }
      }).catch(() => {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      })
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const res = await this.$axios.post('/auth/signin', {
              username: this.loginForm.username,
              password: this.loginForm.password,
              code: this.loginForm.captcha
            }, {
              headers: {
                'Content-Type': 'application/json; charset=UTF-8'
              }
            })
            if (res.status !== 200) {
              this.$message.error('密码或验证码错误')
              this.getCaptcha()
              this.loginForm.captcha = ''
              this.loading = false
            } else {
              if (res.data.status === 'frozen') {
                this.$message.error('该帐号已被冻结')
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
                this.$message.error('密码或验证码错误')
                this.getCaptcha()
                this.loginForm.captcha = ''
              }
              this.loading = false
            }
          } catch {
            this.$message.error('请求出错,请检查网络或刷新重试！')
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
