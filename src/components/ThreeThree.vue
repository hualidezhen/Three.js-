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
  1, // 最近距离
  3000 // 最远距离
);
//在原来相机位置基础上拉远，可以观察到更大的范围
// camera.position.set(800, 800, 800)
// camera.position.set(1000, 1000, 1000);
camera.position.set(2000, 2000, 2000);
//  camera.lookAt(0, 0, 0);
 camera.lookAt(1000, 0, 1000);
// scene
var scene = new THREE.Scene();

// /***********************for循环创建一列模型*******************/ 
// const geometry = new THREE.BoxGeometry(100, 100, 100);
// //材质对象Material
// const material = new THREE.MeshLambertMaterial({
//     color: 0x00ffff, //设置材质颜色
//     transparent: true,//开启透明
//     opacity: 0.5,//设置透明度
// });
// for (let i = 0; i < 10; i++) {
//     const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
//     // 沿着x轴分布
//     mesh.position.set(i*200,0,0);
//     scene.add(mesh); //网格模型添加到场景中
// }
// /**********************************************************/ 

/***********************for循环创建一列模型*******************/ 
//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(100, 100, 100);
//材质对象Material
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, //设置材质颜色
    transparent: true,//开启透明
    opacity: 0.5,//设置透明度
});
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // 在XOZ平面上分布
        mesh.position.set(i * 200, 0, j * 200);
        scene.add(mesh); //网格模型添加到场景中  
    }
}

/**********************************************************/ 


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
  controls.target.set(1000, 0, 1000);
controls.update();//update()函数内会执行camera.lookAt(controls.targe)
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style lang="stylus" scoped></style>
