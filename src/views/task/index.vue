<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="短期任务" name="short">
        <van-list
          v-if="shorts.slice(0,shortNumber).length!==0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多任务了"
          loading-text=""
          :offset="30"
          @load="onLoad"
        >
          <el-row style="margin-top:20px;">
            <el-col v-for="(o) in shorts.slice(0,shortNumber)" :key="o.id" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
              <el-card :body-style="{ padding: '0px' }">
                <div style="padding: 14px;cursor:pointer;" @click="$router.push(`/tasks/${o.id}`)">
                  <div class="flex-between">
                    <span>{{ o.taskName }}</span>
                    <svg-icon :icon-class="new Date(o.endDate).getTime()>currentDate.getTime()?'working':'finish'" style="font-size:30px;" />
                  </div>
                  <div class="bottom clearfix">
                    <p style="font-size:14px;color:#666;">by <span class="main">{{ o.createUser&&o.createUser.nickName || '管理员' }}</span></p>
                    <time class="time">{{ o.startDate | prettyDate }}</time>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </van-list>
        <div v-else style="width:100%;height:calc( 100vh - 270px );min-height:400px;" class="flex-center">
          <span style="font-size:20px;">暂无正在进行中的短期任务</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="长期任务" name="long">
        <el-row v-if="longs.length!==0" style="margin-top:20px;">
          <el-col v-for="(o) in longs" :key="o.id" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;cursor:pointer;" @click="$router.push(`/tasks/${o.id}`)">
                <div class="flex-between">
                  <span>{{ o.taskName }}</span>
                  <svg-icon :icon-class="new Date(o.endDate).getTime()>currentDate.getTime()?'working':'finish'" style="font-size:30px;" />
                </div>
                <div class="bottom clearfix">
                  <p style="font-size:14px;color:#666;">by <span class="main">{{ o.createUser&&o.createUser.nickName || '管理员' }}</span></p>
                  <time class="time">{{ o.startDate | prettyDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else style="width:100%;height:calc( 100vh - 270px );min-height:400px;" class="flex-center">
          <span style="font-size:20px;">暂无正在进行中的长期任务</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'short',
      currentDate: new Date(),
      shortNumber: 20,
      loading: false,
      finished: false
    }
  },
  computed: {
    shorts() {
      return this.$store.state.task.shorts
    },
    longs() {
      return this.$store.state.task.longs
    }
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.shortNumber < this.shorts.length) {
          this.shortNumber += 10
        }
        this.loading = false
        if (this.shortNumber >= this.shorts.length) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>

