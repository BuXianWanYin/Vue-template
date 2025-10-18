<template>
    <div>

        <div class="origin-banner">
            <div class="decoration-circles">
                <div class="circle-1"></div>
                <div class="circle-2"></div>
                <div class="circle-3"></div>
                <div class="circle-4"></div>
            </div>
            <div class="banner-content">
                <div class="banner-title">
                    <i class="el-icon-shopping-bag-1"></i>
                    <span>智链兴农</span>
                </div>
                <div class="banner-subtitle">好食材不怕公开</div>
                <div class="banner-desc">看得见溯源匠心，吃得出健康安心</div>
            </div>
            <div class="banner-right">
                <div class="quality-circle">
                    <div class="center-icon">
                        <i class="el-icon-check"></i>
                    </div>
                    <div class="orbit-container">
                        <div class="orbit-item top"><span>绿色</span></div>
                        <div class="orbit-item right"><span>健康</span></div>
                        <div class="orbit-item bottom"><span>安全</span></div>
                        <div class="orbit-item left"><span>品质</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 追溯模块 -->
        <div class="trace-modules">
            <div class="module-item" v-for="(item, index) in traceModules" :key="index">
                <div class="module-content">
                    <div class="module-title">{{ item.title }}</div>
                    <div class="module-status">
                        <i class="el-icon-check"></i>
                        <span :style="{ color: '#59d181' }">可追溯</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 溯源码验证 -->
        <div class="trace-code">
            <div class="search-container">
                <div class="search-title">
                    <i class="el-icon-search"></i>
                    <span>溯源查询</span>
                </div>
                <div class="search-desc">输入溯源码，即可查询产品全程追溯信息</div>
                <div class="search-box">
                    <el-input v-model="originName" placeholder="请输入溯源码" class="search-input"
                        @keyup.enter.native="originSearch">
                        <el-button slot="append" type="primary" icon="el-icon-search" @click="originSearch"
                            class="desktop-only">查询</el-button>
                    </el-input>
                </div>
                <div class="code-content" v-if="showResult">
                    <div class="result-text">
                        您查询的溯源码编号为：
                        <span class="code-number">{{ originName }}</span>
                        <el-tag type="success" class="verify-tag">
                            <i class="el-icon-check"></i>
                            核验通过
                        </el-tag>
                    </div>
                </div>

                <!-- 添加加载进度组件 -->
                <div class="loading-container" v-if="isLoading">
                    <div class="loading-circle">
                        <div class="progress-circle"
                            :style="{ background: `conic-gradient(#42b983 ${progress}%, transparent 0%)` }">
                            <div class="progress-inner">
                                <img :src="bottleImage" alt="溯源图片" class="bottle-image">
                            </div>
                        </div>
                        <div class="progress-text">
                            <span class="progress-number">{{ progress }}%</span>
                            <span class="progress-label">追溯中</span>
                        </div>
                    </div>

                    <div class="trace-items">
                        <div class="trace-item" v-for="(item, index) in traceItems" :key="index"
                            :class="{ 'traced': progress >= item.threshold }" v-if="item.name">
                            <span class="item-name">{{ item.name }}：</span>
                            <span class="status-text">
                                <span class="status">可追溯</span>
                                <i class="el-icon-check"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 原有的内容 -->
        <div class="app-container-gray" v-if="showResult">
            <!-- 产地信息卡片组 -->
            <el-card class="info-cards-container">
                <div slot="header" class="clearfix">
                    <span>{{ type === 1 ? '养殖信息' : '产地信息' }}</span>
                    <span class="trace-tag">可追溯</span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-card class="info-card" shadow="hover">
                            <div class="card-header">
                                <i class="el-icon-house"></i>
                                <span>{{ type === 1 ? '鱼棚信息' : '大棚信息' }}</span>
                            </div>
                            <el-empty v-if="!ivPastureInfo" :description="type === 1 ? '暂无鱼棚信息' : '暂无大棚信息'"></el-empty>
                            <div v-else class="card-content">
                                <div class="info-item">
                                    <div class="label">{{ type === 1 ? '鱼棚名称' : '大棚名称' }}</div>
                                    <div class="value">{{ ivPastureInfo.name }}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">合约地址</div>
                                    <div class="value address">{{ ivPastureInfo.area }}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">{{ type === 1 ? '鱼棚位置' : '大棚位置' }}</div>
                                    <div class="value">{{ ivPastureInfo.position }}</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="8">
                        <el-card class="info-card" shadow="hover">
                            <div class="card-header">
                                <i class="el-icon-menu"></i>
                                <span>{{ type === 1 ? '养殖信息' : '分区信息' }}</span>
                            </div>
                            <el-empty v-if="!iaPartitionInfo"
                                :description="type === 1 ? '暂无养殖信息' : '暂无分区信息'"></el-empty>
                            <div v-else class="card-content">
                                <div class="info-item">
                                    <div class="label">分区名称</div>
                                    <div class="value">{{ type === 1 ? iaPartitionInfo.name : iaPartitionInfo.name }}
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="label">{{ type === 1 ? '养殖品种' : '种植品种' }}</div>
                                    <div class="value">{{ iaPartitionInfo.variety }}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">{{ type === 1 ? '养殖日期' : '种植日期' }}</div>
                                    <div class="value">{{ iaPartitionInfo.dateT }}</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="8">
                        <el-card class="info-card" shadow="hover">
                            <div class="card-header">
                                <i class="el-icon-goods"></i>
                                <span>食品信息</span>
                            </div>
                            <el-empty v-if="!shopInfo" description="暂无商品信息"></el-empty>
                            <div v-else class="card-content">
                                <div class="info-item">
                                    <div class="label">食品名称</div>
                                    <div class="value">{{ shopInfo.name }}</div>
                                </div>

                                <div class="info-item">
                                    <div class="label">{{ type === 1 ? '捕捞日期' : '采摘日期' }}</div>
                                    <div class="value">{{ shopInfo.datet }}</div>
                                </div>

                                <div class="info-item">
                                    <div class="label">食品质量</div>
                                    <div class="value">
                                        <el-tag
                                            :type="shopInfo.quality === '优秀' ? 'success' : shopInfo.quality === '及格' ? 'warning' : 'danger'">
                                            {{ shopInfo.quality }}
                                        </el-tag>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="label">食品重量</div>
                                    <div class="value">{{ shopInfo.weight }}kg</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 种植/养殖环节卡片 -->
            <el-card class="timeline-card">
                <div slot="header" class="clearfix">
                    <span>{{ type === 1 ? '养殖环节' : '种植环节' }}</span>
                    <span class="trace-tag">可追溯</span>
                </div>
                <div class="horizontal-timeline-wrapper">
                    <div v-if="taskList.length" class="horizontal-timeline"
                        :class="{ 'mobile-vertical-timeline': isMobile, 'two-row-timeline': !isMobile }">
                        <TimelineItem v-for="(item, index) in taskList" :tasks="taskList" :index="index" :task="item"
                            :type="type" :is-mobile="isMobile" :key="index" @show-details="handleShowDetails" />
                    </div>
                    <el-empty v-else description="暂无任务数据"></el-empty>
                </div>
            </el-card>

            <!-- 环境信息卡片 -->
            <el-card class="environment-card">
                <div slot="header" class="clearfix">
                    <span>环境信息</span>
                    <span class="trace-tag">可追溯</span>
                    <el-select v-model="selectedTaskId" size="small" placeholder="请选择任务"
                        style="float: right; margin-left: auto; width: 150px" @change="handleTaskChange">
                        <el-option v-for="task in taskList" :key="task.taskId" :label="task.taskName"
                            :value="task.taskId" />
                    </el-select>
                </div>
                <div class="env-info-container">
                    <div v-if="physicalNetworkMsg" class="warning-msg">
                        <i class="el-icon-warning"></i>
                        {{ physicalNetworkMsg }}
                    </div>

                    <!-- 水产养殖环境 -->
                    <div v-if="type === 1" class="monitor-section">
                        <div class="section-title">
                            <i class="el-icon-monitor"></i>
                            水质检测
                        </div>
                        <div class="monitor-grid">
                            <div class="monitor-item temperature">
                                <div class="item-bg">
                                    <svg viewBox="0 0 100 100" class="bg-icon">
                                        <path
                                            d="M45,20v40.5c-4.1,2.4-7,6.9-7,12c0,7.7,6.3,14,14,14s14-6.3,14-14c0-5.1-2.9-9.6-7-12V20c0-5.5-4.5-10-10-10 S45,14.5,45,20z M52,65.5c4.1,0,7.5,3.4,7.5,7.5s-3.4,7.5-7.5,7.5s-7.5-3.4-7.5-7.5S47.9,65.5,52,65.5z" />
                                    </svg>
                                </div>
                                <div class="item-label">水温</div>
                                <div class="item-value">
                                    <span class="number">{{ environmentData.waterTemperature || 0 }}</span>
                                    <span class="unit">℃</span>
                                </div>
                            </div>
                            <div class="monitor-item ph">
                                <div class="item-bg">
                                    <svg viewBox="0 0 100 100" class="bg-icon">
                                        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor"
                                            stroke-width="6" />
                                        <text x="50" y="58" text-anchor="middle" font-size="24"
                                            fill="currentColor">pH</text>
                                    </svg>
                                </div>
                                <div class="item-label">pH值</div>
                                <div class="item-value">
                                    <span class="number">{{ environmentData.waterPh || 0 }}</span>
                                </div>
                            </div>
                            <div class="monitor-item oxygen">
                                <div class="item-bg">
                                    <svg viewBox="0 0 100 100" class="bg-icon">
                                        <circle cx="50" cy="50" r="30" />
                                        <text x="50" y="58" text-anchor="middle" font-size="24" fill="#fff">O₂</text>
                                    </svg>
                                </div>
                                <div class="item-label">溶解氧</div>
                                <div class="item-value">
                                    <span class="number">{{ environmentData.dissolvedOxygen || 0 }}</span>
                                    <span class="unit">mg/L</span>
                                </div>
                            </div>
                            <div class="monitor-item ammonia">
                                <div class="item-bg">
                                    <svg viewBox="0 0 100 100" class="bg-icon">
                                        <text x="50" y="58" text-anchor="middle" font-size="24"
                                            fill="currentColor">NH₄</text>
                                    </svg>
                                </div>
                                <div class="item-label">氨氮含量</div>
                                <div class="item-value">
                                    <span class="number">{{ environmentData.ammoniaNitrogen || 0 }}</span>
                                    <span class="unit">mg/L</span>
                                </div>
                            </div>
                            <div class="monitor-item nitrite">
                                <div class="item-bg">
                                    <svg viewBox="0 0 100 100" class="bg-icon">
                                        <text x="50" y="58" text-anchor="middle" font-size="24"
                                            fill="currentColor">NO₂</text>
                                    </svg>
                                </div>
                                <div class="item-label">亚硝酸盐</div>
                                <div class="item-value">
                                    <span class="number">{{ environmentData.nitriteNitrogen || 0 }}</span>
                                    <span class="unit">mg/L</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 蔬菜种植环境(环境检测和土壤检测) -->
                    <template v-else>
                        <div class="monitor-section">
                            <div class="section-title">
                                <i class="el-icon-monitor"></i>
                                环境监测
                            </div>
                            <div class="monitor-grid">
                                <div class="monitor-item temperature">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <path
                                                d="M45,20v40.5c-4.1,2.4-7,6.9-7,12c0,7.7,6.3,14,14,14s14-6.3,14-14c0-5.1-2.9-9.6-7-12V20c0-5.5-4.5-10-10-10 S45,14.5,45,20z M52,65.5c4.1,0,7.5,3.4,7.5,7.5s-3.4,7.5-7.5,7.5s-7.5-3.4-7.5-7.5S47.9,65.5,52,65.5z" />
                                        </svg>
                                    </div>
                                    <div class="item-label">环境温度</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.temperature || 0 }}</span>
                                        <span class="unit">℃</span>
                                    </div>
                                </div>
                                <div class="monitor-item humidity">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <path
                                                d="M50,15L35.7,36.9C29,47.5,29,54.5,29,58.2C29,71.9,38.3,83,50,83s21-11.1,21-24.8c0-3.7,0-10.7-6.7-21.3L50,15z" />
                                        </svg>
                                    </div>
                                    <div class="item-label">环境湿度</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.humidity || 0 }}</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                                <div class="monitor-item light">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <circle cx="50" cy="50" r="20" />
                                            <path
                                                d="M50,25V10 M50,90V75 M75,50H90 M10,50H25 M75,75L85,85 M15,15L25,25 M75,25L85,15 M15,85L25,75" />
                                        </svg>
                                    </div>
                                    <div class="item-label">光照强度</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.lightLux || 0 }}</span>
                                        <span class="unit">lux</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="soil-section">
                            <div class="section-title">
                                <i class="el-icon-odometer"></i>
                                土壤检测
                            </div>
                            <div class="soil-grid">
                                <div class="soil-item ph">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor"
                                                stroke-width="6" />
                                            <text x="50" y="58" text-anchor="middle" font-size="24"
                                                fill="currentColor">pH</text>
                                        </svg>
                                    </div>
                                    <div class="item-label">土壤PH</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.soilPh || 0 }}</span>
                                        <span class="unit">pH</span>
                                    </div>
                                </div>
                                <div class="soil-item temperature">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <path
                                                d="M40,10v50c-8,4-12,15-8,24s15,12,24,8s12-15,8-24c-1.4-3-3.8-5.6-7-7V10c0-5.5-4.5-10-10-10S40,4.5,40,10z" />
                                            <circle cx="50" cy="70" r="6" />
                                        </svg>
                                    </div>
                                    <div class="item-label">土壤温度</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.soilTemperature || 0 }}</span>
                                        <span class="unit">℃</span>
                                    </div>
                                </div>
                                <div class="soil-item humidity">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <path
                                                d="M50,15L35.7,36.9C29,47.5,29,54.5,29,58.2C29,71.9,38.3,83,50,83s21-11.1,21-24.8c0-3.7,0-10.7-6.7-21.3L50,15z" />
                                        </svg>
                                    </div>
                                    <div class="item-label">土壤湿度</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.soilMoisture || 0 }}</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                                <div class="soil-item conductivity">
                                    <div class="item-bg">
                                        <svg viewBox="0 0 100 100" class="bg-icon">
                                            <path d="M20,50h15 M65,50h15" />
                                            <path
                                                d="M35,50c0-8.3,6.7-15,15-15s15,6.7,15,15s-6.7,15-15,15S35,58.3,35,50z" />
                                            <path d="M38,35l-8-8 M62,65l8,8 M62,35l8-8 M38,65l-8,8" stroke-width="2" />
                                        </svg>
                                    </div>
                                    <div class="item-label">电导率</div>
                                    <div class="item-value">
                                        <span class="number">{{ environmentData.soilConductivity || 0 }}</span>
                                        <span class="unit">mS/cm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </el-card>

        </div>

        <!-- 添加任务详情对话框 -->
        <el-dialog title="任务详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
            <div v-if="currentTask" class="task-detail">
                <div class="detail-item">
                    <span class="label">任务名称：</span>
                    <span>{{ currentTask.taskName }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">负责人：</span>
                    <span>{{ iaPartitionInfo.taskHeadName }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">时间：</span>
                    <span>{{ currentTask.actualStart }} 至 {{ currentTask.actualFinish }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">状态：</span>
                    <el-tag :type="getStatusType(currentTask.status)">
                        {{ getStatusText(currentTask.status) }}
                    </el-tag>
                </div>

                <!-- 农资/饵料使用信息 -->
                <div class="resource-section" v-if="mockResources && mockResources.length > 0">
                    <div class="section-title">{{ type === 1 ? '饵料使用' : '农资使用' }}：</div>
                    <div class="resource-list">
                        <el-tag v-for="(resource, index) in mockResources" :key="index" class="resource-tag">
                            {{ resource.name }}: {{ resource.amount }}{{ resource.unit }}
                        </el-tag>
                    </div>
                </div>

                <!-- 用药记录（仅鱼类显示） -->
                <div class="resource-section" v-if="type === 1 && mockMedicineData && mockMedicineData.length > 0">
                    <div class="section-title">用药记录：</div>
                    <div class="resource-list">
                        <el-tag v-for="(medicine, index) in mockMedicineData" :key="index" class="resource-tag"
                            type="warning">
                            {{ medicine.medicineName }}: {{ medicine.dosage }}{{ medicine.unit }}
                        </el-tag>
                    </div>
                </div>

                <!-- Only show images section if taskImages exists and is not empty -->
                <div v-if="currentTask.taskImages && currentTask.taskImages.trim() && currentTask.taskImages !== '加载失败'"
                    class="images-section">
                    <div class="section-title">工作照片：</div>
                    <div class="image-list">
                        <el-image v-for="(image, index) in currentTask.taskImages.split(',')" :key="index"
                            :src="getImageUrl(image)"
                            :preview-src-list="currentTask.taskImages.split(',').map(img => getImageUrl(img))"
                            fit="cover" class="task-image" />
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import TimelineItem from "./timeline.vue";
import bottleImage from '@/assets/logo/logo.png';

export default {
    data() {
        return {
            originName: '',
            showResult: false,
            tabStatus: 1,
            ivPastureInfo: {},
            iaPartitionInfo: {
                variety: '',
            },
            shopInfo: {},
            taskList: [],
            type: 0, // 0为菜，1为鱼
            isLoading: false,
            progress: 0,
            progressTimer: null,
            traceItems: [
                { name: '产地信息', threshold: 20 },
                { name: '任务环节', threshold: 40 },
                { name: '环境信息', threshold: 60 },
                { name: '', threshold: 80 }
            ],
            isMobile: false,
            selectedTaskId: '',
            environmentData: {
                waterTemperature: 0,
                waterPh: 0,
                dissolvedOxygen: 0,
                ammoniaNitrogen: 0,
                nitriteNitrogen: 0,
                temperature: 0,
                humidity: 0,
                lightLux: 0,
                soilPh: 0,
                soilTemperature: 0,
                soilMoisture: 0,
                soilConductivity: 0
            },
            physicalNetworkMsg: '',
            currentBatchId: null,
            dialogVisible: false,
            currentTask: null,
            mockResources: []
        };
    },
    components: {
        TimelineItem
    },
    mounted() {
        this.checkDeviceType();
        window.addEventListener('resize', this.checkDeviceType);
        this.checkUrlParams();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkDeviceType);
    },
    methods: {
        originSearch() {
            if (!this.originName) {
                this.$message.warning('请输入溯源码');
                return;
            }

            this.showResult = false;
            this.isLoading = true;
            this.progress = 0;

            // 启动进度动画
            this.startProgress();

            // 模拟数据加载
            setTimeout(() => {
                this.stopProgress();
                this.isLoading = false;
                this.showResult = true;

                // 模拟数据
                this.mockData();
            }, 2000);
        },

        mockData() {
            // 模拟产地信息
            this.ivPastureInfo = {
                name: "示例大棚",
                area: "0x1234...5678",
                position: "示例位置"
            };

            // 模拟分区信息
            this.iaPartitionInfo = {
                name: "示例分区",
                variety: "示例品种",
                dateT: "2024-01-01",
                taskHeadName: "张三"
            };

            // 模拟商品信息
            this.shopInfo = {
                name: "示例产品",
                datet: "2024-03-20",
                quality: "优秀",
                weight: "5"
            };

            // 模拟任务列表
            this.taskList = [
                {
                    taskId: 1,
                    taskName: "播种",
                    actualStart: "2024-01-01",
                    actualFinish: "2024-01-02",
                    status: "3",
                    taskImages: "https://example.com/image1.jpg,https://example.com/image2.jpg"
                },
                {
                    taskId: 2,
                    taskName: "施肥",
                    actualStart: "2024-01-10",
                    actualFinish: "2024-01-11",
                    status: "3",
                    taskImages: "https://example.com/image3.jpg"
                },
                {
                    taskId: 3,
                    taskName: "采收",
                    actualStart: "2024-03-20",
                    actualFinish: "2024-03-20",
                    status: "3",
                    taskImages: "https://example.com/image4.jpg"
                }
            ];

            // 默认选中第一个任务
            if (this.taskList.length > 0) {
                this.selectedTaskId = this.taskList[0].taskId;
                this.handleTaskChange(this.selectedTaskId);
            }
        },

        handleTaskChange(taskId) {
            const selectedTask = this.taskList.find(task => task.taskId === taskId);
            if (!selectedTask) return;

            // 模拟环境数据
            if (this.type === 1) {
                // 水产养殖数据
                this.environmentData = {
                    waterTemperature: "25.5",
                    waterPh: "7.2",
                    dissolvedOxygen: "6.5",
                    ammoniaNitrogen: "0.015",
                    nitriteNitrogen: "0.05"
                };
            } else {
                // 蔬菜环境数据
                this.environmentData = {
                    temperature: "22.5",
                    humidity: "65.0",
                    lightLux: "1200",
                    soilPh: "6.8",
                    soilTemperature: "20.5",
                    soilMoisture: "45.0",
                    soilConductivity: "850"
                };
            }
        },

        startProgress() {
            this.progressTimer = setInterval(() => {
                if (this.progress < 99) {
                    this.progress += 1;
                }
            }, 20);
        },

        stopProgress() {
            clearInterval(this.progressTimer);
            this.progress = 100;
            setTimeout(() => {
                this.progress = 0;
            }, 500);
        },

        checkDeviceType() {
            this.isMobile = window.innerWidth <= 768;
        },

        checkUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                this.originName = code;
                this.originSearch();
            }
        },

        getImageUrl(path) {
            if (path.startsWith('http://') || path.startsWith('https://')) {
                return path;
            }
            return process.env.VUE_APP_BASE_API + path;
        },

        handleShowDetails(task) {
            this.currentTask = this.taskList.find(t => t.taskId === task.taskId);
            // 模拟资源数据
            this.mockResources = [
                { name: "有机肥", amount: "50", unit: "kg" },
                { name: "复合肥", amount: "30", unit: "kg" }
            ];
            this.dialogVisible = true;
        },

        handleClose(done) {
            this.currentTask = null;
            done();
        },

        getStatusType(status) {
            const types = {
                '1': 'info',
                '2': 'warning',
                '3': 'success'
            };
            return types[status] || 'info';
        },

        getStatusText(status) {
            const texts = {
                '1': '未开始',
                '2': '进行中',
                '3': '已完成'
            };
            return texts[status] || '未知状态';
        }
    }
};
</script>


<style lang="scss" scoped>
.app-container-gray {
    padding: 20px;
    background-color: #f0f2f5;
    transition: all 0.3s ease-in-out;
}

.timeline-card {
    margin-bottom: 20px;

    .timeline-item-card {
        margin-bottom: 10px;

        h4 {
            margin: 0 0 10px 0;
            color: #303133;
        }

        p {
            margin: 5px 0;
            color: #606266;
            font-size: 14px;
        }
    }
}

.info-cards-container {
    margin-bottom: 20px;

    .el-card__header {
        padding: 15px 20px;
        border-bottom: 1px solid #ebeef5;

        .clearfix {
            display: flex;
            align-items: center;
            gap: 10px;

            span {
                font-size: 16px;
                font-weight: 500;
            }

            .trace-tag {
                font-size: 12px;
                color: #67c23a;
                background: #f0f9eb;
                padding: 2px 6px;
                border-radius: 4px;
            }
        }
    }
}

.info-card {
    height: 350px; // 增加卡片高度

    transition: all 0.3s;
    position: relative;
    background: linear-gradient(to bottom, #ffffff, #f8f9fa);

    .card-header {
        padding: 15px 20px;
        border-bottom: 1px solid #ebeef5;
        background: linear-gradient(to right, #f5f7fa, #ffffff);
        display: flex;
        align-items: center;

        i {
            font-size: 18px;
            margin-right: 8px;
            color: #409EFF;
        }

        span {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
        }
    }

    .card-content {
        padding: 20px;
        height: calc(100% - 56px);
        display: flex;
        flex-direction: column;
        justify-content: flex-start; // 改为从顶部开始布局

        .info-item {
            margin-bottom: 20px; // 增加项目间距

            &:last-child {
                margin-bottom: 0;
            }

            .label {
                color: #909399;
                font-size: 13px;
                margin-bottom: 6px; // 增加标签和值之间的间距
            }

            .value {
                color: #303133;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.4; // 增加行高

                &.address {
                    font-family: monospace;
                    font-size: 13px;
                    word-break: break-all;
                    color: #409EFF;
                    cursor: pointer;

                    &:hover {
                        color: #66b1ff; // 只改变颜色，去掉下划线
                    }
                }
            }
        }
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
}

// 自定义 el-empty 样式
.el-empty {
    padding: 40px 0;
}

// 自定义 el-tag 样式
.el-tag {
    border-radius: 4px;
    padding: 0 8px;
}

@media screen and (max-width: 1200px) {
    .info-card {
        margin-bottom: 20px;
    }
}

.environment-card {
    margin-top: 20px;
    background: #fff;

    :deep(.el-card__header) {
        .clearfix {
            display: flex;
            align-items: center;
            gap: 10px;

            .trace-tag {
                font-size: 12px;
                color: #67c23a;
                background: #f0f9eb;
                padding: 2px 6px;
                border-radius: 4px;
            }

            .el-select {
                margin-left: auto; // 将选择框推到右边
            }
        }
    }

    .env-info-container {
        padding: 20px;

        .env-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            font-size: 16px;
            color: #333;

            i {
                color: #409EFF;
            }
        }

        .monitor-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        .soil-grid {
            .soil-row {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
            }
        }

        .monitor-item,
        .soil-item {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            text-align: left;

            .item-label {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .item-value {
                display: flex;
                align-items: baseline;
                gap: 4px;

                .number {
                    font-size: 20px;
                    font-weight: 500;
                    color: #333;
                }

                .unit {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .environment-card {
        .env-info-container {

            .monitor-grid,
            .soil-grid .soil-row {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }
}

.origin-banner {
    background: linear-gradient(135deg, #42b983 0%, #2f9 100%);
    padding: 40px 40px 80px;
    display: flex;
    justify-content: space-between;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.1);

    // 左上大圆
    &::before {
        content: '';
        position: absolute;
        left: -10%;
        top: -40%;
        width: 500px;
        height: 500px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        border-radius: 50%;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0.6;
    }

    // 右下大圆
    &::after {
        content: '';
        position: absolute;
        right: -15%;
        bottom: -30%;
        width: 400px;
        height: 400px;
        background: linear-gradient(225deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
        border-radius: 50%;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0.5;
    }

    // 添加更多装饰圆形
    .decoration-circles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        // 右上小圆
        &::before {
            content: '';
            position: absolute;
            right: 25%;
            top: 10%;
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 50%;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        // 左下小圆
        &::after {
            content: '';
            position: absolute;
            left: 20%;
            bottom: 15%;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        // 额外的装饰圆形
        .circle-1 {
            position: absolute;
            left: 40%;
            top: 20%;
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
            border-radius: 50%;
            opacity: 0.4;
        }

        .circle-2 {
            position: absolute;
            right: 35%;
            bottom: 30%;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%);
            border-radius: 50%;
            opacity: 0.3;
        }

        .circle-3 {
            position: absolute;
            left: 30%;
            top: 40%;
            width: 60px;
            height: 60px;
            background: linear-gradient(225deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
            border-radius: 50%;
            opacity: 0.35;
        }

        .circle-4 {
            position: absolute;
            right: 15%;
            top: 35%;
            width: 90px;
            height: 90px;
            background: linear-gradient(315deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.03) 100%);
            border-radius: 50%;
            opacity: 0.25;
        }

        // 移除之前的 &::before 和 &::after
        &::before,
        &::after {
            display: none;
        }
    }

    .banner-content {
        position: relative;
        z-index: 2;

        .banner-title {
            display: inline-flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.18);
            padding: 8px 16px;
            border-radius: 20px;
            margin-bottom: 20px;

            i {
                margin-right: 8px;
                font-size: 20px;
            }

            span {
                font-size: 18px;
                font-weight: 500;
            }
        }

        .banner-subtitle {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 15px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .banner-desc {
            font-size: 16px;
            opacity: 0.9;
            max-width: 400px;
        }
    }

    .banner-right {
        position: relative;
        z-index: 2;

        .quality-circle {
            position: relative;
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;

            .center-icon {
                position: relative;
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                z-index: 2;

                &::before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    right: -5px;
                    bottom: -5px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    z-index: -1;
                }

                i {
                    font-size: 36px;
                    color: #42b983;
                }
            }

            .orbit-container {
                position: absolute;
                width: 100%;
                height: 100%;
                animation: rotate 20s linear infinite;

                .orbit-item {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                    animation: counter-rotate 20s linear infinite;

                    span {
                        color: #42b983;
                        font-size: 14px;
                        font-weight: 500;
                    }

                    &.top {
                        top: 0;
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    &.right {
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                    }

                    &.bottom {
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    &.left {
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                    }

                    &::before {
                        content: '';
                        position: absolute;
                        top: -3px;
                        left: -3px;
                        right: -3px;
                        bottom: -3px;
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                    }
                }
            }
        }
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes counter-rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-360deg);
    }
}

// 恢复其他装饰圆形的颜色
.decoration-circles {

    .circle-1,
    .circle-2,
    .circle-3,
    .circle-4 {
        background: rgba(255, 255, 255, 0.1);
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: none;
    }

    &::before,
    &::after {
        background: rgba(255, 255, 255, 0.1);
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: none;
    }
}

.trace-modules {
    display: flex;
    justify-content: center;
    padding: 0 40px;
    margin-top: -40px;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease-in-out;

    .module-item {
        flex: 0 1 auto;
        min-width: 220px;
        text-align: center;
        padding: 20px 30px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 35px;
        margin: 0 15px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        &:hover {
            &::after {
                opacity: 1;
            }

            .module-content {
                transform: translateY(-2px);
            }
        }

        .module-content {
            position: relative;
            z-index: 1;
            transition: transform 0.3s ease;
        }
    }
}

.trace-code {
    background: #ffffff;
    padding: 40px 0;

    .search-container {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
        padding: 0 20px;

        .search-title {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #303133;

            i {
                font-size: 24px;
                margin-right: 10px;
                color: #42b983;
            }

            span {
                font-size: 24px;
                font-weight: 600;
            }
        }

        .search-desc {
            color: #909399;
            font-size: 14px;
            margin-bottom: 24px;
        }

        .search-box {
            max-width: 600px;
            margin: 0 auto;
            position: relative;

            :deep(.el-input) {
                .el-input__inner {
                    height: 44px;
                    line-height: 44px;
                    font-size: 14px;
                    border-radius: 12px;
                    padding: 0 130px 0 20px;
                    border: 2px solid #E4E7ED;
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;

                    &:focus {
                        border-color: #42b983;
                        background: white;
                        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
                    }

                    &::placeholder {
                        color: #909399;
                    }
                }

                .el-input-group__append {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    padding: 0;
                    border: none;
                    background: none;

                    .el-button {
                        height: 36px;
                        padding: 0 20px;
                        border-radius: 6px;
                        font-size: 14px;
                        border: none;
                        background: #ffffff;
                        color: #42b983;
                        font-weight: 500;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;
                        margin-left: 30px;

                        &:hover {
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(87, 87, 87, 0.5);
                        }

                        i {
                            margin-right: 4px;
                            font-size: 14px;
                        }
                    }
                }
            }
        }

        .code-content {
            margin-top: 30px;
            padding: 0 20px;

            .result-text {
                color: #606266;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;

                .code-number {
                    color: #42b983;
                    font-weight: 600;
                    font-size: 18px;
                }

                .verify-tag {
                    background: #67c23a;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 0 15px;
                    height: 32px;
                    line-height: 32px;
                    font-size: 14px;

                    i {
                        margin-right: 4px;
                    }
                }
            }
        }
    }
}

.timeline-card {
    .clearfix {
        display: flex;
        align-items: center;
        gap: 10px;

        .trace-tag {
            font-size: 12px;
            color: #67c23a;
            background: #f0f9eb;
            padding: 2px 6px;
            border-radius: 4px;
        }
    }
}

// 响应式布局样式
@media screen and (max-width: 1600px) {
    .origin-banner {
        padding: 30px 30px 60px;

        .banner-content {
            .banner-subtitle {
                font-size: 32px;
            }
        }

        .banner-right {
            .quality-circle {
                width: 180px;
                height: 180px;
            }
        }
    }

    .trace-modules {
        .module-item {
            min-width: 200px;
            padding: 15px 25px;
        }
    }
}

@media screen and (max-width: 1200px) {
    .origin-banner {
        padding: 25px 25px 50px;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .banner-content {
            margin-bottom: 30px;

            .banner-subtitle {
                font-size: 28px;
            }

            .banner-desc {
                font-size: 16px;
            }
        }
    }

    .trace-modules {
        flex-wrap: wrap;
        margin-top: -20px;

        .module-item {
            margin: 10px;
            min-width: calc(50% - 30px);
        }
    }

    .search-container {
        .search-box {
            .el-input {
                width: 100%;
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .origin-banner {
        padding: 20px 20px 40px;

        .banner-content {
            margin-bottom: 0;
            width: 100%;

            .banner-title {
                padding: 6px 12px;
                justify-content: center;

                i {
                    font-size: 18px;
                }

                span {
                    font-size: 16px;
                }
            }

            .banner-subtitle {
                font-size: 24px;
            }
        }

        .banner-right {
            display: none;
        }
    }

    .trace-modules {
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        gap: 8px;

        .module-item {
            min-width: auto;
            flex: 1;
            margin: 0;
            padding: 10px;
            border-radius: 16px;

            .module-content {
                .module-title {
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .module-status {
                    font-size: 12px;

                    i {
                        font-size: 10px;
                        padding: 3px;
                    }

                    span {
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .trace-code {
        padding: 30px 0;

        .search-container {
            .search-title {
                i {
                    font-size: 20px;
                }

                span {
                    font-size: 20px;
                }
            }

            .search-desc {
                font-size: 14px;
            }

            .search-box {
                :deep(.el-input) {
                    .el-input__inner {
                        padding-right: 15px;
                        border-radius: 8px;
                    }

                    .el-input-group__append {
                        display: none;
                    }
                }
            }
        }

        .code-content {
            margin-top: 25px;

            .result-text {
                flex-direction: column;
                align-items: center;
                gap: 10px;

                &::before {

                    display: block;
                    color: #606266;
                    font-size: 14px;
                }

                .code-number {
                    display: block;
                    font-size: 16px;
                    color: #67c23a;
                    margin: 5px 0;
                }

                .verify-tag {
                    margin-top: 5px;
                }
            }
        }
    }

    .info-cards-container {
        .el-row {
            margin: 0 !important;
        }

        .el-col {
            width: 100% !important;
            padding: 0 !important;
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0;
            }

            .info-card {
                height: auto;
                margin: 0;

                .card-content {
                    padding: 15px;
                }
            }
        }
    }
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
    .info-cards-container {
        .el-row {
            margin: 0 -10px !important;
        }

        .el-col {
            width: 50% !important;
            padding: 0 10px !important;
            margin-bottom: 20px;

            &:last-child {
                width: 100% !important;
            }

            .info-card {
                height: auto;
                margin: 0;

                .card-content {
                    padding: 15px;
                }
            }
        }
    }
}

.search-box {
    .scan-icon {
        display: none; // 默认隐藏
        font-size: 20px;
        color: #909399;
        cursor: pointer;
        padding: 0 8px;

        &:hover {
            color: #409EFF;
        }
    }
}

// 移动端样式
@media screen and (max-width: 768px) {
    .mobile-only {
        display: inline-block !important;
    }

    .desktop-only {
        display: none !important;
    }

    .search-box {
        :deep(.el-input) {
            .el-input__inner {
                padding-right: 40px; // 为扫描图标留出空间
            }

            .el-input__suffix {
                right: 5px;
            }
        }
    }
}

// 桌面端样式
@media screen and (min-width: 769px) {
    .mobile-only {
        display: none !important;
    }

    .desktop-only {
        display: inline-block !important;
    }
}

.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: all 0.3s ease;

    .loading-circle {
        position: relative;
        width: 150px; // 减小5px
        height: 150px; // 减小5px
        margin: 0 auto;
        margin-bottom: 20px;


        .progress-circle {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;

            &::before {
                content: '';
                position: absolute;
                inset: 8px; // 减小内圈间距2px
                background: white;
                border-radius: 50%;
            }

            .progress-inner {
                position: relative;
                z-index: 2;
                width: calc(100% - 16px); // 相应调整内部容器
                height: calc(100% - 16px);
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;

                .bottle-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        .progress-text {
            position: absolute;
            left: 50%;
            bottom: -55px;
            transform: translateX(-50%);
            text-align: center;
            white-space: nowrap;

            .progress-number {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #42b983;
                line-height: 1.2;
            }

            .progress-label {
                display: block;
                font-size: 14px;
                color: #606266;
                margin-top: 4px;
            }
        }
    }

    .trace-items {
        margin-top: 40px; // 增加上边距，为进度文字留出空间

        .trace-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 10px;
            color: #606266;

            &.traced {
                .status-text {
                    color: #67c23a;
                }
            }

            .status-text {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
    }
}

.trace-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;

    .trace-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #909399;
        transition: all 0.3s ease;

        .item-name {
            min-width: 80px;
            text-align: right;
            font-size: 14px;
        }

        .status-text {
            display: flex;
            align-items: center;
            gap: 5px;
            opacity: 0.5;

            .status {
                color: #67C23A;
            }

            i {
                color: #67C23A;
                font-size: 14px;
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s ease;
            }
        }

        &.traced {
            .status-text {
                opacity: 1;

                i {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        }
    }
}

.blockchain-card {
    margin: 20px 0;

    .el-card__header {
        .el-icon-info {
            margin-left: 8px;
            color: #909399;
            cursor: help;
        }
    }

    .blockchain-info {
        .info-row {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;

            .label {
                min-width: 100px;
                color: #606266;
                font-size: 14px;
            }

            .value {
                flex: 1;
                color: #303133;
                font-family: monospace;

                &.hash {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    .el-icon-document-copy {
                        cursor: pointer;
                        color: #409EFF;

                        &:hover {
                            color: #66b1ff;
                        }
                    }
                }
            }
        }

        .blockchain-verify {
            text-align: center;
            margin-top: 20px;
        }
    }
}

.horizontal-timeline-wrapper {
    overflow: auto;
    padding: 20px 0;

    .horizontal-timeline {
        display: flex;
        position: relative;
        transition: all 0.3s ease;

        &.mobile-vertical-timeline {
            flex-direction: column;
            margin: 0 10px;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 15px;
                width: 2px;
                background-color: #EBEEF5;
                z-index: 0;
            }
        }

        &.two-row-timeline {
            flex-wrap: wrap;
            justify-content: center;

            // 为两行布局添加样式
            :deep(.timeline-item) {
                width: calc(20% - 20px); // 改为20%，一行5个卡片
                margin: 10px;
                flex: 0 0 auto;

                @media screen and (max-width: 1600px) {
                    width: calc(20% - 20px);
                }

                @media screen and (max-width: 1400px) {
                    width: calc(25% - 20px); // 小屏幕时4个卡片
                }

                @media screen and (max-width: 1200px) {
                    width: calc(33.33% - 20px); // 更小屏幕时3个卡片
                }

                @media screen and (max-width: 992px) {
                    width: calc(50% - 20px); // 最小屏幕时2个卡片
                }
            }
        }
    }
}

// Add mobile-specific styles
@media screen and (max-width: 768px) {
    .timeline-card {
        .horizontal-timeline-wrapper {
            padding: 10px 0;

            .horizontal-timeline {
                padding-left: 10px;
            }
        }
    }
}

.env-info-container {
    .env-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding: 0 10px;
    }
}

.task-detail {
    padding: 10px;

    .detail-item {
        margin-bottom: 15px;

        .label {
            font-weight: bold;
            color: #606266;
            margin-right: 10px;
        }
    }

    .resource-section,
    .images-section {
        margin-top: 20px;

        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #303133;
            border-left: 3px solid #42b983;
            padding-left: 10px;
        }
    }

    .resource-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .resource-tag {
            margin: 4px;
        }
    }

    .image-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;

        .task-image {
            width: 100%;
            height: 120px;
            border-radius: 4px;

            &:hover {
                cursor: pointer;
                transform: scale(1.05);
                transition: transform 0.3s;
            }
        }
    }
}

.el-dialog {
    .el-dialog__body {
        max-height: 70vh;
        overflow-y: auto;
    }
}

.monitor-section {
    .monitor-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 30px;

        .monitor-item {
            position: relative;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: all 0.3s ease;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.1;
                transition: opacity 0.3s ease;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);

                &::before {
                    opacity: 0.15;
                }

                .item-bg .bg-icon {
                    opacity: 0.2;
                }
            }

            .item-bg {
                position: absolute;
                right: -20px;
                bottom: -20px;
                width: 120px;
                height: 120px;
                opacity: 0.1;

                .bg-icon {
                    width: 100%;
                    height: 100%;
                    opacity: 0.15;
                    transition: opacity 0.3s ease;
                }
            }

            .item-label {
                position: relative;
                color: #909399;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .item-value {
                position: relative;
                display: flex;
                align-items: baseline;
                gap: 4px;

                .number {
                    font-size: 24px;
                    font-weight: 600;
                }

                .unit {
                    font-size: 14px;
                    color: #909399;
                }
            }

            &.temperature {
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);

                .item-bg {
                    color: #ff6b6b;
                }

                .item-value {
                    .number {
                        color: #ff6b6b;
                    }
                }
            }

            &.ph {
                background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.05) 100%);

                .item-bg {
                    color: #409eff;
                }

                .item-value {
                    .number {
                        color: #409eff;
                    }
                }
            }

            &.oxygen {
                background: linear-gradient(135deg, rgba(103, 194, 58, 0.1) 0%, rgba(103, 194, 58, 0.05) 100%);

                .item-bg {
                    color: #67c23a;
                }

                .item-value {
                    .number {
                        color: #67c23a;
                    }
                }
            }

            &.ammonia {
                background: linear-gradient(135deg, rgba(230, 162, 60, 0.1) 0%, rgba(230, 162, 60, 0.05) 100%);

                .item-bg {
                    color: #e6a23c;
                }

                .item-value {
                    .number {
                        color: #e6a23c;
                    }
                }
            }

            &.nitrite {
                background: linear-gradient(135deg, rgba(144, 147, 153, 0.1) 0%, rgba(144, 147, 153, 0.05) 100%);

                .item-bg {
                    color: #909399;
                }

                .item-value {
                    .number {
                        color: #909399;
                    }
                }
            }

            .item-label {
                color: #606266;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .item-value {
                display: flex;
                align-items: baseline;
                gap: 4px;

                .number {
                    font-size: 24px;
                    font-weight: 500;
                }

                .unit {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }
    }
}

// 响应式布局
@media screen and (max-width: 768px) {
    .monitor-section {
        .monitor-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 15px;
        }
    }
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
    .monitor-section {
        .monitor-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

.soil-section {
    margin-top: 30px;

    .soil-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        .soil-item {
            position: relative;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: all 0.3s ease;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.1;
                transition: opacity 0.3s ease;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);

                &::before {
                    opacity: 0.15;
                }

                .item-bg .bg-icon {
                    opacity: 0.2;
                }
            }

            .item-bg {
                position: absolute;
                right: -20px;
                bottom: -20px;
                width: 120px;
                height: 120px;
                opacity: 0.1;

                .bg-icon {
                    width: 100%;
                    height: 100%;
                    opacity: 0.15;
                    transition: opacity 0.3s ease;
                }
            }

            .item-label {
                position: relative;
                color: #909399;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .item-value {
                position: relative;
                display: flex;
                align-items: baseline;
                gap: 4px;

                .number {
                    font-size: 24px;
                    font-weight: 600;
                }

                .unit {
                    font-size: 14px;
                    color: #909399;
                }
            }

            // PH值卡片样式
            &.ph {
                background: linear-gradient(135deg, #f0f7ff 0%, #fff 100%);

                &::before {
                    background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
                }

                .item-value .number {
                    color: #9254de;
                }

                .bg-icon {
                    fill: none;
                    stroke: #9254de;
                    color: #9254de;
                }
            }

            // 土壤温度卡片样式
            &.temperature {
                background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);

                &::before {
                    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
                }

                .item-value .number {
                    color: #f56c6c;
                }

                .bg-icon {
                    fill: #f56c6c;
                }
            }

            // 土壤湿度卡片样式
            &.humidity {
                background: linear-gradient(135deg, #e6f7ff 0%, #fff 100%);

                &::before {
                    background: linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%);
                }

                .item-value .number {
                    color: #1890ff;
                }

                .bg-icon {
                    fill: #1890ff;
                }
            }

            // 电导率卡片样式
            &.conductivity {
                background: linear-gradient(135deg, #f6ffed 0%, #fff 100%);

                &::before {
                    background: linear-gradient(135deg, #52c41a 0%, #85d675 100%);
                }

                .item-value .number {
                    color: #52c41a;
                }

                .bg-icon {
                    fill: #52c41a;
                    stroke: #52c41a;
                }
            }
        }
    }
}

// 响应式布局
@media screen and (max-width: 768px) {
    .soil-section {
        .soil-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 15px;
        }
    }
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
    .soil-section {
        .soil-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

.loading-circle {
    .blockchain-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%; // 稍微调大一点以展示区块链图片的细节
        height: auto;
        z-index: 2;
        filter: drop-shadow(0 0 8px rgba(66, 185, 131, 0.2)); // 添加发光效果
        animation: pulse 2s infinite; // 添加脉冲动画

    }
}

@keyframes pulse {
    0% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(0.95);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.05);
    }

    100% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(0.95);
    }
}

.medicine-section {
    margin-top: 20px;

    .section-title {
        font-weight: bold;
        margin-bottom: 10px;
    }

    .medicine-list {
        margin-top: 10px;
    }
}

// 添加鱼类特定的样式
.info-card {
    &.fish-card {
        background: linear-gradient(to bottom right, #ffffff, #f8fcff);
        border: 1px solid #e6f3ff;

        .card-header {
            background: linear-gradient(to right, #ecf5ff, #ffffff);
            border-bottom: 1px solid #e6f3ff;

            i {
                color: #409EFF;

                &.el-icon-house {
                    color: #67C23A; // 鱼棚图标使用绿色
                }

                &.el-icon-menu {
                    color: #409EFF; // 养殖信息图标使用蓝色
                }

                &.el-icon-goods {
                    color: #E6A23C; // 食品信息图标使用橙色
                }
            }
        }

        .card-content {
            .info-item {
                position: relative;
                padding: 12px;
                margin-bottom: 15px;
                background: rgba(236, 245, 255, 0.3);
                border-radius: 8px;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(236, 245, 255, 0.5);
                }

                .label {
                    color: #606266;
                    font-size: 13px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 5px;

                    &::before {
                        content: '';
                        display: inline-block;
                        width: 4px;
                        height: 4px;
                        background: #409EFF;
                        border-radius: 50%;
                    }
                }

                .value {
                    color: #303133;
                    font-size: 14px;
                    font-weight: 500;

                    &.address {
                        font-family: monospace;
                        color: #409EFF;
                        font-size: 13px;
                        word-break: break-all;
                        padding: 8px;
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: 4px;
                        border: 1px solid #e6f3ff;

                        &:hover {
                            background: #ffffff;
                        }
                    }
                }
            }
        }
    }
}

// 养殖环节时间线样式
.timeline-card.fish-timeline {
    .horizontal-timeline {
        &::before {
            background: linear-gradient(to right, #409EFF, #67C23A);
        }
    }

    :deep(.timeline-item) {
        .timeline-content {
            background: linear-gradient(to bottom right, #ffffff, #f8fcff);
            border: 1px solid #e6f3ff;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
            }

            .timeline-header {
                background: linear-gradient(to right, #ecf5ff, #ffffff);
                border-bottom: 1px solid #e6f3ff;
                padding: 12px 15px;

                .timeline-title {
                    color: #409EFF;
                    font-weight: 500;
                }
            }

            .timeline-body {
                padding: 12px 15px;

                .timeline-info {
                    margin-bottom: 8px;
                    color: #606266;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }

        .timeline-dot {
            background: #409EFF;
            border: 2px solid #ffffff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
        }
    }
}

// 水质监测卡片样式优化
.monitor-section {
    .monitor-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;

        .monitor-item {
            background: linear-gradient(to bottom right, #ffffff, #f8fcff);
            border: 1px solid #e6f3ff;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);

                .item-bg {
                    transform: scale(1.05);
                }
            }

            .item-bg {
                position: absolute;
                right: -20px;
                bottom: -20px;
                width: 100px;
                height: 100px;
                opacity: 0.1;
                transition: all 0.3s ease;

                .bg-icon {
                    width: 100%;
                    height: 100%;
                    fill: currentColor;
                }
            }

            .item-label {
                font-size: 14px;
                color: #606266;
                margin-bottom: 10px;
                position: relative;
                z-index: 1;
            }

            .item-value {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: baseline;
                gap: 4px;

                .number {
                    font-size: 24px;
                    font-weight: 600;
                    color: #409EFF;
                }

                .unit {
                    font-size: 12px;
                    color: #909399;
                }
            }

            // 为不同类型的监测项添加特定颜色
            &.temperature {
                color: #E6A23C;

                .number {
                    color: #E6A23C;
                }
            }

            &.ph {
                color: #409EFF;

                .number {
                    color: #409EFF;
                }
            }

            &.oxygen {
                color: #67C23A;

                .number {
                    color: #67C23A;
                }
            }

            &.ammonia {
                color: #F56C6C;

                .number {
                    color: #F56C6C;
                }
            }

            &.nitrite {
                color: #909399;

                .number {
                    color: #909399;
                }
            }
        }
    }
}

// 任务详情对话框样式
.task-detail {
    .detail-item {
        margin-bottom: 20px;

        .label {
            color: #606266;
            font-size: 14px;
            margin-bottom: 8px;
        }
    }

    .resource-section {
        margin-top: 20px;

        .section-title {
            font-size: 14px;
            color: #606266;
            margin-bottom: 12px;
        }

        .resource-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .resource-tag {
                margin: 0;
            }
        }
    }

    .images-section {
        margin-top: 20px;

        .section-title {
            font-size: 14px;
            color: #606266;
            margin-bottom: 12px;
        }

        .image-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;

            .task-image {
                width: 100%;
                height: 120px;
                border-radius: 4px;
                object-fit: cover;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }
}

// 响应式调整
@media screen and (max-width: 768px) {
    .monitor-section {
        .monitor-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 10px;

            .monitor-item {
                padding: 15px;

                .item-value {
                    .number {
                        font-size: 20px;
                    }
                }
            }
        }
    }

    .task-detail {
        .images-section {
            .image-list {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }
}

// 添加全局样式
:global(body.el-popup-parent--hidden) {
    padding-right: 17px; // 滚动条的宽度
}
</style>