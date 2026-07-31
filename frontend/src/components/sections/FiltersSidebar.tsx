"use client";

export default function FiltersSidebar() {
  return (
    <aside className="space-y-6">
      <div className="bg-surface-1 rounded-[14px] border border-(--outline-strong)/35 p-6 shadow-[inset_0_1px_0_rgba(230,225,228,0.03)]">
        <h3 className="heading-font text-foreground mb-6 text-4xl leading-none font-semibold">
          Filters
        </h3>
        <div className="mb-lg">
          <h4 className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase">
            Category
          </h4>
          <div className="space-y-3">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                defaultChecked
                className="checked:border-primary-soft checked:bg-primary-soft h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-(--outline-strong) bg-transparent focus-visible:outline-none"
                type="checkbox"
              />
              <span className="text-body-md text-foreground group-hover:text-primary-soft transition-colors">
                Plush Toys
              </span>
              <span className="meta-font ml-auto text-[13px] font-semibold text-(--text-muted)/70">
                128
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                className="checked:border-primary-soft checked:bg-primary-soft h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-(--outline-strong) bg-transparent focus-visible:outline-none"
                type="checkbox"
              />
              <span className="text-body-md text-foreground group-hover:text-primary-soft transition-colors">
                Anime Figurines
              </span>
              <span className="meta-font ml-auto text-[13px] font-semibold text-(--text-muted)/70">
                64
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                className="checked:border-primary-soft checked:bg-primary-soft h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-(--outline-strong) bg-transparent focus-visible:outline-none"
                type="checkbox"
              />
              <span className="text-body-md text-foreground group-hover:text-primary-soft transition-colors">
                Stationery
              </span>
              <span className="meta-font ml-auto text-[13px] font-semibold text-(--text-muted)/70">
                32
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                className="checked:border-primary-soft checked:bg-primary-soft h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-(--outline-strong) bg-transparent focus-visible:outline-none"
                type="checkbox"
              />
              <span className="text-body-md text-foreground group-hover:text-primary-soft transition-colors">
                Vinyl Art
              </span>
              <span className="meta-font ml-auto text-[13px] font-semibold text-(--text-muted)/70">
                18
              </span>
            </label>
          </div>
        </div>
        <div className="mt-7 mb-7">
          <h4 className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase">
            Price Range
          </h4>
          <div className="space-y-4">
            <input
              className="accent-primary-soft h-1 w-full cursor-pointer appearance-none rounded-full bg-(--outline-strong)"
              type="range"
            />
            <div className="meta-font text-foreground flex justify-between text-[14px] font-semibold">
              <span>¥500</span>
              <span>¥50,000+</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase">
            Featured Brands
          </h4>
          <div className="flex flex-wrap gap-2">
            <button className="meta-font bg-surface-4 text-foreground rounded-full border border-white/10 px-3 py-1 text-[13px] font-semibold transition-all hover:border-(--primary-soft)/50">
              Sanrio
            </button>
            <button className="meta-font text-primary-soft rounded-full border border-(--primary-soft)/40 bg-[rgba(255,183,122,0.14)] px-3 py-1 text-[13px] font-semibold">
              Ghibli
            </button>
            <button className="meta-font bg-surface-4 text-foreground rounded-full border border-white/10 px-3 py-1 text-[13px] font-semibold transition-all hover:border-(--primary-soft)/50">
              Bandai
            </button>
            <button className="meta-font bg-surface-4 text-foreground rounded-full border border-white/10 px-3 py-1 text-[13px] font-semibold transition-all hover:border-(--primary-soft)/50">
              Good Smile
            </button>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-[14px] border border-[rgba(255,174,218,0.22)] bg-[linear-gradient(160deg,rgba(111,49,87,0.28),rgba(38,22,33,0.82))] p-6">
        <div className="absolute -top-8 -right-8 h-32 w-32 bg-[rgba(255,174,218,0.14)] blur-3xl transition-all group-hover:blur-2xl"></div>
        <h3 className="title-font text-secondary mb-3 text-4xl font-semibold">
          Monthly Crate
        </h3>
        <p className="text-body-md mb-5 text-(--foreground)/92">
          Get a curated box of Tokyo surprises every month.
        </p>
        <button className="meta-font bg-secondary w-full rounded-md py-2.5 text-lg font-semibold text-[#541a3f] transition-all hover:scale-[1.02] active:scale-95">
          Subscribe Now
        </button>
      </div>
    </aside>
  );
}
