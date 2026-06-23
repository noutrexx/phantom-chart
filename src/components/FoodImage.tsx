import { useState } from "react";

// Renders a real photo; on load error it degrades to a tasteful gradient.
export default function FoodImage({
  src,
  alt,
  className = "",
  gradient = "linear-gradient(135deg,#f7c948,#f0932b)",
}: {
  src: string;
  alt: string;
  className?: string;
  gradient?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return <div className={className} style={{ background: gradient }} aria-label={alt} role="img" />;
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 shimmer" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
