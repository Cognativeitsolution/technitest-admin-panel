export type FeedbackTab = "website-reviews" | "user-reviews" | "feedbacks";
export type ReviewStatus = "Approved" | "Pending" | "Inactive";
export type FeedbackSentiment = "Positive" | "Negative" | "Neutral";
export type FeedbackType = "Bug Report" | "Suggestion" | "UI Issue";

export type WebsiteReview = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  message: string;
  videoUrl: string | null;
  date: string;
  status: ReviewStatus;
  active: boolean;
};

export type UserReview = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  message: string;
  date: string;
  status: ReviewStatus;
  active: boolean;
};

export type FeedbackItem = {
  id: string;
  userName: string;
  userAvatar: string;
  type: FeedbackType;
  message: string;
  pageQuiz: string;
  sentiment: FeedbackSentiment;
  status: ReviewStatus;
  date: string;
};

export const ratingOptions = ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Stars"];
export const statusOptions = ["Active", "Inactive"];
export const sentimentOptions: FeedbackSentiment[] = ["Positive", "Negative", "Neutral"];
export const quizNameOptions = ["JavaScript Basics", "HTML Advanced", "Marketing Beginner", "Mathematics"];
export const pageOptions = ["Dashboard", "Quiz Page", "Blogs", "Contact Us"];

export const websiteReviews: WebsiteReview[] = [
  { id: "wr1", userName: "Ahmed Ali", userAvatar: "https://i.pravatar.cc/160?img=11", rating: 5, message: "Great learning experience!", videoUrl: "https://example.com/v1.mp4", date: "12 Nov 2025", status: "Approved", active: true },
  { id: "wr2", userName: "Sara Khan", userAvatar: "https://i.pravatar.cc/160?img=5", rating: 5, message: "Good but needs harder quizzes.", videoUrl: null, date: "12 Nov 2025", status: "Pending", active: false },
  { id: "wr3", userName: "Areeba Shah", userAvatar: "https://i.pravatar.cc/160?img=47", rating: 5, message: "Bugs during quiz attempt.", videoUrl: "https://example.com/v3.mp4", date: "12 Nov 2025", status: "Approved", active: true },
  { id: "wr4", userName: "Usman Raza", userAvatar: "https://i.pravatar.cc/160?img=33", rating: 4, message: "Very helpful content and clean interface.", videoUrl: null, date: "11 Nov 2025", status: "Pending", active: false },
  { id: "wr5", userName: "Fatima Noor", userAvatar: "https://i.pravatar.cc/160?img=9", rating: 3, message: "Average experience overall.", videoUrl: null, date: "10 Nov 2025", status: "Approved", active: true },
];

export const userReviews: UserReview[] = [
  { id: "ur1", userName: "Ahmed Ali", userAvatar: "https://i.pravatar.cc/160?img=11", rating: 5, message: "Great learning experience?", date: "12 Nov 2025", status: "Approved", active: true },
  { id: "ur2", userName: "Sara Khan", userAvatar: "https://i.pravatar.cc/160?img=5", rating: 5, message: "Good but needs harder quizzes.", date: "12 Nov 2025", status: "Pending", active: false },
  { id: "ur3", userName: "Areeba Shah", userAvatar: "https://i.pravatar.cc/160?img=47", rating: 5, message: "Bugs during quiz attempt.", date: "12 Nov 2025", status: "Approved", active: true },
  { id: "ur4", userName: "Usman Raza", userAvatar: "https://i.pravatar.cc/160?img=33", rating: 4, message: "Very helpful content and clean interface.", date: "11 Nov 2025", status: "Pending", active: false },
  { id: "ur5", userName: "Fatima Noor", userAvatar: "https://i.pravatar.cc/160?img=9", rating: 3, message: "Average experience overall.", date: "10 Nov 2025", status: "Approved", active: true },
];

export const feedbackItems: FeedbackItem[] = [
  { id: "fb1", userName: "Ahmed Ali", userAvatar: "https://i.pravatar.cc/160?img=11", type: "Bug Report", message: "Quiz stuck on 15th question.", pageQuiz: "JavaScript Basics", sentiment: "Negative", status: "Pending", date: "14 Oct 2025" },
  { id: "fb2", userName: "Sara Khan", userAvatar: "https://i.pravatar.cc/160?img=5", type: "Suggestion", message: "Add more Beginner quizzes.", pageQuiz: "Dashboard", sentiment: "Positive", status: "Approved", date: "14 Oct 2025" },
  { id: "fb3", userName: "Areeba Shah", userAvatar: "https://i.pravatar.cc/160?img=47", type: "UI Issue", message: "Text overlapping on mobile.", pageQuiz: "Quiz Page", sentiment: "Neutral", status: "Pending", date: "14 Oct 2025" },
  { id: "fb4", userName: "Usman Raza", userAvatar: "https://i.pravatar.cc/160?img=33", type: "Bug Report", message: "Certificate download fails sometimes.", pageQuiz: "HTML Advanced", sentiment: "Negative", status: "Pending", date: "13 Oct 2025" },
  { id: "fb5", userName: "Fatima Noor", userAvatar: "https://i.pravatar.cc/160?img=9", type: "Suggestion", message: "Dark mode would be great.", pageQuiz: "Dashboard", sentiment: "Positive", status: "Approved", date: "12 Oct 2025" },
];
