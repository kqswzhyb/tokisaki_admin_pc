<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="20" :md="16" :lg="14">
        <el-button type="primary" style="margin-bottom:30px;" round @click="create">新增</el-button>
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
              {{ scope.row.score }}
            </template>
          </el-table-column>
          <el-table-column
            label="奖励名称"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.text }}
            </template>
          </el-table-column>
          <el-table-column
            label="奖励预览"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.image.url">暂无预览图片</span>
              <img v-else :src="scope.row.image.url" style="width:100%;" alt="" @click="getImg(scope.row.image.url)">
            </template>
          </el-table-column>
          <el-table-column
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
      <el-form ref="form" :model="form">
        <el-form-item label="奖励名称" :label-width="formLabelWidth">
          <el-input v-model="form.text" autocomplete="off" placeholder="请输入奖励名称" />
        </el-form-item>
        <el-form-item label="积分节点" :label-width="formLabelWidth">
          <el-input v-model="form.score" type="number" :min="0" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" prop="images">
          <van-uploader v-model="form.image" :max-count="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { Uploader as VanUploader } from 'vant'
export default {
  components: {
    VanUploader
  },
  data() {
    return {
      rewards: [
        {
          id: 1,
          text: 'bilibili大会员一个月',
          score: 200,
          image: {
            key: '1221',
            url: 'https://cdn.quasar.dev/img/mountains.jpg'
          }
        },
        {
          id: 2,
          text: '时崎狂三挂画一副',
          score: 500,
          image: {
            key: '1221',
            url: 'https://cdn.quasar.dev/img/mountains.jpg'
          }
        },
        {
          id: 3,
          text: '时崎狂三手办一个（任选）',
          score: 9999,
          image: {}
        }
      ],
      dialogFormVisible: false,
      title: '',
      form: {
        text: '',
        score: '',
        image: {}
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
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
        image: {}
      }
    },
    create() {
      this.dialogFormVisible = true
      this.title = '新增奖励'
      this.form = {
        text: '',
        score: '',
        image: []
      }
    },
    edit(id) {
      this.dialogFormVisible = true
      this.title = '修改奖励'
      const data = this.rewards.find(item => item.id === id)
      const image = []
      image[0] = data.image
      this.form = {
        text: data.text,
        score: data.score,
        image: data.image.url ? image : []
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
