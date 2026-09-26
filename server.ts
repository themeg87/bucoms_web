import express from "express";
import path from "path";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

// Google Sheets Configuration
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || "1LV4pZL85q149xlQxctzL6eq6nw28XwRBWooSYFGEejA";
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
      valueInputOption: "RAW", // 고객 입력이 수식(=...)으로 실행되지 않도록

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

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error("환경 변수가 누락되었습니다: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.description || `텔레그램 전송 실패 (${response.status})`);
  }
}

// PC 견적 요청을 파이(견적 서버)로 넘겨 자동 초안 견적을 만들게 한다.
// ESTIMATE_HOOK_URL·ESTIMATE_HOOK_SECRET 은 Vercel 환경변수에만 둔다(저장소 공개). 없으면 넘기지 않는다.
// 연락처는 넘기지 않는다(초안 견적에 필요 없음, 사장님 텔레그램 알림에만).
async function forwardEstimate(data: { name: string; address: string; description: string }) {
  const url = process.env.ESTIMATE_HOOK_URL;
  const secret = process.env.ESTIMATE_HOOK_SECRET;
  if (!url || !secret) return;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Hook-Secret": secret },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`견적 초안 요청 전달 실패 (${response.status})`);
}

// 같은 IP에서 짧은 시간에 반복 접수하는 스팸 차단 (인스턴스별 메모리 기준)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentRequests.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  recentRequests.set(ip, hits);
  if (recentRequests.size > 1000) {
    for (const [key, times] of recentRequests) {
      if (times.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) recentRequests.delete(key);
    }
  }
  return hits.length > RATE_LIMIT_MAX;
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "10kb" }));

  // Unified Inquiry API Endpoint
  app.post("/api/inquiry", async (req, res) => {
    const body = req.body || {};

    // 숨김 필드가 채워졌다면 봇으로 보고 조용히 무시
    if (body.website) {
      return res.json({ success: true, message: "문의 접수가 되었습니다." });
    }

    const name = clean(body.name, 30);
    const phone = clean(body.phone, 20);
    const address = clean(body.address, 200);
    const description = clean(body.description, 1000);
    // kind: "pc-estimate" = 홈페이지 PC 견적 요청 페이지(/pc-estimate/), 그 외 = 수리 문의
    const isEstimate = body.kind === "pc-estimate";

    if (!name || !address || !/^[0-9\-\s]{9,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "이름, 연락처, 주소를 정확히 입력해 주세요." });
    }

    if (isRateLimited(req.ip || "unknown")) {
      return res.status(429).json({ success: false, message: "잠시 후 다시 시도하시거나 전화로 문의해 주세요." });
    }

    const message = `
${isEstimate ? "[새로운 PC 견적 요청]" : "[새로운 수리 요청]"}
이름: ${name}
연락처: ${phone}
${isEstimate ? "지역" : "주소"}: ${address}
요청내용: ${description || "없음"}
    `.trim();

    // 텔레그램 알림과 시트 기록은 서로 독립적으로 시도 (한쪽이 실패해도 다른 쪽은 진행)
    const [telegramResult, sheetsResult, hookResult] = await Promise.allSettled([
      sendTelegram(message),
      appendToGoogleSheet({ name, phone, address, description: isEstimate ? `[PC견적] ${description}` : description }),
      isEstimate ? forwardEstimate({ name, address, description }) : Promise.resolve(),
    ]);
    if (hookResult.status === "rejected") console.error("Estimate Hook Error:", hookResult.reason?.message);

    if (telegramResult.status === "rejected") console.error("Telegram Error:", telegramResult.reason?.message);
    if (sheetsResult.status === "rejected") console.error("Sheets Error:", sheetsResult.reason?.message);

    // 둘 중 하나라도 기록되면 접수된 것으로 처리 (상세 오류는 서버 로그에만 남김)
    if (telegramResult.status === "fulfilled" || sheetsResult.status === "fulfilled") {
      res.json({ success: true, message: "문의 접수가 되었습니다." });
    } else {
      res.status(502).json({ success: false, message: "접수 중 오류가 발생했습니다. 전화로 문의해 주세요." });
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
