const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "DDD_FINAL_DB",
  password: "duncan123",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgresSQL:", err);
  } else {
    console.log("Connected to PostgresSQL");
  }
});

app.get("/api/items", (req, res) => {
  pool.query("SELECT * FROM items", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result.rows);
    }
  });
});

app.get("/api/product", (req, res) => {
  pool.query("SELECT * FROM product", (err, result) => {
    if (err) {
      console.error("Error fetching products", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result.rows);
    }
  });
});

app.post("/api/product", (req, res) => {
  const { name, category, type, brand, size, description, price } = req.body;

  pool.query(
    "INSERT INTO product (name, category, type, brand, size, description, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [name, category, type, brand, size, description, price],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.post("/api/items", (req, res) => {
  const { name, description } = req.body;

  pool.query(
    "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
    [name, description],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.post("/api/customer", (req, res) => {
  const { name, balance, paymentaddress, deliveryaddress } = req.body;

  pool.query(
    "INSERT INTO customer (name, balance, paymentaddress, deliveryaddress) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, balance, paymentaddress, deliveryaddress],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const customerId = result.rows[0].customerid;
        res.json({ customerid: customerId });
      }
    }
  );
});

app.post("/api/staff", (req, res) => {
  const { name, address, salary, jobtitle } = req.body;

  pool.query(
    "INSERT INTO staff (name, address, salary, jobtitle) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, address, salary, jobtitle],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const staffId = result.rows[0].staffid;
        res.json({ staffid: staffId });
      }
    }
  );
});

app.put("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  pool.query(
    "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM items WHERE id = $1 RETURNING *",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.delete("/api/product/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM product WHERE productid = $1 RETURNING *",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});
