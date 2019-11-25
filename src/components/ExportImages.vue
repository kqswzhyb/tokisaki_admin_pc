<template>
  <div class="flex-start">
    <van-button
      style="width:35%;color: #fff;background-color: #e66457;border: 1px solid #e66457;"
      type="submit"
      :loading="loading"
      :disabled="loading"
      loading-text="正在导出"
      round
      @click="handleBatchDownload(data)"
    >导出图片</van-button>
    <div v-if="percentage != 0" style="margin-left:20px;">
      <el-progress :stroke-width="5" type="circle" :width="78" :percentage="percentage" :format="format" color="#e66457" />
    </div>
  </div>
</template>

<script>
import { Button as VanButton } from 'vant'
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
export default {
  components: {
    VanButton
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    fileName: {
      type: String,
      default: '图片'
    }
  },
  data() {
    return {
      loading: false,
      current: {},
      percentage: 0
    }
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? '图片完成' : `${parseInt(percentage)}%`
    },
    async handleBatchDownload(imgList) {
      let current = 0
      const length = imgList.length
      const data = imgList
      const zip = new JSZip()
      let result
      // 当图片个数为1时直接导出，否则以zip打包导出
      if (length > 1) {
        data.forEach(async item => {
          try {
            result = await axios({
              method: 'get',
              url: item,
              responseType: 'arraybuffer',
              onDownloadProgress: progressEvent => {
                this.current[progressEvent.total] = progressEvent.loaded
                this.percentage =
                  (Object.values(this.current).reduce((a, c) => a + c, 0) /
                    Object.keys(this.current).reduce(
                      (a, c) => Number(a) + Number(c),
                      0
                    )) *
                  100
              }
            })
          } catch (err) {
            this.$message.error('导出失败')
          }
          const arr = item.split('/')
          const file = arr[arr.length - 1]
          zip.file(file, result.data, {
            binary: true
          })
          current += 1
          if (current === length) {
            zip
              .generateAsync({
                type: 'blob'
              })
              .then(content => {
                FileSaver.saveAs(content, `${this.fileName}.zip`)
              })
          }
        })
      } else {
        try {
          result = await axios({
            method: 'get',
            url: imgList[0],
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
              this.current[progressEvent.total] = progressEvent.loaded
              this.percentage =
                (Object.values(this.current).reduce((a, c) => a + c, 0) /
                  Object.keys(this.current).reduce(
                    (a, c) => Number(a) + Number(c),
                    0
                  )) *
                100
            }
          })
        } catch (err) {
          this.$message.error('导出失败')
        }
        const Url = window.URL || window.webkitURL
        const url = Url.createObjectURL(result.data)
        const aTag = window.document.createElement('a')

        aTag.href = url
        aTag.download = new Date().getTime()
        window.document.body.appendChild(aTag)
        aTag.click()
        aTag.remove()
      }
    }
  }
}
</script>

<style></style>
