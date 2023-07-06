//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, material;
var camera;
var clock;
var directionalLight, spotLight, pointLights = [8];
var skyMaterial, textureSky, skyChanged, skydome;
var terrain, terrainMaterial, terrainChanged, textureTerrain;
var keyMap = [4], animationSpeed = 60;
var ovni, house, moon,corkOaks = [];
var materials;
var orbitControls;
var switchPointL, pointLswitched, switchSpotL, spotLswitched, switchDirectionalL, directionalLswitched;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    createAmbientLight();
    createSkydome();
    createTerrain();
    createOvni(0, 35, 0);
    createHouse(20, 9, -15);
    createMoon();
    createCorkOaks();
    
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    scene.add(new THREE.AxisHelper(4));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(){
    'use strict';

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(170,120,100);
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight(){
    'use strict';
    
    const light = new THREE.AmbientLight( 0xffffe0 ); // soft moon yellow light
    scene.add( light );
}

function createPointLight(obj, x, y, z, color, intensity, distance){ 
    "use strict";

    var pointLight = new THREE.PointLight(color, intensity, distance); 

    pointLight.position.set(x, y, z); 

    obj.add(pointLight);
    return pointLight;
}

function createSpotLight(obj, x, y, z, color, intensity, xtarget, ytarget, ztarget) {
    "use strict";

    var light = new THREE.SpotLight(color, intensity, 50, Math.PI / 4, 0.3, 1.1);

    light.position.set(x, y, z);  
    light.target.position.set(xtarget, ytarget, ztarget);

    obj.add(light);
    obj.add(light.target);

    return light;
}

function createDirectionalLight(obj, x, y, z, color, intensity){
    'use strict';

    directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x,y,z);

    obj.add(directionalLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createSkydome(){
    'use strict';

    const geometry = new THREE.SphereGeometry(80, 32, 16, 0, 2*Math.PI, 0, Math.PI/2);

    skyMaterial = new THREE.MeshPhongMaterial({ side: THREE.BackSide }); 
    skyMaterial.map = drawSkydome();

    skydome = new THREE.Mesh( geometry, skyMaterial );

    scene.add(skydome);
    skydome.position.set(0, 0, 0);
}

function createMoon(){
    'use strict';
    moon = new  THREE.Object3D();

    addSphere(moon, 40,55,10, 2.5, materials.moonMaterial[3]);

    createDirectionalLight(moon, 50,60,10, 0xFFD45F, 0.5);   
    scene.add(moon);
}

function createTerrain() {
    'use strict';

    var geometry = new THREE.CircleGeometry(80, 32);
    const height = new THREE.TextureLoader().load('../images/heightmap.png');
    const inverted = new THREE.TextureLoader().load('../images/inverted.png');
    height.wrapS = height.wrapT = THREE.RepeatWrapping;
    height.repeat.set(1, 20);

    terrainMaterial = new THREE.MeshPhongMaterial({
        bumpMap: inverted,
        bumpScale: 20,
        side: THREE.DoubleSide,
        displacementMap: height,
        displacementScale: 45
    });
    terrainMaterial.map = drawFlowers();

    terrain = new THREE.Mesh(geometry, terrainMaterial);

    terrain.position.set(0, 0, 0);
    terrain.rotation.x = -Math.PI / 2;

    scene.add(terrain);
}


function createHouse( x, y, z){
    'use strict';

    house = new THREE.Object3D();
    
    // indices for a rectangle with no holes
    var indices = [0, 1, 2, 2, 3, 0]; 

    // Exterior Walls
    addWalls();

    // Roof front face
    addHouseObject(indices, new Float32Array([
        -10.5, 6, 5, // v0
        10.5, 6, 5, // v1
        10.5, 8, 0, // v2
        -10.5, 8, 0 // v3
    ]), materials.roofMaterial[3]);

    // Roof back face
    addHouseObject(indices, new Float32Array([
        10.5, 6, -5, // v0
        -10.5, 6, -5, // v1
        -10.5, 8, 0, // v2
        10.5, 8, 0 // v3
    ]), materials.roofMaterial[3]);

    // roof right face
    addHouseObject([0, 1, 2], new Float32Array([
        10.5, 6, 5, // v0
        10.5, 6, -5, // v1
        10.5, 8, 0 // v2
    ]), materials.roofMaterial[3]);

    // roof left face
    addHouseObject([0, 1, 2], new Float32Array([
        -10.5, 6, -5, // v0
        -10.5, 6, 5, // v1
        -10.5, 8, 0 // v2
    ]), materials.roofMaterial[3]);

    // front face left window
    addHouseObject(indices, new Float32Array([
        -7.5, 2, 5, // v0
        -5.5, 2, 5, // v1
        -5.5, 5, 5, // v2
        -7.5, 5, 5 // v3
    ]), materials.windowMaterial[3]);

    // front face right window
    addHouseObject(indices, new Float32Array([
        5.5, 2, 5, // v0
        7.5, 2, 5, // v1
        7.5, 5, 5, // v2
        5.5, 5, 5 // v3
    ]), materials.windowMaterial[3]);

    // right face window
    addHouseObject(indices, new Float32Array([
        10.5, 2, 1, // v0
        10.5, 2, -1, // v1
        10.5, 5, -1, // v2
        10.5, 5, 1 // v3
    ]), materials.windowMaterial[3]);

    // door
    addHouseObject(indices,new Float32Array([
        -1.5, 0, 5, // v0
        1.5, 0, 5, // v1
        1.5, 5, 5, // v2
        -1.5, 5, 5 // v3
    ]), materials.doorMaterial[3]);

    // footer visible side
    indices = [
        0, 1, 2, 2, 3, 0, // front left
        4, 5, 6, 6, 7, 4, // front right
        5, 8, 9, 9, 6, 5 // side right
    ];
    addHouseObject(indices, new Float32Array([
        -10.5, 0, 5, // v0
        -1.5, 0, 5, // v1
        -1.5, 0.5, 5, // v2
        -10.5, 0.5, 5, // v3
        1.5, 0, 5, // v4
        10.5, 0, 5, // v5
        10.5, 0.5, 5, // v6
        1.5, 0.5, 5, // v7
        10.5, 0, -5, // v8
        10.5, 0.5, -5 // v9
    ]), materials.footerMaterial[3]);

    // footer not hidden side
    indices = [
        0, 1, 2, 2, 3, 0, // back
        1, 4, 5, 5, 2, 1 // left
    ];
    addHouseObject(indices, new Float32Array([
        10.5, 0, -5, // v0
        -10.5, 0, -5, // v1
        -10.5, 0.5, -5, // v2
        10.5, 0.5, -5, // v3
        -10.5, 0, 5, // v4
        -10.5, 0.5, 5 // v5
    ]), materials.footerMaterial[3]);

    house.position.set(x, y, z);
    house.scale.set(1.25, 1.25, 1.25);

    scene.add(house);
}

function addWalls(){
    'use strict';

    // Front face wall
    var indices = [
        0, 1, 2, 2, 13, 0, // lower left
        6, 7, 8, 8, 5, 6, // lower right
        13, 14, 17, 17, 12, 13, // middle left left
        15, 2, 3, 3, 16, 15, // middle left right
        5, 18, 21, 21, 4, 5, // middle right left
        19, 8, 9, 9, 20, 19, // middle right right
        12, 9, 10, 10, 11, 12 // upper
    ];

    var vertices = new Float32Array([
        -10.5, 0.5, 5, // v0
        -1.5, 0.5, 5, // v1
        -1.5, 2, 5, // v2
        -1.5, 5, 5, // v3
        1.5, 5, 5, // v4
        1.5, 2, 5, // v5
        1.5, 0.5, 5, // v6
        10.5, 0.5, 5, // v7
        10.5, 2, 5, // v8
        10.5, 5, 5, // v9
        10.5, 6, 5, // v10
        -10.5, 6, 5, // v11
        -10.5, 5, 5, // v12
        -10.5, 2, 5, // v13
        -7.5, 2, 5, // v14
        -5.5, 2, 5, // v15
        -5.5, 5, 5, // v16
        -7.5, 5, 5, // v17
        5.5, 2, 5, // v18
        7.5, 2, 5, // v19
        7.5, 5, 5, // v20
        5.5, 5, 5 // v21
    ]);

    addHouseObject(indices, vertices, materials.wallMaterial[3]);

    // Back Face Wall
    indices = [
        0, 1, 2, 2, 3, 0
    ];

    vertices = new Float32Array([
        10.5, 0.5, -5, // v0
        -10.5, 0.5, -5, // v1
        -10.5, 6, -5, // v2
        10.5, 6, -5 // v3
    ]);

    addHouseObject(indices, vertices, materials.wallMaterial[3]);

    // Right Face Wall
    indices = [
        0, 1, 2, 2, 7, 0, // lower
        7, 8, 11, 11, 6, 7, // middle left
        9, 2, 3, 3, 10, 9, // middle right
        6, 3, 4, 4, 5, 6 // upper
    ];

    vertices = new Float32Array([
        10.5, 0.5, 5, // v0
        10.5, 0.5, -5, // v1
        10.5, 2, -5, // v2
        10.5, 5, -5, // v3
        10.5, 6, -5, // v4
        10.5, 6, 5, // v5
        10.5, 5, 5, // v6
        10.5, 2, 5, // v7
        10.5, 2, 1, // v8
        10.5, 2, -1, // v9
        10.5, 5, -1, // v10
        10.5, 5, 1 // v11
    ]);

    addHouseObject(indices, vertices, materials.wallMaterial[3]);

    // Left Face Wall
    indices = [
        0, 1, 2, 2, 3, 0
    ];
    
    vertices = new Float32Array([
        -10.5, 0.5, -5, // v0
        -10.5, 0.5, 5, // v1
        -10.5, 6, 5, // v2
        -10.5, 6, -5 // v3
    ]);

    addHouseObject(indices, vertices, materials.wallMaterial[3]);
}

function addHouseObject(indices, vertices, material){
    'use strict';

    var objectGeometry = new THREE.BufferGeometry();

    objectGeometry.setIndex(indices);
    objectGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    objectGeometry.computeVertexNormals();

    var object = new THREE.Mesh(objectGeometry, material);

    house.add(object);
}

function createOvni( x, y, z) {
    'use strict';
    
    ovni = new THREE.Object3D();
  
    addElipsoid(ovni,0,0,0,8,1,8, materials.ovniBody[3]);

    addSphere(ovni,0,1,0,2,materials.ovniDriver[3]);

    addBottomToOvni(ovni,0,-1,0);
  
    var size = [0,4,5.5];

    var mtr = materials.ovniSmallSphereMaterial[3];

    pointLights[0] = addSmallSphere(ovni,size[0],-0.5,size[2],0.5,mtr);
    pointLights[1] = addSmallSphere(ovni,size[1],-0.5,size[1],0.5,mtr); 
    pointLights[2] = addSmallSphere(ovni,size[2],-0.5,size[0],0.5,mtr);
    pointLights[3] = addSmallSphere(ovni,size[1],-0.5,-size[1],0.5,mtr);
    pointLights[4] = addSmallSphere(ovni,size[0],-0.5,-size[2],0.5,mtr);
    pointLights[5] = addSmallSphere(ovni,-size[1],-0.5,-size[1],0.5,mtr);
    pointLights[6] = addSmallSphere(ovni,-size[2],-0.5,size[0],0.5,mtr);
    pointLights[7] = addSmallSphere(ovni,-size[1],-0.5,size[1],0.5,mtr);

    ovni.position.set(x,y,z);

    scene.add(ovni);
}

function addSmallSphere(obj, x, y, z, radius, material){
    'use strict';

    var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  
    var sphere = new THREE.Mesh(sphereGeometry, material);
  
    obj.add(sphere);
    sphere.position.set(x,y,z);
    return createPointLight(sphere,0,0,0,0xffffff,15,10);
}

function addSphere(obj, x, y, z, radius, material){
    'use strict';
      
    var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  
    var sphere = new THREE.Mesh(sphereGeometry, material);
  
    obj.add(sphere);

    sphere.position.set(x,y,z);  
}

function addBottomToOvni(obj, x, y, z) {
    "use strict";
    
    const geometry = new THREE.CylinderGeometry(2, 2, 1, 32);

    var cylinder = new THREE.Mesh(geometry, materials.doorMaterial[3]);

    obj.add(cylinder);

    cylinder.position.set(x,y,z);

    spotLight = createSpotLight(cylinder, 0,-0.5 , 0, 0xffffff, 100, 0,-1,0);
}

function addElipsoid(obj, x, y, z, radiusX, radiusY, radiusZ, material){
    'use strict';
  
    const geometry = new THREE.SphereGeometry(radiusX, 32, 32);

    geometry.scale(1, radiusY / radiusX, radiusZ / radiusX); 

    const elipsoid = new THREE.Mesh( geometry, material );

    obj.add( elipsoid );

    elipsoid.position.set(x,y,z);
}

function addCylinderComponent(obj, x, y, z, radius, height, material, rotation){
    'use strict';

    const geometry = new THREE.CylinderGeometry(radius,radius,height, 32);

    const cylinder = new THREE.Mesh(geometry, material);

    obj.add(cylinder);

    cylinder.position.set(x, y, z);
    cylinder.rotation.z =rotation;
}

function createCorkOaks(){
    let yval =9;
    createCorkOak(5,yval-2, 50,0, 0.6);
    createCorkOak(-50,yval+2, 24, -Math.PI/6, 0.8);
    createCorkOak(-30,yval+2.5, -15, -Math.PI/4, 1);
    createCorkOak(30,yval-1, 25, Math.PI/4, 0.7);
    createCorkOak(-15,yval-1, -40, Math.PI, 1);
    createCorkOak(50,yval-2.5, 40,0, 0.5);
    createCorkOak(45,yval+1, 0, Math.PI, 0.7);
    createCorkOak(50,yval, -30, Math.PI/2, 0.7);
    createCorkOak(0,yval+1, 0, Math.PI/5, 0.7);
    createCorkOak(-13,yval, 45, Math.PI/8, 0.8);
    createCorkOak(20,yval-3, -55, Math.PI*0.35, 0.8);

}

function createCorkOak(x, y, z, rotationY, scale){
    'use strict';

    var corkOak = new THREE.Object3D();  
    var corkMaterial = materials.corkMaterial[3];

    var topMaterial = materials.treeTop[3];

    corkOaks.push(corkOak);

    // Main Branch
    addCylinderComponent(corkOak, 0, 1, 0, 1.5, 3, corkMaterial, 0);

    // Right branch and Top
    addCylinderComponent(corkOak, 1.5, 5, 0, 1.5, 8, corkMaterial, -Math.PI/7);

    addElipsoid(corkOak, 3, 11, 0, 7, 4, 4, topMaterial);
  
    // Left Branch and Top
    addCylinderComponent(corkOak, -2.1, 5, 0, 1, 9, corkMaterial, Math.PI/7);

    addElipsoid(corkOak, -5, 10, 0, 3, 3, 3, topMaterial);
  
    scene.add(corkOak);

    corkOak.position.set(x, y, z);
    corkOak.rotation.y = rotationY;
    corkOak.scale.set(scale, scale, scale);  
}

//////////////////////
/* CREATE MATERIALS */
//////////////////////
 function createMaterials() {
    'use strict';

    materials = {
        wallMaterial: [],
        roofMaterial: [],
        windowMaterial: [],
        doorMaterial: [],
        footerMaterial: [],
        ovniSmallSphereMaterial: [],
        moonMaterial: [],
        corkMaterial: [],
        treeTop: [],
        ovniBody: [],
        ovniDriver: []
    };

    const materialTypes = [
        THREE.MeshLambertMaterial,
        THREE.MeshPhongMaterial,
        THREE.MeshToonMaterial,
        THREE.MeshBasicMaterial
    ];

    const colors = [
        "#FFFFFF",
        "#FF7E00",
        "#00AAFF",
        "#906210",
        "#00308F",
        0xffffff,
        0xFFD45F,
        0xD2691E,
        0x006400,
        '#011426',
        '#376c9e'
    ];

    for (let i = 0; i < materialTypes.length; i++) {
        const materialType = materialTypes[i];

        for (let j = 0; j < Object.keys(materials).length; j++) {
            const materialName = Object.keys(materials)[j];
            const color = colors[j];
            const material = new materialType({ color: color });

            materials[materialName][i] = material;

            if (i < 5){
                materials[materialName][i].side = THREE.FrontSide;
            }
        }
    }
}
  
//////////////////////
/*   ADD TEXTURES   */
//////////////////////
function drawSkydome(){
    'use strict';

    var textureSize = 1000;

    var canvas = document.createElement('canvas');

    canvas.width = textureSize;
    canvas.height = textureSize/3;

    var context = canvas.getContext('2d');

    // Create the gradient background
    var gradient = context.createLinearGradient(0, 0, 0, textureSize);
    gradient.addColorStop(0, '#000000'); // Black
    gradient.addColorStop(1, '#0000d1'); // Dark blue
    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);

    var starRadius = 1;

    var numStars = 900;

    for (var i = 0; i < numStars; i++) {
        var x = Math.random() * textureSize;

        var y = Math.random() * textureSize;

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(x, y, starRadius, 0, 2 * Math.PI);
        context.fill();
    }

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    return texture;
}

function drawFlowers(){
    'use strict';

    var textureSize = 200;

    var canvas = document.createElement('canvas');

    canvas.width = textureSize;
    canvas.height = textureSize;

    var context = canvas.getContext('2d');

    // Create the gradient background
    var gradient = context.createLinearGradient(0, 0, 0, textureSize);
    gradient.addColorStop(0, '#69FC00'); // Light green
    gradient.addColorStop(1, '#008400'); // Dark green
    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);

    var flowerRadius = [1, 0.8, 1.1];
    var colors = ['#ffffff', '#f5e900', '#ba8fff', '#00b3ff'];

    var numFlowers = 900;

    for (var i = 0; i < numFlowers; i++) {
        var x = Math.random() * textureSize;
        var y = Math.random() * textureSize;

        var aux = Math.floor(Math.random() * (4));
        context.fillStyle = colors[aux];
        context.beginPath();
        aux = Math.floor(Math.random() * (3));
        context.arc(x, y, flowerRadius[aux], 0, 2 * Math.PI);
        context.fill();
    }

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    return texture;
}

////////////
/* UPDATE */
////////////
function update(clockdelta){
    'use strict';

    if (textureSky && !skyChanged){
        skyMaterial.map = drawSkydome();
        skydome.material.needsUpdate = true;
        skyChanged = true;
    }
    if (textureTerrain && !terrainChanged){
        terrainMaterial.map = drawFlowers();
        terrain.material.needsUpdate = true;
        terrainChanged = true;
    }
    if (switchPointL && !pointLswitched){
        switchPointLight();
        pointLswitched = true;
    }
    if (switchSpotL && !spotLswitched){
        spotLight.visible = !spotLight.visible;
        spotLswitched = true;
    }
    if (switchDirectionalL && !directionalLswitched){
        directionalLight.visible = !directionalLight.visible;
        directionalLswitched = true;
    }

    executeMovement(clockdelta);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    clock = new THREE.Clock();
    clock.start();

    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // VR
    document.body.appendChild(VRButton.createButton(renderer));

    renderer.xr.enabled = true;

    // set all four indexes in keyMap to false
    for (var i = 0; i < 4; i++) {
        keyMap[i] = false;
    }

    createMaterials();
    createScene();
    createCamera();
    createOrbitControls();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    renderer.xr.addEventListener("sessionstart", onVRSessionStart);
    renderer.xr.addEventListener("resize", onResize);
}

function createOrbitControls() {
    'use strict';

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
}

function onVRSessionStart(){
    'use strict';

    scene.position.set(-10, -15, -50);

    renderer.setAnimationLoop(function () {
        renderer.render(scene, camera);
    });
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    var delta = clock.getDelta();

    update(delta);
    render();

    orbitControls.update();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
      const aspectRatio = window.innerWidth / window.innerHeight;
      
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
  }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 50: //2
            textureSky = true;
            break;
        
        case 49:
            textureTerrain = true;
            break;

        case 80: //p
            switchPointL = true;
            break;

        case 83: //s
            switchSpotL = true;
            break;

        case 68: //d
            switchDirectionalL = true;
            break;

        case 81: // q
            switchMaterial(0);
            break;

        case 87: // w
            switchMaterial(1);
            break;

        case 69: // e
            switchMaterial(2);
            break;

        case 82: // r
            switchMaterial(3);
            break;

        case 40: //down
            keyMap[3] = true;
            break;

        case 38: // up
            keyMap[2] = true;
            break;

        case 37: // left
            keyMap[0] = true;
            break;

        case 39: // right
            keyMap[1] = true;
            break;
    }
}

function switchMaterial(option){
    'use strict';

    if ( option < 0 || option > 3) return;
   
    if (house.children.length > 0) {
        house.children[0].material = materials.wallMaterial[option];
        house.children[1].material = materials.wallMaterial[option];
        house.children[2].material = materials.wallMaterial[option];
        house.children[3].material = materials.wallMaterial[option];
        house.children[4].material = materials.roofMaterial[option];
        house.children[5].material = materials.roofMaterial[option];
        house.children[6].material = materials.roofMaterial[option];
        house.children[7].material = materials.roofMaterial[option];

        for (var i = 8; i < 11; i++){
            house.children[i].material = materials.windowMaterial[option];
        }

        house.children[11].material = materials.doorMaterial[option];
        house.children[12].material = materials.footerMaterial[option];
        house.children[13].material = materials.footerMaterial[option];
    }

    for (var i = 0; i < corkOaks.length; i++){
        if ( corkOaks[i].children.length > 0) {
            corkOaks[i].children[0].material = materials.corkMaterial[option];
            corkOaks[i].children[1].material = materials.corkMaterial[option];
            corkOaks[i].children[2].material = materials.treeTop[option];
            corkOaks[i].children[3].material = materials.corkMaterial[option];
            corkOaks[i].children[4].material = materials.treeTop[option];
        }
    }

    if (ovni.children.length > 0) {
        ovni.children[0].material = materials.ovniBody[option];
        ovni.children[1].material = materials.ovniDriver[option];
        ovni.children[2].material = materials.doorMaterial[option];

        for (var i = 3; i < 11; i++){
            ovni.children[i].material = materials.ovniSmallSphereMaterial[option];
        }
    }
    if (moon.children.length > 0) {
        moon.children[0].material = materials.moonMaterial[option];
    }
}

function switchPointLight(){
    'use strict';

    for(var i = 0; i < 8; i++)
        pointLights[i].visible = !pointLights[i].visible;    
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    
    switch (e.keyCode) {

        case 49: //1
            textureTerrain = false;            
            terrainChanged = false;
            break;

        case 50: //2
            textureSky = false;            
            skyChanged = false;
            break;

        case 80: //p
            switchPointL = false;
            pointLswitched = false;
            break;

        case 83: //s
            switchSpotL = false;
            spotLswitched = false;
            break;

        case 68: //d
            switchDirectionalL = false;
            directionalLswitched = false;
            break;

        case 40: //down
            keyMap[3] = false;
            break;

        case 38: //up
            keyMap[2] = false;
            break;

        case 37: //left
            keyMap[0] = false;
            break;

        case 39: //right
            keyMap[1] = false;
            break;   
    }
}

function executeMovement(clockDelta) {
    "use strict";
    
    var x_delta = 0, z_delta = 0;
  
    // Ovni Rotation
    ovni.rotation.y -= Math.PI/8 *clockDelta;

    // Ovni translation
    if (keyMap[0]) x_delta = -animationSpeed * clockDelta; // move left
    if (keyMap[1]) x_delta = animationSpeed * clockDelta; // move right
    if (keyMap[2]) z_delta = -animationSpeed * clockDelta; // move up
    if (keyMap[3]) z_delta = animationSpeed * clockDelta; // move down
    
    if ((keyMap[3] && keyMap[2]) || (keyMap[0] && keyMap[1])) {x_delta = 0; z_delta = 0;}

    if (x_delta != 0 && z_delta != 0) {
      x_delta /= Math.sqrt(2);      
      z_delta /= Math.sqrt(2);
    }
  
    ovni.position.x += x_delta;
    ovni.position.y += 0;
    ovni.position.z += z_delta;
  
}