// frontend/src/services/api.js

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

const ADMIN_KEY =
  import.meta.env.VITE_ADMIN_KEY || "MY_SUPER_KEY_123";

// Helper: handle JSON + errors
async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "API Error");
  return data;
}

// GET helper
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  return handle(res);
}

/** ✅ PRODUCTS **/
export async function getProducts() {
  return apiGet("/products");
}

export async function getProductById(id) {
  return apiGet(`/products/${id}`);
}

/** ✅ UPLOAD IMAGE (Admin) **/
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  // إذا عندك route خاص بالرفع: /api/upload
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      "x-admin-key": ADMIN_KEY,
    },
    body: fd,
  });

  const data = await handle(res);

  // رجّع رابط صالح للاستعمال
  // متوقع يرجع { image_url: "/uploads/xxx.png" } أو { url: "/uploads/..." }
  const url = data.image_url || data.url || data.path;

  if (!url) throw new Error("Upload response missing image url");

  // إذا كان url relative رجعو absolute
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url}`;
}

/** ✅ ADMIN: CREATE PRODUCT **/
export async function createProduct(formData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "x-admin-key": ADMIN_KEY,
    },
    body: formData,
  });

  return handle(res);
}
