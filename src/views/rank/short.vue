<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="15" :md="16" :lg="17">
        <FullCalendar
          default-view="dayGridMonth"
          :plugins="calendarPlugins"
          :events="options"
          locale="zh-cn"
          @eventClick="eventClick"
        />
      </el-col>
      <el-col :xs="24" :sm="9" :md="8" :lg="7">
        <p class="main" style="font-size:20px;">{{ active.taskName }}</p>
        <p>本次任务起始时间: {{ active.startDate|prettyDate }}</p>
        <p>本次任务结束时间: {{ active.endDate|prettyDate }}</p>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <div v-for="(item,index) in 10" :key="item" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;">
                  <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                  <div class="flex-between" style="width:100%;">
                    <div class="flex-start">
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                      <div>
                        <p>玄机妙算</p>
                        <p style="color:#505050;font-size:14px;">02001</p>
                      </div>
                    </div>
                    <div><span style="color:#ff9800;">1000</span></div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            群内排行
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin],
      value: '',
      activeName: 'one',
      active: {},
      options: []
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get('/v1/task/search/?taskType=ShortTerm').then((res) => {
      if (res.status === 200) {
        this.options = res.data.map(item => ({ ...item, start: item.startDate, end: item.endDate, title: item.taskName })).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
        this.value = this.options[0].id
        this.active = this.options[0]
        this.$store.commit('app/openLoading', false)
      }
    }).catch(() => {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    })
  },
  methods: {
    eventClick(data) {
      const id = data.event.id
      this.active = this.options.find(item => item.id === id)
    }
  }
}
</script>

<style lang="scss">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
</style>

