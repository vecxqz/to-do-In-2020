import { useStore } from "./useStore";

export function userPreview() {
  const store: any = useStore();
  function setCanvasPreview(
    canvasCtxs: Array<CanvasRenderingContext2D>,
    targetcanvasCtx: CanvasRenderingContext2D
  ) {
    // 这里将不同的canvas合到一个canvas上
    const { width, height } = store.state.canvasModule;
    for (let i = 0; i < canvasCtxs.length; i++) {
      const data = canvasCtxs[i].canvas;
      targetcanvasCtx.drawImage(data, 0, 0);
    }
    store.state.canvasModule.previewUrl = targetcanvasCtx.canvas.toDataURL(
      "image/png",
      1
    );
  }

  return {
    setCanvasPreview
  };
}
