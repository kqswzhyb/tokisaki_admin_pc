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
            <RankList ref="wone" :height="468" :ranks="weekRankOne" />
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            <RankList ref="wall" :height="468" :ranks="weekRankAll" />
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <RankTemplate ref="wgroup" :height="478" :ranks="weekRankGroup" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <p class="main" style="font-size:20px;">总积分排行</p>
        <el-tabs v-model="total" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <RankList ref="tone" :height="534" :ranks="totalRankOne" />
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            <RankList ref="tall" :height="534" :ranks="totalRankAll" />
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <RankTemplate ref="tgroup" :height="478" :ranks="totalRankGroup" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <p class="main" style="font-size:20px;">月积分排行</p>
        <p>本次统计起始时间: {{ monthTime.start| prettyDate }}</p>
        <p>本次统计结束时间: {{ monthTime.end| prettyDate }}</p>
        <el-tabs v-model="month" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <RankList ref="mone" :height="468" :ranks="monthRankOne" />
          </el-tab-pane>
          <el-tab-pane label="群内排行" name="all">
            <RankList ref="mall" :height="468" :ranks="monthRankAll" />
          </el-tab-pane>
          <el-tab-pane v-if="$store.state.user.info.roles.length >= 3" label="小组排行" name="group">
            <RankTemplate ref="mgroup" :height="478" :ranks="monthRankGroup" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RankTemplate from '../../components/RankTemplate'
import RankList from '../../components/RankList'
export default {
  components: {
    RankTemplate,
    RankList
  },
  data() {
    return {
      week: 'all',
      month: 'all',
      total: 'all',

      groupId: '',

      monthRankOne: [],

      weekRankOne: [],

      totalRankOne: [],
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
        if (this.$refs.mone) {
          this.$refs.mone.initData()
        }
        if (this.$refs.tone) {
          this.$refs.tone.initData()
        }
        if (this.$refs.wone) {
          this.$refs.wone.initData()
        }
        this.weekRankOne = this.weekRankAll.filter(item => item.userGroup.id === val)
        this.monthRankOne = this.monthRankAll.filter(item => item.userGroup.id === val)
        this.totalRankOne = this.totalRankAll.filter(item => item.userGroup.id === val)
        this.$store.commit('app/openLoading', false)
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
  }
}
</script>
