import type { SavedAddress } from "@/src/api/user.api";

export function AddressPreviewCard({ address }: { address: SavedAddress }) {
  return (
    <article className="glass-panel rounded-lg p-5">
      <h3 className="meta-font text-sm font-semibold">Address</h3>
      <p className="text-text-muted mt-3 text-sm leading-6">
        {address.address}
      </p>
    </article>
  );
}
