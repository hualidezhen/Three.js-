<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// vue 不要DOM
const containerRef = ref(null);
let controls = null;
// 透视相机
var camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1, // 最近距离
  3000 // 最远距离
);
const colorObj = {
    color:0x00ffff,
};

camera.position.set(100, 100, 150);

//创建一个长方体几何对象Geometry
var geometry = new THREE.BoxGeometry(50, 50, 50);

// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff,//0xff0000设置材质颜色为红色
});

var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh
mesh.position.set(0,0,0)

 camera.lookAt(0, 0, 0);
// scene
var scene = new THREE.Scene();
scene.add(mesh);

// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);


//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '10px';
gui.domElement.style.top = '50px';
gui.domElement.style.width = '300px';

// 创建材质子菜单
const matFolder = gui.addFolder('材质');
matFolder.close();//默认闭合
// 材质颜色color
matFolder.addColor(colorObj, 'color').onChange(function(value){
  phongMaterial.color.set(value);
});

matFolder.add(mesh.position, 'x', 0, 180).name('x轴坐标');
matFolder.add(mesh.position, 'y', 0, 180).name('y轴坐标');
matFolder.add(mesh.position, 'z', 0, 180).name('z轴坐标');
// //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
// const obj = {
//     x: 30,
//     y: 40,
//     z: 50,
// };
// // gui界面上增加交互界面，改变obj对应属性
// gui.add(obj, 'x', 0, 100);
// gui.add(obj, 'y', 0, 50);
// gui.add(obj, 'z', 0, 60);
const lightFolder = gui.addFolder('光照')
lightFolder.close()

// 光照强度属性.intensity
console.log('ambient.intensity',ambient.intensity);
// 通过GUI改变mesh.position对象的xyz属性
// .step() 步长设置交互界面每次改变属性值间隔是多少
lightFolder.add(ambient, 'intensity', 0, 2.0).name('环境光强度').step(0.1);

// gui.addColor(colorObj, 'color').name('材质颜色').onChange((value) =>{
//   // console.log(123);
//   // mesh.position.x = value;
// 	// 你可以写任何你想跟着obj.x同步变化的代码
// 	// 比如mesh.position.y = value;
//   mesh.material.color.set(value);
//   // ambient.color.set(value)
// });





const obj = {
    scale: 0,
};
// 参数3数据类型：数组(下拉菜单)
gui.add(obj, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
    mesh.position.y = value;
});

// 参数3数据类型：对象(下拉菜单)
gui.add(obj, 'scale', {
    left: -100,
    center: 0,
    right: 100
    // 左: -100,//可以用中文
    // 中: 0,
    // 右: 100
}).name('位置选择').onChange(function (value) {
    mesh.position.x = value;
});

const obj2 = {
    bool: false,
};
// 改变的obj属性数据类型是布尔值，交互界面是单选框
gui.add(obj2, 'bool').name('是否旋转');

// gui增加交互界面，用来改变obj对应属性
// gui.add(obj, 'x', 0, 100);
// setInterval(function () {
//     console.log('x', obj.x);
// }, 10)









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
   // 当gui界面设置obj.bool为true,mesh执行旋转动画
   if (obj2 .bool) mesh.rotateY(0.01);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
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
