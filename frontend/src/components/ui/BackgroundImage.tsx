"use client";
import { useEffect, useState } from "react";

type AtelierBackdropProps = {
  videoSrc?: string;
  fallbackSrc?: string;
};

export function AtelierBackdrop({
  videoSrc,
  fallbackSrc,
}: AtelierBackdropProps) {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const src = "/Shared/Atelier%20Interior.png";
  const imageSrc = fallbackSrc ?? src;

  useEffect(() => {
    if (videoSrc && !videoFailed) return;

    let mounted = true;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => mounted && setLoaded(true);
    img.onerror = () => mounted && setLoaded(false);
    return () => {
      mounted = false;
    };
  }, [imageSrc, videoFailed, videoSrc]);

  if (videoSrc && !videoFailed) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onError={() => setVideoFailed(true)}
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
        backgroundImage: `url('${imageSrc}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
