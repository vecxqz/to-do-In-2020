import { drawGridB, clearGridB, bresenhamLine } from "../util/canvas";
import { computed, reactive, ref } from "vue";
import { useStore } from "./useStore";
export function useMirrorPencil(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const width = computed(() => store.state.canvasModule.width);
  const shadowLayerCanvasCtx = computed(
    () => store.state.canvasModule.shadowLayerCanvasCtx
  );
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex].layer
  );
  const mode = ref("pen");
  const mouseMoveStart = reactive({
    lastX: 0,
    lastY: 0,
    currentX: 0,
    currentY: 0
  });

  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const mirrorColumnIndex = width.value - columnIndex - 1;
    if (e.button === 0) {
      mode.value = "pen";
      drawGridB(canvasCtx.value, {
        columnIndex,
        rowIndex,
        color: color.value,
        size: 1
      });
      drawGridB(canvasCtx.value, {
        columnIndex: mirrorColumnIndex,
        rowIndex,
        color: color.value,
        size: 1
      });
    }
    if (e.button === 2) {
      mode.value = "clear";
      clearGridB(canvasCtx.value, {
        columnIndex,
        rowIndex,
        size: 1
      });
      clearGridB(canvasCtx.value, {
        columnIndex: mirrorColumnIndex,
        rowIndex,
        size: 1
      });
    }
    mouseMoveStart.lastX = columnIndex;
    mouseMoveStart.lastY = rowIndex;
  }

  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const mirrorColumnIndex = width.value - columnIndex - 1;
    mouseMoveStart.currentX = columnIndex;
    mouseMoveStart.currentY = rowIndex;
    if (mode.value === "pen") {
      // 如果是缓慢移动鼠标就不使用布雷森汉姆直线算法
      if (
        Math.abs(mouseMoveStart.lastX - mouseMoveStart.currentX) <= 1 &&
        Math.abs(mouseMoveStart.lastY - mouseMoveStart.currentY) <= 1
      ) {
        drawGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
        drawGridB(canvasCtx.value, {
          columnIndex: mirrorColumnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
      } else {
        bresenhamLine(
          mouseMoveStart.lastX,
          mouseMoveStart.lastY,
          mouseMoveStart.currentX,
          mouseMoveStart.currentY,
          (columnIndex: number, rowIndex: number) => {
            const mirrorColumnIndex = width.value - columnIndex - 1;
            drawGridB(canvasCtx.value, {
              columnIndex,
              rowIndex,
              color: color.value,
              size: 1
            });
            drawGridB(canvasCtx.value, {
              columnIndex: mirrorColumnIndex,
              rowIndex,
              color: color.value,
              size: 1
            });
          }
        );
      }
    }
    if (mode.value === "clear") {
      // 如果是缓慢移动鼠标就不使用布雷森汉姆直线算法
      if (
        Math.abs(mouseMoveStart.lastX - mouseMoveStart.currentX) <= 1 &&
        Math.abs(mouseMoveStart.lastY - mouseMoveStart.currentY) <= 1
      ) {
        clearGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          size: 1
        });
        clearGridB(canvasCtx.value, {
          columnIndex: mirrorColumnIndex,
          rowIndex,
          size: 1
        });
      } else {
        bresenhamLine(
          mouseMoveStart.lastX,
          mouseMoveStart.lastY,
          mouseMoveStart.currentX,
          mouseMoveStart.currentY,
          (columnIndex: number, rowIndex: number) => {
            const mirrorColumnIndex = width.value - columnIndex - 1;
            clearGridB(canvasCtx.value, {
              columnIndex,
              rowIndex,
              size: 1
            });
            clearGridB(canvasCtx.value, {
              columnIndex: mirrorColumnIndex,
              rowIndex,
              size: 1
            });
          }
        );
      }
    }
    mouseMoveStart.lastX = columnIndex;
    mouseMoveStart.lastY = rowIndex;
  }
  function mouseUp(this: any, e: MouseEvent) {
    console.log("pencil mouseUp");
    mouseMoveStart.currentX = 0;
    mouseMoveStart.currentY = 0;
    mouseMoveStart.lastX = 0;
    mouseMoveStart.lastY = 0;
  }
  return { mouseDown, mouseMove, mouseUp };
}
