<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { Props } from './prop'
import { useWindowWidth } from '@/composables'

const props = withDefaults(defineProps<Props>(), {
  colSpan: () => ({
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4
  }),
  showReset: true,
  searchText: '查询',
  resetText: '重置',
  labelWidth: '80px'
})

const emit = defineEmits<{
  search: [params: Record<string, any>]
  reset: [params: Record<string, any>]
}>()

/** 是否折叠 */
const conditionFold = ref(true)

/** 切换折叠状态 */
const areConditionFold = () => {
  conditionFold.value = !conditionFold.value
}

const formData = ref<Record<string, any>>({})

/** 初始化表单数据 */
const initFormData = () => {
  const data: Record<string, any> = {}
  props.fields.forEach((field) => {
    data[field.prop] = field.defaultValue
  })
  formData.value = data
}
initFormData()

const { windowWidth } = useWindowWidth()

/** 根据当前窗口宽度计算实际列数 */
const currentColCount = computed(() => {
  const width = windowWidth.value
  const { xs = 1, sm = 2, md = 3, lg = 3, xl = 4 } = props.colSpan

  if (width >= 1920) return xl
  if (width >= 1200) return lg
  if (width >= 992) return md
  if (width >= 768) return sm
  return xs
})

/** 计算默认折叠数量 */
const computedDefaultFoldCount = computed(() => currentColCount.value * 2 - 1)

/** 当前显示的字段数量 */
const visibleFieldsCount = computed(() => {
  if (conditionFold.value && props.fields.length > computedDefaultFoldCount.value) {
    return computedDefaultFoldCount.value
  }
  return props.fields.length
})

/** 计算按钮容器的网格列起始位置（用于将按钮放在最后一列） */
const actionGridColumn = computed(() => {
  const colCount = currentColCount.value
  const fieldsCount = visibleFieldsCount.value // 使用当前显示的字段数量
  const remainder = fieldsCount % colCount

  if (remainder === 0) {
    return `${colCount} / span 1`
  } else {
    return `span ${colCount - remainder}`
  }
})

const getParams = (): Record<string, any> => {
  const entries = Object.entries(formData.value)
    .map(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') return [key, value]
      return undefined
    })
    .filter((item): item is [string, any] => item !== undefined)
  return Object.fromEntries(entries)
}

const getComponentProps = (field: any) => {
  const { prop, label, type, defaultValue, componentProps, options, ...rest } = field
  return { ...rest, ...componentProps }
}

/** 搜索处理 */
const handleSearch = () => {
  emit('search', getParams())
}

/** 重置处理 */
const handleReset = () => {
  initFormData()
  emit('reset', getParams())
}

defineExpose({
  getFormData: () => getParams(),
  setFormData: (data: Record<string, any>) => {
    formData.value = { ...formData.value, ...data }
  },
  resetForm: handleReset
})
</script>

<template>
  <div class="search-container">
    <el-form :model="formData" :label-width="labelWidth">
      <div class="search-grid">
        <el-form-item
          v-for="field in fields.slice(0, conditionFold ? computedDefaultFoldCount : fields.length)"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
        >
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-bind="getComponentProps(field)"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            @keyup.enter="handleSearch"
          />

          <!-- 下拉框 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-bind="getComponentProps(field)"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            class="w-full"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-bind="getComponentProps(field)"
            v-model="formData[field.prop]"
            type="date"
            :placeholder="field.placeholder || `请选择${field.label}`"
            class="w-full"
          />

          <!-- 日期范围选择器 -->
          <el-date-picker
            v-else-if="field.type === 'daterange'"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-bind="getComponentProps(field)"
            v-model="formData[field.prop]"
            type="daterange"
            :start-placeholder="field.startPlaceholder || '请选择开始日期'"
            :end-placeholder="field.endPlaceholder || '请选择结束日期'"
            class="w-full"
          />

          <!-- 日期时间选择器 -->
          <el-date-picker
            v-else-if="field.type === 'datetime'"
            format="YYYY-MM-DD hh:mm:ss"
            value-format="YYYY-MM-DD hh:mm:ss"
            v-bind="getComponentProps(field)"
            v-model="formData[field.prop]"
            type="datetime"
            :placeholder="field.placeholder || `请选择${field.label}`"
            class="w-full"
          />
        </el-form-item>
        <div class="search-actions" :style="{ gridColumn: actionGridColumn }">
          <el-button type="primary" @click="handleSearch">
            {{ searchText }}
          </el-button>
          <el-button v-if="showReset" @click="handleReset">
            {{ resetText }}
          </el-button>
          <el-button v-if="fields.length > computedDefaultFoldCount" type="primary" link @click="areConditionFold">
            {{ conditionFold ? '展开' : '收起' }}
            <el-icon v-if="conditionFold">
              <ArrowDown />
            </el-icon>
            <el-icon v-else>
              <ArrowUp />
            </el-icon>
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
