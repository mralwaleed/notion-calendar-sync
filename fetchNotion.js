require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const moment = require("moment-timezone");

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !DATABASE_ID) {
    console.error("❌ Missing environment variables! Check your .env file.");
    process.exit(1);
}

async function getNotionEvents() {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    return data.results.map(page => {
        const title = page.properties.Name?.title[0]?.plain_text || "No Title";
        const start = page.properties.Date?.date?.start || null;
        const end = page.properties.Date?.date?.end || start;
        const description = page.properties.Description?.rich_text[0]?.plain_text || "";

        return { title, start, end, description };
    });
}

async function generateICS() {
    const events = await getNotionEvents();

    if (events.length === 0) {
        console.error("No events found in Notion. Make sure the data is correct!");
        return;
    }

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Notion Calendar//EN\n";

    events.forEach(event => {
        if (!event.start) return;

        const timezone = "Asia/Riyadh";
        const startDate = moment.tz(event.start, timezone).format("YYYYMMDDTHHmmss");
        const endDate = moment.tz(event.end, timezone).format("YYYYMMDDTHHmmss");

        icsContent += `\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART;TZID=${timezone}:${startDate}\nDTEND;TZID=${timezone}:${endDate}\nDESCRIPTION:${event.description}\n\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Reminder (30 minutes before) - ${event.title}\nTRIGGER:-PT30M\nEND:VALARM\n\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Reminder (At event time) - ${event.title}\nTRIGGER:PT0M\nEND:VALARM\n\nBEGIN:VALARM\nACTION:AUDIO\nTRIGGER:PT0M\nATTACH;VALUE=URI:Basso\nEND:VALARM\n\nEND:VEVENT`;
    });

    icsContent += "\nEND:VCALENDAR";

    fs.writeFileSync("/var/www/html/static/notion-calendar.ics", icsContent);
    console.log("Calendar updated successfully with alerts and sound!");
}

generateICS();

