<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="15" :md="16" :lg="17">
        <div style="padding:20px;background:#fff;border-radius:8px;">
          <FullCalendar
            default-view="dayGridMonth"
            :plugins="calendarPlugins"
            :events="options"
            locale="zh-cn"
            @eventClick="eventClick"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="9" :md="8" :lg="7">
        <div v-if="$store.state.user.info.roles.length>=3" style="width:100%;">
          <span>小组</span>
          <el-select v-model="groupId" style="margin: 0 40px 20px 10px;" placeholder="请选择小组">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            />
          </el-select>
        </div>
        <p class="main" style="font-size:20px;cursor:pointer;" @click="$router.push(`/tasks/${active.id}`)">{{ active.taskName }}</p>
        <p>本次任务起始时间: {{ active.startDate|prettyDate }}</p>
        <p>本次任务结束时间: {{ active.endDate|prettyDate }}</p>
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
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import RankTemplate from '../../components/RankTemplate'
import RankList from '../../components/RankList'
export default {
  components: {
    FullCalendar,
    RankTemplate,
    RankList
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin],
      value: '',
      activeName: 'all',
      active: {},
      options: [],

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
    shorts() {
      return this.$store.state.task.shorts
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
          if (res2.data.groupList) {
            this.one = res2.data.groupList
          }
          if (res.data.userGroupList) {
            this.group = res.data.userGroupList
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
        this.options = this.shorts.map(item => ({ ...item, start: item.startDate, end: item.endDate, title: item.taskName, backgroundColor: '#3788d8', borderColor: '#3788d8' })).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
        this.value = this.options[0].id
        this.options[0] = Object.assign(this.options[0], { backgroundColor: '#e66457', borderColor: '#e66457' })
        this.active = this.options[0]
        this.$store.commit('app/openLoading', false)
      }
    }, 10)
  },
  methods: {
    eventClick(data) {
      const index = this.options.findIndex(item => item.id === this.value)
      this.options[index] = Object.assign(this.options[index], { backgroundColor: '#3788d8', borderColor: '#3788d8' })
      this.value = data.event.id
      const index2 = this.options.findIndex(item => item.id === this.value)
      this.options[index2] = Object.assign(this.options[index2], { backgroundColor: '#e66457', borderColor: '#e66457' })
      this.active = this.options[index2]
    }
  }
}
</script>

<style lang="scss">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
</style>

