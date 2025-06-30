import React from "react";

interface ForceScrollProps {
  minWidth: string;
  children: React.ReactNode;
}

export function ForceScroll({ minWidth, children }: ForceScrollProps) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        maxWidth: "100%",
        position: "relative",
      }}
    >
      <div
        className="overflow-x-auto"
        style={{
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          width: "100%",
        }}
      >
        <div style={{ minWidth, width: "100%" }}>{children}</div>
      </div>
    </div>
  );
}
