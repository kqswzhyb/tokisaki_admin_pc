<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="15" :md="16" :lg="17">
        <FullCalendar
          default-view="dayGridMonth"
          :plugins="calendarPlugins"
          :events="[
            { id:1,title: 'event 1', start : '2019-11-01',
              end : '2019-11-04' },
            { id:2,title: 'event 2', start : '2019-11-05',
              end : '2019-11-08' },
            { id:3,title: 'event 3', date: '2019-11-02' },
            { id:4,title: 'event 4', date: '2019-11-02' },

          ]"
          locale="zh-cn"
          @eventClick="eventClick"
        />
      </el-col>
      <el-col :xs="24" :sm="9" :md="8" :lg="7">
        <p class="main" style="font-size:20px;">{{ active }}</p>
        <p>本次任务起始时间: 2019.10.19 23:00:00</p>
        <p>本次任务结束时间: 2019.10.21 23:00:00</p>
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
      value: new Date(),
      activeName: 'one',
      active: '世萌外交'
    }
  },
  methods: {
    eventClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
</style>

