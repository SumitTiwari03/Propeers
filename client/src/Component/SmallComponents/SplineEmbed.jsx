import React, { useEffect, useRef } from "react";

const SplineEmbed = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically load the Spline viewer script
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@0.9.369/build/spline-viewer.js";
    script.async = true;

    // Append the script to the document head
    document.head.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ height: "500px", width: "100%" }}
    >
      <spline-viewer
        url="https://prod.spline.design/QK3WrN0dXJ0bnwxY/scene.splinecode"
        style={{ width: "100%", height: "100%" }}
      ></spline-viewer>
    </div>
  );
};

export default SplineEmbed;
