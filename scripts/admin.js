// ---------------------- FIREBASE CONFIG ----------------------
import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// DOM Elements
const addProductForm = document.getElementById('addProductForm');
const productListEl = document.getElementById('productList');

// Reference to Firestore collection
const productsCol = collection(db, "products");

// ---------------------- RENDER PRODUCTS ----------------------
async function renderProducts() {
    productListEl.innerHTML = "";
    try {
        const snapshot = await getDocs(productsCol);
        snapshot.forEach(p => {
            const data = p.data();
            const li = document.createElement("li");
            li.className = "product-item";
            li.innerHTML = `
                <span><strong>${data.name}</strong> — ${data.category}</span>
                <button class="delete-btn" data-id="${p.id}">Delete</button>
            `;
            productListEl.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// ---------------------- ADD PRODUCT ----------------------
addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById("productName").value,
        category: document.getElementById("productCategory").value,
        image: document.getElementById("productImage").value,
        oldPrice: parseFloat(document.getElementById("productOldPrice").value),
        price: parseFloat(document.getElementById("productPrice").value),
        desc: document.getElementById("productDesc").value
    };

    try {
        await addDoc(productsCol, newProduct);
        addProductForm.reset();
        renderProducts(); // refresh list
    } catch (error) {
        console.error("Error adding product:", error);
    }
});

// ---------------------- DELETE PRODUCT ----------------------
productListEl.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const docId = e.target.dataset.id;
        try {
            await deleteDoc(doc(db, "products", docId));
            renderProducts(); // refresh list
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
});

// ---------------------- INITIAL LOAD ----------------------
renderProducts();
