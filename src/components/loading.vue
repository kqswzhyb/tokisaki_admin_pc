<template>
  <div class="flex-center view">
    <div class="balls">
      <div />
      <div />
      <div />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.view {
  height:calc(100vh - 83px);
  flex-direction:column;
}
.balls {
  width: 6.5em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.balls div {
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  background-color: #e66457;
  transform: translateY(-100%);
  animation: wave 0.8s ease-in-out alternate infinite;
}

.balls div:nth-of-type(1) {
  animation-delay: -0.4s;
}

.balls div:nth-of-type(2) {
  animation-delay: -0.2s;
}

@keyframes wave {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
