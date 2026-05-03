const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const COOKIES_PATH = path.join(__dirname, "sec_cookies.json");

/**
 * SEC/EDGAR & UCC Filing Scraper with Date Filtering
 * Scrapes company filings from SEC EDGAR and UCC filings until a target date
 */
async function main() {
  try {
    // SET YOUR TARGET DATE HERE (YYYY-MM-DD format)
    const TARGET_DATE = "2024-01-01";

    console.log(`Scraping SEC/UCC filings until: ${TARGET_DATE}`);
    const targetDateTime = new Date(TARGET_DATE);

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--window-size=1366,768"],
      userDataDir: path.join(__dirname, "chrome_user_data"),
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // ============================================================
    // COMPANIES / CIK NUMBERS TO SCRAPE FROM SEC EDGAR
    // CIK = Central Index Key (unique company identifier on EDGAR)
    // ============================================================
    const companiesToScrape = [
      { name: "Apple Inc", cik: "0000320193" },
      { name: "Tesla Inc", cik: "0001318605" },
      // { name: "Microsoft Corp", cik: "0000789019" },
      // { name: "Amazon", cik: "0001018724" },
      // { name: "Alphabet Google", cik: "0001652044" },
      // { name: "Meta Platforms", cik: "0001326801" },
      // { name: "Nvidia Corp", cik: "0001045810" },
      // { name: "Berkshire Hathaway", cik: "0001067983" },
      // { name: "JPMorgan Chase", cik: "0000019617" },
      // { name: "Exxon Mobil", cik: "0000034088" },
    ];

    // ============================================================
    // UCC FILING SEARCH TERMS (debtor names or company names)
    // UCC scraped from: https://www.ucc.gov or state portals
    // ============================================================
    const uccSearchTerms = [
      // "Tesla Motors",
      // "SpaceX",
      // "Apple Inc",
    ];

    // Filing types to scrape from EDGAR
    const FILING_TYPES = [
      "10-K",   // Annual report
      "10-Q",   // Quarterly report
      "8-K",    // Current report (material events)
      // "S-1",    // IPO registration
      // "DEF 14A", // Proxy statement
      // "4",      // Insider transactions
      // "SC 13G", // Beneficial ownership > 5%
      // "SC 13D", // Activist beneficial ownership
    ];

    const allFilingsData = [];

    // ============================================================
    // SCRAPE SEC EDGAR FILINGS
    // ============================================================
    for (const company of companiesToScrape) {
      await randomDelay();
      console.log(`\nScraping SEC filings for: ${company.name} (CIK: ${company.cik})`);

      const companyFilings = [];

      for (const filingType of FILING_TYPES) {
        console.log(`  Fetching ${filingType} filings...`);

        // EDGAR full-text search API endpoint
        const edgarUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${company.cik}&type=${encodeURIComponent(filingType)}&dateb=&owner=include&count=40&search_text=`;

        try {
          await page.goto(edgarUrl, { waitUntil: "networkidle2", timeout: 60000 });
          await randomDelay(2000, 4000);

          const filings = await extractEdgarFilings(page, company.name, filingType);

          // Filter by target date
          const filteredFilings = filings.filter((f) => {
            if (!f.filingDate) return true;
            return new Date(f.filingDate) >= targetDateTime;
          });

          console.log(
            `    Found ${filings.length} total, ${filteredFilings.length} after ${TARGET_DATE}`
          );

          companyFilings.push(...filteredFilings);
        } catch (err) {
          console.error(`    Error fetching ${filingType} for ${company.name}:`, err.message);
        }
      }

      // Also try EDGAR JSON API for recent filings
      try {
        console.log(`  Fetching via EDGAR JSON submissions API...`);
        const submissionsUrl = `https://data.sec.gov/submissions/CIK${company.cik}.json`;
        await page.goto(submissionsUrl, { waitUntil: "networkidle2", timeout: 30000 });

        const jsonData = await page.evaluate(() => {
          try {
            return JSON.parse(document.body.innerText);
          } catch {
            return null;
          }
        });

        if (jsonData && jsonData.filings && jsonData.filings.recent) {
          const recent = jsonData.filings.recent;
          const jsonFilings = [];

          for (let i = 0; i < (recent.form || []).length; i++) {
            const filingDate = recent.filingDate?.[i];
            if (filingDate && new Date(filingDate) < targetDateTime) continue;

            if (FILING_TYPES.includes(recent.form?.[i])) {
              jsonFilings.push({
                company: company.name,
                cik: company.cik,
                filingType: recent.form?.[i],
                filingDate: filingDate,
                accessionNumber: recent.accessionNumber?.[i],
                primaryDocument: recent.primaryDocument?.[i],
                description: recent.primaryDocDescription?.[i] || "",
                fileUrl: recent.accessionNumber?.[i]
                  ? `https://www.sec.gov/Archives/edgar/data/${parseInt(company.cik)}/${recent.accessionNumber[i].replace(/-/g, "")}/`
                  : null,
                source: "EDGAR_JSON_API",
              });
            }
          }

          console.log(`    JSON API: ${jsonFilings.length} filings from ${TARGET_DATE}`);
          companyFilings.push(...jsonFilings);
        }
      } catch (err) {
        console.error(`  Error fetching JSON submissions for ${company.name}:`, err.message);
      }

      allFilingsData.push({
        source: "SEC_EDGAR",
        company: company.name,
        cik: company.cik,
        scrapedUntil: TARGET_DATE,
        totalFilings: companyFilings.length,
        filings: companyFilings,
      });

      console.log(`Completed ${company.name}: ${companyFilings.length} total filings`);
    }

    // ============================================================
    // SCRAPE EDGAR FULL-TEXT SEARCH (EFTS)
    // Useful for keyword-based filing search
    // ============================================================
    const keywordSearches = [
      // "artificial intelligence",
      // "cryptocurrency bitcoin",
      // "data breach cybersecurity",
    ];

    for (const keyword of keywordSearches) {
      console.log(`\nSearching EDGAR full text for: "${keyword}"`);
      const eftsUrl = `https://efts.sec.gov/LATEST/search-index?q="${encodeURIComponent(keyword)}"&dateRange=custom&startdt=${TARGET_DATE}&enddt=${new Date().toISOString().split("T")[0]}&hits.hits._source=period_of_report,file_date,form_type,entity_name,file_num`;

      try {
        await page.goto(eftsUrl, { waitUntil: "networkidle2", timeout: 30000 });
        const results = await page.evaluate(() => {
          try { return JSON.parse(document.body.innerText); } catch { return null; }
        });

        if (results?.hits?.hits) {
          const keywordFilings = results.hits.hits.map((hit) => ({
            keyword,
            company: hit._source?.entity_name,
            formType: hit._source?.form_type,
            filingDate: hit._source?.file_date,
            periodOfReport: hit._source?.period_of_report,
            source: "EDGAR_FULL_TEXT_SEARCH",
          }));

          allFilingsData.push({
            source: "EDGAR_FULLTEXT",
            keyword,
            totalResults: keywordFilings.length,
            filings: keywordFilings,
          });
        }
      } catch (err) {
        console.error(`Error in EDGAR full text search for "${keyword}":`, err.message);
      }
    }

    // ============================================================
    // SCRAPE UCC FILINGS
    // Note: UCC filings are state-level; this scrapes common portals
    // ============================================================
    for (const searchTerm of uccSearchTerms) {
      await randomDelay();
      console.log(`\nScraping UCC filings for: ${searchTerm}`);

      try {
        // Example: California UCC Search (Secretary of State)
        const uccUrl = `https://www.sos.ca.gov/business/ucc/ucc-search?debtorName=${encodeURIComponent(searchTerm)}`;
        await page.goto(uccUrl, { waitUntil: "networkidle2", timeout: 30000 });

        const uccFilings = await extractUCCFilings(page, searchTerm);

        const filteredUCC = uccFilings.filter((f) => {
          if (!f.filingDate) return true;
          return new Date(f.filingDate) >= targetDateTime;
        });

        allFilingsData.push({
          source: "UCC_CA_SOS",
          searchTerm,
          totalFilings: filteredUCC.length,
          filings: filteredUCC,
        });

        console.log(`  UCC results for "${searchTerm}": ${filteredUCC.length} filings`);
      } catch (err) {
        console.error(`  Error scraping UCC for ${searchTerm}:`, err.message);
      }
    }

    // ============================================================
    // SAVE ALL DATA
    // ============================================================
    const outputFileName = `sec_ucc_filings_until_${TARGET_DATE.replace(/-/g, "_")}.json`;
    fs.writeFileSync(outputFileName, JSON.stringify(allFilingsData, null, 2));
    console.log(`\nAll data saved to: ${outputFileName}`);

    // Print summary
    console.log("\n=== SCRAPING SUMMARY ===");
    allFilingsData.forEach((entry) => {
      const label = entry.company || entry.searchTerm || entry.keyword || "unknown";
      console.log(`[${entry.source}] ${label}: ${entry.totalFilings || entry.filings?.length || 0} filings`);
    });

    // await browser.close();
  } catch (error) {
    console.error("Fatal error during scraping:", error);
  }
}

/**
 * Extract filings from an EDGAR filing list page (HTML table)
 */
async function extractEdgarFilings(page, companyName, filingType) {
  try {
    const filings = await page.evaluate((company, type) => {
      const results = [];
      const rows = document.querySelectorAll("table.tableFile2 tr");

      rows.forEach((row) => {
        try {
          const cells = row.querySelectorAll("td");
          if (cells.length < 4) return;

          const filingTypeCell = cells[0]?.textContent?.trim();
          const dateCell = cells[3]?.textContent?.trim();
          const linkEl = cells[1]?.querySelector("a");

          if (!filingTypeCell || !dateCell) return;

          results.push({
            company,
            filingType: filingTypeCell,
            description: cells[2]?.textContent?.trim() || "",
            filingDate: dateCell,
            detailUrl: linkEl ? `https://www.sec.gov${linkEl.getAttribute("href")}` : null,
            source: "EDGAR_HTML",
          });
        } catch {}
      });

      return results;
    }, companyName, filingType);

    return filings;
  } catch (error) {
    console.error("Error extracting EDGAR filings:", error);
    return [];
  }
}

/**
 * Extract UCC filings from a state portal page
 * NOTE: Each state has a different portal structure — customize selectors per state
 */
async function extractUCCFilings(page, searchTerm) {
  try {
    const filings = await page.evaluate((term) => {
      const results = [];

      // Generic selector attempt — will vary by state portal
      const rows = document.querySelectorAll("table tr, .filing-row, .result-row");

      rows.forEach((row) => {
        try {
          const cells = row.querySelectorAll("td");
          if (cells.length < 2) return;

          results.push({
            searchTerm: term,
            filingNumber: cells[0]?.textContent?.trim() || "",
            debtorName: cells[1]?.textContent?.trim() || "",
            securedParty: cells[2]?.textContent?.trim() || "",
            filingDate: cells[3]?.textContent?.trim() || "",
            expirationDate: cells[4]?.textContent?.trim() || "",
            filingType: cells[5]?.textContent?.trim() || "UCC-1",
            status: cells[6]?.textContent?.trim() || "",
            source: "UCC_STATE_PORTAL",
          });
        } catch {}
      });

      return results;
    }, searchTerm);

    return filings;
  } catch (error) {
    console.error("Error extracting UCC filings:", error);
    return [];
  }
}

async function randomDelay(min = 3000, max = 7000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

main();