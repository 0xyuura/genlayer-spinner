import { useId } from "react";

/**
 * GenLayer Spinner.
 *
 * Inline SVG build. The track and the GenLayer mark use `currentColor`, so the
 * spinner adapts to light and dark surfaces from whatever `color` it inherits.
 *
 * Motion: three validators commit their arc in turn, the ring closes when
 * quorum is reached, the mark registers the decision, then the ring advances
 * exactly one slot. 120 degrees maps the three fold arrangement onto itself,
 * so the loop point is invisible.
 *
 *   <GenLayerSpinner />
 *   <GenLayerSpinner size={16} showMark={false} />
 *   <GenLayerSpinner size={72} duration="1.9s" label="Verifying decision" />
 */

// r = 20, circumference 125.664, one slot is 41.888
const REST = "11 114.664";
const FULL = "40 85.664";

const STOPS = [
  ["0", "#9B83EA"],
  ["0.2", "#77AEE9"],
  ["0.4", "#75D4B6"],
  ["0.6", "#E694C4"],
  ["0.8", "#EFB36A"],
  ["1", "#9B83EA"],
];

export default function GenLayerSpinner({
  size = 40,
  duration = "1.6s",
  showMark = true,
  label = "Loading",
  className = "",
  style,
  ...rest
}) {
  const uid = useId().replace(/:/g, "");
  const g = (n) => `glp-${n}-${uid}`;

  const css = `
    .rotor-${uid} {
      transform-origin: 24px 24px;
      animation: advance-${uid} ${duration} cubic-bezier(.66,0,.34,1) infinite;
    }
    .seg-${uid} {
      stroke-dasharray: ${REST};
      animation-duration: ${duration};
      animation-timing-function: cubic-bezier(.5,0,.2,1);
      animation-iteration-count: infinite;
    }
    .seg1-${uid} { animation-name: vote1-${uid}; }
    .seg2-${uid} { animation-name: vote2-${uid}; }
    .seg3-${uid} { animation-name: vote3-${uid}; }
    .core-${uid} {
      transform-origin: 17.0147px 16px;
      animation: decide-${uid} ${duration} cubic-bezier(.34,1.4,.5,1) infinite;
    }

    @keyframes advance-${uid} {
      0%, 58% { transform: rotate(0deg); }
      100%    { transform: rotate(120deg); }
    }
    @keyframes vote1-${uid} {
      0%        { stroke-dasharray: ${REST}; }
      30%, 58%  { stroke-dasharray: ${FULL}; }
      78%, 100% { stroke-dasharray: ${REST}; }
    }
    @keyframes vote2-${uid} {
      0%, 10%   { stroke-dasharray: ${REST}; }
      38%, 58%  { stroke-dasharray: ${FULL}; }
      86%, 100% { stroke-dasharray: ${REST}; }
    }
    @keyframes vote3-${uid} {
      0%, 20%   { stroke-dasharray: ${REST}; }
      46%, 58%  { stroke-dasharray: ${FULL}; }
      94%, 100% { stroke-dasharray: ${REST}; }
    }
    @keyframes decide-${uid} {
      0%, 42%   { transform: scale(1);    opacity: .88; }
      56%       { transform: scale(1.13); opacity: 1; }
      76%, 100% { transform: scale(1);    opacity: .88; }
    }

    @media (prefers-reduced-motion: reduce) {
      .rotor-${uid} { animation: none; }
      .seg-${uid}   { animation: none; stroke-dasharray: 30 95.664; }
      .core-${uid}  { animation: none; opacity: 1; }
    }
  `;

  const gradient = (id, rotate) => (
    <linearGradient
      key={id}
      id={id}
      gradientUnits="userSpaceOnUse"
      x1="44" y1="24" x2="14" y2="41.32"
      {...(rotate ? { gradientTransform: `rotate(${rotate} 24 24)` } : {})}
    >
      {STOPS.map(([offset, color]) => (
        <stop key={offset} offset={offset} stopColor={color} />
      ))}
    </linearGradient>
  );

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
        {gradient(g("a"), 0)}
        {gradient(g("b"), 120)}
        {gradient(g("c"), 240)}
      </defs>

      <style>{css}</style>

      <circle
        cx="24" cy="24" r="20"
        fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3.6"
      />

      <g className={`rotor-${uid}`} fill="none" strokeWidth="3.6" strokeLinecap="round">
        <circle className={`seg-${uid} seg1-${uid}`} cx="24" cy="24" r="20"
                stroke={`url(#${g("a")})`} strokeDashoffset="0" />
        <circle className={`seg-${uid} seg2-${uid}`} cx="24" cy="24" r="20"
                stroke={`url(#${g("b")})`} strokeDashoffset="-41.888" />
        <circle className={`seg-${uid} seg3-${uid}`} cx="24" cy="24" r="20"
                stroke={`url(#${g("c")})`} strokeDashoffset="-83.776" />
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
