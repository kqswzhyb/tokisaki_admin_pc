<template>
  <div :style="{height:`${height}px`}">
    <el-scrollbar style="height:100%;">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="已经到底了..."
        loading-text=""
        :offset="30"
        @load="onLoad"
      >
        <div v-for="(item,index) in ranks.slice(0,number)" :key="item.id" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;cursor:pointer;" @click="goPersonal(item.userId)">
          <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;font-size:12px">{{ index+1 }}</span></div>
          <div class="flex-between" style="width:100%;">
            <div class="flex-start">
              <img v-if="item.iconUrl" :src="item.iconUrl.replace('http','https')" style="margin-right:15px;border-radius:50%;" alt="" width="50">
              <img v-else src="@/assets/images/default_user.jpg" style="margin-right:15px;border-radius:50%;" alt="" width="50">
              <div>
                <p>{{ item.nickName }}</p>
                <p style="color:#666;">{{ groups.find(item2=>item2.id===item.groupId).groupName }}</p>
              </div>
            </div>
            <div v-if="$store.state.user.info.roles.length >= 2" style="margin-right:12px;"><span style="color:#ff9800;">{{ item.totalScore }}</span></div>
          </div>
        </div>
      </van-list>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 478
    },
    ranks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      number: 20,
      loading: false,
      finished: false
    }
  },
  computed: {
    groups() {
      return this.$store.state.group.groups
    }
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.number < this.ranks.length) {
          this.number += 10
        }
        this.loading = false
        if (this.number >= this.ranks.length) {
          this.finished = true
        }
      }, 1000)
    },
    initData() {
      this.number = 20
      this.loading = false
      this.finished = false
    },
    goPersonal(id) {
      if (this.$store.state.user.info.roles.length >= 2) {
        this.$router.push(`/user/personal?uid=${id}`)
      }
    }
  }
}
</script>

<style>

</style>
