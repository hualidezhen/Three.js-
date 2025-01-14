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
  40,
  window.innerWidth / window.innerHeight,
  0.1, // 最近距离
  1000 // 最远距离
);

//创建一个长方体几何对象Geometry
var geometry = new THREE.BoxGeometry(50, 50, 50);

//创建一个材质对象Material 基础材质不受光源印象
var basicMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,//0xff0000设置材质颜色为红色
});

// 创建一个漫反射网络材质
var lambertMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,//0xff0000设置材质颜色为红色
});

// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,//0xff0000设置材质颜色为红色
});

// 两个参数分别为几何体geometry、材质material
// const mesh = new THREE.Mesh(geometry, basicMaterial); //基础网格模型对象Mesh
// var mesh = new THREE.Mesh(geometry, lambertMaterial); //漫反射网格模型对象Mesh
var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(0,0,0);

camera.position.set(100, 100, 150);


// scene
var scene = new THREE.Scene();

scene.add(mesh);


// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

//网格地面 比例大小的参照物
var gridHelper = new THREE.GridHelper(100, 100);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);



const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

onMounted(() => {
  containerRef.value.appendChild(renderer.domElement);
  render();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style lang="stylus" scoped></style>
