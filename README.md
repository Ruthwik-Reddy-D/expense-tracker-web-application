# ExpenseFlow

ExpenseFlow is a full-stack expense tracker built with HTML, CSS, JavaScript, Node.js, MongoDB, and JWT authentication. Users can log in, record daily expenses and income, filter by time period, and view charts for a quick overview.

## Features
- JWT-based authentication (register/login)
- Expense tracking with daily/weekly/monthly filters
- Income tracking with quick add form
- Summary insights (total expenses, total income, savings)
- Chart visualizations with Chart.js

## Live Demo
Add your live demo URL here after deployment: **[https://your-demo-link.com](https://your-demo-link.com)**

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (local or Atlas)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example`.
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWTs
- `PORT`: Server port (defaults to 3000)

## Next Steps
- Add AI chatbot for expense summaries
- Deploy to Render/Netlify + MongoDB Atlas

## Deployment (Render + MongoDB Atlas)
1. Create a free MongoDB Atlas cluster and copy the connection string.
2. Create a new Render Web Service from this GitHub repo.
3. Set environment variables in Render:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a strong random secret
   - `PORT` = 3000
4. Deploy. When complete, copy the Render URL and update the Live Demo link above.
