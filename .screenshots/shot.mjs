import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const shots = [
  ['home-360',  '/', 360, 800],
  ['home-768',  '/', 768, 1024],
  ['home-1440', '/', 1440, 900],
  ['style-1440','/style-guide', 1440, 900],
];

const b = await chromium.launch();
const report = [];
for (const [name, path, w, h] of shots) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto(BASE+path, {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1800); // let the hero sequence settle
  await p.screenshot({ path:`.screenshots/${name}.png`, fullPage:true });

  // real overflow + layout measurements
  const m = await p.evaluate(() => {
    const de=document.documentElement;
    const over=[...document.querySelectorAll('*')]
      .filter(el=>el.getBoundingClientRect().right > de.clientWidth+1)
      .slice(0,6)
      .map(el=>el.tagName.toLowerCase()+'.'+String(el.className).slice(0,45)+' right='+Math.round(el.getBoundingClientRect().right));
    const h1=document.querySelector('h1');
    const cs=h1?getComputedStyle(h1):null;
    return {
      docW: de.clientWidth,
      scrollW: de.scrollWidth,
      hScroll: de.scrollWidth > de.clientWidth+1,
      h1Font: cs?cs.fontSize:null,
      h1Family: cs?cs.fontFamily.split(',')[0]:null,
      h1Right: h1?Math.round(h1.getBoundingClientRect().right):null,
      overflowers: over,
      pageH: de.scrollHeight,
    };
  });
  report.push({name, w, ...m});
  await ctx.close();
}
await b.close();
for(const r of report){
  console.log(`\n=== ${r.name} (viewport ${r.w}) ===`);
  console.log(`  doc=${r.docW} scroll=${r.scrollW} hScroll=${r.hScroll?'*** YES ***':'no'} pageH=${r.pageH}`);
  console.log(`  h1: ${r.h1Font} ${r.h1Family} right=${r.h1Right}`);
  if(r.overflowers.length) console.log('  OVERFLOW:', r.overflowers.join('\n            '));
}
