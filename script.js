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

// Google Sheets Integration
// Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyk70ZME6jsBnBSESRh5H7P4VigQuM1ry6kvSAgadN4gh4tivyGqU1lPFh7hB5fIxDK6Q/exec';

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const loadingText = document.getElementById('loadingText');
  const formMessage = document.getElementById('formMessage');
  const messageText = document.getElementById('messageText');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    formMessage.classList.add('hidden');

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };

    try {
      // Send data to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // Show success message
      showMessage('Thank you! Your message has been sent successfully.', 'success');
      contactForm.reset();

    } catch (error) {
      console.error('Error:', error);
      showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      loadingText.classList.add('hidden');
    }
  });

  function showMessage(message, type) {
    messageText.textContent = message;
    formMessage.classList.remove('hidden');

    if (type === 'success') {
      formMessage.className = 'mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-300';
    } else {
      formMessage.className = 'mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300';
    }

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  }
});
