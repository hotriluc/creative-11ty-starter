import * as THREE from "three";

import vertexShader from "../shaders/sketch/vertex.glsl";
import fragmentShader from "../shaders/sketch/fragment.glsl";

export default class Canvas {
  canvas: HTMLCanvasElement;

  renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;

  time = 0.0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.createRenderer();
    this.createCamera();
    this.createScene();

    // Add objects to the scene
    this.addObjects();

    // Events
    this.onResize();
    this.update();
    this.bindEvents();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Setup the camera
  createCamera() {
    this.camera = new THREE.PerspectiveCamera();
    this.camera.fov = 45;
    this.camera.position.z = 600;
    this.camera.far = 1000;
    this.camera.near = 10;
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  addObjects() {
    const geometry = new THREE.PlaneGeometry(500, 500);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: { uColor: { value: new THREE.Color("#c0cfb2") } },
    });

    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
  }

  // Main tick from where we invoke other components to update
  update() {
    this.time += 0.015;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update.bind(this));
  }

  // Event Handlers
  onResize() {
    const { screen } = window.APP.ScreenManager;

    // recalculate viewport sizes
    this.renderer.setSize(screen.width, screen.height);

    // make 1px = 1 webgl unit
    this.camera.fov =
      2 *
      (Math.atan((screen.height * 0.5) / this.camera.position.z) *
        (180 / Math.PI));
    this.camera.aspect = screen.width / screen.height;

    this.camera.updateProjectionMatrix();
  }

  // Events binding
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
