import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMqttClient } from '@/api/device/mqttClient'
import { AgricultureDeviceMqttConfigService } from '@/api/device/deviceConfigApi'

export const useMqttStore = defineStore('mqtt', () => {
  // 设备数据Map，所有页面都能用
  const deviceDataMap = ref<{ [deviceId: string]: any }>({})
  // 分离的趋势数据
  const waterQualityTrendData = ref<any>(null)
  const weatherTrendData = ref<any>(null)
  
  // MQTT客户端和订阅主题集合
  let mqttClient: any = null
  const subscribedTopics = new Set<string>()
  let messageHandler: any = null

  // 趋势主题常量
  const TREND_TOPICS = {
    WATER_QUALITY: '/fish-dish/trends/water-quality',
    WEATHER: '/fish-dish/trends/weather'
  }

  // 初始化并订阅所有设备的topic
  async function subscribeAllDeviceTopics(deviceList: any[]) {
    if (!mqttClient) mqttClient = getMqttClient()
    if (!messageHandler) {  
      messageHandler = (topic: string, message: any) => {
        try {
          const data = JSON.parse(message.toString())
          
          // 处理水质趋势数据
          if (topic === TREND_TOPICS.WATER_QUALITY) {
            waterQualityTrendData.value = data
             console.log('收到水质趋势分析数据:', data)
            return
          }
          
          // 处理气象趋势数据
          if (topic === TREND_TOPICS.WEATHER) {
            weatherTrendData.value = data
             console.log('收到气象趋势分析数据:', data)
            return
          }
          
          // 处理设备数据
          if (data.deviceId) {
            deviceDataMap.value[String(data.deviceId)] = data
             console.log('全局收到MQTT消息:', { topic, data })
          }
        } catch (e) {
          console.error('解析MQTT消息失败', e)
        }
      }
      mqttClient.on('message', messageHandler)
      
      // 订阅趋势分析主题
      subscribeTrendTopics()
    }
    
    // 订阅设备主题
    for (const device of deviceList) {
      const res: any = await AgricultureDeviceMqttConfigService.getConfigByDeviceId(device.id)
      if (res && res.code === 200 && res.data && res.data.mqttTopic) {
        const topic = res.data.mqttTopic
        if (!subscribedTopics.has(topic)) {
          mqttClient.subscribe([topic])
          subscribedTopics.add(topic)
        }
      }
    }
  }

  // 订阅所有趋势主题
  function subscribeTrendTopics() {
    if (!mqttClient) mqttClient = getMqttClient()
    
    Object.values(TREND_TOPICS).forEach(topic => {
      if (!subscribedTopics.has(topic)) {
        mqttClient.subscribe([topic])
        subscribedTopics.add(topic)
        console.log('已订阅趋势分析主题:', topic)
      }
    })
  }

  // 取消订阅所有趋势主题
  function unsubscribeTrendTopics() {
    if (mqttClient) {
      Object.values(TREND_TOPICS).forEach(topic => {
        mqttClient.unsubscribe([topic])
        subscribedTopics.delete(topic)
      })
      
      // 清空趋势数据
      waterQualityTrendData.value = null
      weatherTrendData.value = null
      console.log('已取消订阅所有趋势分析主题')
    }
  }

  // 订阅水质趋势主题
  function subscribeWaterQualityTrend() {
    if (!mqttClient) mqttClient = getMqttClient()
    if (!subscribedTopics.has(TREND_TOPICS.WATER_QUALITY)) {
      mqttClient.subscribe([TREND_TOPICS.WATER_QUALITY])
      subscribedTopics.add(TREND_TOPICS.WATER_QUALITY)
      console.log('已订阅水质趋势分析主题:', TREND_TOPICS.WATER_QUALITY)
    }
  }

  // 订阅气象趋势主题
  function subscribeWeatherTrend() {
    if (!mqttClient) mqttClient = getMqttClient()
    if (!subscribedTopics.has(TREND_TOPICS.WEATHER)) {
      mqttClient.subscribe([TREND_TOPICS.WEATHER])
      subscribedTopics.add(TREND_TOPICS.WEATHER)
      console.log('已订阅气象趋势分析主题:', TREND_TOPICS.WEATHER)
    }
  }

  // 取消订阅水质趋势主题
  function unsubscribeWaterQualityTrend() {
    if (mqttClient) {
      mqttClient.unsubscribe([TREND_TOPICS.WATER_QUALITY])
      subscribedTopics.delete(TREND_TOPICS.WATER_QUALITY)
      waterQualityTrendData.value = null
      console.log('已取消订阅水质趋势分析主题')
    }
  }

  // 取消订阅气象趋势主题
  function unsubscribeWeatherTrend() {
    if (mqttClient) {
      mqttClient.unsubscribe([TREND_TOPICS.WEATHER])
      subscribedTopics.delete(TREND_TOPICS.WEATHER)
      weatherTrendData.value = null
      console.log('已取消订阅气象趋势分析主题')
    }
  }

  return {
    deviceDataMap,
    waterQualityTrendData,
    weatherTrendData,
    subscribeAllDeviceTopics,
    subscribeTrendTopics,
    unsubscribeTrendTopics,
    subscribeWaterQualityTrend,
    subscribeWeatherTrend,
    unsubscribeWaterQualityTrend,
    unsubscribeWeatherTrend
  }
})