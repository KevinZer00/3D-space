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




// Stars setup
const stars = []; // Holds all stars
function createStars() {
    const starGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 10000; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 500
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

    const galaxyCount = 50; // Number of galaxies to create
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
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 500,
            -5 - (Math.random() * 500) // Spread galaxies out in depth
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


// Function to create 3D text
function createText(text, position) {
    const loader = new THREE.FontLoader();

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.x = position.x;
        textMesh.position.y = position.y; // Adjust Y position to be above the planet
        textMesh.position.z = position.z;

        scene.add(textMesh);
    });
}


// Function to create  Pluto
function createPluto() {
    // Pluto geometry
    const plutoGeometry = new THREE.SphereGeometry(0.25, 32, 32);

    // Pluto material with texture
    const plutoTexture = new THREE.TextureLoader().load('textures/pluto.jpg'); // Replace with the path to your Pluto texture image
    const plutoMaterial = new THREE.MeshPhongMaterial({ map: plutoTexture });

    // Pluto mesh
    const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);

    // Position the Pluto in the scene
    pluto.position.z = -30;
    pluto.position.x = 0;
    pluto.position.y = 0;

    // Add Pluto to the scene
    scene.add(pluto);

    // Return the Pluto mesh for animation
    return pluto;
}
// Call createPlutoand store the reference to the Earth mesh
const pluto = createPluto();
const plutoPosition = pluto.position.clone();
plutoPosition.y += 0.5;
plutoPosition.x -= 0.75;
createText('Pluto', plutoPosition);



// Function to create  Moon
function createMoon() {
    // Moon geometry
    const moonGeometry = new THREE.SphereGeometry(0.35, 32, 32);

    // Moon material with texture
    const moonTexture = new THREE.TextureLoader().load('textures/moon.jpg');
    const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });

    // Moon mesh
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Position the Pluto in the scene
    moon.position.z = -60;
    moon.position.x = 0;
    moon.position.y = 1;

    // Add Moon to the scene
    scene.add(moon);

    // Return the Moon mesh for animation
    return moon;
}
// Call create Moon and store the reference to the Earth mesh
const moon = createMoon();
const moonPosition = moon.position.clone();
moonPosition.y += 1;
moonPosition.x -= 0.75;
createText('Moon', moonPosition);


// Function to create  Mercury
function createMercury() {
    // Mercury geometry
    const mercuryGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    // Mercury material with texture
    const mercuryTexture = new THREE.TextureLoader().load('textures/mercury.jpg'); // Replace with the path to your Mercury texture image
    const mercuryMaterial = new THREE.MeshPhongMaterial({ map: mercuryTexture });

    // Earth mesh
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

    // Position the Mercury in the scene
    mercury.position.z = -90;
    mercury.position.x = 0;
    mercury.position.y = 2;

    // Add Mercury to the scene
    scene.add(mercury);

    // Return the Mercury mesh for animation
    return mercury;
}
// Call createMercury and store the reference to the Earth mesh
const mercury = createMercury();
const mercuryPosition = mercury.position.clone();
mercuryPosition.y += 1;
mercuryPosition.x -= 1.15;
createText('Mercury', mercuryPosition);



// Function to create  Mercury
function createMars() {
    // Mars geometry
    const marsGeometry = new THREE.SphereGeometry(0.6, 32, 32);

    // Mars material with texture
    const marsTexture = new THREE.TextureLoader().load('textures/mars.jpg');
    const marsMaterial = new THREE.MeshPhongMaterial({ map: marsTexture });

    // Mars mesh
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);

    // Position the Marsin the scene
    mars.position.z = -120;
    mars.position.x = 0;
    mars.position.y = 3;

    // Add Mars to the scene
    scene.add(mars);

    // Return the Mars mesh for animation
    return mars;
}
// Call createMars and store the reference to the Earth mesh
const mars = createMars();
const marsPosition = mars.position.clone();
marsPosition.y += 1;
marsPosition.x -= 0.8;
createText('Mars', marsPosition);






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
    venus.position.z = -150;
    venus.position.x = 0;
    venus.position.y = 4;

    // Add Earth to the scene
    scene.add(venus);

    // Return the Earth mesh for animation
    return venus;
}
// Call createEarth and store the reference to the Earth mesh
const venus = createVenus();
const venusPosition = venus.position.clone();
venusPosition.y += 1.5; // Increase this value to move the text higher
venusPosition.x -= 1;
createText('Venus', venusPosition);


// Function to create Earth
function createEarth() {
    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(1.25, 32, 32);

    // Earth material with texture
    const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg'); // Replace with the path to your Earth texture image
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });

    // Earth mesh
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Position the Earth in the scene
    earth.position.z = -180;
    earth.position.x = 0;
    earth.position.y = 5;

    // Add Earth to the scene
    scene.add(earth);

    // Return the Earth mesh for animation
    return earth;
}
// Call createEarth and store the reference to the Earth mesh
const earth = createEarth();
const earthPosition = earth.position.clone();
earthPosition.y += 2;
earthPosition.x -= 0.8;
createText('Earth', earthPosition);



// Function to create  Neptune
function createNeptune() {
    // Neptune geometry
    const neptuneGeometry = new THREE.SphereGeometry(6, 32, 32);

    // Neptune material with texture
    const neptuneTexture = new THREE.TextureLoader().load('textures/neptune.jpg');
    const neptuneMaterial = new THREE.MeshPhongMaterial({ map: neptuneTexture });

    // Neptune mesh
    const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

    // Position the Neptune in the scene
    neptune.position.z = -240;
    neptune.position.x = 0;
    neptune.position.y = 6;

    // Add Neptuneto the scene
    scene.add(neptune);

    // Return the Neptune mesh for animation
    return neptune;
}
// Call createNeptune and store the reference to the Earth mesh
const neptune = createNeptune();
const neptunePosition = neptune.position.clone();
neptunePosition.y += 7;
neptunePosition.x -= 1.25;
createText('Neptune', neptunePosition);


// Function to create  Uranus
function createUranus() {
    // Uranus geometry
    const uranusGeometry = new THREE.SphereGeometry(7, 32, 32);

    // Uranus material with texture
    const uranusTexture = new THREE.TextureLoader().load('textures/uranus.jpg');
    const uranusMaterial = new THREE.MeshPhongMaterial({ map: uranusTexture });

    // Uranus mesh
    const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

    // Position the Uranus in the scene
    uranus.position.z = -300;
    uranus.position.x = 0;
    uranus.position.y = 7;

    // Add Uranus to the scene
    scene.add(uranus);

    // Return the Uranus mesh for animation
    return uranus;
}
// Call createUranus and store the reference to the Earth mesh
const uranus = createUranus();
const uranusPosition = uranus.position.clone();
uranusPosition.y += 8;
uranusPosition.x -= 1.25;
createText('Uranus', uranusPosition);



// Function to create Saturn with rings
function createSaturn() {
    // Saturn geometry
    const saturnGeometry = new THREE.SphereGeometry(20, 32, 32);

    // Saturn material with texture
    const saturnTexture = new THREE.TextureLoader().load('textures/saturn.jpg');
    const saturnMaterial = new THREE.MeshPhongMaterial({ map: saturnTexture });

    // Saturn mesh
    const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);

    // Position the Saturn in the scene
    saturn.position.z = -360;
    saturn.position.x = 0;
    saturn.position.y = 8;
    
    // Add Saturn to the scene
    scene.add(saturn);

    // Saturn's rings
    const ringGeometry = new THREE.RingGeometry(25, 35, 64); // adjust the inner and outer radius as needed
    const ringTexture = new THREE.TextureLoader().load('textures/saturn-ring.png'); // replace with your ring texture
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2; // to align with the ecliptic
    ringMesh.position.set(saturn.position.x, saturn.position.y, saturn.position.z);
    scene.add(ringMesh);

    // Return the Saturn mesh for animation
    return saturn;
}

// Call createSaturn and store the reference
const saturn = createSaturn();
const saturnPosition = saturn.position.clone();
saturnPosition.y += 8;
saturnPosition.x -= 1.25;
createText('Saturn', saturnPosition);


// Function to create Jupiter
function createJupiter() {
    // Jupiter geometry
    const jupiterGeometry = new THREE.SphereGeometry(40, 32, 32);

    // Jupiter material with texture
    const jupiterTexture = new THREE.TextureLoader().load('textures/jupiter.jpg');
    const jupiterMaterial = new THREE.MeshPhongMaterial({ map: jupiterTexture });

    // Jupiter mesh
    const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

    // Position the Jupiter in the scene
    jupiter.position.z = -500;
    jupiter.position.x = 0;
    jupiter.position.y = 9;

    // Add Jupiter to the scene
    scene.add(jupiter);

    // Return the Jupiter mesh for animation
    return jupiter;
}

// Call createJupiter and store the reference
const jupiter = createJupiter();
const jupiterPosition = jupiter.position.clone();
jupiterPosition.y += 8;
jupiterPosition.x -= 1.25;
createText('Jupiter', jupiterPosition);








// Function to create the Sun
function createSun() {
    // Earth geometry
    const sunGeometry = new THREE.SphereGeometry(500, 32, 32);

    // Earth material with texture
    const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg'); // Replace with the path to your Sun texture image
    const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });

    // Earth mesh
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Position the Sun in the scene
    sun.position.z = -1200;
    sun.position.x = 0;
    sun.position.y = 0;

    // Add Earth to the scene
    scene.add(sun);

    // Return the Sun mesh for animation
    return sun;
}
const sun = createSun();
const sunPosition = sun.position.clone();
sunPosition.y += 20;
createText('Sun', sunPosition);



// Function to animate all the objects' rotation
function animateObjects() {
    pluto.rotation.y += 0.001;
    moon.rotation.y += 0.001;
    mercury.rotation.y += 0.001;
    mars.rotation.y += 0.001;
    earth.rotation.y += 0.001;
    neptune.rotation.y += 0.001;
    uranus.rotation.y += 0.001;
    saturn.rotation.y += 0.0005;
    jupiter.rotation.y += 0.0005;
    sun.rotation.y += 0.0001;


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

    // No need to update camera.lookAt here if updateCameraPosition is being called on scroll

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


// Define camera start and end positions
const startZ = 0;    // Starting Z position of the camera
const endZ = -1500;   // End Z position of the camera, should match with the Z position of the furthest object
const startY = 0;  // Starting Y position of the camera
const endY = 200;     // End Y position of the camera, to ensure the largest planet fits in the view

// This function updates the camera position and the point it should look at based on the current scroll progress.
function updateCameraPosition(progress) {
    // Ensure the progress starts at 0
    progress = Math.max(progress, 0); // Clamps the lower end at 0
    const zPosition = THREE.MathUtils.lerp(startZ, endZ, progress);
    const yPosition = THREE.MathUtils.lerp(startY, endY, progress);
  
    camera.position.z = zPosition;
    // Prevent the immediate jump to endY at the start
    camera.position.y = progress === 0 ? startY : yPosition;
  
    const lookAtPosition = new THREE.Vector3(camera.position.x, 0, zPosition - 100);
    camera.lookAt(lookAtPosition);
  }
  
// Setup ScrollTrigger
ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "200% bottom", // This will make the animation complete over a longer scroll distance
    onUpdate: (self) => {
        // Call updateCameraPosition with the current scroll progress.
        updateCameraPosition(self.progress);
    },
    scrub: true
});








