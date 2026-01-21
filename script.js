// script.js
let cart = [];
let user = null;

function addToCart(name, price) {
    cart.push({name, price});
    saveCart();
    alert(`${name} sepete eklendi!`);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price} TL`;
            cartItems.appendChild(li);
            total += item.price;
        });
        document.getElementById('total').textContent = total;
    }
}

function checkout() {
    if (!user) {
        alert('Satın almak için giriş yapın!');
        window.location.href = 'login.html';
        return;
    }
    alert('Satın alma işlemi tamamlandı! Teşekkürler.');
    cart = [];
    saveCart();
    loadCart();
}

function register(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basit doğrulama
    if (localStorage.getItem(email)) {
        alert('Bu e-posta zaten kayıtlı!');
        return;
    }
    
    user = {username, email};
    localStorage.setItem(email, JSON.stringify({username, password}));
    localStorage.setItem('currentUser', email);
    alert('Kayıt başarılı! Giriş yapılıyor...');
    window.location.href = 'index.html';
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const storedUser = localStorage.getItem(email);
    if (!storedUser) {
        alert('Kullanıcı bulunamadı!');
        return;
    }
    
    const parsed = JSON.parse(storedUser);
    if (parsed.password !== password) {
        alert('Yanlış şifre!');
        return;
    }
    
    user = {username: parsed.username, email};
    localStorage.setItem('currentUser', email);
    alert('Giriş başarılı!');
    window.location.href = 'index.html';
}

function googleLogin() {
    // Gerçek Google OAuth için Google API entegrasyonu gerekir, burada simüle ediyoruz
    alert('Google ile giriş simüle ediliyor...');
    user = {username: 'GoogleUser', email: 'google@example.com'};
    localStorage.setItem('currentUser', user.email);
    window.location.href = 'index.html';
}

function googleRegister() {
    // Gerçek Google OAuth için Google API entegrasyonu gerekir, burada simüle ediyoruz
    alert('Google ile kayıt simüle ediliyor...');
    user = {username: 'GoogleUser', email: 'google@example.com'};
    localStorage.setItem(user.email, JSON.stringify({username: user.username, password: ''}));
    localStorage.setItem('currentUser', user.email);
    window.location.href = 'index.html';
}

function logout() {
    user = null;
    localStorage.removeItem('currentUser');
    alert('Çıkış yapıldı!');
    window.location.href = 'index.html';
}

function loadProfile() {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail) {
        const storedUser = JSON.parse(localStorage.getItem(currentUserEmail));
        document.getElementById('profile-username').textContent = storedUser.username;
        document.getElementById('profile-email').textContent = currentUserEmail;
    } else {
        window.location.href = 'login.html';
    }
}

// Sayfa yüklenirken mevcut kullanıcıyı yükle
window.onload = function() {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail) {
        const storedUser = JSON.parse(localStorage.getItem(currentUserEmail));
        user = {username: storedUser.username, email: currentUserEmail};
    }
};
