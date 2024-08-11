import { ISizes } from "../../interfaces/Sizes.interface";

export default class ScreenManager {
  screen: ISizes = {
    width: 0,
    height: 0,
  };

  constructor() {
    this.onResize();
    this.bindEvents();
  }

  onResize() {
    console.log("the screen has been resized");
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }
}
