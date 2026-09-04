"use client";
import { useEffect, useState } from "react";

export function AtelierBackdrop({ videoSrc }: { videoSrc?: string }) {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  const src = "/Shared/Atelier%20Interior.png";

  useEffect(() => {
    if (videoSrc) return;

    let mounted = true;
    const img = new Image();
    img.src = src;
    img.onload = () => mounted && setLoaded(true);
    img.onerror = () => mounted && setLoaded(false);
    return () => {
      mounted = false;
    };
  }, [src, videoSrc]);

  if (videoSrc) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover object-center"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    );
  }

  if (loaded === null || loaded === false) {
    // show neutral gray background while loading or if image failed
    return <div className="absolute inset-0 bg-gray-700" />;
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
