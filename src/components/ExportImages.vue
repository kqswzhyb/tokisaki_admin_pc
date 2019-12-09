<template>
  <div>
    <div class="flex-start">
      <van-button
        style="width:120px;color: #fff;background-color: #e66457;border: 1px solid #e66457;cursor:pointer;"
        type="submit"
        :loading="loading"
        :disabled="loading"
        loading-text="正在导出"
        round
        @click="handleBatchDownload(data)"
      >导出图片</van-button>
      <div v-if="flag===0&&number>0" style="margin-left:20px;">
        <el-progress :stroke-width="5" type="circle" :width="78" :percentage="percentage" :format="format" color="#e66457" />
      </div>
      <div v-if="flag>0" style="color:#666;margin-left:20px;">
        {{ flag===1?'正在将图片打包为压缩文件':`导出完成, 成功：${length-failed} 失败：${failed}` }}
      </div>
    </div>
    <div v-if="failes.length!==0" style="margin:20px 0;flex-direction:column;" class="flex-center">
      <p>请手动检查以下失败链接，防止遗漏</p>
      <el-link v-for="(item,index) in failes" :key="item.url" :type="!item.flag?'danger':'info'" @click="openFail(item.url,index)">{{ item.url }}</el-link>
    </div>
  </div>

</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
export default {
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
      flag: 0,
      number: 0,
      length: 0,
      failed: 0,
      failes: []
    }
  },
  computed: {
    percentage() {
      return (this.number / (this.length - this.failed)) ? this.number / (this.length - this.failed) * 100 : 0
    }
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? '下载完成' : `${Math.ceil(percentage)}%`
    },
    initData() {
      this.flag = 0
      this.number = 0
      this.length = 0
      this.failed = 0
      this.failes = []
    },
    openFail(url, index) {
      this.$set(this.failes[index], 'flag', true)
      window.open(url)
    },
    async handleBatchDownload(imgList) {
      this.initData()
      const data = imgList.filter(item => !(!item || item === ''))
      this.length = imgList.length
      const zip = new JSZip()
      let result
      data.forEach(async item => {
        try {
          result = await axios({
            method: 'get',
            url: item,
            responseType: 'arraybuffer'
          })
        } catch (err) {
          this.failed += 1
          this.failes.push({ url: item })
        }
        const arr = item.split('/')
        const file = arr[arr.length - 1]
        if (result && result.data) {
          zip.file(file, result.data, {
            binary: true
          })
        }
        this.number += 1
        if ((this.number === (this.length - this.failed)) || (this.number === this.length)) {
          this.flag = 1
          zip
            .generateAsync({
              type: 'blob'
            })
            .then(async content => {
              await FileSaver.saveAs(content, `${this.fileName}.zip`)
              this.flag = 2
            })
        }
      })
    }
  }
}
</script>

<style></style>
