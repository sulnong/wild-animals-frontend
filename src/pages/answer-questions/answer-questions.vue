<template>
	<view class="container">
		<view class="avatar-container">
			<u-avatar :src="userInfo.headimgurl" size="large"></u-avatar>
			<text style="margin-left: 20rpx;">你好， {{userInfo.nickname}}</text>
		</view>
		<view v-for="(item, index) in questions" :key="index" v-show="index == curIndex" class="question-container">

				<view  class="question-content">
					{{index + 1}}. {{ '  ' + item.content}}
				</view>
				<view v-for="(op, op_index) in item.options" :key="op_index" 
        class="question-op"
        :class="{'question-op-selected': op_index === curSelect, 
        'question-op-selected-error': (item.options[op_index].label != item.answer.label) && op_index === curSelect && !isCorrect}"
        @click="selectOption(op_index)">
					{{op.label}} : {{op.content}}
				</view>
		</view>
		<view class="btn-container">
			<button v-if="!ifShowResult" @click="confirmSelect" class="btn-next">确认</button>
			<button v-else @click="nextQuestion" class="btn-next">下一题</button>
		</view>
    <view v-show="ifShowResult" class="result" :class="isCorrect ? 'result-success' : 'result-error' ">
      <view v-if="isCorrect">
        恭喜您答对啦
      </view>
      <view v-else>
        很抱歉, 您答错了, 正确答案是 {{ curQuestion.data.answer.label }}
      </view>
    </view>
	</view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { cloud } from '../../../src/api/cloud'
import { useUserStore } from '../../store/user'


interface wd_option {
	label: String
	content: String
}
interface wd_questions {
	type: String,
	content: String
	options: [wd_option],
	answer: wd_option
}

let questions = ref<[wd_questions]>([] as any)          // 所有问题, 共 5 道题
let curIndex = ref(0)                                   // 当前题号
let curQuestion = reactive({data: {}})     // 当前问题
let curSelect = ref(-1)                                 // 当前选择的选项编号
let curSelectOption = reactive<wd_option>({} as any)    // 当前选项
let ifShowResult = ref(false)                           // 控制是否展示答题结果, 用于确认按钮之后
let isCorrect = ref(true)                               // 判断是否答对
let correctNums = ref(0)                                // 统计总共答对了几道题
let userInfo = ref(useUserStore().getUserInfo())

// 勾选答案
function selectOption(op_index: number) {
  if (ifShowResult.value) { return }
  curSelect.value = op_index
  curSelectOption = curQuestion.data.options[op_index]
  console.log('当前选择答案: ', curSelectOption)
  console.log('当前问题', curQuestion.data.content, ';', '正确答案: ', curQuestion.data.answer.label)
}

// 确认答案
function confirmSelect() {
  if (curSelect.value == -1) {
    uni.showToast({
      icon:'error', title: '您必须先选择答案'
    })
    return
  }
  ifShowResult.value = true
  // 判断是否答对，更新界面
  if (curQuestion.data.answer.label == curSelectOption.label) {
    isCorrect.value = true
    ++correctNums.value
  } else {
    isCorrect.value = false
  }
  console.log(`累计答对 ${correctNums.value} 道题`)
}

function nextQuestion() {
  ifShowResult.value = false
  isCorrect.value = true
	if (curIndex.value === 4) {
		// 最后一题了，这个时候跳转结算页面
		uni.showToast({
			title: '即将跳转结算页面'
		})
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/result/result'
      })
    }, 1500)
	} else {
		++curIndex.value
    curQuestion.data = questions.value[curIndex.value]
    curSelect.value = -1 // 重置为-1, 前端不默认勾选
	}
}

onLoad(async () => {
	const {err, err_msg, data } = await cloud.invoke('Get-Questions', {})
	if (err != 0) {
		uni.showToast({
			icon: 'error',
			duration: 2000,
			title: 'Get questions failed.'
		})
		return
	}
	questions.value = data
  curQuestion.data = data[0]
	console.log('questions: ', questions.value)
})
</script>

<style lang="less">
.container {
	width: 100vw;
	height: 100vh;
	background-image: url("../../static/background.jpeg");
	background-size: cover;
	background-position: top;
	background-repeat: no-repeat;
	background-attachment: fixed;
	display: flex;
	flex-direction: column;
	
	.avatar-container {
		margin: 60rpx 0 30rpx 60rpx;
		font-size: 40rpx;
		display: flex;
		align-items: center;
	}
	
	.question-container {
		margin: 0 30rpx 40rpx 30rpx;
		font-size: 38rpx;
		
		.question-content {
			font-size: 40rpx;
			margin-bottom: 30rpx;
			background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
			border-radius: 20rpx;
			padding-left: 20rpx;
			display: flex;
			align-items: center;
      min-height: 90rpx;
		}
		
		.question-op {
			margin: 12rpx 30rpx 0 30rpx;
			padding-left: 20rpx;
			background-color: white;
			border-radius: 10rpx;
			height: 100rpx;
			color: black;
			display: flex;
			align-items: center;
		}
    
    .question-op-selected {
      background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    }
    
    .question-op-selected-error {
      background-image: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);
    }
	}
	
  .result {
    margin: 20rpx 60rpx 0 60rpx;
    padding-left: 20rpx;
    background-color: white;
    border-radius: 10rpx;
    height: 100rpx;
    color: black;
    display: flex;
    align-items: center;
  }
  .result-success {
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  }
  
  .result-error {
    background-image: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);
  }
  
	.btn-container {
		display: flex;
		align-items: center;
		.btn-next {
			width: 50vw;
			background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
		}
	}
	
	
}
</style>
