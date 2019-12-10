<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :lg="8">
        <div>
          <span>任务</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.taskName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div v-if="$store.state.user.info.roles.length>=3" style="margin-top:10px;">
          <span>小组</span>
          <el-select v-model="groupId" placeholder="请选择小组">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            />
          </el-select>
        </div>
        <p>本次任务起始时间: {{ value && options.find(item=>item.id===value).startDate | prettyDate }}</p>
        <p>本次任务结束时间: {{ value && options.find(item=>item.id===value).endDate | prettyDate }}</p>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <RankList ref="one" :height="468" :ranks="one" />
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            <RankList ref="all" :height="468" :ranks="all" />
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <RankTemplate ref="group" :height="478" :ranks="group" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RankTemplate from '../../components/RankTemplate'
import RankList from '../../components/RankList'
export default {
  components: {
    RankTemplate,
    RankList
  },
  data() {
    return {
      activeName: 'all',
      options: [],
      value: '',

      all: [],
      one: [],
      group: [],

      groupId: '',
      timer: ''
    }
  },
  computed: {
    groups() {
      return this.$store.state.group.groups
    },
    longs() {
      return this.$store.state.task.longs
    }
  },
  watch: {
    value: async function(val) {
      if (val && this.groupId) {
        this.$store.commit('app/openLoading', true)
        if (this.$refs.group) {
          this.$refs.group.initData()
        }
        if (this.$refs.all) {
          this.$refs.all.initData()
        }
        if (this.$refs.one) {
          this.$refs.one.initData()
        }
        try {
          const res = await this.$axios.get(`/v1/rank/groupRankforTask/${val}`)
          const res2 = await this.$axios.get(`/v1/rank/groupRankforTask/${val}/${this.groupId}`)
          if (res.data.allList) {
            this.all = res.data.allList
          }
          if (res.data.userGroupList) {
            this.group = res.data.userGroupList
          }
          if (res2.data.groupList) {
            this.one = res2.data.groupList
          }
          this.$store.commit('app/openLoading', false)
        } catch (err) {
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
      }
    },
    groupId: async function(val) {
      if (val && this.value) {
        this.$store.commit('app/openLoading', true)
        if (this.$refs.one) {
          this.$refs.one.initData()
        }
        try {
          const res = await this.$axios.get(`/v1/rank/groupRankforTask/${this.value}/${val}`)
          if (res.data.groupList) {
            this.one = res.data.groupList
          }
          this.$store.commit('app/openLoading', false)
        } catch (err) {
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
      }
    }
  },
  async created() {
    this.$store.commit('app/openLoading', true)
    this.timer = setInterval(async() => {
      if (this.groups[0]) {
        clearInterval(this.timer)
        this.$store.commit('app/openLoading', true)
        if (this.$store.state.user.info.user.userGroup) {
          this.groupId = this.$store.state.user.info.user.userGroup.id
        } else {
          this.groupId = this.groups[0].id
        }
        this.options = this.longs.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
        this.value = this.options[0].id
        this.$store.commit('app/openLoading', false)
      }
    }, 10)
  }
}
</script>
