# Personal Finance Tracker 💰

A modern, responsive web application for tracking your personal finances including income, expenses, savings, investments, and overall wealth portfolio.

## Features

### Core Modules

1. **Dashboard** - Overview of your financial health
   - Total income, expenses, savings, and investments
   - Net worth calculation
   - Monthly summaries
   - Recent transactions

2. **Income Tracker** - Track multiple income sources
   - Salary, Business, Passive, and Other income
   - Monthly and yearly tracking
   - Lifetime income overview

3. **Expense Tracker** - Log and categorize expenses
   - Categories: Food, Rent, Travel, Shopping, Bills, Entertainment, Healthcare, Education, Other
   - Monthly and yearly expense summaries
   - Total expense tracking

4. **Investment Tracker** - Monitor your investment portfolio
   - Stocks, Mutual Funds, Gold, Real Estate, Fixed Deposits, Crypto, Other
   - Investment breakdown by category
   - Total portfolio value

5. **Savings Calculator** - Automatic calculation
   - Savings = Total Income - Total Expenses
   - Monthly, yearly, and lifetime savings

6. **Transaction History** - Complete transaction log
   - Filter by date and category
   - Search functionality
   - Edit and delete transactions

7. **Monthly Reports** - Detailed monthly analysis
   - Income vs expenses
   - Savings and investments
   - Net wealth change

8. **Yearly Reports** - Annual financial overview
   - Year-over-year comparison
   - Custom date range filtering

9. **Analytics Dashboard** - Visual insights
   - Income vs expense charts
   - Savings growth timeline
   - Investment allocation pie chart
   - Expense category breakdown

10. **Dark Mode** - Eye-friendly interface
    - Automatic theme detection
    - Manual toggle option

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **PDF Export**: jsPDF
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Google Cloud Console account (for OAuth)

### Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for a rapid setup guide.

### Detailed Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd EXPENSE\ TRACKER
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Database - Neon PostgreSQL
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NODE_ENV="development"
```

4. **Set up the database:**
```bash
npm run db:push
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

You'll be redirected to the sign-in page. Create an account or sign in with Google.

### Authentication Setup

For detailed authentication setup instructions, see [AUTHENTICATION.md](./AUTHENTICATION.md).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                        # Next.js app directory
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── [...nextauth]/ # NextAuth API route
│   │   │   └── register/      # User registration
│   │   └── transactions/      # Transaction CRUD operations
│   ├── auth/                  # Authentication pages
│   │   ├── signin/            # Sign in page
│   │   └── signup/            # Sign up page
│   ├── page.tsx              # Dashboard page
│   ├── income/               # Income tracker
│   ├── expenses/             # Expense tracker
│   ├── investments/          # Investment tracker
│   ├── transactions/         # Transaction history
│   ├── analytics/            # Charts and analytics
│   ├── reports/              # Monthly and yearly reports
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── SidebarWrapper.tsx    # Client-side sidebar wrapper
│   ├── ThemeProvider.tsx     # Dark mode provider
│   └── SessionProvider.tsx   # NextAuth session provider
├── lib/                      # Utility functions
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Prisma client
│   ├── types.ts             # TypeScript types
│   ├── storage.ts           # LocalStorage utilities
│   ├── calculations.ts      # Financial calculations
│   └── pdfExport.ts         # PDF generation
├── prisma/                   # Database schema
│   └── schema.prisma        # Prisma schema
├── public/                   # Static assets
├── middleware.ts             # Route protection
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── README.md                 # This file
├── SETUP.md                  # Detailed setup guide
├── QUICKSTART.md             # Quick start guide
└── AUTHENTICATION.md         # Authentication setup guide
```

## Features in Detail

### Authentication & Security
- **Google OAuth**: Sign in with your Google account
- **Email/Password**: Traditional credentials-based authentication
- **Secure Sessions**: JWT-based session management
- **Password Hashing**: bcrypt with 12 rounds
- **Protected Routes**: Automatic redirect to sign-in for unauthenticated users
- **User Isolation**: Each user can only access their own data

### Data Storage
- **PostgreSQL Database**: Reliable, scalable data storage
- **Prisma ORM**: Type-safe database queries
- **User-specific Data**: All transactions are tied to authenticated users
- **Data Persistence**: Secure cloud storage via Neon
- **Export Options**: PDF and CSV export for reports

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Adaptive layouts

### Dark Mode
- Automatic detection of system preference
- Manual toggle in sidebar
- Smooth transitions
- Consistent across all pages

### Export Options
- PDF export for monthly reports
- CSV export for transaction data
- Easy data backup and sharing

## Usage

### Adding Transactions

1. Navigate to Income, Expenses, or Investments page
2. Click the "Add" button
3. Fill in the form with:
   - Category
   - Amount
   - Date
   - Notes (optional)
4. Click "Add" to save

### Viewing Reports

1. Go to Reports section
2. Select Monthly or Yearly view
3. Filter by date range
4. Export as PDF if needed

### Analytics

1. Visit the Analytics page
2. View interactive charts:
   - Income vs Expenses over time
   - Savings growth
   - Investment allocation
   - Expense breakdown by category

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TailwindCSS