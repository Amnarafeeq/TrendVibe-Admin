import { Product } from "@/app/admin/products/page";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
} 