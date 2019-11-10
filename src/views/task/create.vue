<template>
  <div style="padding:20px;">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务名称">
        <el-input v-model="form.name" style="width:300px;" placeholder="请输入任务名称" />
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
          <el-radio-button label="ShortTerm">短期</el-radio-button>
          <el-radio-button label="LongTerm">长期</el-radio-button>
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
        <el-button :loading="loading" :disabled="loading" type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Uploader as VanUploader } from 'vant'
import dayjs from 'dayjs'
export default {
  components: {
    VanUploader
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: 'ShortTerm',
        score: '',
        date: [],
        content: '',
        images: [
          // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
          // Uploader 根据文件后缀来判断是否为图片文件
          // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
          // { url: 'https://cloud-image', isImage: true }
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
    async onSubmit() {
      this.loading = true
      try {
        const res = await this.$axios.post('/v1/task', {
          taskName: this.form.name,
          startDate: dayjs
            .utc(this.form.date[0]).format(),
          endDate: dayjs
            .utc(this.form.date[1]).format(),
          taskType: this.form.type,
          taskScore: this.form.score,
          taskDetail: this.form.content
        }, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
        if (res.status !== 201) {
          this.$message.error('错误')
          this.loading = false
        } else {
          this.loading = false
        }
      } catch {
        this.$message.error('请求出错')
        this.loading = false
      }
    }
  }
}
</script>
