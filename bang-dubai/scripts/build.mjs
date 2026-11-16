// Build standalone still HTML (stills/*.html) from scene SVG.
// The animated video compositions + index.html are built by scripts/build-video.mjs.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES } from "../compositions/components/scenes.mjs";
import { FONT_CSS, FONT_CSS_REL } from "../compositions/components/kit.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(join(root, "compositions"), { recursive: true });
mkdirSync(join(root, "stills"), { recursive: true });

const stillCss = `${FONT_CSS}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; background: #0c0806; }
  svg { display: block; width: 1080px; height: 1920px; }
`;

function stillHTML(svg) {
  return `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <style>${stillCss}</style>
  </head>
  <body>
    ${svg}
  </body>
</html>
`;
}

function hfHTML(scene, svg) {
  return `<template>
  <style>
    ${FONT_CSS_REL}
    #root { position: absolute; inset: 0; overflow: hidden; background: #0c0806; font-family: Kanit, sans-serif; }
    .clip { position: absolute; inset: 0; }
    svg.scene { position: absolute; inset: 0; width: 1080px; height: 1920px; }
  </style>
  <div data-hf-id="hf-${scene.id}" id="root" data-composition-id="${scene.id}" data-width="1080" data-height="1920" data-layout-allow-overflow data-layout-allow-overlap>
    <div data-hf-id="hf-${scene.id}-clip" class="clip" data-start="0" data-duration="${scene.duration}" data-track-index="1" data-hold>
      ${svg.replace("<svg ", '<svg class="scene" ')}
    </div>
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(".oil-col", { scaleY: 0.92 }, { scaleY: 1.04, transformOrigin: "50% 100%", duration: 1.6, yoyo: true, repeat: 6, ease: "sine.inOut" }, 0);
    tl.fromTo(".oil-drop", { y: -12 }, { y: 18, duration: 1.4, yoyo: true, repeat: 6, ease: "sine.inOut", stagger: 0.08 }, 0);
    window.__timelines["${scene.id}"] = tl;
  </script>
</template>
`;
}

const clips = [];
for (const scene of SCENES) {
  const svg = scene.fn();
  writeFileSync(join(root, "stills", `${scene.id}.html`), stillHTML(svg));
  clips.push(`      <div data-hf-id="hf-clip-${scene.id}" id="${scene.id}" data-composition-id="${scene.id}" data-composition-src="compositions/${scene.id}.html" data-start="${scene.start}" data-duration="${scene.duration}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`);
  console.log("wrote", scene.id, "svg bytes", svg.length);
}

console.log("stills written (video: node scripts/build-video.mjs)");
