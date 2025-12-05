export interface User {
    _id: string;
    email: string;
    name: string;
    photo_uri: string;
    is_new_user: boolean;
    phone_no?: string;
    location?: string;
}

export interface GoogleLoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface LogoutResponse {
    message: string;
}

export interface Category {
    _id: string;
    name: string;
    color: string;
    icon: string;
    subcategories: Subcategory[];
}

export interface CreateUpdateCategoryResponse {
    category: Category;
}
export interface Subcategory {
    _id: string;
    name: string;
}

export interface Setting {
    _id: string;
    notification: {
        push: boolean;
        email: boolean;
    };
}

export interface ProfileStatsResponse {
    total_expenses_count: number;
    total_expenses_amount: number;
    total_categories_count: number;
}
export interface AlertThreshold {
    percentage: number;
    enabled: boolean;
}

export interface BudgetAlert {
  enabled: boolean;
  thresholds: AlertThreshold[];
}

export interface DailyReminder {
  enabled: boolean;
}

export interface WeeklyReport {
  enabled: boolean;
}

export interface LargeExpense {
  enabled: boolean;
  thresholdAmount: number;
}

export interface Alert {
  budget: BudgetAlert;
  dailyReminder: DailyReminder;
  weeklyReport: WeeklyReport;
  largeExpense: LargeExpense;
}
export interface FetchExpensesResponse {
  expenses: Expense[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  skip: number;
}
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  datetime?: string;
  merchant?: string;
  location?: string;
  notes?: string;
  category_id?: Category;
  sub_category_id?: Subcategory;
  line_items: LineItem[];
}
export interface LineItem {
  _id: string;
  amount: number;
  title: string;
}

export interface  FetchExpensesPayload {
  start_date?: string;
  end_date?: string;
  category_ids?: string;
  limit?: number;
  skip?: number;
  q?: string;
  sort?: string;
  min_amount?: number;
  max_amount?: number;
}

export enum BudgetType {
  OVERALL = 'overall',
  PARTICULAR = 'particular',
}

export enum BudgetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Budget {
  _id: string;
  amount: number;
  category_id?: Category;
  type: BudgetType;
  status: BudgetStatus;
  period?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryExpenseStat {
  category: Category;
  total_amount: number;
  expense_count: number;
  category_id: string;
}

export interface ExpenseStats {
  start_date: string;
  end_date: string;
  total_amount: number;
  total_expense_count: number;
  categories: CategoryExpenseStat[];
}

export interface GetBudgetsResponse {
  budgets: Budget[];
  expenseStats: ExpenseStats;
}

export interface Notification {
  _id: string;
  label: string; // mapped from backend 'label'
  description?: string;
  redirect_uri?: string;
  created_at: string;
}

export interface FrequencyData {
  period: string;
  expenses: Expense[];
}

export interface FrencyDataResponse {
  frequency: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  total_expense_count: number;
  average_expense_amount: number;
  data: FrequencyData[];
}

export interface MonthlyExpensesResponse {
  expenseData: FrencyDataResponse;
  categoryData: ExpenseStats;
}