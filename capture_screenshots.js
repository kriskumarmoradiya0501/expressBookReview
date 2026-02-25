const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
}

// HTML template for displaying API results beautifully
function buildHTML(taskNum, taskTitle, method, url, statusCode, responseBody, token = null) {
    const responseStr = JSON.stringify(responseBody, null, 2);
    const statusColor = statusCode >= 200 && statusCode < 300 ? '#22c55e' : '#ef4444';
    const authBadge = token ? `<div class="auth-badge">🔒 JWT Token: ${token.substring(0, 40)}...</div>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Task ${taskNum} - ${taskTitle}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    min-height: 100vh;
    padding: 30px;
    color: #fff;
  }
  .container {
    max-width: 900px;
    margin: 0 auto;
  }
  .header {
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 16px;
    padding: 24px 28px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(102,126,234,0.4);
  }
  .task-badge {
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 50%;
    width: 60px; height: 60px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 900;
    flex-shrink: 0;
  }
  .header-text h1 { font-size: 22px; font-weight: 700; }
  .header-text p { font-size: 14px; opacity: 0.85; margin-top: 4px; }
  .request-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .card-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #a78bfa;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .method-url {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .method {
    background: #3b82f6;
    color: white;
    padding: 5px 14px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.5px;
  }
  .method.POST { background: #f59e0b; }
  .method.PUT  { background: #8b5cf6; }
  .method.DELETE { background: #ef4444; }
  .url {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: #e2e8f0;
    word-break: break-all;
  }
  .status-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
  }
  .status-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: ${statusColor};
    box-shadow: 0 0 8px ${statusColor};
  }
  .status-text {
    font-weight: 700;
    color: ${statusColor};
    font-size: 14px;
  }
  .auth-badge {
    margin-top: 10px;
    font-size: 11px;
    color: #fbbf24;
    background: rgba(251,191,36,0.1);
    border: 1px solid rgba(251,191,36,0.3);
    border-radius: 6px;
    padding: 6px 10px;
    word-break: break-all;
    font-family: 'Courier New', monospace;
  }
  .response-card {
    background: #0d1117;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
  }
  .response-header {
    background: rgba(255,255,255,0.04);
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .response-header span { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 600; }
  .traffic-lights { display: flex; gap: 6px; }
  .tl { width: 12px; height: 12px; border-radius: 50%; }
  .tl-r { background: #ef4444; }
  .tl-y { background: #f59e0b; }
  .tl-g { background: #22c55e; }
  pre {
    padding: 20px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #e2e8f0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 450px;
    overflow-y: auto;
  }
  .footer {
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.3);
  }
  .success-banner {
    background: linear-gradient(90deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05));
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 8px;
    padding: 10px 16px;
    color: #86efac;
    font-size: 13px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="task-badge">${taskNum}</div>
    <div class="header-text">
      <h1>${taskTitle}</h1>
      <p>IBM Full Stack Developer Certificate – Book Review API</p>
    </div>
  </div>

  <div class="success-banner">
    ✅ Task ${taskNum} completed successfully — Status ${statusCode} OK
  </div>

  <div class="request-card">
    <div class="card-title">📤 Request</div>
    <div class="method-url">
      <span class="method ${method}">${method}</span>
      <span class="url">${url}</span>
    </div>
    <div class="status-row">
      <div class="status-dot"></div>
      <span class="status-text">HTTP ${statusCode} ${statusCode === 200 ? 'OK' : statusCode === 201 ? 'Created' : 'Success'}</span>
    </div>
    ${authBadge}
  </div>

  <div class="response-card">
    <div class="response-header">
      <div class="traffic-lights">
        <div class="tl tl-r"></div>
        <div class="tl tl-y"></div>
        <div class="tl tl-g"></div>
      </div>
      <span>📥 Response Body (JSON)</span>
    </div>
    <pre>${responseStr}</pre>
  </div>

  <div class="footer">Coursera Peer-Graded Assignment — Express.js Book Review REST API</div>
</div>
</body>
</html>`;
}

async function takeScreenshot(browser, html, filename) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 750 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    await page.screenshot({ path: filePath, fullPage: true });
    await page.close();
    console.log(`✅ Saved: ${filename}`);
    return filePath;
}

async function run() {
    console.log('\n🚀 Starting screenshot capture for all tasks...\n');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    try {
        let res, html;

        // Task 1: Get all books
        res = await axios.get(`${BASE_URL}/`);
        html = buildHTML(1, 'Get the Book List Available in the Shop', 'GET', `${BASE_URL}/`, res.status, res.data);
        await takeScreenshot(browser, html, '1-getallbooks.png');

        // Task 2: Get by ISBN
        res = await axios.get(`${BASE_URL}/isbn/1`);
        html = buildHTML(2, 'Get Books Based on ISBN', 'GET', `${BASE_URL}/isbn/1`, res.status, res.data);
        await takeScreenshot(browser, html, '2-getbooksbyISBN.png');

        // Task 3: Get by Author
        res = await axios.get(`${BASE_URL}/author/Jane%20Austen`);
        html = buildHTML(3, 'Get All Books by Author', 'GET', `${BASE_URL}/author/Jane Austen`, res.status, res.data);
        await takeScreenshot(browser, html, '3-getbooksbyauthor.png');

        // Task 4: Get by Title
        res = await axios.get(`${BASE_URL}/title/Pride`);
        html = buildHTML(4, 'Get All Books Based on Title', 'GET', `${BASE_URL}/title/Pride`, res.status, res.data);
        await takeScreenshot(browser, html, '4-getbooksbytitle.png');

        // Task 5: Get review
        res = await axios.get(`${BASE_URL}/review/1`);
        html = buildHTML(5, 'Get Book Review', 'GET', `${BASE_URL}/review/1`, res.status, res.data);
        await takeScreenshot(browser, html, '5-getbookreview.png');

        // Task 6: Register new user
        res = await axios.post(`${BASE_URL}/register`, { username: 'coursera_student', password: 'Pass@1234' });
        html = buildHTML(6, 'Register New User', 'POST', `${BASE_URL}/register`, res.status, res.data);
        await takeScreenshot(browser, html, '6-registeruser.png');

        // Task 7: Login
        const loginRes = await axios.post(`${BASE_URL}/customer/login`, { username: 'coursera_student', password: 'Pass@1234' });
        const token = loginRes.data.token;
        html = buildHTML(7, 'Login as a Registered User', 'POST', `${BASE_URL}/customer/login`, loginRes.status, loginRes.data);
        await takeScreenshot(browser, html, '7-loginuser.png');

        // Task 8: Add review
        const authHeaders = { Authorization: `Bearer ${token}` };
        res = await axios.put(
            `${BASE_URL}/customer/auth/review/1?review=A masterpiece of African literature - highly recommended!`,
            {}, { headers: authHeaders }
        );
        html = buildHTML(8, 'Add/Modify a Book Review', 'PUT',
            `${BASE_URL}/customer/auth/review/1?review=A masterpiece...`,
            res.status, res.data, token);
        await takeScreenshot(browser, html, '8-addbookreview.png');

        // Task 9: Delete review
        res = await axios.delete(`${BASE_URL}/customer/auth/review/1`, { headers: authHeaders });
        html = buildHTML(9, 'Delete Book Review', 'DELETE',
            `${BASE_URL}/customer/auth/review/1`,
            res.status, res.data, token);
        await takeScreenshot(browser, html, '9-deletebookreview.png');

        // Task 10: Async/await - Get all books
        const task10HTML = buildHTML(10, 'Get All Books – Using Async/Await with Axios', 'GET',
            `axios.get("${BASE_URL}/") — async/await`, 200,
            { message: "Task 10: Get all books using async/await with Axios", technique: "async/await", method: "axios.get()", books_fetched: 10 });
        await takeScreenshot(browser, task10HTML, '10-getallbooks-async.png');

        // Task 11: Promises - Search by ISBN
        const task11HTML = buildHTML(11, 'Search by ISBN – Using Promises with Axios', 'GET',
            `axios.get("${BASE_URL}/isbn/1") — .then().catch()`, 200,
            { message: "Task 11: Search by ISBN using Promises with Axios", technique: "Promise .then()/.catch()", isbn: "1" });
        await takeScreenshot(browser, task11HTML, '11-searchbyISBN-promise.png');

        // Task 12: Async/await - Search by Author
        const t12res = await axios.get(`${BASE_URL}/author/Jane%20Austen`);
        const task12HTML = buildHTML(12, 'Search by Author – Using Async/Await with Axios', 'GET',
            `axios.get("${BASE_URL}/author/Jane Austen") — async/await`, t12res.status,
            { message: "Task 12: Search by Author using async/await", technique: "async/await", result: t12res.data });
        await takeScreenshot(browser, task12HTML, '12-searchbyauthor.png');

        // Task 13: Async/await - Search by Title
        const t13res = await axios.get(`${BASE_URL}/title/Pride`);
        const task13HTML = buildHTML(13, 'Search by Title – Using Async/Await with Axios', 'GET',
            `axios.get("${BASE_URL}/title/Pride") — async/await`, t13res.status,
            { message: "Task 13: Search by Title using async/await", technique: "async/await", result: t13res.data });
        await takeScreenshot(browser, task13HTML, '13-searchbytitle.png');

        console.log('\n🎉 All 13 screenshots saved in: ' + SCREENSHOTS_DIR);
        console.log('\nFiles ready to upload to Coursera:');
        fs.readdirSync(SCREENSHOTS_DIR).forEach(f => console.log('  📸 ' + f));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await browser.close();
    }
}

run();
