<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js';

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

// vue 不要DOM 通过ref
const containerRef = ref(null);
let controls = null; //相机控制器对象
// 透视相机
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1, // 最近距离
  1500 // 最远距离
);

//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(50, 50, 50);
// // SphereGeometry：球体
// const geometry = new THREE.SphereGeometry(50);
// // CylinderGeometry：圆柱
// const geometry = new THREE.CylinderGeometry(50,50,100);
// // PlaneGeometry：矩形平面
// const geometry = new THREE.PlaneGeometry(100,50);
// // CircleGeometry：圆形平面
// const geometry = new THREE.CircleGeometry(50);



//创建一个材质对象Material 基础材质不受光源印象
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
//   side: THREE.FrontSide, //默认只有正面可见
  side: THREE.DoubleSide, //两面可见
});

// 创建一个漫反射网络材质
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
//   side: THREE.FrontSide, //默认只有正面可见
side: THREE.DoubleSide, //两面可见
});

// 创建一个高光网络材质
const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444, //高光部分的颜色
});

// 两个参数分别为几何体geometry、材质material
// const mesh = new THREE.Mesh(geometry, basicMaterial); //基础网格模型对象Mesh
// const mesh = new THREE.Mesh(geometry, lambertMaterial); //漫反射网格模型对象Mesh
const mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(0, 0, 0);

// 相机位置xyz坐标：2, 2, 3
camera.position.set(100, 100, 150);

// scene 场景
const scene = new THREE.Scene();

scene.add(mesh);
/************************************************************/ 
// // 随机创建大量的模型,测试渲染性能
// const num = 1000; //控制长方体模型数量
// for (let i = 0; i < num; i++) {
//     const geometry = new THREE.BoxGeometry(5, 5, 5);
//     const material = new THREE.MeshLambertMaterial({
//         color: 0x00ffff
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     // 随机生成长方体xyz坐标
//     const x = (Math.random() - 0.5) * 200
//     const y = (Math.random() - 0.5) * 200
//     const z = (Math.random() - 0.5) * 200
//     mesh.position.set(x, y, z)
//     scene.add(mesh); // 模型对象插入场景中
// }
/************************************************************/ 


// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

// //点光源
// const pointLight = new THREE.PointLight(0xffffff, 1.0);
// pointLight.position.set(0, 50, 0);//点光源放置位置

// // // 点光源辅助观察
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
// scene.add(pointLightHelper);

// //环境光:没有特定方向，整体改变场景的光照明暗
// const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// scene.add(ambient);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
// directionalLight.position.set(100, 100, 100);
// 对比不同入射角，mesh表面对光照的反射效果
// directionalLight.position.set(100, 0, 0);
// directionalLight.position.set(0, 100, 0);
// directionalLight.position.set(100, 100, 100);
directionalLight.position.set(100, 60, 50);
//directionalLight.target默认指向坐标原点
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);

// DirectionalLightHelper：可视化平行光
// const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
// scene.add(dirLightHelper);

// render 渲染器
const renderer = new THREE.WebGLRenderer();
console.log(window.innerWidth);

renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);

//网格地面 比例大小的参照物
const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

renderer.setClearColor("#000");
scene.background = new THREE.Color(0xffffff);
scene.environment = new THREE.Color(0xffffff);

// 渲染循环
var clock = new THREE.Clock();

const render = () => {
  const spt = clock.getDelta() * 1000; //毫秒
//   console.log("两帧渲染时间间隔(毫秒)", spt);
//   console.log("帧率FPS", 1000 / spt);
  stats.update();
  renderer.render(scene, camera); //执行渲染操作
  // 重置渲染器输出画布canvas尺寸
  renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);
  // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
  mesh.rotateY(0.01); //每次绕y轴旋转0.01弧度
  requestAnimationFrame(render);
};

//创建stats对象
const stats = new Stats();
stats.setMode(0);//默认模式
onMounted(() => {
containerRef.value.appendChild(renderer.domElement);
containerRef.value.appendChild(stats.domElement);
  render();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
  //   controls.addEventListener("change", function () {
  //     renderer.render(scene, camera); //执行渲染操作
  //   }); //监听鼠标、键盘事件
});
</script>

<template>
  <div>
    <div class="container" ref="containerRef"></div>
  </div>
</template>

<style lang="stylus" scoped></style>
