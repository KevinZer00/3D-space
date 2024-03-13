let textMesh;

// Set up Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('bg') });

camera.position.set(0, 0, 0);

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
    const starGeometry = new THREE.SphereGeometry(1, 6, 6);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 20000; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
            (Math.random() - 0.5) * 10000,
            (Math.random() - 0.5) * 10000,
            (Math.random() - 0.5) * 10000
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

    const galaxyCount = 10000; // Number of galaxies to create
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
            (Math.random() - 0.5) * 10000,
            (Math.random() - 0.5) * 10000,
            -5 - (Math.random() * 100) // Spread galaxies out in depth
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
            size: 0,
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



// Base gap value between the edges of each celestial body
const baseGap = 0.25;

function createCelestialBody(name, scale, texturePath, previousPosition, previousScale) {
    // Geometry
    const geometry = new THREE.SphereGeometry(scale, 32, 32);
    let material;
    // Material with texture for other celestial bodies
    const texture = new THREE.TextureLoader().load(texturePath);
    material = new THREE.MeshPhongMaterial({ map: texture });

    // Mesh
    const body = new THREE.Mesh(geometry, material);

    // Position the body in the scene
    body.position.z = 0;
    body.position.x = previousPosition + previousScale + baseGap + scale;
    body.position.y = 0;

    // Add the body to the scene
    scene.add(body);

    // Add text label
    const labelPosition = body.position.clone();
    labelPosition.y += scale; // Adjust this value as needed
    createText(name, labelPosition);

    return body;
}



// Initial position and scale for the first celestial body (Pluto)
let previousPosition = 0;
let previousScale = 0.01;


// Create celestial bodies
const pluto = createCelestialBody('Pluto', 0.01, 'textures/pluto.jpg', previousPosition, 0);
previousPosition = pluto.position.x;
previousScale = 0.01;

const moon = createCelestialBody('Moon', 0.0146, 'textures/moon.jpg', previousPosition, previousScale);
previousPosition = moon.position.x;
previousScale = 0.0146;

const mercury = createCelestialBody('Mercury', 0.0205, 'textures/mercury.jpg', previousPosition, previousScale);
previousPosition = mercury.position.x;
previousScale = 0.0205;

const mars = createCelestialBody('Mars', 0.0285, 'textures/mars.jpg', previousPosition, previousScale);
previousPosition = mars.position.x;
previousScale = 0.0285;

const venus = createCelestialBody('Venus', 0.0509, 'textures/venus.jpg', previousPosition, previousScale);
previousPosition = venus.position.x;
previousScale = 0.0509;

const earth = createCelestialBody('Earth', 0.0536, 'textures/earth.jpg', previousPosition, previousScale);
previousPosition = earth.position.x;
previousScale = 0.0536;

const neptune = createCelestialBody('Neptune', .2071, 'textures/neptune.jpg', previousPosition, previousScale);
previousPosition = neptune.position.x;
previousScale = .2071;

const uranus = createCelestialBody('Uranus', .2135, 'textures/uranus.jpg', previousPosition, previousScale);
previousPosition = uranus.position.x;
previousScale = .2135;

const saturn = createCelestialBody('Saturn', .4901, 'textures/saturn.jpg', previousPosition, previousScale);
previousPosition = saturn.position.x;
previousScale = .4901;

const jupiter = createCelestialBody('Jupiter', .5882, 'textures/jupiter.jpg', previousPosition, previousScale);
previousPosition = jupiter.position.x;
previousScale = .5882;

const sun = createCelestialBody('Sun', 5.8523, 'textures/sun.jpg', previousPosition, previousScale);
previousPosition = sun.position.x;
previousScale = 5.8523;

const siriusA = createCelestialBody('Sirius A', 10.0074, 'textures/sirius.jpg', previousPosition, previousScale); // No texture for Sirius A
previousPosition = siriusA.position.x;
previousScale = 10.0074;

const betelgeuse = createCelestialBody('Betelgeuse', 497.45, 'textures/betelgeuse.jpg', previousPosition, previousScale); // No texture for Sirius A
previousPosition = betelgeuse.position.x;
previousScale = 497.45;




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

    stars.forEach(star => {
        star.rotation.x += (Math.random() - 0.5) * 0.002;
        star.rotation.y += (Math.random() - 0.5) * 0.002;
    });

    // Rotate the celestial objects
    animateObjects();

    // No need to update camera.lookAt here if updateCameraPosition is being called on scroll

    renderer.render(scene, camera);
}


// Resize canvas on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.far = betelgeuseCameraZ + additionalDistance;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
});






// Define properties of the planets with their X positions and the desired camera Z position
const planets = [
    { positionX: pluto.position.x, cameraZ: 1.25 },
    { positionX: moon.position.x, cameraZ: 1.25 },
    { positionX: mercury.position.x, cameraZ: 1.5 },
    { positionX: mars.position.x, cameraZ: 1.5 },
    { positionX: venus.position.x, cameraZ: 1.5 },
    { positionX: earth.position.x, cameraZ: 1.5 },
    { positionX: neptune.position.x, cameraZ: 1.8 },
    { positionX: uranus.position.x, cameraZ: 1.8 },
    { positionX: saturn.position.x, cameraZ: 3.5 }, // Start zooming out at Saturn
    { positionX: jupiter.position.x, cameraZ: 5.0 },
    { positionX: sun.position.x, cameraZ: 40.0 },
    { positionX: siriusA.position.x, cameraZ: 60.0 },
    { positionX: betelgeuse.position.x, cameraZ: 4000}
];




// Set up an index to keep track of the current planet
let currentPlanetIndex = 0;

// Function to update the camera position to focus on the current planet
function updateCameraForCurrentPlanet() {
    if (currentPlanetIndex < 0 || currentPlanetIndex >= planets.length) {
        return; // Exit the function if the index is out of bounds
    }

    const currentPlanet = planets[currentPlanetIndex];
    const cameraZ = currentPlanet.cameraZ; // Correctly access cameraZ from the current planet object

    gsap.to(camera.position, {
        x: currentPlanet.positionX,
        z: cameraZ,
        duration: 1,
        onUpdate: () => {
            camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));
        }
    });
}

ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "100% bottom", // Increase this value to extend the scroll length
    onUpdate: (self) => {
        const scrollAmount = self.progress;
        const newPlanetIndex = Math.floor(scrollAmount * planets.length);
        const clampedIndex = Math.min(Math.max(newPlanetIndex, 0), planets.length - 1);

        if (clampedIndex !== currentPlanetIndex) {
            currentPlanetIndex = clampedIndex;
            updateCameraForCurrentPlanet();
        }
    },
    scrub: 0.5
});


// Add event listeners for scrolling
document.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        // Scrolling down
        currentPlanetIndex = Math.min(currentPlanetIndex + 1, planets.length - 1);
    } else {
        // Scrolling up
        currentPlanetIndex = Math.max(currentPlanetIndex - 1, 0);
    }
    updateCameraForCurrentPlanet();
});




renderer.setPixelRatio(window.devicePixelRatio);

// Initial camera setup

animate();








