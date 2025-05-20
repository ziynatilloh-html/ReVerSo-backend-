export enum OrderStatus {
  PENDING = "PENDING", // Order created, not paid
  PAID = "PAID", // Payment completed
  SHIPPED = "SHIPPED", // Order shipped
  DELIVERED = "DELIVERED", // Customer received
  CANCELED = "CANCELED", // Manually canceled
}
export enum PaymentMethod {
  CARD = "CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}
