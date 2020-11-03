import { bresenhamLine, drawGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useLine(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex].layer
  );
  const { startX, startY, endX, endY } = useMousePosition();

  function mouseDown(this: any, e: MouseEvent) {
    console.log("line mouse move");
  }
  function mouseMove(this: any, e: MouseEvent) {
    console.log(startX.value, startY.value, endX.value, endY.value);
    bresenhamLine(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
      }
    );
  }
  function mouseUp(this: any, e: MouseEvent) {
    console.log(startX.value, startY.value, endX.value, endY.value);
    bresenhamLine(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
        store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
          columnIndex,
          rowIndex,
          data: {
            color: color.value
          }
        });
      }
    );
  }

  return { mouseDown, mouseMove, mouseUp };
}
