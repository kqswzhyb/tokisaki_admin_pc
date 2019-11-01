<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="15" :md="16" :lg="17">
        <el-calendar id="calendar" v-model="value">
          <template
            slot="dateCell"
            slot-scope="{date, data}"
          >
            <div>
              <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
              <div v-for="(item,index) in calendarData" :key="index">
                <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                  <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                    <div class="is-selected" @click.stop="getData(item.things)">{{ item.things }}</div>
                  </div>
                  <div v-else />
                </div>
                <div v-else />
              </div>
            </div>
          </template>
        </el-calendar>
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
                  <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;">{{ index+1 }}</span></div>
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
export default {
  data() {
    return {
      value: new Date(),
      activeName: 'one',
      active: '世萌外交',
      calendarData: [
        { months: ['09', '11'], days: ['15'], things: '世萌外交' },
        { months: ['10', '11'], days: ['02'], things: '开会' },
        { months: ['11'], days: ['02'], things: '点赞评论' },
        { months: ['11'], days: ['02'], things: '世萌外交' }
      ]
    }
  },
  methods: {
    getData(data) {
      this.active = data
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-day{
  text-align: center;
  color: #202535;
  line-height: 30px;
  font-size: 12px;
}
.is-selected{
    color: #e66457;
    font-size: 10px;
    margin-top: 5px;
}
#calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
    content: '当月';
}
</style>

