// 🌴 API Endpoints
const apiBase = "https://openapi.programming-hero.com/api";
const categoriesUrl = `${apiBase}/categories`;
const plantsUrl = `${apiBase}/plants`;
const plantsByCategoryUrl = `${apiBase}/category/`;
const plantDetailUrl = `${apiBase}/plant/`;

// DOM elements
const categoriesContainer = document.getElementById("categories");
const treesContainer = document.getElementById("trees");
const cartContainer = document.getElementById("cart");
const totalPriceEl = document.getElementById("totalPrice");
const spinner = document.getElementById("spinner");

// cart data
let cart = [];
let totalPrice = 0;

// 🌴 Loading Spinner
function toggleSpinner(show) {
  spinner.style.display = show ? "block" : "none";
}

// 🌴 Load Categories
async function loadCategories() {
  toggleSpinner(true);
  const res = await fetch(categoriesUrl);
  const data = await res.json();
  const categories = data.categories;

  categoriesContainer.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className =
      "px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600";
    btn.innerText = cat.category;
    btn.onclick = () => {
      document
        .querySelectorAll("#categories button")
        .forEach(b => b.classList.remove("bg-green-700"));
      btn.classList.add("bg-green-700");
      loadTreesByCategory(cat.id);
    };
    categoriesContainer.appendChild(btn);
  });

  toggleSpinner(false);
}

// 🌴 Load All Plants
async function loadAllTrees() {
  toggleSpinner(true);
  const res = await fetch(plantsUrl);
  const data = await res.json();
  displayTrees(data.plants);
  toggleSpinner(false);
}

// 🌴 Load Plants by Category
async function loadTreesByCategory(categoryId) {
  toggleSpinner(true);
  const res = await fetch(plantsByCategoryUrl + categoryId);
  const data = await res.json();
  displayTrees(data.plants);
  toggleSpinner(false);
}

// 🌴 Display Trees
function displayTrees(trees) {
  treesContainer.innerHTML = "";

  if (!trees || trees.length === 0) {
    treesContainer.innerHTML =
      "<p class='col-span-3 text-center text-gray-500'>No plants found in this category</p>";
    return;
  }

  trees.forEach(tree => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow p-4 flex flex-col";
    div.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="rounded mb-2 h-32 w-full object-cover">
      <h3 onclick="showPlantDetail(${tree.id})" class="font-bold text-lg cursor-pointer text-green-700 hover:underline">${tree.name}</h3>
      <p class="text-gray-600 text-sm mb-2">${tree.description.slice(0, 60)}...</p>
      <p class="text-gray-800 font-semibold">Price: ${tree.price}৳</p>
      <button onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})" class="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Cart</button>
    `;
    treesContainer.appendChild(div);
  });
}

// 🌴 Plant Details (Modal)
async function showPlantDetail(id) {
  const res = await fetch(plantDetailUrl + id);
  const data = await res.json();
  const plant = data.plant;

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
  modal.innerHTML = `
    <div class="bg-white p-6 rounded shadow max-w-md w-full relative">
      <button onclick="this.parentElement.parentElement.remove()" class="absolute top-2 right-2 text-red-500 text-xl">✖</button>
      <img src="${plant.image}" alt="${plant.name}" class="rounded mb-2 h-40 w-full object-cover">
      <h2 class="font-bold text-xl mb-2">${plant.name}</h2>
      <p class="text-gray-600 mb-2">${plant.description}</p>
      <p class="font-semibold">Category: ${plant.category}</p>
      <p class="font-semibold">Price: ${plant.price}৳</p>
    </div>
  `;
  document.body.appendChild(modal);
}

// 🌴 Add to Cart
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  totalPrice += price;
  renderCart();
}

// 🌴 Remove from Cart
function removeFromCart(index) {
  totalPrice -= cart[index].price;
  cart.splice(index, 1);
  renderCart();
}

// 🌴 Render Cart
function renderCart() {
  cartContainer.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-gray-100 px-3 py-2 rounded mb-2";
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="flex items-center space-x-2">
        <span>${item.price}৳</span>
        <button onclick="removeFromCart(${index})" class="text-red-500 font-bold">❌</button>
      </div>
    `;
    cartContainer.appendChild(li);
  });

  totalPriceEl.innerText = totalPrice + "৳";
}

// Initial Load
loadCategories();
loadAllTrees();
