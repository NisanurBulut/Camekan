# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Camekan is an e-commerce demo: an ASP.NET Core 3.1 Web API (`Camekan.sln`) plus an Angular 21 SPA (`Camekan.Client/`). Some code comments are in Turkish, and the UI is localized in Turkish (the default) and English.

The root `Camekan.csproj`/`Program.cs` is a leftover "Hello World" stub that is not in the solution. Ignore it.

## Commands

Backend (run from `Camekan.API/`. The SQLite path is relative, see below):
- `dotnet build ../Camekan.sln`
- `dotnet run` starts Kestrel on http://localhost:5000. The IIS Express profile uses http://localhost:63484, which is the URL the client's `environment.ts` (`apiUrl`) and `appsettings.Development.json` (`ApiUrl`, `Token:Key`, `Token:Issuer`) point at. Those settings exist only in the Development file, so the API must run with `ASPNETCORE_ENVIRONMENT=Development` (the launch profiles set it). Both launch profiles open `swagger/v1/swagger.json`.
- EF migrations live in `Camekan.DataAccess` and the startup project is `Camekan.API`:
  `dotnet ef migrations add <Name> -p ../Camekan.DataAccess -s .`
  The `Migrations` folder and `*.db` are git-ignored, but `DatabaseContextModelSnapshot.cs` is tracked. On a fresh clone, `migrations add` therefore diffs against an up-to-date snapshot and produces an **empty** migration. To create the initial migration, delete the snapshot first. `Program.Main` applies migrations on startup, so `dotnet ef database update` isn't needed.
- A local Redis must be listening on `localhost:6379` (connection string `Redis` in `appsettings.json`). The `IConnectionMultiplexer` singleton connects lazily, so the API starts fine without Redis. The first basket or `[Cached]` request then fails with `RedisConnectionException`, which `ExceptionMiddleware` turns into a 500. Every `ProductController` GET is `[Cached]`, so the shop doesn't work without Redis. Account endpoints still work.

Frontend (from `Camekan.Client/`):
- `npm install`, `npm start` (ng serve on :4200), `npm run build`, `npm run lint` (ESLint via `@angular-eslint`, configured in `.eslintrc.json`; TSLint has been removed)
- `npm test` (Karma/Jasmine) is wired up, but `src/` currently has no spec files, so it runs 0 tests. For a single headless run use `npx ng test --watch=false --browsers=ChromeHeadless`. zone.js is not installed, so TestBed runs zoneless: `fakeAsync`/`tick` are unavailable, use `await fixture.whenStable()`. There is no e2e setup and no backend test project.

## Backend architecture
Project layering, with dependencies pointing downward:
`Camekan.API` (WebAPI) → `Camekan.DataAccess` + `Camekan.Util` → `Camekan.DataTransferObject` → `Camekan.Entities`

- **Startup/DI**: `Startup.cs` plus the `Extensions/*ServiceExtension.cs` files. `StartupServicesExtension` registers repositories, services, UoW, and the FluentValidation validators. It also replaces the model-state error response with `ApiValidationErrorResponse`.
- **Startup seeding**: `Program.Main` calls `Database.MigrateAsync()` and then seeds data. Identity users come from `DatabaseIdentityContextSeed`. Catalog and delivery data come from `DatabaseContextSeed`, which reads `DataAccess/SeedData/*.json`.
- **Single DbContext**: `DatabaseContext : IdentityDbContext<AppUser>` holds both Identity and domain tables. The SQLite connection is hard-coded in `OnConfiguring` as `../Camekan.DataAccess/Camekan.db`. The `DefaultConnectionString` in `appsettings.json` is unused, and only the `Redis` entry is read. Entity configuration is in `DataAccess/Config`.
- **Data access patterns**:
  - Generic `BaseRepository<T>` (T : `BaseEntity`) and `IUnitOfWork.Repository<T>()` create repositories lazily. Call `Complete()` to save.
  - Specific repositories (`ProductRepository`, `OrderRepository`, …) handle entity-specific queries.
  - Queries are built with the **Specification pattern**: subclass `BaseSpecification<T>` to set criteria, includes, ordering, and paging. `SpecificationEvaluater` applies it. Product list filtering, sorting, and paging use `ProductSpecParam`, together with a separate `...ForCountSpecification` for the total count.
- **Redis**:
  - `BasketRepository` stores baskets as JSON keyed by basket id, with a 30-day TTL.
  - `ResponseCacheService` and the `[Cached(seconds)]` action filter (`API/Attributes/CachedAttribute.cs`) cache `OkObjectResult` payloads. The key is the request path plus the sorted query string. Entries are never invalidated and simply expire after their TTL.
- **Errors**: `Util/Middleware/ExceptionMiddleware` turns exceptions into `ApiException`. `UseStatusCodePagesWithReExecute("/errors/{0}")` routes to `ErrorController`. Controllers return `ApiResponse` for error bodies. `BuggyController` has endpoints that deliberately trigger each error type, for testing the client's error handling.
- **Mapping**: AutoMapper profiles are in `Util/Mapping/MappingProfiles.cs`. Custom resolvers in `Util/Resolvers` build product image URLs (from `ApiUrl`) and order item data.
- **Auth/orders/payments**:
  - Authentication uses JWT via `TokenService`/`IdentityServiceExtension`. `ClaimsPrincipalExtension` and `UserManagerExtension` look up the current user.
  - `OrderService` creates orders from a basket plus a delivery method.
  - `PaymentService` handles Stripe PaymentIntents and the webhook in `PaymentController`. Stripe test keys are in `appsettings.json` and in the client's `environment.ts`.
- All controllers inherit `BaseApiController` (`[ApiController]`, route `api/[controller]`).

## Frontend architecture
- **No NgModules.** Every component is standalone and lists what it uses in its own `imports` array. `main.ts` calls `bootstrapApplication(AppComponent, appConfig)`. App-wide providers live in `app.config.ts`: router, `HttpClient`, toastr, animations, ngx-translate, and `provideZonelessChangeDetection()`.
- **Zoneless.** zone.js is not installed (no `polyfills.ts`). The view only updates on template events, signal changes, the `async` pipe, `markForCheck()`, and router navigation. A plain field assigned inside a `subscribe` callback (e.g. after an HTTP call) does **not** refresh the view: use a `signal` (as `ShopComponent`, `ProductDetailComponent`, `CheckoutPaymentComponent` do) or the `async` pipe. Stripe card `change` events come from iframes, so `CheckoutPaymentComponent` keeps its card state in signals. `TextInputComponent` calls `markForCheck()` on `statusChanges`, which covers async validators and `patchValue`/`reset` after HTTP calls. In dev mode, `provideCheckNoChangesConfig({ exhaustive: true })` logs `NG0100` for bindings that changed without notifying Angular.
- The HTTP interceptors in `core/interceptors/` are functional (`HttpInterceptorFn`), registered with `withInterceptors([...])` in `app.config.ts`. Order matters: `error`, `loading`, `jwt`. `jwt` adds the bearer token, `error` shows toastr messages and redirects, and `loading` drives ngx-spinner. `errorInterceptor` resolves `TranslateService` lazily through `Injector`, because the translate HTTP loader depends on `HttpClient` (circular dependency otherwise).
- `core/` holds the navbar, error pages, section header, `authGuard` (a `CanActivateFn`), and services such as `BusyService` and `ThemeService`. `shared/` holds models and reusable components.
- Routes are in `app.routes.ts`. The `shop`, `checkout`, `order`, and `account` features each have a `<feature>.routes.ts` that exports a `Routes` array (e.g. `SHOP_ROUTES`), lazy-loaded with `loadChildren`. `basket` is a single component, lazy-loaded with `loadComponent`. `order` and `checkout` are protected by `authGuard`. Route `data.breadcrumb` feeds xng-breadcrumb.
- State lives in services that use RxJS `BehaviorSubject`s (e.g. `BasketService`, `AccountService`). `OrderComponent` uses signals and `rxResource` instead. `localStorage` holds `token`, `basket_id`, `lang`, and `theme`, and `AppComponent` restores them on load.
- **i18n**: ngx-translate 15 is set up in `app.config.ts` via `importProvidersFrom(TranslateModule.forRoot(...))`, because v15 has no `provideTranslateService()`. `TranslateHttpLoader` reads `src/assets/i18n/{tr,en}.json`. Components import `TranslateModule` to use `{{ 'SECTION.KEY' | translate }}`. Languages are `tr` (the default) and `en`, and the navbar's TR/EN buttons switch between them. When you add or change UI text, add the key to both JSON files.
- Some third-party libraries are imported as NgModules inside standalone components, because those versions have no standalone API. Examples are xng-breadcrumb 8 (`BreadcrumbModule`) and ngx-translate 15 (`TranslateModule`). Keep ngx-toastr at 19.1+: 18.x changes its toast bindings without notifying Angular, which is unsafe without zone.js. The client is on RxJS 7.8, so ngx-toastr 20+ is possible but has not been tried.
- The API base URL comes from `environment.apiUrl`, except `ShopService`, which hard-codes `http://localhost:63484/api/`. Styling uses Bootstrap 4 with the Bootswatch theme and ngx-bootstrap.

## Known quirks (check before "fixing" unrelated code)
- `DatabaseContext.OnModelCreating` compares the provider name against `"Microsoft.EntityFrameWork.Sqlite"`, which has the wrong casing. As a result, the decimal→double and DateTimeOffset conversions never run.
- `SpecificationEvaluater` applies `OrderByDescending` with `OrderBy`.
- `BaseRepository.Add` calls `AddAsync` without awaiting it.
