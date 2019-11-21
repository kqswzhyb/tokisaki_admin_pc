<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="20" :md="16" :lg="14">
        <el-button v-if="roles.length===3" type="primary" style="margin-bottom:30px;" round @click="create">新增</el-button>
        <el-table
          :data="rewards"
          border
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column
            label="积分节点"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.awardPoint }}
            </template>
          </el-table-column>
          <el-table-column
            label="奖励名称"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.awardTitle }}
            </template>
          </el-table-column>
          <el-table-column
            label="奖励预览"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.scoreAwardAttachment">暂无预览图片</span>
              <img v-else :src="`${$baseURL}/task/${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachName}.${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachExtName}`" style="width:120px;" alt="" @click="getImg(`${$baseURL}/task/${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachName}.${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachExtName}`)">
            </template>
          </el-table-column>
          <el-table-column
            v-if="roles.length===3"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <div class="flex-between">
                <el-button type="primary" round @click="edit(scope.row.id)">修改</el-button>
                <el-button type="danger" round @click="remove(scope.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="onReset">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="奖励名称" :label-width="formLabelWidth" prop="text">
          <el-input v-model="form.text" autocomplete="off" placeholder="请输入奖励名称" />
        </el-form-item>
        <el-form-item label="积分节点" :label-width="formLabelWidth" prop="score">
          <el-input v-model="form.score" type="number" :min="0" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" prop="images">
          <MyUploader ref="child" :size="1024*1024*3" :count="1" @input="getImages" @img="getImage" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" :disabled="loading" @click="onSubmit">{{ loading?'正在提交':'确定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyUploader from '../components/Upload'
import { ImagePreview } from 'vant'
export default {
  components: {
    MyUploader
  },
  data() {
    return {
      loading: false,
      rewards: [],
      dialogFormVisible: false,
      title: '',
      form: {
        text: '',
        score: '',
        images: []
      },
      rules: {
        text: [
          { required: true, message: '请输入奖励名称', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入积分', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    roles() {
      return this.$store.state.user.info.roles
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get('/v1/scoreAward').then((res) => {
      if (res.status === 200) {
        this.rewards = res.data
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
    getImage(data) {
      this.form.images = data
    },
    async getImages(data) {
      try {
        const res = await this.$axios.post('/v1/scoreAward', {
          awardPoint: this.form.score,
          awardTitle: this.form.text,
          scoreAwardAttachment: data
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
            message: '创建成功',
            type: 'success'
          })
          this.loading = false
          this.onReset()
        }
      } catch {
        this.$message.error('请求出错,请检查网络或刷新重试！')
        this.loading = false
      }
    },
    getImg(item) {
      const data = []
      data[0] = item
      ImagePreview({
        images: data
      })
    },
    onReset() {
      this.$refs.form.clearValidate()
      this.form = {
        text: '',
        score: '',
        images: []
      }
    },
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.loading = true
          if (this.form.images.length === 0) {
            try {
              const res = await this.$axios.post('/v1/scoreAward', {
                awardPoint: this.form.score,
                awardTitle: this.form.text
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
                  message: '创建成功',
                  type: 'success'
                })
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
    },
    create() {
      this.dialogFormVisible = true
      this.title = '新增奖励'
      this.form = {
        text: '',
        score: '',
        images: []
      }
    },
    edit(id) {
      this.dialogFormVisible = true
      this.title = '修改奖励'
      const data = this.rewards.find(item => item.id === id)
      const image = []
      image[0] = data.images
      this.form = {
        text: data.text,
        score: data.score,
        images: data.images.url ? image : []
      }
    },
    remove(id) {
      this.$confirm('此操作将永久删除该奖励节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.rewards.findIndex(item => item.id === id)
        this.rewards.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}
</script>
