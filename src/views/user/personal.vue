<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="16" :md="14" :lg="12">
        <div style="margin:20px;display:flex;">
          <div>
            <img
              v-if="info.iconUrl"
              :src="info.iconUrl.replace('http','https')"
              width="120px;"
              style="border-radius:10px;"
            >
            <img
              v-else
              src="@/assets/images/default_user.jpg"
              width="120px;"
              style="border-radius:10px;"
            >
          </div>
          <div style="margin:10px 0 0 50px;">
            <div style="margin-bottom:15px;">
              <span class="main" style="font-size:18px;">{{ info.nickName }}</span>
            </div>
            <div class="flex-start" style="cursor:pointer;" @click="$router.push(`/user/scores?uid=${$route.query.uid}`)">
              <svg-icon icon-class="star" style="margin-right:15px;font-size:20px;color:#ff9800;" />
              <span style="color:#ff9800;" class="text-h6">{{ info.totalScore?info.totalScore:0 }}</span>
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
                <span style="color:#999;">QQ：</span>{{ info.username }}
              </div>
            </el-col>
            <el-col :xs="24" :lg="12">
              <div style="margin-bottom:30px;">
                <span style="color:#999;">身份：</span>{{ info.roles&& roleList.find(item=>item.value===info.roles.length).label }}
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
                <span style="color:#999;">帐号状态：</span>{{ info.roles&& statuss.find(item=>item.value===info.userStatus).label }}
              </div>
            </el-col>
            <el-col v-if="$store.state.user.info.user.id===$route.query.uid" :xs="24" :lg="12">
              <div style="margin-bottom:30px;">
                <span style="color:#999;">密码设置：</span>修改密码 >>
                <svg-icon icon-class="lock" style="cursor:pointer;margin-left:15px;font-size:20px;color:#2c2c2c;" @click="dialogFormVisible=true" />
              </div>
            </el-col>
            <el-col
              :xs="24"
              :lg="12"
            >
              <div style="margin-bottom:30px;">
                <span style="color:#999;">注册时间：</span> {{ info.registerDate | simplePrettyDate }}
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
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了"
          loading-text=""
          :offset="30"
          @load="onLoad"
        >
          <el-row v-if="tasks.length!==0">
            <el-col v-for="(o) in tasks.slice(0,number)" :key="o.id" :xs="22" :sm="15" :md="11" style="margin: 0 20px 20px 0; cursor:pointer;">
              <div>
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;" @click="$router.push(`/user/record/${o.id}?uid=${$route.query.uid}`)">
                    <div class="flex-between">
                      <span>{{ o.taskName }}</span>
                      <svg-icon icon-class="done" style="font-size:30px;" />
                    </div>
                    <div class="bottom clearfix">
                      <p style="font-size:14px;color:#666;">by <span class="main">{{ o.createUser.nickName }}</span></p>
                      <time class="time">{{ o.startDate | prettyDate }}</time>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </van-list>
        <div v-if="tasks.length===0" class="flex-center" style="height:100px;">
          暂无完成过的任务
        </div>
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
        <el-button type="primary" :loading="submitLoading" :disabled="submitLoading" @click="submitForm('form')">{{ submitLoading?'正在提交':'确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
// import { List as VanList } from 'vant'
export default {
  components: {
    // VanList,
    SvgIcon
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码应不少于6位'))
      } else if (!(/^[\u4e00-\u9fa5A-Za-z0-9]+$/gi).test(value)) {
        callback(new Error('只能输入英文字母和数字'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      roleList: [
        {
          value: 3,
          label: '管理员'
        },
        {
          value: 2,
          label: '组长'
        },
        {
          value: 1,
          label: '组员'
        }
      ],
      number: 20,
      loading: false,
      finished: false,
      info: {},
      statuss: [{
        value: 'Normal',
        label: '正常'
      }, {
        value: 'Frozen',
        label: '冻结'
      }],
      dialogFormVisible: false,
      form: {
        origin: '',
        password: '',
        confirm: ''
      },
      tasks: [],
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
      formLabelWidth: '120px',
      timer: ''
    }
  },
  computed: {
    groups() {
      return this.$store.state.group.groups
    },
    task() {
      return this.$store.state.task.tasks
    }
  },
  watch: {
    '$route.query.uid': function() {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.commit('app/openLoading', true)
      this.$axios.all([this.$axios.get(`/v1/user/${this.$route.query.uid}`), this.$axios.get(`/v1/usertask/user/${this.$route.query.uid}/`)])
        .then(this.$axios.spread((res, res2) => {
          if (res.status === 200 && res2.status === 200) {
            this.info = res.data
            const taskIdList = Array.from(new Set(res2.data.map(item => item.task.id)))
            this.timer = setInterval(async() => {
              this.$store.commit('app/openLoading', true)
              if (this.groups[0]) {
                clearInterval(this.timer)
                this.tasks = taskIdList.map(item => this.task.find(item2 => item2.id === item))
                this.$store.commit('app/openLoading', false)
              }
            }, 500)
          } else {
            this.$store.commit('app/openLoading', false)
            this.$router.push('/404')
          }
        })).catch(() => {
          this.$message.error('请求出错,请检查网络或刷新重试！')
        })
    },
    onLoad() {
      setTimeout(() => {
        if (this.number < this.tasks.length) {
          this.number += 10
        }
        this.loading = false
        if (this.number >= this.tasks.length) {
          this.finished = true
        }
      }, 1000)
    },
    reset() {
      this.$refs.form.clearValidate()
      this.form = {
        origin: '',
        password: '',
        confirm: ''
      }
      this.dialogFormVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.submitLoading = true
          this.$axios.post('/v1/user/changePassword/', {
            oldPassword: this.form.origin,
            newPassword: this.form.password
          }, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).then(res => {
            if (res.status === 200) {
              this.submitLoading = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogFormVisible = false
            } else {
              this.submitLoading = false
              this.$message.error('原密码错误')
            }
          }).catch(() => {
            this.$message.error('请求出错,请检查网络或刷新重试！')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
