<template>
  <el-button type="primary" round @click="export2Excel(tHeader, tbody, fileName)">导出Excel</el-button>
</template>

<script>
import { export2Excel } from '../utils/Excel.js'
export default {
  // data和tHeader必须一一对应
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tHeader: {
      type: Array,
      default: () => []
    },
    fileName: {
      type: String,
      default: '表格'
    }
  },
  data() {
    return {
      export2Excel
    }
  },
  computed: {
    tbody() {
      return this.data.map(v => Object.keys(v).map(j => {
        if (isNaN(v[j]) && !isNaN(Date.parse(v[j]))) {
          return this.$options.filters.prettyDate(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
