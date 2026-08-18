export type TransactionStatus = "Succeed" | "Failed" | "Pending";

export type InvoiceParty = {
  name: string;
  company: string;
  phone: string;
  email: string;
};

export type InvoiceOrderItem = {
  order: string;
  amount: number;
  currency: string;
};

export type InvoicePriceSummary = {
  couponLabel: string;
  couponAmount: number;
  coinsLabel: string;
  coinsAmount: number;
  grossTotal: number;
  total: number;
  receivedPayment: number;
  currency: string;
};

export type PaymentMethodInfo = {
  method: string;
  maskedNumber: string;
  holderName: string;
};

export type PaymentTransaction = {
  id: string;
  provider: string;
  transactionId: string;
  userId: string;
  userName: string;
  purpose: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  initiatedDate: string;
  orderId: string;
  customerId: string;
  purchaseDate: string;
  billingTo: InvoiceParty;
  billingFrom: InvoiceParty;
  paymentMethod: PaymentMethodInfo;
  orderItems: InvoiceOrderItem[];
  priceSummary: InvoicePriceSummary;
};

export const transactionStatusOptions: TransactionStatus[] = [
  "Succeed",
  "Failed",
  "Pending",
];

export const transactions: PaymentTransaction[] = [
  {
    id: "t1",
    provider: "Stripe Checkout",
    transactionId: "TXN-44621",
    userId: "u1",
    userName: "Ahmed Ali",
    purpose: "Certificate Purchase",
    amount: 1400,
    currency: "USD",
    status: "Succeed",
    initiatedDate: "12 Nov 2025",
    orderId: "2708907172",
    customerId: "2708907172",
    purchaseDate: "18-06-23 / 12:53:20",
    billingTo: {
      name: "Ahmed Ali",
      company: "Softtechcube.com",
      phone: "+167123456789",
      email: "ahmed@gmail.com",
    },
    billingFrom: {
      name: "Tech-ni-test",
      company: "Technitest.com",
      phone: "+923567895235",
      email: "info@technitest.com",
    },
    paymentMethod: {
      method: "Paypal",
      maskedNumber: "********1234",
      holderName: "Ahmed Ali",
    },
    orderItems: [
      { order: "01 Quiz Name (Beginner)", amount: 900, currency: "USD" },
      { order: "02 Quiz Name (Advanced)", amount: 500, currency: "USD" },
    ],
    priceSummary: {
      couponLabel: "Coupon (10%)",
      couponAmount: 50,
      coinsLabel: "Coins (75)",
      coinsAmount: 17,
      grossTotal: 1333,
      total: 1400,
      receivedPayment: 1400,
      currency: "USD",
    },
  },
  {
    id: "t2",
    provider: "Stripe Checkout",
    transactionId: "TXN-44621",
    userId: "u2",
    userName: "Sana Khan",
    purpose: "Certificate Purchase",
    amount: 2500,
    currency: "USD",
    status: "Succeed",
    initiatedDate: "12 Nov 2025",
    orderId: "2708907173",
    customerId: "2708907173",
    purchaseDate: "15-06-23 / 09:30:15",
    billingTo: {
      name: "Sana Khan",
      company: "Softtechcube.com",
      phone: "+167123456780",
      email: "sana@gmail.com",
    },
    billingFrom: {
      name: "Tech-ni-test",
      company: "Technitest.com",
      phone: "+923567895235",
      email: "info@technitest.com",
    },
    paymentMethod: {
      method: "Paypal",
      maskedNumber: "********5678",
      holderName: "Sana Khan",
    },
    orderItems: [
      { order: "01 Quiz Name (Beginner)", amount: 1200, currency: "USD" },
      { order: "02 Quiz Name (Advanced)", amount: 1300, currency: "USD" },
    ],
    priceSummary: {
      couponLabel: "Coupon (10%)",
      couponAmount: 100,
      coinsLabel: "Coins (75)",
      coinsAmount: 25,
      grossTotal: 2375,
      total: 2500,
      receivedPayment: 2500,
      currency: "USD",
    },
  },
  {
    id: "t3",
    provider: "Stripe Checkout",
    transactionId: "TXN-44621",
    userId: "u3",
    userName: "Haseeb",
    purpose: "Certificate Purchase",
    amount: 1500,
    currency: "USD",
    status: "Failed",
    initiatedDate: "12 Nov 2025",
    orderId: "2708907174",
    customerId: "2708907174",
    purchaseDate: "10-06-23 / 14:22:45",
    billingTo: {
      name: "Haseeb",
      company: "Softtechcube.com",
      phone: "+167123456781",
      email: "haseeb@gmail.com",
    },
    billingFrom: {
      name: "Tech-ni-test",
      company: "Technitest.com",
      phone: "+923567895235",
      email: "info@technitest.com",
    },
    paymentMethod: {
      method: "Paypal",
      maskedNumber: "********9012",
      holderName: "Haseeb",
    },
    orderItems: [
      { order: "01 Quiz Name (Beginner)", amount: 800, currency: "USD" },
      { order: "02 Quiz Name (Advanced)", amount: 700, currency: "USD" },
    ],
    priceSummary: {
      couponLabel: "Coupon (10%)",
      couponAmount: 60,
      coinsLabel: "Coins (75)",
      coinsAmount: 20,
      grossTotal: 1420,
      total: 1500,
      receivedPayment: 1500,
      currency: "USD",
    },
  },
  {
    id: "t4",
    provider: "Stripe Checkout",
    transactionId: "TXN-44621",
    userId: "u1",
    userName: "Ahmed Ali",
    purpose: "Certificate Purchase",
    amount: 1400,
    currency: "USD",
    status: "Succeed",
    initiatedDate: "12 Nov 2025",
    orderId: "2708907175",
    customerId: "2708907175",
    purchaseDate: "08-06-23 / 11:15:30",
    billingTo: {
      name: "Ahmed Ali",
      company: "Softtechcube.com",
      phone: "+167123456789",
      email: "ahmed@gmail.com",
    },
    billingFrom: {
      name: "Tech-ni-test",
      company: "Technitest.com",
      phone: "+923567895235",
      email: "info@technitest.com",
    },
    paymentMethod: {
      method: "Paypal",
      maskedNumber: "********1234",
      holderName: "Muhammad Abid",
    },
    orderItems: [
      { order: "01 Quiz Name (Beginner)", amount: 190, currency: "USD" },
      { order: "02 Quiz Name (Advanced)", amount: 300, currency: "USD" },
    ],
    priceSummary: {
      couponLabel: "Coupon (10%)",
      couponAmount: 50,
      coinsLabel: "Coins (75)",
      coinsAmount: 17,
      grossTotal: 433,
      total: 500,
      receivedPayment: 500,
      currency: "USD",
    },
  },
  {
    id: "t5",
    provider: "Stripe Checkout",
    transactionId: "TXN-44622",
    userId: "u4",
    userName: "Naveed Khan",
    purpose: "Quiz Enrollment",
    amount: 800,
    currency: "USD",
    status: "Pending",
    initiatedDate: "10 Nov 2025",
    orderId: "2708907176",
    customerId: "2708907176",
    purchaseDate: "05-06-23 / 16:45:00",
    billingTo: {
      name: "Naveed Khan",
      company: "Softtechcube.com",
      phone: "+167123456782",
      email: "naveed@gmail.com",
    },
    billingFrom: {
      name: "Tech-ni-test",
      company: "Technitest.com",
      phone: "+923567895235",
      email: "info@technitest.com",
    },
    paymentMethod: {
      method: "Paypal",
      maskedNumber: "********3456",
      holderName: "Naveed Khan",
    },
    orderItems: [
      { order: "01 Quiz Name (Beginner)", amount: 500, currency: "USD" },
      { order: "02 Quiz Name (Advanced)", amount: 300, currency: "USD" },
    ],
    priceSummary: {
      couponLabel: "Coupon (10%)",
      couponAmount: 40,
      coinsLabel: "Coins (75)",
      coinsAmount: 12,
      grossTotal: 748,
      total: 800,
      receivedPayment: 800,
      currency: "USD",
    },
  },
  {
    id: "t6",
    provider: "Stripe Checkout",
    transactionId: "TXN-44623",
    userId: "u5",
    userName: "Muhammad Abid",
    purpose: "Certificate Purchase",
    amount: 3200,
    currency: "USD",
    status: "Succeed",
    initiatedDate: "08 Nov 2025",
    orderId: "2708907177",
    customerId: "2708907177",
    purchaseDate: "01-06-23 / 10:00:00",
    billingTo: {
      name: "Muhammad Abid",
      company: "Softtechcube.com",
      phone: "+167123456783",
      email: "abid@gmail.com",
    },
    billingFrom: {
      name: "Tech-ni-test",
      company: "Technitest.com",
      phone: "+923567895235",
      email: "info@technitest.com",
    },
    paymentMethod: {
      method: "Paypal",
      maskedNumber: "********7890",
      holderName: "Muhammad Abid",
    },
    orderItems: [
      { order: "01 Quiz Name (Beginner)", amount: 1500, currency: "USD" },
      { order: "02 Quiz Name (Advanced)", amount: 1700, currency: "USD" },
    ],
    priceSummary: {
      couponLabel: "Coupon (10%)",
      couponAmount: 150,
      coinsLabel: "Coins (75)",
      coinsAmount: 30,
      grossTotal: 3020,
      total: 3200,
      receivedPayment: 3200,
      currency: "USD",
    },
  },
];
