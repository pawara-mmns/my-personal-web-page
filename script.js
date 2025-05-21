tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        secondary: "#333333",
        accent: "#ffffff",
        light: "#f5f5f5",
      },
    },
  },
};

// Initialize AOS with updated settings
AOS.init({
  duration: 1000,
  once: false,
  offset: 100,
  mirror: true,
  easing: "ease-in-out",
});

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add fade-in animation on scroll
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((element) => {
  observer.observe(element);
});

// Three.js Background Animation
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

const canvas = document.getElementById("bg-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);


function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

// Create geometric particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  color: "#ffffff",
  transparent: true,
  opacity: 0.8,
  vertexColors: false,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;


function animate() {
  requestAnimationFrame(animate);

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  
  particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
  particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;
  
  const hue = (mouseX / window.innerWidth) * 0.1;
  const saturation = 0.1;
  const lightness = 0.5 + (mouseY / window.innerHeight) * 0.2;
  particlesMaterial.color.setHSL(hue, saturation, lightness);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hero Canvas Animation
const heroCanvas = document.getElementById("hero-canvas");
const heroRenderer = new THREE.WebGLRenderer({
  canvas: heroCanvas,
  alpha: true,
  antialias: true,
});
heroRenderer.setPixelRatio(window.devicePixelRatio);
heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);

const heroScene = new THREE.Scene();
const heroCamera = new THREE.PerspectiveCamera(
  75,
  heroCanvas.clientWidth / heroCanvas.clientHeight,
  0.1,
  1000
);
heroCamera.position.z = 3.5; // Adjusted camera position

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
heroScene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Stronger white light from a direction
directionalLight.position.set(2, 2, 5); // Position the light
heroScene.add(directionalLight);

const heroGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const heroMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff, // White color
  metalness: 0.9, // Highly metallic
  roughness: 0.3, // Moderately smooth sheen
});
const torusKnotMesh = new THREE.Mesh(heroGeometry, heroMaterial);
heroScene.add(torusKnotMesh);

let heroMouseX = 0;
let heroMouseY = 0;

if (heroCanvas) {
  heroCanvas.addEventListener('mousemove', (event) => {
    const rect = heroCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    heroMouseX = (x / rect.width) * 2 - 1;
    heroMouseY = -((y / rect.height) * 2 - 1);
  });

  heroCanvas.addEventListener('mouseleave', () => {
    heroMouseX = 0;
    heroMouseY = 0;
  });
}

function animateHero() {
  requestAnimationFrame(animateHero);

  const targetRotationX = heroMouseY * 0.5;
  const targetRotationY = heroMouseX * 0.5;

  torusKnotMesh.rotation.x += (targetRotationX - torusKnotMesh.rotation.x) * 0.05 + 0.001;
  torusKnotMesh.rotation.y += (targetRotationY - torusKnotMesh.rotation.y) * 0.05 + 0.001;

  heroRenderer.render(heroScene, heroCamera);
}

animateHero();

window.addEventListener("resize", () => {
  heroCamera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
  heroCamera.updateProjectionMatrix();
  heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
});
