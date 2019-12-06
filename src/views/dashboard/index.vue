<template>
  <div class="dashboard-container">
    <div style="margin-bottom:30px;">
      <span>短期任务</span>
      <el-row v-if="shorts.some(item=>new Date(item.endDate).getTime()>currentDate.getTime())" style="margin-top:20px;">
        <el-col v-for="(o) in shorts" v-if="new Date(o.endDate).getTime()>currentDate.getTime()" :key="o.id" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
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
      <el-row v-else style="margin-top:20px;">
        <div style="margin-left:50px;color:#505050;">
          暂无进行中的任务...
        </div>
      </el-row>
    </div>
    <el-row>
      <el-col :xs="10" :sm="5" :md="4">
        <div class="tag">
          <div class="flex-center" style="margin-bottom:10px;">
            <svg-icon icon-class="star" style="margin-right:15px;font-size:30px;color:#fff;" />
            <span style="font-size:18px;color:#fff;">总积分</span>
          </div>
          <span style="font-size:18px;color:#fff;">{{ $store.state.user.info.user.totalScore }}</span>
        </div>
      </el-col>
      <el-col :xs="10" :sm="5" :md="4">
        <div class="tag" style="background-color:#e66457;">
          <div class="flex-center" style="margin-bottom:10px;">
            <svg-icon icon-class="rank3" style="margin-right:15px;font-size:30px;color:#fff;" />
            <span style="font-size:18px;color:#fff;">总排名</span>
          </div>
          <span style="font-size:18px;color:#fff;">{{ rank.total }}</span>
        </div>
      </el-col>
      <el-col :xs="10" :sm="5" :md="4">
        <div class="tag" style="background-color:#26A69A;">
          <div class="flex-center" style="margin-bottom:10px;">
            <svg-icon icon-class="rank2" style="margin-right:15px;font-size:30px;color:#fff;" />
            <span style="font-size:18px;color:#fff;">月排名</span>
          </div>
          <span style="font-size:18px;color:#fff;">{{ rank.month }}</span>
        </div>
      </el-col>
      <el-col :xs="10" :sm="5" :md="4">
        <div class="tag" style="background-color:#21BA45;">
          <div class="flex-center" style="margin-bottom:10px;">
            <svg-icon icon-class="rank1" style="margin-right:15px;font-size:30px;color:#fff;" />
            <span style="font-size:18px;color:#fff;">周排名</span>
          </div>
          <span style="font-size:18px;color:#fff;">{{ rank.week }}</span>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top:30px;">
      <span>长期任务</span>
      <el-row v-if="longs.some(item=>new Date(item.endDate).getTime()>currentDate.getTime())" style="margin-top:20px;">
        <el-col v-for="(o) in longs" v-if="new Date(o.endDate).getTime()>currentDate.getTime()" :key="o.id" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
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
      <el-row v-else style="margin-top:20px;">
        <div style="margin-left:50px;color:#505050;">
          暂无进行中的任务...
        </div>
      </el-row>
    </div>
    <div style="margin-top:30px;">
      <span>积分奖励</span>
      <el-row style="margin-top:20px;">
        <el-col :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
          <el-card :body-style="{ padding: '0px' }">
            <div style="padding: 14px;cursor:pointer;" @click="$router.push('/reward')">
              <div class="flex-between">
                <span>积分奖励一览</span>
                <svg-icon icon-class="working" style="font-size:30px;" />
              </div>
              <div class="bottom clearfix">
                <p style="font-size:14px;color:#666;line-height:20px;">达到积分节点请联系时光，QQ：2507321376</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
export default {
  name: 'Dashboard',
  components: {
    SvgIcon
  },
  data() {
    return {
      currentDate: new Date(),
      shorts: [],
      longs: [],
      rank: {}
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.all([this.$axios.get(`/v1/task`), this.$axios.get('/v1/rank/groupRank')])
      .then(this.$axios.spread((res, res2) => {
        if (res.status === 200 && res2.status === 200) {
          res.data.forEach(item => {
            if (item.taskType === 'ShortTerm') {
              this.shorts.push(item)
            } else {
              this.longs.push(item)
            }
          })
          const id = this.$store.state.user.info.user.id
          this.rank = { week: res2.data.weekList ? `${res2.data.weekList ? res2.data.weekList.findIndex(item => item.id === id) === -1 ? 0 : res2.data.weekList.findIndex(item => item.id === id) + 1 : -1 + 1} / ${res2.data.weekList ? res2.data.weekList.length : 0}` : '0 / 0', month: res2.data.monthList ? `${res2.data.monthList ? res2.data.monthList.findIndex(item => item.id === id) === -1 ? 0 : res2.data.monthList.findIndex(item => item.id === id) + 1 : -1 + 1} / ${res2.data.monthList ? res2.data.monthList.length : 0}` : '0 / 0', total: `${res2.data.allList ? res2.data.allList.findIndex(item => item.id === id) === -1 ? 0 : res2.data.allList.findIndex(item => item.id === id) + 1 : -1 + 1} / ${res2.data.allList ? res2.data.allList.length : 0}` }
          this.shorts.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          this.longs.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          this.$store.commit('app/openLoading', false)
        } else {
          this.$store.commit('app/openLoading', false)
          this.$router.push('/404')
        }
      })).catch(() => {
        this.$message.error('请求出错,请检查网络或刷新重试！')
      })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
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
