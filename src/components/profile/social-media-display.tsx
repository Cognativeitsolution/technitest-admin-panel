"use client";

import type { ProfileDetail } from "@/types/profile.types";

// SVG Icons for social media
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 2.5c2.49 0 2.794.012 3.778.055 1.254.058 1.948.24 2.404.407.6.234 1.032.51 1.483.96.45.451.726.883.96 1.483.167.456.349 1.15.407 2.404.043.984.055 1.289.055 3.778s-.012 2.794-.055 3.778c-.058 1.254-.24 1.948-.407 2.404-.234.6-.51 1.032-.96 1.483-.451.45-.883.726-1.483.96-.456.167-1.15.349-2.404.407-.984.043-1.289.055-3.778.055s-2.794-.012-3.778-.055c-1.254-.058-1.948-.24-2.404-.407-.6-.234-1.032-.51-1.483-.96-.45-.451-.726-.883-.96-1.483-.167-.456-.349-1.15-.407-2.404-.043-.984-.055-1.289-.055-3.778s.012-2.794.055-3.778c.058-1.254.24-1.948.407-2.404.234-.6.51-1.032.96-1.483.451-.45.883-.726 1.483-.96.456-.167 1.15-.349 2.404-.407.984-.043 1.289-.055 3.778-.055m0 1.35c-2.434 0-2.715.01-3.666.052-.88.042-1.357.187-1.675.31-.42.163-.72.36-.977.617-.256.257-.454.557-.617.977-.123.318-.268.795-.31 1.675-.042.951-.052 1.232-.052 3.666s.01 2.715.052 3.666c.042.88.187 1.357.31 1.675.163.42.36.72.617.977.257.256.557.454.977.617.318.123.795.268 1.675.31.951.042 1.232.052 3.666.052s2.715-.01 3.666-.052c.88-.042 1.357-.187 1.675-.31.42-.163.72-.36.977-.617.256-.257.454-.557.617-.977.123-.318.268-.795.31-1.675.042-.951.052-1.232.052-3.666s-.01-2.715-.052-3.666c-.042-.88-.187-1.357-.31-1.675-.163-.42-.36-.72-.617-.977-.257-.256-.557-.454-.977-.617-.318-.123-.795-.268-1.675-.31-.951-.042-1.232-.052-3.666-.052zm0 2.91c2.702 0 4.89 2.188 4.89 4.89S14.702 16.89 12 16.89s-4.89-2.188-4.89-4.89 2.188-4.89 4.89-4.89zm0 1.35c-1.953 0-3.54 1.587-3.54 3.54s1.587 3.54 3.54 3.54 3.54-1.587 3.54-3.54-1.587-3.54-3.54-3.54zm6.405-1.215c0 .631.512 1.143 1.143 1.143s1.143-.512 1.143-1.143-.512-1.143-1.143-1.143-1.143.512-1.143 1.143z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.802-5.974 6.802H2.423l7.723-8.835L1.029 2.25h6.847l4.716 6.231 5.429-6.231zM17.15 18.75h1.828L5.293 3.912H3.361L17.15 18.75z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

interface SocialMediaDisplayProps {
  profile: ProfileDetail | null;
  className?: string;
}

const SOCIAL_LINKS = [
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: FacebookIcon,
    color: "text-[#1877f2]",
    hoverColor: "hover:text-[#1877f2]",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: LinkedInIcon,
    color: "text-[#0a66c2]",
    hoverColor: "hover:text-[#0a66c2]",
  },
  {
    key: "x" as const,
    label: "X (Twitter)",
    icon: XIcon,
    color: "text-[#000000]",
    hoverColor: "hover:text-[#000000]",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: InstagramIcon,
    color: "text-[#e1306c]",
    hoverColor: "hover:text-[#e1306c]",
  },
];

export function SocialMediaDisplay({
  profile,
  className = "",
}: SocialMediaDisplayProps) {
  if (!profile) {
    return null;
  }

  const socialLinks = SOCIAL_LINKS.filter((social) => {
    const url = profile[social.key];
    return url && url.trim().length > 0;
  });

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border border-[#e5e7eb] bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] p-6 ${className}`}
    >
      <h3 className="mb-6 text-lg font-bold text-[#111111]">Connect With Us</h3>
      <div className="flex flex-wrap gap-6">
        {socialLinks.map((social) => {
          const url = profile[social.key] as string;
          const Icon = social.icon;

          return (
            <a
              key={social.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.label}
              className={`group inline-flex items-center justify-center size-16 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-110 ${social.color} bg-white`}
            >
              <Icon className="size-8 transition-transform duration-300 group-hover:scale-120" />
              <span className="sr-only">{social.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

interface SocialMediaListProps {
  profile: ProfileDetail | null;
  className?: string;
}

/**
 * Display social media as a list with links and labels
 */
export function SocialMediaList({
  profile,
  className = "",
}: SocialMediaListProps) {
  if (!profile) {
    return null;
  }

  const socialLinks = SOCIAL_LINKS.filter((social) => {
    const url = profile[social.key];
    return url && url.trim().length > 0;
  });

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border border-[#e5e7eb] bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] p-6 ${className}`}
    >
      <h3 className="mb-6 text-lg font-bold text-[#111111]">Connect With Us</h3>
      <ul className="space-y-3">
        {socialLinks.map((social) => {
          const url = profile[social.key] as string;
          const Icon = social.icon;

          return (
            <li key={social.key}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-300 ${social.color} hover:bg-gray-100 hover:shadow-sm`}
              >
                <div className="inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-md">
                  <Icon className="size-6" />
                </div>
                <span className="text-[15px] font-medium">{social.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
