import "@styles/styles.scss";

import Canvas from "@app/components/Canvas";
import ScreenManager from "@app/core/ScreenManager";
import ScrollManager from "@app/core/ScrollManager";

interface IApp {
  Canvas: Canvas;
  ScreenManager: ScreenManager;
  ScrollManager: ScrollManager;
}

declare global {
  interface Window {
    APP: IApp;
  }
}
const APP = window.APP || {};

const initApp = () => {
  window.APP = APP;

  APP.ScreenManager = new ScreenManager();
  APP.ScrollManager = new ScrollManager();
  APP.Canvas = new Canvas(
    document.querySelector<HTMLCanvasElement>(".canvas")!
  );
};

initApp();
