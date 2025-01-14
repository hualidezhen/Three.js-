<template>
  <body>
    <div style="height: 55px; background-color: #cccccc">上面布局</div>
    <div>
      <div
        id="left"
        style="
          position: absolute;
          top: 100px;
          background-color: #cccccc;
          width: 195px;
          color: #ffffff;
        "
      >
        <button id="red" class="button">红色</button>
        <button id="green" class="button" style="margin-left: 10px">
          绿色
        </button>
        <button type="button" name="button" @click="saveFile">下载</button>
      </div>
      <div
        id="webgl"
        style="
          position: absolute;
          top: 100px;
          left: 200px;
          background-color: #444444;
        "
      >
        <div class="container" ref="containerRef"></div>
      </div>
    </div>
  </body>
</template>

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
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 创建一个漫反射网络材质
var lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 两个参数分别为几何体geometry、材质material
// const mesh = new THREE.Mesh(geometry, basicMaterial); //基础网格模型对象Mesh
// var mesh = new THREE.Mesh(geometry, lambertMaterial); //漫反射网格模型对象Mesh
var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(0, 0, 0);

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
  //想把canvas画布上内容下载到本地，需要设置为true
  preserveDrawingBuffer: true,
   // 设置对数深度缓冲区，优化深度冲突问题 相距过小依旧没有效果
   logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);

const render = () => {
  const width = window.innerWidth - 210;
  const height = window.innerHeight - 100;
  document.getElementById("left").style.height = height + "px";
  document.getElementById("webgl").style.width = width + "px";
  document.getElementById("webgl").style.height = height + "px";
  renderer.render(scene, camera); //执行渲染操作
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  requestAnimationFrame(render);
  // renderer.render(scene, camera);
};

// const initStyle = () => {
//   const width = window.innerWidth - 210;
//   const height = window.innerHeight - 100;
//   document.getElementById("left").style.height = height + "px";
//   document.getElementById("webgl").style.width = width + "px";
//   document.getElementById("webgl").style.height = height + "px";
//   if (scene && camera) {
//     renderer.render(scene, camera); //执行渲染操作
//   }
// };

// 下载保存渲染图片
const saveFile = () => {
  console.log(123);

  const link = document.createElement("a");
  // 通过超链接herf属性，设置要保存到文件中的数据
  const canvas = renderer.domElement; //获取canvas对象
  link.href = canvas.toDataURL("image/png");
  link.download = "threeJs.png"; //下载文件名
  link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
};

onMounted(() => {
  containerRef.value.appendChild(renderer.domElement);
  render();
  // initStyle();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
  // 画布跟随窗口变化
  window.onresize = function () {
    render();
  };
  document.getElementById("red").addEventListener("click", function () {
    mesh.material.color.set(0xff0000);
  });
  document.getElementById("green").addEventListener("click", function () {
    mesh.material.color.set(0x00ff00);
  });
});
</script>

<style lang="stylus" scoped>
body {
  overflow: hidden;
  margin-top: 20px;
}
.button{
  cursor:pointer
}
</style>
