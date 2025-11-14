const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'library-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Database initialization
const db = new sqlite3.Database('./library.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Admins table
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )`, (err) => {
    if (err) console.error('Error creating admins table:', err);
    else {
      // Insert default admin if not exists
      const defaultPassword = 'IT@Library01';
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (err) console.error('Error hashing password:', err);
        else {
          db.run(`INSERT OR IGNORE INTO admins (user_id, password_hash) VALUES (?, ?)`,
            ['ITLibrary', hash], (err) => {
              if (err) console.error('Error inserting default admin:', err);
            });
        }
      });
    }
  });

  // Books table
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_name TEXT NOT NULL,
    author_name TEXT,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'Available',
    unique_id TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('Error creating books table:', err);
  });

  // Borrows table
  db.run(`CREATE TABLE IF NOT EXISTS borrows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    book_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    register_number TEXT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE NOT NULL,
    returned_date DATE,
    status TEXT DEFAULT 'Active',
    FOREIGN KEY (book_id) REFERENCES books(id)
  )`, (err) => {
    if (err) console.error('Error creating borrows table:', err);
  });

  // Notifications table
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    book_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    register_number TEXT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE NOT NULL,
    days_overdue INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Active',
    FOREIGN KEY (book_id) REFERENCES books(id)
  )`, (err) => {
    if (err) console.error('Error creating notifications table:', err);
  });
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

// Routes

// Root route - redirect to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Login
app.post('/api/login', (req, res) => {
  const { user_id, password } = req.body;
  
  db.get('SELECT * FROM admins WHERE user_id = ?', [user_id], (err, admin) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    bcrypt.compare(password, admin.password_hash, (err, match) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Authentication error' });
      }
      
      if (match) {
        req.session.authenticated = true;
        req.session.user_id = user_id;
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
});

// Change password
app.post('/api/change-password', requireAuth, (req, res) => {
  const { old_password, new_password } = req.body;
  const user_id = req.session.user_id;
  
  db.get('SELECT * FROM admins WHERE user_id = ?', [user_id], (err, admin) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    bcrypt.compare(old_password, admin.password_hash, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ success: false, message: 'Old password is incorrect' });
      }
      
      bcrypt.hash(new_password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error hashing password' });
        }
        
        db.run('UPDATE admins SET password_hash = ? WHERE user_id = ?', [hash, user_id], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating password' });
          }
          res.json({ success: true, message: 'Password changed successfully' });
        });
      });
    });
  });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out successfully' });
});

// Check session
app.get('/api/check-session', (req, res) => {
  res.json({ authenticated: req.session && req.session.authenticated });
});

// Books API
app.get('/api/books', requireAuth, (req, res) => {
  db.all('SELECT * FROM books ORDER BY created_at DESC', [], (err, books) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, books });
  });
});

app.post('/api/books', requireAuth, (req, res) => {
  const { book_name, author_name, location } = req.body;
  
  if (!book_name || !location) {
    return res.status(400).json({ success: false, message: 'Book name and location are required' });
  }
  
  const unique_id = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9);
  
  db.run('INSERT INTO books (book_name, author_name, location, unique_id) VALUES (?, ?, ?, ?)',
    [book_name, author_name || null, location, unique_id], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error adding book' });
      }
      res.json({ success: true, message: 'Book added successfully', book_id: this.lastID });
    });
});

app.put('/api/books/:id', requireAuth, (req, res) => {
  const { book_name, author_name, location } = req.body;
  const id = req.params.id;
  
  if (!book_name || !location) {
    return res.status(400).json({ success: false, message: 'Book name and location are required' });
  }
  
  db.run('UPDATE books SET book_name = ?, author_name = ?, location = ? WHERE id = ?',
    [book_name, author_name || null, location, id], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating book' });
      }
      res.json({ success: true, message: 'Book updated successfully' });
    });
});

app.delete('/api/books/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  
  // Check if book is currently borrowed
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, book) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    if (book.status === 'Unavailable') {
      return res.status(400).json({ success: false, message: 'Cannot delete book that is currently borrowed. Please return it first.' });
    }
    
    // Check for active borrows
    db.get('SELECT * FROM borrows WHERE book_id = ? AND status = ?', [id, 'Active'], (err, borrow) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (borrow) {
        return res.status(400).json({ success: false, message: 'Cannot delete book that is currently borrowed. Please return it first.' });
      }
      
      // Delete related records first (notifications, borrow history)
      db.run('DELETE FROM notifications WHERE book_id = ?', [id], () => {});
      db.run('DELETE FROM borrows WHERE book_id = ?', [id], () => {});
      
      // Delete the book
      db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error deleting book' });
        }
        res.json({ success: true, message: 'Book deleted successfully' });
      });
    });
  });
});

// Borrow API
app.get('/api/available-books', requireAuth, (req, res) => {
  db.all("SELECT * FROM books WHERE status = 'Available' ORDER BY book_name", [], (err, books) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, books });
  });
});

app.post('/api/borrow', requireAuth, (req, res) => {
  const { book_id, student_name, register_number } = req.body;
  
  if (!book_id || !student_name || !register_number) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Check if student already has 2 active borrows
  db.all(`SELECT COUNT(*) as count FROM borrows 
    WHERE register_number = ? AND status = 'Active'`, [register_number], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (result[0].count >= 2) {
      return res.status(400).json({ success: false, message: 'Student already has 2 books borrowed' });
    }
    
    // Get book details
    db.get('SELECT * FROM books WHERE id = ?', [book_id], (err, book) => {
      if (err || !book) {
        return res.status(500).json({ success: false, message: 'Book not found' });
      }
      
      if (book.status !== 'Available') {
        return res.status(400).json({ success: false, message: 'Book is not available' });
      }
      
      const borrow_date = new Date().toISOString().split('T')[0];
      const return_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Create borrow record
      db.run(`INSERT INTO borrows (book_id, book_name, student_name, register_number, borrow_date, return_date) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [book_id, book.book_name, student_name, register_number, borrow_date, return_date], function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error creating borrow record' });
        }
        
        // Update book status
        db.run("UPDATE books SET status = 'Unavailable' WHERE id = ?", [book_id], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating book status' });
          }
          res.json({ success: true, message: 'Book borrowed successfully' });
        });
      });
    });
  });
});

// Return API
app.get('/api/borrow-by-book/:bookName', requireAuth, (req, res) => {
  const bookName = req.params.bookName;
  
  db.get(`SELECT * FROM borrows WHERE book_name = ? AND status = 'Active' ORDER BY borrow_date DESC LIMIT 1`,
    [bookName], (err, borrow) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'No active borrow found for this book' });
    }
    
    res.json({ success: true, borrow });
  });
});

app.post('/api/return', requireAuth, (req, res) => {
  const { borrow_id } = req.body;
  
  if (!borrow_id) {
    return res.status(400).json({ success: false, message: 'Borrow ID is required' });
  }
  
  db.get('SELECT * FROM borrows WHERE id = ?', [borrow_id], (err, borrow) => {
    if (err || !borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }
    
    const returned_date = new Date().toISOString().split('T')[0];
    
    // Update borrow record
    db.run(`UPDATE borrows SET returned_date = ?, status = 'Returned' WHERE id = ?`,
      [returned_date, borrow_id], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating borrow record' });
      }
      
      // Update book status
      db.run("UPDATE books SET status = 'Available' WHERE id = ?", [borrow.book_id], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error updating book status' });
        }
        
        // Clear related notifications
        db.run("UPDATE notifications SET status = 'Cleared' WHERE book_id = ? AND status = 'Active'",
          [borrow.book_id], () => {});
        
        res.json({ success: true, message: 'Book returned successfully' });
      });
    });
  });
});

// Notifications API
app.get('/api/notifications', requireAuth, (req, res) => {
  db.all(`SELECT * FROM notifications WHERE status = 'Active' ORDER BY days_overdue DESC, created_at DESC`,
    [], (err, notifications) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, notifications });
  });
});

// Inventory API (public, no auth required)
app.get('/api/inventory', (req, res) => {
  db.all("SELECT unique_id, book_name FROM books WHERE status = 'Available' ORDER BY book_name",
    [], (err, books) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, books });
  });
});

// Generate QR code for inventory
app.get('/api/qr-code', requireAuth, (req, res) => {
  const inventoryUrl = `${req.protocol}://${req.get('host')}/inventory.html`;
  QRCode.toDataURL(inventoryUrl, (err, url) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error generating QR code' });
    }
    res.json({ success: true, qrCode: url, url: inventoryUrl });
  });
});

// Dashboard stats
app.get('/api/dashboard', requireAuth, (req, res) => {
  const stats = {};
  
  db.get("SELECT COUNT(*) as count FROM books WHERE status = 'Available'", [], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    stats.available = result.count;
    
    db.get("SELECT COUNT(*) as count FROM books WHERE status = 'Unavailable'", [], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      stats.borrowed = result.count;
      
      db.get("SELECT COUNT(*) as count FROM notifications WHERE status = 'Active'", [], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        stats.overdue = result.count;
        
        db.get("SELECT COUNT(*) as count FROM books", [], (err, result) => {
          if (err) return res.status(500).json({ success: false, message: 'Database error' });
          stats.total = result.count;
          
          res.json({ success: true, stats });
        });
      });
    });
  });
});

// Daily cron job to check for overdue books
cron.schedule('0 0 * * *', () => {
  console.log('Running daily overdue check...');
  const today = new Date().toISOString().split('T')[0];
  
  db.all(`SELECT * FROM borrows WHERE status = 'Active' AND return_date < ?`, [today], (err, overdue) => {
    if (err) {
      console.error('Error checking overdue books:', err);
      return;
    }
    
    overdue.forEach(borrow => {
      const returnDate = new Date(borrow.return_date);
      const todayDate = new Date(today);
      const daysOverdue = Math.floor((todayDate - returnDate) / (1000 * 60 * 60 * 24));
      
      // Check if notification already exists
      db.get(`SELECT * FROM notifications WHERE book_id = ? AND status = 'Active'`, [borrow.book_id], (err, existing) => {
        if (!existing) {
          db.run(`INSERT INTO notifications (book_id, book_name, student_name, register_number, borrow_date, return_date, days_overdue)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [borrow.book_id, borrow.book_name, borrow.student_name, borrow.register_number, borrow.borrow_date, borrow.return_date, daysOverdue]);
        } else {
          // Update days overdue
          db.run(`UPDATE notifications SET days_overdue = ? WHERE id = ?`, [daysOverdue, existing.id]);
        }
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Library Management System running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

