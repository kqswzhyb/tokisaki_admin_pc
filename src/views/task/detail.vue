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
        <div>
          <p>操作</p>
          <el-button type="warning" icon="el-icon-edit" round @click="$router.push(`/tasks/edit/${$route.params.id}`)">修改任务</el-button>
        </div>
        <div>
          <p>功能</p>
          <el-button type="primary" style="margin-bottom:15px;" round @click="$router.push('/user/record/2?uid=2')">我的提交</el-button>
          <el-button type="danger" style="margin-bottom:15px;" round @click="dialogFormVisible=true">去完成任务</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <div class="border">
          <div>
            <h4
              class="flex-between"
              style="font-weight: 400;color: rgb(31, 47, 61);font-size:22px;"
            >{{ data.taskName }}<svg-icon :icon-class="new Date(data.endDate).getTime()>currentDate.getTime()?'working':'finish'" style="font-size:40px;" /></h4>
            <p style="font-size:18px;color:#505050;">任务时间：{{ data.startDate | prettyDate }} ————{{ data.endDate | prettyDate }}</p>
            <p style="font-size:14px;color:#666;">by <span class="main">{{ data.createUser&&data.createUser.nickName || '管理员' }}</span></p>
          </div>
          <div v-html="ReplaceUrl(data.taskDetail)" />
          <div style="margin-top:20px;">
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
    <el-dialog title="做任务" :visible.sync="dialogFormVisible" @close="reset">
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
          <van-uploader v-model="form.images" multiple />
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
import { Uploader as VanUploader } from 'vant'
import { ImagePreview } from 'vant'
import '@vant/touch-emulator'
export default {
  components: {
    SvgIcon,
    VanUploader
  },
  data() {
    return {
      currentDate: new Date(),
      activeName: 'one',
      images: [
        'https://cdn.quasar.dev/img/mountains.jpg',
        'https://cdn.quasar.dev/img/parallax1.jpg',
        'https://cdn.quasar.dev/img/parallax2.jpg',
        'https://cdn.quasar.dev/img/quasar.jpg'
      ],
      editor: `<div style="text-align: left;">世萌绿宝石项链赛外交</div><div style="text-align: left;">时间：10.19日晚23:00--10.20日晚23.00&nbsp;</div><div style="text-align: left;">票根发给组长</div><div style="text-align: left;">外交：</div><div style="text-align: left;">绿宝石项链赛：</div><div style="text-align: left;">时崎狂三（1）</div><div style="text-align: left;">绿宝石垂饰赛：</div><div style="text-align: left;">冈崎朋也（1）</div><div style="text-align: left;">萌皇赛：蕾姆</div><div style="text-align: left;">夏季番：格蕾-《君主埃尔梅罗二世事件簿》</div><div style="text-align: left;">莱妮丝··埃尔梅罗·阿奇佐尔缇</div><div style="text-align: left;">网址：https://www.internationalsaimoe.com/voting</div><div style="text-align: left;">注意事项</div><div style="text-align: left;">1.截图要带上时间和voteID！！！注意截图要文字部分。</div><div style="text-align: left;">要能够看到[时崎狂三-1]</div><div style="text-align: left;">2.打不开请耐心等待一会，或者刷新再试试</div><div style="text-align: left;">建议截长图，不用截角色图直接截文字部分</div>`,
      dialogFormVisible: false,
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
        this.$store.commit('app/openLoading', false)
      }
      if (res.status === 202) {
        this.$store.commit('app/openLoading', false)
        this.$router.push('/404')
      }
    }).catch(() => {
      this.$message.error('请求出错')
    })
  },
  methods: {
    ReplaceUrl(text) {
      var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/gi
      var s = text.replace(re, a => {
        return '<a href="' + a + '" target=_blank style="text-decoration: underline;color: #00c;">' + a + '</a>'
      })
      return s
    },
    getImg(item, index) {
      ImagePreview({
        images: item,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    },
    reset() {
      this.$refs.form.clearValidate()
      this.form = {
        text: '',
        images: []
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

<style lang="scss" scoped>

</style>

