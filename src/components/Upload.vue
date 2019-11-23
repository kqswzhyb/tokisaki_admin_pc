<template>
  <div class="flex-start">
    <van-uploader v-model="images" multiple :max-count="count" :before-read="beforeRead" :max-size="size" />
    <div v-if="percentage!=0" style="margin-left:20px;">
      <el-progress :stroke-width="5" type="circle" :width="78" :percentage="percentage" :format="format" color="#e66457" />
    </div>
  </div>
</template>

<script>
import { Uploader as VanUploader, Toast } from 'vant'
export default {
  components: {
    VanUploader
  },
  props: {
    size: {
      type: Number,
      default: 1024 * 1024
    },
    count: {
      type: Number,
      default: 5
    },
    image: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'Task'
    }
  },
  data() {
    return {
      current: {},
      percentage: 0,
      images: this.image,
      urls: []
    }
  },
  watch: {
    image: function(val) {
      this.images = val
    },
    urls: function(val) {
      if (val.length === this.images.length) {
        this.$emit('input', val)
      }
    },
    images: function(val) {
      this.$emit('img', val)
    }
  },
  methods: {
    initData() {
      this.percentage = ''
      this.current = {}
      this.images = []
      this.urls = []
    },
    format(percentage) {
      return percentage === 100 ? '图片完成' : `${parseInt(percentage)}%`
    },
    async load() {
      this.urls = [...this.images.filter(item => item.url)]
      const uploadList = this.images.filter(item => item.file)
      uploadList.forEach(async(item, index) => {
        const param = new FormData()
        param.append('file', item.file)
        const result = await this.$axios.post(`/v1/fileupload/cosUpload?fileType=${this.type}`, param, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            this.current[progressEvent.total] = progressEvent.loaded
            this.percentage = (Object.values(this.current).reduce((a, c) => a + c, 0)) / (Object.keys(this.current).reduce((a, c) => Number(a) + Number(c), 0)) * 100
          }
        })
        this.urls.push({
          attachment: { id: result.data.id }
        })
      })
    },
    beforeRead(file) {
      if (file instanceof Object && file.size >= this.size) {
        Toast('上传单个图片不能大于3MB')
        return false
      }
      if (file instanceof Array && !file.every(item => item.size <= this.size)) {
        Toast('上传单个图片不能大于3MB')
        return false
      }
      return true
    }
  }

}
</script>

<style>

</style>
