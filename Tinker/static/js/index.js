window.HELP_IMPROVE_VIDEOJS = false;
// Add Three.js mesh viewer to display mesh/75.glb
function initMeshViewer() {
  const container = document.getElementById('mesh-viewer');
  // If the container is missing or Three.js hasn't loaded, abort early.
  if (!container || typeof THREE === 'undefined') {
    console.warn('Mesh viewer container or THREE.js not available');
    return;
  }

  // Clear any previous renderers to avoid duplicates on hot-reload.
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const scene = new THREE.Scene();
  scene.background = null;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  function setRendererSize() {
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  setRendererSize();
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  const loader = new THREE.GLTFLoader();
  loader.load(
    './mesh/output.glb',
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Compute bounding box to frame the model.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      controls.target.copy(center);
      camera.position.copy(center);
      camera.position.z += size * 1.5;
      camera.position.y += size * 0.2;
      camera.near = size / 100;
      camera.far = size * 100;
      camera.updateProjectionMatrix();
    },
    (xhr) => {
      // Progress callback
      const percent = (xhr.loaded / xhr.total) * 100;
      if (!isNaN(percent)) {
        console.log(`Mesh loading: ${percent.toFixed(1)}%`);
      }
    },
    (error) => {
      console.error('Failed to load GLB:', error);
    }
  );

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    setRendererSize();
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    // Initialize the mesh viewer after the page components load.
    initMeshViewer();

})