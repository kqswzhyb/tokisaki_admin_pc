<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="短期任务" name="short">
        <el-row style="margin-top:20px;">
          <el-col v-for="(o) in 10" :key="o" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;" @click="$router.push('/tasks/2')">
                <div class="flex-between">
                  <span>好吃的汉堡好吃的汉堡</span>
                  <svg-icon icon-class="working" style="font-size:30px;" />
                </div>
                <div class="bottom clearfix">
                  <p style="font-size:14px;color:#666;">by <span class="main">玄机妙算</span></p>
                  <time class="time">2019-10-21 22：00</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="长期任务" name="long">
        <el-row style="margin-top:20px;">
          <el-col v-for="(o) in 10" :key="o" :xs="10" :sm="5" :md="4" style="margin: 0 20px 20px 0;">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;" @click="$router.push('/tasks/2')">
                <div class="flex-between">
                  <span>好吃的汉堡好吃的汉堡</span>
                  <svg-icon icon-class="finish" style="font-size:30px;" />
                </div>
                <div class="bottom clearfix">
                  <p style="font-size:14px;color:#666;">by <span class="main">玄机妙算</span></p>
                  <time class="time">2019-10-21 22：00</time>
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
      activeName: 'short'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>

