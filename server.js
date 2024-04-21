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

  pool.query("SELECT * FROM staff WHERE name = $1", [name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json(result.rows[0]);
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

app.get("/api/order_products", (req, res) => {
  pool.query("SELECT * FROM order_products", (err, result) => {
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

app.get("/api/orders", (req, res) => {
  pool.query("SELECT * FROM orders", (err, result) => {
    if (err) {
      console.error("Error fetching orders", err);
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
  const { name, category, type, brand, size, description, price, quantity } =
    req.body;

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
  const { paymentaddress, deliveryaddress } = req.body;

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

app.post("/api/order_products", (req, res) => {
  const { Quantity, OrderId, ProductId } = req.body;

  pool.query(
    "INSERT INTO order_products (Quantity, OrderId, ProductId) VALUES ($1, $2, $3) RETURNING *",
    [Quantity, OrderId, ProductId],
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

app.post("/api/creditcard", (req, res) => {
  const { CardNumber, CustomerID, CardAddresses } = req.body;
  pool.query(
    "INSERT INTO CreditCard (CardNumber, CustomerID, CardAddresses) VALUES ($1, $2, $3) RETURNING *",
    [CardNumber, CustomerID, CardAddresses],
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

app.post("/api/orders", (req, res) => {
  const {
    Status,
    DeliveryType,
    DeliveryPrice,
    DeliveryDate,
    ShipDate,
    CustomerID,
    CardNumber,
  } = req.body;
  pool.query(
    "INSERT INTO orders (Status, DeliveryType, DeliveryPrice, DeliveryDate, ShipDate, CustomerID, CardNumber) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      Status,
      DeliveryType,
      DeliveryPrice,
      DeliveryDate,
      ShipDate,
      CustomerID,
      CardNumber,
    ],
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

app.post("/api/order_products", (req, res) => {
  const { Quantity, OrderId, ProductId } = req.body;
  pool.query(
    "INSERT INTO order_products (Quantity, OrderId, ProductId) VALUES ($1, $2, $3) RETURNING *",
    [Quantity, OrderId, ProductId],
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

app.put("/api/addresses/:addressID", (req, res) => {
  const { addressID } = req.params;
  const { paymentaddress, deliveryaddress } = req.body;
  pool.query(
    "UPDATE Addresses SET PaymentAddress = $1, DeliveryAddress = $2 WHERE UniqueAddressID = $3",
    [paymentaddress, deliveryaddress, addressID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json({ message: "Card updated successfully" });
      }
    }
  );
});

app.put("/api/creditcard/:old_card_number", (req, res) => {
  const { old_card_number } = req.params;
  const { CardNumber, CardAddresses } = req.body;
  pool.query(
    "UPDATE CreditCard SET CardNumber = $1, CardAddresses = $2 WHERE CardNumber = $3",
    [CardNumber, CardAddresses, old_card_number],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json({ message: "Card updated successfully" });
      }
    }
  );
});

app.put("/api/product/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, type, brand, size, description, price, quantity } =
    req.body;

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

app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status, deliveryplanid, deliverytype, deliveryprice, deliverydate,
     shipdate, cardnumber, customerid } =
    req.body;

  pool.query(
    "UPDATE orders SET status = $1, deliveryplanid = $2, deliverytype = $3, deliveryprice = $4, deliverydate = $5, shipdate = $6, cardnumber = $7, customerid = $8 WHERE orderid = $9",
    [status, deliveryplanid, deliverytype, deliveryprice, deliverydate,
      shipdate, cardnumber, customerid, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Order not found" });
      } else {
        res.json({ message: "Order updated successfully" });
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

app.put("/api/customer/id/:id", (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  pool.query(
    "UPDATE customer SET Balance = $1 WHERE customerID = $2",
    [balance, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json({ message: "Customer updated successfully" });
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

app.delete("/api/addresses/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "DELETE FROM Addresses WHERE UniqueAddressID = $1 RETURNING *",
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

app.delete("/api/creditcard/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "DELETE FROM CreditCard WHERE CardNumber = $1 RETURNING *",
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

app.get("/api/creditcard/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM CreditCard WHERE CustomerID = $1",
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

app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM orders WHERE orderid = $1",
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

  pool.query("SELECT * FROM staff WHERE staffid = $1", [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json(result.rows[0]);
    }
  });
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

app.get("/api/order_products/id/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT productid, quantity FROM order_products WHERE orderid = $1",
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
