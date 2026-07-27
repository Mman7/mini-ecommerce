type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  titleClassName?: string;
  align?: "left" | "center";
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleClassName,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <header className={joinClasses("space-y-3", isCenter ? "text-center" : "")}>
      {eyebrow ? (
        <p className="meta-font text-primary-soft text-xs font-semibold tracking-[0.24em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`heading-font text-2xl leading-tight font-semibold sm:text-3xl ${titleClassName}`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={joinClasses(
            "text-text-muted max-w-2xl text-sm leading-relaxed sm:text-base",
            isCenter ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
