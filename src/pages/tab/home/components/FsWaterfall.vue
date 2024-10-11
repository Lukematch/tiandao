<template>
  <div ref="containerRef" class="fs-waterfall-container"
  @scroll="handleScroll">
    <div class="fs-waterfall-list">
      <div v-if="state.isLoadingNewData && !state.isFinish" class="loading-placeholder">
        <up-skeleton
          rows="26" :animate="true">
        </up-skeleton>
      </div>
      <div class="fs-waterfall-item"
      v-if="state.cardList.length > 0"
      v-for="(item, index) in state.cardList"
      :key="item.id"
      :style="{
        width: `${state.cardWidth}px`,
        height: `${state.cardPos[index].height}px`,
        top: `${state.cardPos[index].y}px`,
        left: `${state.cardPos[index].x}px`,
      }">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
    <div class="empty" v-if="state.isFinish && state.cardList.length <= 0">
      <up-empty class="fs-waterfall-empty" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ICardItem, ICardPos, IWaterFallProps } from '../type';
import { debounce } from 'lodash';
import { waitTime } from '@/utils/common';

// import { defineEmits } from 'vue';

// const emit = defineEmits();

const props = defineProps<IWaterFallProps>()
 // 绑定 template 上的 container，需要容器宽度
const containerRef = ref<HTMLDivElement | null>(null);
const state = reactive({
  // 加载
  loading: false,
  // 判断是否是加载的新数据
  isLoadingNewData: false,
  // 判断是否已经没有数据，后续不再发送请求
  isFinish: false,
  page: 1,
  // 容器内卡片宽度
  cardWidth: 0,
  // 卡片数据源
  cardList: [] as ICardItem[],
  // 卡片摆放位置信息
  cardPos: [] as ICardPos[],
  // 存储每列的高度，进行初始化操作
  columnHeight: new Array(props.column).fill(0) as number[]
});

// 处理最小卡片的高度和数量
// const minColumn = computed(() => {
//   let minIndex = -1,
//     minHeight = Infinity;
//   state.columnHeight.forEach((item, index) => {
//     if (item < minHeight) {
//       minHeight = item;
//       minIndex = index;
//     }
//   })
//   return {
//     minIndex,
//     minHeight
//   }
// })

// 设置卡片数据源
const getCardList = async (page: number, pageSize: number) => {
  if (state.isFinish) return;
  // 使用父组件传递的请求方法
  // 调用父组件传递的页面大小和页码
  state.isLoadingNewData = true; // 开始加载新数据
  const list = await props.request(page, pageSize);
  // const list = await handleData(page, pageSize);
  state.page++;
  if (!list.length) {
    state.isFinish = true;
    return;
  }
  await waitTime(2000)
  state.isLoadingNewData = false; // 加载完成
  state.cardList = [...state.cardList, ...list];
  // key：根据请求的数据计算卡片位置
  computedCardPos(list);
}

const handleScroll = debounce(() => {
  // 获取当前页面的高度
  const { clientHeight } = containerRef.value!;
  // 获取滚动高度
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  // 获取页面总高度
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  // 距底高度=页面总高度-当前页面的高度-滚动高度
  const bottom = scrollHeight - clientHeight - scrollTop;
  // console.log(scrollHeight, clientHeight, scrollTop, bottom);
  // props.bottom为设置的底部高度
  if (bottom <= props.bottom) {
    !state.loading && getCardList(state.page, props.pageSize);
    // console.log('触底了');
  }
}, 100);

const computedCardPos = (list: ICardItem[]) => {
  const startIndex = state.cardPos.length; // 从当前长度开始添加新的位置
  list.forEach((item, index) => {
    const cardHeight = Math.floor((item.height * state.cardWidth) / item.width) + 100;
    const colIndex = (startIndex + index) % props.column; // 计算列索引
    const yPos = state.columnHeight[colIndex]; // 当前列的高度

    state.cardPos.push({
      width: state.cardWidth,
      height: cardHeight,
      x: colIndex * (state.cardWidth + props.gap),
      y: yPos,
    });

    state.columnHeight[colIndex] += cardHeight + props.gap; // 更新列高度
  });
};

const init = () => {
  if (containerRef.value) {
    const containerWidth = containerRef.value?.clientWidth;
    state.cardWidth = (containerWidth - props.gap * (props.column - 1)) / props.column;
    getCardList(state.page, props?.pageSize);
  }
}

onMounted(() => {
  init();
  window.addEventListener('scroll', handleScroll);
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<style lang="scss" scoped>

.fs-waterfall {
  &-container {
    width: 100%;
    height: 100%;
    // overflow-y: auto;
    // overflow-x: hidden;
  }

  &-list {
    width: auto;
    position: relative;
  }

  &-item {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
  }

  &-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}

</style>
