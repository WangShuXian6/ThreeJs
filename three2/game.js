import './lib/weapp-adapter'
import * as THREE from './lib/three.js'

require('lib/OrbitControls')
//const canvas=wx.createCanvas()
let screenWidth, screenHeight, aspect
const model = "http://black.xinliu.org/obj/cat-run8.json"
//const model = "http://black.xinliu.org/obj/knight.js"
var delta = 1;
// wx.getSystemInfo({
//     success(info){
//         WIDTH=screenWidth=info.screenWidth
//         HEIGHT=screenHeight=info.screenHeight
//         aspectRatio=aspect=screenWidth/screenHeight
//     }
// })

let WIDTH = screenWidth = window.innerWidth
let HEIGHT = screenHeight = window.innerHeight
let aspectRatio = aspect = screenWidth / screenHeight

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;

var container, stats;

var camera, scene;
var renderer;

var mesh, mesh2, helper;

var mixer, facesClip, bonesClip;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 2200;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    scene.add(camera);

    // GROUND

    var geometry = new THREE.PlaneBufferGeometry(16000, 16000);
    var material = new THREE.MeshPhongMaterial({emissive: 0x888888});

    var ground = new THREE.Mesh(geometry, material);
    ground.position.set(0, FLOOR, 0);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    ground.receiveShadow = true;


    // LIGHTS

    scene.add(new THREE.HemisphereLight(0x111111, 0x444444));

    var light = new THREE.DirectionalLight(0xebf3ff, 1.5);
    light.position.set(0, 140, 500).multiplyScalar(1.1);
    scene.add(light);

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 390;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d * 1.5;
    light.shadow.camera.bottom = -d;

    light.shadow.camera.far = 3500;

    // RENDERER

    renderer = new THREE.WebGLRenderer({
        //alpha:true,
        antialias: true,
        canvas: canvas,
    })

    renderer.setClearColor(0xfff6e6)
    renderer.setSize(WIDTH, HEIGHT)

    renderer.shadowMap.enabled = true

    var loader = new THREE.JSONLoader();
    //loader.load( "models/skinned/knight.js", function ( geometry, materials ) {
    loader.load(model, function (geometry, materials) {

        createScene(geometry, materials, 0, FLOOR, -300, 60);

        // GUI

        //initGUI();

    });
}

function createScene(geometry, materials, x, y, z, s) {

    //ensureLoop( geometry.animation );

    geometry.computeBoundingBox();
    var bb = geometry.boundingBox;

    //var path = "textures/cube/Park2/";
    // var format = '.jpg';
    // var urls = [
    //     path + 'posx' + format, path + 'negx' + format,
    //     path + 'posy' + format, path + 'negy' + format,
    //     path + 'posz' + format, path + 'negz' + format
    // ];

    for (var i = 0; i < materials.length; i++) {

        var m = materials[i];
        m.skinning = true;
        m.morphTargets = true;

        m.specular.setHSL(0, 0, 0.1);

        //m.color.setHSL( 0.6, 0, 0.6 );

        //m.map = map;
        //m.envMap = envMap;
        //m.bumpMap = bumpMap;
        //m.bumpScale = 2;

        //m.combine = THREE.MixOperation;
        //m.reflectivity = 0.75;

    }

    mesh = new THREE.SkinnedMesh(geometry, materials);
    mesh.name = "Knight Mesh";
    mesh.position.set(x, y - bb.min.y * s, z);
    mesh.scale.set(s, s, s);
    scene.add(mesh);

    mesh.castShadow = true;
    mesh.receiveShadow = true;


    mesh2 = new THREE.SkinnedMesh(geometry, materials);
    mesh2.name = "Lil' Bro Mesh";
    mesh2.position.set(x - 240, y - bb.min.y * s, z + 500);
    mesh2.scale.set(s / 2, s / 2, s / 2);
    mesh2.rotation.y = THREE.Math.degToRad(60);

    mesh2.visible = false;

    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    scene.add(mesh2);

    helper = new THREE.SkeletonHelper(mesh);
    helper.material.linewidth = 3;
    helper.visible = false;
    scene.add(helper);

    mixer = new THREE.AnimationMixer(mesh);

    bonesClip = geometry.animations[0];
    facesClip = THREE.AnimationClip.CreateFromMorphTargetSequence('facialExpressions', mesh.geometry.morphTargets, 3);

    let action_1 = mixer.clipAction(bonesClip, null);
    //action_1.reset()
    action_1.play()
    //action_1.stop()
    //action_1.reset()
    //action_1.paused
    let action_2 = mixer.clipAction(facesClip, null);
    //action_2.reset()
    action_2.play()
}


function animate() {

    requestAnimationFrame(animate);

    render();
}

function render() {

    //var delta = 0.75 * clock.getDelta();

    delta=(0.75/30)

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y = THREE.Math.clamp(camera.position.y + ( -mouseY - camera.position.y ) * .05, 0, 1000);

    camera.lookAt(scene.position);

    if (mixer) {

        mixer.update(delta);

    }

    renderer.render(scene, camera);

}