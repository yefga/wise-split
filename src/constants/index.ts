import { Currency } from '@app-types';

export const CURRENCIES: Currency[] = [
    { label: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', code: 'IDR', locale: 'id-ID' },
    { label: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', code: 'MYR', locale: 'ms-MY' },
    { label: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', code: 'SGD', locale: 'en-SG' },
    { label: 'Thai Baht', symbol: '฿', flag: '🇹🇭', code: 'THB', locale: 'th-TH' },
    { label: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', code: 'PHP', locale: 'en-PH' },
    { label: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', code: 'VND', locale: 'vi-VN' },
    { label: 'Lao Kip', symbol: '₭', flag: '🇱🇦', code: 'LAK', locale: 'lo-LA' },
    { label: 'Cambodian Riel', symbol: '៛', flag: '🇰🇭', code: 'KHR', locale: 'km-KH' },
    { label: 'Myanmar Kyat', symbol: 'K', flag: '🇲🇲', code: 'MMK', locale: 'my-MM' },
    { label: 'Brunei Dollar', symbol: 'B$', flag: '🇧🇳', code: 'BND', locale: 'ms-BN' },
    { label: 'South Korean Won', symbol: '₩', flag: '🇰🇷', code: 'KRW', locale: 'ko-KR' },
    { label: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', code: 'CNY', locale: 'zh-CN' },
    { label: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', code: 'JPY', locale: 'ja-JP' },
    { label: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', code: 'RUB', locale: 'ru-RU' },
    { label: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦', code: 'SAR', locale: 'ar-SA' },
    { label: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', code: 'AED', locale: 'ar-AE' },
    { label: 'US Dollar', symbol: '$', flag: '🇺🇸', code: 'USD', locale: 'en-US' },
    { label: 'Euro', symbol: '€', flag: '🇪🇺', code: 'EUR', locale: 'de-DE' },
    { label: 'British Pound', symbol: '£', flag: '🇬🇧', code: 'GBP', locale: 'en-GB' },];

export * from './ui';