/* Student Name: Terel Wallace
    Student ID: 2408416
    Course/Project: Lab 2
    File: script.js
*/
const cartCountElement = document.getElementById('cart-count');
const loginContainer = document.getElementById('login-container');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const userEmailInput = document.getElementById('user-email');

const signupForm = document.getElementById('signup-form');
const emailInput = document.querySelector('#email-input');
const validationMessage = document.getElementById('validation-message');
const currentYearElement = document.getElementById('current-year');

const contactForm = document.getElementById('contact-form');
const contactValidationMessage = document.getElementById('contact-validation-message');


const currentYear = new Date().getFullYear();
if (currentYearElement) {
    currentYearElement.textContent = currentYear;
}


function initializeApp() {
    const storedCart = localStorage.getItem('decorHavenCart');
    window.cart = storedCart ? JSON.parse(storedCart) : [];
    
    const storedLogin = localStorage.getItem('decorHavenUser');
    window.user = storedLogin ? JSON.parse(storedLogin) : null;
    
    renderCartCount();
    renderLoginStatus();

    if (document.title.includes('Products')) {
        setupProductPageListeners();
    } else if (document.title.includes('Cart')) {
        renderCartItems(); 
    }
}


function renderLoginStatus() {
    if (!loginContainer) return;
    
    if (window.user && window.user.isLoggedIn) {
        const namePart = window.user.email.split('@')[0];
        loginContainer.innerHTML = `
            <span class="logged-in-status" style="margin-right: 10px; color: var(--primary-color);">Welcome back, ${namePart}!</span>
            <a href="#" onclick="handleLogout()" class="logout-link">Log Out</a>
        `;
    } else {
        loginContainer.innerHTML = `
            <a id="login-link" href="#" onclick="showLoginModal()">Log In</a>
        `;
    }
}

function showLoginModal() {
    if (loginModal) loginModal.style.display = 'block';
}

function closeLoginModal() {
    if (loginModal) loginModal.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = userEmailInput.value.trim();
    if (!email) return;

    window.user = { email: email, isLoggedIn: true };
    localStorage.setItem('decorHavenUser', JSON.stringify(window.user));
    
    renderLoginStatus();
    closeLoginModal();
    alert(`Welcome back! You are now logged in.`);
}

function handleLogout() {
    window.user = null;
    localStorage.removeItem('decorHavenUser');
    renderLoginStatus();
    alert("You have been logged out successfully.");
}


function renderCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = window.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addToCart(productId, name, price) {
    const item = {
        id: productId,
        name: name,
        price: parseFloat(price),
        quantity: 1
    };
    
    const existingItem = window.cart.find(i => i.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        window.cart.push(item);
    }

    localStorage.setItem('decorHavenCart', JSON.stringify(window.cart));
    renderCartCount();
    
    alert(`${name} added to cart!`);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    const totalDisplay = document.getElementById('cart-summary-total');
    if (!container || !summary || !totalDisplay) return;

    if (window.cart.length === 0) {
        container.innerHTML = '<h2>Your cart is empty.</h2><p><a href="products.html">Browse our products</a> to find something special!</p>';
        summary.style.display = 'none';
        return;
    }

    let cartHTML = '';
    let totalPrice = 0;

    window.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${item.name} (x${item.quantity})</span>
                    <span class="item-price">$${item.price.toFixed(2)} each</span>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    container.innerHTML = cartHTML;
    summary.style.display = 'block';
    totalDisplay.textContent = `$${totalPrice.toFixed(2)}`;
}

function handleCheckout() {
    if (window.cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    alert(`Checking out with a total of ${document.getElementById('cart-summary-total').textContent}. Thank you for your purchase!`);
    
    window.cart = [];
    localStorage.removeItem('decorHavenCart');
    renderCartItems(); 
    renderCartCount();
}


function handleFormSubmit(event) {
    event.preventDefault(); 
    
    if (!emailInput || !validationMessage || !signupForm) return;

    const email = emailInput.value.trim();
    validationMessage.textContent = ''; 
    validationMessage.style.color = '#FFEB3B';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
         validationMessage.textContent = 'Error: Please enter a valid email address.';
         emailInput.focus();
         return;
    }

    validationMessage.style.color = '#8BC34A'; 
    validationMessage.textContent = `Success! Thank you for subscribing, ${email}.`;
    signupForm.reset(); 
}

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        if (contactValidationMessage) {
            contactValidationMessage.style.color = 'var(--christmas-green)';
            contactValidationMessage.innerHTML = `Thank you, ${formData.firstName} Your message has been sent. We will contact you at ${formData.email}.`;
        }
        
        contactForm.reset(); 
        console.log('Contact Request Submitted:', formData);
    });
}



if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
    signupForm.addEventListener('submit', handleFormSubmit);
}

function setupProductPageListeners() {
    const productButtons = document.querySelectorAll('.add-to-cart-btn');
    productButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            addToCart(id, name, price);
        });
    });
}

initializeApp();
