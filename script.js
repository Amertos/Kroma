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

// --- THREE.JS BACKGROUND ---
function initThree() {
    try {
        const canvas = document.querySelector('#webgl');
        if (!canvas) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.IcosahedronGeometry(2.5, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xccff00, wireframe: true, transparent: true, opacity: 0.08 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        camera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            mesh.rotation.y += 0.004;
            mesh.rotation.x += 0.002;
            mesh.position.x += (mouseX * 0.4 - mesh.position.x) * 0.05;
            mesh.position.y += (-mouseY * 0.4 - mesh.position.y) * 0.05;
            renderer.render(scene, camera);
        };
        animate();

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

// --- GSAP REVEALS ---
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
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

    gsap.from(".product-card", {
        scrollTrigger: { trigger: "#shop", start: "top 80%" },
        y: 80,
        opacity: 0,
        stagger: 0.1,
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
