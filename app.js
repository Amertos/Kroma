/**
 * Lumina E-commerce SPA - Logic
 * High-performance vanilla JS state management
 */

class Store {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('lumina_products')) || [];
        this.cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('lumina_wishlist')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('lumina_user')) || null;
        this.filter = 'All';
        this.searchQuery = '';

        // Always re-seed if products count is low to ensure the "expanded" list is present
        if (this.products.length < 20) this.seedProducts();
    }

    seedProducts() {
        const initialProducts = [
            { id: 1, name: "Soundscape Headphones", price: 299.00, category: "Audio", description: "Immersive sound with active noise cancellation and 40-hour battery life.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800" },
            { id: 2, name: "Minimalist Desk Lamp", price: 89.00, category: "Home", description: "Adjustable brightness and color temperature in a sleek aluminum frame.", image: "https://images.unsplash.com/photo-1507473885765-e6ed03a27453?auto=format&fit=crop&q=80&w=800" },
            { id: 3, name: "Aero Watch Series 4", price: 450.00, category: "Tech", description: "Advanced health tracking and a stunning always-on OLED display.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" },
            { id: 4, name: "Canvas Carry-all", price: 120.00, category: "Style", description: "Durable organic canvas with Italian leather accents for daily essentials.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800" },
            { id: 5, name: "Nordic Ceramic Set", price: 155.00, category: "Home", description: "Hand-thrown stoneware with a matte finish, perfect for any kitchen.", image: "https://images.unsplash.com/photo-1518050947974-4be8c7469f0c?auto=format&fit=crop&q=80&w=800" },
            { id: 6, name: "Evo Tablet Pro", price: 899.00, category: "Tech", description: "Powerful M2 chip with a breathtaking Liquid Retina Display.", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800" },
            { id: 7, name: "Zen Mechanical Keyboard", price: 180.00, category: "Tech", description: "Aluminum chassis with hot-swappable switches for the ultimate typing feel.", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800" },
            { id: 8, name: "Polaroid OneStep", price: 129.00, category: "Tech", description: "Analog instant camera for the modern era. Point, shoot, and keep.", image: "https://images.unsplash.com/photo-1526170315830-ef18a283ac1e?auto=format&fit=crop&q=80&w=800" },
            { id: 9, name: "Oak Office Chair", price: 420.00, category: "Home", description: "Ergonomic design meets natural materials for all-day comfort.", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800" },
            { id: 10, name: "Leather Journal", price: 45.00, category: "Style", description: "Premium top-grain leather cover with archival quality paper.", image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800" },
            { id: 11, name: "Studio Microphone", price: 299.00, category: "Audio", description: "Broadcast-quality cardioid condenser for podcasting and streaming.", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" },
            { id: 12, name: "Brushed Steel Kettle", price: 75.00, category: "Home", description: "Precision pour spout and rapid boil technology.", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800" },
            { id: 13, name: "Wireless Charging Pad", price: 55.00, category: "Tech", description: "Fast charging for all Qi-enabled devices with a fabric finish.", image: "https://images.unsplash.com/photo-1616464916356-3a777b2b60b1?auto=format&fit=crop&q=80&w=800" },
            { id: 14, name: "Silver Fountain Pen", price: 110.00, category: "Style", description: "Polished sterling silver barrel with a 14k gold nib.", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800" },
            { id: 15, name: "Smart Thermostat", price: 249.00, category: "Tech", description: "Intelligent climate control that learns your schedule and saves energy.", image: "https://images.unsplash.com/photo-1567928263302-6019316dce80?auto=format&fit=crop&q=80&w=800" },
            { id: 16, name: "Ceramic Coffee Dripper", price: 35.00, category: "Home", description: "Handcrafted dripper for the perfect pour-over experience.", image: "https://images.unsplash.com/photo-1544434553-94df22600362?auto=format&fit=crop&q=80&w=800" },
            { id: 17, name: "Modular Backpack", price: 195.00, category: "Style", description: "Weather-resistant fabric with customizable internal compartments.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800" },
            { id: 18, name: "Bluetooth Speaker M1", price: 145.00, category: "Audio", description: "360-degree sound with deep bass and waterproof construction.", image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=800" },
            { id: 19, name: "Essential Oil Diffuser", price: 65.00, category: "Home", description: "Ultrasonic technology for a fine, calming mist.", image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800" },
            { id: 20, name: "Mirrorless Camera Z6", price: 1299.00, category: "Tech", description: "Full-frame sensor with incredible low-light performance.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
            { id: 21, name: "Cashmere Scarf", price: 85.00, category: "Style", description: "Ultra-soft 100% cashmere from Mongolian highlands.", image: "https://images.unsplash.com/photo-1520903920243-00dabd8c3955?auto=format&fit=crop&q=80&w=800" },
            { id: 22, name: "Noise Isolating Buds", price: 179.00, category: "Audio", description: "True wireless audio with custom-fit silicone tips.", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800" }
        ];
        this.products = initialProducts;
        this.save('products');
    }

    save(key) {
        localStorage.setItem(`lumina_${key}`, JSON.stringify(this[key]));
    }

    addToCart(product) {
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            this.cart.push({ ...product, qty: 1 });
        }
        this.save('cart');
        ui.updateCart();
        Swal.fire({ title: 'Added to Bag', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    }

    toggleWishlist(id) {
        const index = this.wishlist.findIndex(item => item.id === id);
        if (index > -1) {
            this.wishlist.splice(index, 1);
        } else {
            const product = this.products.find(p => p.id === id);
            this.wishlist.push(product);
        }
        this.save('wishlist');
        ui.renderProducts();
        ui.updateWishlistCount();
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.save('cart');
        ui.updateCart();
    }

    updateQty(id, delta) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty < 1) return this.removeFromCart(id);
            this.save('cart');
            ui.updateCart();
        }
    }

    clearCart() {
        this.cart = [];
        this.save('cart');
        ui.updateCart();
    }

    setFilter(category) {
        this.filter = category;
        ui.renderProducts();
    }

    setSearch(query) {
        this.searchQuery = query.toLowerCase();
        ui.renderProducts();
    }
}

const ui = {
    init() {
        this.renderProducts();
        this.updateCart();
        this.updateWishlistCount();
        this.checkAuth();
        this.setupListeners();
    },

    renderProducts() {
        const grid = document.getElementById('product-grid');
        let displayedProducts = store.products;

        if (store.filter !== 'All') {
            displayedProducts = displayedProducts.filter(p => p.category === store.filter);
        }

        if (store.searchQuery) {
            displayedProducts = displayedProducts.filter(p =>
                p.name.toLowerCase().includes(store.searchQuery) ||
                p.category.toLowerCase().includes(store.searchQuery)
            );
        }

        if (displayedProducts.length === 0) {
            grid.innerHTML = `<div class="col-span-full py-20 text-center"><p class="text-gray-400 font-medium">No results found for your search.</p></div>`;
            return;
        }

        grid.innerHTML = displayedProducts.map((p, idx) => {
            const isInWishlist = store.wishlist.some(item => item.id === p.id);
            return `
                <div class="product-card group relative" style="animation-delay: ${idx * 0.05}s">
                    <div class="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-sm transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                        <img loading="lazy" src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                        
                        <!-- Actions Overlay -->
                        <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <button onclick="store.toggleWishlist(${p.id})" 
                                class="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${isInWishlist ? 'text-rose-500' : 'text-slate-400'}">
                            <i class="${isInWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>

                        <div class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex gap-3">
                            <button onclick="ui.showDetail(${p.id})" class="flex-1 bg-white/90 backdrop-blur-md text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">
                                Quick View
                            </button>
                            <button onclick="store.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})" class="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mt-8 px-4 text-center sm:text-left">
                        <span class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold block mb-2">${p.category}</span>
                        <h3 class="text-base font-semibold text-slate-800">${p.name}</h3>
                        <p class="text-sm font-medium text-gray-500 mt-1">$${p.price.toFixed(2)}</p>
                    </div>
                </div>
            `;
        }).join('');
    },

    showDetail(id) {
        const product = store.products.find(p => p.id === id);
        const modal = document.getElementById('detail-modal');
        const content = document.getElementById('detail-content');

        content.innerHTML = `
            <div class="flex flex-col md:flex-row gap-12">
                <div class="md:w-1/2 rounded-[2.5rem] overflow-hidden bg-gray-50">
                    <img src="${product.image}" class="w-full h-full object-cover">
                </div>
                <div class="md:w-1/2 flex flex-col justify-center">
                    <span class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-4 block">${product.category}</span>
                    <h2 class="text-4xl font-black tracking-tight mb-6">${product.name}</h2>
                    <p class="text-gray-500 leading-relaxed mb-8">${product.description || 'Premium design meets uncompromising utility.'}</p>
                    <div class="text-3xl font-black mb-10">$${product.price.toFixed(2)}</div>
                    
                    <div class="flex gap-4">
                        <button onclick="store.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="flex-1 bg-black text-white py-5 rounded-3xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl">
                            Add to Bag
                        </button>
                        <button onclick="store.toggleWishlist(${product.id}); ui.showDetail(${product.id})" 
                                class="w-16 h-16 border-2 border-gray-100 rounded-3xl flex items-center justify-center hover:border-black transition-all group">
                            <i class="${store.wishlist.some(i => i.id === product.id) ? 'fa-solid text-rose-500' : 'fa-regular text-gray-300'} fa-heart text-xl transition-transform group-hover:scale-110"></i>
                        </button>
                    </div>
                    
                    <div class="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px]"><i class="fa-solid fa-truck"></i></div>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fixed Shipping</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px]"><i class="fa-solid fa-shield-halved"></i></div>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">2 Year Warranty</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('open');
    },

    updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        const totalItems = store.cart.reduce((a, b) => a + b.qty, 0);
        cartCount.textContent = totalItems;
        cartCount.style.opacity = totalItems > 0 ? '1' : '0';

        if (store.cart.length === 0) {
            cartItems.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-gray-300">
                <i class="fa-solid fa-bag-shopping text-5xl mb-6 opacity-20"></i>
                <p class="text-sm font-medium">Your shopping bag is empty.</p>
            </div>`;
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = store.cart.map(item => `
                <div class="flex gap-6 items-center p-4 bg-gray-50 rounded-3xl group">
                    <div class="w-20 h-24 flex-shrink-0 overflow-hidden rounded-2xl">
                        <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="flex-1">
                        <h4 class="text-sm font-bold text-slate-800">${item.name}</h4>
                        <p class="text-xs text-gray-500 mb-3">$${item.price.toFixed(2)}</p>
                        <div class="flex items-center gap-4">
                            <button onclick="store.updateQty(${item.id}, -1)" class="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-all"><i class="fa-solid fa-minus text-[10px]"></i></button>
                            <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                            <button onclick="store.updateQty(${item.id}, 1)" class="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-all"><i class="fa-solid fa-plus text-[10px]"></i></button>
                        </div>
                    </div>
                    <button onclick="store.removeFromCart(${item.id})" class="p-2 text-gray-300 hover:text-red-500 transition-colors"><i class="fa-solid fa-trash-can text-sm"></i></button>
                </div>
            `).join('');
            checkoutBtn.disabled = false;
        }

        const total = store.cart.reduce((a, b) => a + (b.price * b.qty), 0);
        cartTotal.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    updateWishlistCount() {
        const count = document.getElementById('wishlist-count');
        if (count) {
            count.textContent = store.wishlist.length;
            count.style.opacity = store.wishlist.length > 0 ? '1' : '0';
        }
    },

    setupListeners() {
        // Cart Drawer
        document.getElementById('cart-trigger').onclick = () => document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-close').onclick = () => document.getElementById('cart-drawer').classList.remove('open');
        document.getElementById('cart-overlay').onclick = () => document.getElementById('cart-drawer').classList.remove('open');

        // Detail Modal
        document.getElementById('detail-close').onclick = () => document.getElementById('detail-modal').classList.remove('open');
        document.getElementById('detail-overlay').onclick = () => document.getElementById('detail-modal').classList.remove('open');

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.oninput = (e) => store.setSearch(e.target.value);
        }

        // Newsletter
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.onsubmit = (e) => {
                e.preventDefault();
                Swal.fire({
                    title: 'Joined the Inner Circle',
                    text: 'Expect perfection in your inbox soon.',
                    icon: 'success',
                    confirmButtonColor: '#000',
                    customClass: { popup: 'rounded-[2.5rem]' }
                });
                e.target.reset();
            };
        }

        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.onclick = () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                store.setFilter(chip.dataset.category);
            };
        });

        // Auth
        document.getElementById('auth-trigger').onclick = () => {
            if (store.currentUser) {
                if (store.currentUser.role === 'admin') {
                    document.getElementById('admin-modal').classList.add('open');
                } else {
                    this.logout();
                }
            } else {
                document.getElementById('auth-modal').classList.add('open');
            }
        };

        document.getElementById('auth-overlay').onclick = () => document.getElementById('auth-modal').classList.remove('open');
        document.getElementById('auth-toggle').onclick = (e) => {
            e.preventDefault();
            const isLogin = document.getElementById('auth-title').textContent === 'Welcome Back';
            document.getElementById('auth-title').textContent = isLogin ? 'Create Account' : 'Welcome Back';
            document.getElementById('auth-subtitle').textContent = isLogin ? 'Join the Lumina design community.' : 'Please enter your details to continue.';
            document.getElementById('auth-form').querySelector('button').textContent = isLogin ? 'Sign Up' : 'Sign In';
            document.getElementById('auth-toggle').textContent = isLogin ? 'Sign In' : 'Join Lumina';
            document.getElementById('auth-switch-text').firstChild.textContent = isLogin ? 'Already have an account? ' : "Don't have an account? ";
        };

        document.getElementById('auth-form').onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-password').value;

            if (email === 'admin@shop.com' && pass === 'admin') {
                store.currentUser = { email, role: 'admin' };
            } else {
                store.currentUser = { email, role: 'user' };
            }

            store.save('user');
            this.checkAuth();
            document.getElementById('auth-modal').classList.remove('open');
            Swal.fire({ title: 'Welcome!', text: `Signed in as ${email}`, icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        };

        // Admin Panel
        document.getElementById('admin-close').onclick = () => document.getElementById('admin-modal').classList.remove('open');
        document.getElementById('admin-overlay').onclick = () => document.getElementById('admin-modal').classList.remove('open');
        document.getElementById('logout-btn').onclick = () => this.logout();

        document.getElementById('product-form').onsubmit = (e) => {
            e.preventDefault();
            const newProduct = {
                id: Date.now(),
                name: document.getElementById('p-name').value,
                price: parseFloat(document.getElementById('p-price').value),
                category: document.getElementById('p-category').value,
                image: document.getElementById('p-image').value
            };
            store.products.push(newProduct);
            store.save('products');
            this.renderProducts();
            document.getElementById('admin-modal').classList.remove('open');
            e.target.reset();
            Swal.fire({ title: 'Product Added', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        };

        // Checkout
        document.getElementById('checkout-btn').onclick = async () => {
            const btn = document.getElementById('checkout-btn');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner mx-auto border-white border-t-transparent"></div>';

            await new Promise(r => setTimeout(r, 2000));

            btn.innerHTML = originalText;
            btn.disabled = false;
            store.clearCart();
            document.getElementById('cart-drawer').classList.remove('open');

            Swal.fire({
                title: 'Order Confirmed',
                text: 'Thank you for choosing Lumina. We are processing your request.',
                icon: 'success',
                confirmButtonText: 'Great',
                confirmButtonColor: '#000',
                background: '#fff',
                customClass: {
                    popup: 'rounded-[2.5rem] p-10',
                    title: 'text-2xl font-bold',
                    confirmButton: 'px-8 py-3 rounded-2xl font-bold'
                }
            });
        };
    },

    checkAuth() {
        const isAdmin = store.currentUser && store.currentUser.role === 'admin';
        document.getElementById('admin-nav-link').classList.toggle('hidden', !isAdmin);
    },

    logout() {
        store.currentUser = null;
        store.save('user');
        this.checkAuth();
        document.getElementById('admin-modal').classList.remove('open');
        Swal.fire({ title: 'Signed Out', icon: 'info', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
};

const store = new Store();
ui.init();
