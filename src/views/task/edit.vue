<template>
  <div style="padding:20px;">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务名称">
        <el-input v-model="form.name" style="width:300px;" />
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="任务类型">
        <el-radio-group v-model="form.type">
          <el-radio-button :label="0">短期</el-radio-button>
          <el-radio-button :label="1">长期</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="获得积分">
        <el-input-number v-model="form.score" :min="1" :max="999" />
      </el-form-item>
      <el-form-item label="文字内容">
        <quill-editor
          ref="myQuillEditor"
          v-model="form.content"
          style="width:500px;"
          :options="options"
        />
      </el-form-item>
      <el-form-item label="图片">
        <van-uploader v-model="form.images" multiple />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Uploader as VanUploader } from 'vant'
export default {
  components: {
    VanUploader
  },
  data() {
    return {
      form: {
        name: '世萌外交',
        type: 0,
        score: 3,
        date: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        content: '<div style="text-align: left;">世萌绿宝石项链赛外交</div><div style="text-align: left;">时间：10.19日晚23:00--10.20日晚23.00&nbsp;</div><div style="text-align: left;">票根发给组长</div><div style="text-align: left;">外交：</div><div style="text-align: left;">绿宝石项链赛：</div><div style="text-align: left;">时崎狂三（1）</div><div style="text-align: left;">绿宝石垂饰赛：</div><div style="text-align: left;">冈崎朋也（1）</div><div style="text-align: left;">萌皇赛：蕾姆</div><div style="text-align: left;">夏季番：格蕾-《君主埃尔梅罗二世事件簿》</div><div style="text-align: left;">莱妮丝··埃尔梅罗·阿奇佐尔缇</div><div style="text-align: left;">网址：https://www.internationalsaimoe.com/voting</div><div style="text-align: left;">注意事项</div><div style="text-align: left;">1.截图要带上时间和voteID！！！注意截图要文字部分。</div><div style="text-align: left;">要能够看到[时崎狂三-1]</div><div style="text-align: left;">2.打不开请耐心等待一会，或者刷新再试试</div><div style="text-align: left;">建议截长图，不用截角色图直接截文字部分</div>',
        images: [
          { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
          // Uploader 根据文件后缀来判断是否为图片文件
          // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
          { url: 'https://cloud-image', isImage: true }
        ]
      },
      options: {
        placeholder: '请输入模板...',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // 切换按钮  //bold 加粗 italic 斜 underline 下划线 strike删除线
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: 'ordered' }, { list: 'bullet' }], // 排序 ordered 有序  bullet 无序
              // [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ script: 'sub' }, { script: 'super' }], // sub上标 / super下标
              [{ indent: '-1' }, { indent: '+1' }], // 减少缩进/缩进
              [{ direction: 'rtl' }], // 文本方向
              [{ color: [] }, { background: [] }], // color 字体颜色 background 背景颜色  从主题默认下拉
              [{ align: [] }], // 文本对齐方式
              [{ font: [] }], // 字体格式
              [{ size: [] }] // 自定义下拉
            ]
          }
        }
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
