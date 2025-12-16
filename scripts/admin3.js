// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAbeCdpwHJ-IEurbUN1wEBGRlXkIWCsOKI",
    authDomain: "triplebrothersshop-b0ad6.firebaseapp.com",
    projectId: "triplebrothersshop-b0ad6",
    storageBucket: "triplebrothersshop-b0ad6.firebasestorage.app",
    messagingSenderId: "1073852825422",
    appId: "1:1073852825422:web:3b7f88cf6eb45b229a681f",
    measurementId: "G-BLJLG8E9XD"
    
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const addProductForm = document.getElementById("addProductForm");
const productListEl = document.getElementById("productList");

// Real-time load products
onSnapshot(collection(db, "products"), (snapshot) => {
    productListEl.innerHTML = "";

    snapshot.forEach(docSnap => {
        const p = docSnap.data();
        const li = document.createElement("li");

        li.innerHTML = `
      <span><strong>${p.name}</strong> — ${p.category}</span>
      <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
    `;

        productListEl.appendChild(li);
    });
});

// Add product
addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "products"), {
        name: productName.value,
        category: productCategory.value,
        image: productImage.value,
        oldPrice: Number(productOldPrice.value),
        price: Number(productPrice.value),
        desc: productDesc.value
    });

    addProductForm.reset();
});

// Delete product
productListEl.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        await deleteDoc(doc(db, "products", e.target.dataset.id));
    }
});
