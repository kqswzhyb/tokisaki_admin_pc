<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-timeline>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="已经到底了..."
            loading-text=""
            :offset="30"
            @load="onLoad"
          >
            <el-timeline-item v-for="(item,index) in list.slice(0,number)" :key="index" :timestamp="$options.filters.prettyDate(item.time)" placement="top">
              <el-card>
                <h4 style="cursor:pointer;" @click="$router.push(`/tasks/${item.task.id}`)">{{ item.task.taskName }}</h4>
                <p v-if="item.action===0">因提交任务获得 <span class="main">{{ item.score }}</span> 分</p>
                <p v-else>获得的积分被<span class="main"> {{ item.name }} </span>改为 <span class="main">{{ item.score }}</span> 分</p>
              </el-card>
            </el-timeline-item>
          </van-list>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      list: [],
      number: 5,
      loading: false,
      finished: false
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get(`/v1/usertask/user/${this.$route.query.uid}/`).then(res => {
      if (res.status === 200) {
        this.data = res.data
        this.this = []
        this.data.forEach(item => {
          if (item.auditDate) {
            this.list.push({ time: item.auditDate, action: 1, task: item.task, score: item.taskScore, name: item.auditUser.nickName })
          }
          this.list.push({ time: item.finishedDate, action: 0, task: item.task, score: item.task.taskScore })
        })
        this.list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        this.$store.commit('app/openLoading', false)
      }
    }).catch(() => {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    })
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.number < this.list.length) {
          this.number += 10
        }
        this.loading = false
        if (this.number >= this.list.length) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>
