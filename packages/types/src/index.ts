/* =====================
   Agent & Messaging
===================== */

export type AgentType = 'router' | 'support' | 'order' | 'billing';

export type MessageSender = 'user' | 'agent';

/* =====================
   Core Domain Models
===================== */

export interface User {
  id: number;
  name: string;
  email: string;
}

/* =====================
   Conversation
===================== */

export interface Conversation {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

/* =====================
   Message
===================== */

export interface Message {
  id: number;
  conversationId: number;
  sender: MessageSender;
  agentType?: AgentType;
  text: string;
  createdAt: Date;
}

/* =====================
   Order
===================== */

export type OrderStatus =
  | 'placed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  placedAt: Date;
  deliveryDate?: Date | null;
}

/* =====================
   Payment
===================== */

export type PaymentStatus = 'paid' | 'failed' | 'pending';
export type RefundStatus = 'none' | 'processing' | 'completed';

export interface Payment {
  id: number;
  userId: number;
  orderId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  refundStatus: RefundStatus;
  createdAt: Date;
}
