import './lib/weapp-adapter'
import * as THREE from './lib/three.js'
require('lib/OrbitControls')
//const canvas=wx.createCanvas()
let screenWidth,screenHeight,aspect

const Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

let scene,camera,fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,renderer, container
let hemisphereLight, shadowLight,controls
let sea,sky,airplane,Sea,Sky,Cloud,AirPlane,cat,Cat,model
let touchePos={
    x:0,
    y:0
}
let preLoadDone  = false;
let mesh

// wx.getSystemInfo({
//     success(info){
//         WIDTH=screenWidth=info.screenWidth
//         HEIGHT=screenHeight=info.screenHeight
//         aspectRatio=aspect=screenWidth/screenHeight
//     }
// })

WIDTH=screenWidth=window.innerWidth
HEIGHT=screenHeight=window.innerHeight
aspectRatio=aspect=screenWidth/screenHeight

function init(){
    createScene()

    createLights()

    //createPlane()

    creatModel()

    wx.onTouchMove(handleTouchMove)

    loop()
}

function createScene(){
    scene=new THREE.Scene()

    scene.fog=new THREE.Fog(0xf7d9aa,100,950)

    fieldOfView=60
    nearPlane=1
    farPlane=10000
    camera=new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    )

    camera.position.x=0
    camera.position.y=100
    camera.position.z=200
    //camera.lookAt(new THREE.Vector3(0,90,0))



    renderer=new THREE.WebGLRenderer({
        //alpha:true,
        antialias:true,
        canvas:canvas,
    })

    renderer.setClearColor(0xfff6e6)
    renderer.setSize(WIDTH,HEIGHT)

    renderer.shadowMap.enabled=true
}

function createLights(){
    hemisphereLight=new THREE.HemisphereLight(0xaaaaaa,0x000000,.9)
    shadowLight=new THREE.DirectionalLight(0xffffff,.9)
    shadowLight.position.set(150,350,350)

    shadowLight.shadow.camera.left=-400
    shadowLight.shadow.camera.right=400
    shadowLight.shadow.camera.top=400
    shadowLight.shadow.camera.bottom=-400
    shadowLight.shadow.camera.near=1
    shadowLight.shadow.camera.far=1000

    shadowLight.shadow.mapSize.width=2048
    shadowLight.shadow.mapSize.height=2048

    scene.add(hemisphereLight)
    scene.add(shadowLight)
}

function loop() {
    if (preLoadDone) {
        if (mesh != undefined)
            mesh.rotation.z += 0.001
        renderer.render(scene, camera)
    }
    //controls = new THREE.OrbitControls(camera);
    //renderer.render(scene,camera)
    requestAnimationFrame(loop)
}

function handleTouchMove(event){
    let tx=-1+(event.changedTouches[0].clientX/WIDTH)*2
    let ty=1-(event.changedTouches[0].clientY/HEIGHT)*2
    touchePos={
        x:tx,
        y:ty
    }
}

function normalize(v,vmin,vmax,tmin,tmax){
    let nv=Math.max(Math.min(v,vmax),vmin)
    let dv=vmax-vmin
    let pc=(nv-vmin)/dv
    let dt=tmax-tmin
    let tv=tmin+(pc*dt)
    return tv
}

function creatModel(){
    const model = "https://indienova.com/farm/files/indienova-logo.json"
    let modelLoader = new THREE.JSONLoader()
    modelLoader.load(model,
        function(geometry, materials){
            mesh = new THREE.Mesh(geometry, materials[0])
            mesh.scale.set(1000, 1000, 1000)
            mesh.rotation.x = 1.5
            scene.add(mesh)
            console.log('模型载入完成')

            /* 允许渲染模型 */
            preLoadDone = true
        },
        // onProgress callback
        function (xhr) {
            console.log( (xhr.loaded / xhr.total * 100) + '% 已载入' )
        },
        // onError callback
        function(err) {
            console.log('载入出错', err.target.status)
        }
    );
}

AirPlane=function(){
    this.mesh=new THREE.Object3D()
    let geomCockpit=new THREE.BoxGeometry(60,50,50,1,1,1)
    let matCockpit=new THREE.MeshPhongMaterial({
        color:Colors.red,
        shading:THREE.FlatShading
    })
    let cockpit=new THREE.Mesh(geomCockpit,matCockpit)
    cockpit.castShadow=true
    cockpit.receiveShadow=true
    this.mesh.add(cockpit)
}

function createPlane(){
    airplane=new AirPlane()
    airplane.mesh.scale.set(.25,.25,.25)
    airplane.mesh.position.y=100
    scene.add(airplane.mesh)
}
init()