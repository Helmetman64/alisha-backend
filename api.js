require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

app.use(express.json());
app.use(cors());

sql.connect(dbConfig, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MSSQL database.");
});

app.get("/items", (req, res) => {
  const query = "SELECT * FROM Items";

  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving items from database.");
      return;
    }
    res.json(result.recordset);
  });
});

app.post("/items", (req, res) => {
  const { itemName, itemPrice, itemQTY, imageName } = req.body;

  const query = `EXEC AddItem @itemName = @itemName, @itemPrice = @itemPrice, @itemQTY = @itemQTY, @imageName = @imageName`;

  const request = new sql.Request();
  request.input("itemName", sql.NVarChar(100), itemName);
  request.input("itemPrice", sql.Int, itemPrice);
  request.input("itemQTY", sql.Int, itemQTY);
  request.input("imageName", sql.NVarChar(100), imageName);

  request.execute("AddItem", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error adding item to items.");
      return;
    }
    res.status(201).json({ message: "Added item successfully." });
  });
});

app.put("/items/:itemID", (req, res) => {
  const { itemID } = req.params;
  const { newQuantity } = req.body;

  const request = new sql.Request();
  request.input("itemID", sql.Int, itemID);
  request.input("newQuantity", sql.Int, newQuantity);

  request.execute("UpdateStockQuantity", (err, result) => {
    if (err) {
      console.error("Error executing stored procedure:", err);
      res.status(500).send("Error updating stock quantity.");
      return;
    }
    res.status(200).send("Stock quantity updated successfully.");
  });
});

app.get("/sales", (req, res) => {
  const query = "SELECT * FROM Sales";

  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving items from database.");
      return;
    }
    res.json(result.recordset);
  });
});

app.post("/sales", (req, res) => {
  const { itemID, itemName, salePrice, qtySold, saleDate } = req.body;

  const query = `EXEC RecordSale @itemID = @itemID, @itemName = @itemName, @salePrice = @salePrice, @qtySold = @qtySold, @saleDate = @saleDate`;

  const request = new sql.Request();
  request.input("itemID", sql.Int, itemID);
  request.input("itemName", sql.NVarChar(100), itemName);
  request.input("salePrice", sql.Int, salePrice);
  request.input("qtySold", sql.Int, qtySold);
  request.input("saleDate", sql.NVarChar(100), saleDate);

  request.execute("RecordSale", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error recording sale.");
      return;
    }
    res.status(201).json({ message: "Sale recorded successfully." });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
