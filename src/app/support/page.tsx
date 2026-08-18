import { AlertTriangle, Zap } from "lucide-react";

import { FeedbackCard } from "@/components/support/feedback-card";
import { SupportSection } from "@/components/support/support-section";
import { SupportSteps } from "@/components/support/support-steps";
import { SupportSubsection } from "@/components/support/support-subsection";

const summaryLinks = [
  { label: "Creating an account", href: "#creating-account" },
  { label: "Signing in", href: "#signing-in" },
  {
    label: "Technical support | I can't bypass hCaptcha",
    href: "#technical-support",
  },
  {
    label: "FAQs | Can I use Indeed to search the job listings if I'm 17 years old?",
    href: "#faqs",
  },
];

const googleCreateSteps = [
  "Click or tap the Google logo to sign in.",
  "Select Continue with Google.",
  "Follow the prompts to link Indeed to a Gmail email address.",
  "Select Jobseeker and Create account.",
  "Review your Account settings.",
];

const appleCreateSteps = [
  "Click or tap the Apple logo to sign in.",
  "Select Continue with Apple.",
  "Follow the prompts to link Indeed to your Apple ID.",
  "Select Jobseeker and Create account.",
  "Review your Account settings.",
];

const emailCreateSteps = [
  "Enter your unique email address in the Email address field. Use an email address that's not Gmail.",
  "Click or tap Continue.",
  "Select Jobseeker.",
  "Choose a six-digit password.",
  "Click or tap Create account.",
  "Find the checkbox and the phrase \u201cI am human.\u201d hCaptcha protects your account against fraud and abuse.",
];

const passcodeSteps = [
  "Find the prompt to Sign in with login code.",
  "Check your email inbox. Find an email with the subject line Indeed login code. This helps protect your account against fraud and abuse.",
  "To finish the process, follow the prompts to paste the temporary six-digit code from the email you received.",
];

export default function SupportPage() {
  return (
    <div className="scroll-smooth">
      <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-[28px]">
        Help &amp; Support
      </h1>

      {/* Quick summary card */}
      <div className="mt-6 ml-4  rounded-2xl border border-[#eef1f6] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fef3c7]">
            <Zap className="size-5 text-[#f59e0b]" />
          </span>
          <h2 className="pt-1 text-lg font-bold text-[#111827]">
            Quick summary
          </h2>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-[#4b5563]">
          At Indeed, our mission is to help you get a job. You can create a free
          account to access a range of valuable tools. Start your job-search
          journey with us if you&apos;re 18 years of age or older in the
          European Economic Area, Switzerland, United Kingdom, Turkey or Ukraine.
          Ready to start or sign in? Follow the instructions below.
        </p>

        <nav className="mt-5 space-y-2.5">
          {summaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-[15px] font-medium text-[#2563eb] underline underline-offset-2 transition hover:text-[#1d4ed8]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Content sections */}
      <div className="mt-8 ml-4  space-y-10">
        {/* Creating an account */}
        <SupportSection
          id="creating-account"
          title="Creating an account"
          description="If you meet the minimum age requirement, here's how to use Google, Apple or a unique email to create and open an account."
        >
          <SupportSubsection
            title="Google"
            intro="If you're using a desktop or phone:"
            expectation="This Gmail email address will link to an Indeed account."
          >
            <SupportSteps steps={googleCreateSteps} />
          </SupportSubsection>

          <SupportSubsection
            title="Apple"
            intro="If you're using an iPhone:"
            expectation="This Apple ID will link to an Indeed account."
          >
            <SupportSteps steps={appleCreateSteps} />
          </SupportSubsection>

          <SupportSubsection title="Unique email address">
            <SupportSteps steps={emailCreateSteps} />
          </SupportSubsection>

          {/* Confirm your account */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-semibold text-[#111827] sm:text-lg">
              Confirm your account
            </h3>
            <p className="text-[15px] leading-relaxed text-[#4b5563]">
              The minimum age requirement is 18 years old.
            </p>
            <p className="text-[15px] leading-relaxed text-[#4b5563]">
              If we find out that a user doesn&apos;t meet the minimum age
              requirement to use Indeed&apos;s site, we will close their account
              and delete their data from our systems.
            </p>
          </div>
        </SupportSection>

        {/* Signing in */}
        <SupportSection
          id="signing-in"
          title="Signing in"
          description="Here's how to use Google, Apple or a unique email address to sign in."
        >
          {/* Important warning box */}
          <div className="flex items-start gap-3 rounded-lg border-l-4 border-[#f59e0b] bg-[#fffbeb] p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#f59e0b]" />
            <p className="text-[14px] leading-relaxed text-[#92400e]">
              <span className="font-semibold">Important:</span> It&apos;s
              important to sign in using the same method each time. That way,
              you&apos;ll avoid creating duplicate accounts. For example,
              don&apos;t sign in with an Apple ID if you created an account
              using Gmail or another email provider.
            </p>
          </div>

          <SupportSubsection
            title="Google or Apple"
            intro="Sign in using Google's passwordless sign-in feature or by using your Apple ID if you created an account."
          >
            <div className="space-y-3">
              <p className="text-[15px] font-medium leading-relaxed text-[#4b5563]">
                Using a one-time passcode
              </p>
              <p className="text-[15px] leading-relaxed text-[#4b5563]">
                Sign in with a unique passcode by following these steps:
              </p>
              <SupportSteps steps={passcodeSteps} />
            </div>
          </SupportSubsection>
        </SupportSection>

        {/* Technical support */}
        <SupportSection
          id="technical-support"
          title="Technical support"
          description="If you're having trouble with hCaptcha verification, try the following steps."
        >
          <SupportSubsection title="I can't bypass hCaptcha">
            <SupportSteps
              steps={[
                "Make sure you're using a supported browser (Chrome, Firefox, Safari, or Edge).",
                "Clear your browser cache and cookies.",
                "Disable any browser extensions that may interfere with hCaptcha.",
                "Try using a different browser or device.",
                "If the issue persists, contact our support team directly.",
              ]}
            />
          </SupportSubsection>
        </SupportSection>

        {/* FAQs */}
        <SupportSection
          id="faqs"
          title="FAQs"
          description="Answers to commonly asked questions about using Indeed."
        >
          <div className="space-y-6">
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">
                Question: Can I use Indeed to search the job listings if I&apos;m
                17 years old?
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4b5563]">
                Answer: No.
              </p>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">
                Question: I have two Indeed accounts. Can I merge them?
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4b5563]">
                Answer: No, sorry. This option is not available.
              </p>
            </div>
          </div>
        </SupportSection>
      </div>

      {/* Feedback card */}
      <FeedbackCard />
    </div>
  );
}
