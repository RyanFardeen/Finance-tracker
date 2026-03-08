# Setup Guide - Personal Finance Tracker

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

Navigate to the project directory and install all required packages:

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Recharts (for charts)
- Lucide React (for icons)
- jsPDF (for PDF export)
- date-fns (for date handling)

### 2. Run Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Dashboard (home page)
│   ├── layout.tsx               # Root layout with theme provider
│   ├── globals.css              # Global styles
│   ├── income/                  # Income tracker page
│   ├── expenses/                # Expense tracker page
│   ├── investments/             # Investment tracker page
│   ├── transactions/            # Transaction history page
│   ├── analytics/               # Analytics dashboard page
│   └── reports/
│       ├── monthly/             # Monthly reports page
│       └── yearly/              # Yearly reports page
├── components/                   # React components
│   ├── Sidebar.tsx              # Navigation sidebar
│   └── ThemeProvider.tsx        # Dark mode context provider
├── lib/                         # Utility libraries
│   ├── types.ts                 # TypeScript type definitions
│   ├── storage.ts               # LocalStorage utilities
│   ├── calculations.ts          # Financial calculations
│   └── pdfExport.ts             # PDF export functionality
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Project dependencies
```

## Features Overview

### 1. Dashboard
- Overview of total income, expenses, savings, and investments
- Net worth calculation
- Monthly summaries
- Recent transactions list

### 2. Income Tracker
- Add income from multiple sources (Salary, Business, Passive, Other)
- Edit and delete income entries
- View total income
- Track income by date

### 3. Expense Tracker
- Log expenses with categories (Food, Rent, Travel, Shopping, Bills, etc.)
- Edit and delete expense entries
- View total expenses
- Track spending patterns

### 4. Investment Tracker
- Track investments by type (Stocks, Mutual Funds, Gold, Real Estate, etc.)
- View portfolio breakdown by category
- Monitor total investment value
- Percentage allocation display

### 5. Transaction History
- View all transactions in one place
- Filter by type (Income/Expense/Investment)
- Filter by category
- Filter by date range
- Search functionality
- Export to CSV

### 6. Analytics Dashboard
- Income vs Expenses bar chart (last 12 months)
- Savings growth line chart
- Expense breakdown pie chart
- Income sources pie chart
- Investment portfolio pie chart

### 7. Monthly Reports
- Select any month and year
- View detailed monthly summary
- Income, expenses, savings, and investments breakdown
- Net wealth change indicator
- Transaction list for the month
- Export to PDF

### 8. Yearly Reports
- Select any year
- Annual totals for all categories
- Month-by-month breakdown table
- Net savings calculation
- Export to PDF

### 9. Dark Mode
- Automatic system preference detection
- Manual toggle in sidebar
- Smooth transitions
- Consistent across all pages

### 10. Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Adaptive layouts

## Data Storage

The application uses **browser LocalStorage** for data persistence:
- All data is stored locally in your browser
- No backend server required
- Data persists across sessions
- Private and secure (never leaves your device)

### Data Backup

To backup your data:
1. Go to **Transactions** page
2. Click **Export CSV** to download all transactions
3. Save the CSV file in a safe location

To restore data:
- Currently, you need to manually re-enter transactions
- Future versions may include CSV import functionality

## Usage Tips

### Adding Transactions

1. Navigate to the appropriate page (Income/Expenses/Investments)
2. Click the "Add" button
3. Fill in the form:
   - Select category
   - Enter amount
   - Choose date
   - Add notes (optional)
4. Click "Add" to save

### Editing Transactions

1. Find the transaction in the list
2. Click the edit icon (pencil)
3. Modify the details
4. Click "Update" to save changes

### Deleting Transactions

1. Find the transaction in the list
2. Click the delete icon (trash)
3. Confirm deletion

### Viewing Reports

**Monthly Reports:**
1. Go to Reports → Monthly Reports
2. Select month and year
3. View summary and transactions
4. Click "Export PDF" to download

**Yearly Reports:**
1. Go to Reports → Yearly Reports
2. Select year
3. View annual summary and monthly breakdown
4. Click "Export PDF" to download

### Using Filters

On the Transactions page:
1. Use the search box to find specific transactions
2. Filter by type (All/Income/Expense/Investment)
3. Filter by category
4. Set date range (start and end dates)
5. Filters work together for precise results

### Exporting Data

**CSV Export:**
- Go to Transactions page
- Apply any filters if needed
- Click "Export CSV"
- File downloads with current date in filename

**PDF Export:**
- Available on Monthly and Yearly Reports pages
- Click "Export PDF" button
- PDF includes all report data and transactions

## Troubleshooting

### Application won't start
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Data not persisting
- Check if browser allows LocalStorage
- Ensure you're not in private/incognito mode
- Check browser storage settings

### Charts not displaying
- Ensure you have added some transactions
- Check browser console for errors
- Try refreshing the page

### Dark mode not working
- Check if browser supports dark mode
- Try manually toggling in sidebar
- Clear browser cache

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- The app stores all data in LocalStorage (5-10MB limit)
- For best performance, keep transactions under 10,000 entries
- Regularly export and archive old data
- Clear browser cache if app becomes slow

## Security Notes

- All data is stored locally in your browser
- No data is sent to any server
- No authentication required
- Data is private to your browser/device
- Use browser's built-in security features
- Consider using a password manager for device security

## Future Enhancements

Potential features for future versions:
- CSV import functionality
- Budget planning and alerts
- Recurring transactions
- Multi-currency support
- Cloud backup options
- Mobile app version
- Bill reminders
- Financial goals tracking

## Support

For issues or questions:
1. Check this documentation
2. Review the README.md file
3. Check browser console for errors
4. Open an issue on GitHub

## License

This project is open source and available under the MIT License.

---

**Happy tracking! 💰**