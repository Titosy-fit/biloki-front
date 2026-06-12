// src/types/index.ts
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    sku: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    stock?: Stock;
}

export interface Stock {
    id: number;
    product_id: number;
    quantity: number;
    reserved_quantity: number;
    alert_threshold: number;
    location: string | null;
    created_at: string;
    updated_at: string;
}

export interface StockMovement {
    id: number;
    product_id: number;
    type: 'in' | 'out' | 'adjustment' | 'reserve' | 'unreserve';
    quantity: number;
    previous_quantity: number;
    new_quantity: number;
    reason: string | null;
    user_id: number | null;
    created_at: string;
}

export interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string;
    status: 'active' | 'inactive';
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}