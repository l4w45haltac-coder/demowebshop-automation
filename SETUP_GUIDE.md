# Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check

Ensure you have Node.js installed:

```bash
node --version  # Should be v16 or higher
npm --version
```

### 2. Project Setup

```bash
# Create project directory
mkdir demowebshop-automation
cd demowebshop-automation

# Initialize npm project
npm init -y

# Install dependencies
npm install --save-dev @playwright/test@^1.40.0
npm install --save-dev typescript@^5.3.3
npm install --save-dev @types/node@^20.10.0
npm install dotenv@^16.3.1
npm install csv-parse@^5.5.3
npm install xlsx@^0.18.5

# Install Playwright browsers
npx playwright install
```

### 3. Create Project Structure

```bash
# Create directories
mkdir -p pages tests utils test-data

# Create all necessary files (copy from artifacts)
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
TEST_USER_EMAIL=your_actual_email@example.com
TEST_USER_PASSWORD=YourActualPassword123
BASE_URL=https://demowebshop.tricentis.com
HEADLESS=false
```

### 5. Get Test Account Credentials

#### Option A: Create a new account

1. Visit https://demowebshop.tricentis.com/register
2. Fill in the registration form:
   - Gender: Select any
   - First Name: YourFirstName
   - Last Name: YourLastName
   - Email: youremail@example.com
   - Password: YourPassword123
   - Confirm Password: YourPassword123
3. Click "Register"
4. Use these credentials in your `.env` file

#### Option B: Use existing test account

If you already have an account on the demo site, use those credentials.

### 6. Verify Installation

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run a quick test
npm test -- --headed
```

### 7. Understanding Test Data Files

The project uses three data file formats:

**products.json** - Primary data source

```json
{
  "products": [
    {
      "name": "Blue Jeans",
      "category": "Apparel",
      "price": 24.0,
      "quantity": 2
    }
  ]
}
```

**products.csv** - Alternative format

```csv
name,category,price,quantity
Blue Jeans,Apparel,24.00,2
```

You can modify these files to test different products.

### 8. Run Your First Test

```bash
# Run all tests
npm test

# Run in headed mode (see the browser)
npm run test:headed

# Run specific test
npx playwright test tests/placeOrder.spec.ts

# Debug mode
npm run test:debug
```

### 9. View Test Reports

After test execution:

```bash
# Open HTML report
npm run report

# Or manually open
open playwright-report/index.html  # macOS
start playwright-report/index.html # Windows
```

## Troubleshooting

### Issue: Module not found errors

**Solution:**

```bash
npm install
npx playwright install
```

### Issue: Cannot find .env file

**Solution:**

```bash
cp .env.example .env
# Then edit .env with your credentials
```

### Issue: Test fails at login

**Solution:**

1. Verify credentials in `.env` are correct
2. Check if account exists on the demo site
3. Try logging in manually first

### Issue: Product not found

**Solution:**

1. Check product name in `test-data/products.json`
2. Verify product exists on the website
3. Product names are case-sensitive

### Issue: Price mismatch

**Solution:**

1. Update prices in test data to match website
2. Website prices may change - verify current prices

## Advanced Configuration

### Run on Different Browsers

```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# All browsers
npx playwright test
```

### Parallel Execution

Edit `playwright.config.ts`:

```typescript
workers: process.env.CI ? 1 : 3; // Run 3 tests in parallel
```

### Custom Test Data

Create your own data file:

```bash
# Create new JSON file
echo '{"products":[{"name":"My Product","category":"Books","price":15.00,"quantity":1}]}' > test-data/my-products.json
```

Update test to use it:

```typescript
products = DataReader.getProductsFromJSON("my-products.json");
```

## Project Validation Checklist

✅ Node.js installed (v16+)  
✅ Dependencies installed (`npm install`)  
✅ Browsers installed (`npx playwright install`)  
✅ `.env` file created with credentials  
✅ Test account created on demo site  
✅ Test data files present in `test-data/`  
✅ TypeScript compiles without errors  
✅ At least one test runs successfully

## Next Steps

1. **Customize test data** - Modify `test-data/products.json` with products you want to test
2. **Add more tests** - Create additional test files in `tests/` directory
3. **Extend page objects** - Add more methods to page objects as needed
4. **Integrate CI/CD** - Set up GitHub Actions or Jenkins
5. **Add more validations** - Enhance price calculation checks

## Getting Help

- Check test output logs for detailed error messages
- Review Playwright documentation: https://playwright.dev
- Examine page objects to understand available methods
- Use debug mode to step through tests: `npm run test:debug`

## Common Commands Reference

```bash
# Installation
npm install                          # Install dependencies
npx playwright install              # Install browsers

# Running Tests
npm test                            # Run all tests
npm run test:headed                 # Run with visible browser
npm run test:debug                  # Run in debug mode
npx playwright test <file>          # Run specific test file

# Reports
npm run report                      # Open HTML report

# Development
npx tsc --noEmit                   # Check TypeScript errors
npx playwright codegen <url>       # Generate test code
```
