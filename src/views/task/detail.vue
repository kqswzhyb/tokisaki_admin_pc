<template>
  <div style="padding:20px;">
    <el-row style="margin-top:20px;" :gutter="40">
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <p v-if="images.length!==0">公告附图</p>
        <el-carousel v-if="images.length!==0" height="300px">
          <el-carousel-item v-for="(item,index) in images" :key="item">
            <div :style="{width:'100%',height:'300px',background:`url(${item}) no-repeat center center`,backgroundSize:'cover'}" @click="getImg(images, index)" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <div class="border" style="background:#fff;">
          <div>
            <h4
              class="flex-between"
              style="font-weight: 400;color: rgb(31, 47, 61);font-size:22px;"
            >{{ data.taskName }}<svg-icon :icon-class="new Date(data.endDate).getTime()>currentDate.getTime()?'working':'finish'" style="font-size:40px;" /></h4>
            <p style="font-size:18px;color:#505050;">任务时间：{{ data.startDate | prettyDate }} ————{{ data.endDate | prettyDate }}</p>
            <p style="font-size:14px;color:#666;">by <span class="main">{{ data.createUser&&data.createUser.nickName || '管理员' }}</span></p>
          </div>
          <div v-html="ReplaceUrl(data.taskDetail)" />
          <div style="margin:20px 0 10px;">
            <el-button v-if="$store.state.user.info.roles.length===3" type="warning" size="mini" round @click="$router.push(`/tasks/edit/${$route.params.id}`)">修改任务</el-button>
            <el-button type="primary" size="mini" round @click="$router.push(`/user/record/${$route.params.id}?uid=${$store.state.user.info.user.id}`)">我的提交</el-button>
            <el-button v-if="new Date(data.endDate).getTime() > currentDate.getTime()" type="danger" size="mini" round @click="dialogFormVisible=true">去完成任务</el-button>
            <el-button v-if="$store.state.user.info.roles.length===3" type="success" size="mini" round style="margin: 10px 0 0 0;" @click="$router.push(`/tasks/record/${$route.params.id}`)">任务记录</el-button>
          </div>
          <div>
            <span style="font-size:18px;color:#ff9800;">本次任务每次完成可获得：</span>
            <svg-icon icon-class="star" style="margin-right:5px;font-size:18px;color:#ff9800;" />
            <span style="font-size:18px;color:#ff9800;">{{ data.taskScore }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:75vh;">
              <el-scrollbar style="height:100%;">
                <div v-for="(item,index) in 10" :key="item" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="$router.push('/user/record/2')">
                  <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                  <div class="flex-between" style="width:100%;">
                    <div class="flex-start">
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                      <div>
                        <p>玄机妙算</p>
                        <p style="color:#505050;font-size:14px;">02001</p>
                      </div>
                    </div>
                    <div><span style="color:#ff9800;">1000</span></div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            群内排行
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog title="做任务" :visible.sync="dialogFormVisible" @close="onReset">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="文字" :label-width="formLabelWidth" prop="text">
          <el-input
            v-model="form.text"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" prop="images">
          <MyUploader ref="child" type="UserTask" :size="1024*1024*3" :count="6" @input="getImages" @img="getImage" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;">取 消</el-button>
        <el-button type="primary" :loading="loading" :disabled="loading" @click="onSubmit('form')">{{ loading?'正在提交':'确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
import MyUploader from '../../components/Upload'
import { ImagePreview } from 'vant'
import '@vant/touch-emulator'
export default {
  components: {
    SvgIcon,
    MyUploader
  },
  data() {
    return {
      currentDate: new Date(),
      activeName: 'one',
      images: [],
      dialogFormVisible: false,
      loading: false,
      data: {},
      form: {
        text: '',
        images: []
      },
      rules: {
        images: [
          { required: true, message: '至少上传一张图片', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get(`/v1/task/${this.$route.params.id}`).then((res) => {
      if (res.status === 200) {
        this.data = res.data
        if (res.data.taskAttachment) {
          res.data.taskAttachment.forEach(item => {
            this.images.push(`${this.$baseURL}/${item.attachment.attachType.slice(0, 1).toLowerCase() + item.attachment.attachType.slice(1)}/${item.attachment.attachName}.${item.attachment.attachExtName}`)
          })
        }
        this.$store.commit('app/openLoading', false)
      }
      if (res.status === 202) {
        this.$store.commit('app/openLoading', false)
        this.$router.push('/404')
      }
    }).catch(() => {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    })
  },
  methods: {
    ReplaceUrl(text) {
      var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/gi
      if (re.test(text)) {
        return text.replace(re, a => {
          return '<a href="' + a + '" target=_blank style="text-decoration: underline;color: #00c;">' + a + '</a>'
        })
      }
      return text
    },
    getImage(data) {
      this.form.images = data
    },
    async getImages(data) {
      try {
        const res = await this.$axios.post(`/v1/usertask/task/${this.$route.params.id}/`, {
          taskMemo: this.form.text,
          utAttachment: data
        }, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
        if (res.status !== 201) {
          this.$message.error('错误')
          this.loading = false
        } else {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.loading = false
          this.onReset()
          this.$refs.child.initData()
        }
      } catch {
        this.$message.error('请求出错,请检查网络或刷新重试！')
        this.loading = false
      }
    },
    getImg(item, index) {
      ImagePreview({
        images: item,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    },
    onReset() {
      this.$refs.form.clearValidate()
      this.form = {
        text: '',
        images: []
      }
      this.dialogFormVisible = false
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$refs.child.load()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

