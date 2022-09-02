<template>
  <div class="RbRow">
    <!-- <div :style="`width: ${1 / span}%;`" class="RbRow-child" /> -->
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    span: { type: Number, default: 3 }
  }
}
</script>
<style>
.RbRow {
  display: flex;
  justify-content: space-between;
}
.RbRow .RbRow-child {
  width: 10px;
}
</style>
