import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CloudImage } from "@/components/site/CloudImage";
import type { Member } from "@/lib/types";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const MAX_SKILLS = 6;

/** Raw Cloudinary delivery URL for a resume PDF, or null if it can't be built. */
function resumeUrl(member: Member): string | null {
  if (!CLOUD_NAME || !member.resumePublicId) return null;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${member.resumePublicId}.pdf`;
}

/** One recruiter-facing profile card. Rendered as a list item by the caller. */
export function MemberCard({ member }: { member: Member }) {
  const fullName = `${member.firstName} ${member.lastName}`;
  const resume = resumeUrl(member);
  const skills = member.skills.slice(0, MAX_SKILLS);

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-4">
        <CloudImage
          publicId={member.photoPublicId}
          alt={`Photo of ${fullName}`}
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-title-sm text-ink truncate">{fullName}</h3>
          <p className="text-body-sm text-body">{member.major}</p>
          <p className="text-caption text-muted">Class of {member.gradYear}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="brand">{member.classification}</Badge>
        {member.seeking.map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      {member.bio ? (
        <p className="text-body-sm text-body">{member.bio}</p>
      ) : null}

      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label={`${fullName}'s skills`}>
          {skills.map((skill) => (
            <li key={skill}>
              <Badge tone="neutral">{skill}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-body-sm">
        {resume ? (
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink font-semibold hover:underline underline-offset-4"
          >
            Resume
          </a>
        ) : (
          <span className="text-muted-soft" aria-disabled="true">
            Resume unavailable
          </span>
        )}
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink font-semibold hover:underline underline-offset-4"
          >
            LinkedIn
          </a>
        ) : null}
        {member.githubUrl ? (
          <a
            href={member.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink font-semibold hover:underline underline-offset-4"
          >
            GitHub
          </a>
        ) : null}
        {member.portfolioUrl ? (
          <a
            href={member.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink font-semibold hover:underline underline-offset-4"
          >
            Portfolio
          </a>
        ) : null}
      </div>
    </Card>
  );
}
