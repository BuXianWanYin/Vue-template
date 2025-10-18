<template>
  <div class="padding-bottom-10">
    <el-alert title="登记机械工时" type="info" show-icon description="此处可以登记机械工时" />

    <el-table v-loading="loading" :data="costMachineList" class="margin-top-10">
      <el-table-column label="机械" align="center" prop="machineId">
        <template #default="{ row }">
          {{ machineInfoList.find(item => item.machineId === row.machineId)?.machineName || row.machineId }}
        </template>
      </el-table-column>
      <el-table-column label="机械数量" align="center" prop="machineCount" />
      <el-table-column label="工时" align="center" prop="workingHours" />
      <el-table-column label="开始日期" align="center" prop="workingStart" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.workingStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="workingFinish" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.workingFinish, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #header>
          <el-tag @click="handleAdd" v-hasPermi="['agriculture:costMachine:add']" class="cursor-pointer">新增</el-tag>
        </template>
        <template #default="{ row }">
          <el-button size="small" type="primary" link icon="Edit" @click="handleUpdate(row)"
            v-hasPermi="['agriculture:costMachine:edit']">修改</el-button>
          <el-button size="small" type="primary" link icon="Delete" @click="handleDelete(row)"
            v-hasPermi="['agriculture:costMachine:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改机械工时对话框 -->
    <el-dialog v-model="open" :title="title" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机械" prop="machineId">
          <el-select v-model="form.machineId" placeholder="请选择机械" class="display-block">
            <el-option v-for="item in machineInfoList" :key="item.machineId" :label="item.machineName"
              :value="item.machineId" />
          </el-select>
        </el-form-item>
        <el-form-item label="机械数量" prop="machineCount">
          <el-input v-model="form.machineCount" placeholder="请输入机械数量" />
        </el-form-item>
        <el-form-item label="工时" prop="workingHours">
          <el-input v-model="form.workingHours" placeholder="请输入工时" />
        </el-form-item>
        <el-form-item label="开始日期" prop="workingStart">
          <el-date-picker v-model="form.workingStart" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择开始日期" class="w100" clearable />
        </el-form-item>
        <el-form-item label="结束日期" prop="workingFinish">
          <el-date-picker v-model="form.workingFinish" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择结束日期" class="w100" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AgricultureMachineService } from "@/api/agriculture/machineApi"
import { AgricultureCostMachineService } from "@/api/agriculture/costMachineApi"
import { AgricultureTaskLogService } from "@/api/agriculture/logApi"
import { AgricultureMachineResult } from '@/types/agriculture/machine'
import { AgricultureCostMachineResult } from '@/types/agriculture/costMachine'
import { parseTime } from '@/utils/utils'

const props = defineProps({
  taskId: {
    type: [Number, String],
    required: true
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['log'])

// 遮罩层
const loading = ref(true)
// 总条数
const total = ref(0)
// 机械工时表格数据
const costMachineList = ref<AgricultureCostMachineResult[]>([])
const machineInfoList = ref<AgricultureMachineResult[]>([])
// 弹出层标题
const title = ref("")
// 是否显示弹出层
const open = ref(false)
// 表单ref
const formRef = ref()

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  taskId: props.taskId
})

// 表单参数
const form = reactive({
  costId: null,
  taskId: props.taskId,
  machineId: '',
  machineCount: null,
  workingHours: null,
  workingStart: '',
  workingFinish: '',
  remark: null,
  status: "0",
  orderNum: null,
  createBy: null,
  createTime: null,
  updateBy: null,
  updateTime: null,
  delFlag: null
})

// 表单校验规则
const rules = {
  taskId: [
    { required: true, message: "任务ID不能为空", trigger: "blur" }
  ],
  machineId: [
    { required: true, message: "机械ID不能为空", trigger: "blur" }
  ],
  machineCount: [
    { required: true, message: "机械数量不能为空", trigger: "blur" }
  ],
  workingHours: [
    { required: true, message: "工时不能为空", trigger: "blur" }
  ],
  workingStart: [
    { required: true, message: "开始日期不能为空", trigger: "blur" }
  ],
  workingFinish: [
    { required: true, message: "结束日期不能为空", trigger: "blur" }
  ],
  delFlag: [
    { required: true, message: "删除标志不能为空", trigger: "blur" }
  ]
}

// 查询机械工时列表
const getList = async () => {
  loading.value = true
  try {
    const response = await AgricultureCostMachineService.listMachine(queryParams)
    console.log('API返回的原始数据:', response)
    costMachineList.value = response.rows
    console.log('costMachineList的数据是：', costMachineList.value)
    total.value = response.total
    console.log('总数据量:', total.value)
  } finally {
    loading.value = false
  }
}

// 查询机械列表
const getMachineInfList = async () => {
  const response = await AgricultureMachineService.listMachine({ pageSize: 9999 })
  console.log('机械列表原始数据:', response)
  machineInfoList.value = response.rows.filter(item => item.delFlag === "0")
  console.log('过滤后的机械列表:', machineInfoList.value)
  console.log('机械列表中的 machineId 类型:', machineInfoList.value.map(item => typeof item.machineId))
}

// 添加任务日志
const addLog = async (data: any) => {
  return await AgricultureTaskLogService.addLog({
    ...data,
    // 要设置为整数类型，否则删除之后报错
    createBy: 1,
    updateBy: 1
  })
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 表单重置
const reset = () => {
  Object.assign(form, {
    costId: null,
    taskId: props.taskId,
    machineId: null,
    machineCount: null,
    workingHours: null,
    workingStart: null,
    workingFinish: null,
    remark: null,
    status: "0",
    orderNum: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    delFlag: null
  })
  formRef.value?.resetFields()
}

// 新增按钮操作
const handleAdd = () => {
  reset()
  open.value = true
  title.value = "添加机械工时"
}

// 修改按钮操作
const handleUpdate = async (row: AgricultureCostMachineResult) => {
  reset()
  const costId = row.costId
  const response = await AgricultureCostMachineService.getMachine(costId)
  Object.assign(form, response.data)
  open.value = true
  title.value = "修改机械工时"
}

// 提交按钮
const submitForm = async () => {
  await formRef.value.validate()
  try {
    // 确保create_by为整数类型
    const submitData = {
      ...form,
      createBy: form.createBy ? parseInt(form.createBy) : null
    }

    if (form.costId != null) {
      await AgricultureCostMachineService.updateMachine(submitData)
      ElMessage.success("修改成功")
      await addTaskLog("修改机械工时")
    } else {
      await AgricultureCostMachineService.addMachine(submitData)
      ElMessage.success("新增成功")
      await addTaskLog("新增机械工时")
    }
    open.value = false
    getList()
  } catch (error) {
    console.error(error)
  }
}

// 删除按钮操作
const handleDelete = async (row: AgricultureCostMachineResult) => {
  const costIds = row.costId
  try {
    await ElMessageBox.confirm('是否确认删除机械工时编号为"' + costIds + '"的数据项？')
    await AgricultureCostMachineService.deleteMachine(costIds)
    getList()
    ElMessage.success("删除成功")
    await addTaskLog("删除机械工时")
  } catch (error) {
    console.error(error)
  }
}

// 插入任务日志
const addTaskLog = async (des: string) => {
  await addLog({
    taskId: props.taskId,
    operDes: des,
    operName: props.currentUser.userName,
    operId: props.currentUser.userId,
    createBy: props.currentUser.userId,
    updateBy: props.currentUser.userId
  })
  emit('log')
}

onMounted(() => {
  getList()
  getMachineInfList()
})
</script>

<style scoped>
.padding-bottom-10 {
  padding-bottom: 10px;
}

.margin-top-10 {
  margin-top: 10px;
}

.w100 {
  width: 100%;
}

.display-block {
  display: block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

