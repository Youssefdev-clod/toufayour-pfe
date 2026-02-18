import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createProduct, uploadImage } from "../services/api";
import "./Admin.css";

export default function Admin({ lang, setLang }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title_fr: "",
    title_ar: "",
    description_fr: "",
    description_ar: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    console.log(form);

    try {
      setLoading(true);

      let image_url = "";
      if (imageFile) {
        const upload = await uploadImage(imageFile);
        image_url = upload.url;
      }

      await createProduct(JSON.stringify({
        ...form,
        price: Number(form.price),
        image_url,
      }));

      navigate("/products");
    } catch (err) {
      setError("Erreur lors de l’ajout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <Navbar lang={lang} setLang={setLang} />

      <div className="admin-wrap">
        <h1>Admin</h1>

        <form onSubmit={onSubmit} className="admin-form">
          <input name="title_fr" placeholder="Titre FR" onChange={onChange} />
          <input name="title_ar" placeholder="Titre AR" onChange={onChange} />
          <textarea name="description_fr" placeholder="Desc FR" onChange={onChange} />
          <textarea name="description_ar" placeholder="Desc AR" onChange={onChange} />
          <input name="price" type="number" placeholder="Prix" onChange={onChange} />

          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button disabled={loading}>
            {loading ? "..." : "Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
}
