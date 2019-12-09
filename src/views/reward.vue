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
              <img v-else :src="`${$baseURL}/scoreAward/${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachName}.${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachExtName}`" style="width:120px;" alt="" @click="getImg(`${$baseURL}/scoreAward/${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachName}.${scope.row.scoreAwardAttachment&&scope.row.scoreAwardAttachment[0].attachment.attachExtName}`)">
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
          <MyUploader ref="child" type="ScoreAward" :image="form.images" :count="1" @input="getImages" @img="getImage" />
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
    var checkScore = (rule, value, callback) => {
      if (!value && value !== '0') {
        return callback(new Error('请输入积分'))
      }
      value = String(value)
      if (value.indexOf('-') !== -1) {
        return callback(new Error('积分不能为负数'))
      }
      const index = value.indexOf('.')
      if (index !== -1) {
        return callback(new Error('积分不能为小数'))
      }
      callback()
    }
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
      selectedId: '',
      rules: {
        text: [
          { required: true, message: '请输入奖励名称', trigger: 'blur' }
        ],
        score: [
          { required: true, validator: checkScore, trigger: 'blur' }
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
    this.getData()
  },
  methods: {
    getData() {
      this.$store.commit('app/openLoading', true)
      this.$axios.get('/v1/scoreAward').then((res) => {
        if (res.status === 200) {
          this.rewards = res.data.sort((a, c) => a.awardPoint - c.awardPoint)
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
    getImage(data) {
      this.form.images = data
    },
    async getImages(data) {
      const isNew = (this.title === '新增奖励')
      try {
        const res = await this.$axios[isNew ? 'post' : 'put'](isNew ? '/v1/scoreAward' : `/v1/scoreAward/${this.selectedId}`, Object.assign({
          awardPoint: this.form.score,
          awardTitle: this.form.text,
          scoreAwardAttachment: data
        }, isNew ? {} : { id: this.selectedId }), {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
        if (res.status !== (isNew ? 201 : 200)) {
          this.$message.error('错误')
          this.loading = false
        } else {
          this.$message({
            message: isNew ? '创建成功' : '修改成功',
            type: 'success'
          })
          this.loading = false
          this.onReset()
          this.$refs.child.initData()
          this.$nextTick(() => {
            this.getData()
          })
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
      this.dialogFormVisible = false
    },
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.loading = true
          const isNew = (this.title === '新增奖励')
          if (this.form.images.length === 0) {
            try {
              const res = await this.$axios[isNew ? 'post' : 'put'](isNew ? '/v1/scoreAward' : `/v1/scoreAward/${this.selectedId}`, Object.assign({
                awardPoint: this.form.score,
                awardTitle: this.form.text
              }, isNew ? {} : { id: this.selectedId }), {
                headers: {
                  'Content-Type': 'application/json; charset=UTF-8'
                }
              })
              if (res.status !== (isNew ? 201 : 200)) {
                this.$message.error('错误')
                this.loading = false
              } else {
                this.$message({
                  message: isNew ? '创建成功' : '修改成功',
                  type: 'success'
                })
                this.loading = false
                this.onReset()
                this.$nextTick(() => {
                  this.getData()
                })
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
      this.selectedId = ''
      this.dialogFormVisible = true
      this.title = '新增奖励'
      this.form = {
        text: '',
        score: '',
        images: []
      }
    },
    edit(id) {
      this.selectedId = id
      this.dialogFormVisible = true
      this.title = '修改奖励'
      const data = this.rewards.find(item => item.id === id)
      this.form = {
        text: data.awardTitle,
        score: data.awardPoint,
        images: data.scoreAwardAttachment ? data.scoreAwardAttachment.map(item => ({
          url: `${this.$baseURL}/${item.attachment.attachType.slice(0, 1).toLowerCase() + item.attachment.attachType.slice(1)}/${item.attachment.attachName}.${item.attachment.attachExtName}`, attachment: item.attachment
        })) : []
      }
    },
    remove(id) {
      this.$confirm('此操作将永久删除该奖励节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/v1/scoreAward/${id}`).then((res) => {
          if (res.status === 200) {
            const index = this.rewards.findIndex(item => item.id === id)
            this.rewards.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(() => {
          this.$message.error('请求出错,请检查网络或刷新重试！')
        })
      })
    }
  }
}
</script>
