import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=VT323&family=Oxanium:wght@400;600;800&display=swap');

  :root {
    --primary: #0ff8;
    --secondary: #f0f8;
    --tertiary: #ff0f8;
    --dark: #080821;
    --darker: #050516;
    --light: #2a2a50;
    --success: #0cff9a;
    --warning: #ffcc00;
    --danger: #ff3358;
    --text-primary: #ffffff;
    --text-secondary: #9cafdf;
    --background: #080821;
    --card-bg: rgba(10, 15, 36, 0.75);
    --grid-color: rgba(46, 80, 156, 0.7);
    --grid-highlight: rgba(0, 219, 255, 0.7);
    --gradient-1: linear-gradient(135deg, #0ff8, #0091ff);
    --gradient-2: linear-gradient(135deg, #f0f8, #ff3358);
    --gradient-3: linear-gradient(90deg, #ff3358, #ffcc00);
    --font-mono: 'VT323', monospace;
    --font-display: 'Oxanium', sans-serif;
    --transition: all 0.3s ease;
    --shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    --glow: 0 0 8px var(--primary);
    --cursor-size: 28px;
    --cursor-color: #00ffff;
    --cursor-center-size: 6px;
    --trail-size: 12px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: none !important;
  }

  html, body {
    font-family: var(--font-display);
    background-color: var(--background);
    color: var(--text-primary);
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* Custom cursor styling */
  .custom-cursor {
    position: fixed;
    width: var(--cursor-size);
    height: var(--cursor-size);
    border: 3px solid var(--cursor-color);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    transition: transform 0.1s ease, opacity 0.3s ease;
    mix-blend-mode: screen;
    box-shadow: 0 0 10px var(--cursor-color), 0 0 20px rgba(0, 255, 255, 0.3);
    opacity: 1;
  }

  .custom-cursor::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--cursor-center-size);
    height: var(--cursor-center-size);
    background-color: var(--cursor-color);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--cursor-color);
  }

  .custom-cursor.active {
    transform: translate(-50%, -50%) scale(0.8);
    background-color: rgba(0, 255, 255, 0.2);
    mix-blend-mode: screen;
  }

  /* Cursor trail effect */
  .cursor-trail {
    position: fixed;
    width: var(--trail-size);
    height: var(--trail-size);
    background: radial-gradient(circle, var(--cursor-color) 0%, rgba(0, 255, 255, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9998;
    mix-blend-mode: screen;
    transition: opacity 0.3s ease;
    filter: blur(1px);
    box-shadow: 0 0 6px rgba(0, 255, 255, 0.5);
  }

  /* Cursor styles for interactive elements */
  a, button, [role="button"], input, select, textarea, [onclick], .clickable, [type="button"], [type="submit"], 
  [type="reset"], label[for], summary, details, div[tabindex], area, map, iframe, object, embed, [contenteditable="true"],
  .react-three-fiber canvas, audio[controls], video[controls], [draggable="true"] {
    &:hover ~ .custom-cursor {
      transform: translate(-50%, -50%) scale(1.2);
      border-color: #ff33cc;
      &::after {
        background-color: #ff33cc;
        box-shadow: 0 0 8px #ff33cc;
      }
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 800;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h1 {
    font-size: 3.5rem;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  h2 {
    font-size: 2.5rem;
    color: var(--primary);
  }

  h3 {
    font-size: 2rem;
    color: var(--secondary);
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    font-family: var(--font-display);
    font-weight: 400;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: var(--transition);
    &:hover {
      color: var(--secondary);
      text-shadow: var(--glow);
    }
  }

  button {
    border: none;
    outline: none;
    font-family: var(--font-display);
    transition: var(--transition);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  code, pre, .monospace {
    font-family: var(--font-mono);
    font-size: 1.1em;
    letter-spacing: 1px;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--dark);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary);
  }

  /* Selection color */
  ::selection {
    background: var(--secondary);
    color: var(--dark);
  }
`;

export default GlobalStyles; 