import type { InputInstance, SelectInstance, DatePickerInstance } from 'element-plus'

export interface BaseSearchField {
  prop: string
  label: string
  defaultValue?: any
}

type ElInputProps = Omit<Partial<InputInstance['$props']>, 'type'>
type ElSelectProps = Partial<SelectInstance['$props']>
type ElDatePickerProps = Omit<Partial<DatePickerInstance['$props']>, 'type' | 'defaultValue'>

export interface InputSearchField extends BaseSearchField, ElInputProps {
  type: 'input'
}

export interface SelectSearchField extends BaseSearchField, ElSelectProps {
  type: 'select'
}

export interface DateSearchField extends BaseSearchField, ElDatePickerProps {
  type: 'date' | 'datetime'
}

export interface DateRangeSearchField extends BaseSearchField, ElDatePickerProps {
  type: 'daterange'
}

export type SearchField = InputSearchField | SelectSearchField | DateSearchField | DateRangeSearchField

export interface ColSpan {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export interface Props {
  /** 搜索字段配置 */
  fields: SearchField[]
  /** 每行显示的字段数量 */
  colSpan?: ColSpan
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 搜索按钮文字 */
  searchText?: string
  /** 重置按钮文字 */
  resetText?: string
  /** 标签宽度 */
  labelWidth?: string
}
