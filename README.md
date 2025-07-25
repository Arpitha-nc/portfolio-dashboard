# Frontend: Dynamic Portfolio Dashboard (Next.js/React)

This is the **frontend application** for your **dynamic stock portfolio dashboard**, built with **Next.js** and **React**. It fetches real-time (simulated) stock data from a backend API, displays overall portfolio summaries, visualizes investment distribution by sector, and presents detailed stock holdings in a responsive table.

---

## 🚀 Features

- **Overall Portfolio Summary**  
  Displays total investment, total present value, and total gain/loss.

- **Sector-wise Investment Distribution**  
  A pie chart visualizes how your investment is allocated across different sectors.

- **Detailed Stock Holdings Table**  
  A comprehensive table showing:

  - Purchase price
  - Quantity
  - Current Market Price (CMP)
  - P/E Ratio (calculated as EPS)
  - Present value
  - Gain/Loss

- **Sector Grouping in Table**  
  Stocks are grouped under their respective sector headers within the table, with sector-level summaries shown.

- **Real-time Data Refresh**  
  Automatically fetches updated data from the backend every **15 seconds**.

- **Responsive Design**  
  Optimized for mobile, tablet, and desktop screens.

- **Loading and Error States**  
  Clear feedback during data loading and on API failure.

- **Indian Rupee (₹) Currency**  
  All monetary values are displayed in INR.

---

## 🛠️ Technologies Used

| Purpose       | Technology                    |
| ------------- | ----------------------------- |
| Framework     | [Next.js](https://nextjs.org) |
| UI Library    | React                         |
| Styling       | Tailwind CSS                  |
| Table Utility | `@tanstack/react-table`       |
| Charts        | `recharts`                    |
| Language      | TypeScript                    |

---

## 📦 Setup and Installation

### ✅ Prerequisites

- [Node.js (LTS)](https://nodejs.org) and `npm` or `yarn`
- Backend API running and accessible (e.g., `http://localhost:8000`)

### 📂 Steps

1. Clone the repository and navigate to the frontend directory:

   ```bash
   cd frontend
   Install dependencies:
   ```

bash
Copy
Edit
npm install

# or

yarn install
Run the development server:

bash
Copy
Edit
npm run dev

# or

yarn dev
Open your browser and visit http://localhost:3000

🗂️ Project Structure
graphql
Copy
Edit
frontend/
├── public/
├── src/
│ ├── app/
│ │ ├── components/
│ │ │ ├── CustomPieChartLegend.tsx # Custom legend for the pie chart
│ │ │ ├── PortfolioDistributionChart.tsx# Pie chart component
│ │ │ └── PortfolioTable.tsx # Re-usable table component
│ │ ├── lib/
│ │ │ └── api.ts # API utility functions (e.g., getPortfolioData)
│ │ ├── interfaces/
│ │ │ └── portfolio.ts # TypeScript interfaces for data structures
│ │ └── page.tsx # Main dashboard page
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
📈 Usage
Once the frontend server is running:

Open your browser and navigate to: http://localhost:3000

The dashboard will fetch portfolio data from your backend API.

The data refreshes every 15 seconds automatically.

# Backend: Portfolio Data API (Node.js/Express)

This is the **backend API** for the **Dynamic Portfolio Dashboard**, built with **Node.js** and **Express**. It serves simulated stock portfolio data, including overall summaries, individual stock details, and sector-wise aggregations.

---

## 🚀 Features

- **`/portfolio` endpoint**: Serves structured JSON portfolio data.
- **Sample data**: Includes overall portfolio summary, individual stock entries, and sector-level breakdowns.
- **CORS configured**: Allows requests from frontend (e.g., `http://localhost:3000`).

---

## 🛠️ Technologies Used

| Purpose       | Technology     |
| ------------- | -------------- |
| Runtime       | Node.js        |
| Web Framework | Express.js     |
| CORS Handling | `cors` package |

---

## ⚙️ Setup and Installation

### ✅ Prerequisites

- [Node.js (LTS)](https://nodejs.org) and `npm` or `yarn` installed.

### 📂 Installation Steps

1. Navigate to the backend directory:

   ```bash
   cd backend

   ```

npm init -y
Install dependencies:

npm install express cors

# or

yarn add express cors

Start the server:

node server.js

# or

yarn start
Visit http://localhost:5000/portfolio to see the API response.

📡 API Endpoints
GET /portfolio
Description: Returns the complete simulated stock portfolio data.

Response: JSON object with:

overall: Total investment summary.

stocks: Array of individual stock data.

sectors: Sector-wise breakdown.
