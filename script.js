const categoriesDiv = document.getElementById("categories");
const treesDiv = document.getElementById("trees");
const cartList = document.getElementById("cart");
const totalPriceEl = document.getElementById("totalPrice");
const spinner = document.getElementById("spinner");

let cart = [];
let total = 0;

// fallback categories
const treeCategories = [
  { id: "all", name: "All Trees" },
  { id: "fruit", name: "Fruit Trees" },
  { id: "flowering", name: "Flowering Trees" },
  { id: "shade", name: "Shade Trees" },
  { id: "medicinal", name: "Medicinal Trees" },
  { id: "timber", name: "Timber Trees" },
  { id: "evergreen", name: "Evergreen Trees" },
  { id: "ornamental", name: "Ornamental Plants" },
  { id: "bamboo", name: "Bamboo" },
  { id: "climbers", name: "Climbers" },
  { id: "aquatic", name: "Aquatic Plants" },
];

// Show/Hide Spinner
const showSpinner = () => spinner.classList.remove("hidden");
const hideSpinner = () => spinner.classList.add("hidden");

// Load Categories
async function loadCategories() {
  showSpinner();
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();

    console.log("API Categories:", data);

    let categories = [];
    if (data.data && Array.isArray(data.data)) {
      categories = data.data.map((c, i) => ({
        id: c.category || c.id || i + 1,
        name: c.category || c.name || `Category ${i + 1}`
      }));
    }
    if (!categories.length) categories = treeCategories;

    displayCategories(categories);
  } catch (err) {
    console.error("Category API failed:", err);
    displayCategories(treeCategories);
  } finally {
    hideSpinner();
  }
}

// Display Categories
function displayCategories(categories) {
  categoriesDiv.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat.name;
    btn.className = "category-btn bg-green-200 px-3 py-2 rounded";
    btn.onclick = () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadTreesByCategory(cat.id);
    };
    categoriesDiv.appendChild(btn);
  });
}

// Load All Trees
async function loadTrees() {
  showSpinner();
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayTrees(data.plants || []);
  } catch (err) {
    console.error("Error loading all trees:", err);
    displayTrees([]); // no crash
  } finally {
    hideSpinner();
  }
}

// ✅ Fixed Load Trees by Category
async function loadTreesByCategory(id) {
  if (id === "all") {
    loadTrees();
    return;
  }

  showSpinner();
  try {
    // 1. Try API endpoint for category
    const res = await fetch(`https://openapi.programming-hero.com/api/trees/category/${id}`);
    const data = await res.json();

    if (data.data && data.data.length) {
      displayTrees(data.data);
    } else {
      // 2. Fallback: client-side filtering
      const res2 = await fetch("https://openapi.programming-hero.com/api/plants");
      const all = await res2.json();

      const filtered = (all.plants || []).filter(t => {
        if (!t.category) return false;

        // normalize both sides (lowercase + remove spaces)
        const normalizedTreeCat = t.category.toLowerCase().replace(/\s+/g, "");
        const normalizedId = id.toLowerCase().replace(/\s+/g, "");

        return normalizedTreeCat.includes(normalizedId);
      });

      displayTrees(filtered);
    }
  } catch (err) {
    console.error("Category trees failed:", err);
    displayTrees([]);
  } finally {
    hideSpinner();
  }
}

// Ensure all tree cards have the same height
function equalizeCardHeights() {
  const cards = document.querySelectorAll(".tree-card");
  let maxHeight = 0;

  // Reset heights to calculate the tallest card
  cards.forEach(card => {
    card.style.height = "auto";
    maxHeight = Math.max(maxHeight, card.offsetHeight);
  });

  // Set all cards to the tallest height
  cards.forEach(card => {
    card.style.height = maxHeight + "px";
  });
}

// Truncate descriptions dynamically
function truncateDescription(description, maxLength = 50) {
  return description.length > maxLength
    ? description.substring(0, maxLength) + "..."
    : description;
}

// Display Trees
function displayTrees(trees) {
  treesDiv.innerHTML = ""; // Clear previous trees
  if (!trees.length) {
    treesDiv.innerHTML = "<p class='text-center text-gray-500'>No trees found for this category.</p>";
    return;
  }

  trees.forEach(tree => {
    const card = document.createElement("div");
    card.className = "tree-card bg-white rounded shadow p-4";

    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded mb-2">
      <h3 class="font-bold text-lg cursor-pointer hover:text-green-600" onclick="loadTreeDetails(${tree.id})">${tree.name}</h3>
      <p class="text-gray-600 text-sm mt-2">${truncateDescription(tree.description || "No description available.")}</p>
      <p class="text-gray-500 text-xs mt-1">Category: ${tree.category}</p>
      <p class="font-semibold mt-2">${tree.price}৳</p>
      <button class="add-btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2" onclick="addToCart('${tree.name}', ${tree.price})">
        Add to Cart
      </button>
    `;

    treesDiv.appendChild(card);
  });

  // Equalize card heights after rendering
  equalizeCardHeights();
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
