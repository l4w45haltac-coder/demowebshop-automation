# Demo Web Shop - E2E Automation Testing

## Overview

Automated testing suite for the Demo Web Shop (https://demowebshop.tricentis.com/) using Playwright with TypeScript, implementing Page Object Model design pattern.

## Features

- ✅ Page Object Model (POM) architecture
- ✅ Data-driven testing with external files (JSON, CSV, Excel)
- ✅ Built-in Playwright HTML Reporter
- ✅ Environment variable configuration
- ✅ Price calculation validation
- ✅ Multi-product order placement

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd demowebshop-automation

# Install dependencies
npm install
```

## Project Structure

```
demowebshop-automation/
├── pages/                    # Page Object Models
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                    # Test specifications
│   └── placeOrder.spec.ts
├── test-data/               # External test data
│   ├── products.json
│   ├── products.csv
│   └── users.json
├── utils/                   # Utility functions
│   ├── dataReader.ts
│   └── priceCalculator.ts
├── playwright.config.ts     # Playwright configuration
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# User Credentials
TEST_USER_EMAIL=your_email@example.com
TEST_USER_PASSWORD=your_password

# Optional: Base URL (defaults to demo site)
BASE_URL=https://demowebshop.tricentis.com

# Optional: Test execution settings
HEADLESS=true
TIMEOUT=30000
```

### How to Retrieve Required Keys

1. **User Credentials**:

   - Navigate to https://demowebshop.tricentis.com/register
   - Create a test account
   - Use the email and password for `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`

2. **Base URL**:
   - Default is provided, can be changed if testing different environments

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/placeOrder.spec.ts

# View HTML report
npm run report
```

## Test Data Configuration

### products.json

Located in `test-data/products.json`, contains product information:

```json
{
  "products": [
    {
      "name": "Blue Jeans",
      "category": "Apparel & Shoes",
      "price": 24.0,
      "quantity": 2
    }
  ]
}
```

### products.csv

Alternative data source in `test-data/products.csv`:

```csv
name,category,price,quantity
Blue Jeans,Apparel & Shoes,24.00,2
Computing and Internet,Books,10.00,1
```

## Test Scenarios

### Place Order with Multiple Products

- **File**: `tests/placeOrder.spec.ts`
- **Features**:
  - Login with test credentials
  - Add multiple products to cart
  - Validate individual product prices
  - Validate subtotal calculation
  - Validate total price with shipping
  - Complete checkout process

## Reporting

This project uses Playwright's built-in HTML reporter:

- Reports are generated automatically after test execution
- View reports: `npm run report`
- Reports location: `playwright-report/index.html`

## Best Practices Implemented

1. **Page Object Model**: Separation of page logic from test logic
2. **DRY Principle**: Reusable components and utilities
3. **Data-Driven Testing**: External test data management
4. **Environment Variables**: Secure credential management
5. **Waiting Strategies**: Proper explicit waits for stable tests
6. **Assertions**: Comprehensive validation of calculations
7. **Code Organization**: Clear folder structure and naming conventions

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "User not logged in"

- **Solution**: Verify `.env` file contains correct credentials

**Issue**: Product not found

- **Solution**: Check product names in test data match exactly with website

**Issue**: Price mismatch

- **Solution**: Ensure test data prices are current with website

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
