import styles from "../../styles/App.module.scss";

export function RoadIllustration() {
  return (
    <div className={styles.roadIllustration} aria-label="Illustrazione di una strada che attraversa un paesaggio verde">
      <svg viewBox="0 0 620 520" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf4d8" />
            <stop offset="1" stopColor="#f8e9b8" />
          </linearGradient>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5c625d" />
            <stop offset="1" stopColor="#303a35" />
          </linearGradient>
        </defs>
        <rect width="620" height="520" rx="32" fill="url(#sky)" />
        <circle cx="490" cy="92" r="41" fill="#ffc857" opacity=".95" />
        <path d="M0 230 Q110 150 205 224T410 211T620 195V520H0Z" fill="#9bc49f" />
        <path d="M0 303 Q112 223 224 288T440 267T620 250V520H0Z" fill="#4e8c6b" />
        <path d="M230 520 276 254h77l83 266Z" fill="url(#road)" />
        <path d="m317 490 1-52m0-51 1-43m0-37 1-28" stroke="#fff7d6" strokeWidth="10" strokeLinecap="round" />
        <g transform="translate(428 232)">
          <path d="M0 132V36" stroke="#293f34" strokeWidth="8" />
          <path d="M-42 1h84l-8 66h-68Z" fill="#fcfff8" stroke="#293f34" strokeWidth="7" />
          <path d="M-11 18h22v32h-22z" fill="#ef6b5b" rx="3" />
        </g>
        <g transform="translate(98 240)">
          <path d="M0 93V30" stroke="#293f34" strokeWidth="7" />
          <circle cy="0" r="31" fill="#fff" stroke="#ef6b5b" strokeWidth="8" />
          <path d="M-14 0h28" stroke="#293f34" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g transform="translate(348 381)">
          <rect x="-25" y="-19" width="64" height="31" rx="10" fill="#f28c53" />
          <circle cx="-10" cy="14" r="9" fill="#17251f" />
          <circle cx="28" cy="14" r="9" fill="#17251f" />
          <path d="m-13-18 12-19h22l14 19" fill="#f28c53" stroke="#f28c53" strokeWidth="4" />
          <path d="m-5-20 9-12h14l9 12" fill="#dbe9df" />
        </g>
        <g fill="#294e3c">
          <circle cx="56" cy="238" r="38" /><circle cx="88" cy="227" r="29" />
          <circle cx="545" cy="221" r="46" /><circle cx="585" cy="235" r="35" />
        </g>
        <g fill="#fff" opacity=".75">
          <ellipse cx="125" cy="89" rx="56" ry="19" />
          <ellipse cx="165" cy="83" rx="35" ry="26" />
          <ellipse cx="235" cy="125" rx="42" ry="14" />
        </g>
      </svg>
      <div className={styles.illustrationNote}>
        <span aria-hidden="true">✦</span>
        <strong>Un passo alla volta</strong>
        <small>Il percorso si adatta ai tuoi progressi</small>
      </div>
    </div>
  );
}
