export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type RoleType = 'client' | 'chef' | 'business' | 'admin' | 'kids' | 'influencer' | 'farmer'

export interface Database {
    __InternalSupabase: { PostgrestVersion: '12' }
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: RoleType
                    phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: RoleType
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: RoleType
                    phone?: string | null
                    updated_at?: string
                }
            }
            chef_profiles: {
                Row: {
                    id: string
                    user_id: string
                    bio: string | null
                    specialties: string[]
                    cuisine_types: string[]
                    hourly_rate: number
                    min_guests: number
                    max_guests: number
                    years_experience: number
                    certifications: string[]
                    gallery_urls: string[]
                    is_verified: boolean
                    is_available: boolean
                    avg_rating: number | null
                    total_reviews: number
                    location_city: string | null
                    location_state: string | null
                    slug: string
                    stripe_account_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    bio?: string | null
                    specialties?: string[]
                    cuisine_types?: string[]
                    hourly_rate?: number
                    min_guests?: number
                    max_guests?: number
                    years_experience?: number
                    certifications?: string[]
                    gallery_urls?: string[]
                    is_verified?: boolean
                    is_available?: boolean
                    location_city?: string | null
                    location_state?: string | null
                    slug: string
                    stripe_account_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    bio?: string | null
                    specialties?: string[]
                    cuisine_types?: string[]
                    hourly_rate?: number
                    min_guests?: number
                    max_guests?: number
                    years_experience?: number
                    certifications?: string[]
                    gallery_urls?: string[]
                    is_verified?: boolean
                    is_available?: boolean
                    avg_rating?: number | null
                    total_reviews?: number
                    location_city?: string | null
                    location_state?: string | null
                    slug?: string
                    stripe_account_id?: string | null
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    client_id: string
                    chef_id: string
                    event_date: string
                    event_time: string
                    duration_hours: number
                    guest_count: number
                    event_type: string
                    special_requests: string | null
                    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
                    total_amount: number
                    platform_fee: number
                    chef_payout: number
                    stripe_payment_intent_id: string | null
                    stripe_transfer_id: string | null
                    address_line1: string | null
                    address_city: string | null
                    address_state: string | null
                    address_zip: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    client_id: string
                    chef_id: string
                    event_date: string
                    event_time: string
                    duration_hours: number
                    guest_count: number
                    event_type: string
                    special_requests?: string | null
                    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
                    total_amount: number
                    platform_fee: number
                    chef_payout: number
                    stripe_payment_intent_id?: string | null
                    stripe_transfer_id?: string | null
                    address_line1?: string | null
                    address_city?: string | null
                    address_state?: string | null
                    address_zip?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
                    stripe_payment_intent_id?: string | null
                    stripe_transfer_id?: string | null
                    updated_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    booking_id: string
                    reviewer_id: string
                    chef_id: string
                    rating: number
                    comment: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    reviewer_id: string
                    chef_id: string
                    rating: number
                    comment?: string | null
                    created_at?: string
                }
                Update: {
                    rating?: number
                    comment?: string | null
                }
            }
            conversations: {
                Row: {
                    id: string
                    participant1: string
                    participant2: string
                    last_message: string | null
                    last_message_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    participant1: string
                    participant2: string
                    last_message?: string | null
                    last_message_at?: string
                    created_at?: string
                }
                Update: {
                    last_message?: string | null
                    last_message_at?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    is_read?: boolean
                }
            }
            chef_media: {
                Row: {
                    id: string
                    chef_id: string
                    video_url: string
                    thumbnail_url: string | null
                    title: string
                    description: string | null
                    cuisine_tags: string[]
                    likes: number
                    views: number
                    bookings_generated: number
                    comments_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    chef_id: string
                    video_url: string
                    thumbnail_url?: string | null
                    title: string
                    description?: string | null
                    cuisine_tags?: string[]
                    likes?: number
                    views?: number
                    bookings_generated?: number
                    comments_count?: number
                    created_at?: string
                }
                Update: {
                    title?: string
                    description?: string | null
                    cuisine_tags?: string[]
                    likes?: number
                    views?: number
                    bookings_generated?: number
                    comments_count?: number
                }
            }
            media_likes: {
                Row: {
                    id: string
                    user_id: string
                    media_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    media_id: string
                    created_at?: string
                }
                Update: Record<string, never>
            }
            media_comments: {
                Row: {
                    id: string
                    user_id: string
                    media_id: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    media_id: string
                    content: string
                    created_at?: string
                }
                Update: Record<string, never>
            }
            media_saves: {
                Row: {
                    id: string
                    user_id: string
                    media_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    media_id: string
                    created_at?: string
                }
                Update: Record<string, never>
            }
            chef_follows: {
                Row: {
                    id: string
                    follower_id: string
                    chef_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    follower_id: string
                    chef_id: string
                    created_at?: string
                }
                Update: Record<string, never>
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    title: string
                    body: string | null
                    href: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    title: string
                    body?: string | null
                    href?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    is_read?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: RoleType
            booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
        }
    }
}

// ─── Convenience row types ────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ChefProfile = Database['public']['Tables']['chef_profiles']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type ChefMedia = Database['public']['Tables']['chef_media']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type UserRole = RoleType
export type BookingStatus = Database['public']['Enums']['booking_status']

// ─── Extended join types ──────────────────────────────────────
export type ChefWithProfile = ChefProfile & {
    profiles: Profile
}

export type BookingWithDetails = Booking & {
    chef_profiles: ChefProfile & { profiles: Profile }
    client: Profile
}
