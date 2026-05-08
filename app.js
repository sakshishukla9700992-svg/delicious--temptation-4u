// ── State ────────────────────────────────────────────────
let products = [];
let cart = JSON.parse(localStorage.getItem('dt_cart')) || [];
// wishlist state is managed entirely in wishlist.js via localStorage

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  await loadProducts();

  setupNavbar();
  setupMobileDrawer();
  setupScrollReveal();
  updateCartBadge();

  // ── Sync wishlist badge and heart buttons after products load ──
  if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
  if (typeof syncAllWishlistButtons === 'function') syncAllWishlistButtons();

  // ── Trigger page-specific initializers if they exist ──
  if (typeof initHomePage === 'function') initHomePage();
  if (typeof initMenuPage === 'function') initMenuPage();
  if (typeof initProductPage === 'function') initProductPage();
  if (typeof initCartPage === 'function') initCartPage();
  if (typeof initCheckoutPage === 'function') initCheckoutPage();
  if (typeof initWishlistPage === 'function') initWishlistPage();
}

async function loadProducts() {
  try {
    // Local fetch fails due to CORS when opening file directly.
    // We now use productsData.js which defines a global `productsData` variable.
    if (typeof productsData !== 'undefined') {
      products = productsData;
    } else {
      console.error("productsData is not defined. Ensure productsData.js is loaded.");
    }
  } catch (err) {
    console.error("Failed to load products", err);
  }
}

// === NAVBAR & UI ===
function setupNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function setupMobileDrawer() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  }
}

function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // observer.unobserve(entry.target); // optional: run once
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

// === CART LOGIC ===
window.addToCart = function (productId, qty = 1, flavor = null, weight = null) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Calculate specific price if weight provided
  let price = product.price;
  if (weight === '1kg') price = product.price * 1.8;
  if (weight === '2kg') price = product.price * 3.4;

  // Create unique cart item ID
  const cartItemId = `${productId}-${flavor || 'default'}-${weight || 'default'}`;

  const existingItem = cart.find(item => item.cartItemId === cartItemId);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      ...product,
      cartItemId,
      qty,
      selectedFlavor: flavor || product.flavor,
      selectedWeight: weight,
      price: price
    });
  }

  saveCart();
  updateCartBadge();
  showToast(`${product.name} added to cart! 🛒`);
}

function saveCart() {
  localStorage.setItem('dt_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalItems;

  if (totalItems > 0) {
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

window.removeFromCart = function (cartItemId) {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  saveCart();
  updateCartBadge();
  if (typeof renderCartItems === 'function') renderCartItems();
}

window.updateCartQty = function (cartItemId, change) {
  const item = cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    removeFromCart(cartItemId);
  } else {
    saveCart();
    updateCartBadge();
    if (typeof renderCartItems === 'function') renderCartItems();
  }
}

window.clearCart = function () {
  cart = [];
  saveCart();
  updateCartBadge();
  if (typeof renderCartItems === 'function') renderCartItems();
}

// === TOAST SYSTEM ===
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// === UTILITIES ===
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function formatCurrency(amount) {
  return '₹' + amount.toFixed(2);
}

// Ensure globally accessible
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.getQueryParam = getQueryParam;
