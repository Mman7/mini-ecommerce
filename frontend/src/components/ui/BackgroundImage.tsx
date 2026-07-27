"use client";
import { useEffect, useState } from "react";

export function BackgroundImage() {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  const src = "/Shared/Atelier%20Interior.png";

  useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.src = src;
    img.onload = () => mounted && setLoaded(true);
    img.onerror = () => mounted && setLoaded(false);
    return () => {
      mounted = false;
    };
  }, [src]);

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
