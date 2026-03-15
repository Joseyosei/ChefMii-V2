import type { Metadata } from 'next'
import { Roboto, Libre_Caslon_Text } from 'next/font/google'
import { AuthProvider } from '@/context/auth-context'
import './globals.css'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700', '900'],
    variable: '--font-roboto',
    display: 'swap',
})

const caslon = Libre_Caslon_Text({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-caslon',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        template: '%s | ChefMii',
        default: 'ChefMii – Hire a Chef for Any Occasion',
    },
    description: 'ChefMii connects you with top private chefs globally. From home dinners to presidential banquets.',
    keywords: ['private chef', 'chef booking', 'personal chef', 'chef marketplace'],
    authors: [{ name: 'ChefMii' }],
    openGraph: {
        title: 'ChefMii – Hire a Chef for Any Occasion',
        description: 'Connect with top chefs globally for any event.',
        type: 'website',
        locale: 'en_US',
        siteName: 'ChefMii',
    },
    robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${roboto.variable} ${caslon.variable}`}>
            <body className="min-h-screen bg-background font-sans antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
