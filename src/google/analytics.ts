import { logEvent as firebaseLogEvent, setUserId as firebaseSetUserId, setUserProperties as firebaseSetUserProperties } from '@firebase/analytics';
import { analytics } from './config';

// Analytics event names following Firebase conventions
export const AnalyticsEvents = {
    // App lifecycle
    APP_OPENED: 'app_opened',
    SESSION_START: 'session_start',

    // Theme & Settings
    THEME_CHANGED: 'theme_changed',
    CURRENCY_CHANGED: 'currency_changed',

    // People Management
    PERSON_ADDED: 'person_added',
    PERSON_REMOVED: 'person_removed',

    // Expense Management
    EXPENSE_ADDED: 'expense_added',
    EXPENSE_DELETED: 'expense_deleted',
    EXPENSE_VIEWED: 'expense_viewed',

    // Navigation
    TAB_CHANGED: 'tab_changed',

    // Actions
    DATA_RESET: 'data_reset',
    SETTLEMENT_COPIED: 'settlement_copied',

    // Engagement
    PAGE_VIEW: 'page_view',
    ERROR_OCCURRED: 'error_occurred',
} as const;

/**
 * Track custom analytics events
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (!analytics) {
        console.warn('Analytics not initialized. Event not tracked:', eventName);
        return;
    }

    try {
        firebaseLogEvent(analytics, eventName as any, {
            timestamp: new Date().toISOString(),
            ...params
        });
        console.log(`📊 Analytics Event: ${eventName}`, params);
    } catch (error) {
        console.error('Error tracking event:', error);
    }
};

/**
 * Track page views
 */
export const trackPageView = (pageName: string, pageTitle?: string) => {
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
        page_name: pageName,
        page_title: pageTitle || pageName,
    });
};

/**
 * Track when a person is added
 */
export const trackPersonAdded = (personName: string, totalPeople: number) => {
    trackEvent(AnalyticsEvents.PERSON_ADDED, {
        person_name: personName,
        total_people: totalPeople,
    });
};

/**
 * Track when a person is removed
 */
export const trackPersonRemoved = (personName: string, totalPeople: number) => {
    trackEvent(AnalyticsEvents.PERSON_REMOVED, {
        person_name: personName,
        total_people: totalPeople,
    });
};

/**
 * Track when an expense is added
 */
export const trackExpenseAdded = (expense: {
    amount: number;
    payer: string;
    orderedBy: string;
    involved: string[];
    currency: string;
}) => {
    trackEvent(AnalyticsEvents.EXPENSE_ADDED, {
        expense_amount: expense.amount,
        expense_payer: expense.payer,
        expense_ordered_by: expense.orderedBy,
        people_involved: expense.involved.length,
        currency: expense.currency,
        is_everyone: expense.orderedBy === 'Everyone',
    });
};

/**
 * Track when an expense is deleted
 */
export const trackExpenseDeleted = (expenseId: number, totalExpenses: number) => {
    trackEvent(AnalyticsEvents.EXPENSE_DELETED, {
        expense_id: expenseId,
        total_expenses: totalExpenses,
    });
};

/**
 * Track theme changes
 */
export const trackThemeChanged = (isDark: boolean) => {
    trackEvent(AnalyticsEvents.THEME_CHANGED, {
        theme: isDark ? 'dark' : 'light',
    });
};

/**
 * Track currency changes
 */
export const trackCurrencyChanged = (currency: string) => {
    trackEvent(AnalyticsEvents.CURRENCY_CHANGED, {
        currency,
    });
};

/**
 * Track tab navigation
 */
export const trackTabChanged = (tabName: string) => {
    trackEvent(AnalyticsEvents.TAB_CHANGED, {
        tab_name: tabName,
    });
};

/**
 * Track when data is reset
 */
export const trackDataReset = (peopleCount: number, expenseCount: number) => {
    trackEvent(AnalyticsEvents.DATA_RESET, {
        people_count: peopleCount,
        expense_count: expenseCount,
    });
};

/**
 * Track when a settlement is copied
 */
export const trackSettlementCopied = (settlementId: number) => {
    trackEvent(AnalyticsEvents.SETTLEMENT_COPIED, {
        settlement_id: settlementId,
    });
};

/**
 * Track errors
 */
export const trackError = (errorMessage: string, errorContext?: string) => {
    trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
        error_message: errorMessage,
        error_context: errorContext,
    });
};

/**
 * Set user ID for analytics (optional - use if you implement authentication)
 */
export const setAnalyticsUserId = (userId: string) => {
    if (!analytics) return;

    try {
        firebaseSetUserId(analytics, userId);
        console.log('📊 Analytics User ID set:', userId);
    } catch (error) {
        console.error('Error setting user ID:', error);
    }
};

/**
 * Set user properties (optional - for demographic or behavioral segmentation)
 */
export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
    if (!analytics) return;

    try {
        firebaseSetUserProperties(analytics, properties);
        console.log('📊 Analytics User Properties set:', properties);
    } catch (error) {
        console.error('Error setting user properties:', error);
    }
};

/**
 * Track engagement metrics - call this on app initialization
 */
export const trackAppOpened = () => {
    trackEvent(AnalyticsEvents.APP_OPENED);
};

/**
 * Track session start with basic app state
 */
export const trackSessionStart = (params?: {
    peopleCount?: number;
    expenseCount?: number;
    currency?: string;
    theme?: 'light' | 'dark';
}) => {
    trackEvent(AnalyticsEvents.SESSION_START, params);
};
