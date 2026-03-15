import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Format currency */
export function formatPrice(
    price: number,
    options: { currency?: string; notation?: Intl.NumberFormatOptions['notation'] } = {}
) {
    const { currency = 'USD', notation = 'standard' } = options
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation,
        maximumFractionDigits: 2,
    }).format(price)
}

/** Format a date to a human-readable string */
export function formatDate(date: Date | string, includeTime = false) {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    })
}

/** Truncate text */
export function truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '…'
}

/** Generate a URL-friendly slug */
export function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/** Calculate platform fee amount */
export function calculatePlatformFee(amount: number, feePercent = 10): number {
    return Math.round(amount * (feePercent / 100))
}

/** Get initials from a full name */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
