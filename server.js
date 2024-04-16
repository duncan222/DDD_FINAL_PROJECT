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
  database: "dddproject",
  password: "dddpostgres",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgresSQL:", err);
  } else {
    console.log("Connected to PostgresSQL");
  }
});

//get by staff name
app.get("/api/staff/:name", (req, res) => {
  const { name } = req.params;

  pool.query(
    "SELECT * FROM staff WHERE name = $1",
    [name],
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

app.get("/api/warehouse", (req, res) => {
  pool.query("SELECT * FROM warehouse", (err, result) => {
    if (err) {
      console.error("Error fetching products", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result.rows);
    }
  });
});

app.get("/api/customer", (req, res) => {
  pool.query("SELECT * FROM customer", (err, result) => {
    if (err) {
      console.error("Error fetching customers", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result.rows);
    }
  });
});

app.post("/api/warehouse", (req, res) => {
  const { address } = req.body;

  pool.query(
    "INSERT INTO warehouse (address) VALUES ($1) RETURNING *",
    [address],
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

app.post("/api/product", (req, res) => {
  const { name, category, type, brand, size, description, price, quantity } = req.body;

  pool.query(
    "INSERT INTO product (name, category, type, brand, size, description, price, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [name, category, type, brand, size, description, price, quantity],
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
  const { name, balance, customeraddressid } = req.body;

  pool.query(
    "INSERT INTO customer (name, balance, customeraddressid) VALUES ($1, $2, $3) RETURNING *",
    [name, balance, customeraddressid],
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

app.post("/api/addresses", (req, res) => {
  const {paymentaddress, deliveryaddress} = req.body;

  pool.query(
    "INSERT INTO addresses (paymentaddress, deliveryaddress) VALUES ($1, $2) RETURNING *",
    [paymentaddress, deliveryaddress],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const addressId = result.rows[0].uniqueaddressid;
        res.json({ uniqueaddressid: addressId });
      }
    }
  )
})

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

app.post("/api/productstock", (req, res) => {
  const { warehouseid, productid } = req.body;

  pool.query(
    "INSERT INTO productstock (warehouseid, productid) VALUES ($1, $2) RETURNING *",
    [warehouseid, productid],
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

app.put("/api/product/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, type, brand, size, description, price, quantity } = req.body;

  pool.query(
    "UPDATE product SET name = $1, category = $2, type = $3, brand = $4, size = $5, description = $6, price = $7, quantity = $8 WHERE productid = $9",
    [name, category, type, brand, size, description, price, quantity, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json({ message: "Product updated successfully" });
      }
    }
  );
});

app.put("/api/staff/id/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, salary, jobtitle } = req.body;

  pool.query(
    "UPDATE staff SET name = $1, address = $2, salary = $3, jobtitle = $4 WHERE staffid = $5",
    [name, address, salary, jobtitle, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json({ message: "Staff updated successfully" });
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

app.delete("/api/productstock/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM productstock WHERE productid = $1 RETURNING *",
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

app.get("/api/product/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM product WHERE productid = $1",
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

app.get("/api/productstock/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM productstock WHERE warehouseid = $1",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json(result.rows);
      }
    }
  );
});

//get by staff id
app.get("/api/staff/id/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM staff WHERE staffid = $1",
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

//get by customer id
app.get("/api/customer/id/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM customer WHERE customerid = $1",
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

//get by address id
app.get("/api/addresses/id/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM addresses WHERE uniqueaddressid = $1",
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

//get total stock of a warehouse
app.get("/api/totalstock/id/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT ps.WarehouseID, SUM(p.Quantity) AS TotalStock FROM ProductStock ps JOIN Product p ON ps.ProductID = p.ProductID WHERE ps.WarehouseID = $1 GROUP BY ps.WarehouseID",
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




