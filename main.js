let textMesh;

// Set up Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('bg') });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//Initial camera's z position
camera.position.z = 20;

// Stars setup
const stars = []; // Holds all stars
function createStars() {
    const starGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        stars.push(star);
        scene.add(star);
    }
}


//Create galaxies
function createGalaxies() {
    const galaxyMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        blending: THREE.AdditiveBlending // This makes the galaxies glow
    });

    const galaxyCount = 10; // Number of galaxies to create
    for (let i = 0; i < galaxyCount; i++) {
        const particles = [];
        const spiralArms = 2 + Math.floor(Math.random() * 3); // Random number of spiral arms
        const particlesPerArm = 50 + Math.floor(Math.random() * 50); // Random number of particles

        for (let j = 0; j < spiralArms; j++) {
            const armAngle = (j / spiralArms) * Math.PI * 2;
            for (let k = 0; k < particlesPerArm; k++) {
                const distance = Math.random() * 1.5; // Spread the particles out more
                const angle = armAngle + distance * 2;
                const x = distance * Math.cos(angle);
                const y = distance * Math.sin(angle);
                const z = (Math.random() - 0.5) * 0.2;
                particles.push(x, y, z);
            }
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3));
        const particleCount = spiralArms * particlesPerArm;
        const colors = [];
        for (let i = 0; i < particleCount; i++) {
            const color = new THREE.Color();
            // Random color for each particle
            color.setHSL(Math.random(), 0.7, 0.7 + Math.random() * 0.3);
            colors.push(color.r, color.g, color.b);
        }
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create Points with geometry and material
        const galaxy = new THREE.Points(particleGeometry, galaxyMaterial);

        // Random position for each galaxy
        galaxy.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            -5 - (Math.random() * 200) // Spread galaxies out in depth
        );

        scene.add(galaxy);
    }
}



// Create other celestial objects
function createAsteroids() {
    const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    for (let i = 0; i < 100; i++) {
        const asteroidMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333
        });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
        scene.add(asteroid);
    }
}

createStars();
createGalaxies();
createAsteroids();


// Function to create the Sun
function createSun() {
    // Earth geometry
    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);

    // Earth material with texture
    const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg'); // Replace with the path to your Sun texture image
    const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });

    // Earth mesh
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Position the Sun in the scene
    sun.position.z = -120;
    sun.position.y = 0;

    // Add Earth to the scene
    scene.add(sun);

    // Return the Sun mesh for animation
    return sun;
}
const sun = createSun();

// Function to create Earth
function createVenus() {
    // Venus geometry
    const venusGeometry = new THREE.SphereGeometry(1, 32, 32);

    // Venus material with texture
    const venusTexture = new THREE.TextureLoader().load('textures/venus.jpg'); // Replace with the path to your Earth texture image
    const venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture });

    // Venus mesh
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);

    // Position the Venusin the scene
    venus.position.z = -80;
    venus.position.y = 0;

    // Add Earth to the scene
    scene.add(venus);

    // Return the Earth mesh for animation
    return venus;
}
// Call createEarth and store the reference to the Earth mesh
const venus = createVenus();

// Function to create Earth
function createEarth() {
    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);

    // Earth material with texture
    const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg'); // Replace with the path to your Earth texture image
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });

    // Earth mesh
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Position the Earth in the scene
    earth.position.z = -40;
    earth.position.y = 0;

    // Add Earth to the scene
    scene.add(earth);

    // Return the Earth mesh for animation
    return earth;
}
// Call createEarth and store the reference to the Earth mesh
const earth = createEarth();








// Function to animate all the objects' rotation
function animateObjects() {
    earth.rotation.y += 0.001; 
    sun.rotation.y += 0.001;
    venus.rotation.y += 0.001;
}




function animate() {
    requestAnimationFrame(animate);

    // Star animation logic here...
    stars.forEach(star => {
        star.rotation.x += (Math.random() - 0.5) * 0.002;
        star.rotation.y += (Math.random() - 0.5) * 0.002;
    });

    // Rotate the celestial objects
    animateObjects();


    renderer.render(scene, camera);
}


animate();


// Resize canvas on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


window.addEventListener('scroll', () => {
    console.log(window.scrollY);
});

// Create a curve for the camera to follow
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 20),
    new THREE.Vector3(-5, 0, -20),
    new THREE.Vector3(5, 0, -40),
    new THREE.Vector3(0, 0, -60),
    new THREE.Vector3(-5, 0, -80),
    new THREE.Vector3(0, 0, -100),
    new THREE.Vector3(5, 0, -120)
]);

// Function to update the camera position along the curve based on scroll progress
function updateCameraPosition(progress) {
    const point = curve.getPoint(progress); // Get the point on the curve at the given progress
    camera.position.set(point.x, point.y, point.z);
}

// GSAP ScrollTrigger for camera movement
ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
        const progress = self.progress;
        updateCameraPosition(progress); // Update the camera position along the curve
    },
    scrub: true
});

