export type UserRecord = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  quizzesTaken: number;
  certificates: number;
  avatar: string;
  state: string;
  city: string;
  identificationNo: string;
  highestEducation: string;
  level: string;
  dateOfBirth: string;
  coinsEarned: number;
  successfulReferrals: number;
  emailVerified: boolean;
  mobileVerified: boolean;
};

export type CertificateRecord = {
  id: string;
  certificate: string;
  issuedFor: string;
  score: string;
  issuedOn: string;
};

export const users: UserRecord[] = [
  {
    id: "1",
    name: "Talha Ahmed",
    username: "talha_ahmed",
    email: "Talhaahmed@Technitest.Com",
    phone: "0314-8395456",
    country: "Pakistan",
    quizzesTaken: 24,
    certificates: 2,
    avatar: "https://i.pravatar.cc/160?img=11",
    state: "Sindh",
    city: "Karachi",
    identificationNo: "45987-45678952-9",
    highestEducation: "Intermediate",
    level: "Advanced",
    dateOfBirth: "10/10/2025",
    coinsEarned: 500,
    successfulReferrals: 24,
    emailVerified: true,
    mobileVerified: false,
  },
  {
    id: "2",
    name: "Sara Khan",
    username: "sarakhan",
    email: "sara.khan@email.com",
    phone: "+1 416 555 0198",
    country: "Canada",
    quizzesTaken: 8,
    certificates: 1,
    avatar: "https://i.pravatar.cc/160?img=5",
    state: "Ontario",
    city: "Toronto",
    identificationNo: "CA-982341",
    highestEducation: "Bachelor",
    level: "Intermediate",
    dateOfBirth: "14/03/1998",
    coinsEarned: 220,
    successfulReferrals: 5,
    emailVerified: true,
    mobileVerified: true,
  },
  {
    id: "3",
    name: "Amina Malik",
    username: "amina_m",
    email: "amina.malik@email.com",
    phone: "+91 98765 43210",
    country: "India",
    quizzesTaken: 15,
    certificates: 3,
    avatar: "https://i.pravatar.cc/160?img=47",
    state: "Maharashtra",
    city: "Mumbai",
    identificationNo: "IN-774512",
    highestEducation: "Master",
    level: "Advanced",
    dateOfBirth: "22/07/1996",
    coinsEarned: 780,
    successfulReferrals: 12,
    emailVerified: true,
    mobileVerified: false,
  },
  {
    id: "4",
    name: "John Smith",
    username: "johnsmith",
    email: "john.smith@email.com",
    phone: "+44 7700 900123",
    country: "United Kingdom",
    quizzesTaken: 6,
    certificates: 1,
    avatar: "https://i.pravatar.cc/160?img=33",
    state: "England",
    city: "London",
    identificationNo: "UK-552190",
    highestEducation: "Bachelor",
    level: "Beginner",
    dateOfBirth: "05/11/1994",
    coinsEarned: 140,
    successfulReferrals: 2,
    emailVerified: false,
    mobileVerified: true,
  },
  {
    id: "5",
    name: "Fatima Noor",
    username: "fatima_n",
    email: "fatima.noor@email.com",
    phone: "+971 50 123 4567",
    country: "UAE",
    quizzesTaken: 20,
    certificates: 4,
    avatar: "https://i.pravatar.cc/160?img=9",
    state: "Dubai",
    city: "Dubai",
    identificationNo: "AE-331290",
    highestEducation: "Bachelor",
    level: "Advanced",
    dateOfBirth: "18/01/1999",
    coinsEarned: 960,
    successfulReferrals: 18,
    emailVerified: true,
    mobileVerified: true,
  },
  {
    id: "6",
    name: "Usman Raza",
    username: "usmanraza",
    email: "usman.raza@email.com",
    phone: "+92 321 9876543",
    country: "Pakistan",
    quizzesTaken: 9,
    certificates: 2,
    avatar: "https://i.pravatar.cc/160?img=15",
    state: "Punjab",
    city: "Lahore",
    identificationNo: "35202-1234567-1",
    highestEducation: "Intermediate",
    level: "Intermediate",
    dateOfBirth: "09/09/2000",
    coinsEarned: 310,
    successfulReferrals: 7,
    emailVerified: true,
    mobileVerified: false,
  },
  {
    id: "7",
    name: "Emily Carter",
    username: "emilyc",
    email: "emily.carter@email.com",
    phone: "+1 212 555 0147",
    country: "USA",
    quizzesTaken: 11,
    certificates: 2,
    avatar: "https://i.pravatar.cc/160?img=20",
    state: "New York",
    city: "New York",
    identificationNo: "US-881234",
    highestEducation: "Master",
    level: "Advanced",
    dateOfBirth: "30/04/1995",
    coinsEarned: 450,
    successfulReferrals: 9,
    emailVerified: true,
    mobileVerified: true,
  },
  {
    id: "8",
    name: "Ali Hassan",
    username: "alihassan",
    email: "ali.hassan@email.com",
    phone: "+92 333 4567890",
    country: "Pakistan",
    quizzesTaken: 14,
    certificates: 3,
    avatar: "https://i.pravatar.cc/160?img=68",
    state: "Islamabad",
    city: "Islamabad",
    identificationNo: "61101-7654321-3",
    highestEducation: "Bachelor",
    level: "Intermediate",
    dateOfBirth: "12/12/1997",
    coinsEarned: 620,
    successfulReferrals: 11,
    emailVerified: false,
    mobileVerified: false,
  },
];

export const userCertificates: CertificateRecord[] = [
  {
    id: "c1",
    certificate: "JavaScript Basics - Completion",
    issuedFor: "JS Basics Quiz",
    score: "92%",
    issuedOn: "12 Nov 2025",
  },
  {
    id: "c2",
    certificate: "Python Intermediate - Achievement",
    issuedFor: "Python Mid-Level Quiz",
    score: "88%",
    issuedOn: "03 Nov 2025",
  },
  {
    id: "c3",
    certificate: "JavaScript Basics - Completion",
    issuedFor: "JS Basics Quiz",
    score: "92%",
    issuedOn: "12 Nov 2025",
  },
];

export const countryOptions = [
  "All Countries",
  "Pakistan",
  "Canada",
  "India",
  "United Kingdom",
  "UAE",
  "USA",
];

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}
