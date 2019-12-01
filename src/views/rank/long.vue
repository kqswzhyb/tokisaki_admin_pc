<template>
  <div style="padding:20px;">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :lg="8">
        <div>
          <span>任务</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.taskName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div v-if="$store.state.user.info.roles.length>=3" style="margin-top:10px;">
          <span>小组</span>
          <el-select v-model="groupId" placeholder="请选择小组">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            />
          </el-select>
        </div>
        <p>本次任务起始时间: {{ value && options.find(item=>item.id===value).startDate | prettyDate }}</p>
        <p>本次任务结束时间: {{ value && options.find(item=>item.id===value).endDate | prettyDate }}</p>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:468px;">
              <el-scrollbar style="height:100%;">
                <van-list
                  v-model="oneLoading"
                  :finished="oneFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('oneNumber','oneLoading','oneFinished','one')"
                >
                  <div v-for="(item,index) in one.slice(0,oneNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
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
                  v-model="allLoading"
                  :finished="allFinished"
                  finished-text="已经到底了..."
                  loading-text=""
                  :offset="30"
                  @load="onLoad('allNumber','allLoading','allFinished','all')"
                >
                  <div v-for="(item,index) in all.slice(0,allNumber)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.id)">
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
      activeName: 'all',
      options: [],
      value: '',

      all: [],
      one: [],
      allNumber: 20,
      allLoading: false,
      allFinished: false,
      oneNumber: 20,
      oneLoading: false,
      oneFinished: false,

      groupId: '',
      groups: []
    }
  },
  watch: {
    value: async function(val) {
      if (val && this.groupId) {
        this.$store.commit('app/openLoading', true)
        this.initData()
        try {
          const res2 = await this.$axios.get(`/v1/rank/groupRankforTask/${val}`)
          const res3 = await this.$axios.get(`/v1/rank/groupRankforTask/${val}/${this.groupId}`)
          if (res2.data.allList) {
            this.all = res2.data.allList
          }
          if (res3.data.groupList) {
            this.one = res3.data.groupList
          }
          this.$store.commit('app/openLoading', false)
        } catch (err) {
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
      }
    },
    groupId: async function(val) {
      if (val && this.value) {
        this.$store.commit('app/openLoading', true)
        this.initGroup()
        try {
          const res = await this.$axios.get(`/v1/rank/groupRankforTask/${this.value}/${val}`)
          if (res.data.groupList) {
            this.one = res.data.groupList
          }
          this.$store.commit('app/openLoading', false)
        } catch (err) {
          this.$message.error('请求出错,请检查网络或刷新重试！')
        }
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
      if (this.$store.state.user.info.user.userGroup) {
        this.groupId = this.$store.state.user.info.user.userGroup.id
      } else {
        this.groupId = this.groups[0].id
      }
      const result2 = await this.$axios.get('/v1/task/search/?taskType=LongTerm')
      this.options = result2.data.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
      this.value = this.options[0].id
      this.$store.commit('app/openLoading', false)
    } catch (err) {
      this.$message.error('请求出错,请检查网络或刷新重试！')
    }
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
      this.all = []
      this.one = []
      this.allNumber = 20
      this.allLoading = false
      this.allFinished = false
      this.oneNumber = 20
      this.oneLoading = false
      this.oneFinished = false
    },
    initGroup() {
      this.one = []
      this.oneNumber = 20
      this.oneLoading = false
      this.oneFinished = false
    }
  }
}
</script>
