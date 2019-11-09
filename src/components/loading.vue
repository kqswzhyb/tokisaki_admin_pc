<template>
  <div class="flex-center view">
    <i class="el-icon-loading" style="font-size:66px;" />
    <p class="tip">正在加载中......</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.view {
  height:calc(100vh - 50px);
  flex-direction:column;
}
.tip {
  font-size:20px;
}
</style>
