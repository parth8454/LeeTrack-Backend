# LeeTrack 🚀

## About The Project
LeeTrack is a production-ready, full-stack web application designed to track LeetCode progress and foster healthy competition among college peers. What started as a personal utility is now a live platform serving active users. It provides them with real-time coding statistics, a global leaderboard, and instant updates on upcoming competitive programming battles.

The platform heavily focuses on performance and seamless UX, utilizing advanced caching mechanisms to bypass third-party API rate limits and deliver zero-delay dashboard loads for concurrent users.

Note - This is an upgrade for *Leetcode-data-fetcher* ----> Find that REPO in my github...

## ✨ Key Features
* **Live Class Leaderboard:** Ranks active users based on total problems solved and points accumulated.
* **Personalized Stats Dashboard:** A visual, custom glassmorphism-styled breakdown of Easy, Medium, and Hard problems.
* **Upcoming Battles:** A dedicated live feed of upcoming LeetCode contests with smart redirection for instant registration.
* **Production-Grade Performance:** Built with an in-memory caching layer to serve data instantly.

## 🛠️ Tech Stack & Architecture
* **Frontend:** React.js, Custom CSS Grid, Vercel
* **Backend:** Node.js, Express.js
* **Database & Caching:** MongoDB, Redis
* **Data Pipeline:** Scheduled backend jobs fetching data via the LeetCode GraphQL API.

## ⚙️ System Design 
To ensure the application scales seamlessly and avoids rate-limiting from external servers, LeeTrack uses a **Hybrid Pull-and-Cache Architecture**:
1. **Scheduled Sync:** Background automation securely fetches fresh contest and user data at specific intervals.
2. **Redis Caching:** The fetched data is stored in Redis with specific TTLs (Time To Live).
3. **Instant Delivery:** When a user accesses the dashboard, the data loads instantly from the cache, completely bypassing the need for redundant external API calls.

## 👨‍💻 Developed By
**Paxton**
building scalable web applications...
