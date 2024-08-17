import {
  Renderer,
  Camera,
  Transform,
  OGLRenderingContext,
  Program,
  Mesh,
  Color,
  Plane,
} from "ogl";

import vertexShader from "@app/shaders/sketch/vertex.glsl";
import fragmentShader from "@app/shaders/sketch/fragment.glsl";

export default class Canvas {
  canvas: HTMLCanvasElement;

  renderer!: Renderer;
  gl!: OGLRenderingContext;
  camera!: Camera;
  scene!: Transform;

  time = 0.0;
  mesh!: Mesh;
  program: Program | null = null;

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

  // Setup Renderer and GL Context
  createRenderer() {
    this.renderer = new Renderer({
      canvas: this.canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    this.gl = this.renderer.gl;
  }

  // Setup the camera
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 600;
    this.camera.perspective({ far: 1000, near: 10 });
  }

  // Setup the scene
  createScene() {
    this.scene = new Transform();
  }

  addObjects() {
    const geometry = new Plane(this.gl, { height: 500, width: 500 });
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uColor: { value: new Color("#c0cfb2") },
      },
    });

    console.log(this.program);

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
    this.mesh.setParent(this.scene);
  }

  // Main tick from where we invoke other components to update
  update() {
    // t?: number
    this.time += 0.015;

    // this.mesh.rotation.y += 0.03 / 20;

    this.renderer.render({ scene: this.scene, camera: this.camera });
    window.requestAnimationFrame(this.update.bind(this));
  }

  // Event Handlers
  onResize() {
    const { screen } = window.APP.ScreenManager;

    // Recalculate viewport sizes
    this.renderer.setSize(screen.width, screen.height);

    // make 1px = 1 webgl unit
    this.camera.fov =
      2 *
      (Math.atan((screen.height * 0.5) / this.camera.position.z) *
        (180 / Math.PI));
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });
  }

  // Events binding
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
