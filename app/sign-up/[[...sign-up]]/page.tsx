import { SignUp } from "@clerk/nextjs";
import { Zap, Users, GitBranch } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Zap,
    title: "AI Workflow Generation",
    description: "Describe your process, AI maps it to nodes on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Live presence and shared editing across your team.",
  },
  {
    icon: GitBranch,
    title: "Instant Automation",
    description: "Connect your tools and ship automations in minutes.",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-14 py-10 bg-surface border-r border-surface-border font-geist">
        <div className="flex items-center gap-2.5">
          <Image src="/syntropy-logo.png" alt="Syntropy" width={40} height={40} />
          <span className="text-lg font-semibold tracking-tight">
            <span style={{ color: '#ffffff' }}>Syn</span><span style={{ color: '#1DE0E7' }}>tropy</span>
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight">
            <span style={{ color: '#ffffff' }}>Build workflows<br />at the </span>
            <span style={{
              background: 'linear-gradient(135deg, #37789b 0%, #56D1E3 55%, #1DE0E7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>speed<br />of thought.</span>
          </h1>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-copy-muted">
            Describe your process in plain English. Syntropy maps it to an
            automated workflow your whole team can run in real time.
          </p>
          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg bg-elevated">
                  <Icon className="h-3.5 w-3.5" style={{ color: '#1DE0E7' }} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{title}</p>
                  <p className="mt-0.5 text-sm text-copy-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">© 2026 Syntropy. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-elevated">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#2A729E',
            },
            elements: {
              formButtonPrimary: {
                background: 'linear-gradient(135deg, #4394BF 0%, #56D1E3 55%, #1DE0E7 100%)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 0 12px rgba(29, 224, 231, 0.15)',
              },
              footerActionLink: { color: '#56D1E3' },
              identityPreviewEditButton: { color: '#56D1E3' },
            },
          }}
        />
      </div>
    </div>
  );
}
