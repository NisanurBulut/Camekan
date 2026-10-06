export interface DashboardData {
  kpis: {
    totalBooks: number;
    totalSales: number;
    authors: number;
    categories: number;
  };
  salesTrend: { month: string; total: number }[];
  categories: { name: string; count: number }[];
  topBooks: { title: string; sales: number }[];
  recentBooks: { title: string; addedAt: string | null }[];
  trending: { title: string; change: number | null }[];
}
