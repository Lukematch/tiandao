<template>
  <view class="app">
    <view class="top">
      <view class="top-search" style="display: flex; align-items: center; justify-content: space-between" :style="{
          background: isHidden ? 'rgba(255, 255, 255, 0.8)' : '#fff',
          backdropFilter: isHidden ? 'blur(10px)' : 'none'
        }">
        <up-icon name="list" :style="{ fontSize: '16px', color: '#f56c6c' }"/>
        <view style="display: flex; align-items: center;" @click="toggleHome">
          <image style="width: 30px; height: 30px;" src="/src/static/logo.png"/>
          小青牛
        </view>
        <view style="position: relative; display: flex; align-items: center;">
          <up-icon
            class="mr-4"
            name="search"
            @click="toggleSearch"
          />
          <up-input
            v-if="isSearchVisible"
            type="text"
            placeholder="请输入"
            :style="{ width: '164px' }"
            @blur="hideSearch"
          />
        </view>
      </view>
      <view class="top-class" :class="{ 'hidden': isHidden }">
        <up-sticky bgColor="#fff">
          <up-tabs :list="classArr"
          @click="clickClass"/>
        </up-sticky>
      </view>
    </view>
    <view ref="containerRef" class="container">
      <fs-waterfall :key="listKey" :bottom="20" :column="2" :gap="0" :page-size="20" :list="list" :request="handleData">
        <template #item="{item}">
          <!-- {{item}} -->
          <view
            class="card-box"
            :style="{
              background: '#f4f5f6',
              boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)'
            }"
          >
          <up-row :span="14" :style="{ display: 'flex', alignItems: 'center' }">
            <img :src="item.url" :style="{ width: '100%', borderRadius: '8px' }" />
          </up-row>
          <up-row :span="6" :style="{ display: 'flex', alignItems: 'center' }">
            <h5>{{ item.title }}</h5>
          </up-row>
          <up-row :span="4" :style="{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
            <view class="card-bottom-left" :style="{ display: 'flex', alignItems: 'center' }">
              <up-avatar :size="25" :src="item?.avatar" class="mr-2"/>
              <span class="mr-5" :style="{ fontSize: '12px', color: '#aaa'}">{{ item?.author }}</span>
            </view>
            <view class="card-bottom-right" :style="{ display: 'flex', alignItems: 'center' }">
              <up-icon name="heart" :style="{ fontSize: '16px', color: '#f56c6c' }"></up-icon>
              <span :style="{ fontSize: '12px', color: '#333', marginLeft: '5px' }">{{ item?.loveNum }}</span>
            </view>
          </up-row>
          </view>
        </template>
      </fs-waterfall>
    </view>
    <up-loading-page :loading="loading" loading-text="loading..."></up-loading-page>
    <up-divider text="下滑获取更多文章..." :dashed="true"></up-divider>
  </view>
  <view class="wrap">
    <up-back-top icon="arrow-up" top="600" duration="500" :scroll-top="scrollTop"></up-back-top>
	</view>
</template>

<script setup lang="ts">
import data1 from "./0data1.json";
// import data2 from "./0data2.json";
import data2 from "./1data.json";
import data3 from "./2data.json";
import FsWaterfall from "./FsWaterfall.vue";
import { ICardItem } from "./type";
import { debounce } from 'lodash';

// const colorArr = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];

/**
 * 分类tabs
 */
const dataSelected = ref<any>(data1);
const classArr = reactive([
  { name: "推荐", value: 0, data: data1},
  { name: "穿搭", value: 1, data: data2},
  { name: "美食", value: 2, data: data3},
  { name: "彩妆", value: 3, data: []},
  { name: "影视", value: 4, data: []},
  { name: "职场", value: 5, data: []},
  { name: "情感", value: 6, data: []},
  { name: "家居", value: 7, data: []},
  { name: "游戏", value: 8, data: []},
  { name: "旅行", value: 9, data: []},
  { name: "健身", value: 10, data: []}
])
const clickClass = (item: any) => {
  dataSelected.value = item.data;
  makeData()
}
/**
 * 页面数据处理
 */
const loading = ref<boolean>(false)
const listKey = ref<number>(0);
const list = ref<ICardItem[]>([])
const makeData = () =>{
  if(dataSelected.value?.data){
    list.value = dataSelected.value?.data.response_body.data.items.map((i: any) => ({
      id: i.id,
      url: i.note_card.cover.info_list[0].url,
      width: i.note_card.cover.width,
      height: i.note_card.cover.height,
      title: i.note_card.display_title,
      avatar: i.note_card.user.avatar,
      author: i.note_card.user.nickname,
      loveNum: i.note_card.interact_info.liked_count,
    }));
  } else {
    list.value = []
  }
  listKey.value++; // 强制更新
}
const handleData = async (page: number, pageSize: number) => {
  return new Promise<ICardItem[]>((resolve) => {
    loading.value = true;
    setTimeout(() => {
      const data = list.value || [];
      resolve(data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
      loading.value = false;
    }, 400);
  });
};

onMounted(()=>{
  makeData()
})


/**
 * 顶部top 滚动事件 点击事件 返回顶部
 */
const isHidden = ref(false);
const scrollTop = ref();
const lastScrollTop = ref(0);

const handleScroll = debounce(() => {
  scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  isHidden.value = scrollTop.value > lastScrollTop.value; // 向下滚动时隐藏
  lastScrollTop.value = scrollTop.value <= 0 ? 0 : scrollTop.value; // 处理移动设备或负滚动
}, 100); // 设置防抖时间

const toggleHome = () => {
  uni.switchTab({
    url: '/pages/tab/user/index'
  })
}

onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
});

const isSearchVisible = ref(false);

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const hideSearch = () => {
  isSearchVisible.value = false;
};

onMounted(() => {
 window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.app {
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  .top {
    width: 100%;
    height: 85px;
    position: relative;
    &-search {
      padding: 0 10px;
      align-items: center;
      height: 40px;
      position: fixed;
      z-index: 9999;
      width: 100%;
      display: flex;
      transition: transform 0.3s; /* 平滑隐藏效果 */
      border-bottom: 1px solid #474849;
    }

    &-class {
      align-items: center;
      height: 45px;
      position: fixed;
      z-index: 9999;
      top: 39px;
      width: 100%;
      display: flex;
      transition: transform 0.3s; /* 平滑隐藏效果 */
      white-space: nowrap; // 防止换行
      overflow-x: auto; // 允许横向滚动
    }

    &-class.hidden {
      transition: transform 0.3s; /* 平滑隐藏效果 */
      // transform: translateY(-100%); /* 向上隐藏 */
      height: 0; /* 隐藏时高度为 0 */
    }
  }

  .container {
    width: 100%;
    // height: 100vh;
    height: calc(100vh - 85px);
    // border: 1px solid red;
  }
  .card-box {
    position: relative;
    width: 95%;
    height: 100%;
    // max-height: auto;
    border-radius: 5px;
    margin: 0 5px 0 5px;
    // &::hover {
    //   cursor: pointer;
    //   box-shadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
    // }
    img {
      margin-bottom: 10px;
      width: auto;
      height: auto;
      object-fit: cover; // 确保图片按比例缩放
    }
  }
}
</style>
