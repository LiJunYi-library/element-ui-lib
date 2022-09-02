<template>
  <el-button
    :size="$attrs.size"
    :type="$attrs.type"
    :plain="$attrs.plain"
    :round="$attrs.round"
    :circle="$attrs.circle"
    :loading="loading_"
    :disabled="$attrs.disabled"
    :icon="$attrs.icon"
    :autofocus="$attrs.autofocus"
    :native-type="$attrs.nativeType"
  >
    <slot></slot>
  </el-button>
</template>

<script>
import fetchOptions from "../mixins/fetchOptions";
export default {
  mixins: [fetchOptions],
};
</script>