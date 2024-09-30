<template>
  <view class="page-wrap">
    <!-- <u-navbar title="" placeholder left-icon="" right-icon="camera-fill" /> -->
    <view class="flex items-center bg-white pb-30rpx pl-30rpx pr-20rpx mt-60rpx">
      <view class="mr-10rpx">
        <u-avatar shape="square" src="/src/static/images/logo.png" size="70" class="mr-20rpx"/>
      </view>
      <view class="flex-1">
        <view class="pb-20rpx font-size-36rpx">
          老牛不吃草
        </view>
        <view class="u-tips-color font-size-28rpx" @click="toCopy">
          微信号：1234567890
        </view>
      </view>
      <view class="ml-10rpx p-10rpx">
        <u-icon name="scan" color="#969799" />
      </view>
      <view class="ml-10rpx p-10rpx">
        <u-icon name="arrow-right" color="#969799" />
      </view>
    </view>

    <view class="mt-20rpx bg-white">
      <u-cell-group>
        <u-cell icon="rmb-circle" title="支付" is-link />
      </u-cell-group>
    </view>

    <view class="mt-20rpx bg-white">
      <u-cell-group>
        <u-cell icon="star" title="收藏" is-link />
        <u-cell icon="photo" title="相册" is-link />
        <u-cell icon="coupon" title="卡券" is-link />
        <u-cell icon="heart" title="关注" is-link />
      </u-cell-group>
    </view>

    <view class="mt-20rpx bg-white">
      <u-cell-group>
        <u-cell icon="setting" title="设置" is-link />
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useClipboard } from '@/hooks';

const { setClipboardData, getClipboardData } = useClipboard();

// 复制
const toCopy = async () => {
  await setClipboardData({ data: '1234567890' });
  const data = await getClipboardData();
  console.log('[ data ] >', data);
};
</script>
