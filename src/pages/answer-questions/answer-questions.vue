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
				<view v-for="(op, op_index) in item.options" :key="op_index" class="question-op">
					{{op.label}} : {{op.content}}
				</view>
		</view>
		<view class="btn-container">
			<button @click="nextQuestion" class="btn-next">下一题</button>
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
	if (curIndex.value === 4) {
		// 最后一题了，这个时候跳转结算页面
		console.log('跳转结算页面')
		uni.showToast({
			title: '即将跳转结算页面'
		})
	} else {
		curIndex.value++
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
		font-size: 40rpx;
		
		.question-content {
			font-size: 44rpx;
			margin-bottom: 30rpx;
			background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
			border-radius: 20rpx;
			padding-left: 20rpx;
			display: flex;
			align-items: center;
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
