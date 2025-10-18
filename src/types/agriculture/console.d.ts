import { BaseArrayResult } from '../axios'

/** 控制台信息接口 */
export interface ConsoleTotalInfo {
  /** 描述 */
  label: string
  /** 数值 */
  value: number
  /** 变化趋势 */
  change: string
  /** 图标名或图标路径 */
  icon: string
  /** 卡片样式类名 */
  class: string
  /** 颜色样式 */
  color: string
}

/** 控制台数据总类型接口 */
export interface ConsoleToTalData {
  /** 农业相关的统计数组 */
  agriculture: ConsoleTotalInfo[]
  /** 批量任务相关的统计数组 */
  batchTask: ConsoleTotalInfo[]
}

export type ConsoleListResult = BaseArrayResult<ConsoleTotalInfo>
