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
                        <img v-if="item.iconUrl" :src="item.iconUrl" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
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
                        <img v-if="item.iconUrl" :src="item.iconUrl" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="padding:0;font-size:14px;color:#505050;">{{ item.userGroup?item.userGroup.groupName:"暂无小组" }}</p>
                        </div>
                      </div>
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <div style="height:478px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="weekGroupLoading"
                  :finished="weekGroupFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('weekGroupNumber','weekGroupLoading','weekGroupFinished','weekRankGroup')"
                >
                  <div v-for="(item,index) in weekRankGroup.slice(0,weekGroupNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <div>
                          <p>{{ item.groupName }}</p>
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
                        <img v-if="item.iconUrl" :src="item.iconUrl" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
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
                        <img v-if="item.iconUrl" :src="item.iconUrl" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="padding:0;font-size:14px;color:#505050;">{{ item.userGroup?item.userGroup.groupName:"暂无小组" }}</p>
                        </div>
                      </div>
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <div style="height:478px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="totalGroupLoading"
                  :finished="totalGroupFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('totalGroupNumber','totalGroupLoading','totalGroupFinished','totalRankGroup')"
                >
                  <div v-for="(item,index) in totalRankGroup.slice(0,totalGroupNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <div>
                          <p>{{ item.groupName }}</p>
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
                        <img v-if="item.iconUrl" :src="item.iconUrl" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
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
                        <img v-if="item.iconUrl" :src="item.iconUrl" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
                        <div>
                          <p>{{ item.nickName }}</p>
                          <p style="padding:0;font-size:14px;color:#505050;">{{ item.userGroup?item.userGroup.groupName:"暂无小组" }}</p>
                        </div>
                      </div>
                      <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
                    </div>
                  </div>
                </van-list>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <div style="height:478px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="monthGroupLoading"
                  :finished="monthGroupFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('monthGroupNumber','monthGroupLoading','monthGroupFinished','monthRankGroup')"
                >
                  <div v-for="(item,index) in monthRankGroup.slice(0,monthGroupNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
                    <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
                    <div class="flex-between" style="width:100%;">
                      <div class="flex-start">
                        <div>
                          <p>{{ item.groupName }}</p>
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
export default {
  data() {
    return {
      week: 'all',
      month: 'all',
      total: 'all',

      weekAllNumber: 20,
      weekAllLoading: false,
      weekAllFinished: false,

      monthAllNumber: 20,
      monthAllLoading: false,
      monthAllFinished: false,

      totalAllNumber: 20,
      totalAllLoading: false,
      totalAllFinished: false,

      groupId: '',

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
      totalOneFinished: false,

      weekGroupNumber: 20,
      weekGroupLoading: false,
      weekGroupFinished: false,

      monthGroupNumber: 20,
      monthGroupLoading: false,
      monthGroupFinished: false,

      totalGroupNumber: 20,
      totalGroupLoading: false,
      totalGroupFinished: false,
      timer: ''
    }
  },
  computed: {
    groups() {
      return this.$store.state.group.groups
    },
    weekTime() {
      return this.$store.state.rank.weekTime
    },
    monthTime() {
      return this.$store.state.rank.monthTime
    },
    weekRankGroup() {
      return this.$store.state.rank.weekRankGroup
    },
    monthRankGroup() {
      return this.$store.state.rank.monthRankGroup
    },
    totalRankGroup() {
      return this.$store.state.rank.totalRankGroup
    },
    weekRankAll() {
      return this.$store.state.rank.weekRankAll
    },
    monthRankAll() {
      return this.$store.state.rank.monthRankAll
    },
    totalRankAll() {
      return this.$store.state.rank.totalRankAll
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
    this.timer = setInterval(async() => {
      if (this.groups[0]) {
        clearInterval(this.timer)
        this.$store.commit('app/openLoading', true)
        if (this.$store.state.user.info.user.userGroup) {
          this.groupId = this.$store.state.user.info.user.userGroup.id
        } else {
          this.groupId = this.groups[0].id
        }
        this.$store.commit('app/openLoading', false)
      }
    }, 10)
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
