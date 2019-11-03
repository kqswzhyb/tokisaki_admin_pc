<template>
  <div class="app-container">
    <span>小组</span>
    <el-select v-model="group" style="margin: 0 40px 20px 10px;" placeholder="请选择小组">
      <el-option
        v-for="item in groups"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <span>状态</span>
    <el-select v-model="status" style="margin:0 0 20px 20px;" placeholder="请选择帐号状态">
      <el-option
        v-for="item in statuss"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.uniqueNumber }}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatar.url" style="width:80px;" alt="" lazy />
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="总积分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="帐号状态" align="center">
        <template slot-scope="scope">
          <span style="border-bottom:1px dashed #000;cursor:pointer;" @click="editStatus(scope.row.id,scope.row.status)">{{ statusList.find(item=>item.value===scope.row.status).label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份">
        <template slot-scope="scope">
          <span style="border-bottom:1px dashed #000;cursor:pointer;" @click="editRole(scope.row.id,scope.row.role)">{{ roleList.find(item=>item.value===scope.row.role).label }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="reset">
      <el-form>
        <el-form-item v-if="selectRole!==''" label="身份" :label-width="formLabelWidth">
          <el-radio v-model="selectRole" label="member">组员</el-radio>
          <el-radio v-model="selectRole" label="leader">组长</el-radio>
        </el-form-item>
        <el-form-item v-if="selectStatus!==''" label="状态" :label-width="formLabelWidth">
          <el-radio v-model="selectStatus" :label="0">正常</el-radio>
          <el-radio v-model="selectStatus" :label="1">冻结</el-radio>
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
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      selectId: '',
      selectStatus: '',
      selectRole: '',
      group: 0,
      groups: [
        {
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '1组'
        }, {
          value: 2,
          label: '2组'
        }, {
          value: 3,
          label: '3组'
        }, {
          value: 4,
          label: '4组'
        }, {
          value: 5,
          label: '5组'
        }],
      statusList: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '冻结'
        }
      ],
      status: -1,
      statuss: [{
        value: -1,
        label: '全部'
      }, {
        value: 0,
        label: '正常'
      }, {
        value: 1,
        label: '冻结'
      }],
      roleList: [
        {
          value: 'admin',
          label: '管理员'
        },
        {
          value: 'leader',
          label: '组长'
        },
        {
          value: 'member',
          label: '组员'
        }
      ],
      data: [
        {
          id: 2332,
          uniqueNumber: '02001',
          name: '玄机妙算',
          role: 'leader',
          status: 0,
          avatar: {
            url: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          score: 1000
        },
        {
          id: 3212,
          uniqueNumber: '02002',
          name: '时光无声',
          role: 'member',
          status: 1,
          avatar: {
            url: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          score: 2000
        }
      ],
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    editStatus(id, status) {
      this.dialogFormVisible = true
      this.selectStatus = status
      this.selectId = id
    },
    editRole(id, role) {
      this.dialogFormVisible = true
      this.selectRole = role
      this.selectId = id
    },
    reset() {
      this.selectRole = ''
      this.selectStatus = ''
    }
  }
}
</script>
