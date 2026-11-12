import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
    background: #010f09;
    border: 1px solid rgba(43, 255, 160, 0.35);
    border-radius: 10px;
    box-shadow: 0 0 18px rgba(43, 255, 160, 0.12), inset 0 0 40px rgba(43, 255, 160, 0.05);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    color: #8affce;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px 8px;
    border-bottom: 1px solid rgba(43, 255, 160, 0.25);
    background: linear-gradient(180deg, rgba(43, 255, 160, 0.08), transparent);
  }

  .title {
    font-size: 13px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #b4ffd9;
    text-shadow: 0 0 8px rgba(43, 255, 160, 0.65);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contacts {
    font-size: 11px;
    letter-spacing: 0.18em;
    padding: 3px 10px;
    border: 1px solid rgba(43, 255, 160, 0.5);
    border-radius: 999px;
    color: #2bffa0;
    background: rgba(43, 255, 160, 0.08);
    text-shadow: 0 0 6px rgba(43, 255, 160, 0.6);
    white-space: nowrap;
  }

  .radar-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    width: 100%;
    background: radial-gradient(circle at center, #04281a 0%, #02180f 75%, #010f09 100%);
  }

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    cursor: crosshair;
  }

  /* CRT overlays: scanlines + vignette */
  .scanlines,
  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .scanlines {
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.13) 0px,
      rgba(0, 0, 0, 0.13) 1px,
      transparent 1px,
      transparent 4px
    );
    opacity: 0.55;
  }

  .vignette {
    background: radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.5) 100%);
  }

  .notice {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    padding: 24px;
    color: #ffb454;
    font-size: 12px;
    letter-spacing: 0.08em;
    background: rgba(1, 15, 9, 0.72);
    z-index: 5;
  }

  .notice code {
    background: rgba(255, 180, 84, 0.12);
    border: 1px solid rgba(255, 180, 84, 0.4);
    border-radius: 4px;
    padding: 2px 6px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 14px;
    border-top: 1px solid rgba(43, 255, 160, 0.25);
    font-size: 10px;
    letter-spacing: 0.12em;
    color: rgba(138, 255, 206, 0.75);
    background: linear-gradient(0deg, rgba(43, 255, 160, 0.06), transparent);
    white-space: nowrap;
    overflow: hidden;
  }

  .footer .seg {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer .error {
    color: #ff7a5c;
    text-shadow: 0 0 6px rgba(255, 122, 92, 0.6);
    animation: blink 1.4s steps(2, start) infinite;
  }

  @keyframes blink {
    to {
      visibility: hidden;
    }
  }

  /* Flight details panel */
  .details {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    z-index: 6;
    background: rgba(2, 24, 15, 0.92);
    border: 1px solid rgba(43, 255, 160, 0.45);
    border-radius: 8px;
    box-shadow: 0 0 22px rgba(43, 255, 160, 0.18);
    padding: 10px 12px;
    backdrop-filter: blur(3px);
  }

  .details-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 1px solid rgba(43, 255, 160, 0.3);
    padding-bottom: 6px;
    margin-bottom: 8px;
  }

  .callsign {
    font-size: 18px;
    letter-spacing: 0.18em;
    color: #b4ffd9;
    text-shadow: 0 0 10px rgba(43, 255, 160, 0.7);
  }

  .type {
    font-size: 11px;
    letter-spacing: 0.12em;
    color: rgba(138, 255, 206, 0.7);
    margin-left: 8px;
  }

  .close {
    appearance: none;
    border: 1px solid rgba(43, 255, 160, 0.4);
    background: transparent;
    color: #8affce;
    border-radius: 4px;
    font: inherit;
    font-size: 11px;
    padding: 2px 8px;
    cursor: pointer;
    letter-spacing: 0.1em;
  }

  .close:hover {
    background: rgba(43, 255, 160, 0.15);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px 10px;
  }

  .field label {
    display: block;
    font-size: 8px;
    letter-spacing: 0.2em;
    color: rgba(138, 255, 206, 0.55);
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .field span {
    font-size: 12px;
    color: #d7ffeb;
    letter-spacing: 0.05em;
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .footer {
      flex-wrap: wrap;
      white-space: normal;
    }
  }
`;
