CRM Admin – Products Module
Automation Assignment Documentation
Candidate: Rajat Singh Rawat    |    Technology: Playwright + TypeScript    |    Framework: Page Object Model (POM)
1. Objective
Automated the Products Module (CRUD operations) of the CRM Admin panel using Playwright with TypeScript. The implementation focuses on clean framework design, maintainability, modularity, and reliable execution.

2. Project Folder Structure
The project follows a clean, modular structure under the crm-admin-automation repository:

Path / File	Purpose
crm-admin-automation/	Project root
  automated-tests/	All test code lives here
  ├── auth/	Authentication setup
  │   └── auth.setup.ts	Global setup: login, merchant switch, saves storageState
  ├── config/	Environment configuration
  │   └── env.ts	Loads and exports env variables via dotenv
  ├── fixtures/	Custom Playwright fixtures (if any)
  ├── pages/	Page Object Model classes
  │   ├── LoginPage.ts	Login flow: email, password, OTP input methods
  │   ├── DashboardPage.ts	Post-login: merchant switch, navigation
  │   └── ProductsPage.ts	All Products module interactions (CRUD)
  ├── products/	Test spec files (one per CRUD operation)
  │   ├── 01-auth-flow.spec.ts	Validates login + merchant switch flow
  │   ├── 02-create-product.spec.ts	Product creation and listing validation
  │   ├── 03-read-product.spec.ts	Product search and presence verification
  │   ├── 04-update-product.spec.ts	Product edit and updated value validation
  │   └── 05-delete-product.spec.ts	Delete via More Actions, modal, listing check
  ├── test-data/	Externalized test data
  │   ├── create-product.testdata.ts	Static product creation data (TypeScript)
  │   └── latest-product.json	Runtime file: persists updated product name between specs
  └── utils/	Shared utility helpers
playwright.config.ts	Playwright configuration (baseURL, reporter, screenshot, slowMo)
playwright-report/	HTML report output (auto-generated)
test-results/	Artifacts: screenshots on failure, traces
.gitignore / tsconfig.json	Project config files


3. Playwright Configuration (playwright.config.ts)
Setting	Value / Details
Base URL	https://qa-mdashboard.dev.gokwik.in/
Test Directory	./automated-tests
Workers	1 (sequential execution)
fullyParallel	false
Headless	false (headed mode for visibility)
slowMo	800ms delay between actions for stability
Screenshot	only-on-failure
Trace	on-first-retry
Reporter	list (console) + HTML (playwright-report/)


4. Authentication Flow
4.1 auth.setup.ts (Global Setup)
Runs once before all tests. Handles the full login sequence and merchant switch, then saves browser storageState so subsequent tests skip re-authentication.

    • Navigates to the QA dashboard URL
    • Enters email: sandboxuser1@gokwik.co
    • Enters password (loaded from env / config)
    • Enters OTP: 123456 (hardcoded as per assignment)
    • Switches merchant to ID: 19h577u3p4be via top-right dropdown
    • Validates successful navigation to dashboard
    • Saves storageState to auth/ folder for reuse across specs

4.2 01-auth-flow.spec.ts
Dedicated spec that validates the login + merchant switch flow as a standalone test case (TC01).

5. Page Object Model (POM) Classes
5.1 LoginPage.ts
    • fillEmail(email)  –  types email in the email input field
    • fillPassword(password)  –  types password in the password field
    • fillOTP(otp)  –  enters the 6-digit OTP
    • submitLogin()  –  clicks the login / verify button
    • waitForDashboard()  –  waits for successful post-login redirect
5.2 DashboardPage.ts
    • switchMerchant(merchantId)  –  opens top-right dropdown, selects merchant by ID
    • navigateToProducts()  –  navigates to /gk-pages/store/{merchantId}/products
    • waitForProductsPage()  –  asserts products module is loaded
5.3 ProductsPage.ts
Core page object containing all product CRUD interactions:
    • createProduct(name)  –  opens creation form, fills product name, submits
    • searchProduct(name)  –  uses the search/filter input to find a product
    • verifyProductInListing(name)  –  asserts product name is visible in the table
    • clickEditProduct(name)  –  finds product row, clicks edit/pencil action
    • updateProductName(newName)  –  clears and fills the name field in edit form
    • saveProductUpdate()  –  saves the edit form
    • selectProductCheckbox(name)  –  clicks the row checkbox for a product
    • openMoreActions()  –  opens the More Actions dropdown
    • clickDeleteProducts()  –  selects Delete option from More Actions
    • confirmDeletion()  –  handles the confirmation modal (clicks OK/Confirm)
    • verifyProductNotInListing(name)  –  asserts product is absent from listing

6. Test Coverage
Test ID	Spec File	Scenario	Result
TC01	01-auth-flow.spec.ts	Login with email, password, OTP + merchant switch	Passed
TC02	02-create-product.spec.ts	Create product with dynamic timestamp name	Passed
TC03	02-create-product.spec.ts	Validate newly created product appears in listing	Passed
TC04	03-read-product.spec.ts	Search product by name, verify presence in listing	Passed
TC05	04-update-product.spec.ts	Edit product name, save changes	Passed
TC06	04-update-product.spec.ts	Verify updated name reflected in listing	Passed
TC07	04-update-product.spec.ts	Persist updated product name to latest-product.json	Passed
TC08	05-delete-product.spec.ts	Select product via checkbox, open More Actions	Passed
TC09	05-delete-product.spec.ts	Delete via More Actions, handle confirmation modal	Passed
TC10	05-delete-product.spec.ts	Validate product no longer appears in listing	Passed
Total: 5 spec files  |  All 5 specs passed  |  Execution time: ~1.9 minutes

7. Test Data Strategy
7.1 create-product.testdata.ts
A TypeScript file exporting static product data (product name base, category, etc.) used by the create spec. Keeps test logic clean by separating data from code.
7.2 latest-product.json (Runtime State File)
After the update spec runs, it writes the updated product name to latest-product.json. The delete spec then reads this file to know exactly which product to delete. This approach maintains test independence without hardcoding values between specs.
7.3 Dynamic Naming
Product names are generated using a timestamp suffix (e.g. Test_Product_1773946191626_rajatEdit) to prevent collisions across test runs.

8. End-to-End Execution Flow
    • auth.setup.ts runs first (globalSetup) — logs in, switches merchant, saves storageState
    • 01-auth-flow.spec.ts — validates auth independently
    • 02-create-product.spec.ts — creates a product, validates listing
    • 03-read-product.spec.ts — searches and verifies product presence
    • 04-update-product.spec.ts — edits product, saves updated name to JSON
    • 05-delete-product.spec.ts — reads JSON, selects product, deletes, validates removal

Execution order is enforced by numeric prefixes (01–05) and workers: 1 in playwright.config.ts.

9. Design & Quality Decisions
Design Decision	Rationale
POM Architecture	Separates page interaction logic from test assertions — easier to maintain when UI changes
One spec per operation	Test isolation: a failure in create does not cascade to update/delete
storageState reuse	Avoids repeating login in every spec — faster execution, no flakiness from auth timeouts
No hard waits (no page.waitForTimeout)	Uses Playwright's built-in auto-waiting and explicit expect waits for stability
slowMo: 800ms	Adds visibility during execution for review; easy to remove for CI speed
Dynamic timestamp naming	Prevents test data collision across multiple runs
latest-product.json	Clean way to pass runtime state between spec files without global variables
Screenshot on failure	Enables fast debugging without needing to re-run — screenshots saved to test-results/
HTML Reporter	Full visual report with test names, status, duration, and failure details


10. How to Run
Prerequisites
    • Node.js (LTS) installed
    • Run: npm install
    • Run: npx playwright install chromium
Run All Tests
npx playwright test
Run a Specific Spec
npx playwright test automated-tests/products/02-create-product.spec.ts
View HTML Report
npx playwright show-report
Environment Variables
Create a .env file in the project root (dotenv v16):
BASE_URL=https://qa-mdashboard.dev.gokwik.in/
USER_EMAIL=sandboxuser1@gokwik.co
USER_PASSWORD=Wb7y,=e.9NX9
OTP=123456
MERCHANT_ID=19h577u3p4be

GitHub: https://github.com/rawatbuilds/crm-admin-automation    |    LinkedIn: linkedin.com/in/rajatsinghrawat
