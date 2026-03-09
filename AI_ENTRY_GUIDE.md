# AI Natural Language Transaction Entry - User Guide

## Overview
The AI Entry feature allows you to add transactions using natural language instead of filling out forms. Simply describe your transaction in plain English, and the AI will extract all the necessary details.

## Getting Started

### 1. Setup OpenAI API Key
Before using the AI Entry feature, you need to add your OpenAI API key to the `.env` file:

```env
OPENAI_API_KEY="your-actual-openai-api-key-here"
```

To get an API key:
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into your `.env` file

### 2. Install Dependencies
Run the following command to install the OpenAI package:

```bash
npm install
```

### 3. Access the Feature
Navigate to the "AI Entry" page from the sidebar (look for the ✨ Sparkles icon with a "NEW" badge).

## How to Use

### Basic Examples

#### Adding an Expense
```
Spent 500 on groceries yesterday
Paid 2000 for electricity bill
Bought a new phone for 25000
```

#### Adding Income
```
Received salary of 50000 today
Got paid 5000 for freelance work
Earned 1000 from side business last week
```

#### Adding Investment
```
Invested 10000 in mutual funds
Bought stocks worth 15000
Put 20000 in fixed deposit on March 1
```

#### Multiple Transactions
```
Paid rent 15000 and electricity 2000 last week
Spent 500 on groceries and 300 on transport yesterday
```

### Date Parsing
The AI understands various date formats:
- **Relative dates**: "yesterday", "last week", "2 days ago"
- **Specific dates**: "March 5", "15th January", "01/03/2026"
- **Default**: If no date is mentioned, it defaults to today

### Transaction Types & Categories

#### Income Categories
- salary
- business
- passive
- other

#### Expense Categories
- food
- rent
- travel
- shopping
- bills
- entertainment
- healthcare
- education
- other

#### Investment Categories
- stocks
- mutual_funds
- gold
- real_estate
- fixed_deposits
- crypto
- other

## Features

### 1. Chat Interface
- Type your transaction in natural language
- View conversation history
- Get instant AI responses

### 2. Example Prompts
Click on any example prompt to quickly try the feature:
- "Spent 500 on groceries yesterday"
- "Received salary of 50000 today"
- "Invested 10000 in mutual funds"
- "Paid rent 15000 and electricity 2000 last week"

### 3. Transaction Confirmation
Before saving, you can:
- **Review** all extracted details
- **Edit** any field (amount, category, date, notes)
- **Delete** individual transactions
- **Confirm** to save all transactions
- **Cancel** to discard

### 4. Inline Editing
Click the edit icon (✏️) on any transaction to modify:
- Amount
- Type (Income/Expense/Investment)
- Category
- Date
- Notes

### 5. Conversation Context
The AI remembers your conversation, so you can:
- Add follow-up transactions
- Refer to previous entries
- Build on context

## Tips for Best Results

### Be Specific
✅ Good: "Spent 500 on groceries at Walmart yesterday"
❌ Vague: "bought stuff"

### Include Key Details
- **Amount**: Always mention the amount
- **Category**: Describe what it's for
- **Date**: Mention when it happened (optional)

### Use Natural Language
You don't need to follow a specific format. The AI understands:
- "I spent 500 rupees on food"
- "Paid 500 for food"
- "500 for groceries"
- "Grocery shopping - 500"

### Multiple Transactions
You can add multiple transactions in one message:
```
Yesterday I spent 500 on groceries, 200 on transport, and 100 on coffee
```

## Technical Details

### API Endpoint
- **URL**: `/api/ai/parse-transaction`
- **Method**: POST
- **Authentication**: Required (NextAuth session)

### Request Format
```json
{
  "message": "Spent 500 on groceries yesterday",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Response Format
```json
{
  "transactions": [
    {
      "amount": 500,
      "category": "food",
      "type": "EXPENSE",
      "date": "2026-03-08T00:00:00.000Z",
      "notes": "Groceries"
    }
  ],
  "aiResponse": {
    "role": "assistant",
    "content": "..."
  }
}
```

### AI Model
- **Model**: GPT-4-turbo-preview
- **Temperature**: 0.3 (for consistent parsing)
- **Response Format**: JSON object

## Troubleshooting

### "OpenAI API key not configured"
- Make sure you've added `OPENAI_API_KEY` to your `.env` file
- Restart the development server after adding the key

### "Could not parse transaction from message"
- Try being more specific about the amount and category
- Use clearer language (e.g., "spent" for expenses, "received" for income)

### Incorrect Category
- Edit the transaction before confirming
- Be more specific in your description (e.g., "food shopping" instead of just "shopping")

### Wrong Date
- Specify the date more clearly
- Edit the date in the confirmation dialog

### Multiple Transactions Not Detected
- Use clear separators like "and", commas, or separate sentences
- Example: "Spent 500 on food and 200 on transport"

## Cost Considerations

### OpenAI API Pricing
- GPT-4-turbo is cost-efficient
- Typical transaction parsing: ~$0.001-0.002 per request
- Conversation history increases token usage

### Optimization Tips
- Clear conversation history periodically
- Be concise in your descriptions
- Avoid unnecessary back-and-forth

## Privacy & Security

### Data Handling
- Transactions are sent to OpenAI for parsing
- No transaction data is stored by OpenAI (per their API policy)
- All data is saved to your private database
- Requires authentication to access

### Best Practices
- Don't include sensitive personal information in notes
- Use the feature over secure connections (HTTPS)
- Keep your OpenAI API key secure

## Future Enhancements

Potential improvements:
- Voice input support
- Receipt image parsing
- Recurring transaction detection
- Budget recommendations
- Spending pattern analysis
- Multi-language support

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your OpenAI API key is valid
3. Ensure you have sufficient API credits
4. Try rephrasing your message

## Examples Gallery

### Simple Transactions
```
✅ "Lunch 250"
✅ "Salary 50000"
✅ "Uber 150"
✅ "Netflix subscription 199"
```

### Detailed Transactions
```
✅ "Spent 2500 on groceries at BigBasket yesterday evening"
✅ "Received freelance payment of 15000 for website project on March 1"
✅ "Invested 25000 in SIP mutual funds through Zerodha"
```

### Complex Scenarios
```
✅ "Last week I paid rent 15000, electricity 2000, and internet 1000"
✅ "Yesterday spent 500 on breakfast, 800 on lunch, and 400 on dinner"
✅ "Bought 10 shares of TCS at 3500 each on Monday"
```

---

**Made with Bob** 🤖✨