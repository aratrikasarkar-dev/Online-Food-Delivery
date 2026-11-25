// ========================================
// MUNCHY - FOOD DELIVERY WEBSITE
// ========================================

// RESTAURANT DATA
const restaurants = [
    {
        name: "Burger House",
        cuisine: "Burgers & Fast Food",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500"
    },
    {
        name: "Pizza Palace",
        cuisine: "Italian & Pizza",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        name: "Spice Garden",
        cuisine: "Indian Cuisine",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500"
    },
    {
        name: "Sweet Treats",
        cuisine: "Desserts & Drinks",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"
    }
];

// FOOD DATA
const foods = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Burger",
        price: 149,
        rating: 4.8,
        type: "nonveg",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Burger",
        price: 179,
        rating: 4.7,
        type: "veg",
        image: "https://www.recipetineats.com/tachyon/2022/08/Stack-of-cheeseburgers.jpg"
    },
    {
        id: 3,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        rating: 4.9,
        type: "veg",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=500"
    },
    {
        id: 4,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        rating: 4.8,
        type: "nonveg",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500"
    },
    {
        id: 5,
        name: "Paneer Butter Masala",
        category: "Indian",
        price: 229,
        rating: 4.7,
        type: "veg",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500"
    },
    {
        id: 6,
        name: "Chicken Biryani",
        category: "Indian",
        price: 199,
        rating: 4.9,
        type: "nonveg",
        image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg"
    },
    {
        id: 7,
        name: "Hakka Noodles",
        category: "Chinese",
        price: 159,
        rating: 4.5,
        type: "veg",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500"
    },
    {
        id: 8,
        name: "Chicken Noodles",
        category: "Chinese",
        price: 189,
        rating: 4.6,
        type: "nonveg",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500"
    },
    {
        id: 9,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 129,
        rating: 4.9,
        type: "veg",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    },
    {
        id: 10,
        name: "Ice Cream",
        category: "Dessert",
        price: 99,
        rating: 4.7,
        type: "veg",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"
    },
    {
        id: 11,
        name: "Cold Coffee",
        category: "Drinks",
        price: 89,
        rating: 4.6,
        type: "veg",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
    },
    {
        id: 12,
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 69,
        rating: 4.5,
        type: "veg",
        image: "https://www.texanerin.com/content/uploads/2014/08/honey-lemonade-2.jpg"
    }
];

// ========================================
// GLOBAL VARIABLES
// ========================================

let cart = [];
let selectedCategory = "All";
let discountAmount = 0;
let couponApplied = false;
let currentOrder = null;
let orderStatus = 0;

const USERS_KEY = "munchy_users";
const SESSION_KEY = "munchy_current_user";
const CART_KEY = "munchy_cart";
const ORDERS_KEY = "munchy_orders";

// ========================================
// HELPER FUNCTIONS
// ========================================

function getElement(id) {
    return document.getElementById(id);
}

function getSavedData(key, fallback) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return data === null ? fallback : data;
    } catch (error) {
        return fallback;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Could not save data:", error);
        alert("Your browser could not save the data.");
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatPrice(amount) {
    return Number(amount).toFixed(2).replace(/\.00$/, "");
}

// ========================================
// PASSWORD HASHING
// ========================================

async function hashPassword(password) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error(
            "Password security is unavailable. Please open the project using VS Code Live Server."
        );
    }

    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// ========================================
// REGISTRATION AND LOGIN
// ========================================

function showRegister() {
    getElement("loginForm").hidden = true;
    getElement("registerForm").hidden = false;

    getElement("authTitle").textContent = "Create Your Account 🎉";
    getElement("authSubtitle").textContent =
        "Join MUNCHY and enjoy delicious food.";

    getElement("authMessage").textContent = "";
}

function showLogin() {
    getElement("registerForm").hidden = true;
    getElement("loginForm").hidden = false;

    getElement("authTitle").textContent = "Welcome Back! 👋";
    getElement("authSubtitle").textContent =
        "Login to order your favourite food.";

    getElement("authMessage").textContent = "";
}

async function registerUser(event) {
    event.preventDefault();

    const name = getElement("regName").value.trim();
    const email = getElement("regEmail").value.trim().toLowerCase();
    const phone = getElement("regPhone").value.trim();
    const password = getElement("regPassword").value;
    const confirmPassword = getElement("confirmPassword").value;

    const message = getElement("authMessage");

    if (!name || !email || !phone || !password) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        message.textContent = "Enter a valid 10-digit mobile number.";
        return;
    }

    if (password.length < 8) {
        message.textContent =
            "Password must contain at least 8 characters.";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        return;
    }

    const users = getSavedData(USERS_KEY, []);

    if (users.some(user => user.email === email)) {
        message.textContent =
            "An account with this email already exists.";
        return;
    }

    try {
        const passwordHash = await hashPassword(password);

        users.push({
            name,
            email,
            phone,
            passwordHash
        });

        saveData(USERS_KEY, users);

        getElement("registerForm").reset();
        showLogin();

        message.textContent =
            "Account created successfully! Please login.";

    } catch (error) {
        message.textContent = error.message;
    }
}

async function loginUser(event) {
    event.preventDefault();

    const email = getElement("loginEmail").value.trim().toLowerCase();
    const password = getElement("loginPassword").value;

    const message = getElement("authMessage");
    const users = getSavedData(USERS_KEY, []);

    const user = users.find(user => user.email === email);

    if (!user) {
        message.textContent =
            "Account not found. Please register first.";
        return;
    }

    try {
        const passwordHash = await hashPassword(password);

        if (user.passwordHash !== passwordHash) {
            message.textContent =
                "Incorrect password. Please try again.";
            return;
        }

        const currentUser = {
            name: user.name,
            email: user.email,
            phone: user.phone
        };

        saveData(SESSION_KEY, currentUser);

        getElement("loginForm").reset();

        updateUserInterface();
        renderOrderHistory();

        message.textContent = "Login successful!";

    } catch (error) {
        message.textContent = error.message;
    }
}

// ========================================
// LOGOUT AND USER INTERFACE
// ========================================

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);

    getElement("userWelcome").hidden = true;
    getElement("navLogin").hidden = false;
    getElement("authSection").hidden = false;

    showLogin();

    getElement("authMessage").textContent =
        "You have logged out successfully.";

    currentOrder = null;
    orderStatus = 0;

    renderTracking();
    renderOrderHistory();

    window.location.hash = "home";
}

function updateUserInterface() {
    const user = getSavedData(SESSION_KEY, null);

    if (user) {
        getElement("userWelcome").hidden = false;

        getElement("welcomeName").textContent =
            "Welcome, " + user.name + "!";

        getElement("navLogin").hidden = true;
        getElement("customerName").value = user.name;
        getElement("phone").value = user.phone;
        getElement("authSection").hidden = true;

    } else {
        getElement("userWelcome").hidden = true;
        getElement("navLogin").hidden = false;
        getElement("authSection").hidden = false;
    }
}

// ========================================
// DISPLAY RESTAURANTS
// ========================================

function renderRestaurants() {
    const container = getElement("restaurantGrid");

    container.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card">
            <img
                src="${restaurant.image}"
                alt="${escapeHTML(restaurant.name)}"
                loading="lazy">

            <div class="restaurant-info">
                <h3>${escapeHTML(restaurant.name)}</h3>
                <p>${escapeHTML(restaurant.cuisine)}</p>
                <span>⭐ ${restaurant.rating}</span>
            </div>
        </div>
    `).join("");
}

// ========================================
// DISPLAY FOOD MENU
// ========================================

function renderMenu() {
    const searchText =
        getElement("search").value.toLowerCase().trim();

    const sortValue = getElement("sort").value;
    const dietValue = getElement("diet").value;

    let filteredFoods = foods.filter(food => {
        const matchesSearch =
            food.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        const matchesDiet =
            dietValue === "all" ||
            food.type === dietValue;

        return matchesSearch && matchesCategory && matchesDiet;
    });

    if (sortValue === "low") {
        filteredFoods.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "high") {
        filteredFoods.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "rating") {
        filteredFoods.sort((a, b) => b.rating - a.rating);
    }

    const container = getElement("foodGrid");

    if (filteredFoods.length === 0) {
        container.innerHTML = "";
        getElement("noResults").hidden = false;
        return;
    }

    getElement("noResults").hidden = true;

    container.innerHTML = filteredFoods.map(food => `
        <div class="food-card">

            <img
                src="${food.image}"
                alt="${escapeHTML(food.name)}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/f5c842/171714?text=Food+Image';">

            <div class="food-info">

                <div class="food-title">
                    <h3>${escapeHTML(food.name)}</h3>
                    <span>⭐ ${food.rating}</span>
                </div>

                <p>${escapeHTML(food.category)}</p>

                <div class="food-bottom">
                    <strong>₹${food.price}</strong>

                    <button onclick="addToCart(${food.id})">
                        Add +
                    </button>
                </div>

            </div>
        </div>
    `).join("");
}

// ========================================
// CATEGORY FILTER
// ========================================

function setCategory(category, button) {
    selectedCategory = category;

    document.querySelectorAll(".category").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    renderMenu();
}

// ========================================
// ADD FOOD TO CART
// ========================================

function addToCart(foodId) {
    const food = foods.find(item => item.id === foodId);

    if (!food) return;

    const existingItem = cart.find(item => item.id === foodId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    saveData(CART_KEY, cart);
    renderCart();
}

// ========================================
// DISPLAY CART
// ========================================

function renderCart() {
    const container = getElement("cartItems");

    if (cart.length === 0) {
        container.innerHTML =
            '<p class="empty-message">Your cart is empty. Add something delicious!</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-row">

                <div>
                    <h4>${escapeHTML(item.name)}</h4>
                    <small>₹${item.price} each</small>
                </div>

                <div class="cart-controls">

                    <button onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${item.id})">
                        Remove
                    </button>

                </div>

            </div>
        `).join("");
    }

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    getElement("cartCount").textContent = totalItems;

    calculateBill();
}

// ========================================
// CHANGE QUANTITY
// ========================================

function changeQuantity(foodId, change) {
    const item = cart.find(item => item.id === foodId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== foodId);
    }

    saveData(CART_KEY, cart);
    renderCart();
}

// ========================================
// REMOVE ITEM
// ========================================

function removeFromCart(foodId) {
    cart = cart.filter(item => item.id !== foodId);

    saveData(CART_KEY, cart);
    renderCart();
}

// ========================================
// CLEAR CART
// ========================================

function clearCart() {
    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        discountAmount = 0;
        couponApplied = false;

        getElement("coupon").value = "";
        getElement("couponMessage").textContent = "";

        saveData(CART_KEY, cart);
        renderCart();
    }
}

// ========================================
// APPLY COUPON
// ========================================

function applyCoupon() {
    const coupon =
        getElement("coupon").value.trim().toUpperCase();

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    if (cart.length === 0) {
        getElement("couponMessage").textContent =
            "Add food to your cart first.";
        return;
    }

    if (couponApplied) {
        getElement("couponMessage").textContent =
            "A coupon has already been applied.";
        return;
    }

    if (coupon === "MUNCHY10") {
        discountAmount = Math.round(subtotal * 0.10);
        couponApplied = true;

        getElement("couponMessage").textContent =
            "10% discount applied successfully!";
    } else {
        getElement("couponMessage").textContent =
            "Invalid coupon code. Try MUNCHY10.";
    }

    calculateBill();
}

// ========================================
// CALCULATE BILL
// ========================================

function calculateBill() {
    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    const delivery =
        subtotal === 0 || subtotal >= 499 ? 0 : 40;

    const tax = Math.round(subtotal * 0.05);

    if (subtotal === 0) {
        discountAmount = 0;
        couponApplied = false;
    }

    const total = subtotal + delivery + tax - discountAmount;

    getElement("subtotal").textContent = formatPrice(subtotal);
    getElement("delivery").textContent = formatPrice(delivery);
    getElement("tax").textContent = formatPrice(tax);
    getElement("discount").textContent = formatPrice(discountAmount);
    getElement("total").textContent =
        formatPrice(Math.max(0, total));
}

// ========================================
// SCROLL TO CART
// ========================================

function scrollToCart() {
    getElement("cart").scrollIntoView({
        behavior: "smooth"
    });
}

// ========================================
// PLACE ORDER
// ========================================

function placeOrder() {
    const user = getSavedData(SESSION_KEY, null);

    if (!user) {
        alert("Please login before placing an order.");

        getElement("authSection").hidden = false;

        getElement("authSection").scrollIntoView({
            behavior: "smooth"
        });

        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = getElement("customerName").value.trim();
    const phone = getElement("phone").value.trim();
    const address = getElement("address").value.trim();
    const payment = getElement("payment").value;

    if (!name || !phone || !address) {
        alert("Please fill in all delivery details.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    const delivery =
        subtotal === 0 || subtotal >= 499 ? 0 : 40;

    const tax = Math.round(subtotal * 0.05);

    const total = subtotal + delivery + tax - discountAmount;

    const order = {
        id: "MUN" + Date.now(),
        email: user.email,
        customerName: name,
        phone: phone,
        address: address,
        payment: payment,
        items: cart.map(item => ({ ...item })),
        total: total,
        date: new Date().toLocaleString(),
        status: 0
    };

    const orders = getSavedData(ORDERS_KEY, []);

    orders.unshift(order);
    saveData(ORDERS_KEY, orders);

    currentOrder = order;
    orderStatus = 0;

    cart = [];
    discountAmount = 0;
    couponApplied = false;

    getElement("coupon").value = "";
    getElement("couponMessage").textContent = "";

    saveData(CART_KEY, cart);

    renderCart();
    renderTracking();
    renderOrderHistory();

    alert("Your order has been placed successfully! 🎉");

    getElement("orders").scrollIntoView({
        behavior: "smooth"
    });
}

// ========================================
// ORDER TRACKING
// ========================================

function renderTracking() {
    if (!currentOrder) {
        getElement("orderNumber").textContent = "No active order";

        getElement("orderMessage").textContent =
            "Place an order to see its status here.";

        getElement("nextStatus").disabled = true;

        for (let i = 1; i <= 4; i++) {
            getElement("step" + i).classList.remove("completed");
        }

        for (let i = 1; i <= 3; i++) {
            getElement("line" + i).classList.remove("completed");
        }

        return;
    }

    const statuses = [
        "Your order has been confirmed!",
        "Your food is being prepared.",
        "Your order is on the way!",
        "Your order has been delivered. Enjoy your meal!"
    ];

    getElement("orderNumber").textContent =
        "Order ID: " + currentOrder.id;

    getElement("orderMessage").textContent =
        statuses[orderStatus];

    for (let i = 1; i <= 4; i++) {
        getElement("step" + i).classList.toggle(
            "completed",
            i <= orderStatus + 1
        );
    }

    for (let i = 1; i <= 3; i++) {
        getElement("line" + i).classList.toggle(
            "completed",
            i <= orderStatus
        );
    }

    getElement("nextStatus").disabled = orderStatus >= 3;

    getElement("nextStatus").textContent =
        orderStatus >= 3
            ? "Order Delivered ✓"
            : "Update Demo Order Status";
}

// ========================================
// UPDATE ORDER STATUS
// ========================================

function advanceOrder() {
    if (!currentOrder || orderStatus >= 3) return;

    orderStatus++;
    currentOrder.status = orderStatus;

    const orders = getSavedData(ORDERS_KEY, []);

    const index = orders.findIndex(
        order => order.id === currentOrder.id
    );

    if (index !== -1) {
        orders[index].status = orderStatus;
        saveData(ORDERS_KEY, orders);
    }

    renderTracking();
    renderOrderHistory();
}

// ========================================
// ORDER HISTORY
// ========================================

function renderOrderHistory() {
    const container = getElement("orderHistory");
    const user = getSavedData(SESSION_KEY, null);

    if (!user) {
        container.innerHTML =
            '<p class="empty-message">Login to view your order history.</p>';
        return;
    }

    const orders = getSavedData(ORDERS_KEY, []).filter(
        order => order.email === user.email
    );

    if (orders.length === 0) {
        container.innerHTML =
            '<p class="empty-message">No previous orders yet.</p>';
        return;
    }

    const statuses = [
        "Confirmed",
        "Preparing",
        "On the way",
        "Delivered"
    ];

    container.innerHTML = orders.map(order => `
        <div class="history-card">

            <h3>Order #${escapeHTML(order.id)}</h3>

            <p>Date: ${escapeHTML(order.date)}</p>

            <p>Total: ₹${formatPrice(order.total)}</p>

            <p>Payment: ${escapeHTML(order.payment)}</p>

            <p>
                Status:
                <strong>${statuses[order.status] || "Confirmed"}</strong>
            </p>

            <p>
                Items:
                ${order.items.map(item =>
                    `${escapeHTML(item.name)} x ${item.quantity}`
                ).join(", ")}
            </p>

        </div>
    `).join("");
}

// ========================================
// CUSTOMER REVIEWS
// ========================================

function submitReview() {
    const rating = getElement("rating").value;
    const review = getElement("reviewText").value.trim();

    const message = getElement("reviewMessage");

    if (review.length === 0) {
        message.textContent = "Please write a review first.";
        return;
    }

    const user = getSavedData(SESSION_KEY, null);

    if (!user) {
        message.textContent =
            "Please login before submitting a review.";
        return;
    }

    const reviews = getSavedData("munchy_reviews", []);

    reviews.push({
        name: user.name,
        rating: rating,
        review: review,
        date: new Date().toLocaleString()
    });

    saveData("munchy_reviews", reviews);

    message.textContent = "Thank you for your feedback! ⭐";

    getElement("reviewText").value = "";
}

// ========================================
// INITIALIZE WEBSITE
// ========================================

function initializeWebsite() {
    cart = getSavedData(CART_KEY, []);

    const user = getSavedData(SESSION_KEY, null);

    if (user) {
        const orders = getSavedData(ORDERS_KEY, []);

        currentOrder = orders.find(
            order =>
                order.email === user.email &&
                order.status < 3
        ) || null;

        if (currentOrder) {
            orderStatus = currentOrder.status;
        }
    }

    renderRestaurants();
    renderMenu();
    renderCart();
    updateUserInterface();
    renderTracking();
    renderOrderHistory();
}

// Start after the HTML has loaded
document.addEventListener("DOMContentLoaded", initializeWebsite);
