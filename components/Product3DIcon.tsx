"use client";

interface Product3DIconProps {
  type: "vape" | "glass" | "cbd" | "tobacco";
}

export default function Product3DIcon({ type }: Product3DIconProps) {
  switch (type) {
    case "vape":
      return (
        <div
          className="product-icon-3d relative flex items-center justify-center"
          style={{ width: "80px", height: "80px", perspective: "400px" }}
        >
          {/* Vape Pen - Rotating Cylinder */}
          <div
            className="relative"
            style={{
              width: "30px",
              height: "60px",
              transformStyle: "preserve-3d",
              animation: "cubeRotate 8s linear infinite, vapeGlow 2s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(16, 185, 129, 0.9))",
                borderRadius: "15px",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(16, 185, 129, 0.3)",
                border: "2px solid rgba(16, 185, 129, 0.8)",
              }}
            />
            {/* Glow tip */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "10px",
                height: "10px",
                background: "radial-gradient(circle, rgba(16, 185, 129, 1), transparent)",
                borderRadius: "50%",
                filter: "blur(4px)",
                animation: "vapeGlow 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      );

    case "glass":
      return (
        <div
          className="product-icon-3d relative flex items-center justify-center"
          style={{ width: "80px", height: "80px", perspective: "400px" }}
        >
          {/* Glass Sphere */}
          <div
            className="relative"
            style={{
              width: "60px",
              height: "60px",
              transformStyle: "preserve-3d",
              animation: "cubeRotate 10s linear infinite",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.6))",
                borderRadius: "50%",
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.3)",
                border: "2px solid rgba(168, 85, 247, 0.6)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glass shine effect */}
              <div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "-10%",
                  width: "120%",
                  height: "30%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                  transform: "rotate(-45deg)",
                  animation: "glassShine 3s linear infinite",
                }}
              />
            </div>
          </div>
        </div>
      );

    case "cbd":
      return (
        <div
          className="product-icon-3d relative flex items-center justify-center"
          style={{ width: "80px", height: "80px", perspective: "400px" }}
        >
          {/* CBD Leaf */}
          <div
            className="relative"
            style={{
              width: "50px",
              height: "70px",
              transformStyle: "preserve-3d",
              animation: "leafWave 3s ease-in-out infinite, float 4s ease-in-out infinite",
            }}
          >
            {/* Leaf shape using radial gradients */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.7), rgba(52, 211, 153, 0.9))",
                clipPath: "polygon(50% 0%, 80% 20%, 100% 40%, 80% 60%, 80% 80%, 50% 100%, 20% 80%, 20% 60%, 0% 40%, 20% 20%)",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
                border: "2px solid rgba(16, 185, 129, 0.8)",
                position: "relative",
              }}
            >
              {/* Leaf veins */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "50%",
                  width: "2px",
                  height: "100%",
                  background: "rgba(16, 185, 129, 0.4)",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>
        </div>
      );

    case "tobacco":
      return (
        <div
          className="product-icon-3d relative flex items-center justify-center"
          style={{ width: "80px", height: "80px", perspective: "400px" }}
        >
          {/* Flame */}
          <div
            className="relative"
            style={{
              width: "40px",
              height: "60px",
              transformStyle: "preserve-3d",
              animation: "flameFlicker 1.5s ease-in-out infinite",
            }}
          >
            {/* Outer flame (purple) */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, rgba(234, 88, 12, 0) 0%, rgba(234, 88, 12, 0.8) 40%, rgba(168, 85, 247, 1) 100%)",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                boxShadow: "0 0 25px rgba(168, 85, 247, 0.6)",
                position: "absolute",
                bottom: "0",
              }}
            />
            {/* Inner flame (emerald) */}
            <div
              style={{
                width: "60%",
                height: "70%",
                background: "linear-gradient(180deg, rgba(234, 179, 8, 0) 0%, rgba(234, 179, 8, 0.9) 40%, rgba(16, 185, 129, 1) 100%)",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                boxShadow: "0 0 15px rgba(16, 185, 129, 0.8)",
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
