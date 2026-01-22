const API_BASE = "http://localhost:5000/api";
const ADMIN_KEY = "MY_SUPER_KEY_123";

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return res.json();
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { "x-admin-key": ADMIN_KEY },
    body: form,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
}
