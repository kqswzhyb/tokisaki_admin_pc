<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="16" :md="14" :lg="12">
        <div style="margin:20px;display:flex;">
          <div>
            <img
              src="https://cdn.quasar.dev/img/avatar2.jpg"
              width="120px;"
              style="border-radius:10px;"
            >
          </div>
          <div style="margin:10px 0 0 50px;">
            <div style="margin-bottom:15px;">
              <span class="main" style="font-size:18px;">玄机妙算</span>
            </div>
            <div style="margin-bottom:15px;">
              <span style="color:#505050;font-size:14px;">02001</span>
            </div>
            <div class="flex-start">
              <svg-icon icon-class="star" style="margin-right:15px;font-size:20px;color:#ff9800;" />
              <span style="color:#ff9800;" class="text-h6">1000</span>
            </div>
          </div>
        </div>
        <div style="margin-top:50px;">
          <div
            class="text-h6"
            style="padding-bottom:10px;border-bottom:1px solid #E1E1E1;"
          >
            基础资料
          </div>
          <el-row :gutter="40" style="margin:20px 0 0 20px;">
            <el-col :xs="24" :lg="12">
              <div style="margin-bottom:30px;">
                <span style="color:#999;">QQ：</span>465604612
              </div>
            </el-col>
            <el-col :xs="24" :lg="12">
              <div style="margin-bottom:30px;">
                <span style="color:#999;">身份：</span>组长
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top:50px;">
          <div
            class="text-h6"
            style="padding-bottom:10px;border-bottom:1px solid #E1E1E1;"
          >
            帐号资料
          </div>
          <el-row :gutter="40" style="margin:20px 0 0 20px;">
            <el-col :xs="24" :lg="12">
              <div style="margin-bottom:30px;">
                <span style="color:#999;">状态：</span>正常
              </div>
            </el-col>
            <el-col :xs="24" :lg="12">
              <div style="margin-bottom:30px;">
                <span style="color:#999;">密码：</span>修改密码 >>
                <svg-icon icon-class="lock" style="cursor:pointer;margin-left:15px;font-size:20px;color:#2c2c2c;" @click="dialogFormVisible=true" />
              </div>
            </el-col>
            <el-col
              :xs="24"
              :lg="12"
            >
              <div style="margin-bottom:30px;">
                <span style="color:#999;">注册时间：</span> 2019-10-21 22：01
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="16" :md="14" :lg="12">
        <div
          class="text-h6"
          style="margin-bottom:30px;padding-bottom:10px;border-bottom:1px solid #E1E1E1;"
        >
          任务情况
        </div>
        <el-row>
          <el-col v-for="(o) in 10" :key="o" :xs="22" :sm="11" :md="7" style="margin: 0 20px 20px 0;">
            <div>
              <el-card :body-style="{ padding: '0px' }">
                <div style="padding: 14px;" @click="$router.push('/tasks/2')">
                  <div class="flex-between">
                    <span>好吃的汉堡好吃的汉堡</span>
                    <svg-icon icon-class="done" style="font-size:30px;" />
                  </div>
                  <div class="bottom clearfix">
                    <p style="font-size:14px;color:#666;">by <span class="main">玄机妙算</span></p>
                    <time class="time">2019-10-21 22：00</time>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" @close="reset">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="origin">
          <el-input
            v-model="form.origin"
            type="password"
            onkeydown="if(event.keyCode==32) return false"
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            onkeydown="if(event.keyCode==32) return false"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirm">
          <el-input
            v-model="form.confirm"
            type="password"
            onkeydown="if(event.keyCode==32) return false"
            placeholder="请输入确认密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
export default {
  components: {
    SvgIcon
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {
        origin: '',
        password: '',
        confirm: ''
      },
      rules: {
        origin: [
          { required: true, message: '必须输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirm: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    reset() {
      this.$refs.form.clearValidate()
      this.form = {
        origin: '',
        password: '',
        confirm: ''
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
