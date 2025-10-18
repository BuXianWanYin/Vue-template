// 基于单例模式的 SSE（Server-Sent Events）管理器，只允许全局存在一个 SSE 实例
// 支持事件监听、连接、断开、重连等操作
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { useUserStore } from '@/store/modules/user'
import SseService from '@/api/sseApi'
import { UserId } from '@/enums/agricultureEnum'

// 事件监听函数类型
type Listener = (data: any) => void

// SSE 配置项接口
interface SSEConfig {
  url?: string // SSE 服务端地址
  headers?: Record<string, string> // 可选请求头
  data?: any // 可选请求体数据（通常用于POST）
  id?: string | number // SSE连接id
}

// SSE 单例类
class SSESingleton {
  // 静态实例，保证全局唯一
  private static instance: SSESingleton
  // 当前连接的 AbortController，用于断开连接
  private controller: AbortController | null = null
  // 当前连接的配置
  private config: SSEConfig | null = null
  // 事件监听器集合
  private listeners: {
    message: Listener[] // 消息事件监听器
    error: Listener[] // 错误事件监听器
    close: Listener[] // 关闭事件监听器
  } = {
    message: [],
    error: [],
    close: []
  }
  // 连接状态
  private connected = false
  // SSE连接id
  private id: string | number = UserId.ALL_USER

  private project: string = 'AGRICULTURE'

  // 构造函数私有化，禁止外部实例化
  private constructor() {}

  // 获取单例实例
  static getInstance() {
    if (!SSESingleton.instance) {
      SSESingleton.instance = new SSESingleton()
    }
    return SSESingleton.instance
  }

  // 建立 SSE 连接
  connect(config: SSEConfig = {}) {
    // 如果已连接，先断开
    if (this.connected) {
      this.disconnect()
    }
    this.config = config
    this.controller = new AbortController()
    this.connected = true

    // 设置id
    this.id = config.id ?? this.id

    const { accessToken } = useUserStore()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers || {})
    }
    if (accessToken) {
      headers['Authorization'] = accessToken
    }

    // 传递id给SseService
    const url = config.url || SseService.getSseUrl(this.project)

    // 使用 fetchEventSource 建立 SSE 连接
    fetchEventSource(url, {
      method: 'GET', // 这里默认用 GET，可根据需要调整
      headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
      signal: this.controller.signal,
      // 连接建立时回调
      async onopen(response) {
        const contentType = response.headers.get('content-type')
        if (!response.ok || !contentType?.includes(EventStreamContentType)) {
          throw new Error(response.statusText)
        }
      },
      // 收到消息时回调
      onmessage: (ev: EventSourceMessage) => {
        try {
          if (!this.project.includes(ev.id) || !ev.data) return
          const data = JSON.parse(ev.data)
          // 直接分发所有消息
          this.listeners.message.forEach((fn) => fn(data))
        } catch (e) {
          this.listeners.error.forEach((fn) => fn(e))
        }
      },
      // 连接关闭时回调
      onclose: () => {
        this.connected = false
        this.listeners.close.forEach((fn) => fn(null))
        if (!config.url) {
          SseService.closeSse(this.id)
        }
      },
      // 发生错误时回调
      onerror: (err) => {
        this.connected = false
        this.listeners.error.forEach((fn) => fn(err))
        this.disconnect()
        throw err
      }
    })
  }

  // 断开 SSE 连接
  disconnect() {
    if (this.controller) {
      this.controller.abort()
      this.controller = null
      this.connected = false
      if (!this.config?.url) {
        SseService.closeSse(this.id)
      }
    }
  }

  // 重连（使用上次的配置）
  reconnect() {
    if (this.config) {
      this.connect(this.config)
    }
  }

  // 添加事件监听器
  on(event: 'message' | 'error' | 'close', listener: Listener) {
    this.listeners[event].push(listener)
  }

  // 移除事件监听器
  off(event: 'message' | 'error' | 'close', listener: Listener) {
    this.listeners[event] = this.listeners[event].filter((fn) => fn !== listener)
  }
}

// 默认导出单例实例
export default SSESingleton.getInstance()
