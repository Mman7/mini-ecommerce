import type { User } from "@/src/api/user.api";
import { TextInView } from "../motion/TextInView";

export function ProfileHeader({ user }: { user: User | null }) {
  return (
    <section className="glass-panel flex items-center gap-5 rounded-lg p-6">
      <div className="bg-primary text-primary-ink flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-3xl font-semibold">
        {user?.name?.charAt(0).toUpperCase() || "U"}
      </div>
      <div>
        <TextInView>
          <h2 className="heading-font text-2xl font-semibold">
            {user?.name || "Your profile"}
          </h2>
        </TextInView>
        <p className="text-text-muted mt-1 text-sm">
          {user?.email || "Loading account details..."}
        </p>
        {user?.createdAt && (
          <p className="text-primary-soft mt-2 text-xs">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </section>
  );
}
