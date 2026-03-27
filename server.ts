import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { google } from "googleapis";

// Try to load from .env first, then fallback to .env.example for convenience in this environment
dotenv.config();
if (fs.existsSync(".env.example")) {
  const exampleConfig = dotenv.parse(fs.readFileSync(".env.example"));
  for (const k in exampleConfig) {
    if (!process.env[k]) {
      process.env[k] = exampleConfig[k];
    }
  }
}

// Google Sheets Configuration
const SPREADSHEET_ID = "1LV4pZL85q149xlQxctzL6eq6nw28XwRBWooSYFGEejA";
const SHEET_NAMES = ["고객문의", "Sheet1"]; // Try both Korean and English defaults

async function appendToGoogleSheet(data: { name: string; phone: string; address: string; description: string }) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    const missing = [];
    if (!email) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    if (!key) missing.push("GOOGLE_PRIVATE_KEY");
    throw new Error(`환경 변수가 누락되었습니다: ${missing.join(", ")}`);
  }

  console.log(`Attempting to append to sheet with email: ${email}`);
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: key.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Try to find which sheet name exists
    let targetSheet = SHEET_NAMES[0];
    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
      const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
      const found = SHEET_NAMES.find(name => existingSheets.includes(name));
      if (found) targetSheet = found;
      else if (existingSheets.length > 0) targetSheet = existingSheets[0] || targetSheet;
    } catch (e) {
      console.warn("⚠️ Could not fetch spreadsheet info, defaulting to:", targetSheet);
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${targetSheet}!A:D`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[data.name, data.phone, data.address, data.description]],
      },
    });
    console.log(`✅ Successfully appended to Google Sheet (Tab: ${targetSheet})`);
  } catch (error: any) {
    console.error("❌ Google Sheets API Error:", error.message);
    if (error.response?.data) {
      console.error("Detailed Error:", JSON.stringify(error.response.data));
    }
    throw error; // Re-throw to handle in the route
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Unified Inquiry API Endpoint
  app.post("/api/inquiry", async (req, res) => {
    const { name, phone, address, description } = req.body;
    
    // Telegram Config
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram configuration missing");
      return res.status(500).json({ success: false, message: "서버 설정 오류가 발생했습니다. (Telegram)" });
    }

    const message = `
[새로운 수리 요청]
이름: ${name}
연락처: ${phone}
주소: ${address || "미입력"}
요청내용: ${description || "없음"}
    `.trim();

    let telegramSuccess = false;
    let sheetsSuccess = false;
    let telegramError = null;
    let sheetsError = null;

    try {
      // 1. Send to Telegram
      const telResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      const telResult = await telResponse.json();
      if (telResponse.ok) {
        telegramSuccess = true;
      } else {
        telegramError = telResult.description || "텔레그램 전송 실패";
      }

      // 2. Append to Google Sheet
      try {
        await appendToGoogleSheet({ name, phone, address, description });
        sheetsSuccess = true;
      } catch (e: any) {
        sheetsError = e.message;
      }

      if (telegramSuccess && sheetsSuccess) {
        res.json({ success: true, message: "문의 접수가 되었습니다." });
      } else if (telegramSuccess && !sheetsSuccess) {
        res.json({ 
          success: true, 
          message: "문의 접수가 되었습니다.",
          sheetsError: sheetsError 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "접수 중 오류가 발생했습니다.",
          telegramError,
          sheetsError
        });
      }
    } catch (error: any) {
      console.error("Inquiry Error:", error);
      res.status(500).json({ success: false, message: "서버 내부 오류가 발생했습니다.", error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    // Hidden import to prevent Vercel's bundler from tracing vite in production
    const { createServer: createViteServer } = await eval('import("vite")');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return app;
}

// For Vercel, we need to export the app but also handle the startServer call
const appPromise = startServer();

// Export the app for Vercel
export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
