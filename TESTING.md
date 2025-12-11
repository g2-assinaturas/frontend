# Test Checklist

Manual smoke tests targeting backend API (set `NEXT_PUBLIC_API_URL`).

## Auth (company)
- Login with valid company user credentials → lands on /dashboard.
- Login failure shows toast error.
- Logout clears session and redirects to /login on protected pages.

## Plans & Checkout
- /plans loads active plans.
- Selecting a plan sends query to /checkout with planId shown.
- Checkout with valid token creates subscription and shows success toast.
- Checkout without token redirects to /login.

## Subscription
- /subscription shows current subscription details when one exists.
- Cancel at period end and cancel now both succeed and refresh state.
- No subscription → CTA to go to plans.

## Invoices
- /invoices lists invoices for the company; empty state is handled.

## Super Admin
- Super-admin login succeeds and redirects to /super-admin/dashboard.
- Company list loads with counts and status.
- Toggle status flips state and shows success toast; failure shows error toast.

## Navigation & Protection
- Protected routes (/dashboard, /checkout, /subscription, /invoices) redirect to /login when signed out.
- Super-admin routes redirect to /super-admin/login when token missing.
