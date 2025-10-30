<template>
  <div class="console">
    <CardList :data-list="cardList"></CardList>

    <div class="column column2 analysis-dashboard">
      <TodaySales :sales-data="countList"></TodaySales>
      <SalesOverview :mock-data="mockData" :growth-map="growthMap"></SalesOverview>
    </div>

    <div class="bottom-wrap art-custom-card about-env-wrap">
      <div style="width:100%;">
        <span style="font-size: 20px;font-weight: 400;color: var(--art-text-gray-900);">环境监测</span>
        <el-table :data="envTableData" style="width: 100%;margin-top:10px;" size="small">
          <el-table-column prop="type" label="养殖种类" />
          <el-table-column prop="pond" label="鱼池/分区" />
          <el-table-column prop="temp" label="大棚温度(℃)" />
          <el-table-column prop="humidity" label="大棚湿度(%)" />
          <el-table-column prop="lux" label="光照(lux)" />
          <el-table-column prop="ph" label="ph值" />
          <el-table-column prop="waterTemp" label="水温(℃)" />
          <el-table-column prop="oxygen" label="溶解氧(mg/L)" />
          <el-table-column prop="ammonia" label="氨氮(mg/L)" />
          <el-table-column prop="nitrite" label="亚硝酸盐(mg/L)" />
          <el-table-column prop="time" label="记录时间" />
          <template #empty>
            <div style="text-align:center;padding:40px 0;">暂无数据</div>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardList from './widget/CardList.vue'
import SalesOverview from './widget/SalesOverview.vue'
import TodaySales from './widget/TodaySales.vue'
import { useSettingStore } from '@/store/modules/setting'
import { useCommon } from '@/composables/useCommon'
import { ref, onMounted } from 'vue'
import type { ConsoleTotalInfo, ConsoleToTalData } from '@/types/agriculture/console'
import event from '@/utils/event'

const settingStore = useSettingStore()
const currentGlopTheme = computed(() => settingStore.systemThemeType)

// 系统主题风格变化时，刷新页面重写渲染 Echarts
watch(currentGlopTheme, () => {
  settingStore.reload()
})

useCommon().scrollToTop()

// 卡片数据
const cardList = ref<ConsoleTotalInfo[]>([
  {
    label: '罗非鱼存量',
    value: 1530,
    change: '+5%',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#409EFF"></circle></svg>',
    class: 'bg-primary',
    color: '#409EFF'
  },
  {
    label: '南美白对虾产量',
    value: 1220,
    change: '-2%',
    icon: '<svg viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" fill="#E6A23C"></rect></svg>',
    class: 'bg-warning',
    color: '#E6A23C'
  },
  {
    label: '加州鲈鱼产值',
    value: 2048,
    change: '+10%',
    icon: '<svg viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22" fill="#67C23A"></polygon></svg>',
    class: 'bg-success',
    color: '#67C23A'
  },
  {
    label: '蔬菜作物产量',
    value: 3350,
    change: '+8%',
    icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#F56C6C"></ellipse></svg>',
    class: 'bg-error',
    color: '#F56C6C'
  }
])
// 统计数据
const countList = ref<ConsoleTotalInfo[]>([
  {
    label: '今日任务',
    value: 12,
    change: '+1',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#409EFF"></circle></svg>',
    class: 'bg-primary',
    color: '#409EFF'
  },
  {
    label: '已完成',
    value: 9,
    change: '+1',
    icon: '<svg viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" fill="#67C23A"></rect></svg>',
    class: 'bg-success',
    color: '#67C23A'
  },
  {
    label: '进行中',
    value: 2,
    change: '0',
    icon: '<svg viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22" fill="#E6A23C"></polygon></svg>',
    class: 'bg-warning',
    color: '#E6A23C'
  },
  {
    label: '异常',
    value: 1,
    change: '+1',
    icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#F56C6C"></ellipse></svg>',
    class: 'bg-error',
    color: '#F56C6C'
  }
])

const mockData = {
  week: {
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    fish: [120, 132, 101, 134, 90, 230, 210],
    vegetable: [220, 182, 191, 234, 290, 330, 310]
  },
  month: {
    xAxis: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'],
    fish: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132],
    vegetable: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182]
  },
  year: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    fish: [320, 332, 301, 334, 390, 330, 320, 332, 301, 334, 390, 330],
    vegetable: [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330]
  }
}

const growthMap = {
  week: '+3%',
  month: '+8%',
  year: '+15%'
}

const envTableData = [
  { type: '罗非鱼', pond: '罗非池A', temp: 28.5, humidity: 65, lux: 12000, ph: 7.78, waterTemp: 21.2, oxygen: 6.3, ammonia: 0.011, nitrite: 0.04, time: '2025-02-27 09:00' },
  { type: '罗非鱼', pond: '罗非池B', temp: 27.8, humidity: 63, lux: 11800, ph: 7.75, waterTemp: 21.0, oxygen: 6.1, ammonia: 0.012, nitrite: 0.03, time: '2025-02-27 09:00' },
  { type: '南美白对虾', pond: '虾池1', temp: 29.2, humidity: 68, lux: 12500, ph: 7.65, waterTemp: 22.5, oxygen: 6.8, ammonia: 0.010, nitrite: 0.02, time: '2025-02-27 09:00' },
  { type: '南美白对虾', pond: '虾池2', temp: 29.0, humidity: 67, lux: 12400, ph: 7.62, waterTemp: 22.3, oxygen: 6.7, ammonia: 0.011, nitrite: 0.02, time: '2025-02-27 09:00' },
  { type: '加州鲈鱼', pond: '鲈鱼池', temp: 26.5, humidity: 60, lux: 11000, ph: 7.80, waterTemp: 20.8, oxygen: 6.0, ammonia: 0.013, nitrite: 0.05, time: '2025-02-27 09:00' },
  { type: '蔬菜', pond: '一区', temp: 30.1, humidity: 72, lux: 15000, ph: 6.8, waterTemp: '', oxygen: '', ammonia: '', nitrite: '', time: '2025-02-27 09:00' },
  { type: '蔬菜', pond: '二区', temp: 29.7, humidity: 70, lux: 14800, ph: 6.7, waterTemp: '', oxygen: '', ammonia: '', nitrite: '', time: '2025-02-27 09:00' }
]

// 移除 API 调用和事件监听
// const getCardList = async () => {
//   const res = await AgricultureConsoleService.listAgriculture()
//   cardList.value = res.data
// }
//
// const getCountList = async () => {
//   const res = await AgricultureConsoleService.listBatchTask()
//   countList.value = res.data
// }
//
// event.on('message', (data: ConsoleToTalData) => {
//   cardList.value = data.agriculture
//   countList.value = data.batchTask
// })
//
// onMounted(() => {
//   getCardList()
//   getCountList()
// })
</script>

<style lang="scss" scoped>
.console {
  padding-bottom: 15px;

  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    padding: 20px 25px 5px 0;

    .title {
      h4 {
        font-size: 18px;
        font-weight: 500;
        color: var(--art-text-gray-800);
      }

      p {
        margin-top: 3px;
        font-size: 13px;

        span {
          margin-left: 10px;
          color: #52c41a;
        }
      }
    }
  }

  // 主标题
  :deep(.box-title) {
    color: var(--art-gray-900) !important;
  }

  // 副标题
  :deep(.subtitle) {
    color: var(--art-gray-600) !important;
  }

  :deep(.card-list li),
  .region,
  .dynamic,
  .bottom-wrap {
    background: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 4px) !important;
  }

  .column {
    display: flex;
    justify-content: space-between;
    margin-top: var(--console-margin);
    background-color: transparent !important;
  }

  .column2 {
    align-items: stretch;
    min-height: 450px;
  }

  .bottom-wrap {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 300px;
    padding: 20px;
    margin-top: var(--console-margin);
    background: var(--art-main-bg-color);

    h2 {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 500;
    }

    p {
      margin-top: 5px;
      font-size: 14px;
      color: var(--art-gray-600);
    }

    .button-wrap {
      display: flex;
      flex-wrap: wrap;
      width: 600px;
      margin-top: 35px;

      .btn {
        display: flex;
        justify-content: space-between;
        width: 240px;
        height: 50px;
        padding: 0 15px;
        margin: 0 15px 15px 0;
        font-size: 14px;
        line-height: 50px;
        color: var(--art-gray-800);
        text-align: center;
        cursor: pointer;
        background: var(--art-bg-color);
        border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 5px 10px rgb(0 0 0 / 5%);
          transform: translateY(-4px);
        }
      }
    }
  }
}
</style>

<!-- 移动端处理 -->
<style lang="scss" scoped>
.console {
  @media screen and (max-width: $device-ipad-pro) {
    .column2 {
      margin-top: 15px;

      :deep(.active-user) {
        width: 50%;
      }

      :deep(.sales-overview) {
        width: calc(50% - 15px);
      }
    }

    .column3 {
      display: flex;
      flex-wrap: wrap;
      margin-top: 15px;

      :deep(.new-user) {
        width: 100%;
        margin-top: 0;
      }

      :deep(.dynamic) {
        flex: 1;
        margin: 15px 0 0;
      }

      :deep(.todo-list) {
        flex: 1;
        margin: 15px 0 0 15px;
      }
    }

    .bottom-wrap {
      height: auto;
      margin-top: 15px;

      .button-wrap {
        width: 470px;
        margin-top: 20px;

        .btn {
          width: 180px;
        }
      }

      .right-img {
        width: 300px;
        height: 230px;
      }
    }
  }

  @media screen and (max-width: $device-ipad-vertical) {
    :deep(.card-list) {
      width: calc(100% + 15px);
      margin-left: -15px;

      li {
        width: calc(50% - 15px);
        margin: 0 0 15px 15px;
      }
    }

    .column2 {
      display: block;
      margin-top: 0;

      :deep(.active-user) {
        width: 100%;
      }

      :deep(.sales-overview) {
        width: 100%;
        margin-top: 15px;
      }
    }

    .column3 {
      display: block;
      margin-top: 15px;

      :deep(.new-user) {
        width: 100%;
        margin-top: 15px;
      }

      :deep(.dynamic) {
        width: 100%;
        margin: 15px 0 0;
      }

      :deep(.todo-list) {
        width: 100%;
        margin: 15px 0 0;
      }
    }

    .bottom-wrap {
      height: auto;
      margin-top: 15px;

      .button-wrap {
        width: 100%;
        margin-top: 20px;

        .btn {
          width: 190px;
          height: 50px;
          line-height: 50px;
        }
      }

      .right-img {
        display: none;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    :deep(.card-list) {
      width: 100%;
      margin: 0;

      li {
        width: 100%;
        margin: 0 0 15px;
      }
    }

    :deep(.active-user) {
      .chart {
        padding: 10px;
      }
    }

    .sales-overview {
      height: 300px;
      padding: 20px 15px;

      :deep(.card-header) {
        padding: 0 0 0 5px !important;
      }
    }

    .bottom-wrap {
      padding: 0 15px;

      .button-wrap {
        width: 100%;
        margin-top: 20px;

        .btn {
          width: 100%;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.analysis-dashboard {

  :deep(.custom-card) {
    background: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 4px) !important;
  }

  // 卡片头部
  :deep(.custom-card-header) {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;

    .title {
      font-size: 20px;
      font-weight: 400;
      color: var(--art-text-gray-900);
    }

    .subtitle {
      position: absolute;
      bottom: 2px;
      left: 21px;
      font-size: 13px;
      color: var(--art-gray-600);
    }
  }

  .el-card {
    border: 1px solid #e8ebf1;
    box-shadow: none;
  }

  .mt-20 {
    margin-top: 20px;
  }
}

.dark {
  .analysis-dashboard {
    :deep(.custom-card) {
      box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
    }
  }
}

@media (width <=1200px) {
  .analysis-dashboard {
    .mt-20 {
      margin-top: 0;
    }

    :deep(.custom-card) {
      margin-bottom: 20px;
    }
  }
}

.env-monitor-table {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.env-monitor-table .table-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.env-monitor {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 0 0 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 25px 0 25px;

    .title {
      h4.box-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--art-gray-900);
      }

      .subtitle {
        font-size: 14px;
        color: var(--art-gray-500);
        margin-top: 4px;
      }
    }
  }

  .el-table {
    margin-top: 10px;
    font-size: 14px;
  }
}

.about-env-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 300px;
  padding: 30px 30px 30px 30px;
  gap: 30px;

  .env-monitor {
    flex: 1;
    min-width: 0;
  }

  .right-img {
    width: 320px;
    min-width: 200px;
    height: auto;
    margin-left: 40px;
    align-self: flex-start;
  }
}
</style>