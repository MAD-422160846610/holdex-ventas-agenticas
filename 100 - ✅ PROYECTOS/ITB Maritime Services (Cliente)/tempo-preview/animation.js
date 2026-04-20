// Three.js Sidebar Animation for Tempo Preview
let scene, camera, renderer, group;
const shapes = [];
const count = 13;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    group = new THREE.Group();
    scene.add(group);

    // Create a dynamic canvas texture for the "code"
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 256;
    textCanvas.height = 256;
    const ctx = textCanvas.getContext('2d');
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '20px monospace';
    for(let i=0; i<10; i++) {
        ctx.fillText(Math.random().toString(16).slice(2, 10), 10, i * 25 + 20);
    }
    const texture = new THREE.CanvasTexture(textCanvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const geometry = new THREE.BoxGeometry(2.5, 0.1, 2.5);

    for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = (i - count / 2) * 0.2;
        shapes.push(mesh);
        group.add(mesh);
    }

    animate();

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('scroll', onScroll, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    // Apply Twist
    shapes.forEach((mesh, i) => {
        const factor = i / count;
        mesh.rotation.y = scrollPercent * Math.PI * 2 * factor;
        mesh.scale.set(1 - scrollPercent * 0.2, 1, 1 - scrollPercent * 0.2);
    });

    group.rotation.y = scrollPercent * Math.PI;
    group.rotation.x = scrollPercent * 0.5;
}

function animate() {
    requestAnimationFrame(animate);

    // Texture Flowing Effect
    shapes.forEach(mesh => {
        mesh.material.map.offset.y += 0.001;
    });

    renderer.render(scene, camera);
}

init();
