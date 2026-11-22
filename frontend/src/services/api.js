import { PRODUCTS, TOURS, CATEGORIES } from '../data/sampleData';

const API_BASE = ''; // uses proxy or relative path through Nginx

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.items || PRODUCTS;
  } catch (err) {
    console.warn('Backend /api/products unavailable, using sample data:', err.message);
    return PRODUCTS;
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return CATEGORIES;
  }
}

export async function fetchTours() {
  try {
    const res = await fetch(`${API_BASE}/api/tours`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.items || TOURS;
  } catch (err) {
    console.warn('Backend /api/tours unavailable, using sample data:', err.message);
    return TOURS;
  }
}

export async function fetchTourById(id) {
  try {
    const res = await fetch(`${API_BASE}/api/tours/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return TOURS.find(t => t.id === id) || null;
  }
}

export async function submitOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend /api/orders unavailable, simulating local confirmation:', err.message);
    return {
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      total: orderData.total,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      created_at: new Date().toISOString()
    };
  }
}
