<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :lg="8">
        <p class="main" style="font-size:20px;">周积分排行</p>
        <p>本次统计起始时间: {{ weekTime.start| prettyDate }}</p>
        <p>本次统计结束时间: {{ weekTime.end| prettyDate }}</p>
        <el-tabs v-model="week" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <!-- <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad"
                >
                  <div v-for="(item,index) in number" :key="item" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;">
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
                </van-list>
              </el-scrollbar>
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="weekAllLoading"
                  :finished="weekAllFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('weekAllNumber','weekAllLoading','weekAllFinished','weekRankAll')"
                >
                  <div v-for="(item,index) in weekRankAll.slice(0,weekAllNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="color:#505050;font-size:14px;">{{ item.userCode }}</p>
                        </div>
                      </div>
                      <div style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <p class="main" style="font-size:20px;">总积分排行</p>
        <el-tabs v-model="total" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:534px;">
              <el-scrollbar style="height:100%;">
                <div v-for="(item,index) in 10" :key="item" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;">
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
            <div style="height:534px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="totalAllLoading"
                  :finished="totalAllFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('totalAllNumber','totalAllLoading','totalAllFinished','totalRankAll')"
                >
                  <div v-for="(item,index) in totalRankAll.slice(0,totalAllNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="color:#505050;font-size:14px;">{{ item.userCode }}</p>
                        </div>
                      </div>
                      <div style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <p class="main" style="font-size:20px;">月积分排行</p>
        <p>本次统计起始时间: 2019.10.19 00:00:00</p>
        <p>本次统计结束时间: 2019.11.19 00:00:00</p>
        <el-tabs v-model="month" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <div v-for="(item,index) in 10" :key="item" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;">
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
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="monthAllLoading"
                  :finished="monthAllFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('monthAllNumber','monthAllLoading','monthAllFinished','monthRankAll')"
                >
                  <div v-for="(item,index) in monthRankAll.slice(0,monthAllNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="color:#505050;font-size:14px;">{{ item.userCode }}</p>
                        </div>
                      </div>
                      <div style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { List as VanList } from 'vant'
export default {
  components: {
    VanList
  },
  data() {
    return {
      week: 'all',
      month: 'all',
      total: 'all',

      weekTime: {},
      weekRankAll: [],
      weekAllNumber: 20,
      weekAllLoading: false,
      weekAllFinished: false,

      monthTime: {},
      monthRankAll: [],
      monthAllNumber: 20,
      monthAllLoading: false,
      monthAllFinished: false,

      totalRankAll: [],
      totalAllNumber: 20,
      totalAllLoading: false,
      totalAllFinished: false
    }
  },
  created() {
    this.$store.commit('app/openLoading', true)
    this.$axios.get('/v1/rank/groupRank').then((res) => {
      if (res.status === 200) {
        this.weekTime = { start: res.data.weekStart, end: res.data.weekEnd }
        this.weekRankAll = res.data.weekList
        this.monthTime = { start: res.data.monthStart, end: res.data.monthEnd }
        this.monthRankAll = res.data.monthList
        this.totalRankAll = res.data.allList
        this.$store.commit('app/openLoading', false)
      }
    }).catch(() => {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    })
  },
  methods: {
    onLoad(number, loading, finished, data) {
      setTimeout(() => {
        if (this[number] < this[data].length) {
          this[number] += 10
        }
        this[loading] = false
        if (this[number] >= this[data].length) {
          this[finished] = true
        }
      }, 1000)
    },
    goPersonal(id) {
      if (this.$store.state.user.info.roles.length >= 2) {
        this.$router.push(`/user/personal?uid=${id}`)
      }
    }
  }
}
</script>
