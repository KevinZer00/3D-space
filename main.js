

let textMesh;

// Set up Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('bg') });

// Load the texture
const loader = new THREE.TextureLoader();
loader.load('textures/background.jpg', function (texture) {
    // Set the scene background property to the loaded texture
    scene.background = texture;
});


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

    return body;
}



// Initial position and scale for the first celestial body (Pluto)
let previousPosition = 0;
let previousScale = 0.01;

//Create array to store clickable bodies 
const clickableObjects = [];


// Create celestial bodies
const pluto = createCelestialBody('Pluto', 0.025, 'textures/pluto.jpg', previousPosition, 0);
pluto.originalPosition = new THREE.Vector3(pluto.position.x, pluto.position.y, pluto.position.z);
previousPosition = pluto.position.x;
previousScale = 0.025;
clickableObjects.push(pluto);
pluto.userData.id = 'pluto';

const moon = createCelestialBody('Moon', 0.0246, 'textures/moon.jpg', previousPosition, previousScale);
moon.originalPosition = new THREE.Vector3(moon.position.x, moon.position.y, moon.position.z);
previousPosition = moon.position.x;
previousScale = 0.0146;
clickableObjects.push(moon);
moon.userData.id = 'moon';

const mercury = createCelestialBody('Mercury', 0.0305, 'textures/mercury.jpg', previousPosition, previousScale);
mercury.originalPosition = new THREE.Vector3(mercury.position.x, mercury.position.y, mercury.position.z);
previousPosition = mercury.position.x;
previousScale = 0.0205;
clickableObjects.push(mercury);
mercury.userData.id = 'mercury';

const mars = createCelestialBody('Mars', 0.0385, 'textures/mars.jpg', previousPosition, previousScale);
mars.originalPosition = new THREE.Vector3(mars.position.x, mars.position.y, mars.position.z);
previousPosition = mars.position.x;
previousScale = 0.0285;
clickableObjects.push(mars);
mars.userData.id = 'mars';

const venus = createCelestialBody('Venus', 0.0509, 'textures/venus.jpg', previousPosition, previousScale);
venus.originalPosition = new THREE.Vector3(venus.position.x, venus.position.y, venus.position.z);
previousPosition = venus.position.x;
previousScale = 0.0509;
clickableObjects.push(venus);
venus.userData.id = 'venus';

const earth = createCelestialBody('Earth', 0.0536, 'textures/earth.jpg', previousPosition, previousScale);
earth.originalPosition = new THREE.Vector3(earth.position.x, earth.position.y, earth.position.z);
previousPosition = earth.position.x;
previousScale = 0.0536;
clickableObjects.push(earth);
earth.userData.id = 'earth';

const neptune = createCelestialBody('Neptune', .2071, 'textures/neptune.jpg', previousPosition, previousScale);
neptune.originalPosition = new THREE.Vector3(neptune.position.x, neptune.position.y, neptune.position.z);
previousPosition = neptune.position.x;
previousScale = .2071;
clickableObjects.push(neptune);
neptune.userData.id = 'neptune';

const uranus = createCelestialBody('Uranus', .2135, 'textures/uranus.jpg', previousPosition, previousScale);
uranus.originalPosition = new THREE.Vector3(uranus.position.x, uranus.position.y, uranus.position.z);
previousPosition = uranus.position.x;
previousScale = .2135;
clickableObjects.push(uranus);
uranus.userData.id = 'uranus';

const saturn = createCelestialBody('Saturn', .4901, 'textures/saturn.jpg', previousPosition, previousScale);
saturn.originalPosition = new THREE.Vector3(saturn.position.x, saturn.position.y, saturn.position.z);
previousPosition = saturn.position.x;
previousScale = .4901;
clickableObjects.push(saturn);
saturn.userData.id = 'saturn';

const jupiter = createCelestialBody('Jupiter', .5882, 'textures/jupiter.jpg', previousPosition, previousScale);
jupiter.originalPosition = new THREE.Vector3(jupiter.position.x, jupiter.position.y, jupiter.position.z);
previousPosition = jupiter.position.x;
previousScale = .5882;
clickableObjects.push(jupiter);
jupiter.userData.id = 'jupiter';

const sun = createCelestialBody('Sun', 5.8523, 'textures/sun.jpg', previousPosition, previousScale);
sun.originalPosition = new THREE.Vector3(sun.position.x, sun.position.y, sun.position.z);
previousPosition = sun.position.x;
previousScale = 5.8523;
clickableObjects.push(sun);
sun.userData.id = 'sun';

const siriusA = createCelestialBody('Sirius A', 10.0074, 'textures/sirius.jpg', previousPosition, previousScale); 
siriusA.originalPosition = new THREE.Vector3(siriusA.position.x, siriusA.position.y, siriusA.position.z);
previousPosition = siriusA.position.x;
previousScale = 10.0074;
clickableObjects.push(siriusA);
siriusA.userData.id = 'siriusA';

const betelgeuse = createCelestialBody('Betelgeuse', 497.45, 'textures/betelgeuse.jpg', previousPosition, previousScale); 
betelgeuse.originalPosition = new THREE.Vector3(betelgeuse.position.x, betelgeuse.position.y, betelgeuse.position.z);
previousPosition = betelgeuse.position.x;
previousScale = 497.45;
clickableObjects.push(betelgeuse);
betelgeuse.userData.id = 'betelgeuse';



// Function to animate all the objects' rotation
function animateObjects() {
    pluto.rotation.y += 0.005;
    moon.rotation.y += 0.005;
    mercury.rotation.y += 0.005;
    mars.rotation.y += 0.005;
    venus.rotation.y += 0.005;
    earth.rotation.y += 0.005;
    neptune.rotation.y += 0.005;
    uranus.rotation.y += 0.005;
    saturn.rotation.y += 0.005;
    jupiter.rotation.y += 0.005;
    sun.rotation.y += 0.0025;
    siriusA.rotation.y += 0.0025;
    betelgeuse.rotation.y += 0.0025;

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
    { positionX: betelgeuse.position.x, cameraZ: 4000 }
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







//text section 
let currentlySelectedObject = null;

document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener('click', onCanvasClick, false);

function onCanvasClick(event) {
    // Convert the mouse position to normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast to find intersected objects
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects); // `clickableObjects` should be an array of your planets/meshes

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        // Check if the object is already selected
        if (selectedObject === currentlySelectedObject) {
            // Deselect and move it back to its original position, and remove the blur
            deselectPlanet(selectedObject);
        } else {
            // If another planet is currently selected, first deselect it
            if (currentlySelectedObject) {
                deselectPlanet(currentlySelectedObject);
            }

            // Set the newly selected object
            currentlySelectedObject = selectedObject;

            // Move the selected planet forward and blur the background
            focusOnPlanet(selectedObject);
        }
    } else {
        // If the user clicks on empty space, deselect any selected planet
        if (currentlySelectedObject) {
            deselectPlanet(currentlySelectedObject);
            currentlySelectedObject = null;
        }
    }
}

function focusOnPlanet(planetMesh) {
    // Deselect any previously selected planet
    if (currentlySelectedObject) {
        resetPlanet(currentlySelectedObject);
    }

    // Dim other planets
    clickableObjects.forEach((obj) => {
        if (obj !== planetMesh) {
            gsap.to(obj.material, {
                opacity: 0.1,
                duration: 0.5
            });
            if (!obj.material.transparent) {
                obj.material.transparent = true;
            }
        }
    });

    // Show the info panel for the selected planet
    const planetId = planetMesh.userData.id; // Make sure you've set this when creating the mesh
    showInfoPanel(planetId);

    // Set the currently selected object
    currentlySelectedObject = planetMesh;
}


function deselectPlanet() {
    if (currentlySelectedObject) {
      // Move the planet back to its original position
      gsap.to(currentlySelectedObject.position, {
        z: currentlySelectedObject.originalPosition.z,
        duration: 1
      });
      
      // Restore the materials for all objects
      clickableObjects.forEach((obj) => {
        gsap.to(obj.material, {
          opacity: 1,
          duration: 0.5
        });
        obj.material.transparent = false; // Only if you originally had it set to true
      });
      
      // Hide the information panel or text
      hideInfoPanel();
      
      // Reset the currently selected object
      currentlySelectedObject = null;
    }
  }
  

  function resetPlanet(planetMesh) {
    // Restore other planets' materials
    clickableObjects.forEach((obj) => {
        if (obj !== planetMesh) {
            gsap.to(obj.material, {
                opacity: 1,
                duration: 0.5
            });
            obj.material.transparent = false;
        }
    });
}

function showInfoPanel(planetId) {
    // Hide all panels
    const panels = document.querySelectorAll('.info-panel');
    panels.forEach(panel => panel.style.display = 'none');

    // Show the selected planet's panel
    const selectedPanel = document.getElementById(planetId + 'Panel');
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
    }
}

function hideInfoPanel() {
    const panels = document.querySelectorAll('.info-panel');
    panels.forEach(panel => panel.style.display = 'none');
}
  











