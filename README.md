# 📅 Notion to Apple Calendar Sync 🚀  

### **Overview**  
This project syncs Notion tasks with Apple Calendar, including:  
✅ Time conversion (UTC → Local Time)  
✅ Generating `.ics` files  
✅ Popup notifications & Sound alerts  
✅ Hosting `.ics` file on an NGINX server  

### **Technologies Used**
- Node.js  
- Notion API  
- moment-timezone  
- iCalendar (`.ics` format)  
- NGINX  

### **Setup**
```bash
npm install moment-timezone node-fetch
node fetchNotion.js

