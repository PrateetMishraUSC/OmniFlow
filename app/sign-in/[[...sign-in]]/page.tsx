import { SignIn } from "@clerk/nextjs";
import { Zap, Users, GitBranch } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Zap,
    title: "AI Architecture Design",
    description: "Describe what you're building. The AI places nodes, draws connections, and labels every service instantly on a shared canvas.",
  },
  {
    icon: Users,
    title: "Live Multiuser Canvas",
    description: "See your teammates' cursors, selections, and edits as they happen. Everyone works on the same diagram, no refresh needed.",
  },
  {
    icon: GitBranch,
    title: "Auto-generated Specs",
    description: "Turn any canvas into a structured technical spec with one click and ready to share with engineers, stakeholders, or your next AI prompt.",
  },
];

export default function SignInPage() {
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

        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-[1.15] tracking-tight">
            <span style={{ color: '#ffffff' }}>Design systems at the </span>
            <span style={{
              background: 'linear-gradient(135deg, #4394BF 0%, #56D1E3 55%, #1DE0E7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>speed of thought.</span>
          </h1>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-copy-muted">
            Describe any system in plain English. Syntropy's AI maps it to a
            live architecture canvas your whole team can explore, edit, and 
            build on together in real time.
          </p>
          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-elevated">
                  <Icon className="h-4 w-4" style={{ color: '#1DE0E7' }} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-md font-medium" style={{ color: '#ffffff' }}>{title}</p>
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
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#2A729E',
            },
            elements: {
              formButtonPrimary: {
                background: 'linear-gradient(135deg, #37789b 30%, #56D1E3 100%, #1DE0E7 30%)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 0 12px rgba(29, 224, 231, 0.15)',
              },
              footerActionLink: { color: '#56D1E3' },
              identityPreviewEditButton: { color: '#56D1E3' },
              badge: { color: '#1DE0E7', background: 'transparent' },
            },
          }}
        />
      </div>
    </div>
  );
}
