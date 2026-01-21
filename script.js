// script.js
let cart = [];
let user = null;
let accounts = [];

function saveAccounts() {
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

function loadAccountsData() {
    accounts = JSON.parse(localStorage.getItem('accounts')) || [];
}

function renderAccountCard(account, container, showEdit = false) {
    const card = document.createElement('div');
    card.classList.add('account-card');
    card.innerHTML = `
        <h3>${account.title}</h3>
        ${account.image ? `<img src="${account.image}" alt="${account.title}">` : ''}
        <p>Açıklama: ${account.description}</p>
        <p>Rank: ${account.rank}</p>
        <p>Fiyat: ${account.price} TL</p>
        <button onclick="addToCart('${account.id}', ${account.price})">Sepete Ekle</button>
        ${showEdit ? `<button onclick="deleteAccount('${account.id}')">Sil</button>` : ''}
    `;
    container.appendChild(card);
}

function loadAccounts() {
    loadAccountsData();
    const container = document.getElementById('accounts-list');
    if (container) {
        container.innerHTML = '';
        accounts.forEach(account => renderAccountCard(account, container));
    }
}

function loadFeaturedAccounts() {
    loadAccountsData();
    const container = document.getElementById('featured-list');
    if (container) {
        container.innerHTML = '';
        // Rastgele 3 öne çıkan (veya tümü eğer azsa)
        const featured = accounts.sort(() => 0.5 - Math.random()).slice(0, 3);
        featured.forEach(account => renderAccountCard(account, container));
    }
}

function loadMyAccounts() {
    loadAccountsData();
    const container = document.getElementById('my-accounts');
    if (container && user) {
        container.innerHTML = '';
        const myAccounts = accounts.filter(a => a.owner === user.email);
        myAccounts.forEach(account => renderAccountCard(account, container, true));
    }
}

function addAccount(event) {
    event.preventDefault();
    if (!user) {
        alert('İlan eklemek için giriş yapın!');
        window.location.href = 'login.html';
        return;
    }
    loadAccountsData();
    const id = Date.now().toString();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const rank = document.getElementById('rank').value;
    const price = parseInt(document.getElementById('price').value);
    const image = document.getElementById('image').value;
    const newAccount = { id, title, description, rank, price, image, owner: user.email };
    accounts.push(newAccount);
    saveAccounts();
    alert('İlan eklendi!');
    document.querySelector('form').reset();
    window.location.href = 'accounts.html';
}

function deleteAccount(id) {
    loadAccountsData();
    accounts = accounts.filter(a => a.id !== id);
    saveAccounts();
    loadMyAccounts();
    alert('İlan silindi!');
}

function checkLoggedInForAdd() {
    if (!localStorage.getItem('currentUser')) {
        alert('İlan eklemek için giriş yapın!');
        window.location.href = 'login.html';
    }
}

function applyFilters() {
    loadAccountsData();
    const rank = document.getElementById('rank-filter').value;
    const minPrice = parseInt(document.getElementById('price-min').value) || 0;
    const maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;
    const filtered = accounts.filter(a => 
        (rank === '' || a.rank === rank) &&
        a.price >= minPrice &&
        a.price <= maxPrice
    );
    const container = document.getElementById('accounts-list');
    container.innerHTML = '';
    filtered.forEach(account => renderAccountCard(account, container));
}

function searchAccounts() {
    loadAccountsData();
    const query = document.getElementById('search-input').value.toLowerCase();
    const results = accounts.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.description.toLowerCase().includes(query) ||
        a.rank.toLowerCase().includes(query) ||
        a.price.toString().includes(query)
    );
    const container = document.getElementById('search-results');
    if (container) {
        container.innerHTML = '';
        results.forEach(account => renderAccountCard(account, container));
    }
}

function addToCart(id, price) {
    cart.push({id, price});
    saveCart();
    alert('Hesap sepete eklendi!');
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
            li.textContent = `Hesap ID: ${item.id} - ${item.price} TL`;
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
    // Simüle ödeme
    alert('Ödeme simüle ediliyor... Satın alma tamamlandı! Teşekkürler.');
    cart = [];
    saveCart();
    loadCart();
}

function register(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
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
    alert('Google ile giriş simüle ediliyor...');
    user = {username: 'GoogleUser', email: 'google@example.com'};
    localStorage.setItem('currentUser', user.email);
    localStorage.setItem(user.email, JSON.stringify({username: user.username, password: ''}));
    window.location.href = 'index.html';
}

function googleRegister() {
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
