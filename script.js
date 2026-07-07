/**
 * KROMA Streetwear SPA - Creative Engineering
 * Powered by Three.js, GSAP & Lenis
 */

// --- DATA & STATE ---
const KROMA_DATA = {
    products: [
        {
            id: 1,
            name: "VOID OVERSIZED HOODIE",
            price: 185,
            category: "UPPER",
            description: "Heavyweight 480GSM Japanese cotton. Drop shoulder construction with reinforced double-stitched seams. Minimalist logo embroidery on the left cuff.",
            colors: ["#0a0a0a", "#2a2a2a", "#f5f5f5"],
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            name: "CYBER CARGO PANT v2",
            price: 240,
            category: "LOWER",
            description: "Nylon-elastane blend with high-tensility. Features 8 utility pockets with waterproof zippers and adjustable ankle straps for silhouette modification.",
            colors: ["#0a0a0a", "#1a1a1a"],
            sizes: ["28", "30", "32", "34", "36"],
            image: "cyber-cargo.png"
        },
        {
            id: 3,
            name: "KROMATIC SHELL JACKET",
            price: 420,
            category: "OUTER",
            description: "3-layer GORE-TEX technology with fully taped seams. Internal modular strapping system. Heat-sensitive reflective panels for low-light visibility.",
            colors: ["#0a0a0a", "#ccff00"],
            sizes: ["S", "M", "L", "XL"],
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 4,
            name: "ACID DISTRESSED TEE",
            price: 95,
            category: "UPPER",
            description: "Premium single-jersey cotton with enzyme wash and hand-distressed detailing. Boxy fit with elongated sleeves.",
            colors: ["#ccff00", "#f5f5f5", "#0a0a0a"],
            sizes: ["XS", "S", "M", "L", "XL"],
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 5,
            name: "ORBIT TECH SNEAKER",
            price: 310,
            category: "FOOTWEAR",
            description: "Vibram® megagrip outsole paired with a breathable tech-mesh upper. Speed-lacing system and internal compression sock for superior comfort.",
            colors: ["#0a0a0a", "#f5f5f5"],
            sizes: ["39", "40", "41", "42", "43", "44", "45"],
            image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 6,
            name: "NEURAL MASK / BALACLAVA",
            price: 65,
            category: "ACCESSORY",
            description: "Compression-fit performance technical fabric. Moisture-wicking and thermal regulation properties. Low-profile silhouette for layering.",
            colors: ["#0a0a0a"],
            sizes: ["ONE SIZE"],
            image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 7,
            name: "GHOST LAYER LONG SLEEVE",
            price: 110,
            category: "UPPER",
            description: "Ultra-fine merino wool blend base layer. Ergonomic panelling for maximum range of motion. Minimalist flat-lock seam construction.",
            colors: ["#f5f5f5", "#2a2a2a"],
            sizes: ["S", "M", "L", "XL"],
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 8,
            name: "TITAN RIG BACKPACK",
            price: 275,
            category: "EQUIPMENT",
            description: "500D Cordura® ballistic nylon. Fidlock® magnetic buckles and rapid-access laptop compartment. Modular webbing for external gear attachment.",
            colors: ["#0a0a0a", "#1a1a1a"],
            sizes: ["ONE SIZE"],
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"
        }
    ]
};

// 3D Scene Globals
const KROMA_3D = {
    camera: null,
    mainMesh: null,
    particleSystem: null,
    shapes: [],
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0
};

let state = {
    user: JSON.parse(localStorage.getItem('kroma_user')) || null,
    cart: JSON.parse(localStorage.getItem('kroma_cart')) || [],
    orders: JSON.parse(localStorage.getItem('kroma_orders')) || [],
    selectedMethod: 'card'
};

// --- INITIALIZATION ---
window.addEventListener('load', () => {
    initThree();
    initLenis();
    initGSAP();
    initCursor();
    renderProducts();
    initCardTilt();
    updateUI();

    // Safety clearing for loader if Three.js fails or hits race condition
    const loaderTimer = setTimeout(clearLoader, 3500);

    // Real clear loader
    function clearLoader() {
        clearTimeout(loaderTimer);
        gsap.to('#loader', {
            opacity: 0, duration: 1, onComplete: () => {
                const loaderEl = document.getElementById('loader');
                if (loaderEl) loaderEl.remove();
            }
        });
        gsap.to('#hero-title', { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 0.5 });
        gsap.to('#hero-subtitle', { opacity: 0.5, y: 0, duration: 1.5, ease: "power4.out", delay: 0.8 });
    }

    setTimeout(clearLoader, 2000);
});

// --- THREE.JS IMMERSIVE SCENE ---
function initThree() {
    try {
        const canvas = document.querySelector('#webgl');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        KROMA_3D.camera = camera;
        camera.position.z = 8;

        // --- 1. MAIN TORUS KNOT (hero geometry) ---
        const mainGeo = new THREE.TorusKnotGeometry(1.0, 0.35, 128, 16);
        const mainMat = new THREE.MeshBasicMaterial({
            color: 0xccff00,
            wireframe: true,
            transparent: true,
            opacity: 0.18
        });
        const mainMesh = new THREE.Mesh(mainGeo, mainMat);
        scene.add(mainMesh);
        KROMA_3D.mainMesh = mainMesh;

        // Inner solid glow core
        const innerGeo = new THREE.TorusKnotGeometry(0.7, 0.12, 64, 8);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x88cc00,
            transparent: true,
            opacity: 0.06
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerMesh);

        // Extra outer ring
        const ringGeo = new THREE.TorusGeometry(1.8, 0.04, 32, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xccff00,
            transparent: true,
            opacity: 0.08
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        scene.add(ringMesh);

        // --- 2. ORBITING PLATONIC SOLIDS ---
        for (let i = 0; i < 10; i++) {
            const size = 0.15 + Math.random() * 0.4;
            let geo;
            const type = Math.random();
            if (type < 0.33) geo = new THREE.OctahedronGeometry(size);
            else if (type < 0.66) geo = new THREE.DodecahedronGeometry(size);
            else geo = new THREE.IcosahedronGeometry(size);

            const hue = 0.25 + Math.random() * 0.15; // green to yellow-green
            const c = new THREE.Color().setHSL(hue, 1, 0.5);
            const mat = new THREE.MeshBasicMaterial({
                color: c,
                wireframe: true,
                transparent: true,
                opacity: 0.1 + Math.random() * 0.2
            });
            const mesh = new THREE.Mesh(geo, mat);

            const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
            const radius = 2.0 + Math.random() * 2.5;
            mesh.userData = {
                angle: angle,
                radius: radius,
                orbitSpeed: 0.0015 + Math.random() * 0.003,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.2 + Math.random() * 0.3,
                floatAmp: 0.2 + Math.random() * 0.4,
                rotSpeedX: 0.005 + Math.random() * 0.025,
                rotSpeedY: 0.005 + Math.random() * 0.025
            };

            // Initial position
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.z = Math.sin(angle) * radius * 0.6;
            mesh.position.y = Math.sin(mesh.userData.floatOffset) * mesh.userData.floatAmp;

            scene.add(mesh);
            KROMA_3D.shapes.push(mesh);
        }

        // --- 3. PARTICLE STARFIELD ---
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const rad = 8 + Math.random() * 25;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = rad * Math.cos(phi);

            const h = 0.2 + Math.random() * 0.2;
            const c = new THREE.Color().setHSL(h, 1, 0.3 + Math.random() * 0.4);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.06,
            transparent: true,
            opacity: 0.7,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);
        KROMA_3D.particleSystem = particleSystem;

        // --- 4. CONNECTION LINES (subtle web effect) ---
        const lineGeo = new THREE.BufferGeometry();
        const linePositions = [];
        const pos = particleGeo.attributes.position.array;
        // Connect particles that are close together (sample ~400 connections max)
        for (let i = 0; i < Math.min(particleCount, 400); i++) {
            for (let j = i + 1; j < Math.min(particleCount, i + 5); j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 4) {
                    linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                    linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                }
            }
        }

        const linePosAttr = new THREE.BufferGeometry();
        linePosAttr.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xccff00,
            transparent: true,
            opacity: 0.04
        });
        const lineSystem = new THREE.LineSegments(linePosAttr, lineMat);
        scene.add(lineSystem);

        // --- 5. MOUSE TRACKING ---
        window.addEventListener('mousemove', (e) => {
            KROMA_3D.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            KROMA_3D.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // --- 6. ANIMATION LOOP ---
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Smooth mouse interpolation
            const mx = KROMA_3D.mouseX;
            const my = KROMA_3D.mouseY;
            KROMA_3D.targetX += (mx - KROMA_3D.targetX) * 0.04;
            KROMA_3D.targetY += (my - KROMA_3D.targetY) * 0.04;

            const tx = KROMA_3D.targetX;
            const ty = KROMA_3D.targetY;
            const scrollP = KROMA_3D.scrollProgress;

            // --- Main Torus Knot ---
            mainMesh.rotation.x += 0.004;
            mainMesh.rotation.y += 0.008;
            mainMesh.rotation.z += 0.002;
            mainMesh.position.x = tx * 0.35;
            mainMesh.position.y = -ty * 0.35;
            mainMat.opacity = 0.14 + Math.sin(elapsed * 0.4) * 0.06;

            // --- Inner Core ---
            innerMesh.rotation.x -= 0.006;
            innerMesh.rotation.y += 0.012;
            innerMesh.position.x = tx * 0.25;
            innerMesh.position.y = -ty * 0.25;
            innerMat.opacity = 0.04 + Math.sin(elapsed * 0.6 + 1) * 0.03;

            // --- Outer Ring ---
            ringMesh.rotation.x = Math.sin(elapsed * 0.1) * 0.2;
            ringMesh.rotation.y += 0.003;
            ringMesh.rotation.z = Math.cos(elapsed * 0.08) * 0.15;
            ringMesh.position.x = tx * 0.15;
            ringMesh.position.y = -ty * 0.15;

            // --- Orbiting Shapes ---
            KROMA_3D.shapes.forEach((mesh) => {
                const d = mesh.userData;
                const orbitAngle = d.angle + elapsed * d.orbitSpeed;
                const zDepth = 0.5 + scrollP * 0.3;
                mesh.position.x = Math.cos(orbitAngle) * d.radius + tx * (0.2 + d.radius * 0.04);
                mesh.position.z = Math.sin(orbitAngle) * d.radius * zDepth;
                mesh.position.y = Math.sin(elapsed * d.floatSpeed + d.floatOffset) * d.floatAmp + -ty * (0.2 + d.radius * 0.04);
                mesh.rotation.x += d.rotSpeedX;
                mesh.rotation.y += d.rotSpeedY;
            });

            // --- Particle System ---
            particleSystem.rotation.y += 0.0003 + scrollP * 0.0003;
            particleSystem.rotation.x += 0.0001;

            // --- Connection Lines ---
            lineSystem.rotation.y = particleSystem.rotation.y;
            lineSystem.rotation.x = particleSystem.rotation.x;

            // --- Camera ---
            camera.position.z = 8 - scrollP * 3;
            camera.position.x = tx * 0.2;
            camera.position.y = -ty * 0.2;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        // --- Resize ---
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch (e) {
        console.warn("Three.js init failed, falling back to static background.");
    }
}

// --- SMOOTH SCROLL (LENIS) ---
function initLenis() {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// --- GSAP REVEALS + SCROLL-DRIVEN 3D ---
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Scroll-driven 3D camera movement
    ScrollTrigger.create({
        trigger: "#shop",
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
            KROMA_3D.scrollProgress = self.progress;
        }
    });

    // Reset on top of page
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "top -1px",
        onLeaveBack: () => { KROMA_3D.scrollProgress = 0; }
    });

    // Footer reveal
    gsap.from('footer', {
        scrollTrigger: { trigger: 'footer', start: "top 90%" },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
}

// --- 3D PERSPECTIVE TILT ON PRODUCT CARDS ---
function initCardTilt() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            card.style.setProperty('--mx', `${percentX}%`);
            card.style.setProperty('--my', `${percentY}%`);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';

            // Dynamic image parallax within card
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = `scale(1.08) translate(${rotateY * 0.3}px, ${-rotateX * 0.3}px)`;
                img.style.transition = 'transform 0.1s ease-out';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease-out';
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = '';
                img.style.transition = 'transform 0.5s ease-out';
            }
        });
    });
}

// --- CURSOR LOGIC ---
function initCursor() {
    const cursor = document.getElementById('cursor');

    // Optimized for zero-lag precision
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    const updateInteractions = () => {
        document.querySelectorAll('button, a, .product-card, .payment-card, .variant-chip').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    };
    updateInteractions();

    // Re-run for dynamic elements
    const observer = new MutationObserver(updateInteractions);
    observer.observe(document.body, { childList: true, subtree: true });
}

// --- RENDER ENGINE ---
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = KROMA_DATA.products.map(p => `
        <div class="product-card p-10 flex flex-col items-center group cursor-none" onclick="ui.showDetail(${p.id})">
            <div class="w-full aspect-[4/5] bg-bone/5 overflow-hidden mb-8 relative border border-bone/5">
                <img src="${p.image}" class="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700">
                <div class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div class="bg-acid text-dark p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-center shadow-2xl">
                        Inspect Unit
                    </div>
                </div>
            </div>
            <div class="w-full text-left">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-sm font-sync font-bold tracking-tighter max-w-[70%]">${p.name}</h4>
                    <span class="text-acid font-sync font-bold text-xs">$${p.price}</span>
                </div>
                <p class="text-[8px] uppercase tracking-[0.3em] opacity-30">${p.category} UNIT</p>
            </div>
        </div>
    `).join('');

    // Reveal animations - run after DOM is populated
    gsap.from(".product-card", {
        scrollTrigger: { trigger: "#shop", start: "top 80%" },
        y: 60,
        opacity: 0,
        rotationX: 8,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out"
    });
}

// --- UI / MODAL CONTROLS ---
const ui = {
    showDetail(id) {
        const product = KROMA_DATA.products.find(p => p.id === id);
        const modal = document.getElementById('detail-modal');

        document.getElementById('detail-img').src = product.image;
        document.getElementById('detail-category').textContent = `// ${product.category}`;
        document.getElementById('detail-name').textContent = product.name;
        document.getElementById('detail-desc').textContent = product.description;
        document.getElementById('detail-price').textContent = `$${product.price}`;

        let selectedColor = product.colors[0];
        let selectedSize = product.sizes[0];

        // Render Colors
        const colorContainer = document.getElementById('detail-colors');
        colorContainer.innerHTML = product.colors.map((c, i) => `
            <div class="variant-chip w-8 h-8 rounded-full border-2 ${i === 0 ? 'border-acid' : 'border-bone/10'} cursor-none hover:scale-110 active:scale-95 transition-all color-select" data-color="${c}" style="background: ${c}"></div>
        `).join('');

        // Render Sizes
        const sizeContainer = document.getElementById('detail-sizes');
        sizeContainer.innerHTML = product.sizes.map((s, i) => `
            <div class="variant-chip px-4 py-2 border ${i === 0 ? 'border-acid text-acid' : 'border-bone/10'} text-[10px] font-bold uppercase cursor-none hover:border-acid transition-all size-select" data-size="${s}">${s}</div>
        `).join('');

        // Selection Handlers
        colorContainer.querySelectorAll('.color-select').forEach(chip => {
            chip.onclick = () => {
                colorContainer.querySelectorAll('.color-select').forEach(c => c.classList.replace('border-acid', 'border-bone/10'));
                chip.classList.replace('border-bone/10', 'border-acid');
                selectedColor = chip.dataset.color;
            };
        });

        sizeContainer.querySelectorAll('.size-select').forEach(chip => {
            chip.onclick = () => {
                sizeContainer.querySelectorAll('.size-select').forEach(s => {
                    s.classList.remove('border-acid', 'text-acid');
                    s.classList.add('border-bone/10');
                });
                chip.classList.replace('border-bone/10', 'border-acid');
                chip.classList.add('text-acid');
                selectedSize = chip.dataset.size;
            };
        });

        document.getElementById('detail-add-to-cart').onclick = () => {
            window.addToCart(product.id, { color: selectedColor, size: selectedSize });
            modal.classList.remove('modal-active');
        };

        modal.classList.add('modal-active');
    },

    updateCheckoutSummary() {
        const total = state.cart.reduce((a, b) => a + (b.price * b.qty), 0);
        const count = state.cart.reduce((a, b) => a + b.qty, 0);
        const subtotal = total;
        const tax = total * 0.08; // Simulation
        const finalTotal = subtotal + tax;

        document.getElementById('summary-items-count').textContent = `${count} ITEM${count !== 1 ? 'S' : ''}`;

        // Detailed breakdown injection
        const summaryContainer = document.querySelector('#shipping-form .col-span-2.bg-bone/5');
        summaryContainer.innerHTML = `
            <div class="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest mb-2 opacity-30">
                <span>Subtotal Assets</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest mb-4 opacity-30">
                <span>Transmission Fee (8%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="flex justify-between items-center text-xl font-sync font-bold uppercase tracking-tighter">
                <span>Final Valuation</span>
                <span id="summary-total-price">$${finalTotal.toFixed(2)}</span>
            </div>
        `;
    }
};

// --- LOGIC FUNCTIONS ---
window.addToCart = (id, options = {}) => {
    const product = KROMA_DATA.products.find(p => p.id === id);
    // Create a unique key based on options
    const variantKey = `${id}-${options.color}-${options.size}`;
    const existing = state.cart.find(i => `${i.id}-${i.color}-${i.size}` === variantKey);

    if (existing) {
        existing.qty++;
    } else {
        state.cart.push({ ...product, ...options, qty: 1 });
    }

    saveState();
    updateUI();
    showToast(`${product.name} ASSIGNED TO CART`);
};

window.removeFromCart = (id) => {
    state.cart = state.cart.filter(i => i.id !== id);
    saveState();
    updateUI();
};

function saveState() {
    localStorage.setItem('kroma_cart', JSON.stringify(state.cart));
    localStorage.setItem('kroma_user', JSON.stringify(state.user));
    localStorage.setItem('kroma_orders', JSON.stringify(state.orders));
}

function updateUI() {
    const count = state.cart.reduce((a, b) => a + b.qty, 0);
    const badge = document.getElementById('cart-count');
    badge.textContent = count;
    badge.style.opacity = count > 0 ? '1' : '0';

    const list = document.getElementById('cart-items-list');
    if (state.cart.length === 0) {
        list.innerHTML = `<div class="h-full flex items-center justify-center text-[10px] uppercase tracking-widest opacity-20 italic">Bag is currently empty</div>`;
    } else {
        list.innerHTML = state.cart.map(item => `
            <div class="flex gap-6 items-center border-b border-bone/5 pb-8 group">
                <div class="w-20 h-24 bg-bone/5 flex-shrink-0 border border-bone/5">
                    <img src="${item.image}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all">
                </div>
                <div class="flex-1">
                    <h5 class="text-xs font-sync font-bold tracking-tighter mb-2">${item.name}</h5>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] opacity-40">Qty: ${item.qty} ${item.size ? `// Sz: ${item.size}` : ''}</span>
                        ${item.color ? `<div class="w-3 h-3 rounded-full" style="background: ${item.color}"></div>` : ''}
                    </div>
                    <span class="text-acid text-xs font-bold">$${item.price * item.qty}</span>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-rose-500 hover:text-white transition-colors cursor-none"><i class="ri-delete-bin-line"></i></button>
            </div>
        `).join('');
    }

    const total = state.cart.reduce((a, b) => a + (b.price * b.qty), 0);
    document.getElementById('cart-total-price').textContent = `$${total.toFixed(2)}`;

    const triggerText = document.getElementById('user-status-text');
    if (state.user) {
        triggerText.textContent = "ACCOUNT";
        document.getElementById('profile-user-name').textContent = `IDENTITY: ${state.user.name.toUpperCase()}`;
        document.getElementById('profile-user-email').textContent = state.user.email.toUpperCase();
        renderOrderHistory();
    } else {
        triggerText.textContent = "LOGIN";
    }
}

// --- MODAL CONTROLS ---
const modals = {
    auth: document.getElementById('auth-modal'),
    cart: document.getElementById('cart-drawer'),
    checkout: document.getElementById('checkout-modal'),
    profile: document.getElementById('profile-modal'),
    detail: document.getElementById('detail-modal')
};

function openModal(name) {
    modals[name].classList.add('modal-active');
}

function closeModal(name) {
    if (name) modals[name].classList.remove('modal-active');
    else Object.values(modals).forEach(m => m.classList.remove('modal-active'));
}

document.getElementById('auth-trigger').onclick = () => {
    if (state.user) openModal('profile');
    else openModal('auth');
};
document.getElementById('cart-trigger').onclick = () => openModal('cart');
document.querySelectorAll('.close-modal, .auth-overlay, .checkout-overlay, .profile-overlay, .detail-overlay').forEach(b => b.onclick = () => closeModal());
document.querySelector('.close-cart').onclick = () => closeModal('cart');

document.querySelectorAll('.toggle-auth').forEach(b => b.onclick = () => {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
});

// Payment method selection
document.querySelectorAll('.payment-card').forEach(card => {
    card.onclick = () => {
        document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active', 'border-acid'));
        card.classList.add('active', 'border-acid');
        state.selectedMethod = card.dataset.method;
    };
});

// --- AUTH LOGIC ---
document.getElementById('form-register').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    state.user = { name, email, history: [] };
    saveState();
    updateUI();
    closeModal('auth');
    showToast("IDENTITY ESTABLISHED");
};

document.getElementById('form-login').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    state.user = { name: email.split('@')[0], email, history: [] };
    saveState();
    updateUI();
    closeModal('auth');
    showToast(`PROTOCOL GRANTED: ${email}`);
};

document.getElementById('logout-trigger').onclick = () => {
    state.user = null;
    saveState();
    updateUI();
    closeModal('profile');
    showToast("IDENTITY DISCONNECTED");
};

// --- CHECKOUT LOGIC ---
document.getElementById('checkout-trigger').onclick = () => {
    if (state.cart.length === 0) return showToast("ERROR: BAG IS EMPTY", "error");
    if (!state.user) {
        showToast("AUTHENTICATION REQUIRED", "warning");
        openModal('auth');
    } else {
        closeModal('cart');
        openModal('checkout');
        ui.updateCheckoutSummary();
        switchCheckoutStep(1);
    }
};

function switchCheckoutStep(step) {
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.add('hidden'));
    document.querySelector(`.checkout-step[data-step="${step}"]`).classList.remove('hidden');
}

document.getElementById('shipping-form').onsubmit = (e) => {
    e.preventDefault();
    switchCheckoutStep(2);
};

document.getElementById('payment-form').onsubmit = (e) => {
    e.preventDefault();
    switchCheckoutStep(3);
    setTimeout(() => {
        const order = {
            id: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toLocaleDateString(),
            items: [...state.cart],
            total: state.cart.reduce((a, b) => a + (b.price * b.qty), 0)
        };
        state.orders.push(order);
        state.cart = [];
        saveState();
        updateUI();
        switchCheckoutStep(4);
        showToast("TRANSACTION COMPLETE", "success");
    }, 2500);
};

function renderOrderHistory() {
    const list = document.getElementById('order-history-list');
    if (state.orders.length === 0) {
        list.innerHTML = `<div class="py-10 text-[10px] opacity-20 uppercase">No prior data found.</div>`;
    } else {
        list.innerHTML = state.orders.map(o => `
            <div class="border border-bone/5 p-6 bg-bone/5">
                <div class="flex justify-between items-start mb-4 text-acid">
                    <span class="text-[8px] font-bold uppercase tracking-widest">${o.id}</span>
                    <span class="text-[8px] opacity-40 uppercase">${o.date}</span>
                </div>
                <div class="space-y-2">
                    ${o.items.map(i => `<div class="text-[10px] flex justify-between uppercase"><span>${i.name} x${i.qty}</span><span class="opacity-40">$${i.price * i.qty}</span></div>`).join('')}
                </div>
                <div class="mt-4 pt-4 border-t border-bone/10 flex justify-between font-bold text-xs uppercase">
                    <span>Valuation</span>
                    <span>$${o.total.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }
}

// --- UTILITIES ---
function showToast(text, type = "success") {
    Toastify({
        text: text,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: type === "error" ? "#ff0000" : "#ccff00",
        stopOnFocus: true,
        style: {
            color: type === "error" ? "#fff" : "#0a0a0a",
            fontFamily: "Syncopate",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "0px"
        }
    }).showToast();
}
