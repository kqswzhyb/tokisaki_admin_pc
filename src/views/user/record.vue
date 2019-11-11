<template>
  <div style="padding:20px;">
    <div style="margin-bottom:20px;">
      当前用户：<span style="color:#505050;font-size:18px;">玄机妙算</span>
    </div>
    <div style="margin-bottom:20px;">
      当前任务：<span
        class="main"
        style="font-size:18px;cursor:pointer;"
        @click="$router.push('/tasks/2')"
      >评论点赞</span>
    </div>
    <div
      v-if="data.length === 0"
      class="flex-center"
      style="flex-direction:column;margin-top:200px;"
    >
      <p>
        <svg-icon icon-class="sad" style="font-size:50px;color:#ff9800;" />
      </p>
      <span style="font-size:24px;">没有提交过</span>
    </div>
    <el-row :gutter="40">
      <el-col
        v-for="(item, index) in data"
        :key="index"
        :xs="24"
        :sm="20"
        :md="16"
        :lg="12"
      >
        <el-card>
          <p style="padding-bottom:10px;border-bottom:1px solid #E1E1E1;">第 <span class="main">{{ index+1 }}</span> 次提交</p>
          <div>
            <span style="color:#505050;">获得积分：</span> <span style="color:#ff9800;border-bottom:1px dashed #000;cursor:pointer;" @click="open(index)">{{ item.score }}</span>
            分
            <div style="margin: 20px 0;">
              <span style="color:#505050;">提交内容：</span><div style="margin-top:20px;" v-html="ReplaceUrl(item.text)" />
            </div>
            <div>
              <span style="color:#505050;">提交图片：</span>
              <span v-if="item.images.length === 0">
                没有提交图片
              </span>
              <div v-else class="flex-start" style="margin-top:20px;">
                <div
                  v-for="(item2, index2) in item.images"
                  :key="item2"
                  :style="{marginRight:'20px',background:`url(${item2}) no-repeat center center`,backgroundSize:'cover',width:'100px',height:'100px'}"
                  @click="getImg(item.images, index2)"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/index'
import { ImagePreview } from 'vant'
export default {
  name: 'Record',
  components: {
    SvgIcon
  },
  data() {
    return {
      data: [
        {
          images: [
            'https://cdn.quasar.dev/img/mountains.jpg',
            'https://cdn.quasar.dev/img/parallax1.jpg',
            'https://cdn.quasar.dev/img/parallax2.jpg',
            'https://cdn.quasar.dev/img/quasar.jpg'
          ],
          text: 'What you see is <b>what</b> you get.',
          score: 1
        },
        {
          images: [
            'https://cdn.quasar.dev/img/mountains.jpg',
            'https://cdn.quasar.dev/img/parallax1.jpg',
            'https://cdn.quasar.dev/img/parallax2.jpg',
            'https://cdn.quasar.dev/img/quasar.jpg'
          ],
          text: '2222What you see is <b>what</b> you get.',
          score: 1
        }
      ]
    }
  },
  methods: {
    ReplaceUrl(text) {
      var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/gi
      if (re.test(text)) {
        return text.replace(re, a => {
          return '<a href="' + a + '" target=_blank style="text-decoration: underline;color: #00c;">' + a + '</a>'
        })
      }
      return text
    },
    open(index) {
      this.$prompt('请输入积分(数字)', '修改积分', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+(\.\d+)?$/,
        inputErrorMessage: '输入格式不正确'
      }).then(({ value }) => {
        this.data[index].score = value
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    getImg(item, index) {
      ImagePreview({
        images: item,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    }
  }
}
</script>
