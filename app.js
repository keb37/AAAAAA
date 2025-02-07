const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'food_picker'
});

db.connect((err) => {
  if (err) {
      console.error('❌ Database connection failed:', err);
      return;
  }
  console.log('✅ Connected to MySQL database!');
});



// ใช้ body-parser จาก express ที่รวมอยู่แล้ว
app.use(express.urlencoded({ extended: true })); // ใช้ express แทน body-parser
app.use(express.json()); // ใช้ express สำหรับการรับข้อมูล JSON

// หน้า login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'login.html'));
});

// Route สำหรับหน้า login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
          // ถ้าผู้ใช้ล็อกอินสำเร็จ
          res.redirect('/index'); // เปลี่ยนเป็น /index
      } else {
          // ถ้าผู้ใช้ล็อกอินไม่สำเร็จ
          res.status(401).json({ message: '❌ Invalid username or password' });
      }
  });
});

// หน้า signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'signup.html'));
});
// Route สำหรับการสมัครสมาชิก
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบหาก username หรือ password ว่าง
  if (!username || !password) {
    return res.status(400).json({ message: '❌ Please provide both username and password' });
  }

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.redirect('/login'); // เมื่อสมัครเสร็จแล้ว ให้ redirect ไปที่หน้า login
  });
});



// หน้า login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'login.html'));
});

// หน้า index
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'index.html'));
});

// ใช้ static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'cookie', 'public')));

// ตั้งค่าการเชื่อมโยงกับหน้าอื่นๆ
app.get('/Thai', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'Thai.html'));
});

app.get('/korea', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'korea.html'));
});

app.get('/chiana', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'chiana.html'));
});

app.get('/Japan', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'Japan.html'));
});

app.get('/randomfood', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookie', 'public', 'randomfood.html'));
});

// รันเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
