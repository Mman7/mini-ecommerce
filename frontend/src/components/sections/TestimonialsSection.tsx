import { SectionHeading } from "@/src/components/ui/SectionHeading";

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

type TestimonialsSectionProps = {
  entries: Testimonial[];
};

export function TestimonialsSection({ entries }: TestimonialsSectionProps) {
  return (
    <section className="padding-inline my-40 space-y-6 pb-2">
      <SectionHeading
        align="center"
        titleClassName="mb-10"
        title="Cherished Moments"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-surface-2 space-y-3 rounded-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-surface-3 text-on-surface flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                {entry.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="meta-font text-sm font-semibold">
                  {entry.name}
                </h3>
                <p className="meta-font text-tertiary text-xs">{entry.role}</p>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed italic">
              "{entry.quote}"
            </p>
            <p className="meta-font text-primary-soft text-xs tracking-[0.18em]">
              *****
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
