const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors({
    origin: 'http://localhost:3000' // or the actual port where your React app is running
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = 5000;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bannerDB",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1); // Exit the process with a failure
  }
  console.log("Connected to the database.");
});

app.post("/AddBanner", (req, res) => {
  console.log("Received data:", req.body); // Log received data
  const sql = "INSERT INTO tblBanner (`description`, `link`, `timer`, `display`) VALUES (?, ?, ?, ?)";
  const values = [req.body.description, req.body.link, req.body.timer, req.body.display];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log database errors
      return res.status(500).json({ message: "Something unexpected has occurred: " + err.message });
    }
    // Return the ID of the newly created banner
    return res.json({ success: "Banner added successfully", id: result.insertId });
  });
});

// Route to view a specific banner by ID
app.get("/ViewBanner/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM student_details WHERE `id`= ?";
    db.query(sql, [id], (err, result) => {
      if (err) res.json({ message: "Server error" });
      return res.json(result);
    });
  });

// Route to view all banners
app.get('/ViewRecentBanner', (req, res) => {
    const sql = "SELECT * FROM tblBanner ORDER BY createdAt DESC LIMIT 1"; // Adjust SQL to fit your schema
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Server error: " + err.message });
      }
  
      return res.json(result[0] || {}); // Send only the most recent result
    });
  });
  
  
  

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
