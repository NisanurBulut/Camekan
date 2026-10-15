-- Camekan dashboard views (SQLite).
-- The API runs this file on every start (Program.Main), so it must stay safe to run again.
-- Manual run: sqlite3 Camekan.DataAccess/Camekan.db < Camekan.DataAccess/Sql/dashboard_views.sql

BEGIN TRANSACTION;

DROP VIEW IF EXISTS vw_dashboard_trending;
DROP VIEW IF EXISTS vw_dashboard_recent_books;
DROP VIEW IF EXISTS vw_dashboard_top_books;
DROP VIEW IF EXISTS vw_dashboard_category_distribution;
DROP VIEW IF EXISTS vw_dashboard_sales_trend;
DROP VIEW IF EXISTS vw_dashboard_kpis;
DROP VIEW IF EXISTS vw_dashboard_order_lines;

-- One row per sold order line. Failed payments are not sales (the old misspelled value is excluded too).
-- OrderDate is text and some rows are not zero-padded ("2026-9-01 ..."), which date() rejects,
-- so year/month/day are cut out and re-formatted as YYYY-MM-DD.
CREATE VIEW vw_dashboard_order_lines AS
WITH parts AS (
  SELECT
    o.Id AS OrderId,
    substr(o.OrderDate, 1, 4) AS y,
    substr(o.OrderDate, 6) AS rest,
    i.ItemOrdered_ProductItemId AS ProductId,
    i.ItemOrdered_ProductName AS ProductName,
    i.Quantity,
    i.Price
  FROM tOrder o
  JOIN tOrderItem i ON i.OrderEntityId = o.Id
  WHERE o.Status NOT IN ('PaymentFailed', 'PaymenyFailed')
)
SELECT
  OrderId,
  printf('%s-%02d-%02d', y,
         CAST(substr(rest, 1, instr(rest, '-') - 1) AS INTEGER),
         CAST(substr(rest, instr(rest, '-') + 1, 2) AS INTEGER)) AS OrderDay,
  ProductId,
  ProductName,
  Quantity,
  Price * Quantity AS LineTotal
FROM parts;

-- The schema has no author table; PublisherCount (tProductBrand) stands in for the "Authors" tile.
CREATE VIEW vw_dashboard_kpis AS
SELECT
  (SELECT COUNT(*) FROM tProduct) AS TotalBooks,
  (SELECT COALESCE(SUM(Quantity), 0) FROM vw_dashboard_order_lines) AS TotalSales,
  (SELECT COALESCE(SUM(LineTotal), 0) FROM vw_dashboard_order_lines) AS TotalRevenue,
  (SELECT COUNT(*) FROM tProductBrand) AS PublisherCount,
  (SELECT COUNT(*) FROM tProductType) AS CategoryCount;

-- Last 12 months including the current one; months without sales are listed with 0.
CREATE VIEW vw_dashboard_sales_trend AS
WITH RECURSIVE months(n, Month) AS (
  SELECT 0, strftime('%Y-%m', 'now', 'start of month')
  UNION ALL
  SELECT n + 1, strftime('%Y-%m', 'now', 'start of month', '-' || (n + 1) || ' months')
  FROM months
  WHERE n < 11
)
SELECT
  m.Month,
  COALESCE(SUM(l.Quantity), 0) AS UnitsSold,
  COALESCE(SUM(l.LineTotal), 0) AS Revenue
FROM months m
LEFT JOIN vw_dashboard_order_lines l ON substr(l.OrderDay, 1, 7) = m.Month
GROUP BY m.Month
ORDER BY m.Month;

CREATE VIEW vw_dashboard_category_distribution AS
SELECT
  t.Id AS CategoryId,
  t.Name,
  (SELECT COUNT(*) FROM tProduct p WHERE p.ProductTypeId = t.Id) AS BookCount,
  (SELECT COALESCE(SUM(l.Quantity), 0)
     FROM vw_dashboard_order_lines l
     JOIN tProduct p ON p.Id = l.ProductId
    WHERE p.ProductTypeId = t.Id) AS UnitsSold
FROM tProductType t
ORDER BY BookCount DESC, t.Name;

CREATE VIEW vw_dashboard_top_books AS
SELECT
  ProductId,
  MAX(ProductName) AS Title,
  SUM(Quantity) AS UnitsSold
FROM vw_dashboard_order_lines
GROUP BY ProductId
ORDER BY UnitsSold DESC, Title
LIMIT 5;

-- tProduct has no created date; the highest Ids are the most recently added rows.
CREATE VIEW vw_dashboard_recent_books AS
SELECT
  Id AS ProductId,
  Name AS Title,
  NULL AS AddedAt
FROM tProduct
ORDER BY Id DESC
LIMIT 4;

-- Units sold in the last 7 days compared with the 7 days before. ChangePercent is NULL when the
-- previous week had no sales (a percentage of zero is undefined).
CREATE VIEW vw_dashboard_trending AS
WITH weekly AS (
  SELECT
    ProductId,
    MAX(ProductName) AS Title,
    SUM(CASE WHEN OrderDay >= date('now', '-6 days') THEN Quantity ELSE 0 END) AS ThisWeek,
    SUM(CASE WHEN OrderDay >= date('now', '-13 days') AND OrderDay < date('now', '-6 days') THEN Quantity ELSE 0 END) AS LastWeek
  FROM vw_dashboard_order_lines
  WHERE OrderDay >= date('now', '-13 days')
  GROUP BY ProductId
)
SELECT
  ProductId,
  Title,
  ThisWeek,
  LastWeek,
  CASE WHEN LastWeek = 0 THEN NULL ELSE ROUND((ThisWeek - LastWeek) * 100.0 / LastWeek) END AS ChangePercent
FROM weekly
WHERE ThisWeek > 0
ORDER BY ThisWeek DESC, Title
LIMIT 4;

COMMIT;
