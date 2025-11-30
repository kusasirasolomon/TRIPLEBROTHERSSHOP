// ---------------------- LOAD PRODUCTS ----------------------
const LS_PRODUCTS = 'bk_products_v1';

// Load products saved by admin.js
let products = JSON.parse(localStorage.getItem(LS_PRODUCTS)) || [];

// DOM elements
const productContainer = document.getElementById("products");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartDrawer = document.getElementById("cartDrawer");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const checkoutFormSection = document.getElementById("checkoutForm");
const orderForm = document.getElementById("orderForm");

// ---------------------- RENDER PRODUCTS ----------------------
function renderProducts(filter = "all") {
    productContainer.innerHTML = "";

    let filtered = products;

    if (filter !== "all") {
        filtered = products.filter(p => p.category === filter);
    }

    filtered.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("product-card");

        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="desc">${p.desc}</p>
            <p class="price">
                <span class="old">UGX ${p.oldPrice}</span><br>
                <span class="new">UGX ${p.price}</span>
            </p>
            <button class="add-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
        `;

        productContainer.appendChild(div);
    });
}

// Initial render
renderProducts();

// ---------------------- FILTER BUTTONS ----------------------
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        btn.classList.add("active");

        const category = btn.dataset.filter;
        renderProducts(category);
    });
});

// ---------------------- CART FUNCTIONS ----------------------
function getCart() {
    return JSON.parse(localStorage.getItem("bk_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("bk_cart", JSON.stringify(cart));
}

// Update cart drawer UI
function updateCartUI() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const row = document.createElement("div");
        row.classList.add("cart-row");
        row.innerHTML = `
            <span>${item.name} - UGX ${item.price}</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalEl.textContent = "UGX " + total.toLocaleString();

    // Update cart button count
    cartBtn.textContent = `Cart (${cart.length})`;
}

// Add to cart
function addToCart(id) {
    const item = products.find(p => p.id == id);
    if (!item) return;

    const cart = getCart();
    cart.push(item);
    saveCart(cart);
    updateCartUI();
    cartDrawer.classList.remove("hidden"); // show drawer
}

// Remove from cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartUI();
}

// ---------------------- CART DRAWER TOGGLE ----------------------
cartBtn.addEventListener("click", () => {
    cartDrawer.classList.toggle("hidden");
});

closeCartBtn.addEventListener("click", () => {
    cartDrawer.classList.add("hidden");
});

// ---------------------- PLACE ORDER ----------------------
placeOrderBtn.addEventListener("click", () => {
    // Show checkout form
    checkoutFormSection.style.display = "block";
    cartDrawer.classList.add("hidden");
});

// ---------------------- WEB3FORMS SUBMISSION ----------------------
const WEB3FORMS_ACCESS_KEY = "7a3c70ea-9e0c-4cf6-98f6-87e73f50a803"; 
const OWNER_EMAIL = "triplebrothersshop@gmail.com"; 

orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Build order details
    let orderDetails = "";
    let total = 0;
    cart.forEach(item => {
        orderDetails += `${item.name} - UGX ${item.price}\n`;
        total += item.price;
    });

    const formData = new FormData(orderForm);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("email", OWNER_EMAIL);
    formData.append("subject", "New Order Received");
    formData.append("message", `Order Details:\n${orderDetails}\nTotal: UGX ${total.toLocaleString()}`);

    const submitBtn = orderForm.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        if (response.ok && result.success) {
            alert("Order sent successfully!");
            // Clear cart
            saveCart([]);
            updateCartUI();
            orderForm.reset();
            checkoutFormSection.style.display = "none";
        } else {
            alert("Failed to send order: " + (result.message || "Please try again."));
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ---------------------- INITIAL CART LOAD ----------------------
updateCartUI();
