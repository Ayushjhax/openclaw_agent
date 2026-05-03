const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const COOKIES_PATH = path.join(__dirname, "twitter_cookies.json");

/**
 * Twitter Data Scraper with Date Filtering
 * This script logs into Twitter and scrapes post data from specified accounts until a target date
 */
async function main() {
  try {
    // SET YOUR TARGET DATE HERE (YYYY-MM-DD format)
    // The scraper will get all posts from now until this date
    const TARGET_DATE = "2024-01-01"; // Change this to your desired date

    console.log(`Scraping posts until: ${TARGET_DATE}`);
    const targetDateTime = new Date(TARGET_DATE);

    // Launch browser with visible UI and reasonable window size
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--window-size=1366,768"],
      userDataDir: path.join(__dirname, "chrome_user_data"),
    });

    const page = await browser.newPage();

    let loggedIn = false;

    if (fs.existsSync(COOKIES_PATH)) {
      console.log("Found saved cookies, attempting to use existing session...");
      const cookiesString = fs.readFileSync(COOKIES_PATH);
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);

      // Go to Twitter home to check if we're logged in
      await page.goto("https://x.com/home", { waitUntil: "networkidle2" });

      // Check if we are logged in by looking for elements that only appear when logged in
      loggedIn = await page.evaluate(() => {
        // Look for elements that indicate we're logged in
        return (
          !!document.querySelector('a[data-testid="AppTabBar_Home_Link"]') ||
          !!document.querySelector(
            'a[data-testid="SideNav_NewTweet_Button"]'
          ) ||
          !!document.querySelector('div[data-testid="tweetButtonInline"]')
        );
      });

      console.log(
        loggedIn
          ? "Successfully logged in with saved cookies"
          : "Cookies expired, need to log in again"
      );
    }

    if (!loggedIn) {
      // Go to Twitter login page
      console.log("Navigating to Twitter login page...");
      await page.goto("https://x.com/i/flow/login", {
        waitUntil: "networkidle2",
      });

      // Enter username
      console.log("Entering username...");
      await page.waitForSelector('input[autocomplete="username"]');
      await page.type('input[autocomplete="username"]', "k84489567@gmail.com", {
        delay: 200,
      });

      // Click next button
      const nextButtons = await page.$$('button[role="button"]');
      let nextButtonFound = false;

      for (const button of nextButtons) {
        const buttonText = await page.evaluate((el) => el.textContent, button);
        if (buttonText && buttonText.includes("Next")) {
          await button.click();
          nextButtonFound = true;
          console.log("Next button clicked");
          break;
        }
      }

      // Enter password
      console.log("Entering password...");
      await page.waitForSelector('input[name="password"]');
      await page.type('input[name="password"]', "8920560393", { delay: 200 });

      // Click login button
      const nextButtons1 = await page.$$('button[role="button"]');

      for (const button of nextButtons1) {
        const buttonText = await page.evaluate((el) => el.textContent, button);
        if (buttonText && buttonText.includes("Log in")) {
          await button.click();
          nextButtonFound = true;
          console.log("Log in button clicked");
          break;
        }
      }

      // Wait for login to complete
      console.log("Logging in...");
      await randomDelay();

      const cookies = await page.cookies();
      fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
      console.log("Cookies saved for future sessions");
    }

    // Array of accounts to scrape
    const accountsToScrape = [
      // "realDonaldTrump",
      "elonmusk",
      // "aeyakovenko",
      // "rajgokal",
      // "solana",
      // "jupiter",
      // "weremeow",
      // "cz_binance",
      // "brian_armstrong",
      // "VitalikButerin",
      // "pompbitcoin",
      // "superteam",
      // "mSOLana",
      // "orca_so",
      // "raydium_io",
      // "stepfinance_",
      // "saber_hq",
      // "helium",
      // "jito_sol",
      // "phantom",
      // "TheSolanaBoss",
      // "SolanaLegend",
      // "solendprotocol",
      // "DriftProtocol",
      // "marginfi",
      // "SolanaFndn",
      // "laine_sa_",
      // "SOLBigBrain",
      // "AnsemCrypto",
      // "garyvee",
    ];

    const allPostsData = [];

    // Process each account
    for (let i = 0; i < accountsToScrape.length; i++) {
      await randomDelay();
      const account = accountsToScrape[i];

      console.log(`Navigating to ${account}'s profile...`);
      await page.goto(`https://x.com/${account}`, {
        waitUntil: "networkidle2",
      });

      // Get account details
      const accountData = await extractAccountDetails(page);
      console.log(`Scraping posts for ${account} until ${TARGET_DATE}...`);

      // Create a set to track post URLs we've already seen
      const seenPostUrls = new Set();
      const allAccountPosts = [];
      let reachedTargetDate = false;
      let scrollCount = 0;
      let noNewPostsCount = 0;
      const maxNoNewPosts = 5; // Stop if no new posts found for 5 consecutive scrolls

      while (!reachedTargetDate && noNewPostsCount < maxNoNewPosts) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise((resolve) => setTimeout(resolve, 2000));
        scrollCount++;

        // Extract new posts
        const newPosts = await extractPostsData(page, account);

        // Filter out duplicates and add only new posts
        const uniqueNewPosts = newPosts.filter((post) => {
          // If post has no URL, use timestamp as identifier
          const identifier = post.postUrl || post.timestamp;
          if (!identifier || seenPostUrls.has(identifier)) {
            return false;
          }

          // Add to seen set and return true to keep this post
          seenPostUrls.add(identifier);
          return true;
        });

        if (uniqueNewPosts.length === 0) {
          noNewPostsCount++;
          console.log(
            `No new posts found (${noNewPostsCount}/${maxNoNewPosts})`
          );
        } else {
          noNewPostsCount = 0; // Reset counter when we find new posts
        }

        // Check if any of the new posts are older than our target date
        for (const post of uniqueNewPosts) {
          if (post.timestamp) {
            const postDate = new Date(post.timestamp);
            if (postDate < targetDateTime) {
              console.log(`Reached target date! Post from: ${post.timestamp}`);
              reachedTargetDate = true;
              // Still add this post since it might be exactly on the target date
              allAccountPosts.push(post);
              break;
            }
            allAccountPosts.push(post);
          } else {
            // If no timestamp, add the post anyway
            allAccountPosts.push(post);
          }
        }

        console.log(
          `Scroll ${scrollCount}: Found ${uniqueNewPosts.length} new posts (total: ${allAccountPosts.length})`
        );

        if (scrollCount % 5 === 0 && scrollCount > 0) {
          console.log("Taking a longer pause to ensure content loads...");
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        // Safety check to prevent infinite scrolling
        if (scrollCount > 200) {
          console.log("Reached maximum scroll limit (200 scrolls)");
          break;
        }
      }

      // Filter posts to only include those newer than or equal to target date
      const filteredPosts = allAccountPosts.filter((post) => {
        if (!post.timestamp) return true; // Keep posts without timestamp
        const postDate = new Date(post.timestamp);
        return postDate >= targetDateTime;
      });

      console.log(
        `Filtered ${allAccountPosts.length} posts to ${filteredPosts.length} posts (from ${TARGET_DATE} onwards)`
      );

      // Add the account's data to our full collection
      allPostsData.push({
        account: account,
        accountDetails: accountData,
        posts: filteredPosts,
        scrapingInfo: {
          targetDate: TARGET_DATE,
          totalScrolls: scrollCount,
          reachedTargetDate: reachedTargetDate,
          totalPostsFound: allAccountPosts.length,
          filteredPostsCount: filteredPosts.length,
        },
      });

      console.log(
        `Completed scraping for ${account}. Posts from ${TARGET_DATE}: ${filteredPosts.length}`
      );
    }

    // Save data to JSON file with date in filename
    const outputFileName = `twitter_data_until_${TARGET_DATE.replace(
      /-/g,
      "_"
    )}.json`;
    fs.writeFileSync(outputFileName, JSON.stringify(allPostsData, null, 2));
    console.log(`All data fetched successfully and saved to ${outputFileName}`);

    // Print summary
    console.log("\n=== SCRAPING SUMMARY ===");
    allPostsData.forEach((accountData) => {
      console.log(
        `${accountData.account}: ${accountData.posts.length} posts (${accountData.scrapingInfo.totalScrolls} scrolls)`
      );
    });

    // Keep browser open for manual review (optional)
    // await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error);
  }
}

/**
 * Extract account details
 */
async function extractAccountDetails(page) {
  try {
    // Extract follower count, following count, etc.
    const accountDetails = await page.evaluate(() => {
      const headerElement = document.querySelector(
        'div[data-testid="UserProfileHeader_Items"]'
      );
      const bioElement = document.querySelector(
        'div[data-testid="UserDescription"]'
      );

      return {
        bio: bioElement ? bioElement.textContent : "",
        headerInfo: headerElement ? headerElement.textContent : "",
        // You can add more specific account details as needed
      };
    });

    return accountDetails;
  } catch (error) {
    console.error("Error extracting account details:", error);
    return {};
  }
}

/**
 * Extract data from all posts on the page
 */
async function extractPostsData(page, accountName) {
  try {
    const postsData = await page.evaluate((currentAccountName) => {
      const posts = [];
      const articleElements = document.querySelectorAll(
        'article[data-testid="tweet"]'
      );

      articleElements.forEach((article) => {
        try {
          // Extract timestamp
          const timeElement = article.querySelector("time");
          const timestamp = timeElement
            ? timeElement.getAttribute("datetime")
            : null;
          const displayTime = timeElement ? timeElement.textContent : null;

          // Extract post URL
          const linkElement = article.querySelector('a[href*="/status/"]');
          const postUrl = linkElement ? linkElement.getAttribute("href") : null;

          // Extract the account name from post URL
          let postAccountName = "";
          let isRepost = false;

          if (postUrl) {
            // Extract account name from URL pattern: /accountname/status/id
            const urlMatch = postUrl.match(/^\/([^\/]+)\/status\/\d+/);
            if (urlMatch) {
              postAccountName = urlMatch[1];
              // Check if this is a repost by comparing account names
              isRepost =
                postAccountName.toLowerCase() !==
                currentAccountName.toLowerCase();
            }
          }

          // Extract engagement stats
          const statsDiv =
            article.querySelector('div[aria-label*="replies"]') ||
            article.querySelector('div[aria-label*="likes"]') ||
            article.querySelector('div[role="group"]');

          let statsText = statsDiv ? statsDiv.getAttribute("aria-label") : "";

          // Parse stats
          let replies = 0,
            reposts = 0,
            likes = 0,
            bookmarks = 0,
            views = 0;

          if (statsText) {
            // Extract numbers using regex
            const repliesMatch = statsText.match(/(\d+,?\d*)\s+repl/);
            const repostsMatch = statsText.match(/(\d+,?\d*)\s+repost/);
            const likesMatch = statsText.match(/(\d+,?\d*)\s+like/);
            const bookmarksMatch = statsText.match(/(\d+,?\d*)\s+bookmark/);
            const viewsMatch = statsText.match(/(\d+,?\d*)\s+view/);

            replies = repliesMatch ? repliesMatch[1].replace(",", "") : 0;
            reposts = repostsMatch ? repostsMatch[1].replace(",", "") : 0;
            likes = likesMatch ? likesMatch[1].replace(",", "") : 0;
            bookmarks = bookmarksMatch ? bookmarksMatch[1].replace(",", "") : 0;
            views = viewsMatch ? viewsMatch[1].replace(",", "") : 0;
          }

          // Extract post content
          const tweetTextElement = article.querySelector(
            'div[data-testid="tweetText"]'
          );
          let tweetText = tweetTextElement
            ? tweetTextElement.innerText.trim()
            : "";

          // If it's a repost, modify the tweet text to show attribution
          let tweetTextBy = "";
          if (isRepost && tweetText && postAccountName) {
            tweetTextBy = `${tweetText} - by @${postAccountName}`;
          }

          posts.push({
            timestamp,
            displayTime,
            postUrl,
            tweetText,
            tweetTextBy,
            originalAuthor: postAccountName,
            isRepost,
            engagement: {
              replies: parseInt(replies) || 0,
              reposts: parseInt(reposts) || 0,
              likes: parseInt(likes) || 0,
              bookmarks: parseInt(bookmarks) || 0,
              views: parseInt(views) || 0,
            },
            rawStatsText: statsText,
          });
        } catch (err) {
          console.log("Error processing individual post:", err);
        }
      });

      return posts;
    }, accountName); // Pass accountName as parameter to page.evaluate

    // Add the account name to each post
    return postsData.map((post) => {
      post.accountName = accountName;
      return post;
    });
  } catch (error) {
    console.error("Error extracting posts data:", error);
    return [];
  }
}

async function randomDelay(min = 4000, max = 8000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

main();