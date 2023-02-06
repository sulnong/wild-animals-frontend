<template>
	<view class="container">
		<view class="avatar-container">
			{{userInfo.nickname}}
		</view>
		<view v-for="(item, index) in questions" :key="index" class="question-container">
			<view v-if="index == curIndex" class="ctl-wrapper" >
				<view  class="question-content">
					{{index + 1}}. {{ '  ' + item.content}}: 
				</view>
				<view v-for="(op, op_index) in item.options" :key="op_index">
					{{op.label}} : {{op.content}}
				</view>
			</view>
		</view>
		<view class="btn-container">
			<button @click="nextQuestion">下一题</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
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

const userInfo = ref(useUserStore().userInfo)

let questions = ref<[wd_questions]>()
let curIndex = ref(0)

function nextQuestion() {
	console.log('next question')
	curIndex.value++
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
		border: 2px solid red;
		margin-top: 5vh;
		height: 20vh;
	}
	
	.question-container {
		border: 2px solid red;
		font-size: 48rpx;
	}
	
	
}
</style>
