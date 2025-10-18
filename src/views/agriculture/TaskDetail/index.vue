<template>
    <div class="task-detail">
        <el-input :value="form.batchName + ' / ' + form.taskName" placeholder="" size="small"
            clearable disabled class="task-name-input"></el-input>

        <el-form label-position="top" ref="formRef" :model="form" :rules="rules" label-width="0">
            <el-row class="mt-20">
                <el-col :span="4" class="flex items-center">
                    <status-select v-model="form.status" @change="handleSubmit"> 当前状态 </status-select>
                </el-col>
                <el-col :span="4" class="flex items-center">
                    <el-form-item prop="responsiblePersonId" class="mb-0">
                        <radio-select 
                            :options="userList" 
                            v-model="form.responsiblePersonId" 
                            key-name="nickName"
                            value-name="userId" 
                            @change="handleSubmit">
                            责任人
                        </radio-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="flex items-center">
                    <calendar-select v-model="form.planStart" disabled>计划开始时间</calendar-select>
                </el-col>
                <el-col :span="4" class="flex items-center">
                    <calendar-select v-model="form.planFinish" disabled>计划完成时间</calendar-select>
                </el-col>
                <el-col :span="4" class="flex items-center">
                    <calendar-select v-model="form.actualStart" :showTime="true">实际开始时间</calendar-select>
                </el-col>
                <el-col :span="4" class="flex items-center">
                    <calendar-select v-model="form.actualFinish" :showTime="true">实际结束时间</calendar-select>
                </el-col>
            </el-row>

            <div class="mt-20">
                <el-tabs v-model="activeTab">
                    <el-tab-pane name="taskInfo" >
                        <template #label :current-user="currentUser"  >
                            <span class="custom-tabs-label">
                                <el-icon><Document /></el-icon>
                                <span>任务信息</span>
                            </span>
                        </template>
                        <div class="task-description">
                            <div class="text-lg font-bold mb-4">任务详情：</div>
                            <template v-if="!isEditingRemark">
                                <div v-if="form.remark" class="mt-4">
                                    {{ form.remark }}
                                    <span class="text-primary ml-2 cursor-pointer edit-btn"
                                        @click="isEditingRemark = true">编辑</span>
                                </div>
                                <div v-else class="mt-4">
                                    --暂无描述--
                                    <span class="text-primary ml-2 cursor-pointer"
                                        @click="isEditingRemark = true">添加描述</span>
                                </div>
                            </template>
                            <template v-else>
                                <el-input v-model="form.remark" type="textarea" :rows="4" resize="none" :maxlength="-1"
                                    :show-word-limit="false" class="mt-4"></el-input>
                                <div class="flex justify-end mt-2">
                                    <el-button-group>
                                        <!-- 自定义按钮样式：绿色背景、白色字体 -->
                                        <el-button type="primary" size="small" class="confirm-btn" @click="handleSubmit(); isEditingRemark = false">
                                            确定</el-button>
                                        <!-- 自定义按钮样式：绿色背景、白色字体 -->
                                        <el-button type="primary" plain size="small" class="cancel-btn" @click="isEditingRemark = false">取消</el-button>
                                    </el-button-group>
                                </div>
                            </template>
                        </div>
                        
                        <div class="mt-8">人员信息：</div>
                        <multiple-select
                          v-model="selectEmployeeList"
                          :options="employeeList"
                          key-name="employeeName"
                          value-name="employeeId"
                          @change="handleTaskEmployeeChange"
                        />
                        
                        <div class="mt-8">
                            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                                <span class="font-bold text-lg mr-2" style="color: black;">操作信息</span>
                                <div style="flex-grow: 1; height: 1px; background-color: #d1d5db;"></div>
                            </div>
                            <div style="height: 150px; overflow-y: auto;">
                                <div v-for="(log, index) in logList" :key="index" class="leading-8">
                                    {{ index + 1 }}、{{ log.createTime }} ，
                                    由<span class="text-warning font-bold px-2">{{ log.operName }}</span><span>{{log.operDes}}</span>
                                </div>
                            </div>
                        </div>

                    
                    </el-tab-pane>
                    <el-tab-pane name="costEmployee">
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon><User /></el-icon>
                                <span>人工工时</span>
                            </span>
                        </template>
                        <cost-employee ref="costEmployeeRef" :task-id="taskId" :task-employee-list="selectedEmployeeObjects" :current-user="currentUser" @log="fetchLogList"></cost-employee>
                    </el-tab-pane>
                    <el-tab-pane name="costMachine">
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon><Van /></el-icon>
                                <span>机械工时</span>
                            </span>
                        </template>
                        <cost-machine :task-id="taskId" :current-user="currentUser" @log="fetchLogList"></cost-machine>
                    </el-tab-pane>
                    <el-tab-pane name="costMaterial">
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon><Food /></el-icon>
                                <span>饵料投喂</span>
                            </span>
                        </template>
                        <cost-material :task-id="taskId" :current-user="currentUser" @log="fetchLogList"></cost-material>
                    </el-tab-pane>
                    <el-tab-pane name="annex">
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon><Paperclip /></el-icon>
                                <span>附件</span>
                            </span>
                        </template>
                        <div class="font-bold">图片:</div>
                        <div class="el-top upload-container">
                            <el-upload
                                class="cover-uploader"
                                :action="uploadImageUrl"
                                :headers="uploadHeaders"
                                list-type="picture-card"
                                :file-list="form.taskImages.map((url, idx) => ({ name: `图片${idx+1}`, url }))"
                                :on-success="onSuccess"
                                :on-remove="onRemove"
                                :before-upload="beforeUpload"
                                :limit="5"
                                multiple
                            >
                                <el-icon><Plus /></el-icon>
                            </el-upload>
                        </div>
                        <div class="font-bold mt-4">视频:</div>
                        <div class="el-top upload-container">
                            <el-upload
                                class="cover-uploader"
                                :action="uploadVideoUrl"
                                :headers="uploadHeaders"
                                list-type="picture-card"
                                :file-list="form.taskVideos.map((url, idx) => ({ name: `视频${idx+1}`, url } ))"
                                :on-success="onVideoSuccess"
                                :on-remove="onVideoRemove"
                                :before-upload="beforeVideoUpload"
                                :limit="5"
                                multiple
                                accept="video/*"
                            >
                                <el-icon><VideoCamera /></el-icon>
                                <template #file="{ file }">
                                    <video :src="file.url" class="cover-image" controls style="width: 100%; height: 100%; object-fit: cover;" />
                                </template>
                            </el-upload>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { AgricultureTaskEmployeeService } from "@/api/agriculture/taskEmployeeApi"
import { AgricultureCropBatchService } from "@/api/agriculture/batchApi";
import { AgricultureEmployeeService } from "@/api/agriculture/employeeApi";
import { AgricultureCropBatchTaskService } from "@/api/agriculture/batchTaskApi";     
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { Document, User, Van, Paperclip, Plus, VideoCamera, Food } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import RadioSelect from "./RadioSelect.vue"
import CalendarSelect from "./CalendarSelect.vue"
import MultipleSelect from "./MultipleSelect.vue"
import StatusSelect from "./StatusSelect.vue"
import CostEmployee from "./CostEmployee.vue"
import CostMachine from './CostMachine.vue'
import CostMaterial from './CostMaterial.vue'   
import { useUserStore } from '@/store/modules/user'
import { DictDataService } from '@/api/system/dict/dataApi'
import { AgricultureTaskLogService } from '@/api/agriculture/logApi'
import { AgricultureCostEmployeeService } from '@/api/agriculture/costEmployeeApi'
import { UserService } from '@/api/system/userApi'

// Props 定义
const props = defineProps({
    taskId: {
        type: Number,
        required: true
    },
    oprType: {
        type: String,
        default: "update"
    },
    batchId: {
        type: Number
    },
})

// 响应式状态
const activeTab = ref("taskInfo")
const isEditingRemark = ref(false)
const batchList = ref([])
const userList = ref([])
const landList = ref([])
const batchTaskStatusList = ref([])
const logList = ref([])
const costEmployeeRef = ref(null)
const formRef = ref(null)
const isInit = ref(true)
const employeeList = ref([])
const selectEmployeeList = ref([])
const employeeIdToTaskEmployeeId = ref({})
const needRefresh = ref(false)
const userInfo = computed(() => userStore.info)

const form = reactive({
    taskId: null,
    batchId: null,
    remark: null,
    taskName: null,
    batchName: null,
    planStart: null,
    planFinish: null,
    actualStart: null,
    actualFinish: null,
    taskDetail: null,
    taskImages: [],
    taskVideos: [],
    remark: null,
    status: "0",
    orderNum: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    delFlag: null,
    userName: null,
    batchHead: null,
    batchHeadName: null
})

const rules = {
    responsiblePersonId: [{
        required: true,
        message: "责任人不能为空",
        trigger: "blur"
    }]
}

// 方法定义
const fetchBatchList = async () => {
    const response = await AgricultureCropBatchTaskService.getBatchTask(props.taskId)
    batchList.value = response.rows
}

/**
 * 获取系统用户列表（负责人）
 */
const fetchUserList = async () => {
    const response = await UserService.listUser({})
    userList.value = response.rows.map(item => ({
        ...item,
        userId: Number(item.userId),
        nickName: item.nickName
    }))
    console.log('获取到的用户列表:', userList.value)
}

/**
 * 日志
 */
const fetchLogList = async () => {
    const response = await AgricultureTaskLogService.listLog({ taskId: props.taskId, pageNum: 1, pageSize: 1000 })
    logList.value = response.rows
}
/**
 * 字典
 */
const fetchBatchTaskStatusList = async () => {
    const response = await DictDataService.listData({ dictType: "agriculture_batch_task_status" })
    batchTaskStatusList.value = response.rows
}

const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    Object.assign(form, {
        taskId: null,
        batchId: null,
        taskName: null,
        batchName: null,
        planStart: null,
        planFinish: null,
        actualStart: null,
        actualFinish: null,
        taskDetail: null,
        taskImages: [],
        taskVideos: [],
        remark: null,
        status: "0",
        orderNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        userName: null,
        batchHead: null,
        batchHeadName: null
    })
}

const handleAdd = () => {
    resetForm()
}

const handleUpdate = async () => {
    resetForm()
    if (props.taskId) {
        console.log('开始获取任务详情，taskId:', props.taskId)
        try {
            const response = await AgricultureCropBatchTaskService.getBatchTask(props.taskId)
            console.log('获取任务详情成功，返回数据:', response)
            if (response.data) {
                Object.assign(form, response.data)
                form.taskImages = form.taskImages || []
                form.taskVideos = form.taskVideos || []
                if (response.data.batchId) {
                    const batchResponse = await AgricultureCropBatchService.getBatch(response.data.batchId)
                    if (batchResponse.data) {
                        form.batchName = batchResponse.data.batchName
                    }
                }
                console.log('更新后的form数据:', form)
            }
        } catch (error) {
            console.error('获取任务详情失败:', error)
        }
    }
}

const addTaskLog = async (des) => {
    await AgricultureTaskLogService.addLog({
        taskId: props.taskId,
        operDes: des,
        operName: userStore.info.name,
        operId: userStore.info.id,
        createBy: userStore.info.id,
        updateBy: userStore.info.id
    })
    await fetchLogList()
}

const handleSubmit = async () => {
    console.log('--- handleSubmit 被调用 ---')
    if (!formRef.value) {
        console.log('formRef.value 不存在，无法进行表单验证。')
        return
    }
    
    await formRef.value.validate(async (valid) => {
        console.log('表单验证结果 valid:', valid)
        if (valid) {
            console.log('表单验证成功，准备提交数据。当前 form.taskId:', form.taskId)
            console.log('提交前的form数据:', JSON.parse(JSON.stringify(form)))
            console.log('实际开始时间 (actualStart):', form.actualStart);
            console.log('实际结束时间 (actualFinish):', form.actualFinish);
            // ====== 处理 taskImages 和 taskVideos 字段，防止后端反序列化报错 ======
            // 1. 备份原始数组，防止影响页面响应式
            const originalTaskImages = Array.isArray(form.taskImages) ? [...form.taskImages] : form.taskImages;
            const originalTaskVideos = Array.isArray(form.taskVideos) ? [...form.taskVideos] : form.taskVideos;
            // 2. 如果是数组，转为逗号分隔的字符串，满足后端要求
            if (Array.isArray(form.taskImages)) {
                form.taskImages = form.taskImages.join(',');
            }
            if (Array.isArray(form.taskVideos)) {
                form.taskVideos = form.taskVideos.join(',');
            }
            // ====== 以上为提交前处理 ======
            try {
                if (form.taskId != null) {
                    console.log('执行更新任务 API 调用: updateBatchTask')
                    await AgricultureCropBatchTaskService.updateBatchTask(form)
                    await addTaskLog('完善项目信息')
                    ElMessage.success("修改成功")
                    console.log('任务更新成功')
                    emit('updated')
                } else {
                    console.log('执行新增任务 API 调用: addBatchTask')
                    await AgricultureCropBatchTaskService.addBatchTask(form)
                    ElMessage.success("新增成功")
                    console.log('任务新增成功')
                }
            } catch (error) {
                console.error('API 调用失败:', error)
                ElMessage.error("操作失败，请查看控制台")
            } finally {
                // 3. 恢复为原始数组，保证页面数据和响应式不受影响
                form.taskImages = originalTaskImages;
                form.taskVideos = originalTaskVideos;
            }
        } else {
            console.log('表单验证失败，请检查输入。')
            ElMessage.error("请检查表单项")
        }
    })
    console.log('emit updated')
}

// 初始化数据
const initData = async () => {
    console.log('开始初始化数据')
    try {
        await Promise.all([
            fetchBatchList(),
            fetchBatchTaskStatusList(),
            fetchLogList(),
            fetchUserList()
        ])
        
        console.log('基础数据获取完成，准备处理操作类型')
        console.log('当前oprType:', props.oprType)
        
        if (props.oprType === 'add') {
            console.log('执行handleAdd')
            handleAdd()
        } else if (props.oprType === 'update') {
            console.log('执行handleUpdate')
            await handleUpdate()
        }
        await fetchEmployeeList()
        await fetchTaskEmployee()
        isInit.value = false
    } catch (error) {
        console.error('初始化数据失败:', error)
    }
}

// 监听器
watch(() => form.responsiblePersonId, (newVal) => {
    if (newVal) {
        const arr = userList.value.filter(item => item.userId == newVal)
        if (arr.length > 0) {
            form.responsiblePersonName = arr[0].nickName
        }
    }
})

// 监听 actualStart 和 actualFinish 的变化并触发表单提交
watch([() => form.actualStart, () => form.actualFinish], (newVal, oldVal) => {
    if (!isInit.value && (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1])) {
        handleSubmit();
    }
});

const userStore = useUserStore()
const currentUser = {
  userId: userStore.info.id,
  userName: userStore.info.name
}
let { accessToken } = userStore
// 传递 token
const uploadHeaders = { Authorization: accessToken }
// 上传路径
const uploadImageUrl = `${import.meta.env.VITE_API_BASE_URL}/common/upload`

// 上传成功后的处理函数
const onSuccess = (response, file, fileList) => {
    form.taskImages.push(response.url)
    ElMessage.success('图片上传成功')
    addTaskLog('上传图片')
}

// 删除图片
const onRemove = (file, fileList) => {
    form.taskImages = fileList.map(f => f.url)
    addTaskLog('删除图片')
}

// 上传失败后的处理函数
const onError = () => {
    ElMessage.error('图片上传失败')
}

// 上传前的校验函数
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error('只能上传图片文件!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return false
    }
    return true
}
// 上传视频路径
const uploadVideoUrl = `${import.meta.env.VITE_API_BASE_URL}/common/upload`

// 视频上传成功后的处理函数
const onVideoSuccess = (response, file, fileList) => {
    form.taskVideos.push(response.url)
    ElMessage.success('视频上传成功')
    addTaskLog('上传视频')
}

// 删除视频
const onVideoRemove = (file, fileList) => {
    form.taskVideos = fileList.map(f => f.url)
    addTaskLog('删除视频')
}

// 视频上传前的校验函数
const beforeVideoUpload = (file) => {
    const isVideo = file.type.startsWith('video/')
    const isLt50M = file.size / 1024 / 1024 < 50

    if (!isVideo) {
        ElMessage.error('只能上传视频文件!')
        return false
    }
    if (!isLt50M) {
        ElMessage.error('视频大小不能超过 50MB!')
        return false
    }
    return true
}

watch(() => activeTab.value, (newVal) => {
    console.log('activeTab changed to:', newVal)
})

// 生命周期钩子
onMounted(() => {
    console.log('组件挂载，taskId:', props.taskId)
    console.log('oprType:', props.oprType)
    console.log('开始调用initData')
    initData()
})

// 获取所有员工
const fetchEmployeeList = async () => {
    const res = await AgricultureEmployeeService.listEmployee({})
    employeeList.value = res.rows || []
    console.log('employeeList:', employeeList.value)
}

// 获取当前任务的参与人员
const fetchTaskEmployee = async () => {
    // 保证 employeeList 已经有数据
    if (!employeeList.value.length) {
        await fetchEmployeeList();
    }
    try {
        const res = await AgricultureTaskEmployeeService.listEmployee({ taskId: props.taskId })
        const filtered = (res.rows || []).filter(item => item.taskId == props.taskId)
        // 保存 employeeId 到 taskEmployeeId 的映射
        employeeIdToTaskEmployeeId.value = {}
        filtered.forEach(item => {
            employeeIdToTaskEmployeeId.value[item.employeeId] = item.id
        })
        const ids = [...new Set(filtered.map(item => item.employeeId))]
        selectEmployeeList.value = ids
    } catch (e) {
        console.error('fetchTaskEmployee error:', e)
    }
    console.log('employeeList:', employeeList.value)
    console.log('selectEmployeeList:', selectEmployeeList.value)
}

const handleTaskEmployeeChange = async (e) => {
    const { type, value } = e
    if (type === 'add') {
        // 1. 调用 addEmployee（addTaskEmployee）接口，将新人员与当前任务关联
        await AgricultureTaskEmployeeService.addEmployee({
            taskId: props.taskId,
            employeeId: value
        })
        // 2. 接口调用成功后，记录一条"增加参与人员"的日志
        await addTaskLog("增加参与人员")
        // 3. 弹出"添加成功"提示，告知用户操作已完成
        ElMessage.success("添加成功")
        // 4. 刷新当前任务的参与人员列表，确保 UI 同步
        await fetchTaskEmployee()
        // 5. 如有需要，可通知子组件（如人工工时统计）刷新人员列表
        // costEmployeeRef.value?.getTaskEmployeeList?.()
    } else if (type == 'del') {
        // 用 employeeId 查找 taskEmployeeId
        const taskEmployeeId = employeeIdToTaskEmployeeId.value[value]
        if (!taskEmployeeId) {
            ElMessage.error("未找到对应的任务员工记录，无法删除")
            return
        }
        await AgricultureTaskEmployeeService.deleteEmployee(taskEmployeeId)
        await addTaskLog("删除参与人员")
        ElMessage.success("删除成功")
        await fetchTaskEmployee()
    }
}

const selectedEmployeeObjects = computed(() =>
  employeeList.value.filter(emp => selectEmployeeList.value.includes(emp.employeeId))
)

const onTaskUpdated = () => {
  needRefresh.value = true
}

const onTaskDetailClose = () => {
  showTaskDetailDialog.value = false
  if (needRefresh.value) {
    getList()
    needRefresh.value = false
  }
}

const emit = defineEmits(['close', 'updated'])

</script>

<style lang="scss" scoped>
.task-name-input {
    margin-top: -15px;
    height: 30px;
}
.task-detail {
    :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
    }

    .custom-tabs-label {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .el-icon {
            margin-right: 4px;
        }
    }
}

.task-description {
  margin-bottom: 15px;
}

.task-description > .text-lg {
  margin-bottom: 12px;
}

.mt-8 {
  margin-top: 15px !important;
}

// 编辑按钮绿色字体
.edit-btn {
  color: #3bb77e !important;
}

// 自定义"确定"按钮样式：绿色背景、白色字体、无边框
.confirm-btn {
  background: #3bb77e !important;
  color: #fff !important;
  border: none !important;
}
// 自定义"取消"按钮样式：灰色背景、白色字体、无边框
.cancel-btn {
  background: #acf3d1 !important;
  color: #fff !important;
  border: none !important;
}
// 鼠标悬停时按钮颜色加深
.confirm-btn:hover {
  background: #34a06a !important;
  color: #fff !important;
}
.cancel-btn:hover {
  background: #bdbdbd !important;
  color: #fff !important;
}
</style>