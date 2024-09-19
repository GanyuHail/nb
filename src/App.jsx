import { useEffect } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let selectedObject = null;

function App() {
  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 0, 80);

    // Create renderer
    const canvas = document.getElementById('myThreeJsCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.xr.enabled = true;  // Enable WebXR (VR)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Add VR button for WebXR
    document.body.appendChild(VRButton.createButton(renderer));

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xFFC0CB, 1);  // Pinkish ambient light
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.castShadow = true;
    spotLight.position.set(12, 64, 32);
    scene.add(spotLight);

    // Add painting with texture
    const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
    const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
    const paintMaterial = new THREE.MeshStandardMaterial({ map: paintTexture });
    const paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
    scene.add(paintMesh);

    // Raycaster and pointer for interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Handle pointer movement (hovering)
    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (selectedObject !== intersect.object) {
          if (selectedObject) selectedObject.material.color.set('white'); // Reset color
          selectedObject = intersect.object;
          selectedObject.material.color.set('pink'); // Highlight selected object
        }
      }
    }

    // Handle click or touch events for navigation
    function handleNavigation() {
      if (selectedObject) {
        window.location.href = "/nb/page2.html";  // Navigate to another page
      }
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', handleNavigation);
    window.addEventListener('touchend', handleNavigation);

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);

    // Animation loop for rendering and controls update
    renderer.setAnimationLoop(() => {
      controls.update(); // Update camera controls
      renderer.render(scene, camera);  // Render the scene with camera
    });

    // Handle window resizing
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

  }, []);

  return (
    <div>
      <div className="vertical-center">
        <a href="https://henhail.com/">
          <button className="round">&#8592;</button>
        </a>
      </div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
