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
      <div class="flex-center" style="margin:0 0 20px 20px;">
        <p style="margin:0 20px;">找到数据 <span class="main">{{ data.length||0 }}</span> 条</p>
      </div>
      <div style="margin:0 0 20px 20px;">
        <ExportExcel v-if="$store.state.user.info.roles.length>=2&&data.length!==0" :data="excel" :t-header="['小组','昵称','头像','QQ号码','总积分','角色','帐号状态']" />
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
          <el-table-column label="小组" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userGroup ? scope.row.userGroup.groupName : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="头像" align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.iconUrl" :src="scope.row.iconUrl.replace('http','https')" style="width:60px;height:60px;cursor:pointer;" alt="" lazy @click="$router.push(`/user/personal?uid=${scope.row.id}`)" />
              <img v-else src="@/assets/images/default_user.jpg" style="cursor:pointer;" width="60" alt="" @click="$router.push(`/user/personal?uid=${scope.row.id}`)">
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center" prop="nickName" />
          <el-table-column label="总积分" align="center" prop="totalScore" sortable />
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
  </div>
</template>

<script>
import ExportExcel from '../../components/ExportExcel'
export default {
  components: {
    ExportExcel
  },
  data() {
    return {
      listLoading: false,
      loading: false,
      finished: false,
      number: 10,
      group: 0,
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
      list: [],
      excel: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      timer: ''
    }
  },
  computed: {
    groups() {
      return [{ id: 0, groupName: '全部' }, ...this.$store.state.group.groups]
    }
  },
  watch: {
    status: async function(val) {
      try {
        this.listLoading = true
        if (val === 'All' && this.group === 0) {
          this.data = Array.from(this.list)
        }
        if (val === 'All' && this.group !== 0) {
          this.data = this.list.filter(
            item => item.userGroup.id === this.group
          )
        }
        if (val !== 'All' && this.group === 0) {
          this.data = this.list.filter(
            item => item.userStatus === val
          )
        }
        if (val !== 'All' && this.group !== 0) {
          this.data = this.list.filter(
            item =>
              item.userStatus === val &&
                  item.userGroup.id === this.group
          )
        }
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
        if (this.status === 'All' && val === 0) {
          this.data = Array.from(this.list)
        }
        if (this.status === 'All' && val !== 0) {
          this.data = this.list.filter(
            item => item.userGroup.id === val
          )
        }
        if (this.status !== 'All' && val === 0) {
          this.data = this.list.filter(
            item => item.userStatus === this.status
          )
        }
        if (this.status !== 'All' && val !== 0) {
          this.data = this.list.filter(
            item =>
              item.userStatus === this.status &&
                  item.userGroup.id === val
          )
        }
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
    this.listLoading = true
    this.timer = setInterval(async() => {
      this.$store.commit('app/openLoading', true)
      if (this.groups[0]) {
        clearInterval(this.timer)
        if (this.$store.state.user.info.user.userGroup) {
          const result = await this.$axios.get(
            `/v1/user/search/?groupId=${
              this.$store.state.user.info.user.userGroup.id
            }`
          )
          this.list = result.data.filter(item => item.roles.length !== 3)
          this.group = this.$store.state.user.info.user.userGroup.id
          this.listLoading = false
        } else {
          const result = await this.$axios.get('/v1/user')
          this.list = result.data.filter(item => item.roles.length !== 3)
          this.data = Array.from(this.list)
          this.formatData(this.data)
          this.listLoading = false
        }
        this.$store.commit('app/openLoading', false)
      }
    }, 500)
  },
  methods: {
    editStatus(id, status, role) {
      if (this.$store.state.user.info.roles.length > role) {
        this.$confirm(`将此用户帐号状态设置为${status === 'Normal' ? '冻结' : '正常'}, 是否继续?`, '帐号状态更改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(`/v1/user/changeuserstatus/${id}/`).then(res => {
            if (res.status === 200) {
              const index = this.data.findIndex(item => item.id === id)
              this.$set(this.data, index, Object.assign({}, this.data[index], { userStatus: status === 'Normal' ? 'Frozen' : 'Normal' }))
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
            }
          }).catch(() => {
            this.$message.error('请求出错,请检查网络或刷新重试！')
          })
        })
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
          group: item.userGroup ? item.userGroup.groupName : '',
          nickName: item.nickName,
          iconUrl: item.iconUrl ? item.iconUrl.replace('http', 'https') : '',
          username: Number(item.username),
          totalScore: item.totalScore ? Number(item.totalScore) : 0,
          role: this.roleList.find(item2 => item2.value === item.roles.length).label,
          status: this.statuss.find(item2 => item2.value === item.userStatus).label
        }
      })
    },
    editRole(id, role) {
      if (this.$store.state.user.info.roles.length >= 2 && this.$store.state.user.info.user.id !== id) {
        this.$confirm(`将此用户设置为${role === 2 ? '组员' : '组长'}, 是否继续?`, '权限更改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(`/v1/user/changeuserrole/${id}/`).then(res => {
            if (res.status === 200) {
              const index = this.data.findIndex(item => item.id === id)
              this.$set(this.data, index, Object.assign({}, this.data[index], { roles: role === 2 ? ['ROLE_USER'] : ['ROLE_USER', 'ROLE_LEADER'] }))
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
            }
          }).catch(() => {
            this.$message.error('请求出错,请检查网络或刷新重试！')
          })
        })
      }
    }
  }
}
</script>
