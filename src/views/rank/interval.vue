<template>
  <div style="padding:20px;">
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
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :lg="8">
        <p class="main" style="font-size:20px;">周积分排行</p>
        <p>本次统计起始时间: {{ weekTime.start| prettyDate }}</p>
        <p>本次统计结束时间: {{ weekTime.end| prettyDate }}</p>
        <el-tabs v-model="week" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="weekOneLoading"
                  :finished="weekOneFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('weekOneNumber','weekOneLoading','weekOneFinished','weekRankOne')"
                >
                  <div v-for="(item,index) in weekRankOne.slice(0,weekOneNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="color:#505050;font-size:14px;">{{ item.userCode }}</p>
                        </div>
                      </div>
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
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
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
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
                <van-list
                  v-model="totalOneLoading"
                  :finished="totalOneFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('totalOneNumber','totalOneLoading','totalOneFinished','totalRankOne')"
                >
                  <div v-for="(item,index) in totalRankOne.slice(0,totalOneNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="color:#505050;font-size:14px;">{{ item.userCode }}</p>
                        </div>
                      </div>
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
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
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
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
        <p>本次统计起始时间: {{ monthTime.start| prettyDate }}</p>
        <p>本次统计结束时间: {{ monthTime.end| prettyDate }}</p>
        <el-tabs v-model="month" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="monthOneLoading"
                  :finished="monthOneFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('monthOneNumber','monthOneLoading','monthOneFinished','monthRankOne')"
                >
                  <div v-for="(item,index) in monthRankOne.slice(0,monthOneNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="color:#505050;font-size:14px;">{{ item.userCode }}</p>
                        </div>
                      </div>
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
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
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
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
      totalAllFinished: false,

      groupId: '',
      groups: [],

      monthRankOne: [],
      monthOneNumber: 20,
      monthOneLoading: false,
      monthOneFinished: false,

      weekRankOne: [],
      weekOneNumber: 20,
      weekOneLoading: false,
      weekOneFinished: false,

      totalRankOne: [],
      totalOneNumber: 20,
      totalOneLoading: false,
      totalOneFinished: false
    }
  },
  watch: {
    groupId: function(val) {
      if (val) {
        this.$store.commit('app/openLoading', true)
        this.initData()
        this.$axios.get(`/v1/rank/groupRank/${val}`)
          .then(res => {
            if (res.status === 200) {
              if (res.data.groupList) {
                this.totalRankOne = res.data.groupList
              }
              if (res.data.groupWeekList) {
                this.weekRankOne = res.data.groupWeekList
              }
              if (res.data.groupMonthList) {
                this.monthRankOne = res.data.groupMonthList
              }
              this.$store.commit('app/openLoading', false)
            } else {
              this.$store.commit('app/openLoading', false)
              this.$router.push('/404')
            }
          }).catch(() => {
            this.$message.error('请求出错,请检查网络或刷新重试！')
          })
      }
    }
  },
  async created() {
    this.$store.commit('app/openLoading', true)
    try {
      const result = await this.$axios.get('/v1/usergroup/listall')
      if (result.status === 200) {
        this.groups = result.data
      } else {
        this.$router.push('/404')
      }
    } catch (err) {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    }
    if (this.$store.state.user.info.user.userGroup) {
      this.groupId = this.$store.state.user.info.user.userGroup.id
    } else {
      this.groupId = this.groups[0].id
    }
    this.$axios.all([this.$axios.get(`/v1/rank/groupRank`), this.$axios.get(`/v1/rank/groupRank/${this.groupId}`)])
      .then(this.$axios.spread((res, res2) => {
        if (res.status === 200 && res2.status === 200) {
          this.weekTime = { start: res.data.weekStart, end: res.data.weekEnd }
          this.weekRankAll = res.data.weekList
          this.monthTime = { start: res.data.monthStart, end: res.data.monthEnd }
          if (res.data.monthList) {
            this.monthRankAll = res.data.monthList
          }
          if (res.data.allList) {
            this.totalRankAll = res.data.allList
          }
          if (res2.data.groupList) {
            this.totalRankOne = res2.data.groupList
          }
          if (res2.data.groupWeekList) {
            this.weekRankOne = res2.data.groupWeekList
          }
          if (res2.data.groupMonthList) {
            this.monthRankOne = res2.data.groupMonthList
          }
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
    },
    initData() {
      this.monthRankOne = []
      this.monthOneNumber = 20
      this.monthOneLoading = false
      this.monthOneFinished = false

      this.weekRankOne = []
      this.weekOneNumber = 20
      this.weekOneLoading = false
      this.weekOneFinished = false

      this.totalRankOne = []
      this.totalOneNumber = 20
      this.totalOneLoading = false
      this.totalOneFinished = false
    }
  }
}
</script>
