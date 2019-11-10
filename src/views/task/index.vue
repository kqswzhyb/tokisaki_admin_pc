<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="短期任务" name="short">
        <el-row style="margin-top:20px;">
          <el-col v-for="(o) in shorts" :key="o.id" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;cursor:pointer;" @click="$router.push(`/tasks/${o.id}`)">
                <div class="flex-between">
                  <span>{{ o.taskName }}</span>
                  <svg-icon :icon-class="new Date(o.endDate).getTime()>currentDate.getTime()?'working':'finish'" style="font-size:30px;" />
                </div>
                <div class="bottom clearfix">
                  <p style="font-size:14px;color:#666;">by <span class="main">玄机妙算</span></p>
                  <time class="time">{{ o.startDate | prettyDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="长期任务" name="long">
        <el-row style="margin-top:20px;">
          <el-col v-for="(o) in longs" :key="o.id" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;cursor:pointer;" @click="$router.push(`/tasks/${o.id}`)">
                <div class="flex-between">
                  <span>{{ o.taskName }}</span>
                  <svg-icon :icon-class="new Date(o.endDate).getTime()>currentDate.getTime()?'working':'finish'" style="font-size:30px;" />
                </div>
                <div class="bottom clearfix">
                  <p style="font-size:14px;color:#666;">by <span class="main">玄机妙算</span></p>
                  <time class="time">{{ o.startDate | prettyDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
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
      shorts: [],
      longs: []
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get('/v1/task').then((res) => {
      if (res.status === 200) {
        res.data.forEach(item => {
          if (item.taskType === 'ShortTerm') {
            this.shorts.push(item)
          } else {
            this.longs.push(item)
          }
        })
        this.shorts.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        this.longs.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        this.$store.commit('app/openLoading', false)
      }
    }).catch(() => {
      this.$message.error('请求出错')
    })
  },
  methods: {
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

