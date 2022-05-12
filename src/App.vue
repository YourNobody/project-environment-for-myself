<template>
  <div>
    Hello, {{ name }}
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const returnName = (): string => {
  return 'Pavel';
};

const name = ref<null>(returnName());
</script>

<style scoped lang="scss">
div {
  & {
    font-size: 18px;
    padding: 10px;
    border: 1px solid lightcoral;
  }
}
</style>