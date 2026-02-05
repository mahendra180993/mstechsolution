/**
 * Three.js Hero Background Animation
 * Mouse-Move Triggered - Particles Avoid Mouse Cursor
 * Particles move away from mouse, creating empty space that follows cursor
 */

let scene, camera, renderer;
let particles, particleSystem;
let lines, lineSystem;
let mouseX = 0, mouseY = 0;
let normalizedMouseX = 0, normalizedMouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isMouseMoving = false;
let mouseMoveTimeout;
let time = 0;

// Primary colors for tech theme
const PRIMARY_BLUE = 0x1E88E5;
const ACCENT_BLUE = 0x4FC3F7;

// Store original positions
let originalPositions = [];
let originalColors = [];

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        setTimeout(initThreeJS, 100);
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Create particle system
    createParticles();

    // Create connecting lines
    createConnections();

    // Mouse event handlers
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseleave', onDocumentMouseLeave, false);
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function createParticles() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Store original positions
    originalPositions = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Random positions in a sphere
        const radius = 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        // Store original position
        originalPositions.push({ x, y, z });

        // Blue gradient colors
        const colorMix = Math.random();
        colors[i] = colorMix < 0.5 ? 0.12 : 0.31;
        colors[i + 1] = colorMix < 0.5 ? 0.53 : 0.76;
        colors[i + 2] = colorMix < 0.5 ? 0.90 : 0.97;
        
        originalColors.push({
            r: colors[i],
            g: colors[i + 1],
            b: colors[i + 2]
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createConnections() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const particlePositions = particleSystem.geometry.attributes.position.array;
    const particleColors = particleSystem.geometry.attributes.color.array;

    // Connect nearby particles
    for (let i = 0; i < particlePositions.length; i += 9) {
        const x1 = particlePositions[i];
        const y1 = particlePositions[i + 1];
        const z1 = particlePositions[i + 2];

        for (let j = i + 9; j < particlePositions.length; j += 9) {
            const x2 = particlePositions[j];
            const y2 = particlePositions[j + 1];
            const z2 = particlePositions[j + 2];

            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) + 
                Math.pow(y2 - y1, 2) + 
                Math.pow(z2 - z1, 2)
            );

            if (distance < 2) {
                positions.push(x1, y1, z1);
                positions.push(x2, y2, z2);

                colors.push(
                    particleColors[i], particleColors[i + 1], particleColors[i + 2],
                    particleColors[j], particleColors[j + 1], particleColors[j + 2]
                );
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });

    lineSystem = new THREE.LineSegments(geometry, material);
    scene.add(lineSystem);
}

function onDocumentMouseMove(event) {
    // Calculate normalized mouse position (-1 to 1) in 3D space
    // Map screen coordinates to 3D space coordinates
    normalizedMouseX = ((event.clientX - windowHalfX) / windowHalfX) * 5;
    normalizedMouseY = -((event.clientY - windowHalfY) / windowHalfY) * 5; // Invert Y
    
    // Mark mouse as moving
    isMouseMoving = true;
    
    // Clear timeout
    if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
    }
    
    // Set timeout to stop mouse tracking after mouse stops moving
    mouseMoveTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 200);
}

function onDocumentMouseLeave() {
    isMouseMoving = false;
    normalizedMouseX = 0;
    normalizedMouseY = 0;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01; // Slow time increment for subtle idle animation

    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        const colors = particleSystem.geometry.attributes.color.array;

        // Smooth interpolation for mouse position
        mouseX += (normalizedMouseX - mouseX) * 0.15;
        mouseY += (normalizedMouseY - mouseY) * 0.15;

        for (let i = 0; i < originalPositions.length; i++) {
            const idx = i * 3;
            const orig = originalPositions[i];
            
            // Calculate current particle position in 3D space
            const particleX = positions[idx];
            const particleY = positions[idx + 1];
            const particleZ = positions[idx + 2];
            
            // Calculate distance from mouse cursor in 3D space
            const dx = particleX - mouseX;
            const dy = particleY - mouseY;
            const dz = particleZ - 0; // Mouse is at z=0
            const distanceToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // Repulsion force - particles move away from mouse
            const repulsionRadius = 1.5; // Radius of empty space around mouse
            const repulsionStrength = 2.5; // How strong the repulsion is
            
            let newX = orig.x;
            let newY = orig.y;
            let newZ = orig.z;
            
            // Apply subtle idle animation (small automatic movement)
            const idleSpeed = 0.3; // Slow idle movement
            const idleAmount = 0.15; // Small movement range
            newX += Math.sin(time + i * 0.1) * idleAmount;
            newY += Math.cos(time + i * 0.15) * idleAmount;
            newZ += Math.sin(time * 0.8 + i * 0.2) * idleAmount * 0.5;
            
            // Apply mouse repulsion if mouse is moving
            if (isMouseMoving && distanceToMouse < repulsionRadius * 2) {
                // Calculate repulsion force (stronger when closer to mouse)
                const force = (1 - distanceToMouse / (repulsionRadius * 2)) * repulsionStrength;
                
                // Normalize direction vector
                const invDistance = distanceToMouse > 0 ? 1 / distanceToMouse : 0;
                const dirX = dx * invDistance;
                const dirY = dy * invDistance;
                const dirZ = dz * invDistance;
                
                // Apply repulsion - move particle away from mouse
                newX += dirX * force;
                newY += dirY * force;
                newZ += dirZ * force;
            }
            
            // Smooth interpolation to target position
            positions[idx] += (newX - positions[idx]) * 0.1;
            positions[idx + 1] += (newY - positions[idx + 1]) * 0.1;
            positions[idx + 2] += (newZ - positions[idx + 2]) * 0.1;
            
            // Update colors based on distance from mouse
            const colorDistance = isMouseMoving ? distanceToMouse : 10;
            const colorIntensity = Math.max(0, Math.min(1, (colorDistance - 0.5) / 2));
            
            colors[idx] = originalColors[i].r * (0.7 + colorIntensity * 0.3);
            colors[idx + 1] = originalColors[i].g * (0.7 + colorIntensity * 0.3);
            colors[idx + 2] = originalColors[i].b * (0.7 + colorIntensity * 0.3);
        }

        // Update geometry
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
        
        // Update connections
        updateConnections();
    }

    renderer.render(scene, camera);
}

function updateConnections() {
    if (!lineSystem) return;
    
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const particlePositions = particleSystem.geometry.attributes.position.array;
    const particleColors = particleSystem.geometry.attributes.color.array;

    // Reconnect nearby particles
    for (let i = 0; i < particlePositions.length; i += 9) {
        const x1 = particlePositions[i];
        const y1 = particlePositions[i + 1];
        const z1 = particlePositions[i + 2];

        for (let j = i + 9; j < particlePositions.length; j += 9) {
            const x2 = particlePositions[j];
            const y2 = particlePositions[j + 1];
            const z2 = particlePositions[j + 2];

            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) + 
                Math.pow(y2 - y1, 2) + 
                Math.pow(z2 - z1, 2)
            );

            if (distance < 2) {
                positions.push(x1, y1, z1);
                positions.push(x2, y2, z2);

                colors.push(
                    particleColors[i], particleColors[i + 1], particleColors[i + 2],
                    particleColors[j], particleColors[j + 1], particleColors[j + 2]
                );
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    lineSystem.geometry.dispose();
    lineSystem.geometry = geometry;
}

// Initialize when DOM is ready
function initializeHeroBackground() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initThreeJS, 100);
        });
    } else {
        setTimeout(initThreeJS, 100);
    }
}

// Also initialize after a delay to ensure canvas exists
setTimeout(initializeHeroBackground, 200);
setTimeout(initThreeJS, 500);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
    }
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseleave', onDocumentMouseLeave);
    window.removeEventListener('resize', onWindowResize);
});
