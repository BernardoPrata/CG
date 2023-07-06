//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, geometry, mesh;
var camera = []; // 0 - front, 1 - right, 2 - top, 3 - isometric orthogonal, 4 - isometric perspective, 5 - current camera
var material = []; // 0 - black, 1 - red, 2 - blue, 3 - grey
var trailer, head, feet, bottomPart, rightArm, leftArm;
var headRotation = 0, feetRotation = 0, legRotation = 0;
var moveRight = [], moveLeft = [];
var keyMap = []; // 0 - left, 1 - right, 2 - up, 3 - down
var headMov = [], feetMov = [], bottomMov = [], armMov = []; // 0 - to truck, 1 - to robot
var changeFrameState = false, updatedFrameState = false;
var collision = false, robotInTractorMode = false;
var clock;
var rotationConst = Math.PI;
var animationSpeed = 25;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
  "use strict";

  scene = new THREE.Scene();

  // white background
  scene.background = new THREE.Color(0xfffffff);

  scene.add(new THREE.AxisHelper(4));
  createTrailer(scene, 0, 0, -35);
  createRobot(scene, 0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
  "use strict";

  camera[0] = new THREE.OrthographicCamera(
    window.innerWidth / -25,
    window.innerWidth / 25,
    window.innerHeight / 25,
    window.innerHeight / -25,
    1,
    1000
  );
  camera[0].position.set(0, 0, 50);
  camera[0].lookAt(scene.position);

  camera[1] = new THREE.OrthographicCamera(
    window.innerWidth / -25,
    window.innerWidth / 25,
    window.innerHeight / 25,
    window.innerHeight / -25,
    1,
    1000
  );
  camera[1].position.set(50, 0, 0);
  camera[1].lookAt(scene.position);

  camera[2] = new THREE.OrthographicCamera(
    window.innerWidth / -13,
    window.innerWidth / 13,
    window.innerHeight / 13,
    window.innerHeight / -13,
    1,
    1000
  );
  camera[2].position.set(0, 50, 0);
  camera[2].lookAt(scene.position);

  camera[3] = new THREE.OrthographicCamera(
    window.innerWidth / -19,
    window.innerWidth / 19,
    window.innerHeight / 19,
    window.innerHeight / -19,
    1,
    1000
  );
  camera[3].position.set(50, 50, 50);
  camera[3].lookAt(scene.position);

  camera[4] = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera[4].position.set(50, 50, 50);
  camera[4].lookAt(scene.position);

  camera[5] = camera[3]; // default camera
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createTrailer(obj, x, y, z) {
  "use strict";

  trailer = new THREE.Object3D();
  // top truck grey cube
  addBoxComponent(trailer, 0, 12, 0, 12, 14, 30, material[4]);
  // connection component
  addBoxComponent(trailer, 0, 4, 4.5, 9, 2, 3, material[2]);
  // bottom truck blue cube
  addBoxComponent(trailer, 0, 3, -7, 9, 4, 16, material[2]);
  addWheel(trailer, 5.25, 2, -6);
  addWheel(trailer, -5.25, 2, -6);
  addWheel(trailer, 5.25, 2, -11);
  addWheel(trailer, -5.25, 2, -11);

  obj.add(trailer);
  trailer.position.set(x, y, z);
}

function createRobot(obj, x, y, z) {
  "use strict";
  
  var robot = new THREE.Object3D();

  // Robot Top Part
  addTopPart(robot, 0, 11.5, 0);

  // Robot Bottom Part
  addBottomPart(robot, 0, 3, 0);

  obj.add(robot);
  robot.position.set(x, y, z);
}

function addTopPart(obj, x, y, z) {
  "use strict";
  
  var topPart = new THREE.Object3D();

  // HEAD
  addHead(topPart, 0, 5.5, -1);

  // TORSO red
  addBoxComponent(topPart, 0, 0, 0, 12, 11, 6, material[1]);
  // GLASS panel
  addBoxComponent(topPart, 0, 1.5, 2.51, 10, 6, 1, material[5]);

  // ABDOMEN gray
  addBoxComponent(topPart, 0, -7, 0, 6, 3, 4, material[3]);

  // ARMS
  //LEFT ARM
  addArm(topPart, -7.5, -6.5, -0.5);
  // RIGHT ARM
  addArm(topPart, 7.5, -6.5, -0.5);

  // WAIST gray
  addBoxComponent(topPart, 0, -9.5, 0, 9, 2, 4, material[2]);
  addWheel(topPart, 5.2, -9.5, 0);
  addWheel(topPart, -5.2, -9.5, 0);

  obj.add(topPart);
  topPart.position.set(x, y, z);
}

function addBottomPart(obj, x, y, z) {
  "use strict";
  bottomPart = new THREE.Object3D();

  // left leg blue
  addBoxComponent(bottomPart, -2.25, -10, 0, 4.5, 12, 4, material[2]);
  // right leg blue
  addBoxComponent(bottomPart, 2.25, -10, 0, 4.5, 12, 4, material[2]);

  // left top wheel black
  addWheel(bottomPart, -5.25, -8, 1, material[0]);
  // right top wheel black
  addWheel(bottomPart, 5.25, -8, 1, material[0]);
  // left bottom wheel black
  addWheel(bottomPart, -5.25, -13, 1, material[0]);
  // right bottom wheel black
  addWheel(bottomPart, 5.25, -13, 1, material[0]);

  // left Thight
  addBoxComponent(bottomPart, -2, -3, 0, 2, 2, 2, material[3]);
  // right Thight
  addBoxComponent(bottomPart, 2, -3, 0, 2, 2, 2, material[3]);
  // feet
  addFeet(bottomPart, 0, -16, 2);

  obj.add(bottomPart);
  bottomPart.position.set(x, y, z);
}

function addBoxComponent(
  obj,
  x,
  y,
  z,
  width,
  height,
  depth,
  componentMaterial
) {
  "use strict";
  geometry = new THREE.BoxGeometry(width, height, depth);
  mesh = new THREE.Mesh(geometry, componentMaterial);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addWheel(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(2, 2, 1.5, 32);
  mesh = new THREE.Mesh(geometry, material[0]);

  obj.add(mesh);
  mesh.position.set(x, y, z);
  mesh.rotation.z = Math.PI / 2;
}

function addEye(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  mesh = new THREE.Mesh(geometry, material[0]);
  obj.add(mesh);
  mesh.position.set(x, y, z);
  mesh.rotation.x = Math.PI / 2;
}

function addHead(obj, x, y, z) {
  "use strict";
  head = new THREE.Object3D();

  // Face
  addBoxComponent(head, 0, 1, 0, 4, 2, 2, material[2]);
  // Left Ear
  addBoxComponent(head, -2.25, 2, -0.25, 0.5, 2, 0.5, material[0]);
  // Right Ear
  addBoxComponent(head, 2.25, 2, -0.25, 0.5, 2, 0.5, material[0]);

  addEye(head, -1, 1, 0.51);
  addEye(head, 1, 1, 0.51);

  obj.add(head);
  head.position.set(x, y, z);
}

function addArm(obj, x, y, z) {
  "use strict";
  var arm = new THREE.Object3D();

  //FOREARM
  addBoxComponent(arm, 0, 0, 4.5, 3, 2, 6, material[2]);
  //ARM
  addBoxComponent(arm, 0, 6.5, 0, 3, 11, 3, material[2]);
  // EXHAUST PIPES
  addBoxComponent(arm, 0, 13, -2, 1, 8, 1, material[3]);

  obj.add(arm);
  arm.position.set(x, y, z);

  if (x > 0) {
    leftArm = arm;
    moveLeft = [arm.position.x, arm.position.y, arm.position.z];
  } else {
    rightArm = arm;
    moveRight = [arm.position.x, arm.position.y, arm.position.z];
  }
}

function addFeet(obj, x, y, z) {
  "use strict";
  feet = new THREE.Object3D();

  addBoxComponent(feet, 2.25, -1, 1.5, 4.5, 2, 3, material[2]);
  addBoxComponent(feet, -2.25, -1, 1.5, 4.5, 2, 3, material[2]);

  obj.add(feet);
  feet.position.set(x, y, z);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(x_delta, z_delta) {
  "use strict";

  const A_min_x = -6;
  const A_max_x = 6;
  const A_min_z = -7;
  const A_max_z = 3.5;

  const B_min_x = trailer.position.x + x_delta - 6;
  const B_max_x = trailer.position.x + x_delta + 6;
  const B_min_z = trailer.position.z + z_delta - 15;
  const B_max_z = trailer.position.z + z_delta + 14.9;

  if (
    A_max_x < B_min_x ||
    A_min_x > B_max_x ||
    A_max_z < B_min_z ||
    A_min_z > B_max_z
  ) {
    collision = false;
    return false;
  } else {
    collision = true;
    return true;
  }
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(clockDelta) {
  "use strict";

  var trailerFuturePosition = [
    trailer.position.x,
    trailer.position.y,
    trailer.position.z,
  ];

  if (trailer.position.x !== 0 || trailer.position.z !== -22) {
    var norm = Math.sqrt(
      Math.pow(0 - trailer.position.x, 2) +
        Math.pow(-22 - trailer.position.z, 2)
    );
    var x_delta = (0 - trailer.position.x) / norm;
    var z_delta = (-22 - trailer.position.z) / norm;
    trailerFuturePosition = [
      trailerFuturePosition[0] + x_delta * animationSpeed * clockDelta,
      trailerFuturePosition[1],
      trailerFuturePosition[2] + z_delta * animationSpeed * clockDelta,
    ];
    var x_variation = trailerFuturePosition[0] - 0;
    var z_variation = trailerFuturePosition[2] - -22;
    if (Math.abs(x_variation) < 0.3) trailerFuturePosition[0] = 0;
    if (Math.abs(z_variation) < 0.3) trailerFuturePosition[2] = -22;

    trailer.position.set(
      trailerFuturePosition[0],
      trailerFuturePosition[1],
      trailerFuturePosition[2]
    );
  } else {
    collision = false;
  }
}

////////////
/* UPDATE */
////////////

function update(clockDelta) {
  "use strict";

  if (
    headRotation <= -Math.PI &&
    feetRotation >= Math.PI / 2 &&
    legRotation >= Math.PI / 2 &&
    rightArm.position.x >= -4.5
  )
    robotInTractorMode = true;
  else robotInTractorMode = false;

  switchWireframe();
  if (robotInTractorMode && collision) {
    handleCollisions(clockDelta);
  } else {
    executeMovement(clockDelta);
  }
}

/////////////
/* DISPLAY */
/////////////
function render() {
  "use strict";

  renderer.render(scene, camera[5]);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
  "use strict";
  clock = new THREE.Clock();
  clock.start();

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  material[0] = new THREE.MeshBasicMaterial({
    color: "black",
    wireframe: true,
  });
  // red
  material[1] = new THREE.MeshBasicMaterial({ color: "red", wireframe: true });
  // blue
  material[2] = new THREE.MeshBasicMaterial({ color: "blue", wireframe: true });
  // grey
  material[3] = new THREE.MeshBasicMaterial({ color: "grey", wireframe: true });
  // lighter grey
  material[4] = new THREE.MeshBasicMaterial({
    color: 0x3f3f3f,
    wireframe: true,
  });
  material[5] = new THREE.MeshPhysicalMaterial({
    roughness: 0.7,
    transmission: 1,
    reflectivity: 1,
    shininess: 1,
    wireframe: true,
  });

  createScene();
  createCamera();

  render();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
  "use strict";
  var delta = clock.getDelta();
  update(delta);
  render();
  requestAnimationFrame(animate);
}

function headMovement(clockDelta) {
  "use strict";
  
  if (headMov[1] && headRotation < 0) {
    // to truck
    headRotation += rotationConst * clockDelta;
    if (headRotation > 0) {
      headRotation = 0;
      head.position.y += 0.02;
    }
  }
  if (headMov[0] && headRotation > -Math.PI) {
    // to robot
    headRotation -= rotationConst * clockDelta;
    if (headRotation < -Math.PI) {
      headRotation = -Math.PI;
      head.position.y -= 0.02;
    }
  }
}

function feetMovement(clockDelta) {
  "use strict";
  
  if (feetMov[0] && feetRotation >= 0) {
    // to truck
    feetRotation -= rotationConst * clockDelta;
    if (feetRotation < 0) feetRotation = 0;
  }
  if (feetMov[1] && feetRotation <= Math.PI / 2) {
    // to robot
    feetRotation += rotationConst * clockDelta;
    if (feetRotation > Math.PI / 2) feetRotation = Math.PI / 2;
  }
}

function legMovement(clockDelta) {
  "use strict";
  
  if (bottomMov[0] && legRotation >= 0) {
    // to truck
    legRotation -= rotationConst * clockDelta;
    if (legRotation < 0) legRotation = 0;
  }
  if (bottomMov[1] && legRotation <= Math.PI / 2) {
    // to robot
    legRotation += rotationConst * clockDelta;
    if (legRotation > Math.PI / 2) legRotation = Math.PI / 2;
  }
}

function armMovement(clockDelta) {
  "use strict";
  
  if (armMov[0]) {
    if (rightArm.position.x > -7.5) {
      // to truck
      moveRight = [
        rightArm.position.x -
          (1 / 4 / Math.sqrt(2)) * animationSpeed * clockDelta,
        rightArm.position.y,
        rightArm.position.z +
          (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta
      ];
      moveLeft = [
        leftArm.position.x +
          (1 / 4 / Math.sqrt(2)) * animationSpeed * clockDelta,
        leftArm.position.y,
        leftArm.position.z +
          (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta,
      ];
      console.log(rightArm.position.z +
        (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta);
      if ((rightArm.position.z + (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta) > -0.5 ){
        moveRight = [-7.5, rightArm.position.y, -0.5 ];
        moveLeft = [ 7.5, leftArm.position.y, -0.5 ];
      }
    }
  }
  if (armMov[1]) {
    if (rightArm.position.x < -4.5) {
      // to truck
      moveRight = [
        rightArm.position.x +
          (1 / 4 / Math.sqrt(2)) * animationSpeed * clockDelta,
        rightArm.position.y,
        rightArm.position.z -
          (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta,
      ];
      moveLeft = [
        leftArm.position.x -
          (1 / 4 / Math.sqrt(2)) * animationSpeed * clockDelta,
        leftArm.position.y,
        leftArm.position.z -
          (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta,
      ];

      if ((rightArm.position.z + (1 / 3 / Math.sqrt(2)) * animationSpeed * clockDelta )< -4.5){
        moveRight = [-4.5, rightArm.position.y, -4.5 ];
        moveLeft = [ 4.5, leftArm.position.y, -4.5 ];
      }
    }
  }
}

function executeMovement(clockDelta) {
  "use strict";
  
  var x_delta = 0,
    z_delta = 0;

  if (keyMap[0]) x_delta = -animationSpeed * clockDelta; // move left
  if (keyMap[1]) x_delta = animationSpeed * clockDelta; // move right
  if (keyMap[2]) z_delta = -animationSpeed * clockDelta; // move up
  if (keyMap[3]) z_delta = animationSpeed * clockDelta; // move down

  if (x_delta != 0 && z_delta != 0) {
    x_delta /= Math.sqrt(2);
    z_delta /= Math.sqrt(2);
  }

  // check if colision only if robot is on truck mode
  if (robotInTractorMode && checkCollisions(x_delta, z_delta)) return;

  if (headMov[0] || headMov[1]) headMovement(clockDelta);
  if (feetMov[0] || feetMov[1]) feetMovement(clockDelta);
  if (bottomMov[0] || bottomMov[1]) legMovement(clockDelta);
  if (armMov[0] || armMov[1]) armMovement(clockDelta);

  trailer.position.x += x_delta;
  trailer.position.y += 0;
  trailer.position.z += z_delta;

  head.rotation.x = headRotation;
  feet.rotation.x = feetRotation;
  bottomPart.rotation.x = legRotation;
  rightArm.position.set(moveRight[0], moveRight[1], moveRight[2]);
  leftArm.position.set(moveLeft[0], moveLeft[1], moveLeft[2]);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
  "use strict";

  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerHeight > 0 && window.innerWidth > 0) {
      const aspectRatio = window.innerWidth / window.innerHeight;
      camera.forEach(camera => {
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    });
  }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";

  switch (e.keyCode) {
    case 49: //1
      camera[5] = camera[0];
      break;
    case 50: //2
      camera[5] = camera[1];
      break;
    case 51: //3
      camera[5] = camera[2];
      break;
    case 52: //4
      camera[5] = camera[3];
      break;
    case 53: //5
      camera[5] = camera[4];
      break;
    case 54: //6
      changeFrameState = true;
      break;
    case 40: //down
      keyMap[3] = true;
      break;
    case 38: //up
      keyMap[2] = true;
      break;
    case 37: //left
      keyMap[0] = true;
      break;
    case 39: //right
      keyMap[1] = true;
      break;
    case 70: //f
      headMov[0] = true;
      break;
    case 82: //r
      headMov[1] = true;
      break;
    case 81: //q
      feetMov[0] = true;
      break;
    case 65: //a
      feetMov[1] = true;
      break;
    case 87: //w
      bottomMov[0] = true;
      break;
    case 83: //s
      bottomMov[1] = true;
      break;
    case 69:
      armMov[0] = true;
      break;
    case 68:
      armMov[1] = true;
      break;
  }
}

function switchWireframe() {
  "use strict";
  if(changeFrameState == false){
    updatedFrameState = false;
  }
  else if (changeFrameState == true && updatedFrameState == false){
    for (var i = 0; i < material.length; i++) {
      material[i].wireframe = !material[i].wireframe;
    }
    updatedFrameState = true;
  }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";

  switch (e.keyCode) {
    case 54:
      changeFrameState = false;
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
    case 70:
      headMov[0] = false;
      break;
    case 82:
      headMov[1] = false;
      break;
    case 81:
      feetMov[0] = false;
      break;
    case 65:
      feetMov[1] = false;
      break;
    case 87:
      bottomMov[0] = false;
      break;
    case 83:
      bottomMov[1] = false;
      break;
    case 69:
      armMov[0] = false;
      break;
    case 68:
      armMov[1] = false;
      break;
  }
}
