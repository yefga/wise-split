// UI Constants - Centralized string literals for the application

// App Branding
export const APP_NAME = 'WiseSplit';
export const APP_CREATOR = 'Yefga';

// Default Values
export const DEFAULT_CURRENCY = 'IDR';
export const DEFAULT_TAB = 'expenses' as const;
export const EVERYONE_OPTION = 'Everyone';
export const STORAGE_KEY = 'smart-split-storage';

// Section Titles
export const SECTION_PEOPLE = 'People';
export const SECTION_ADD_EXPENSE = 'Add Expense';
export const SECTION_ACTIVITY = 'Activity';
export const SECTION_SETTLEMENT = 'Settlement';
export const SECTION_NET_BALANCES = 'Net Balances';
export const SECTION_SETTLEMENT_PLAN = 'Settlement Plan';

// Confirm Modal Messages
export const CONFIRM_CHANGE_CURRENCY = 'Change Currency?';
export const CONFIRM_RESET = 'Reset everything?';
export const CONFIRM_RESET_MESSAGE = 'Changing the currency will permanently delete all current expenses and reset the app. This action cannot be undone.';
export const CONFIRM_RESET_BUTTON = 'Reset & Change';
export const CONFIRM_CANCEL_BUTTON = 'Cancel';

// Button Labels
export const BTN_ADD = 'Add';
export const BTN_ADD_EXPENSE = 'Add Expense';
export const BTN_HISTORY = 'History';
export const BTN_PLAN = 'Plan';

// Input Labels
export const LABEL_CURRENCY = 'Currency';
export const LABEL_TOTAL = 'Total';
export const LABEL_DESCRIPTION = 'Description';
export const LABEL_AMOUNT = 'Amount';
export const LABEL_ORDERED_BY = 'Ordered By';
export const LABEL_PAID_BY = 'Paid By';

// Placeholders
export const PLACEHOLDER_NAME = 'Enter Name...';
export const PLACEHOLDER_DESCRIPTION = 'e.g. Dinner';
export const PLACEHOLDER_AMOUNT = '0.00';
export const PLACEHOLDER_SELECT = 'Select...';

// Empty State Messages
export const MSG_NO_PEOPLE = 'Add friends to start splitting';
export const MSG_NO_RECORDS = 'No records yet.';
export const MSG_NO_DATA = 'No data';
export const MSG_ADD_PEOPLE_FIRST = 'Add people above first.';
export const MSG_ADD_EXPENSES = 'Add expenses';
export const MSG_SETTLED_UP = 'Settled up!';

// Validation Messages
export const ERROR_NAME_TAKEN = 'is taken. Please add more identity.';

// Expense Labels
export const LABEL_PAID = ' paid ';
export const LABEL_TO_PREFIX = 'To: ';
export const LABEL_HIMSELF = 'Himself';
export const LABEL_PAY_TO = ' pay to ';
export const LABEL_FOR = ' for ';

// Copyright
export const COPYRIGHT_YEAR = new Date().getFullYear();
export const COPYRIGHT_TEXT = `© ${COPYRIGHT_YEAR} ${APP_NAME}. Created by ${APP_CREATOR}.`;
