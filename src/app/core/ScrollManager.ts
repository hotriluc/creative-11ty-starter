import Lenis from "lenis";

export default class ScrollManager {
  lenis: Lenis;
  scroll: number = 0;

  constructor() {
    this.lenis = new Lenis();
    this.lenis.on("scroll", this.onScroll);
    this.lenis.start();

    this.raf(0);
  }

  onScroll = () => {
    console.log("hello");
    // Handle scroll events here
    // Update your components or state based on scroll position
  };

  destroy = () => {
    this.lenis.destroy();
  };

  raf = (time: number) => {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf);
  };
}
