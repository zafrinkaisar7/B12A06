const categoriesDiv = document.getElementById("categories");
const treesDiv = document.getElementById("trees");
const cartList = document.getElementById("cart");
const totalPriceEl = document.getElementById("totalPrice");
const spinner = document.getElementById("spinner");

let cart = [];
let total = 0;

// Show/Hide Spinner
const showSpinner = () => spinner.classList.remove("hidden");
const hideSpinner = () => spinner.classList.add("hidden");

// Load Categories
async function loadCategories() {
  showSpinner();
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  hideSpinner();
  displayCategories(data.categories);
}

// Display Categories
function displayCategories(categories) {
  categoriesDiv.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat.category;
    btn.className = "category-btn bg-green-200 px-4 py-2 rounded hover:bg-green-300";
    btn.onclick = () => loadTreesByCategory(cat.id, btn);
    categoriesDiv.appendChild(btn);
  });
}

// Load Trees
async function loadTrees() {
  showSpinner();
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  hideSpinner();
  displayTrees(data.plants);
}

// Load Trees by Category
async function loadTreesByCategory(id, btn) {
  document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  showSpinner();
  const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
  const data = await res.json();
  hideSpinner();
  displayTrees(data.data);
}

// Display Trees
function displayTrees(trees) {
  treesDiv.innerHTML = "";
  trees.forEach(tree => {
    const card = document.createElement("div");
    card.className = "bg-white shadow rounded p-4 text-center";
    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded mb-2">
      <h3 class="font-bold cursor-pointer hover:text-green-600" onclick="loadTreeDetails(${tree.id})">${tree.name}</h3>
      <p class="text-gray-600 text-sm">${tree.category}</p>
      <p class="font-semibold">${tree.price}৳</p>
      <button class="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        onclick="addToCart('${tree.name}', ${tree.price})">
        Add to Cart
      </button>
    `;
    treesDiv.appendChild(card);
  });
}

// Load Tree Details (Modal)
async function loadTreeDetails(id) {
  showSpinner();
  const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
  const data = await res.json();
  hideSpinner();
  alert(`${data.name}\n\n${data.description}`);
}

// Add to Cart
function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  updateCart();
}

// Remove from Cart
function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
}

// Update Cart
function updateCart() {
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white px-3 py-2 rounded shadow";
    li.innerHTML = `
      <span>${item.name} - ${item.price}৳</span>
      <button class="text-red-500" onclick="removeFromCart(${index})">❌</button>
    `;
    cartList.appendChild(li);
  });
  totalPriceEl.textContent = total + "৳";
}

// Init
loadCategories();
loadTrees();
