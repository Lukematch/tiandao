<template>
  <view>
    <view class="login-form-wrap">
      <view class="title">
        欢迎登录
      </view>
      <input v-model="tel" class="u-border-bottom" type="number" placeholder="请输入用户名">
      <view class="u-border-bottom my-40rpx flex">
        <input v-model="code" class="flex-1" type="number" placeholder="请输入密码">
        <view>
          <!-- <u-code ref="uCodeRef" @change="codeChange" /> -->
          <!-- <u-button :text="tips" type="success" size="mini" @click="getCode" /> -->
        </view>
      </view>
      <button class="login-btn" :class="linearGradient" :style="[inputStyle]" @tap="submit">
        登录
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { createGradientClass } from 'mini-ground';
// import { useUserStore } from '@/store';

// const userStore = useUserStore();
const tel = ref<string>('18502811111');
const code = ref<string>('1234');
const linearGradient = createGradientClass('45deg', '#16c8c8', 'orange');

const inputStyle = computed<CSSProperties>(() => {
  const style = {} as CSSProperties;
  if (tel.value && code.value) {
    style.color = '#fff';
    style.backgroundColor = uni.$u.color.warning;
  }
  return style;
});

async function submit() {
  if (!uni.$u.test.mobile(Number(tel.value))) {
    uni.$u.toast('请输入正确的用户名');
    return;
  }
  if (!code.value) {
    uni.$u.toast('请输入密码');
    return;
  }
  // 登录请求
  // const res = await userStore.login({ phone: tel.value, code: code.value }).catch(() => {
  //   uni.$u.toast('登录失败');
  // });
  // if (!res) return;
  // setToken('1234567890');
  uni.reLaunch({ url: '/pages/tab/home/index' });
}
</script>

<style lang="scss" scoped>
.login-form-wrap {
  @apply mt-80rpx mx-auto mb-0 w-600rpx;

  .title {
    @apply mb-100rpx text-60rpx text-left font-500;
  }

  input {
    @apply pb-6rpx mb-10rpx text-left;
  }

  .tips {
    @apply mt-8rpx mb-60rpx;

    color: $u-info;
  }

  .login-btn {
    @apply flex items-center justify-center py-12rpx px-0 text-30rpx bg-#fdf3d0 border-none;
    cursor: pointer;
    // color: $u-tips-color;

    &::after {
      @apply border-none;
    }
  }

  .alternative {
    @apply flex justify-between mt-30rpx;

    color: $u-tips-color;
  }
}

.login-type-wrap {
  @apply flex justify-between pt-350rpx px-150rpx pb-150rpx;

  .item {
    @apply flex items-center flex-col text-28rpx;

    color: $u-content-color;
  }
}

.hint {
  @apply px-40rpx py-20rpx text-20rpx;

  color: $u-tips-color;

  .link {
    color: $u-warning;
  }
}
</style>
