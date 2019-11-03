<template>
  <div style="padding:20px;">
    <el-button type="primary" round @click="create">新建小组</el-button>
    <el-row style="margin-top:20px;">
      <el-col v-for="o in data" :key="o" :xs="12" :sm="8" :md="6" style="margin: 0 20px 20px 0;">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <div class="flex-between">
              <span>{{ o.name }}</span>
              <span :style="{color:o.status===0?'#000':'#e66457'}">{{ statusList.find(item=>item.value===o.status).label }}</span>
            </div>
            <div class="bottom clearfix">
              <p style="font-size:14px;color:#666;">邀请码： <span class="main">{{ o.code }}</span></p>
              <el-button type="primary" size="small" plain @click="open(o.id,o.name)">更换邀请码</el-button>
              <el-button type="warning" size="small" plain @click="editStatus(o.id,o.status)">状态管理</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="reset">
      <el-form>
        <el-form-item v-if="selectStatus!==''" label="状态" :label-width="formLabelWidth">
          <el-radio v-model="selectStatus" :label="0">正常</el-radio>
          <el-radio v-model="selectStatus" :label="1">停用</el-radio>
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
export default {
  data() {
    return {
      selectId: '',
      selectStatus: '',
      statusList: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '停用'
        }
      ],
      data: [
        {
          id: 1,
          name: '1组',
          code: '2D4FZZ213',
          status: 0
        },
        {
          id: 2,
          name: '2组',
          code: '2D4FZZ213',
          status: 1
        }
      ],
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    open(id, name) {
      this.$confirm(`此操作将更换 <span class="main">${name}</span> 邀请码, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '更换成功!'
        })
      })
    },
    create() {
      this.$prompt('请输入组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.data.push({
          id: this.data.length + 1,
          name: value,
          code: '2D4FZZ213',
          status: 0
        },)
        this.$message({
          type: 'success',
          message: '创建成功'
        })
      })
    },
    editStatus(id, status) {
      this.dialogFormVisible = true
      this.selectStatus = status
      this.selectId = id
    },
    reset() {
      this.selectStatus = ''
    }
  }
}
</script>
