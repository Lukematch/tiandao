<template>
  <div ref="containerRef" class="fs-waterfall-container">
    <div class="fs-waterfall-list">
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
      <up-empty class="empty" v-else mode="list"></up-empty>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ICardItem, ICardPos, IWaterFallProps } from './type';

const props = defineProps<IWaterFallProps>()
 // 绑定 template 上的 container，需要容器宽度
const containerRef = ref<HTMLDivElement | null>(null);
const state = reactive({
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

const minColumn = computed(() => {
  let minIndex = -1,
    minHeight = Infinity;
  state.columnHeight.forEach((item, index) => {
    if (item < minHeight) {
      minHeight = item;
      minIndex = index;
    }
  })
  return {
    minIndex,
    minHeight
  }
})

const getCardList = async (page: number, pageSize: number) => {
  if (state.isFinish) return;
  const list = await props.request(page, pageSize);
  // const list = await handleData(page, pageSize);
  state.page++;
  if (!list.length) {
    state.isFinish = true;
    return;
  }
  state.cardList = [...state.cardList, ...list];
  // key：根据请求的数据计算卡片位置
  computedCardPos(list);
}

const computedCardPos = (list: ICardItem[]) => {
  list.forEach((item, index) => {
    const cardHeight = Math.floor((item.height * state.cardWidth) / item.width) + 100;
    if (index < props.column) {
      state.cardPos.push({
        width: state.cardWidth,
        height: cardHeight,
        x: index ? index * (state.cardWidth + props.gap) : 0,
        y: 0,
      });
      state.columnHeight[index] = cardHeight + props.gap;
    } else {
      const { minIndex, minHeight } = minColumn.value;
      state.cardPos.push({
        width: state.cardWidth,
        height: cardHeight,
        x: minIndex * (state.cardWidth + props.gap),
        y: minHeight,
      });
      state.columnHeight[minIndex] += cardHeight + props.gap;
    }
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
})

</script>

<style lang="scss" scoped>

.fs-waterfall {

  &-container {
    width: 100%;
    height: 100%;
    // overflow-y: scroll;
    // overflow-x: hidden;
  }

  &-list {
    width: 100%;
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
