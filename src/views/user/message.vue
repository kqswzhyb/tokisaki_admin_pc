<template>
  <div style="padding:20px;">
    <div v-for="item in lists" :key="item.time" class="border" style="margin-bottom:20px;background:#fff;">
      <span class="title">系统消息</span> <span class="time">{{ item.time }}</span>
      <div class="text" v-html="ReplaceUrl(item.text, item.url)" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [
        {
          time: '2019年10月21日 22:20',
          text: '你已被提升为组长，恭喜！你已被提升为组长，恭喜！'
        },
        {
          time: '2019年10月21日 22:22',
          text: '你已被降为组员！'
        },
        {
          time: '2019年10月21日 22:23',
          text: '管理员发布了新的任务。',
          url: '/tasks/2'
        },
        {
          time: '2019年10月21日 22:24',
          text: '你已被降为组员！'
        },
        {
          time: '2019年10月21日 22:25',
          text: '你已被提升为组长，恭喜！你已被提升为组长，恭喜！'
        },
        {
          time: '2019年10月21日 22:26',
          text: '你已被降为组员！'
        },
        {
          time: '2019年10月21日 22:27',
          text: '你已被降为组员！'
        }
      ]
    }
  },
  methods: {
    ReplaceUrl(text, url) {
      if (url) {
        return (
          text +
          '<a href="/#' +
          url +
          '" style="text-decoration: underline;color: #00c;">' +
          '查看详情' +
          '</a>'
        )
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-right:15px;
  color: #333;
  font-weight: 700;
}
.time {
  color: #999;
  font-size: 12px;
  line-height: 22px;
}
.text {
  margin-top:5px;
  color:#666;
}
</style>
