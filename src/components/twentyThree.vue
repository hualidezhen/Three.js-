<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// vue 不要DOM
const containerRef = ref(null);
let controls = null;
// 透视相机
var camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  50, // 最近距离
  3000 // 最远距离
);

camera.position.set(200, 200, 300);

//创建一个长方体几何对象Geometry
var geometry = new THREE.BoxGeometry(50, 50, 50);
// const geometry = new THREE.BoxGeometry(25, 100, 50);

// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ffff, //0xff0000设置材质颜色为红色
});

var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh
mesh.position.set(0, 0, 0);

camera.lookAt(0, 0, 0);
// scene
var scene = new THREE.Scene();

// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

scene.add(mesh);

//网格地面 比例大小的参照物
var gridHelper = new THREE.GridHelper(100, 100);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);

const render = () => {
  renderer.render(scene, camera);
  // 渲染HTML标签对应的CSS2DObject模型对象
  requestAnimationFrame(render);
};

onMounted(() => {
  render();

  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
  // 画布跟随窗口变化
  window.onresize = function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // cnavas画布宽高度重新设置
    renderer.setSize(width, height);
    // HTML标签css2Renderer.domElement尺寸重新设置
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style lang="stylus" scoped></style>
