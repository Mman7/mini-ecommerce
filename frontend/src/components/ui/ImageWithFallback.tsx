"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackSrc,
  onError,
  onLoad,
  ...props
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(!src);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setHasError(!src);
    setIsLoading(Boolean(src));
  }, [src]);

  return (
    <div className="relative size-full overflow-hidden">
      {(isLoading || hasError) && (
        <div
          aria-label={hasError ? alt : "Loading image"}
          className="absolute inset-0 z-10 animate-pulse bg-gray-300"
        />
      )}
      {!hasError && (
        <Image
          {...props}
          src={imageSrc}
          alt={alt}
          fill
          className={`${className} transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={(event) => {
            setIsLoading(false);
            onLoad?.(event);
          }}
          onError={(event) => {
            if (fallbackSrc && imageSrc !== fallbackSrc) {
              setImageSrc(fallbackSrc);
              setIsLoading(true);
            } else {
              setHasError(true);
              setIsLoading(false);
            }
            onError?.(event);
          }}
        />
      )}
    </div>
  );
}
