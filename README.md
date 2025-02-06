# Notion to Apple Calendar Sync

## Overview
This project syncs tasks from Notion to Apple Calendar by:
- Fetching tasks from Notion API.
- Converting UTC time to Local Time (Asia/Riyadh).
- Generating `.ics` (iCalendar) files.
- Adding popup & sound notifications in Apple Calendar.
- Hosting `.ics` file on an NGINX server for live updates.



const DATABASE_ID = "DATABASE_ID";  

## Requirements
- Node.js installed on your server.
- A Notion API key.
- An existing Notion database.
- A server with NGINX (for hosting the `.ics` file).

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/notion-calendar-sync.git
cd notion-calendar-sync
```

### 2. Install Dependencies
```bash
npm install moment-timezone node-fetch
```

### 3. Set Up Notion API Key
Create a `.env` file in the root directory and add:
```
NOTION_API_KEY=your_notion_secret_key
DATABASE_ID=your_database_id
```

### 4. Run the Script
```bash
node fetchNotion.js
```

### 5. Check the Generated `.ics` File
```bash
cat notion-calendar.ics
```

### 6. Host `.ics` File on NGINX
Move the generated `.ics` file to your NGINX static folder:
```bash
mv notion-calendar.ics /var/www/html/static/
```
Ensure NGINX has a location directive for static files:
```
location /static/ {
    root /var/www/html;
    autoindex off;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
}
```
Restart NGINX:
```bash
sudo systemctl restart nginx
```

### 7. Subscribe in Apple Calendar
1. Open **Apple Calendar**.
2. Click **"File" → "New Calendar Subscription"**.
3. Enter the URL:
   ```
   https://yourdomain.com/static/notion-calendar.ics
   ```
4. Click **"Subscribe"**.

### 8. Automate the Sync
Set up a cron job to update the `.ics` file every 30 minutes:
```bash
crontab -e
```
Add this line:
```
*/30 * * * * node /path/to/notion-calendar-sync/fetchNotion.js && mv /path/to/notion-calendar-sync/notion-calendar.ics /var/www/html/static/
```

### 9. Verify Subscription
- Open Apple Calendar.
- Check if Notion events are syncing automatically.

## Troubleshooting
- Ensure your Notion API key has access to the database.
- Check `.ics` file permissions (`chmod 644 notion-calendar.ics`).
- Restart NGINX if the `.ics` file does not update (`sudo systemctl restart nginx`).

---
🚀 **Now your Notion tasks sync automatically to Apple Calendar!**
