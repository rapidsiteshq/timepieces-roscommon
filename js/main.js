document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initFormValidation();
  initGallery();
  initContactForm();
  loadFonts();
  updateCartCount();
});

function loadFonts() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Jost:wght@400;500;600&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function() {
    nav.classList.toggle('active');
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('header')) {
      nav.classList.remove('active');
    }
  });

  // Handle desktop hover for submenus
  const menuItems = nav.querySelectorAll('li:has(.submenu)');
  menuItems.forEach(item => {
    const submenu = item.querySelector('.submenu');

    // Keep submenu open on hover
    item.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        submenu.style.display = 'flex';
      }
    });

    item.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        submenu.style.display = 'none';
      }
    });

    // Mobile click handling
    item.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = submenu.classList.contains('open');

        // Close all other submenus
        document.querySelectorAll('.submenu.open').forEach(m => {
          if (m !== submenu) m.classList.remove('open');
        });

        // Toggle this submenu
        submenu.classList.toggle('open');
      }
    });
  });

  nav.querySelectorAll('a:not(:has(+ .submenu))').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
      }
    });
  });
}

function initFormValidation() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    input.addEventListener('focus', function() {
      clearFieldError(this);
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm(this)) {
      submitForm(this);
    }
  });
}

function validateField(field) {
  clearFieldError(field);
  let isValid = true;

  if (!field.value.trim()) {
    showFieldError(field, 'This field is required');
    return false;
  }

  if (field.type === 'email' || field.name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }
  }

  if (field.name === 'phone') {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (field.value && !phoneRegex.test(field.value)) {
      showFieldError(field, 'Please enter a valid phone number');
      return false;
    }
  }

  if (field.name === 'message' && field.value.length < 10) {
    showFieldError(field, 'Message must be at least 10 characters');
    return false;
  }

  return true;
}

function validateForm(form) {
  const fields = form.querySelectorAll('input, textarea');
  let isValid = true;

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorDiv = field.parentElement.querySelector('.error-message') || document.createElement('div');
  if (!errorDiv.classList.contains('error-message')) {
    errorDiv.className = 'error-message';
    field.parentElement.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorDiv = field.parentElement.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

function submitForm(form) {
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const phone = form.querySelector('[name="phone"]').value;
  const message = form.querySelector('[name="message"]').value;
  const item = form.querySelector('[name="item"]').value;

  let subject = 'Enquiry from Time Pieces Website';
  let body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`;
  if (item) {
    body += `\nEnquiry about: ${item}`;
  }
  body += `\n\nMessage:\n${message}`;

  const mailtoLink = `mailto:info@rapidsites.eu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;

  setTimeout(() => {
    const successMsg = document.querySelector('.success-message');
    if (successMsg) {
      successMsg.classList.add('show');
      form.style.display = 'none';
      setTimeout(() => {
        successMsg.classList.remove('show');
        form.style.display = 'block';
        form.reset();
      }, 3000);
    }
  }, 200);
}

function initContactForm() {
  const params = new URLSearchParams(window.location.search);
  const itemHandle = params.get('item');
  const itemName = params.get('name');

  if (itemHandle && itemName) {
    const itemField = document.querySelector('[name="item"]');
    if (itemField) {
      itemField.value = itemName;
    }
    const messageField = document.querySelector('[name="message"]');
    if (messageField) {
      messageField.value = `I'm interested in enquiring about: ${itemName}\n\n`;
      messageField.focus();
    }
  }
}

function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || items.length === 0) return;

  let currentIndex = 0;
  const images = Array.from(items).map(item => item.querySelector('img').src);

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      showLightbox(images[currentIndex]);
    });
  });

  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideLightbox);
  }

  const prevBtn = lightbox.querySelector('.lightbox-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showLightbox(images[currentIndex]);
    });
  }

  const nextBtn = lightbox.querySelector('.lightbox-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      showLightbox(images[currentIndex]);
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showLightbox(images[currentIndex]);
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      showLightbox(images[currentIndex]);
    }
  });
}

function showLightbox(src) {
  const lightbox = document.querySelector('.lightbox');
  const img = lightbox.querySelector('img');
  if (img) {
    img.src = src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function hideLightbox() {
  const lightbox = document.querySelector('.lightbox');
  lightbox.classList.remove('show');
  document.body.style.overflow = 'auto';
}

window.addEventListener('resize', debounce(() => {
  const nav = document.querySelector('nav');
  if (window.innerWidth > 768 && nav) {
    nav.classList.remove('active');
  }
}, 250));

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('timepieces-cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  let cartCounter = document.querySelector('.cart-counter');
  if (!cartCounter && count > 0) {
    const cartLink = document.querySelector('a[href="/cart.html"]');
    if (cartLink) {
      cartCounter = document.createElement('span');
      cartCounter.className = 'cart-counter';
      cartLink.style.position = 'relative';
      cartLink.appendChild(cartCounter);
    }
  }

  if (cartCounter) {
    if (count > 0) {
      cartCounter.textContent = count;
      cartCounter.style.display = 'flex';
    } else {
      cartCounter.style.display = 'none';
    }
  }
}
