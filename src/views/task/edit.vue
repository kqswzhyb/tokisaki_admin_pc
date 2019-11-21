<template>
  <div style="padding:20px;">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" style="width:300px;" />
      </el-form-item>
      <el-form-item label="任务时间" prop="date">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          :picker-options="pickerOption"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio-button label="ShortTerm">短期</el-radio-button>
          <el-radio-button label="LongTerm">长期</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="获得积分" prop="score">
        <el-input-number v-model="form.score" :min="1" :max="999" />
      </el-form-item>
      <el-form-item label="文字内容" prop="content">
        <quill-editor
          ref="myQuillEditor"
          v-model="form.content"
          style="width:500px;"
          :options="options"
        />
      </el-form-item>
      <el-form-item label="图片">
        <MyUploader ref="child" :size="1024*1024*3" :image="images" :count="6" @input="getImages" @img="getImage" />
        <el-alert
          title="因技术限制修改图片时需要重新上传"
          type="warning"
          style="width:500px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" :disabled="loading" @click="onSubmit">{{ loading?'正在提交':'修改' }}</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MyUploader from '../../components/Upload'
import dayjs from 'dayjs'
export default {
  components: {
    MyUploader
  },
  data() {
    return {
      loading: false,
      size: 1024 * 1024 * 3,
      count: 6,
      form: {
        name: '',
        type: '',
        score: 1,
        date: [],
        content: '',
        images: [
        ]
      },
      images: [],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择任务时间', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择任务类型', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请选择积分', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ]
      },
      options: {
        placeholder: '请输入模板...',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // 切换按钮  //bold 加粗 italic 斜 underline 下划线 strike删除线
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: 'ordered' }, { list: 'bullet' }], // 排序 ordered 有序  bullet 无序
              // [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ script: 'sub' }, { script: 'super' }], // sub上标 / super下标
              [{ indent: '-1' }, { indent: '+1' }], // 减少缩进/缩进
              [{ direction: 'rtl' }], // 文本方向
              [{ color: [] }, { background: [] }], // color 字体颜色 background 背景颜色  从主题默认下拉
              [{ align: [] }], // 文本对齐方式
              [{ font: [] }], // 字体格式
              [{ size: [] }] // 自定义下拉
            ]
          }
        }
      }
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get(`/v1/task/${this.$route.params.id}`).then((res) => {
      if (res.status === 200) {
        this.form.name = res.data.taskName
        this.form.type = res.data.taskType
        this.form.score = res.data.taskScore
        this.form.content = res.data.taskDetail
        this.form.date = [res.data.startDate, res.data.endDate]
        if (res.data.taskAttachment) {
          res.data.taskAttachment.forEach(item => {
            this.images.push({ url: `${this.$baseURL}/task/${item.attachment.attachName}.${item.attachment.attachExtName}` })
          })
        }
        this.$store.commit('app/openLoading', false)
      }
    }).catch(() => {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    })
  },
  methods: {
    getImage(data) {
      this.form.images = data
    },
    async getImages(data) {
      try {
        const res = await this.$axios.put(`/v1/task/${this.$route.params.id}`, {
          taskName: this.form.name,
          startDate: dayjs
            .utc(this.form.date[0]).format(),
          endDate: dayjs
            .utc(this.form.date[1]).format(),
          taskType: this.form.type,
          taskScore: this.form.score,
          taskDetail: this.form.content,
          taskAttachment: data,
          id: this.$route.params.id
        }, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
        if (res.status !== 200) {
          this.$message.error('错误')
          this.loading = false
        } else {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          setTimeout(() => {
            this.loading = false
            this.$router.push(`/tasks/${this.$route.params.id}`)
          }, 2000)
        }
      } catch {
        this.$message.error('请求出错,请检查网络或刷新重试！')
        this.loading = false
      }
    },
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.loading = true
          if (this.form.images.length === 0) {
            try {
              const res = await this.$axios.put(`/v1/task/${this.$route.params.id}`, {
                taskName: this.form.name,
                startDate: dayjs
                  .utc(this.form.date[0]).format(),
                endDate: dayjs
                  .utc(this.form.date[1]).format(),
                taskType: this.form.type,
                taskScore: this.form.score,
                taskDetail: this.form.content,
                id: this.$route.params.id
              }, {
                headers: {
                  'Content-Type': 'application/json; charset=UTF-8'
                }
              })
              if (res.status !== 200) {
                this.$message.error('错误')
                this.loading = false
              } else {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push(`/tasks/${this.$route.params.id}`)
                }, 2000)
                this.loading = false
              }
            } catch {
              this.$message.error('请求出错,请检查网络或刷新重试！')
              this.loading = false
            }
          } else {
            this.$refs.child.load()
          }
        }
      })
    }
  }
}
</script>
