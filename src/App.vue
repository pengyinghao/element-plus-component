<script setup lang="ts">
import { ref } from 'vue'
import { Search, type SearchField } from 'element-plus-component'

const searchConfig = ref<SearchField[]>([
  { type: 'input', prop: 'test_1', label: '测试1' },
  { type: 'input', prop: 'test_2', label: '测试1' },
  { type: 'input', prop: 'test_3', label: '测试1' },
  { type: 'input', prop: 'test_4', label: '测试1' },
  { type: 'input', prop: 'test_5', label: '测试1' },
  {
    prop: 'product',
    label: '产品线',
    type: 'select',
    clearable: true,
    options: [{ label: 'xxx', value: 1 }]
  },
  {
    prop: 'person',
    label: '人员',
    type: 'select',
    clearable: true,
    options: [
      { label: '张三', value: '1' },
      { label: '李四', value: '2' }
    ]
  },
  { prop: 'test_date', label: '日期', type: 'daterange' }
])
</script>

<template>
  <div>
    <Search :fields="searchConfig" />
  </div>
</template>

<style scoped></style>
