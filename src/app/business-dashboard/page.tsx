'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import {
    LayoutDashboard, Calendar, FileText, Users, GraduationCap,
    Settings, LogOut, TrendingUp, DollarSign, CheckCircle,
    Download, Plus, ChevronRight, Bell, Building2, Loader2
} from 'lucide-react'
import { useBusinessDashboardData, CorporateEvent } from '@/hooks/useBusinessDashboardData'

/* ── Types ─────────────────────────────────────────────── */
type InvoiceStatus = 'paid' | 'pending' | 'overdue'
interface Invoice { id: string; ref: string; event: string; date: string; amount: string; status: InvoiceStatus }
interface TeamMember { id: string; name: string; role: string; dept: string; training: number }

/* ── Mock data ─────────────────────────────────────────── */
// Temporary placeholders for incomplete sections
const INVOICES: Invoice[] = [
    { id: '1', ref: 'INV-2026-012', event: 'Q1 Leadership Summit', date: '1 Mar 2026', amount: '£8,400', status: 'pending' },
    { id: '2', ref: 'INV-2026-008', event: 'Annual Company Banquet', date: '15 Jan 2026', amount: '£42,000', status: 'paid' },
    { id: '3', ref: 'INV-2026-003', event: 'Xmas Party 2025', date: '20 Dec 2025', amount: '£12,300', status: 'paid' },
    { id: '4', ref: 'INV-2025-094', event: 'Board Retreat Catering', date: '5 Oct 2025', amount: '£6,750', status: 'overdue' },
]
const TEAM: TeamMember[] = [
    { id: '1', name: 'Sarah Mitchell', role: 'Head of Events', dept: 'Hospitality', training: 4 },
    { id: '2', name: 'David Okafor', role: 'Event Coordinator', dept: 'Hospitality', training: 2 },
    { id: '3', name: 'Linda Chen', role: 'Executive Assistant', dept: 'Admin', training: 6 },
    { id: '4', name: 'James Patel', role: 'F&B Manager', dept: 'Catering', training: 5 },
]
const COURSES = [
    { id: '1', title: 'Food Safety & Hygiene Level 2', staff: 3, progress: 80, due: '31 Mar 2026' },
    { id: '2', title: 'Event Planning Masterclass', staff: 2, progress: 45, due: '15 Apr 2026' },
    { id: '3', title: 'Allergen Awareness for Hospitality', staff: 4, progress: 100, due: 'Completed' },
]

const INV_STYLES: Record<InvoiceStatus, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
}

const totalSpend = 69450
const thisMonth = 8400

const NAV = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'academy', label: 'Staff Training', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
]

/* ── Sub-views ─────────────────────────────────────────── */
function OverviewView({ events }: { events: CorporateEvent[] }) {
    const activeEventsCount = events.filter(e => e.status !== 'completed').length
    const calculatedSpend = events.filter(e => e.status === 'completed').reduce((sum, e) => sum + Number(e.budget || 0), 0)
    return (
        <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Spend 2026', value: `£${(calculatedSpend || totalSpend).toLocaleString()}`, sub: 'YTD', icon: DollarSign, color: 'text-terracotta' },
                    { label: 'This Month', value: `£${thisMonth.toLocaleString()}`, sub: '1 confirmed event', icon: TrendingUp, color: 'text-blue-500' },
                    { label: 'Active Events', value: activeEventsCount.toString(), sub: 'planned & confirmed', icon: Calendar, color: 'text-green-500' },
                    { label: 'Staff Enrolled', value: '9', sub: '3 courses active', icon: GraduationCap, color: 'text-purple-500' },
                ].map(({ label, value, sub, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Icon className={`w-4 h-4 ${color}`} /></div>
                        </div>
                        <p className={`text-3xl font-black ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Upcoming events */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold">Upcoming Events</h2>
                    <button className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1">+ Add Event</button>
                </div>
                {events.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No corporate events listed.</div>
                ) : events.filter(e => e.status !== 'completed').slice(0, 3).map(ev => (
                    <div key={ev.id} className="px-6 py-4 border-b border-border last:border-0 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{ev.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(ev.event_date).toLocaleDateString()} · {ev.guests} guests</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-terracotta">£{ev.budget}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ev.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending invoices */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border"><h2 className="font-bold">Outstanding Invoices</h2></div>
                {INVOICES.filter(i => i.status !== 'paid').map(inv => (
                    <div key={inv.id} className="px-6 py-4 border-b border-border last:border-0 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-sm">{inv.ref}</p>
                            <p className="text-xs text-muted-foreground">{inv.event} · {inv.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="font-bold">{inv.amount}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INV_STYLES[inv.status]}`}>{inv.status}</span>
                            <button className="px-3 py-1.5 text-xs gradient-brand text-white rounded-lg font-bold hover:opacity-90">Pay Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function EventsView({ events }: { events: CorporateEvent[] }) {
    const [showNew, setShowNew] = useState(false)
    return (
        <div>
            <button onClick={() => setShowNew(!showNew)} className="mb-6 flex items-center gap-2 px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />New Event
            </button>
            {showNew && (
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                    <h2 className="font-bold text-lg mb-4">Create New Event</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[{ label: 'Event Name', placeholder: 'e.g. Q2 Product Launch' }, { label: 'Date', placeholder: 'DD/MM/YYYY' }, { label: 'Expected Guests', placeholder: 'e.g. 50' }, { label: 'Estimated Budget (£)', placeholder: 'e.g. 5000' }].map(f => (
                            <div key={f.label}>
                                <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                                <input placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">Create Event</button>
                        <button onClick={() => setShowNew(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
                        No corporate events planned yet.
                    </div>
                ) : events.map(ev => (
                    <div key={ev.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-terracotta" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="font-bold">{ev.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.status === 'completed' ? 'bg-blue-100 text-blue-700' : ev.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ev.status}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{new Date(ev.event_date).toLocaleDateString()} · {ev.guests} guests</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <p className="font-black text-lg text-terracotta">£{ev.budget}</p>
                            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function InvoicesView() {
    return (
        <div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold">Invoice History</h2>
                    <button className="text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-1"><Download className="w-3 h-3" />Export CSV</button>
                </div>
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            {['Reference', 'Event', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {INVOICES.map(inv => (
                            <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-mono font-semibold">{inv.ref}</td>
                                <td className="px-4 py-3 text-sm">{inv.event}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inv.date}</td>
                                <td className="px-4 py-3 text-sm font-bold">{inv.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INV_STYLES[inv.status]}`}>{inv.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="flex items-center gap-1 text-xs text-terracotta hover:underline font-medium"><Download className="w-3 h-3" />PDF</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function TeamView() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">{TEAM.length} team members</p>
                <button className="flex items-center gap-2 px-4 py-2 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90"><Plus className="w-4 h-4" />Invite Member</button>
            </div>
            {TEAM.map(m => (
                <div key={m.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0">{m.name.split(' ').map(w => w[0]).join('')}</div>
                    <div className="flex-1">
                        <p className="font-bold">{m.name}</p>
                        <p className="text-sm text-muted-foreground">{m.role} · {m.dept}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Courses completed</p>
                        <p className="font-black text-xl gradient-text-brand">{m.training}</p>
                    </div>
                    <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"><Settings className="w-4 h-4 text-muted-foreground" /></button>
                </div>
            ))}
        </div>
    )
}

function AcademyView() {
    return (
        <div>
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
                <GraduationCap className="w-8 h-8 text-terracotta shrink-0" />
                <div>
                    <p className="font-bold">ChefMii Academy for Teams</p>
                    <p className="text-sm text-muted-foreground">Upskill your hospitality and events team with expert-led online courses.</p>
                </div>
                <Link href="/academy" className="shrink-0 px-4 py-2 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">Browse Courses</Link>
            </div>
            <h2 className="font-bold text-lg mb-4">Active Training Programmes</h2>
            <div className="space-y-4">
                {COURSES.map(c => (
                    <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-bold">{c.title}</p>
                                <p className="text-sm text-muted-foreground">{c.staff} staff enrolled · Due: {c.due}</p>
                            </div>
                            <span className={`text-sm font-black ${c.progress === 100 ? 'text-green-500' : 'text-terracotta'}`}>{c.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all ${c.progress === 100 ? 'bg-green-500' : 'gradient-brand'}`} style={{ width: `${c.progress}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingsView() {
    const [saved, setSaved] = useState(false)
    return (
        <div className="max-w-xl space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-5">Company Profile</h2>
                {[{ l: 'Company Name', v: 'Apex Enterprises Ltd' }, { l: 'Industry', v: 'Financial Services' }, { l: 'Billing Email', v: 'finance@apex.com' }, { l: 'VAT Number', v: 'GB123456789' }].map(f => (
                    <div key={f.l} className="mb-4">
                        <label className="block text-sm font-semibold mb-1.5">{f.l}</label>
                        <input defaultValue={f.v} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                    </div>
                ))}
                <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} className="px-6 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">Payment Methods</h2>
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-blue-800 dark:text-blue-400">Corporate card on file</p>
                        <p className="text-xs text-blue-700 dark:text-blue-500">Visa •••• 7123 · Expires 09/27</p>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline font-medium">Replace</button>
                </div>
            </div>
        </div>
    )
}

/* ── Page ──────────────────────────────────────────────── */
export default function BusinessDashboardPage() {
    const [tab, setTab] = useState('overview')
    const { events, loading, error } = useBusinessDashboardData()

    const titles: Record<string, string> = {
        overview: 'Good morning, Apex Team! 🏢', events: 'Event Management', invoices: 'Invoice History', team: 'Team Management', academy: 'Staff Training', settings: 'Company Settings',
    }
    return (
        <>
            <Navbar />
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card flex-col hidden md:flex shrink-0">
                    <div className="p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-foreground text-background font-black flex items-center justify-center text-sm"><Building2 className="w-5 h-5" /></div>
                            <div>
                                <p className="font-bold text-sm">Apex Enterprises</p>
                                <p className="text-xs text-muted-foreground">Enterprise Account</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-3 space-y-0.5">
                        {NAV.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'gradient-brand text-white' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}>
                                <Icon className="w-4 h-4" />{label}
                                {id === 'invoices' && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">1</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors">
                            <LogOut className="w-4 h-4" />Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">{titles[tab]}</h1>
                            <p className="text-xs text-muted-foreground">Friday, 6 March 2026</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-foreground text-background font-bold text-xs flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
                            </div>
                        ) : error ? (
                            <div className="p-6 text-red-500 font-bold text-center">Failed to load business data: {error.message}</div>
                        ) : (
                            <>
                                {tab === 'overview' && <OverviewView events={events} />}
                                {tab === 'events' && <EventsView events={events} />}
                                {tab === 'invoices' && <InvoicesView />}
                                {tab === 'team' && <TeamView />}
                                {tab === 'academy' && <AcademyView />}
                                {tab === 'settings' && <SettingsView />}
                            </>
                        )}
                    </div>
                </main>
            </div>
            <ChatbotWidget />
        </>
    )
}
