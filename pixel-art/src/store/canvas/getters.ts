import { GetterTree } from "vuex";
import { CanvasState } from "./type";
import { RootState } from "../type";

const CanvasGetters: GetterTree<CanvasState, RootState> = {
  currentGridMeta: (state: CanvasState): cell => {
    const {
      pages,
      currentPageIndex,
      currentLayerIndex,
      currentColumnIndex,
      currentRowIndex
    } = state;
    let cell: cell | object;
    if (pages[currentPageIndex]?.layers) {
      if (pages[currentPageIndex].layers[currentLayerIndex]) {
        cell =
          pages[currentPageIndex].layers[currentLayerIndex].layer[
            currentColumnIndex
          ][currentRowIndex];
      } else {
        cell = {};
      }
    } else {
      cell = {};
    }
    return cell as cell;
  }
};

export { CanvasGetters };
