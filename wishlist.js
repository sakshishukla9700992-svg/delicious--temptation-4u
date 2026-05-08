/**
 * ============================================================
 * WISHLIST ENGINE — Delicious Temptations 4U
 * ============================================================
 * Features:
 *  - Add / Remove toggle with ❤️ heart icon animation
 *  - localStorage persistence (survives page refresh)
 *  - Dynamic badge count update across ALL pages
 *  - Toast notification on every action
 *  - Works on: index.html, menu.html, product.html, wishlist.html
 * ============================================================
 */

/* ── Storage key ─────────────────────────────────────────── */
const WISHLIST_KEY = 'dt_wishlist';

/* ── Load wishlist array from localStorage ───────────────── */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

/* ── Save wishlist array to localStorage ─────────────────── */
function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

/* ── Check if a product is in the wishlist ───────────────── */
window.isInWishlist = function (productId) {
  return getWishlist().some(item => item.id === productId);
};

/* ── Toggle: add if absent, remove if present ────────────── */
window.toggleWishlist = function (productId, buttonEl) {
  // Wait for products global (loaded by app.js / productsData.js)
  const product = (typeof products !== 'undefined' ? products : [])
    .find(p => p.id === productId);

  if (!product) {
    showToast('Product not found 😕');
    return;
  }

  let wishlist = getWishlist();
  const exists = wishlist.some(item => item.id === productId);

  if (exists) {
    /* ── REMOVE ── */
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(wishlist);
    updateWishlistBadge();
    updateAllHeartButtons(productId, false);
    showToast(`💔 ${product.name} removed from Wishlist`);
  } else {
    /* ── ADD ── */
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      isBestseller: product.isBestseller || false,
      addedAt: new Date().toISOString()
    });
    saveWishlist(wishlist);
    updateWishlistBadge();
    updateAllHeartButtons(productId, true);

    /* ── Heart pop animation ── */
    if (buttonEl) {
      buttonEl.classList.add('heart-pop');
      setTimeout(() => buttonEl.classList.remove('heart-pop'), 600);
    }

    showToast(`❤️ ${product.name} added to Wishlist!`);
  }
};

/* ── Update the badge counter in the navbar ─────────────── */
window.updateWishlistBadge = function () {
  const count = getWishlist().length;
  document.querySelectorAll('#wishlist-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
};

/* ── Sync all ❤️ buttons on the page for a given productId ─ */
function updateAllHeartButtons(productId, isWishlisted) {
  document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    if (isWishlisted) {
      btn.classList.add('wishlisted');
      btn.setAttribute('title', 'Remove from Wishlist');
      btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      btn.classList.remove('wishlisted');
      btn.setAttribute('title', 'Add to Wishlist');
      btn.innerHTML = '<i class="far fa-heart"></i>';
    }
  });
}

/* ── Sync ALL heart buttons on the page on load ─────────── */
window.syncAllWishlistButtons = function () {
  document.querySelectorAll('.wishlist-btn[data-id]').forEach(btn => {
    const id = parseInt(btn.getAttribute('data-id'));
    const inList = isInWishlist(id);
    if (inList) {
      btn.classList.add('wishlisted');
      btn.setAttribute('title', 'Remove from Wishlist');
      btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      btn.classList.remove('wishlisted');
      btn.setAttribute('title', 'Add to Wishlist');
      btn.innerHTML = '<i class="far fa-heart"></i>';
    }
  });
};

/* ── Remove item directly (used in wishlist.html) ────────── */
window.removeFromWishlist = function (productId) {
  let wishlist = getWishlist().filter(item => item.id !== productId);
  saveWishlist(wishlist);
  updateWishlistBadge();
  updateAllHeartButtons(productId, false);
  showToast('💔 Removed from Wishlist');

  // Re-render wishlist page if we're on it
  if (typeof renderWishlistPage === 'function') renderWishlistPage();
};

/* ── Clear entire wishlist ───────────────────────────────── */
window.clearWishlist = function () {
  saveWishlist([]);
  updateWishlistBadge();
  if (typeof renderWishlistPage === 'function') renderWishlistPage();
  showToast('🗑️ Wishlist cleared');
};

/* ── Move wishlist item to cart ─────────────────────────── */
window.moveToCart = function (productId) {
  addToCart(productId);          // from app.js
  removeFromWishlist(productId); // clean wishlist
};

/* ── Initialise on every page load ──────────────────────── */
(function initWishlist() {
  // Run badge update once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateWishlistBadge();
    });
  } else {
    updateWishlistBadge();
  }
})();

/* ── Helper: build a wishlist-aware heart button HTML ────── */
window.getWishlistButtonHTML = function (productId) {
  const active = isInWishlist(productId);
  return `<button
    class="action-btn wishlist-btn ${active ? 'wishlisted' : ''}"
    data-id="${productId}"
    title="${active ? 'Remove from Wishlist' : 'Add to Wishlist'}"
    onclick="toggleWishlist(${productId}, this)">
    <i class="${active ? 'fas' : 'far'} fa-heart"></i>
  </button>`;
};
