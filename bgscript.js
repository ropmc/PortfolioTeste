import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';

// create a new scene
    const scene = new THREE.Scene();
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    
    // create a new camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 0;
    camera.position.x = 0;
    camera.rotateX(0.08);
    camera.rotateY(0.01);

    // TESTE LIGHT
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 5).normalize();
    scene.add(light);

    // Criando um cubo
    const geometry = new THREE.SphereGeometry(0.3, 0.2, 10, 0, 5);
    const material = new THREE.LineBasicMaterial({ color: 0xbe2596 });
    const cube = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x9966ff });
    const wireframeCube = new THREE.LineSegments(wireframe, wireframeMaterial);
    scene.add(wireframeCube);
    scene.add(cube);
    cube.position.y+=5;
    cube.position.x +=14.7;
    wireframeCube.position.y+=5;
    wireframeCube.position.x +=14.7;
    
    // create a new renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    loader.load(
  // URL of the glTF file
  'cubocentro.glb',
  // Callback function called when the model is loaded
  (gltf) => {
    console.log('Loaded.')
    // Get the animation
    const animations = gltf.animations;
    const numAnimations = animations.length;

    // Create a mixer to play the animation
    const mixer = new THREE.AnimationMixer(gltf.scene);
    //mixer.timeScale(0);

    // Create an animation action from the animation
    const actions = []
    for (let i=0; i<numAnimations; i++) {
      const animation = animations[i];
      animation.duration = 15;
      const action = mixer.clipAction(animation);
      action.loop = THREE.LoopOnce;
      actions.push(action);
    }

    actions.forEach(action => action.play());

    // Add the model to the scene
    scene.add(gltf.scene);
    

    // Render the scene
    //renderer.render(scene, camera);

    // Update the mixer on every frame to play the animation
    let prevTime = 0;
    let speed = 0.1;
    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      wireframeCube.rotation.x += 0.01;
      wireframeCube.rotation.y += 0.01;

      const time = performance.now();
      const deltaTime = (time - prevTime)*0.001;
      prevTime = time;
      mixer.update(deltaTime);
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL();
      document.body.style.background = `url(${dataUrl}) no-repeat center center fixed`;
    };
    animate();
  },
  // Callback function called when there is an error loading the model
  (error) => {
    console.error(error);
  }
);

    
    
    // set the rendered output as the background image of the HTML body element

    document.body.style.backgroundSize = "cover";