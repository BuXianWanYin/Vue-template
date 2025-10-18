<template>
    <span :class="['typewriter', { 'typing-complete': isComplete }]">{{ displayText }}</span>
</template>

<script setup lang="ts">

const emit = defineEmits(['update'])

const props = defineProps<{
    text: string
    delay?: number
    startDelay?: number
}>()

const displayText = ref('')
const isComplete = ref(false)
let timer: any = null

const typeText = async () => {
    isComplete.value = false
    displayText.value = ''
    if (props.startDelay) {
        await new Promise(resolve => setTimeout(resolve, props.startDelay))
    }
    
    for (let i = 0; i <= props.text.length; i++) {
        displayText.value = props.text.slice(0, i)
        await new Promise(resolve => setTimeout(resolve, props.delay || 30))
        emit('update')
    }
    
    // 打字完成后设置状态
    isComplete.value = true
}

watch(() => props.text, (newVal) => {
    displayText.value = ''
    if (timer) clearInterval(timer)
    let i = 0
    timer = setInterval(() => {
        if (i < newVal.length) {
            displayText.value += newVal[i++]
            emit('update')
        } else {
            clearInterval(timer)
        }
    }, props.delay || 30)
})

onMounted(() => {
    typeText()
})
</script>

<style scoped>
.typewriter {
    /* 去除光标 */
    /* border-right: 2px solid transparent; */
    /* animation: cursor 0.8s infinite; */
    white-space: pre-wrap;
    word-break: break-word;
}

.typing-complete {
    /* border-right: none; */
    /* animation: none; */
}

/* 删除光标动画 */
/*
@keyframes cursor {
    0%, 100% { border-color: transparent; }
    50% { border-color: currentColor; }
}
*/
</style> 