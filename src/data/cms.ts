export type CmsTab = "pages" | "advertisements" | "blogs";
export type CmsStatus = "Published" | "Draft";
export type BannerStatus = "Active" | "Inactive";

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  status: CmsStatus;
  createdOn: string;
};

export type AdvertisementBanner = {
  id: string;
  title: string;
  placement: string;
  imageUrl: string;
  destinationUrl: string;
  altText: string;
  status: BannerStatus;
  startDate: string;
  endDate: string;
  createdOn: string;
};

export type BlogCategory = "Design & Development" | "Marketing" | "Business" | "Technology";

export type BlogFaq = {
  id: string;
  question: string;
  answer: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  status: CmsStatus;
  createdOn: string;
  metaTitle: string;
  keywords: string[];
  description: string;
  ogImageUrl: string;
  faqs: BlogFaq[];
};

export const blogCategoryOptions: BlogCategory[] = ["Design & Development", "Marketing", "Business", "Technology"];
export const placementOptions = ["Homepage Top", "Homepage Bottom", "About Us", "Categories", "Blog", "Contact Us"];

export const cmsPages: CmsPage[] = [
  { id: "p1", title: "Homepage", slug: "/homepage", status: "Published", createdOn: "12 Nov 2025" },
  { id: "p2", title: "About Us", slug: "/about-us", status: "Draft", createdOn: "12 Nov 2025" },
  { id: "p3", title: "Categories", slug: "/categories", status: "Published", createdOn: "12 Nov 2025" },
  { id: "p4", title: "FAQs", slug: "/faqs", status: "Published", createdOn: "12 Nov 2025" },
  { id: "p5", title: "Contact Us", slug: "/contact-us", status: "Published", createdOn: "12 Nov 2025" },
];

export const advertisementBanners: AdvertisementBanner[] = [
  { id: "a1", title: "Learn & Earn Certificates", placement: "Homepage Top", imageUrl: "", destinationUrl: "/certificates", altText: "Learn and earn", status: "Active", startDate: "01 Oct 2025", endDate: "31 Dec 2025", createdOn: "05 Oct 2025" },
  { id: "a2", title: "Trending Quizzes", placement: "About Us", imageUrl: "", destinationUrl: "/quizzes", altText: "Trending quizzes", status: "Active", startDate: "01 Nov 2025", endDate: "28 Feb 2026", createdOn: "12 Nov 2025" },
  { id: "a3", title: "Boost Your Skills Today", placement: "Homepage Bottom", imageUrl: "", destinationUrl: "/gamification", altText: "Boost skills", status: "Inactive", startDate: "01 Sep 2025", endDate: "30 Nov 2025", createdOn: "30 Sep 2025" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1", title: "Modern Resume Examples 2025", slug: "Modern-Resume-Examples-2025", category: "Design & Development", status: "Published", createdOn: "12 Nov 2025",
    metaTitle: "Modern Resume Examples 2025 That Work in Today's Job Market",
    keywords: ["Figma", "Design", "Business Job"],
    description: "<h2>Why Resume Examples Matter in 2025</h2><p>In today's competitive job market, having a well-crafted resume is more important than ever. Resume examples provide a blueprint for success, showing job seekers exactly how to present their skills and experience.</p><h2>Categories of Resume Examples for 2025</h2><p>There are several categories of resume examples that job seekers can leverage, including creative resumes, executive resumes, and entry-level resumes.</p>",
    ogImageUrl: "",
    faqs: [
      { id: "fq1", question: "A Complete Of Common Questions ?", answer: "FAQs Compile The Questions Most Frequently Asked By Users, Customers Or Visitors, And FAQs Page Is A Common Section On Many Websites, Especially For Products And Services." },
    ],
  },
  {
    id: "b2", title: "Top 10 Design Trends 2025", slug: "Top-10-Design-Trends-2025", category: "Design & Development", status: "Draft", createdOn: "10 Nov 2025",
    metaTitle: "Top 10 Design Trends 2025",
    keywords: ["Design", "UI/UX"],
    description: "<p>Explore the latest design trends shaping the industry in 2025.</p>",
    ogImageUrl: "",
    faqs: [],
  },
  {
    id: "b3", title: "Marketing Strategies for Startups", slug: "Marketing-Strategies-Startups", category: "Marketing", status: "Published", createdOn: "08 Nov 2025",
    metaTitle: "Marketing Strategies for Startups",
    keywords: ["Marketing", "Startup", "Growth"],
    description: "<p>Effective marketing strategies that every startup should consider.</p>",
    ogImageUrl: "",
    faqs: [],
  },
];
