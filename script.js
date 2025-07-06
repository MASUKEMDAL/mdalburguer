// Loading Screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
});

// AOS Animation Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
    }
  });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
  const aosElements = document.querySelectorAll('[data-aos]');
  aosElements.forEach(el => observer.observe(el));
});

// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-button, .mobile-tab-button');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(tabId) {
  // Remove active class from all buttons and contents
  tabButtons.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  // Add active class to clicked button and corresponding content
  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(btn => {
    btn.classList.add('active');
  });
  
  const targetContent = document.getElementById(tabId);
  if (targetContent) {
    targetContent.classList.add('active');
    
    // Re-observe AOS elements in the new tab
    const aosElements = targetContent.querySelectorAll('[data-aos]');
    aosElements.forEach(el => {
      el.classList.remove('aos-animate');
      observer.observe(el);
    });
  }
  
  // Close mobile menu if open
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav.classList.contains('active')) {
    toggleMobileMenu();
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    switchTab(tabId);
  });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');

function toggleMobileMenu() {
  mobileNav.classList.toggle('active');
  mobileMenuToggle.classList.toggle('active');
  
  // Animate hamburger menu
  const spans = mobileMenuToggle.querySelectorAll('span');
  if (mobileMenuToggle.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);

// Modal functionality
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');
const modalBackdrop = document.querySelector('.modal-backdrop');

function openModal(imageSrc) {
  modal.style.display = 'block';
  modalImg.src = imageSrc;
  document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Add click event to all product images
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('product-img')) {
    openModal(e.target.src);
  }
  
  if (e.target.classList.contains('quick-view-btn')) {
    const img = e.target.closest('.card').querySelector('.product-img');
    openModal(img.src);
  }
});

closeModal.addEventListener('click', closeModalFunc);
modalBackdrop.addEventListener('click', closeModalFunc);

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    closeModalFunc();
  }
});

// Cart functionality
let cart = [];
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartEmpty = document.getElementById('cartEmpty');
const whatsappLink = document.getElementById('whatsappLink');
const closeCartBtn = document.getElementById('closeCart');

// Toast notification system
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : '❌';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Add to cart functionality
document.addEventListener('click', (e) => {
  if (e.target.closest('.add-cart')) {
    const button = e.target.closest('.add-cart');
    const card = button.closest('.card');
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());

    // Add item to cart
    cart.push({ name, price });
    updateCart();
    
    // Show success toast
    showToast(`${name} adicionado ao carrinho!`);
    
    // Add visual feedback to button
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
});

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  const grouped = {};

  // Group items by name
  cart.forEach((item, index) => {
    if (!grouped[item.name]) {
      grouped[item.name] = { 
        name: item.name, 
        totalPrice: item.price, 
        qty: 1, 
        indices: [index] 
      };
    } else {
      grouped[item.name].qty++;
      grouped[item.name].totalPrice += item.price;
      grouped[item.name].indices.push(index);
    }
  });

  // Show/hide empty cart message
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
  }

  // Render grouped items
  Object.values(grouped).forEach(group => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${group.name}</strong><br>
        <small>Quantidade: ${group.qty}</small>
      </div>
      <div style="text-align: right;">
        <div style="color: var(--primary-color); font-weight: bold;">
          R$ ${group.totalPrice.toFixed(2).replace('.', ',')}
        </div>
        <button class="remove-item" data-name="${group.name}">Remover</button>
      </div>
    `;
    cartItems.appendChild(li);
    total += group.totalPrice;
  });

  // Update cart total and count
  cartTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  cartCount.textContent = cart.length;

  // Update WhatsApp link
  if (cart.length > 0) {
    const msg = Object.values(grouped)
      .map(i => `- ${i.name} x${i.qty}`)
      .join('%0A') + `%0A%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    whatsappLink.href = `https://wa.me/5534998829396?text=Olá! Quero fazer o seguinte pedido:%0A%0A${msg}`;
    whatsappLink.style.display = 'flex';
  } else {
    whatsappLink.style.display = 'none';
  }

  // Add remove item event listeners
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const nameToRemove = btn.getAttribute('data-name');
      const index = cart.findIndex(i => i.name === nameToRemove);
      if (index !== -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        updateCart();
        showToast(`${removedItem.name} removido do carrinho!`, 'success');
      }
    });
  });
}

// Cart modal controls
function openCart() {
  cartModal.classList.add('show');
  cartOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartModal.classList.remove('show');
  cartOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

cartButton.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Close cart with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartModal.classList.contains('show')) {
    closeCart();
  }
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    header.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    header.style.transform = 'translateY(0)';
  }
  
  // Add background blur when scrolled
  if (scrollTop > 50) {
    header.style.background = 'rgba(31, 31, 31, 0.98)';
  } else {
    header.style.background = 'rgba(31, 31, 31, 0.95)';
  }
  
  lastScrollTop = scrollTop;
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCart();
  
  // Set first tab as active
  const firstTab = document.querySelector('.tab-button');
  if (firstTab) {
    firstTab.classList.add('active');
  }
  
  const firstContent = document.querySelector('.tab-content');
  if (firstContent) {
    firstContent.classList.add('active');
  }
});

// Performance optimization: Lazy load images
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    }
  });
});

// Observe all images for lazy loading
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
  if (e.target.matches('.add-cart, .tab-button, .mobile-tab-button')) {
    const button = e.target;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}