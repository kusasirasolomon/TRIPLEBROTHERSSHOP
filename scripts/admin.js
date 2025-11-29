// localStorage key
const LS_PRODUCTS = 'bk_products_v1';

// DOM Elements
const addProductForm = document.getElementById('addProductForm');
const productListEl = document.getElementById('productList');

// Load products
function loadProducts() {
    const raw = localStorage.getItem(LS_PRODUCTS);
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.warn("Bad JSON in localStorage", e);
        }
    }
    return [];
}

let products = loadProducts();

// Render products on screen
function renderProducts() {
    productListEl.innerHTML = "";

    products.forEach(p => {
        const li = document.createElement("li");
        li.className = "product-item";
        li.innerHTML = `
            <span><strong>${p.name}</strong> — ${p.category}</span>
            <button class="delete-btn" data-id="${p.id}">Delete</button>
        `;
        productListEl.appendChild(li);
    });
}

// Add product
addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProduct = {
        id: "p" + Date.now(),
        name: document.getElementById("productName").value,
        category: document.getElementById("productCategory").value,
        image: document.getElementById("productImage").value,
        oldPrice: parseFloat(document.getElementById("productOldPrice").value),
        price: parseFloat(document.getElementById("productPrice").value),
        desc: document.getElementById("productDesc").value,
    };

    products.push(newProduct);
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
    renderProducts();
    addProductForm.reset();
});

// Delete product
productListEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        products = products.filter(p => p.id !== id);
        localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
        renderProducts();
    }
});

// Initial load
renderProducts();
