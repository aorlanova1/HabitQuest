CODE WRITTEN BY: ARYAN SAHU
DEPLOYMENT CONFIGURATIONS BY: ANTONINA ORLANOVA

HabitQuest

A habit-tracking web application with gamification, email notifications, and Instagram sharing.

Setup Instructions:

1. Install Node.js:
   - Download from nodejs.org (LTS version).
   - Run installer, click Next, ensure "Add to PATH" is checked.

2. Install MongoDB:
   - Download from mongodb.com (Community Server).
   - Run installer, enable "Run service" option.

3. Create Project Folder:
   - In File Explorer, create "habitquest" in Documents.
   - Add "client" and "server" subfolders.

4. Copy Code:
   - Use Notepad to create files, paste code from this guide.

5. Configure .env:
   - Create .env in "habitquest", paste environment variables, update EMAIL_USER and EMAIL_PASS.

6. Run Backend:
   - Open Command Prompt, cd to "habitquest\server", run "npm install", then "npm run dev".

7. Run Frontend:
   - Open another Command Prompt, cd to "habitquest\client", run "npm install", then "npm start".

8. Access:
   - Open browser to http://localhost:3000.

Features:
- User registration/login with email confirmation
- Goal tracking (daily, weekly, monthly, yearly)
- Rank progression (bronze → silver → gold → platinum)
- Pet companion with motivational messages
- Statistics with charts
- Settings for color scheme, pet type, and email notifications
- Instagram sharing (feed/story via URL)
