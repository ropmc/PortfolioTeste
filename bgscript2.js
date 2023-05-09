import * as THREE from 'three';
import {GLTFLoader} from './three/examples/jsm/loaders/GLTFLoader.js'

// Create a new scene
const scene2 = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 6;

// Create a new renderer
const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer2.setSize(300, 300);

// TESTE LIGHT
const light = new THREE.SpotLight(0xffffff, .8);
light.position.set(0, 8, 15).normalize();
light.angle = Math.PI/1;
light.penumbra = 0.5;

scene2.add(light);

// Get the div to render on
const div = document.getElementsByClassName('div-block-5')[0];
div.appendChild(renderer2.domElement);
renderer2.domElement.style.borderRadius = '100%';
renderer2.domElement.style.position = '50%';

// Declare the mixer variable outside the loader2.load() callback function
let mixer;

// load the GLTF model
const loader2 = new GLTFLoader();
loader2.load(
  '/models/FotoGirando.glb', // the path to the GLTF file
  (gltf2) => {
    // set the scale of the model
    gltf2.scene.scale.set(3.2, 3.2, 3.2);
    gltf2.scene.position.y += 0.6  ;
    // add the model to the scene
    scene2.add(gltf2.scene);

    // Get the animation
    const animations = gltf2.animations;
    const numAnimations = animations.length;

    // Create a mixer to play the animation
    mixer = new THREE.AnimationMixer(gltf2.scene);

    // Create an animation action from the animation
    const actions = [];
    for (let i=0; i<numAnimations; i++) {
      const animation = animations[i];
      animation.duration = 15;
      const action = mixer.clipAction(animation);
      action.loop = THREE.LoopOnce;
      actions.push(action);
    }

    actions.forEach(action => action.play());
  },
  (xhr) => {
    // called while loading is progressing
    console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
  },
  (error) => {
    // called when loading has errors
    console.error(error);
  }
);

// Animate the cube rotation
let prevTime = 0;
function animate() {
  requestAnimationFrame(animate);
  const time = performance.now();
  const deltaTime = (time - prevTime)*0.001;
  prevTime = time;

  // Check if the mixer is defined before updating it
  if (mixer) {
    mixer.update(deltaTime);
  }

  renderer2.render(scene2, camera);
}

animate();
