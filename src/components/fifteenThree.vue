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
  50, // 最近距离
  3000 // 最远距离
);
const colorObj = {
    color:0x00ffff,
};

camera.position.set(200, 200, 250);

//创建一个长方体几何对象Geometry
// var geometry = new THREE.BoxGeometry(50, 50, 50);
const geometry = new THREE.BoxGeometry(25, 100, 50);


// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff,//0xff0000设置材质颜色为红色
});

var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh
mesh.position.set(0,0,0)

 camera.lookAt(0, 0, 0);
// scene
var scene = new THREE.Scene();

// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);


//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);


const texture = new THREE.TextureLoader().load("../../public/chartLet/textureMin.jpg");
// 创建精灵材质对象SpriteMaterial
const spriteMaterial = new THREE.SpriteMaterial({
  // color:0x00ffff,//设置颜色
  // transparent:true,//SpriteMaterial默认是true
  // rotation:Math.PI/4,//旋转精灵对象45度，弧度值
  map:texture
});

// 创建精灵模型对象，不需要几何体geometry参数
const sprite = new THREE.Sprite(spriteMaterial);
// 控制精灵大小
console.log('sprite.scale',sprite.scale);
sprite.scale.set(50, 25, 1); //只需要设置x、y两个分量就可以
sprite.position.set(0, 100 + 10/2, 0);//设置位置，要考虑sprite尺寸影响


// scene.add(sprite);
// scene.add(mesh);

// mesh顶部中心添加标注，顶部中心坐标是(0,100,0)

geometry.translate(0, 50, 0);

const textureWater = new THREE.TextureLoader().load("../../public/chartLet/水滴.png");
const spriteMaterialWater = new THREE.SpriteMaterial({
    map: textureWater, 
});
// const spriteWater = new THREE.Sprite(spriteMaterialWater);
// scene.add(spriteWater);

// 雨滴在3D空间随机分布
const group = new THREE.Group();
for (let i = 0; i < 16000; i++) {
    // 精灵模型共享材质
    const spriteWater = new THREE.Sprite(spriteMaterialWater);
    group.add(spriteWater);
    spriteWater.scale.set(1, 1, 1);
    // 设置精灵模型位置，在长方体空间上上随机分布
    const x = 1000 * (Math.random() - 0.5);
    const y = 600 * Math.random();
    const z = 1000 * (Math.random() - 0.5);
    spriteWater.position.set(x, y, z)
}

scene.add(group);


// function loop() {
//     // loop()每次执行都会更新雨滴的位置，进而产生动画效果
//     group.children.forEach(sprite => {
//         // 雨滴的y坐标每次减1
//         sprite.position.y -= 1;
//         if (sprite.position.y < 0) {
//             // 如果雨滴落到地面，重置y，从新下落
//             sprite.position.y = 600;
//         }
//     });
//     requestAnimationFrame(loop);  
// }
// loop();

const clock = new THREE.Clock();
function loop() {
    // loop()两次执行时间间隔
    const t = clock.getDelta();
    group.children.forEach(sprite => {
        // 雨滴的y坐标每次减t*60
        sprite.position.y -= t*60;
        if (sprite.position.y < 0) {
            sprite.position.y = 600;
        }
    });
    requestAnimationFrame(loop);
}
loop();





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

// gui.add(obj, 'z', 0, 60);
const lightFolder = gui.addFolder('光照')
lightFolder.close()

// 光照强度属性.intensity
console.log('ambient.intensity',ambient.intensity);
// 通过GUI改变mesh.position对象的xyz属性
// .step() 步长设置交互界面每次改变属性值间隔是多少
lightFolder.add(ambient, 'intensity', 0, 2.0).name('环境光强度').step(0.1);


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
