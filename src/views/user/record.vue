<template>
  <div style="padding:20px;">
    <div style="margin-bottom:20px;">
      当前用户：<span style="color:#505050;font-size:18px;cursor:pointer;" @click="$router.push(`/user/personal?uid=${id}`)">{{ nickName }}</span>
    </div>
    <div style="margin-bottom:20px;">
      当前任务：<span
        class="main"
        style="font-size:18px;cursor:pointer;"
        @click="$router.push(`/tasks/${$route.params.id}`)"
      >{{ taskName }}</span>
    </div>
    <div
      v-if="data.length === 0"
      class="flex-center"
      style="flex-direction:column;margin-top:200px;"
    >
      <p>
        <svg-icon icon-class="sad" style="font-size:50px;color:#ff9800;" />
      </p>
      <span style="font-size:24px;">没有提交过</span>
    </div>
    <el-row :gutter="40">
      <el-col
        v-for="(item, index) in data"
        :key="item.id"
        :xs="24"
        :sm="20"
        :md="16"
        :lg="12"
        style="margin-bottom:15px;"
      >
        <el-card>
          <p style="padding-bottom:10px;border-bottom:1px solid #E1E1E1;" class="flex-between"><span class="main">第 {{ index+1 }} 次提交</span> <span style="font-size:14px;color:#666;">{{ item.finishedDate| prettyDate }}</span></p>
          <div>
            <span style="color:#505050;">获得积分：</span> <span style="color:#ff9800;border-bottom:1px dashed #000;cursor:pointer;" @click="open(index,item.id,item.task.taskScore)">{{ item.taskScore }}</span>
            分
            <div style="margin: 20px 0;">
              <span style="color:#505050;">提交内容：</span><div style="margin-top:20px;" v-html="ReplaceUrl(item.taskMemo)" />
            </div>
            <div>
              <span style="color:#505050;">提交图片：</span>
              <span v-if="item.images.length === 0">
                没有提交图片
              </span>
              <div v-else class="flex-start" style="margin-top:20px;">
                <div
                  v-for="(item2, index2) in item.images"
                  :key="index2"
                  :style="{marginRight:'20px',background:`url(${item2}) no-repeat center center`,backgroundSize:'cover',width:'100px',height:'100px'}"
                  @click="getImg(item.images, index2)"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
import { ImagePreview } from 'vant'
export default {
  name: 'Record',
  components: {
    SvgIcon
  },
  data() {
    return {
      data: [],
      taskName: '',
      nickName: '',
      role: 0,
      id: ''
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.all([this.$axios.get(`/v1/usertask/user/${this.$route.query.uid}/task/${this.$route.params.id}/`), this.$axios.get(`/v1/task/${this.$route.params.id}`), this.$axios.get(`/v1/user/${this.$route.query.uid}`)])
      .then(this.$axios.spread((res, res2, res3) => {
        if (res.status === 200 && res2.status === 200 && res3.status === 200) {
          this.data = res.data
          this.taskName = res2.data.taskName
          this.id = res3.data.id
          this.nickName = res3.data.nickName
          this.role = res3.data.roles.length
          this.data = this.data.map(item => {
            return Object.assign({}, item, { images: item.utAttachment && item.utAttachment.map(item2 => `${this.$baseURL}/${item2.attachment.attachType.slice(0, 1).toLowerCase() + item2.attachment.attachType.slice(1)}/${item2.attachment.attachName}.${item2.attachment.attachExtName}`) || [] })
          })
          this.$store.commit('app/openLoading', false)
        } else {
          this.$store.commit('app/openLoading', false)
          this.$router.push('/404')
        }
      })).catch(() => {
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
    open(index, id, score) {
      if (this.$store.state.user.info.roles.length > this.role) {
        this.$prompt('请输入积分(数字)', '修改积分', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d+(\.\d+)?$/,
          inputErrorMessage: '输入格式不正确'
        }).then(async({ value }) => {
          try {
            const res = await this.$axios.post(`/v1/usertask/task/audit/${id}/`, { taskScore: Number(value) }, {
              headers: {
                'Content-Type': 'application/json; charset=UTF-8'
              }
            })
            if (res.status !== 200) {
              this.$message.error(`判定积分不能大于${score}`)
              this.loading = false
            } else {
              this.data[index].taskScore = value
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
          } catch {
            this.$message.error('请求出错,请检查网络或刷新重试！')
            this.loading = false
          }
        })
      }
    },
    getImg(item, index) {
      ImagePreview({
        images: item,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    }
  }
}
</script>
