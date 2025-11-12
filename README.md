# Library Management System

A secure, web-based application for managing books in a college library. This system provides administrators with complete control over book registration, borrowing, returning, overdue tracking, and inventory monitoring.

## Features

- 🔐 **Secure Admin Login** - Password-protected access with password change functionality
- 📚 **Book Registration** - Add, edit, and delete books with unique IDs
- 📖 **Borrow Management** - Track book borrowing with automatic date calculation
- 🔁 **Return Processing** - Simplified return with automatic borrower info retrieval
- ⏰ **Overdue Notifications** - Automated daily checks for overdue books
- 📲 **QR-Based Inventory** - Public inventory view accessible via QR code
- 📊 **Dashboard** - Real-time statistics and overview

## Project Structure

```
Library Management System/
├── server.js              # Main server file with all API routes
├── package.json           # Dependencies and scripts
├── library.db            # SQLite database (created automatically)
├── public/               # Frontend files
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   └── auth.js       # Authentication utilities
│   ├── login.html        # Login page
│   ├── dashboard.html    # Admin dashboard
│   ├── book-registration.html
│   ├── borrow-book.html
│   ├── return-book.html
│   ├── notifications.html
│   └── inventory.html    # Public inventory page
└── README.md
```

## Database Schema

### Admins Table
- id (Primary Key)
- user_id (Unique)
- password_hash

### Books Table
- id (Primary Key)
- book_name
- author_name (Optional)
- location (Shelf Number)
- status (Available/Unavailable)
- unique_id
- created_at

### Borrows Table
- id (Primary Key)
- book_id (Foreign Key)
- book_name
- student_name
- register_number
- borrow_date
- return_date
- returned_date
- status (Active/Returned)

### Notifications Table
- id (Primary Key)
- book_id (Foreign Key)
- book_name
- student_name
- register_number
- borrow_date
- return_date
- days_overdue
- created_at
- status (Active/Cleared)

## API Endpoints

### Authentication
- `POST /api/login` - Admin login
- `POST /api/logout` - Logout
- `POST /api/change-password` - Change password
- `GET /api/check-session` - Check authentication status

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/available-books` - Get available books only

### Borrowing
- `POST /api/borrow` - Borrow a book
- `GET /api/borrow-by-book/:bookName` - Get borrow details by book name
- `POST /api/return` - Return a book

### Notifications
- `GET /api/notifications` - Get overdue notifications

### Inventory
- `GET /api/inventory` - Get available books (public)
- `GET /api/qr-code` - Generate QR code for inventory

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Key Features Explained

### Borrowing Rules
- Maximum 2 books per student (validated by register number)
- Borrow date is automatically set to current date
- Return date is automatically set to 7 days from borrow date
- Books are marked as "Unavailable" when borrowed

### Overdue System
- Daily automated check runs at midnight (using node-cron)
- Books overdue by more than 7 days generate notifications
- Notifications are automatically cleared when books are returned

### QR Inventory
- Public page showing only available books
- No authentication required
- Displays book name, author (if available), and location
- Can be accessed via QR code for easy mobile access

## Security Features

- Password hashing using bcrypt
- Session-based authentication
- Protected API routes (except inventory)
- SQL injection prevention through parameterized queries

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Authentication:** Express-session, bcrypt
- **Automation:** node-cron
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **QR Code:** qrcode library

## Notes

- The database file (`library.db`) is created automatically on first run
- Default admin credentials are set up automatically
- Daily overdue checks run automatically via cron job
- All dates are stored in ISO format (YYYY-MM-DD)

