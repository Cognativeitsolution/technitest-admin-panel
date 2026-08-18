export type CouponStatus = "Active" | "Inactive" | "Expired";
export type DiscountType = "Percentage" | "Flat";

export type Coupon = {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: string;
  usageLimit: string;
  used: number;
  validity: string;
  status: CouponStatus;
  applicableTo: string;
  minPurchase: string;
  startDate: string;
  endDate: string;
};

export const coupons: Coupon[] = [
  {
    id: "1",
    code: "Resume02",
    discountType: "Percentage",
    discountValue: "10%",
    usageLimit: "100",
    used: 35,
    validity: "1 Jan – 31 Jan",
    status: "Active",
    applicableTo: "All Quizzes",
    minPurchase: "500 PKR",
    startDate: "01-01-2025",
    endDate: "31-01-2025",
  },
  {
    id: "2",
    code: "Welcome50",
    discountType: "Flat",
    discountValue: "50 Coins",
    usageLimit: "Unlimited",
    used: 210,
    validity: "No Expiry",
    status: "Active",
    applicableTo: "All Quizzes",
    minPurchase: "",
    startDate: "01-01-2025",
    endDate: "",
  },
  {
    id: "3",
    code: "Save15",
    discountType: "Percentage",
    discountValue: "15%",
    usageLimit: "50",
    used: 12,
    validity: "1 Jan – 15 Jan",
    status: "Active",
    applicableTo: "Selected Quizzes",
    minPurchase: "1000 PKR",
    startDate: "01-01-2025",
    endDate: "15-01-2025",
  },
  {
    id: "4",
    code: "Flash20",
    discountType: "Percentage",
    discountValue: "20%",
    usageLimit: "200",
    used: 180,
    validity: "1 Feb – 7 Feb",
    status: "Expired",
    applicableTo: "All Quizzes",
    minPurchase: "",
    startDate: "01-02-2025",
    endDate: "07-02-2025",
  },
  {
    id: "5",
    code: "CoinBoost",
    discountType: "Flat",
    discountValue: "100 Coins",
    usageLimit: "75",
    used: 40,
    validity: "1 Mar – 31 Mar",
    status: "Inactive",
    applicableTo: "Certificate Quizzes",
    minPurchase: "200 PKR",
    startDate: "01-03-2025",
    endDate: "31-03-2025",
  },
];

export const couponStatusOptions = ["Status", "Active", "Inactive", "Expired"];
export const couponDateOptions = [
  "Date",
  "Last 7 Days",
  "Last 30 Days",
  "This Year",
];
export const discountTypeOptions: DiscountType[] = ["Percentage", "Flat"];
export const applicableToOptions = [
  "All Quizzes",
  "Selected Quizzes",
  "Certificate Quizzes",
];
