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