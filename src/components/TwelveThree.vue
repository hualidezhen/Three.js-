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

const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
const R = 100; //圆弧半径
const N = 50; //分段数量
const sp = (2 * Math.PI) / N; //两个相邻点间隔弧度
// 批量生成圆弧上的顶点数据
const arr = [];
for (let i = 0; i < N; i++) {
  const angle = sp * i; //当前点弧度
  // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
  const x = R * Math.cos(angle);
  const y = R * Math.sin(angle);
  arr.push(x, y, 0);
}
//类型数组创建顶点数据
const vertices = new Float32Array(arr);
// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3);
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

// const pointsArr = [
//     // 三维向量Vector3表示的坐标值
//     new THREE.Vector3(0,0,0),
//     new THREE.Vector3(0,100,0),
//     new THREE.Vector3(0,100,100),
//     new THREE.Vector3(0,0,100),
// ];

// const pointsArr = [
//     // 三维向量Vector2表示的坐标值
//     new THREE.Vector2(0,0),
//     new THREE.Vector2(100,0),
//     new THREE.Vector2(100,100),
//     new THREE.Vector2(0,100),
// ];

// geometry.setFromPoints(pointsArr);
// console.log('几何体变化',geometry.attributes.position);

// // 线材质
// const material = new THREE.LineBasicMaterial({
//     color: 0xff0000 //线条颜色
// });
// // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
// // const line = new THREE.LineSegments(geometry, material);
// const line = new THREE.LineLoop(geometry, material);//线条模型对象
// EllipseCurve( aX, aY, xRadius,yRadius, aStartAngle, aEndAngle, aClockwise )

// 点材质
const material = new THREE.PointsMaterial({
  color: 0xffff00,
  size: 10.0, //点对象像素尺寸
});
// 点模型
const points = new THREE.Points(geometry, material);

camera.position.set(300, 300, 300);

// scene
var scene = new THREE.Scene();

// scene.add(line);
scene.add(points);

/*************************椭圆曲线*********************************/ 

// // 椭圆弧线
// // const curve = new THREE.EllipseCurve(
// // 	0,  0,            // ax, aY x坐标和y坐标
// // 	10, 20,           // xRadius, yRadius x轴半径和y轴半径
// // 	0,  2 * Math.PI,  // aStartAngle, aEndAngle 正X轴算起曲线开始的角度 正X轴算起曲线终止的角度
// // 	false,            // aClockwise 是否顺时针
// // 	0                 // aRotation 椭圆从X轴正方向逆时针的旋转角度
// // );

// // 圆弧线
// //参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
// const curve = new THREE.ArcCurve(0, 0, 50, 0, 2 * Math.PI);


// const pointsE = curve.getPoints( 50 );
// const geometryE = new THREE.BufferGeometry().setFromPoints( pointsE );

// const materialE = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// // Create the final object to add to the scene
// const ellipse = new THREE.Line( geometryE, materialE );
// scene.add(ellipse);
/**********************************************************/ 

/*******************三维样条曲线*****************************/ 
// 三维向量Vector3创建一组顶点坐标
const arr1 = [
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80)
]
// 三维样条曲线
const curve1 = new THREE.CatmullRomCurve3(arr1);

// // 二维向量Vector2创建一组顶点坐标
// const arr1 = [
//     new THREE.Vector2(-100, 0),
//     new THREE.Vector2(0, 30),
//     new THREE.Vector2(100, 0),
// ];
// // 二维样条曲线
// const curve1 = new THREE.SplineCurve(arr1);

//曲线上获取点
const pointsArr1 = curve1.getPoints(100); //拿一百个点
const geometry1 = new THREE.BufferGeometry();
//读取坐标数据赋值给几何体顶点
geometry1.setFromPoints(pointsArr1); 
// 线材质
const material1 = new THREE.LineBasicMaterial({
    color: 0x00fffff
});
// 线模型
const line1 = new THREE.Line(geometry1, material1);

const material2 = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 10,
});
//点模型对象
const points2 = new THREE.Points(geometry1, material2);

scene.add(line1); //线模型
scene.add(points2); //点模型

/*******************三维样条曲线*****************************/ 


/****************************赛贝尔曲线*******************************/ 
// // p1、p2、p3表示三个点坐标
// // p1、p3是曲线起始点，p2是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(20, 100);
// const p3 = new THREE.Vector2(80, 0);
// // 二维二次贝赛尔曲线
// const curves22 = new THREE.QuadraticBezierCurve(p1, p2, p3);

// // p1、p2、p3表示三个点坐标
// const p1 = new THREE.Vector3(-80, 0, 0);
// const p2 = new THREE.Vector3(20, 100, 0);
// const p3 = new THREE.Vector3(80, 0, 100);
// // 三维二次贝赛尔曲线
// const curves22 = new THREE.QuadraticBezierCurve3(p1, p2, p3);

// // p1、p2、p3、p4表示4个点坐标
// // p1、p4是曲线起始点，p2、p3是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(-40, 50);
// const p3 = new THREE.Vector2(50, 50);
// const p4 = new THREE.Vector2(80, 0);

// // 二维三次贝赛尔曲线
// const curves22 = new THREE.CubicBezierCurve(p1, p2, p3, p4);

const p1 = new THREE.Vector3(-80, 0, 0);
const p2 = new THREE.Vector3(-40, 50, 0);
const p3 = new THREE.Vector3(50, 50, 0);
const p4 = new THREE.Vector3(80, 0, 100);
// 三维三次贝赛尔曲线
const curves22 = new THREE.CubicBezierCurve3(p1, p2, p3, p4);


const pointsArrs22 = curves22.getPoints(100); //曲线上获取点
const geometrys22 = new THREE.BufferGeometry();
geometrys22.setFromPoints(pointsArrs22); //读取坐标数据赋值给几何体顶点
const materialss22 = new THREE.LineBasicMaterial({color: 0x00fffff});
const lines22 = new THREE.Line(geometrys22, materialss22);



const geometrys22_1 = new THREE.BufferGeometry();
// geometrys22_1.setFromPoints([p1,p2,p3]);
geometrys22_1.setFromPoints([p1,p2,p3,p4]);

const materials22_1 = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 10,
});
//点模型对象
const pointss22_1 = new THREE.Points(geometrys22_1, materials22_1);
// 三个点构成的线条
const lines22_1 = new THREE.Line(geometrys22_1, new THREE.LineBasicMaterial({color: 0x00fffff}));

// lines22.position.set(0,50,120)
scene.add(lines22_1); //正常线模型
scene.add(pointss22_1); //正常点模型
scene.add(lines22); //二维二次赛贝尔曲线
// 贝塞尔曲线经过p1、p3两个点，但是不经过p2点，贝塞尔曲线与直线p12和p23相切


/****************************赛贝尔曲线*******************************/ 

/************************************管道**********************************/ 

// 三维样条曲线-赛贝尔曲线路径
// const path = new THREE.CatmullRomCurve3([
//     new THREE.Vector3(-50, 20, 90),
//     new THREE.Vector3(-10, 40, 40),
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(60, -60, 0),
//     new THREE.Vector3(70, 0, 80)
// ]);

// LineCurve3创建直线段路径
// const path = new THREE.LineCurve3(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 0, 0));

// 创建多段线条的顶点数据
const p11 = new THREE.Vector3(0, 0,100)
const p21 = new THREE.Vector3(0, 0,30);
const p31 = new THREE.Vector3(0, 0,0);
const p41 = new THREE.Vector3(30, 0, 0);
const p51 = new THREE.Vector3(100, 0, 0);
// 1. 3D直线线段
const line1Tube = new THREE.LineCurve3(p11, p21);
// 2. 三维二次贝塞尔曲线
const curveTube = new THREE.QuadraticBezierCurve3(p21, p31, p41);
// 3. 3D直线线段
const lineTube2 = new THREE.LineCurve3(p41, p51);

const CurvePath = new THREE.CurvePath(); 
// 三条线拼接为一条曲线
CurvePath.curves.push(line1Tube, curveTube, lineTube2); 

// path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
const TubeGeometry = new THREE.TubeGeometry(CurvePath, 40, 2, 25);

const Tubematerial = new THREE.MeshLambertMaterial({
    side:THREE.DoubleSide,//双面显示看到管道内壁
});

const TubeLine = new THREE.Line(TubeGeometry, Tubematerial);
TubeLine.position.set(100,100,100)
scene.add(TubeLine)

/************************************管道**********************************/ 




// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

//网格地面 比例大小的参照物
// var gridHelper = new THREE.GridHelper(100, 100);
// gridHelper.material.opacity = 0.2;
// gridHelper.material.transparent = true;
// scene.add(gridHelper);

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
