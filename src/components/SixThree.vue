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


// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,//0xff0000设置材质颜色为红色
});

// 两个参数分别为几何体geometry、材质material
var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(0,0,0);

camera.position.set(100, 100, 150);


// scene
var scene = new THREE.Scene();

//new THREE.Vector3()实例化一个三维向量对象
const v3 = new THREE.Vector3(0,0,0);
console.log('v3', v3);
v3.set(10,0,0);//set方法设置向量的值
v3.x = 100;//访问x、y或z属性改变某个分量的值

// 创建一个欧拉对象，表示绕着xyz轴分别旋转45度，0度，90度
const Euler = new THREE.Euler( Math.PI/4,0, Math.PI/2);
Euler.x = Math.PI/4;
Euler.y = Math.PI/2;
Euler.z = Math.PI/4;

// const axis = new THREE.Vector3(1,1,1);//向量axis
const axis = new THREE.Vector3(0,1,0);//向量axis
// mesh.rotateOnAxis(axis,Math.PI/8);//绕axis轴旋转π/8
mesh.rotateOnAxis(Euler,Math.PI/8);//绕axis轴旋转一个欧拉对象

// 创建一个颜色对象
const color = new THREE.Color();//默认是纯白色0xffffff。
console.log('查看颜色对象结构',color);//可以查看rgb的值
// 查看Color对象设置0x00ff00对应的的.r、.g、.b值
// const color = new THREE.Color(0x00ff00);

color.setRGB(0,1,0);//RGB方式设置颜色
color.setHex(0x00ff00);//十六进制方式设置颜色
color.setStyle('#00ff00');//前端CSS颜色值设置颜色

// .setHex()、.setStyle()风格的颜色值都可以作为.set()的参数
color.set(0x00ff00);//十六进制方式设置颜色
color.set('#00ff00');//前端CSS颜色值设置颜色

// const v1 = new THREE.Vector3(1, 2, 3);
// console.log('v1',v1);
// //v2是一个新的Vector3对象，和v1的.x、.y、.z属性值一样
// const v2 = v1.clone();
// console.log('v2',v2);


const v1 = new THREE.Vector3(1, 2, 3);
console.log('v1',v1);
//v2是一个新的Vector3对象，和v1的.x、.y、.z属性值一样
const v2 = v1.clone();
console.log('v2',v2);






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
