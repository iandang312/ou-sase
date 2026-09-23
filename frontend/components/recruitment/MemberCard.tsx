import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CloudImage } from "@/components/site/CloudImage";
import { SEEKING_BADGE_TONE } from "@/components/recruitment/seekingStyles";
import type { Member } from "@/lib/types";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const MAX_SKILLS = 6;

/** Raw Cloudinary delivery URL for a resume PDF, or null if it can't be built. */
function resumeUrl(member: Member): string | null {
  if (!CLOUD_NAME || !member.resumePublicId) return null;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${member.resumePublicId}.pdf`;
}

/** Small inline icons so the footer links scan as targets, not just text. */
function DocumentIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 1.5h5.5L12.5 4.5V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Z" strokeLinejoin="round" />
      <path d="M9.5 1.5V4.5H12.5" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6.5 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5V9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2H14v4.5M14 2 7.5 8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * One recruiter-facing profile card. Rendered as a list item by the caller.
 *
 * Scan order matters: name -> major/year (who they are) -> seeking (why they
 * are here) -> skills (can they do the job) -> bio (context, lowest priority,
 * clamped so it never stretches the card taller than its neighbors).
 */
export function MemberCard({ member }: { member: Member }) {
  const fullName = `${member.firstName} ${member.lastName}`;
  const resume = resumeUrl(member);
  const skills = member.skills.slice(0, MAX_SKILLS);
  const hiddenSkillCount = member.skills.length - skills.length;

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex items-start gap-4">
        <CloudImage
          publicId={member.photoPublicId}
          alt={`Photo of ${fullName}`}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-title-sm text-ink truncate">{fullName}</h3>
          <p className="text-body-sm text-body truncate">{member.major}</p>
          <p className="text-caption text-muted">
            <span>{member.classification}</span>
            <span aria-hidden="true"> &middot; </span>
            <span>Class of {member.gradYear}</span>
          </p>
        </div>
      </div>

      {member.seeking.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label={`${fullName} is seeking`}>
          {member.seeking.map((s) => (
            <li key={s}>
              <Badge tone={SEEKING_BADGE_TONE[s]}>{s}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label={`${fullName}'s skills`}>
          {skills.map((skill) => (
            <li key={skill}>
              <Badge tone="neutral">{skill}</Badge>
            </li>
          ))}
          {hiddenSkillCount > 0 ? (
            <li>
              <Badge tone="neutral">+{hiddenSkillCount} more</Badge>
            </li>
          ) : null}
        </ul>
      ) : null}

      {member.bio ? (
        <p className="text-body-sm text-body line-clamp-2">{member.bio}</p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-body-sm">
        {resume ? (
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink inline-flex items-center gap-1.5 font-semibold hover:underline underline-offset-4"
          >
            <DocumentIcon />
            Resume
          </a>
        ) : (
          <span className="text-muted-soft inline-flex items-center gap-1.5" aria-disabled="true">
            <DocumentIcon />
            Resume not shared
          </span>
        )}
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink inline-flex items-center gap-1.5 font-semibold hover:underline underline-offset-4"
          >
            <ExternalLinkIcon />
            LinkedIn
          </a>
        ) : null}
        {member.githubUrl ? (
          <a
            href={member.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink inline-flex items-center gap-1.5 font-semibold hover:underline underline-offset-4"
          >
            <ExternalLinkIcon />
            GitHub
          </a>
        ) : null}
        {member.portfolioUrl ? (
          <a
            href={member.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink inline-flex items-center gap-1.5 font-semibold hover:underline underline-offset-4"
          >
            <ExternalLinkIcon />
            Portfolio
          </a>
        ) : null}
      </div>
    </Card>
  );
}
