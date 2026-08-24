export type CertificateStatus = "Issued" | "Pending" | "Rejected";
export type CertificateLevel = "Beginner" | "Intermediate" | "Advanced";

export type Certificate = {
  id: string;
  user: string;
  title: string;
  category: string;
  level: CertificateLevel;
  issueDate: string;
  status: CertificateStatus;
  uploadedLogo: string;
  certificateHeading: string;
  openingLine: string;
  completionStatement: string;
  description: string;
  recipientName: string;
};

export const certificates: Certificate[] = [
  {
    id: "CERT-1001",
    user: "Talha Ahmed",
    title: "JavaScript Basics",
    category: "Web Dev",
    level: "Beginner",
    issueDate: "12 Oct 2025",
    status: "Issued",
    uploadedLogo: "",
    certificateHeading: "CERTIFICATE",
    openingLine: "This is to Certify That",
    completionStatement: "Has Successfully Completed The Test Of",
    description:
      "The initial screening stage in the hiring process has always been essential, but in 2025, the standards continue to rise. Companies now look for candidates that demonstrate clear fundamentals, problem-solving ability, and practical application of core concepts.",
    recipientName: "Talha Ahmed",
  },
  {
    id: "CERT-1002",
    user: "Maria Khan",
    title: "HTML Advanced",
    category: "Design",
    level: "Beginner",
    issueDate: "08 Oct 2025",
    status: "Pending",
    uploadedLogo: "",
    certificateHeading: "CERTIFICATE",
    openingLine: "This is to Certify That",
    completionStatement: "Has Successfully Completed The Test Of",
    description:
      "This certificate recognizes successful completion of advanced HTML concepts including semantic markup, accessibility, and modern layout techniques.",
    recipientName: "Maria Khan",
  },
  {
    id: "CERT-1003",
    user: "Asad Raza",
    title: "Graphic Designing",
    category: "Design",
    level: "Intermediate",
    issueDate: "05 Oct 2025",
    status: "Rejected",
    uploadedLogo: "",
    certificateHeading: "CERTIFICATE",
    openingLine: "This is to Certify That",
    completionStatement: "Has Successfully Completed The Test Of",
    description:
      "Awarded for demonstrating intermediate skills in graphic design principles, visual communication, and creative tooling.",
    recipientName: "Asad Raza",
  },
  {
    id: "CERT-1004",
    user: "Amina Malik",
    title: "Python Fundamentals",
    category: "Programming",
    level: "Beginner",
    issueDate: "01 Oct 2025",
    status: "Issued",
    uploadedLogo: "",
    certificateHeading: "CERTIFICATE",
    openingLine: "This is to Certify That",
    completionStatement: "Has Successfully Completed The Test Of",
    description:
      "Confirms proficiency in Python basics including syntax, data structures, and introductory problem solving.",
    recipientName: "Amina Malik",
  },
  {
    id: "CERT-1005",
    user: "John Smith",
    title: "UI/UX Design",
    category: "Design",
    level: "Advanced",
    issueDate: "28 Sep 2025",
    status: "Pending",
    uploadedLogo: "",
    certificateHeading: "CERTIFICATE",
    openingLine: "This is to Certify That",
    completionStatement: "Has Successfully Completed The Test Of",
    description:
      "Recognizes advanced capability in user research, wireframing, prototyping, and interface design systems.",
    recipientName: "John Smith",
  },
];

export const certificateStatusOptions = [
  "Status",
  "Issued",
  "Pending",
  "Rejected",
];

export const certificateLevelOptions = [
  "Level",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const certificateCategoryOptions = [
  "Programming",
  "Web Dev",
  "Design",
  "Electronics",
  "Mathematics",
];

export function getCertificateById(id: string) {
  return certificates.find((item) => item.id === id);
}
