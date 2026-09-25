# 💳 Stripe Payment Integration

A production-oriented Stripe payment architecture for the Mini Ecommerce project.

This guide covers:

- Stripe Test Mode
- PaymentIntent
- Stripe Payment Element
- Custom Checkout UI
- Backend payment creation
- Stripe Webhooks
- Local webhook development with Stripe CLI
- Order payment lifecycle
- Inventory update
- Webhook signature verification
- Idempotency and duplicate events
- Environment variables
- Recommended project structure

---

# 1. Payment Architecture

The application should separate responsibilities between the Ecommerce backend and Stripe.

```text
┌──────────────────────────────────────────────────────────┐
│                    Customer Browser                      │
│                                                          │
│                  Next.js Frontend                        │
│                                                          │
│  Cart → Checkout → Payment Element → Payment Success     │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ HTTP API
                          ↓
┌──────────────────────────────────────────────────────────┐
│                    Ecommerce Backend                     │
│                                                          │
│  Order Service                                           │
│  Payment Service                                         │
│  Inventory Service                                       │
│                                                          │
│  PostgreSQL / Prisma                                     │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Stripe API
                          ↓
┌──────────────────────────────────────────────────────────┐
│                         Stripe                           │
│                                                          │
│  PaymentIntent                                           │
│  PaymentMethod                                           │
│  Payment Processing                                      │
│  Webhook Events                                          │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Webhook
                          ↓
┌──────────────────────────────────────────────────────────┐
│                    Ecommerce Backend                     │
│                                                          │
│             POST /api/webhooks/stripe                    │
│                                                          │
│       Verify → Process Event → Update Order              │
└──────────────────────────────────────────────────────────┘
```

---

# 2. Core Principle

The Ecommerce application owns:

```text
User
Product
Cart
Order
OrderItem
Inventory
Shipping
```

Stripe owns:

```text
PaymentIntent
PaymentMethod
Payment Processing
Payment Authentication
Refunds
Payment Events
```

The two systems are connected through:

```text
Order
   ↕
PaymentIntent
```

Example:

```text
Order
--------------------------------
id: ord_123
status: PENDING
totalAmount: 11000

stripePaymentIntentId:
pi_123456
```

---

# 3. Why PaymentIntent?

A payment is not always an instant:

```text
PAY → SUCCESS
```

It can have multiple states:

```text
requires_payment_method
        ↓
requires_action
        ↓
processing
        ↓
succeeded
```

Or:

```text
requires_payment_method
        ↓
payment_failed
```

`PaymentIntent` represents the lifecycle of one payment attempt.

Example:

```text
Customer
   ↓
Create PaymentIntent
   ↓
Customer enters payment details
   ↓
Stripe processes payment
   ↓
PaymentIntent status changes
```

---

# 4. Stripe Test Mode

During development, use Stripe Test Mode.

Test Mode simulates real payment behavior without charging real money.

Example test card:

```text
4242 4242 4242 4242
```

Example:

```text
Expiry: 12/34
CVC: 123
ZIP: 12345
```

Use Stripe's official test payment methods for testing successful payments, failures, authentication, and other scenarios.

Never use real card information during development.

---

# 5. Checkout UI

There are two main approaches.

## Option A — Stripe Checkout

Stripe hosts the payment page.

```text
Your Website
     ↓
Checkout
     ↓
Stripe Hosted Payment Page
     ↓
Payment
```

Advantages:

- Easier implementation
- Stripe handles most payment UI
- Less frontend payment code

Disadvantage:

- Less control over the checkout experience

---

# 6. Option B — Stripe Payment Element

Recommended for this ecommerce project.

You build your own checkout page:

```text
┌─────────────────────────────────────┐
│ Checkout                            │
│                                     │
│ Contact Information                 │
│ [ email@example.com              ] │
│                                     │
│ Shipping Address                    │
│ [ ...                             ] │
│                                     │
│ Payment                             │
│ ┌─────────────────────────────────┐ │
│ │ Stripe Payment Element           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Order Total: RM110                  │
│                                     │
│ [ Pay RM110 ]                       │
└─────────────────────────────────────┘
```

Your application controls:

- Layout
- Background
- Typography
- Buttons
- Order summary
- Shipping information
- Checkout structure

Stripe handles the sensitive payment input.

Do NOT build your own raw card-number processing system.

---

# 7. Why Use Payment Element?

Avoid:

```tsx
<input placeholder="Card Number" />
<input placeholder="Expiry" />
<input placeholder="CVC" />
```

and sending raw card information to your backend.

Instead:

```tsx
<PaymentElement />
```

The payment information is handled by Stripe's payment components.

Conceptually:

```text
Your Checkout UI
       │
       ├── Customer Information
       ├── Shipping
       ├── Order Summary
       │
       └── Payment Element
                │
                ↓
              Stripe
```

---

# 8. Payment Flow

The recommended flow is:

```text
1. Customer adds products
        ↓
2. Customer opens Checkout
        ↓
3. Frontend sends cart/order information
        ↓
4. Backend validates cart
        ↓
5. Backend calculates total
        ↓
6. Backend creates Order = PENDING
        ↓
7. Backend creates PaymentIntent
        ↓
8. Backend returns client_secret
        ↓
9. Frontend initializes Payment Element
        ↓
10. Customer submits payment
        ↓
11. Stripe processes payment
        ↓
12. Stripe sends Webhook
        ↓
13. Backend verifies Webhook
        ↓
14. Backend finds Order
        ↓
15. Order = PAID
        ↓
16. Inventory is updated
```

---

# 9. Important Security Rule

Never trust the amount sent by the frontend.

Bad:

```json
{
  "amount": 100
}
```

The user can modify it.

For example:

```text
Actual price: RM500

Frontend:
amount = RM500

User changes:
amount = RM1
```

Instead, frontend should send something such as:

```json
{
  "cartId": "cart_123"
}
```

The backend calculates the real price.

```text
Frontend
   ↓
cartId
   ↓
Backend
   ↓
Database
   ↓
Products + Prices + Quantity
   ↓
Calculate Total
   ↓
Stripe PaymentIntent
```

The backend is the source of truth for the order amount.

---

# 10. Database Design

Example Prisma structure:

```prisma
enum OrderStatus {
  PENDING
  PAID
  FAILED
  CANCELLED
  REFUNDED
}

model Order {
  orderId                  String      @id @default(cuid())
  userId                   String

  totalAmount              Int
  status                   OrderStatus @default(PENDING)

  stripePaymentIntentId    String?     @unique

  createdAt                DateTime    @default(now())
  updatedAt                DateTime    @updatedAt

  items                    OrderItem[]
}
```

`totalAmount` should normally use the smallest currency unit.

For example:

```text
RM110
↓
11000 sen
```

This avoids floating-point money calculations.

---

# 11. PaymentIntent Creation

Backend creates the PaymentIntent.

Example:

```ts
const paymentIntent = await stripe.paymentIntents.create({
  amount: order.totalAmount,
  currency: "myr",
  metadata: {
    orderId: order.orderId,
    userId: order.userId,
  },
});
```

Stripe returns:

```text
id
status
client_secret
```

Example:

```text
id:
pi_123456

status:
requires_payment_method

client_secret:
pi_123456_secret_xxxxx
```

Store:

```text
pi_123456
```

in your Order.

Return the `client_secret` to the frontend.

---

# 12. Why Use Metadata?

Add your internal IDs to the Stripe PaymentIntent.

Example:

```ts
metadata: {
  orderId: order.orderId,
  userId: order.userId,
}
```

Stripe:

```text
PaymentIntent
--------------------------------
id: pi_123

metadata:
    orderId: ord_123
    userId: user_456
```

When Stripe sends the webhook:

```text
Webhook
   ↓
PaymentIntent
   ↓
metadata.orderId
   ↓
ord_123
   ↓
Your database
```

This makes it easier to identify which Order belongs to the payment.

---

# 13. Frontend Payment Element

Install Stripe packages.

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Create Stripe instance:

```ts
import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
```

Then:

```tsx
import { Elements } from "@stripe/react-stripe-js";

<Elements
  stripe={stripePromise}
  options={{
    clientSecret,
  }}
>
  <CheckoutForm />
</Elements>;
```

Inside the checkout form:

```tsx
import { PaymentElement } from "@stripe/react-stripe-js";

export function CheckoutForm() {
  return (
    <form>
      <PaymentElement />

      <button type="submit">Pay Now</button>
    </form>
  );
}
```

The application owns the page layout while Stripe handles the payment component.

---

# 14. Confirming Payment

When the customer clicks:

```text
Pay Now
```

the frontend confirms the PaymentIntent.

Conceptually:

```ts
const stripe = useStripe();
const elements = useElements();

await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: "https://example.com/order-success",
  },
});
```

Depending on the payment method, Stripe may require additional authentication.

For example:

```text
Customer
   ↓
Payment
   ↓
Additional Authentication
   ↓
Payment Completed
```

---

# 15. Do Not Set Order = PAID Only From Frontend

Avoid:

```ts
if (paymentSuccess) {
  await updateOrder({
    status: "PAID",
  });
}
```

The frontend is not the final authority for payment confirmation.

A browser can:

- Close
- Crash
- Lose network
- Be manipulated
- Stop executing JavaScript

Instead:

```text
Stripe
   ↓
Webhook
   ↓
Backend
   ↓
Verify Event
   ↓
Order = PAID
```

---

# 16. Stripe Webhook

Create a backend endpoint:

```http
POST /api/webhooks/stripe
```

Example:

```text
https://api.example.com/api/webhooks/stripe
```

Stripe sends events to this endpoint.

Example event:

```text
payment_intent.succeeded
```

Conceptually:

```text
Stripe
   │
   │ POST
   ↓
/api/webhooks/stripe
   │
   ↓
Backend
```

---

# 17. Webhook Events

Useful events include:

```text
payment_intent.succeeded
payment_intent.payment_failed
charge.refunded
```

For the basic ecommerce implementation, start with:

```text
payment_intent.succeeded
payment_intent.payment_failed
```

Then add refund handling later.

---

# 18. Webhook Signature Verification

Do not blindly trust webhook requests.

Someone could send:

```http
POST /api/webhooks/stripe
```

and fake:

```text
payment_intent.succeeded
```

Your backend must verify the Stripe signature.

Example:

```ts
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!,
);
```

If verification fails:

```text
400 Bad Request
```

If verification succeeds:

```text
Process event
```

---

# 19. Express Raw Body Requirement

Stripe webhook signature verification requires the raw request body.

If your application globally uses:

```ts
app.use(express.json());
```

make sure the Stripe webhook route receives the raw body.

Example:

```ts
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);
```

Do not accidentally parse the body before Stripe signature verification.

---

# 20. Webhook Handler

Example:

```ts
export async function stripeWebhookHandler(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return res.status(400).send("Invalid webhook signature");
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;

      const orderId = paymentIntent.metadata.orderId;

      // Update order
      // Update inventory
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

      const orderId = paymentIntent.metadata.orderId;

      // Update order = FAILED
      break;
    }
  }

  return res.json({ received: true });
}
```

---

# 21. Payment Success Flow

When Stripe sends:

```text
payment_intent.succeeded
```

Backend should:

```text
1. Verify webhook
        ↓
2. Get PaymentIntent
        ↓
3. Get orderId from metadata
        ↓
4. Find Order
        ↓
5. Check current Order status
        ↓
6. Mark Order as PAID
        ↓
7. Update Inventory
        ↓
8. Return 200
```

Example:

```text
Order
status = PENDING
```

becomes:

```text
Order
status = PAID
```

---

# 22. Inventory Update

Example:

```text
Before Payment

Product:
Stock = 10
```

Customer buys:

```text
Quantity = 2
```

After successful payment:

```text
Product:
Stock = 8
```

The inventory update should happen from your backend, not from frontend.

```text
Stripe Webhook
      ↓
Payment Success
      ↓
Backend
      ↓
Database Transaction
      ├── Order = PAID
      └── Inventory -= quantity
```

---

# 23. Idempotency

Webhooks can potentially be delivered more than once.

Imagine:

```text
Webhook #1
payment_intent.succeeded
        ↓
Order = PAID
Stock 10 → 9
```

Then the same event is received again:

```text
Webhook #2
payment_intent.succeeded
```

If your backend blindly processes it:

```text
Stock 9 → 8
```

This is wrong.

The operation must be idempotent.

---

# 24. Store Stripe Event IDs

Create a table:

```prisma
model StripeEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique
  type        String
  processedAt DateTime @default(now())
}
```

When receiving a webhook:

```text
event.id
   ↓
Check database
   ↓
Already exists?
   ├── YES → Ignore
   └── NO  → Process
```

Example:

```text
evt_123
```

First time:

```text
Not found
↓
Process
↓
Save evt_123
```

Second time:

```text
evt_123 already exists
↓
Do not process again
```

---

# 25. Database Transaction

Payment success and inventory update should ideally be handled together.

Conceptually:

```ts
await prisma.$transaction(async (tx) => {
  await tx.order.update({
    where: {
      orderId,
    },
    data: {
      status: "PAID",
    },
  });

  await tx.product.update({
    where: {
      productId,
    },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });

  await tx.stripeEvent.create({
    data: {
      eventId: event.id,
      type: event.type,
    },
  });
});
```

The goal is:

```text
Everything succeeds
        ↓
COMMIT
```

or:

```text
Something fails
        ↓
ROLLBACK
```

---

# 26. Local Development Problem

Your local backend might be:

```text
http://localhost:4000
```

Stripe's servers cannot directly access:

```text
localhost:4000
```

because `localhost` refers to the machine making the request.

Therefore:

```text
Stripe Server
      ↓
localhost:4000
```

does not work.

---

# 27. Stripe CLI

Use Stripe CLI during development.

Install Stripe CLI and authenticate:

```bash
stripe login
```

Then start your backend:

```bash
npm run dev
```

For example:

```text
Backend
http://localhost:4000
```

Then start Stripe webhook forwarding:

```bash
stripe listen \
  --forward-to localhost:4000/api/webhooks/stripe
```

The architecture becomes:

```text
Stripe
   │
   │ Webhook
   ↓
Stripe CLI
   │
   │ Forward
   ↓
localhost:4000
/api/webhooks/stripe
```

---

# 28. Stripe Webhook Secret During Local Development

When running:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Stripe CLI provides a webhook signing secret.

Example:

```text
whsec_xxxxxxxxxxxxxxxxx
```

Put it into:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

Do not confuse it with:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxx
```

They have different purposes.

---

# 29. Environment Variables

Example:

```env
DATABASE_URL="postgresql://..."

STRIPE_SECRET_KEY="sk_test_xxxxxxxxx"

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxx"

STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxx"
```

### `STRIPE_SECRET_KEY`

Backend only.

Used to communicate with Stripe:

```text
Backend → Stripe
```

Never expose it to the browser.

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Frontend.

Used to initialize Stripe.js.

```text
Frontend → Stripe.js
```

### `STRIPE_WEBHOOK_SECRET`

Backend only.

Used to verify:

```text
Stripe → Backend
```

webhook signatures.

---

# 30. Local Development Setup

You normally need three processes.

### Terminal 1 — Frontend

```bash
npm run dev
```

```text
localhost:3000
```

### Terminal 2 — Backend

```bash
npm run dev
```

```text
localhost:4000
```

### Terminal 3 — Stripe CLI

```bash
stripe listen \
  --forward-to localhost:4000/api/webhooks/stripe
```

---

# 31. Complete Local Flow

```text
┌───────────────────────┐
│ Browser               │
│ localhost:3000        │
└──────────┬────────────┘
           │
           │ API
           ↓
┌───────────────────────┐
│ Backend               │
│ localhost:4000        │
└──────────┬────────────┘
           │
           │ Stripe API
           ↓
┌───────────────────────┐
│ Stripe                │
│ Test Mode             │
└──────────┬────────────┘
           │
           │ Webhook
           ↓
┌───────────────────────┐
│ Stripe CLI            │
│ Local Webhook Forward │
└──────────┬────────────┘
           │
           │ HTTP
           ↓
┌───────────────────────┐
│ Backend               │
│ /api/webhooks/stripe  │
└──────────┬────────────┘
           │
           ↓
      PostgreSQL
```

---

# 32. Testing Webhooks

Stripe CLI can trigger test events.

Example:

```bash
stripe trigger payment_intent.succeeded
```

This is useful for testing your webhook without going through the entire checkout flow.

Test separately:

```text
payment_intent.succeeded
payment_intent.payment_failed
```

Then test the full payment flow with Stripe's test cards.

---

# 33. Development vs Production

## Development

```text
Customer
   ↓
Next.js localhost
   ↓
Backend localhost
   ↓
Stripe Test Mode
   ↓
Stripe CLI
   ↓
Backend localhost
```

## Production

Your backend has a public HTTPS URL:

```text
https://api.example.com
```

Stripe sends the webhook directly:

```text
Stripe
   ↓
HTTPS
   ↓
https://api.example.com/api/webhooks/stripe
```

Stripe CLI is no longer required.

---

# 34. Recommended Backend Structure

```text
backend/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── order/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   └── order.repository.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   └── stripe.service.ts
│   │   │
│   │   └── inventory/
│   │       ├── inventory.service.ts
│   │       └── inventory.repository.ts
│   │
│   ├── webhooks/
│   │   └── stripe.webhook.ts
│   │
│   ├── config/
│   │   └── stripe.ts
│   │
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
└── .env
```

---

# 35. Responsibilities

## Order Service

Responsible for:

```text
Create Order
Get Order
Cancel Order
Update Order Status
```

## Payment Service

Responsible for:

```text
Create PaymentIntent
Retrieve PaymentIntent
Refund Payment
Handle Payment State
```

## Stripe Service

Responsible for communication with Stripe:

```text
stripe.paymentIntents.create()
stripe.paymentIntents.retrieve()
stripe.refunds.create()
```

## Webhook Handler

Responsible for:

```text
Receive Stripe Event
Verify Signature
Identify Event
Pass Event to Business Logic
```

The webhook handler should not contain your entire business logic.

Prefer:

```text
Webhook
   ↓
Payment Service
   ↓
Order Service
   ↓
Inventory Service
```

instead of:

```text
Webhook
   ↓
1000 lines of business logic
```

---

# 36. Recommended API

A simple initial API could be:

```text
POST   /api/orders
GET    /api/orders/:id

POST   /api/payments/create-intent
POST   /api/payments/refund

POST   /api/webhooks/stripe
```

Example:

```text
POST /api/orders
```

Creates:

```text
Order = PENDING
```

Then:

```text
POST /api/payments/create-intent
```

Creates:

```text
PaymentIntent
```

Finally:

```text
POST /api/webhooks/stripe
```

changes:

```text
PENDING
   ↓
PAID
```

---

# 37. Recommended Order State Machine

Keep order states explicit.

```text
PENDING
   │
   ├── payment success
   ↓
PAID
   │
   ├── shipment
   ↓
SHIPPED
   │
   ↓
DELIVERED
```

Payment failure:

```text
PENDING
   ↓
FAILED
```

Cancellation:

```text
PENDING
   ↓
CANCELLED
```

Refund:

```text
PAID
   ↓
REFUNDED
```

This is better than using a vague boolean:

```text
isPaid: true
```

because ecommerce orders have a lifecycle.

---

# 38. Important Rules

## Rule 1

Never trust the frontend amount.

```text
Backend calculates price.
```

## Rule 2

Never expose:

```text
sk_test_xxx
sk_live_xxx
```

to frontend.

## Rule 3

Do not process raw card information yourself.

Use Stripe Payment Element or Stripe Checkout.

## Rule 4

Do not mark an order as PAID only because the frontend says payment succeeded.

Use Stripe webhook confirmation.

## Rule 5

Verify webhook signatures.

```text
Stripe-Signature
        ↓
Webhook Secret
        ↓
Verify
```

## Rule 6

Handle duplicate webhook events.

Use:

```text
Stripe Event ID
```

with a unique database constraint.

## Rule 7

Use database transactions for related business operations.

For example:

```text
Order = PAID
+
Inventory decrease
+
Stripe Event recorded
```

should be handled safely.

---

# 39. Final Architecture

The final implementation should look like:

```text
                       CUSTOMER
                           │
                           ↓
                  ┌─────────────────┐
                  │ Next.js         │
                  │ Checkout        │
                  └────────┬────────┘
                           │
                           │ cartId
                           ↓
                  ┌─────────────────┐
                  │ Order Service   │
                  └────────┬────────┘
                           │
                     Calculate Total
                           │
                           ↓
                  ┌─────────────────┐
                  │ Payment Service │
                  └────────┬────────┘
                           │
                           │ Create
                           ↓
                  ┌─────────────────┐
                  │ Stripe          │
                  │ PaymentIntent   │
                  └────────┬────────┘
                           │
                           ↓
                  Customer Payment
                           │
                           ↓
                  ┌─────────────────┐
                  │ Stripe          │
                  │ Webhook Event   │
                  └────────┬────────┘
                           │
                           ↓
                /api/webhooks/stripe
                           │
                    Verify Signature
                           │
                           ↓
                  ┌─────────────────┐
                  │ Payment Service │
                  └────────┬────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │ Order Service   │
                  │ Order = PAID    │
                  └────────┬────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │ Inventory       │
                  │ Stock -= Qty    │
                  └─────────────────┘
```

---

# 40. Implementation Steps

1. Create Stripe account and enable Test Mode.

2. Get the Stripe test keys:

   ```text
   pk_test_...
   sk_test_...
   ```

3. Install Stripe packages:

   ```bash
   npm install stripe @stripe/stripe-js @stripe/react-stripe-js
   ```

4. Configure the required environment variables.

5. Create the Order model and payment-related fields in Prisma.

6. Create the Order API and calculate the order total on the backend.

7. Create a PaymentIntent from the backend.

8. Store the Stripe PaymentIntent ID in the Order.

9. Add the Order ID to the PaymentIntent metadata.

10. Return the PaymentIntent `client_secret` to the frontend.

11. Build the Checkout page.

12. Add Stripe Payment Element to the Checkout page.

13. Confirm the PaymentIntent from the frontend.

14. Create:

```text
POST /api/webhooks/stripe
```

15. Configure the webhook endpoint to receive Stripe events.

16. Verify the Stripe webhook signature.

17. Handle:

```text
payment_intent.succeeded
payment_intent.payment_failed
```

18. When payment succeeds, find the Order using the PaymentIntent metadata.

19. Update the Order status to `PAID`.

20. Update inventory inside a database transaction.

21. Store Stripe Event IDs to prevent duplicate processing.

22. Install and authenticate Stripe CLI:

```bash
stripe login
```

23. Start local webhook forwarding:

```bash
stripe listen \
  --forward-to localhost:4000/api/webhooks/stripe
```

24. Copy the generated `whsec_...` into:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

25. Test webhook events:

```bash
stripe trigger payment_intent.succeeded
```

26. Test the complete checkout flow using Stripe Test Mode.

27. Before production, configure the real HTTPS webhook endpoint and switch to the appropriate live Stripe keys.

---

# 41. Mental Model

The most important thing to remember:

```text
Frontend
   │
   │ "I want to pay"
   ↓
Backend
   │
   │ "Create a PaymentIntent"
   ↓
Stripe
   │
   │ "Payment processed"
   ↓
Stripe Webhook
   │
   │ "Payment succeeded"
   ↓
Backend
   │
   ├── Order = PAID
   ├── Inventory -= quantity
   └── Record Event
```

The key separation is:

```text
Frontend
    ↓
Request Payment

Stripe
    ↓
Process Payment

Webhook
    ↓
Confirm Payment

Backend
    ↓
Apply Business Logic
```
