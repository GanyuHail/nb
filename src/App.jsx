import { useEffect } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let selectedObject = null;

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 80;

    const canvas = document.getElementById('myThreeJsCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFC0CB, 1);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.castShadow = true;
    spotLight.position.set(12, 64, 32);
    scene.add(spotLight);

    // Painting
    const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
    const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
    const paintMaterial = new THREE.MeshStandardMaterial({ map: paintTexture });
    const paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
    scene.add(paintMesh);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (selectedObject !== intersect.object) {
          if (selectedObject) selectedObject.material.color.set('white');
          selectedObject = intersect.object;
          selectedObject.material.color.set('pink');
        }
      }
    }

    function handleNavigation() {
      if (selectedObject) {
        window.location.href = "/nb/page2.html";
      }
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', handleNavigation);
    window.addEventListener('touchend', handleNavigation);

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);
  }, []);

  return (
    <div>
      <div class="vertical-center">
        <a href="https://henhail.com/">
          <button class="round">&#8592;</button>
        </a>
      </div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
