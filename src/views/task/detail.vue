<template>
  <div style="padding:20px;">
    <el-row style="margin-top:20px;" :gutter="40">
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <div style="margin: 0 30px 30px 0;">
          <el-carousel height="300px">
            <el-carousel-item v-for="(item,index) in images" :key="item">
              <div :style="{width:'100%',height:'300px',background:`url(${item}) no-repeat center center`}" @click="getImg(images, index)" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div>
          <p>操作</p>
          <el-button type="primary" icon="el-icon-edit" round @click="$router.push('/tasks/edit/2')">修改任务</el-button>
          <el-button type="danger" icon="el-icon-delete" round @click="deleteTask">删除任务</el-button>
        </div>
        <div>
          <p>功能</p>
          <el-button type="primary" style="margin-bottom:15px;" round>我的提交</el-button>
          <el-button type="warning" style="margin-bottom:15px;" round>小组情况</el-button>
          <el-button type="danger" style="margin-bottom:15px;" round>去完成任务</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <div class="border">
          <div>
            <h4
              class="flex-between"
              style="font-weight: 400;color: rgb(31, 47, 61);font-size:22px;"
            >{{ title }}<svg-icon icon-class="working" style="font-size:40px;" /></h4>
            <p style="font-size:18px;color:#505050;">任务时间：2019-10-21 23：00 ————2019-10-22 23：00</p>
            <p style="font-size:14px;color:#666;">by <span class="main">玄机妙算</span></p>
          </div>
          <div v-html="ReplaceUrl(editor)" />
          <div style="margin-top:20px;">
            <span style="font-size:18px;color:#ff9800;">本次任务每次完成可获得：</span>
            <svg-icon icon-class="star" style="margin-right:5px;font-size:18px;color:#ff9800;" />
            <span style="font-size:18px;color:#ff9800;">1</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="10" :lg="7">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="组内排行" name="one">
            <div style="height:75vh;">
              <el-scrollbar style="height:100%;">
                <div v-for="(item,index) in 10" :key="item" class="flex-start" style="padding:5px 0;border-bottom:1px solid #ccc;">
                  <div class="rank flex-center" :style="{backgroundColor: index===0?'#ff9800':index===1?'#ccc':index===2?'#b87333':'#3c9cfe'}"><span style="color:#fff;">{{ index+1 }}</span></div>
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
            群内排行
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
import { ImagePreview } from 'vant'
import '@vant/touch-emulator'
export default {
  components: {
    SvgIcon
  },
  data() {
    return {
      title: '世萌外交',
      activeName: 'one',
      images: [
        'https://cdn.quasar.dev/img/mountains.jpg',
        'https://cdn.quasar.dev/img/parallax1.jpg',
        'https://cdn.quasar.dev/img/parallax2.jpg',
        'https://cdn.quasar.dev/img/quasar.jpg'
      ],
      editor: `<div style="text-align: left;">世萌绿宝石项链赛外交</div><div style="text-align: left;">时间：10.19日晚23:00--10.20日晚23.00&nbsp;</div><div style="text-align: left;">票根发给组长</div><div style="text-align: left;">外交：</div><div style="text-align: left;">绿宝石项链赛：</div><div style="text-align: left;">时崎狂三（1）</div><div style="text-align: left;">绿宝石垂饰赛：</div><div style="text-align: left;">冈崎朋也（1）</div><div style="text-align: left;">萌皇赛：蕾姆</div><div style="text-align: left;">夏季番：格蕾-《君主埃尔梅罗二世事件簿》</div><div style="text-align: left;">莱妮丝··埃尔梅罗·阿奇佐尔缇</div><div style="text-align: left;">网址：https://www.internationalsaimoe.com/voting</div><div style="text-align: left;">注意事项</div><div style="text-align: left;">1.截图要带上时间和voteID！！！注意截图要文字部分。</div><div style="text-align: left;">要能够看到[时崎狂三-1]</div><div style="text-align: left;">2.打不开请耐心等待一会，或者刷新再试试</div><div style="text-align: left;">建议截长图，不用截角色图直接截文字部分</div>`
    }
  },
  methods: {
    ReplaceUrl(text) {
      var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/gi
      var s = text.replace(re, a => {
        return '<a href="' + a + '" target=_blank style="text-decoration: underline;color: #00c;">' + a + '</a>'
      })
      return s
    },
    getImg(item, index) {
      ImagePreview({
        images: item,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    },
    deleteTask() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.border {
  padding:15px;
  border-radius: 10px;
  border:1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

</style>

