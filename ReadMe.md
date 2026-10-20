<p align="center">
  <a href="https://github.com/NisanurBulut/Camekan/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/NisanurBulut/Camekan?style=for-the-badge&logo=github&label=Stars&color=f5c518&labelColor=1f2328">
  </a>
</p>

> [!TIP]
> **⭐ If this project helped you learn, please give it a star.** It takes two seconds and helps other developers find a complete .NET 10 + Angular 21 example with a real Stripe checkout.
<p align="center">
  <b>↗ Click the ⭐ Star button at the top right of this page ↗</b>
</p>

<hr>
<h1 align="center">Camekân</h1>

<p align="center">
  A bookstore demo with a real checkout: ASP.NET Core 10, Angular 21, Redis and Stripe.<br>
  Dark and light theme, Turkish and English.
</p>

<p align="center">
  <img alt=".NET 10" src="https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white">
  <img alt="Angular 21" src="https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white">
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white">
  <img alt="Redis" src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white">
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white">
  <img alt="License: GPL-3.0" src="https://img.shields.io/badge/license-GPL--3.0-blue">
</p>

## Features

- **Shop:** search, sort, filter by publisher and type, paging
- **Basket:** kept in Redis, updates instantly, survives a page refresh
- **Checkout:** address, delivery, review and card payment with Stripe
- **Orders:** history list with a spending summary
- **Dashboard:** sales charts (Chart.js)
- **Accounts:** JWT login and ASP.NET Identity
- **Design:** dark and light theme, Turkish and English, empty and error states
- **API docs:** Scalar (OpenAPI) in development

<p align="center">
  <a href="Trailers/Camekan_shop.jpeg">
    <img src="Trailers/Camekan_shop.jpeg" alt="Camekân shop page with book covers, filters and search" width="850">
  </a>
</p>

## A quick tour

<table>
  <tr>
    <td align="center" width="50%">
      <a href="Trailers/Camekan_product_detail.jpeg"><img src="Trailers/Camekan_product_detail.jpeg" alt="Product page with a quantity picker and an Add to Basket button" width="420"></a><br>
      <sub><b>1. Pick a book</b><br>Quantity picker and a live basket count</sub>
    </td>
    <td align="center" width="50%">
      <a href="Trailers/Camekan_basket.jpeg"><img src="Trailers/Camekan_basket.jpeg" alt="Basket with two books and an order summary" width="420"></a><br>
      <sub><b>2. Review the basket</b><br>Change quantities, see the total, go to checkout</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="Trailers/Camekan_order_detail.jpeg"><img src="Trailers/Camekan_order_detail.jpeg" alt="Orders page with summary cards, a spending chart and an order list" width="420"></a><br>
      <sub><b>3. Track your orders</b><br>Summary cards, 6-month spending and a fast order list</sub>
    </td>
    <td align="center">
      <a href="Trailers/Camekan_dashboard_detail.jpeg"><img src="Trailers/Camekan_dashboard_detail.jpeg" alt="Dashboard with sales trend, category chart and top selling books" width="420"></a><br>
      <sub><b>4. See the big picture</b><br>Sales trend, categories and top-selling books</sub>
    </td>
  </tr>
</table>

<details>
<summary><b>Empty, error and success states</b></summary>

<table>
  <tr>
    <td align="center" width="50%">
      <a href="Trailers/camekan_basket_empty.png"><img src="Trailers/camekan_basket_empty.png" alt="Empty basket page with a Browse books button" width="420"></a><br>
      <sub><b>Empty basket</b>: a clear next step</sub>
    </td>
    <td align="center" width="50%">
      <a href="Trailers/camekan_no_books.png"><img src="Trailers/camekan_no_books.png" alt="Shop search with no results and filters on the left" width="420"></a><br>
      <sub><b>No results</b>: filters stay in place</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="Trailers/camekan_not_found.png"><img src="Trailers/camekan_not_found.png" alt="404 page: This page is not on our shelves" width="420"></a><br>
      <sub><b>404</b>: "This page is not on our shelves"</sub>
    </td>
    <td align="center">
      <a href="Trailers/camekan_order_success.png"><img src="Trailers/camekan_order_success.png" alt="Order confirmation page" width="420"></a><br>
      <sub><b>Order received</b>: after the Stripe payment</sub>
    </td>
  </tr>
</table>

</details>

## Tech stack

| Layer | Tools |
|---|---|
| API | ASP.NET Core 10, EF Core 10 (SQLite), Identity, JWT, AutoMapper, FluentValidation |
| Cache and payments | Redis (basket, response cache), Stripe (PaymentIntents and webhook) |
| Client | Angular 21 (standalone, zoneless, signals), ngx-translate, Chart.js, Bootswatch |

## Quick start

```bash
# API (needs Redis on localhost:6379)
cd Camekan.API
cp appsettings.example.json appsettings.json   # add your Stripe keys and a Token:Key
dotnet run

# Client
cd Camekan.Client
cp src/environments/stripe-key.example.ts src/environments/stripe-key.ts
npm install
npm start
```

<details>
<summary><b>Architecture notes</b></summary>

## Architecture

```mermaid
flowchart LR
    SPA["Angular 21 app<br/>standalone, zoneless, signals"] -->|"HTTPS + JWT"| API["ASP.NET Core 10 API<br/>controllers and middleware"]
    API --> DA["Data access<br/>repositories, specifications, services"]
    DA --> DB[("SQLite<br/>EF Core 10")]
    DA --> RD[("Redis<br/>baskets and response cache")]
    DA --> ST["Stripe<br/>PaymentIntents"]
    ST -.->|"webhook"| API
```

### From basket to paid order

```mermaid
sequenceDiagram
    autonumber
    actor U as Customer
    participant W as Angular app
    participant A as ASP.NET Core API
    participant R as Redis
    participant S as Stripe

    U->>W: Add books to the basket
    W->>A: POST /api/basket
    A->>R: Save the basket (30 days)
    U->>W: Go to payment
    W->>A: POST /api/payment/CreateOrUpdatePaymentIntent
    A->>R: Read the basket
    A->>S: Create or update the PaymentIntent (amount from database prices)
    A->>R: Save PaymentIntentId and ClientSecret
    A-->>W: Basket with the ClientSecret
    W->>A: POST /api/order/CreateOrder
    A-->>W: Order saved as Pending
    W->>S: Confirm the card payment
    S-->>W: Payment result
    S->>A: Webhook payment_intent.succeeded
    A->>A: Set the order to PaymentReceived
```

The price is never trusted from the browser: the API recalculates the amount from the database before it talks to Stripe.

### Solution layout

| Project | Role |
|---|---|
| `Camekan.API` | Controllers, middleware, JWT setup, OpenAPI and Scalar |
| `Camekan.DataAccess` | EF Core context, repositories, specifications, order and payment services |
| `Camekan.Util` | AutoMapper profiles, error responses, exception middleware |
| `Camekan.DataTransferObject` | DTOs and validators |
| `Camekan.Entities` | Domain entities |
| `Camekan.Client` | Angular app with lazy-loaded routes, functional interceptors and TR/EN translations |

Dependencies point downward: `API` → `DataAccess` and `Util` → `DataTransferObject` → `Entities`.

<details>
<summary><b>What I practised building this</b></summary>

- **ASP.NET Identity:** context boundaries, `UserManager` and `SignInManager`, extensions, JWT
- **Repository pattern:** separation of concerns, less duplicated query code, business code decoupled from data access
- **Specification pattern:** reusable query rules, used for filtering, sorting, searching and paging
- **Unit of Work pattern**
- **Error handling:** developer exception page, middleware, customized HTTP error responses, validation errors
- **Angular forms:** reactive forms, client-side validation, async validation
- **Data:** related data, seeding, pagination (always page results, limit the page size)
- **Queries:** a query is only a command until `ToList()`, `ToArray()`, `Count()` or a similar call runs it (deferred execution)

</details>

<hr/>

<p align="center">
  <b>Did this save you time?</b> A ⭐ on <a href="https://github.com/NisanurBulut/Camekan">GitHub</a> means a lot.<br>
  Found a bug or have an idea? <a href="https://github.com/NisanurBulut/Camekan/issues">Open an issue</a>, I read every one.
</p>