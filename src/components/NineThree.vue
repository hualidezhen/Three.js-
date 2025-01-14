<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// vue 不要DOM
const containerRef = ref(null);
let controls = null;
let wheels = [];
let carBody, frontCar, hoodCar, glassCar;
// 透视相机
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1, // 最近距离
  3000 // 最远距离
);
camera.position.set(200, 200, 200); // 相机位置

// scene
const scene = new THREE.Scene();

// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

// 3D 高性能绘图在web 端的实现  OPENGL
// WebGL 是OPENGL 在web 端的实现
// 还是太底层 ， three.js webgl 封装库
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true, //透明背景
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);

// const percentDiv = document.getElementById("per"); // 获取进度条元素
// percentDiv.style.width = 0.8 * 400 + "px"; //进度条元素长度
// percentDiv.style.textIndent = 0.8 * 400 + 5 + "px"; //缩进元素中的首行文本
// percentDiv.innerHTML = "80%"; //进度百分比

const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

onMounted(() => {
  containerRef.value.appendChild(renderer.domElement);
  // renderer.setClearColor("#000");
  // scene.background = new THREE.Color(0xffffff);
  // scene.environment = new THREE.Color(0xffffff);
  render();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  //网格地面 比例大小的参照物
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
  //引入加载器
  const loader = new GLTFLoader(); //模型加载器
  const dracoLoader = new DRACOLoader(); //模型解压的编译器
  dracoLoader.setDecoderPath("../../public/roadSter/draco/gltf/");
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "../../public/externalModel/vehicle-animate-hose-length.glb",
    (gltf) => {
      const bmw = gltf.scene;
      bmw.traverse((obj) => {
        // console.log(obj);
      });
      //遍历模型
      scene.add(bmw);
      //加载灯光
      const light1 = new THREE.DirectionalLight(0xfffff, 0.5);
      light1.position.set(0, 0, 10);
      scene.add(light1);
      const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
      light2.position.set(0, 0, -10);
      scene.add(light2);
      const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
      light3.position.set(10, 0, 0);
      scene.add(light3);
      const light4 = new THREE.DirectionalLight(0xffffff, 0.5);
      light4.position.set(-10, 0, 0);
      scene.add(light4);
      const light5 = new THREE.DirectionalLight(0xffffff, 0.5);
      light5.position.set(0, 10, 0);
      scene.add(light5);
      const light6 = new THREE.DirectionalLight(0xffffff, 0.5);
      light6.position.set(5, 10, 0);
      scene.add(light6);
      const light7 = new THREE.DirectionalLight(0xffffff, 0.5);
      light7.position.set(0, 10, 5);
      scene.add(light7);
      const light8 = new THREE.DirectionalLight(0xffffff, 0.5);
      light8.position.set(0, 10, -5);
      scene.add(light8);
      const light9 = new THREE.DirectionalLight(0xffffff, 0.5);
      light9.position.set(-5, 10, 0);
      scene.add(light9);
      // 加载完成隐藏进度条
      document.getElementById("progress").style.display = "none";
    },
    (xhr) => {
      // 加载过程回调
      console.log(xhr);
      const percentDiv = document.getElementById("per"); // 获取进度条元素
      const percent = xhr.loaded / xhr.total;
      // console.log('加载进度' + percent);
      percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
      percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文本
      // Math.floor:小数加载进度取整
      percentDiv.innerHTML = Math.floor(percent * 100) + "%"; //进度百分比
    }
  );

  const geometry = new THREE.PlaneGeometry(512, 512); //完整贴图
  /**纹理坐标0~1之间随意定义*/
  const uvs = new Float32Array([
    0,
    0, //图片左下角
    1,
    0, //图片右下角
    1,
    1, //图片右上角
    0,
    1, //图片左上角
  ]);
  geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

  //纹理贴图加载器TextureLoader
  const texLoader = new THREE.TextureLoader();
  // .load()方法加载图像，返回一个纹理对象Texture
  const texture = texLoader.load("../../public/chartLet/textureMin.jpg");

  var lambertMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide, //两面可见
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture, //map表示材质的颜色贴图属性
  });
  var mesh = new THREE.Mesh(geometry, lambertMaterial); //慢反射网格模型对象Mesh
  mesh.rotateX(Math.PI / 2);
  mesh.position.set(0, -12, 0);
  scene.add(mesh);

  // const fbxLoader = new FBXLoader();
  // fbxLoader.load("../../public/externalModel/earth.FBX", (gltf) => {
  //   var geometry = new THREE.BufferGeometry(gltf.children[0]);
  //   var lambertMaterial = new THREE.MeshLambertMaterial({
  //     color: 0xff0000, //0xff0000设置材质颜色为红色
  //   });
  //   var mesh = new THREE.Mesh(geometry, lambertMaterial); //高光网格模型对象Mesh
  //   camera.position.set(5, 5, 5); // 相机位置
  //   scene.add(gltf.children[0]);
  // });
  //   //环境光:没有特定方向，整体改变场景的光照明暗
  // const ambient = new THREE.AmbientLight(0xffffff, 1);
  // ambient.position.set(1000,1000,1000)
  // scene.add(ambient);
});
</script>

<template>
  <div class="container" ref="containerRef">
    <!-- 进度条 -->
    <div id="progress">
      <div id="per"></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.progress {
  position: relative;
  width:100%;
  height:100%
}
#per {
  position: absolute;
  inset: 0px;
  height: 20px;
  width: 200px;
  margin: auto;
  background: #339cf1;
  color: #333;
  line-height: 15px;
}
</style>
