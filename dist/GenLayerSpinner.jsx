import { useId } from "react";

/**
 * GenLayer Spinner.
 *
 * Inline SVG build. The track and the GenLayer mark use `currentColor`, so the
 * spinner adapts to light and dark surfaces from whatever `color` it inherits.
 * The sweeping arc uses the GenLayer Points rainbow.
 *
 *   <GenLayerSpinner />
 *   <GenLayerSpinner size={16} showMark={false} />
 *   <GenLayerSpinner size={72} duration="1.9s" label="Verifying decision" />
 */
export default function GenLayerSpinner({
  size = 40,
  duration = "1.6s",
  showMark = true,
  label = "Loading",
  className = "",
  style,
  ...rest
}) {
  const uid = useId().replace(/[:]/g, "");
  const gradientId = `glp-${uid}`;
  const rotorName = `gl-rotor-${uid}`;
  const arcName = `gl-arc-${uid}`;
  const coreName = `gl-core-${uid}`;

  const css = `
    .rotor-${uid} { transform-origin: 24px 24px; animation: ${rotorName} ${duration} linear infinite; }
    .arc-${uid}   { animation: ${arcName} ${duration} cubic-bezier(.42,0,.25,1) infinite; }
    .core-${uid}  { transform-origin: 17.0147px 16px; animation: ${coreName} ${duration} cubic-bezier(.34,1.4,.5,1) infinite; }

    @keyframes ${rotorName} { to { transform: rotate(360deg); } }
    @keyframes ${arcName} {
      0%   { stroke-dasharray: 9 116.7; stroke-dashoffset: 0; }
      55%  { stroke-dasharray: 82 43.7; stroke-dashoffset: -20; }
      100% { stroke-dasharray: 9 116.7; stroke-dashoffset: -125.664; }
    }
    @keyframes ${coreName} {
      0%, 58%, 100% { transform: scale(1);    opacity: .9; }
      74%           { transform: scale(1.11); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .rotor-${uid} { animation: none; transform: rotate(-90deg); }
      .arc-${uid}   { animation: none; stroke-dasharray: 82 43.7; stroke-dashoffset: -20; }
      .core-${uid}  { animation: none; opacity: 1; }
    }
  `;

  const stroke = 3.6;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="status"
      aria-label={label}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...rest}
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="4" y1="44" x2="44" y2="4">
          <stop offset="0" stopColor="#9B83EA" />
          <stop offset="0.24" stopColor="#77AEE9" />
          <stop offset="0.46" stopColor="#75D4B6" />
          <stop offset="0.7" stopColor="#E694C4" />
          <stop offset="1" stopColor="#EFB36A" />
        </linearGradient>
      </defs>

      <style>{css}</style>

      <circle
        cx="24" cy="24" r="20"
        fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth={stroke}
      />

      <g className={`rotor-${uid}`}>
        <circle
          className={`arc-${uid}`}
          cx="24" cy="24" r="20"
          fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round"
        />
      </g>

      {showMark && (
        <g transform="translate(14.472 15.04) scale(0.56)">
          <g className={`core-${uid}`} fill="currentColor">
            <path d="M15.4065 11.2607L9.64908 23.3639L15.0689 26.072L0 32L15.4065 0V11.2607Z" />
            <path d="M18.6229 11.2607L24.3803 23.3639L18.9605 26.072L34.0294 32L18.6229 0V11.2607Z" />
            <path d="M16.9311 15.2394L20.3041 21.9088L16.9311 23.5623L13.7392 21.9019L16.9311 15.2394Z" />
          </g>
        </g>
      )}
    </svg>
  );
}
