'use client';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-bar"></div>
      <style jsx>{`
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
        }
        .loading-bar {
          height: 3px;
          width: 100%;
          background: #e11d48;
          animation: loading 2s linear infinite;
          transform-origin: 0% 50%;
        }
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
