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
    total_expenses: number;
    total_categories: number;
    this_month_expenses: number;
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
  