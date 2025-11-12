# Quick Start Guide

## Installation Steps

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Version 14.x or higher recommended

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`
   - You'll be redirected to the login page

5. **Login**
   - **User ID:** ITLibrary
   - **Password:** IT@Library01

## First Steps After Login

1. **Change Your Password** (Recommended)
   - Go to Dashboard
   - Scroll down to Settings
   - Enter old password and new password
   - Click "Change Password"

2. **Register Books**
   - Click "Book Registration" in the navigation
   - Fill in Book Name (required) and Location (required)
   - Author Name is optional
   - Click "Register Book"

3. **Generate QR Code**
   - Click "QR Code" in the navigation
   - Print or display the QR code in your library
   - Students can scan it to view available books

## Features Overview

- **Dashboard**: View statistics and change password
- **Book Registration**: Add, edit, and delete books
- **Borrow Book**: Record book borrowing (max 2 per student)
- **Return Book**: Process book returns
- **Notifications**: View overdue books
- **Inventory**: Public page showing available books (accessible via QR code)
- **QR Code**: Generate QR code for inventory access

## Important Notes

- The database (`library.db`) is created automatically on first run
- Default admin account is created automatically
- Overdue checks run daily at midnight
- All dates are automatically calculated (borrow = today, return = 7 days later)
- Maximum 2 books per student (validated by register number)

## Troubleshooting

**Port 3000 already in use?**
- Change the PORT in `server.js` to a different number (e.g., 3001)
- Or stop the application using port 3000

**Database errors?**
- Delete `library.db` and restart the server (this will reset all data)

**Can't login?**
- Make sure the server is running
- Check that you're using the correct credentials
- Default: ITLibrary / IT@Library01

