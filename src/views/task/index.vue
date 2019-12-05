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
// import { List as VanList } from 'vant'
export default {
  // components: {
  //   VanList
  // },
  data() {
    return {
      activeName: 'short',
      currentDate: new Date(),
      shortNumber: 20,
      shorts: [],
      longs: [],
      loading: false,
      finished: false
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.getData()
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
    },
    getData() {
      this.$store.commit('app/openLoading', true)
      this.shorts = []
      this.longs = []
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
          if (this.$route.query.active === 'true') {
            this.shorts = this.shorts.filter(
              item => new Date(item.endDate).getTime() > this.currentDate.getTime()
            )
            this.longs = this.longs.filter(
              item => new Date(item.endDate).getTime() > this.currentDate.getTime()
            )
          } else {
            this.shorts = this.shorts.filter(
              item => new Date(item.endDate).getTime() > this.currentDate.getTime()
            ).concat(this.shorts.filter(
              item => new Date(item.endDate).getTime() < this.currentDate.getTime()
            ))
            this.longs = this.longs.filter(
              item => new Date(item.endDate).getTime() > this.currentDate.getTime()
            ).concat(this.longs.filter(
              item => new Date(item.endDate).getTime() < this.currentDate.getTime()
            ))
          }
          this.$store.commit('app/openLoading', false)
        }
      }).catch(() => {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      })
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

