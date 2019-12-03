<template>
  <div class="app-container">
    <div class="flex-start">
      <div v-if="$store.state.user.info.roles.length>=3">
        <span>小组</span>
        <el-select v-model="group" style="margin: 0 40px 20px 10px;" placeholder="请选择小组">
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </div>
      <div>
        <span>状态</span>
        <el-select v-model="status" style="margin:0 0 20px 20px;" placeholder="请选择帐号状态">
          <el-option
            v-for="item in statuss"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="margin:0 0 20px 20px;">
        <ExportExcel v-if="$store.state.user.info.roles.length>=2&&data.length!==0" :data="excel" :t-header="['昵称','头像','QQ号码','总积分','角色','帐号状态']" />
      </div>

    </div>
    <div style="box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.08);">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多数据了"
        loading-text=""
        :offset="30"
        @load="onLoad"
      >
        <el-table
          v-loading="listLoading"
          :data="data.slice(0,number)"
          element-loading-text="加载中..."
          border
          fit
          highlight-current-row
        >
          <el-table-column label="头像" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.iconUrl" :src="scope.row.iconUrl" style="width:60px;height:60px;" alt="" lazy />
              <img v-else src="@/assets/images/default_user.jpg" width="60" alt="">
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center" prop="nickName" />
          <el-table-column label="总积分" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.totalScore?scope.row.totalScore:0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="QQ号码" align="center" prop="username" />

          <el-table-column class-name="status-col" label="帐号状态" align="center">
            <template slot-scope="scope">
              <span style="border-bottom:1px dashed #000;cursor:pointer;" @click="editStatus(scope.row.id,scope.row.userStatus,scope.row.roles.length)">{{ statuss.find(item=>item.value===scope.row.userStatus).label }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="身份">
            <template slot-scope="scope">
              <span style="border-bottom:1px dashed #000;cursor:pointer;" @click="editRole(scope.row.id,scope.row.roles.length)">{{ roleList.find(item=>item.value===scope.row.roles.length).label }}</span>
            </template>
          </el-table-column>
        </el-table>
      </van-list>
    </div>

    <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="reset">
      <el-form>
        <el-form-item v-if="selectRole!==''" label="身份" :label-width="formLabelWidth">
          <el-radio v-model="selectRole" :label="1">组员</el-radio>
          <el-radio v-model="selectRole" :label="2">组长</el-radio>
        </el-form-item>
        <el-form-item v-if="selectStatus!==''" label="状态" :label-width="formLabelWidth">
          <el-radio v-model="selectStatus" label="Normal">正常</el-radio>
          <el-radio v-model="selectStatus" label="Frozen">冻结</el-radio>
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
import ExportExcel from '../../components/ExportExcel'
import { List as VanList } from 'vant'
export default {
  components: {
    ExportExcel,
    VanList
  },
  data() {
    return {
      listLoading: false,
      loading: false,
      finished: false,
      number: 10,
      selectId: '',
      selectStatus: '',
      selectRole: '',
      group: 0,
      groups: [],
      status: 'All',
      statuss: [{
        value: 'All',
        label: '全部'
      }, {
        value: 'Normal',
        label: '正常'
      }, {
        value: 'Frozen',
        label: '冻结'
      }],
      roleList: [
        {
          value: 2,
          label: '组长'
        },
        {
          value: 1,
          label: '组员'
        }
      ],
      data: [],
      excel: [],
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  watch: {
    status: async function(val) {
      try {
        this.listLoading = true
        let result
        if (val === 'All' && this.group === 0) {
          result = await this.$axios.get('/v1/user')
        }
        if (val === 'All' && this.group !== 0) {
          result = await this.$axios.get(`/v1/user/search/?groupId=${this.group}`)
        }
        if (val !== 'All' && this.group === 0) {
          result = await this.$axios.get(`/v1/user/search/?userStatus=${val}`)
        }
        if (val !== 'All' && this.group !== 0) {
          result = await this.$axios.get(`/v1/user/search/?groupId=${this.group}&&userStatus=${val}`)
        }
        this.data = result.data.filter(item => item.roles.length !== 3)
        this.formatData(this.data)
        this.initData()
        this.listLoading = false
      } catch (err) {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      }
    },
    group: async function(val) {
      try {
        this.listLoading = true
        let result
        if (this.status === 'All' && val === 0) {
          result = await this.$axios.get('/v1/user')
        }
        if (this.status === 'All' && val !== 0) {
          result = await this.$axios.get(`/v1/user/search/?groupId=${val}`)
        }
        if (this.status !== 'All' && val === 0) {
          result = await this.$axios.get(`/v1/user/search/?userStatus=${this.status}`)
        }
        if (this.status !== 'All' && val !== 0) {
          result = await this.$axios.get(`/v1/user/search/?groupId=${val}&&userStatus=${this.status}`)
        }
        this.data = result.data.filter(item => item.roles.length !== 3)
        this.formatData(this.data)
        this.initData()
        this.listLoading = false
      } catch (err) {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      }
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    if (this.$store.state.user.info.user.userGroup) {
      this.group = this.$store.state.user.info.user.userGroup.id
      this.$store.commit('app/openLoading', false)
    } else {
      this.$axios.get('/v1/usergroup/listall').then(async(res) => {
        if (res.status === 200) {
          this.groups = [{ id: 0, groupName: '全部' }, ...res.data]
          const result = await this.$axios.get('/v1/user')
          this.data = result.data.filter(item => item.roles.length !== 3)
          this.formatData(this.data)
          this.$store.commit('app/openLoading', false)
        }
      }).catch(() => {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      })
    }
  },
  methods: {
    editStatus(id, status, role) {
      if (this.$store.state.user.info.roles.length > role) {
        this.dialogFormVisible = true
        this.selectStatus = status
        this.selectId = id
      }
    },
    initData() {
      this.loading = false
      this.finished = false
      this.number = 10
    },
    onLoad() {
      setTimeout(() => {
        if (this.number < this.data.length) {
          this.number += 10
        }
        this.loading = false
        if (this.number >= this.data.length) {
          this.finished = true
        }
      }, 1000)
    },
    formatData(data) {
      this.excel = data.map(item => {
        return {
          nickName: item.nickName,
          iconUrl: item.iconUrl ? item.iconUrl : '',
          username: item.username,
          totalScore: item.totalScore ? Number(item.totalScore) : 0,
          role: this.roleList.find(item2 => item2.value === item.roles.length).label,
          status: this.statuss.find(item2 => item2.value === item.userStatus).label
        }
      })
    },
    editRole(id, role) {
      if (this.$store.state.user.info.roles.length > role) {
        this.dialogFormVisible = true
        this.selectRole = role
        this.selectId = id
      }
    },
    reset() {
      this.selectRole = ''
      this.selectStatus = ''
    }
  }
}
</script>
