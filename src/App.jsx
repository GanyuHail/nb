// //@ts-check

import { useEffect } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
// import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let selectedObject = null;

function App() {
  useEffect(() => {

    const scene = new THREE.Scene();

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 80;

    const canvas = document.getElementById('myThreeJsCanvas')
    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: true
    });
    renderer.xrCompatible = true;
    //renderer.antialias = true; 
    window.addEventListener('resize', onWindowResize, false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    // VR Controller

    // controller1 = renderer.xr.getController(0);
    // controller1.addEventListener('selectstart', onSelectStart);
    // controller1.addEventListener('selectend', onSelectEnd);
    // scene.add(controller1);

    // controller2 = renderer.xr.getController(1);
    // controller2.addEventListener('selectstart', onSelectStart);
    // controller2.addEventListener('selectend', onSelectEnd);
    // scene.add(controller2);

    // const controllerModelFactory = new XRControllerModelFactory();

    // controllerGrip1 = renderer.xr.getControllerGrip(0);
    // controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    // scene.add(controllerGrip1);

    // controllerGrip2 = renderer.xr.getControllerGrip(1);
    // controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    // scene.add(controllerGrip2);

    // function onSelectStart(event) {

    //   const controller = event.target;

    //   const intersections = getIntersections(controller);

    //   if (intersections.length > 0) {

    //     const intersection = intersections[0];

    //     const object = intersection.object;
    //     object.material.emissive.b = 1;
    //     controller.attach(object);

    //     controller.userData.selected = object;

    //   }

    // }

    // function onSelectEnd(event) {

    //   const controller = event.target;

    //   if (controller.userData.selected !== undefined) {

    //     const object = controller.userData.selected;
    //     object.material.emissive.b = 0;
    //     group.attach(object);

    //     controller.userData.selected = undefined;

    //   }


    // }

    // function getIntersections(controller) {

    //   tempMatrix.identity().extractRotation(controller.matrixWorld);

    //   raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    //   raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    //   return raycaster.intersectObjects(group.children, false);

    // }

    // function intersectObjects(controller) {

    //   // Do not highlight when already selected

    //   if (controller.userData.selected !== undefined) return;

    //   const line = controller.getObjectByName('line');
    //   const intersections = getIntersections(controller);

    //   if (intersections.length > 0) {

    //     const intersection = intersections[0];

    //     const object = intersection.object;
    //     object.material.emissive.r = 1;
    //     intersected.push(object);

    //     line.scale.z = intersection.distance;

    //   } else {

    //     line.scale.z = 5;

    //   }

    // }

    // function cleanIntersected() {

    //   while (intersected.length) {

    //     const object = intersected.pop();
    //     object.material.emissive.r = 0;

    //   }

    // }

    // Lights

    const ambientLight = new THREE.AmbientLight(0xFFC0CB, 1);
    ambientLight.castShadow = true;
    ambientLight.physicallyCorrectLights = true;
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.castShadow = true;
    spotLight.position.set(12, 64, 32);
    spotLight.physicallyCorrectLights = true;
    scene.add(spotLight);

    // Painting

    const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
    paintGeometry.antialias = true;
    const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
    const paintMaterial = new THREE.MeshBasicMaterial({ map: paintTexture });
    paintMaterial.metalness = 0.5;
    paintMaterial.roughness = 1;
    const paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
    scene.add(paintMesh);

    paintGeometry.userData = { URL: "https://github.com/GanyuHail/nb/blob/main/src/weOpMin.jpg" };

    // Raycaster

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onMouseDown);
    window.addEventListener('touchend', touchEnd);
    console.log(onMouseDown);

    function onPointerMove(event) {
      if (selectedObject) {
        selectedObject.material.color.set('white');
        selectedObject = null;
      }

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        const intersect = intersects[i];

        if (intersect && intersect.object) {
          selectedObject = intersect.object;
          intersect.object.material.color.set('pink');
        }
      }
    };

    function onMouseDown(event) {
      if (selectedObject) {
        window.location.href = "/nb/page2.html";
      }
    };

    function touchEnd(event) {
      if (selectedObject) {
        window.location.href = "/nb/page2.html";
      }
    };

    function render() {

      cleanIntersected();

      intersectObjects( controller1 );
      intersectObjects( controller2 );

      renderer.render(scene, camera);
    };

    window.requestAnimationFrame(render);

    // Orbit Controls 

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      controls.update();
      //renderer.setAnimationLoop();
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    animate();

    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });

    // Resize

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
};

export default App;
