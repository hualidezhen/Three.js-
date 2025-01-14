<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
// import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// 引入CSS2渲染器CSS2DRenderer
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
// 引入CSS2模型对象CSS2DObject
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

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

const css2Renderer = new CSS2DRenderer();
css2Renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);

// 创建一个CSS2渲染器CSS2DRenderer
css2Renderer.domElement.style.position = "absolute";
css2Renderer.domElement.style.top = "0px";
css2Renderer.domElement.style.pointerEvents = "none"; //TML元素标签对threejs canvas画布鼠标事件的遮挡

const render = () => {
  renderer.render(scene, camera);
  // 渲染HTML标签对应的CSS2DObject模型对象
  requestAnimationFrame(render);
};

const renderCss = () => {
  // 用法和webgl渲染器渲染方法类似
  css2Renderer.render(scene, camera);
  // width, height：canvas画布宽高度
  requestAnimationFrame(render);
};

onMounted(() => {
  const div = document.getElementById("tag");
  // HTML元素转化为threejs的CSS2模型对象
  const tag = new CSS2DObject(div);
  tag.position.set(50, 0, 50);
  scene.add(tag);
  containerRef.value.appendChild(renderer.domElement);
  document.body.appendChild(css2Renderer.domElement);

  render();
  renderCss();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
  // 画布跟随窗口变化
  window.onresize = function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // cnavas画布宽高度重新设置
    renderer.setSize(width, height);
    // HTML标签css2Renderer.domElement尺寸重新设置
    css2Renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
  <!-- <div id="tag">标签内容</div> -->
  <!-- CSS布局方式写法很多，不一定和课程一致 -->
<div id="tag" style="display: none;">
    <!-- position:relative;约束子元素绝对定位参照点 -->
    <div style="position:relative;width:400px;height:322px;color: #fff;">
        <!-- 图片绝对定位100%填充父元素，作为标签的背景 -->
        <!-- <img src="./信息背景.png" alt="" style="width:100%;position: absolute;left: 0px;top: 0px;"> -->
        <!-- 名称、存储量、设备状态、等信息叠加到背景图上即可 -->
        <div style="position:absolute;left:48px;top:36px;font-size:16px;">
            <div style="font-size:20px;font-weight: 400;">
                <span>设备A</span>
            </div>
            <div style="margin-top: 30px;">
                <span style="font-weight: 400;margin-left: 80px;font-size: 40px;color: #00ffff;">276559 L</span>
            </div>
            <div style="margin-top: 20px;">
                <span style="color: #ccc;font-weight: 300;">管理</span><span
                   style="font-weight: 400;margin-left: 30px;">王臻</span>
            </div>
            <div style="margin-top: 10px;">
                <span style="color: #ccc;font-weight: 300;">工号</span><span
                   style="font-weight: 400;margin-left: 30px;">123456</span>
            </div>
        </div>
        <div style="position:absolute;left:285px;top:35px;">
            <span style="color: #ffff00;">异常</span>
        </div>
    </div>
</div>

</template>

<style lang="stylus" scoped></style>
