// backend/src/controllers/products.controller.js
const db = require("../config/db");
const { sql } = require("../config/db");  // add this line

// GET all
exports.getAll = async (req, res) => {
  try {
    const pool = await db.connectDB();
    const result = await pool
      .request()
      .query("SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getById = async (req, res) => {
  try {
    const pool = await db.connectDB();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(req.params.id, 10))
      .query("SELECT * FROM products WHERE id = @id");
    res.json(result.recordset[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {

    console.log(req.body);
    const { title_fr, title_ar, description_fr, description_ar, price, image_url } = req.body;

    const pool = await db.connectDB();
    const result = await pool
      .request()
      .input("title_fr", sql.NVarChar(255), title_fr)
      .input("title_ar", sql.NVarChar(255), title_ar)
      .input("description_fr", sql.NVarChar(sql.MAX), description_fr || "")
      .input("description_ar", sql.NVarChar(sql.MAX), description_ar || "")
      .input("price", sql.Decimal(10, 2), price)
      .input("image_url", sql.NVarChar(500), image_url || "")
      .query(`
        INSERT INTO products (title_fr, title_ar, description_fr, description_ar, price, image_url)
        OUTPUT INSERTED.*
        VALUES (@title_fr, @title_ar, @description_fr, @description_ar, @price, @image_url)
      `);
      res.status(201).json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // UPDATE
  exports.update = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title_fr, title_ar, description_fr, description_ar, price, image_url, is_active } = req.body;
  
      const pool = await db.connectDB();
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("title_fr", sql.NVarChar(255), title_fr)
        .input("title_ar", sql.NVarChar(255), title_ar)
        .input("description_fr", sql.NVarChar(sql.MAX), description_fr || "")
        .input("description_ar", sql.NVarChar(sql.MAX), description_ar || "")
        .input("price", sql.Decimal(10, 2), price)
        .input("image_url", sql.NVarChar(500), image_url || "")
        .input("is_active", sql.Bit, is_active ?? 1)
        .query(`
          UPDATE products SET
            title_fr=@title_fr,
            title_ar=@title_ar,
            description_fr=@description_fr,
            description_ar=@description_ar,
            price=@price,
            image_url=@image_url,
            is_active=@is_active
          WHERE id=@id;
  
          SELECT * FROM products WHERE id=@id;
        `);
        res.json(result.recordset[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
    // DELETE
  }
};
exports.remove = async (req, res) => {
  try {
    const pool = await db.connectDB();
    await pool
      .request()
      .input("id", sql.Int, parseInt(req.params.id, 10))
      .query("DELETE FROM products WHERE id=@id");

    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};