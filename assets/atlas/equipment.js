'use strict';
(()=>{
 const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 reduced.addEventListener('change',()=>qa('.process-explorer').forEach(e=>setFlow(e,reduced.matches||!window.PORTFOLIO_SETTINGS.processAnimation)));
 const details={water:{
 intake:['Seawater intake','Feedwater enters the plant. Intake conditions influence pretreatment needs, environmental controls and operating reliability.'],
 pretreat:['Pretreatment','Suspended solids and fouling risks are managed before the membranes. The exact pretreatment train depends on seawater quality; the diagram does not claim a particular design for the simulated site.'],
 pressure:['High-pressure pumping','Pressure drives water through the SWRO membranes. Electricity cost is a key operating-cost input—the factor I varied in the Excel event-card model.'],
 membrane:['SWRO membranes','Reverse osmosis separates a low-salt permeate stream from a concentrated brine stream. A uses a conventional configuration; B uses a modular configuration.'],
 finish:['Post-treatment','Product water is conditioned for delivery, typically through remineralization, pH control and disinfection. Compliance with the off-taker’s water specification matters alongside cost.'],
 delivery:['Storage & off-taker delivery','The project delivers treated water to the purchasing organization. Availability, water quality and payment rules connect plant performance to the PPP agreement.'],
 power:['Electricity & tariff sensitivity','The case used 3.20 kWh/m³ for A and 3.05 kWh/m³ for expanded B. At SAR 0.28/kWh, modeled full-cost tariffs were 7.30 and 7.67 SAR/m³ respectively.'],
 recovery:['Energy recovery','An energy-recovery device recovers pressure energy from the concentrated brine to reduce pumping demand. This is technical context for SWRO, not an additional saving applied to the case-model tariffs.'],
 outfall:['Concentrate management','The concentrated reject stream requires a controlled discharge and environmental assessment. These considerations belong in project feasibility and risk allocation.']},ptx:{
 renewables:['Solar + wind electricity','The project used renewable energy to support green hydrogen and ammonia production. Electricity powers electrolysis and the plant’s pumps, compressors and utilities; this map emphasizes the main conversion path.'],
 pretreat:['Seawater pretreatment','Pretreatment protects the downstream water-treatment equipment. It is the first conditioning step in the report’s overall process flow sheet.'],
 ro:['Reverse osmosis','RO removes dissolved salts from seawater. Permeate continues toward electrolyzer feed preparation; the concentrate leaves through a separate reject stream.'],
 polish:['Post-treatment & water polishing','The report’s post-treatment stage prepares water for electrolysis. Feed quality must meet the electrolyzer’s requirements; RO desalination and final polishing serve different purposes.'],
 pem:['PEM electrolysis','Renewable electricity splits water into hydrogen and oxygen: 2H₂O → 2H₂ + O₂. The map follows the PEM route specified in the project’s main design; gas separation and cooling are simplified.'],
 dry:['Water removal','Water is removed from the hydrogen stream before downstream storage or synthesis. My work included mass and energy balances across the process units.'],
 split:['Hydrogen allocation','The report’s overall flow sheet splits hydrogen between ammonia production and storage. The storage branch can serve as a buffer or a separate product route.'],
 storage:['Hydrogen storage','A separate hydrogen outlet is retained from Figure 3.1. Storage connects production with product use and buffering; no storage size or revenue is assumed in this diagram.'],
 nitrogen:['External nitrogen supply','Section 5.3 specifies nitrogen supplied from outside the modeled ammonia unit. This map therefore shows an external nitrogen feed rather than adding an on-site air-separation plant.'],
 mix:['Mixing & compression','Hydrogen and nitrogen combine at a 3:1 molar ratio before compression and synthesis. Compressor duties connect process simulation to energy demand.'],
 reactor:['Haber–Bosch synthesis','Nitrogen reacts with hydrogen to produce ammonia: N₂ + 3H₂ → 2NH₃. Heat removal and operating conditions are key engineering considerations in the project.'],
 cool:['Product cooling','The report’s ammonia simulation includes downstream cooling. A further separation step is discussed as an option if impurities remain; it is not shown here as installed equipment.']}};
 function setFlow(e,pause){e.classList.toggle('flow-paused',pause)}
 qa('.process-explorer').forEach(e=>{
  const dialog=document.createElement('dialog');dialog.className='equipment-dialog';dialog.setAttribute('aria-label','Equipment details');dialog.innerHTML='<p class="eyebrow">PROCESS DETAIL</p><h3></h3><p class="dialog-description"></p><button type="button">Back to diagram</button>';e.append(dialog);q('button',dialog).addEventListener('click',()=>dialog.close());
  setFlow(e,reduced.matches||!window.PORTFOLIO_SETTINGS.processAnimation);

  qa('[data-unit]',e).forEach(u=>{function activate(){const d=details[e.dataset.process][u.dataset.unit];qa('[data-unit]',e).forEach(n=>{n.classList.toggle('selected',n.dataset.unit===u.dataset.unit);n.setAttribute('aria-pressed',String(n.dataset.unit===u.dataset.unit))});const box=q('.unit-inspector',e);box.replaceChildren();const title=document.createElement('strong'),p=document.createElement('p');title.textContent=d[0];p.textContent=d[1];box.append(title,p);if(window.matchMedia('(max-width:600px)').matches&&typeof dialog.showModal==='function'){q('h3',dialog).textContent=d[0];q('.dialog-description',dialog).textContent=d[1];dialog.showModal()}}u.setAttribute('aria-pressed','false');u.addEventListener('click',activate);u.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();activate()}})});
 });
 qa('[data-option]').forEach(b=>b.addEventListener('click',()=>{const isA=b.dataset.option==='a';qa('[data-option]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));q('#water-option-label').textContent=isA?'OPTION A / CONVENTIONAL SWRO':'OPTION B / FULLY EXPANDED MODULAR SWRO';q('#process-intensity').textContent=isA?'3.20':'3.05';q('#process-tariff').textContent=isA?'7.30':'7.67';q('#option-note').textContent=isA?'Full capacity from the start; lower modeled full-cost tariff than fully expanded B.':'Lower electricity intensity; the full-year expanded configuration still had a higher modeled full-cost tariff.'}));
 qa('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{let ok=false;try{await navigator.clipboard.writeText(b.dataset.copy);ok=true}catch{const t=document.createElement('textarea');t.value=b.dataset.copy;t.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(t);t.select();try{ok=document.execCommand('copy')}catch{}t.remove();b.focus()}
 const status=q('#copy-status');status.textContent=ok?'Copied '+b.dataset.copy:'Copy unavailable. Select the visible contact text to copy it.';b.textContent=ok?'Copied':'Select text';setTimeout(()=>b.textContent='Copy',2500)}));
document.documentElement.classList.add('experience-ready');
})();


/* Keep the selected chess note comfortably readable across the card. */
{
  const keys = document.querySelector('.piece-keys');
  const pieces = Array.from(keys.querySelectorAll('details'));
  const note = document.createElement('p');
  note.className = 'piece-reading';
  note.hidden = true;
  note.setAttribute('aria-hidden','true');
  keys.after(note);
  keys.classList.add('shared-reading');
  pieces.forEach(piece => piece.addEventListener('toggle', () => {
    if (piece.open) pieces.filter(other => other !== piece).forEach(other => other.open = false);
    const selected = pieces.find(other => other.open);
    note.hidden = !selected;
    note.textContent = selected ? selected.querySelector('p').textContent : '';
  }));
}
