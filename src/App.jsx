import { useEffect } from 'react';
import * as THREE from 'three';
//import GLTFLoader from 'three-gltf-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  useEffect(() => {
    //let objects = [];

    const scene = new THREE.Scene();

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 50;

    const canvas = document.getElementById('myThreeJsCanvas')
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFC0CB, 2);
    ambientLight.castShadow = true;
    ambientLight.physicallyCorrectLights = true;
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.castShadow = true;
    spotLight.position.set(12, 64, 32);
    spotLight.physicallyCorrectLights = true;
    scene.add(spotLight);

    const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
    paintGeometry.antialias = true;
    const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
    const paintMaterial = new THREE.MeshBasicMaterial({ map: paintTexture });
    paintMaterial.metalness = 0.5;
    paintMaterial.roughness = 1;
    const paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
    scene.add(paintMesh);
    //objects.push(paintMesh);

    paintGeometry.userData = { URL: "https://github.com/GanyuHail/nb/blob/main/src/weOpMin.jpg" };

    //document.addEventListener('mousedown', onMouseDown);

    //function onMouseDown(event) {
      //event.preventDefault();

      //const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerheight) * 2 - 1, 0.5)
      //const raycaster = new THREE.Raycaster()
      //raycaster.setFromCamera(mouse3D, camera)
      //const intersects = raycaster.intersectObjects(objects, true);
      //if (intersects.length > 0) {
        //console.log("click!");
        //intersects[0].object.material.color.setHex(Math.random() * 0xffffff)
      //}
    //};

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      //renderer.setPixelRatio(window.devicePixelRatio);
      window.requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
};

export default App;
