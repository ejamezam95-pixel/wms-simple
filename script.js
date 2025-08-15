async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  document.getElementById("login-msg").innerText = data.success ? "Login successful" : "Login failed";
}

async function addProduct() {
  const name = document.getElementById("prod-name").value;
  const qty = parseInt(document.getElementById("prod-qty").value);

  await fetch("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity: qty })
  });

  loadProducts();
}

async function loadProducts() {
  const res = await fetch("/products");
  const products = await res.json();
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.name} - ${p.quantity}`;
    list.appendChild(li);
  });
}

loadProducts();