<template>
  <div style="padding:20px;">
    <el-button type="primary" round @click="create">新建小组</el-button>
    <el-row style="margin-top:20px;">
      <el-col v-for="o in data" :key="o.id" :xs="12" :sm="8" :md="6" style="margin: 0 20px 20px 0;">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <div class="flex-between">
              <span>{{ o.groupName }}</span>
              <span :style="{color:o.groupStatus==='Normal'?'#000':'#e66457'}">{{ statusList.find(item=>item.value===o.groupStatus).label }}</span>
            </div>
            <div class="bottom clearfix">
              <p style="font-size:14px;color:#666;">邀请码： <span class="main">{{ o.groupInviteCode }}</span></p>
              <el-button type="primary" size="small" plain @click="open(o.id,o.groupName)">更换邀请码</el-button>
              <el-button type="warning" size="small" plain @click="editStatus(o.id,o.groupStatus)">状态管理</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="reset">
      <el-form>
        <el-form-item v-if="selectStatus!==''" label="状态" :label-width="formLabelWidth">
          <el-radio v-model="selectStatus" label="Normal">正常</el-radio>
          <el-radio v-model="selectStatus" label="Frozen">停用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectId: '',
      selectStatus: '',
      statusList: [
        {
          value: 'Normal',
          label: '正常'
        },
        {
          value: 'Frozen',
          label: '停用'
        }
      ],
      data: [],
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get('/v1/usergroup/listall').then((res) => {
      if (res.status === 200) {
        this.data = res.data
        this.$store.commit('app/openLoading', false)
      }
    }).catch(() => {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    })
  },
  methods: {
    open(id, name) {
      this.$confirm(`此操作将更换 <span class="main">${name}</span> 邀请码, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(async() => {
        try {
          const res = await this.$axios.put(`/v1/usergroup/updateInviteCode/${id}`)
          const index = this.data.findIndex(item => item.id === id)
          this.data[index].groupInviteCode = res.data.groupInviteCode
          this.$message({
            type: 'success',
            message: '更换成功'
          })
        } catch (err) {
          console.log(err)
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
      })
    },
    create() {
      this.$prompt('请输入组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async({ value }) => {
        try {
          await this.$axios.post(`/v1/usergroup/save`, {
            groupName: value
          }, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }})
          const res = await this.$axios.get('/v1/usergroup/listall')
          this.data = res.data
          this.$message({
            type: 'success',
            message: '创建成功'
          })
        } catch (err) {
          console.log(err)
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
      })
    },
    editStatus(id, status) {
      this.dialogFormVisible = true
      this.selectStatus = status
      this.selectId = id
    },
    reset() {
      this.selectStatus = ''
    },
    async onSubmit() {
      const index = this.data.findIndex(item => item.id === this.selectId)
      if (this.data[index].groupStatus !== this.selectStatus) {
        try {
          await this.$axios.put(`/v1/usergroup/updateGroupStatus/${this.selectId}/?taskType=${this.selectStatus}`)
          this.data[index].groupStatus = this.selectStatus
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        } catch (err) {
          console.log(err)
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
      }
      this.dialogFormVisible = false
    }
  }
}
</script>
