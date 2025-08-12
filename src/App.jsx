import { useEffect } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let selectedObject = null;

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 0, 80);

    // Create renderer
    const canvas = document.getElementById('myThreeJsCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.xr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add VR button for WebXR
    document.body.appendChild(VRButton.createButton(renderer));

    // Add painting with texture
    const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
    const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
    paintTexture.colourSpace = THREE.SRGBColorSpace; // removed linear

    // Material for the front and back faces (with texture)
    const material = new THREE.MeshPhongMaterial({ // was MeshStandardMat
      map: paintTexture,
      metalness: 1.5, // was 0.8
      roughness: 1.5, // was 0.8
      // emissive: new THREE.Color(0x111111),
      // emissiveIntensity: 7.5, // was 0.8, 15 negative
    });

    const paintMesh = new THREE.Mesh(paintGeometry, material);
    scene.add(paintMesh);

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);  // Slightly decrease ambient light
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 50);  // Increase spotlight intensity, was 15
    spotLight.castShadow = true;
    spotLight.position.set(0, 100, 100);  // Position above and slightly in front of the object
    spotLight.angle = Math.PI / 6;  // Narrow the spotlight beam to focus
    spotLight.penumbra = 0.2;  // Soft edges for the spotlight
    spotLight.target = paintMesh;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Raycaster and pointer for interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Handle pointer movement (hovering)
    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];

        if (intersect.object && intersect.object.material && intersect.object.material.color) {  // Ensure material and color exist
          if (selectedObject !== intersect.object) {
            // Reset the previously selected object's color
            if (selectedObject) {
              selectedObject.material.color.set(0xffffff);  // Reset to original color
            }

            // Set the new selected object
            selectedObject = intersect.object;
            selectedObject.material.color.set('pink');  // Highlight the selected object with pink
          }
        }
      } else {
        if (selectedObject) {
          // Reset color when no object is intersected
          selectedObject.material.color.set(0xffffff);  // Reset to original color
          selectedObject = null;
        }
      }
    }

    // Handle clicks or touch events for navigation
    function handleNavigation(event) {
      if (selectedObject && selectedObject.material) {
        console.log('Object clicked:', selectedObject);  // Test if the object is clicked
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
      controls.update();  // Update camera controls
      renderer.render(scene, camera);  // Render the scene with the camera
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
