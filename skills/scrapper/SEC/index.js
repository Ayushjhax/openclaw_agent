const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { setTimeout: wait } = require("timers/promises");

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
  outputPath: path.join(__dirname, "sec_ucc_data"),
  progressFile: path.join(__dirname, "sec_ucc_data", "progress.json"),
  cookiesPath: path.join(__dirname, "sec_cookies.json"),
  userDataDir: path.join(__dirname, "chrome_user_data"),

  scrapeInterval: 6 * 60 * 60 * 1000, // Every 6 hours (SEC EDGAR rate limits are strict)
  maxCompaniesPerRun: 5,
  scrollsPerCompany: 10,

  // EDGAR API base URLs
  edgarBase: "https://www.sec.gov",
  edgarSubmissions: "https://data.sec.gov/submissions",
  edgarSearch: "https://efts.sec.gov/LATEST/search-index",

  // UCC state portals (add/remove states as needed)
  uccPortals: {
    california: "https://www.sos.ca.gov/business/ucc/ucc-search",
    delaware: "https://icis.corp.delaware.gov/Ecorp/UccSearch/SearchUCC.aspx",
    new_york: "https://appext20.dos.ny.gov/pls/ucc_public/web_search_name",
    // texas: "https://www.sos.state.tx.us/ucc/index.shtml",
    // florida: "https://ccfcorp.dos.state.fl.us/search/",
  },

  // SEC filing types to track
  filingTypes: [
    "10-K",    // Annual report
    "10-Q",    // Quarterly report
    "8-K",     // Material events (earnings, acquisitions, CEO changes, etc.)
    "S-1",     // IPO registration statement
    "S-3",     // Shelf registration
    "4",       // Insider transactions (Form 4)
    "DEF 14A", // Proxy statement
    "SC 13G",  // Passive > 5% ownership
    "SC 13D",  // Activist > 5% ownership
    // "424B4",   // Prospectus (final)
    // "N-CEN",   // Annual report for investment companies
    // "ADV",     // Investment adviser registration
  ],

  // Companies to scrape (CIK = SEC Central Index Key)
  companies: [
    { name: "Apple Inc", cik: "0000320193" },
    { name: "Tesla Inc", cik: "0001318605" },
    { name: "Microsoft Corp", cik: "0000789019" },
    { name: "Amazon.com Inc", cik: "0001018724" },
    { name: "Alphabet Inc", cik: "0001652044" },
    // { name: "Meta Platforms", cik: "0001326801" },
    // { name: "Nvidia Corp", cik: "0001045810" },
    // { name: "Berkshire Hathaway", cik: "0001067983" },
    // { name: "JPMorgan Chase", cik: "0000019617" },
    // { name: "Exxon Mobil", cik: "0000034088" },
    // { name: "Johnson & Johnson", cik: "0000200406" },
    // { name: "Walmart Inc", cik: "0000104169" },
    // { name: "Bank of America", cik: "0000070858" },
    // { name: "Visa Inc", cik: "0001403161" },
    // { name: "Procter & Gamble", cik: "0000080424" },
    // { name: "UnitedHealth Group", cik: "0000731766" },
    // { name: "Chevron Corp", cik: "0000093410" },
    // { name: "Home Depot", cik: "0000354950" },
    // { name: "Mastercard Inc", cik: "0001141391" },
    // { name: "Pfizer Inc", cik: "0000078003" },
  ],

  // UCC debtor names to search
  uccDebtors: [
    // "Tesla Motors Inc",
    // "SpaceX Exploration Technologies",
    // "Apple Inc",
  ],

  // EDGAR full-text keyword searches
  keywordSearches: [
    // "artificial intelligence machine learning",
    // "cryptocurrency blockchain",
    // "data breach material cybersecurity",
    // "merger acquisition",
    // "going concern doubt",
  ],
};

// ============================================================
// SETUP
// ============================================================
if (!fs.existsSync(CONFIG.outputPath)) {
  fs.mkdirSync(CONFIG.outputPath, { recursive: true });
}

// ============================================================
// PROGRESS TRACKING
// ============================================================
function loadProgress() {
  if (fs.existsSync(CONFIG.progressFile)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG.progressFile, "utf8"));
    } catch {}
  }
  return { lastRun: null, scrapedCompanies: [], totalFilingsSaved: 0 };
}

function saveProgress(data) {
  fs.writeFileSync(CONFIG.progressFile, JSON.stringify(data, null, 2));
}

// ============================================================
// MAIN SCRAPER
// ============================================================
async function main() {
  let browser;

  try {
    console.log("\n========================================");
    console.log("SEC/EDGAR + UCC Filing Scraper");
    console.log(`Run started at: ${new Date().toISOString()}`);
    console.log("========================================\n");

    const progress = loadProgress();

    // Sort companies by least-recently-scraped first
    const sortedCompanies = [...CONFIG.companies].sort((a, b) => {
      const aLast = progress.scrapedCompanies.find((c) => c.cik === a.cik)?.timestamp || 0;
      const bLast = progress.scrapedCompanies.find((c) => c.cik === b.cik)?.timestamp || 0;
      return aLast - bLast;
    });

    const companiesToScrape = sortedCompanies.slice(0, CONFIG.maxCompaniesPerRun);
    console.log(`Companies queued for this run: ${companiesToScrape.map((c) => c.name).join(", ")}`);

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        "--window-size=1366,768",
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      userDataDir: CONFIG.userDataDir,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // SEC requires a valid User-Agent per their robots.txt
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "application/json, text/html, */*",
    });

    const runResults = [];
    let totalFilingsThisRun = 0;

    // ============================================================
    // EDGAR: Scrape each company via JSON Submissions API
    // ============================================================
    for (const company of companiesToScrape) {
      console.log(`\n[EDGAR] Scraping: ${company.name} (CIK: ${company.cik})`);
      await randomDelay(3000, 6000);

      try {
        const result = await scrapeCompanyEdgar(page, company);
        totalFilingsThisRun += result.filings.length;

        // Save individual company file
        const filename = `EDGAR_${company.name.replace(/\s+/g, "_")}_${dateStr()}.json`;
        fs.writeFileSync(
          path.join(CONFIG.outputPath, filename),
          JSON.stringify(result, null, 2)
        );

        runResults.push(result);

        // Update progress
        const updatedScraped = [
          ...progress.scrapedCompanies.filter((c) => c.cik !== company.cik),
          { cik: company.cik, name: company.name, timestamp: Date.now() },
        ];
        progress.scrapedCompanies = updatedScraped;
        saveProgress(progress);

        console.log(`  ✓ ${company.name}: ${result.filings.length} filings saved`);
      } catch (err) {
        console.error(`  ✗ Error scraping ${company.name}:`, err.message);
      }
    }

    // ============================================================
    // EDGAR: Full-text keyword search
    // ============================================================
    for (const keyword of CONFIG.keywordSearches) {
      console.log(`\n[EDGAR FULLTEXT] Keyword: "${keyword}"`);
      await randomDelay(2000, 5000);

      try {
        const keywordResults = await scrapeEdgarFullText(page, keyword);
        const filename = `EDGAR_SEARCH_${keyword.replace(/\s+/g, "_").slice(0, 30)}_${dateStr()}.json`;
        fs.writeFileSync(
          path.join(CONFIG.outputPath, filename),
          JSON.stringify(keywordResults, null, 2)
        );

        totalFilingsThisRun += keywordResults.results.length;
        console.log(`  ✓ Found ${keywordResults.results.length} filings for "${keyword}"`);
      } catch (err) {
        console.error(`  ✗ Error in keyword search "${keyword}":`, err.message);
      }
    }

    // ============================================================
    // UCC: Scrape state portals
    // ============================================================
    for (const debtorName of CONFIG.uccDebtors) {
      for (const [state, portalUrl] of Object.entries(CONFIG.uccPortals)) {
        console.log(`\n[UCC] State: ${state} | Debtor: "${debtorName}"`);
        await randomDelay(4000, 8000);

        try {
          const uccResult = await scrapeUCCPortal(page, state, portalUrl, debtorName);
          const filename = `UCC_${state}_${debtorName.replace(/\s+/g, "_")}_${dateStr()}.json`;
          fs.writeFileSync(
            path.join(CONFIG.outputPath, filename),
            JSON.stringify(uccResult, null, 2)
          );

          totalFilingsThisRun += uccResult.filings.length;
          console.log(`  ✓ ${state}: ${uccResult.filings.length} UCC filings found`);
        } catch (err) {
          console.error(`  ✗ Error scraping UCC [${state}] for "${debtorName}":`, err.message);
        }
      }
    }

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    progress.lastRun = new Date().toISOString();
    progress.totalFilingsSaved = (progress.totalFilingsSaved || 0) + totalFilingsThisRun;
    saveProgress(progress);

    console.log("\n========================================");
    console.log("RUN COMPLETE");
    console.log(`Filings this run : ${totalFilingsThisRun}`);
    console.log(`Total ever saved : ${progress.totalFilingsSaved}`);
    console.log(`Output directory : ${CONFIG.outputPath}`);
    console.log("========================================\n");
  } catch (error) {
    console.error("Fatal error:", error);
  } finally {
    if (browser) {
      console.log("Closing browser...");
      await browser.close();
    }
  }
}

// ============================================================
// EDGAR: Scrape a company using the JSON Submissions API
// https://data.sec.gov/submissions/CIK{padded10digits}.json
// ============================================================
async function scrapeCompanyEdgar(page, company) {
  const url = `${CONFIG.edgarSubmissions}/CIK${company.cik}.json`;

  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  const rawData = await page.evaluate(() => {
    try { return JSON.parse(document.body.innerText); } catch { return null; }
  });

  if (!rawData) throw new Error("Could not parse EDGAR JSON response");

  const recent = rawData.filings?.recent || {};
  const filings = [];

  const total = (recent.form || []).length;

  for (let i = 0; i < total; i++) {
    const formType = recent.form?.[i];
    if (!CONFIG.filingTypes.includes(formType)) continue;

    const accNum = recent.accessionNumber?.[i];
    const cikInt = parseInt(company.cik);
    const accNumClean = accNum?.replace(/-/g, "");

    filings.push({
      company: company.name,
      cik: company.cik,
      formType,
      filingDate: recent.filingDate?.[i] || null,
      reportDate: recent.reportDate?.[i] || null,
      accessionNumber: accNum || null,
      primaryDocument: recent.primaryDocument?.[i] || null,
      description: recent.primaryDocDescription?.[i] || "",
      isInlineXBRL: recent.isInlineXBRL?.[i] === 1,
      documentUrl: accNumClean
        ? `${CONFIG.edgarBase}/Archives/edgar/data/${cikInt}/${accNumClean}/${recent.primaryDocument?.[i]}`
        : null,
      indexUrl: accNumClean
        ? `${CONFIG.edgarBase}/Archives/edgar/data/${cikInt}/${accNumClean}/`
        : null,
      source: "EDGAR_SUBMISSIONS_API",
      scrapedAt: new Date().toISOString(),
    });
  }

  // Also scrape the HTML filing page for extra detail
  await randomDelay(1500, 3000);
  const htmlFilings = await scrapeEdgarHtmlPage(page, company);

  // Merge: prefer JSON data, supplement with HTML data
  const allAccNums = new Set(filings.map((f) => f.accessionNumber));
  for (const hf of htmlFilings) {
    if (!allAccNums.has(hf.accessionNumber)) {
      filings.push(hf);
    }
  }

  return {
    source: "SEC_EDGAR",
    company: company.name,
    cik: company.cik,
    entityType: rawData.entityType || "",
    sic: rawData.sic || "",
    sicDescription: rawData.sicDescription || "",
    exchanges: rawData.exchanges || [],
    scrapedAt: new Date().toISOString(),
    totalFilings: filings.length,
    filings,
  };
}

// ============================================================
// EDGAR: Scrape filing list from HTML page
// ============================================================
async function scrapeEdgarHtmlPage(page, company) {
  const filings = [];

  for (const type of CONFIG.filingTypes.slice(0, 3)) { // Limit to top 3 types for HTML
    try {
      const url = `${CONFIG.edgarBase}/cgi-bin/browse-edgar?action=getcompany&CIK=${company.cik}&type=${encodeURIComponent(type)}&dateb=&owner=include&count=20`;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      await randomDelay(1000, 2000);

      const rows = await page.evaluate((companyName, formType) => {
        const results = [];
        const tableRows = document.querySelectorAll("table.tableFile2 tr");

        tableRows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length < 4) return;

          const linkEl = cells[1]?.querySelector("a");
          results.push({
            company: companyName,
            formType: cells[0]?.textContent?.trim() || formType,
            description: cells[2]?.textContent?.trim() || "",
            filingDate: cells[3]?.textContent?.trim() || null,
            detailUrl: linkEl
              ? `https://www.sec.gov${linkEl.getAttribute("href")}`
              : null,
            accessionNumber: linkEl
              ? linkEl.getAttribute("href")?.match(/(\d{10}-\d{2}-\d{6})/)?.[1]
              : null,
            source: "EDGAR_HTML_PAGE",
          });
        });

        return results;
      }, company.name, type);

      filings.push(...rows);
    } catch {}
  }

  return filings;
}

// ============================================================
// EDGAR: Full-text search (EFTS)
// ============================================================
async function scrapeEdgarFullText(page, keyword) {
  const today = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = `${CONFIG.edgarSearch}?q=${encodeURIComponent(`"${keyword}"`)}&dateRange=custom&startdt=${sixMonthsAgo}&enddt=${today}&hits.hits.total.value=true&hits.hits._source=period_of_report,file_date,form_type,entity_name,file_num,biz_location,inc_states`;

  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  const data = await page.evaluate(() => {
    try { return JSON.parse(document.body.innerText); } catch { return null; }
  });

  const results = (data?.hits?.hits || []).map((hit) => ({
    keyword,
    company: hit._source?.entity_name || "",
    formType: hit._source?.form_type || "",
    filingDate: hit._source?.file_date || null,
    periodOfReport: hit._source?.period_of_report || null,
    fileNumber: hit._source?.file_num || "",
    location: hit._source?.biz_location || "",
    incorporatedState: hit._source?.inc_states || "",
    source: "EDGAR_FULLTEXT_SEARCH",
    scrapedAt: new Date().toISOString(),
  }));

  return {
    keyword,
    searchPeriod: { from: sixMonthsAgo, to: today },
    totalFound: data?.hits?.total?.value || results.length,
    results,
  };
}

// ============================================================
// UCC: Scrape a state portal
// NOTE: Each state portal has different HTML — customize selectors
// ============================================================
async function scrapeUCCPortal(page, state, portalUrl, debtorName) {
  await page.goto(portalUrl, { waitUntil: "networkidle2", timeout: 30000 });
  await randomDelay(2000, 4000);

  // Generic attempt to fill search form
  try {
    const inputSelectors = [
      'input[name*="debtor"]',
      'input[name*="name"]',
      'input[id*="debtor"]',
      'input[id*="name"]',
      'input[placeholder*="debtor"]',
      'input[placeholder*="name"]',
      'input[type="text"]:first-of-type',
    ];

    for (const selector of inputSelectors) {
      const input = await page.$(selector);
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type(debtorName, { delay: 80 });
        console.log(`  Typed "${debtorName}" into ${selector}`);
        break;
      }
    }

    // Try to click search/submit
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Search")',
      'a:contains("Search")',
    ];

    for (const selector of submitSelectors) {
      try {
        await page.click(selector);
        break;
      } catch {}
    }

    await wait(3000);
  } catch (err) {
    console.log(`  Could not interact with ${state} portal form:`, err.message);
  }

  // Extract results — generic selectors, customize per state
  const filings = await page.evaluate((term, stateName) => {
    const results = [];

    // Try various table row patterns
    const selectors = [
      "table tr",
      "table.results tr",
      ".result-row",
      ".filing-row",
      "tbody tr",
    ];

    for (const sel of selectors) {
      const rows = document.querySelectorAll(sel);
      if (rows.length < 2) continue;

      rows.forEach((row, idx) => {
        if (idx === 0) return; // Skip header
        const cells = row.querySelectorAll("td");
        if (cells.length < 2) return;

        results.push({
          state: stateName,
          searchTerm: term,
          filingNumber: cells[0]?.textContent?.trim() || "",
          debtorName: cells[1]?.textContent?.trim() || "",
          securedParty: cells[2]?.textContent?.trim() || "",
          filingDate: cells[3]?.textContent?.trim() || "",
          lapseDate: cells[4]?.textContent?.trim() || "",
          collateralType: cells[5]?.textContent?.trim() || "",
          status: cells[6]?.textContent?.trim() || "",
          filingType: "UCC-1",
          source: "UCC_STATE_PORTAL",
          pageUrl: window.location.href,
        });
      });

      if (results.length > 0) break; // Stop if we found results
    }

    return results;
  }, debtorName, state);

  return {
    source: "UCC",
    state,
    portalUrl,
    searchTerm: debtorName,
    scrapedAt: new Date().toISOString(),
    totalFilings: filings.length,
    filings,
  };
}

// ============================================================
// UTILITIES
// ============================================================
async function randomDelay(min = 3000, max = 7000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function dateStr() {
  return new Date().toISOString().replace(/:/g, "-").split(".")[0];
}

// ============================================================
// SCHEDULER
// ============================================================
function scheduleRuns() {
  const intervalMinutes = CONFIG.scrapeInterval / 60000;
  console.log(`Scheduler active — running every ${intervalMinutes} minutes`);
  console.log("Note: SEC EDGAR has a rate limit of 10 requests/second per IP.\n");

  // Run immediately
  main().catch(console.error);

  // Then schedule
  setInterval(() => {
    console.log(`\n[Scheduled run] ${new Date().toISOString()}`);
    main().catch(console.error);
  }, CONFIG.scrapeInterval);
}

scheduleRuns();