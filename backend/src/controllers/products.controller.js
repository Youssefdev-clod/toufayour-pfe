// backend/src/controllers/orders.controller.js
const db = require("../config/db");

// Helpers
function isValidStatus(s) {
  return ["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"].includes(s);
}

/**
 * POST /api/orders
 * body:
 * {
 *   customer_name, phone, address,
 *   items: [{ product_id: number, quantity: number }]
 * }
 */
exports.createOrder = async (req, res) => {
  const { customer_name, phone, address, items } = req.body;

  if (!customer_name || !phone) {
    return res.status(400).json({ error: "customer_name and phone are required" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items must be a non-empty array" });
  }

  // basic validation items
  for (const it of items) {
    if (!it?.product_id || !Number.isInteger(Number(it.product_id))) {
      return res.status(400).json({ error: "Each item must have a valid product_id" });
    }
    if (!it?.quantity || Number(it.quantity) <= 0) {
      return res.status(400).json({ error: "Each item must have quantity > 0" });
    }
  }

  let pool;
  const sql = db.sql;

  try {
    pool = await db.connectDB();
    const tx = new sql.Transaction(pool);
    await tx.begin();

    try {
      // 1) create order first (total=0)
      const orderReq = new sql.Request(tx);
      orderReq.input("customer_name", customer_name);
      orderReq.input("phone", phone);
      orderReq.input("address", address || null);

      const orderInsert = await orderReq.query(`
        INSERT INTO dbo.orders (customer_name, phone, address, total, status)
        OUTPUT INSERTED.id
        VALUES (@customer_name, @phone, @address, 0, 'pending')
      `);

      const orderId = orderInsert.recordset?.[0]?.id;
      if (!orderId) throw new Error("Failed to create order");

      // 2) insert order items with price snapshot from products
      let total = 0;

      for (const it of items) {
        const productId = Number(it.product_id);
        const qty = Number(it.quantity);

        // get product price + stock + is_active
        const pReq = new sql.Request(tx);
        pReq.input("id", productId);

        const pRes = await pReq.query(`
          SELECT id, price, stock, is_active
          FROM dbo.products
          WHERE id = @id
        `);

        const product = pRes.recordset?.[0];
        if (!product) throw new Error(`Product not found: ${productId}`);
        if (product.is_active === false || product.is_active === 0) {
          throw new Error(`Product inactive: ${productId}`);
        }

        // stock check (if you want stock management)
        if (product.stock !== null && product.stock !== undefined) {
          if (Number(product.stock) < qty) {
            throw new Error(`Not enough stock for product ${productId}`);
          }
        }

        const price = Number(product.price);
        total += price * qty;

        // insert item
        const itemReq = new sql.Request(tx);
        itemReq.input("order_id", orderId);
        itemReq.input("product_id", productId);
        itemReq.input("quantity", qty);
        itemReq.input("price", price);

        await itemReq.query(`
          INSERT INTO dbo.order_items (order_id, product_id, quantity, price)
          VALUES (@order_id, @product_id, @quantity, @price)
        `);

        // decrease stock (optional but professional)
        if (product.stock !== null && product.stock !== undefined) {
          const stockReq = new sql.Request(tx);
          stockReq.input("id", productId);
          stockReq.input("qty", qty);

          await stockReq.query(`
            UPDATE dbo.products
            SET stock = stock - @qty, updated_at = GETDATE()
            WHERE id = @id
          `);
        }
      }

      // 3) update order total
      const updReq = new sql.Request(tx);
      updReq.input("id", orderId);
      updReq.input("total", Number(total.toFixed(2)));

      await updReq.query(`
        UPDATE dbo.orders
        SET total = @total, updated_at = GETDATE()
        WHERE id = @id
      `);

      await tx.commit();

      return res.status(201).json({
        message: "Order created",
        order_id: orderId,
        total: Number(total.toFixed(2)),
        status: "pending",
      });
    } catch (err) {
      await tx.rollback();
      return res.status(400).json({ error: err.message });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/**
 * GET /api/orders  (ADMIN)
 * optional query: status=pending
 */
exports.getOrders = async (req, res) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT id, customer_name, phone, address, total, status, created_at, updated_at
      FROM dbo.orders
    `;

    const params = {};
    if (status) {
      query += " WHERE status = @status";
      params.status = status;
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, params);
    return res.json(result.recordset);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/**
 * GET /api/orders/:id (ADMIN)
 */
exports.getOrderById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const oRes = await db.query(
      `SELECT id, customer_name, phone, address, total, status, created_at, updated_at
       FROM dbo.orders WHERE id = @id`,
      { id }
    );
    const order = oRes.recordset?.[0];
    if (!order) return res.status(404).json({ error: "Order not found" });

    const itemsRes = await db.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price,
              p.title_fr, p.title_ar, p.image_url
       FROM dbo.order_items oi
       LEFT JOIN dbo.products p ON p.id = oi.product_id
       WHERE oi.order_id = @id`,
      { id }
    );

    return res.json({
      ...order,
      items: itemsRes.recordset,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/**
 * PATCH /api/orders/:id/status (ADMIN)
 * body: { status: "confirmed" }
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!isValidStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await db.query(
      `UPDATE dbo.orders
       SET status = @status, updated_at = GETDATE()
       WHERE id = @id`,
      { id, status }
    );

    // mssql returns rows affected in result.rowsAffected
    const affected = result.rowsAffected?.[0] ?? 0;
    if (affected === 0) return res.status(404).json({ error: "Order not found" });

    return res.json({ message: "Status updated", id, status });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
