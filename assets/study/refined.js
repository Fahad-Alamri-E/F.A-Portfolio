'use strict';
(() => {
const q=s=>document.querySelector(s), all=s=>Array.from(document.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sprite = new URL('navigation.svg', document.currentScript.src).href;
function icon(name) {
 return '<svg class="ui-icon icon-'+name+'" aria-hidden="true" focusable="false"><use href="'+sprite+'#'+name+'"></use></svg>';
}
const hero=q('.match-hero'),board=q('#board');
const notation='e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#'.split(' ');
const moves='e2e4 e7e5 f2f4 e5f4 f1c4 d8h4 e1f1 b7b5 c4b5 g8f6 g1f3 h4h6 d2d3 f6h5 f3h4 h6g5 h4f5 c7c6 g2g4 h5f6 h1g1 c6b5 h2h4 g5g6 h4h5 g6g5 d1f3 f6g8 c1f4 g5f6 b1c3 f8c5 c3d5 f6b2 f4d6 c5g1 e4e5 b2a1 f1e2 b8a6 f5g7 e8d8 f3f6 g8f6 d6e7'.split(' ');
const files='abcdefgh',pieces=[],positions=[];
const symbols='♜♞♝♛♚♝♞♜';
for(let i=0;i<8;i++)for(const [rank,piece,white] of [[8,symbols[i],false],[7,'♟',false],[2,'♟',true],[1,symbols[i],true]]){
 const el=document.createElement('b');if(piece==='♟'){
  el.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="currentColor" stroke="var(--rim)" stroke-width=".8"><circle cx="16" cy="8" r="4"/><path d="M12 13h8v2h-2c0 4 1 6 4 9H10c3-3 4-5 4-9h-2zM9 25h14l1 3H8z"/></g></svg>';
 }else{el.textContent=piece+'\uFE0E'}el.className=white?'ivory':'onyx';board.append(el);pieces.push(el);positions.push(files[i]+rank);
}
const states=[positions.slice()];
for(const move of moves){const pos=states.at(-1).slice(),from=pos.indexOf(move.slice(0,2)),dest=move.slice(2),cap=pos.indexOf(dest);if(from<0)throw Error('Invalid game score');if(cap>=0)pos[cap]='';pos[from]=dest;states.push(pos)}
const scene=document.createElement('div');
scene.className='game-scene';scene.setAttribute('aria-hidden','true');
const caption=document.createElement('div');
caption.className='reading-caption';
scene.append(caption);document.body.prepend(scene);
let ply=0,paused=reduced.matches,visible=true,timer,frame;
function render(n){ply=Math.max(0,Math.min(n,moves.length));states[ply].forEach((s,i)=>{const e=pieces[i];e.style.opacity=s?'1':'0';if(s)e.style.transform='translate('+files.indexOf(s[0])*100+'%,'+(8-Number(s[1]))*100+'%)'});q('#notation').textContent=ply?Math.ceil(ply/2)+(ply%2?'. ':'… ')+notation[ply-1]:'Starting position';board.setAttribute('aria-label','Immortal Game, '+q('#notation').textContent)}
function clock(){clearInterval(timer);q('#toggle').textContent=paused?'Play':'Pause';if(!paused&&visible&&!document.hidden&&scrollY<2)timer=setInterval(()=>render((ply+1)%states.length),2200)}
q('#toggle').onclick=()=>{paused=!paused;if(departure!==null)departure=ply;clock();queue()};for(const [id,d] of [['prev',-1],['next',1]])q('#'+id).onclick=()=>{paused=true;clock();render(ply+d);if(departure!==null)departure=ply;previous=-1;queue()};
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;clock()}).observe(hero);
document.addEventListener('visibilitychange',clock);reduced.addEventListener('change',()=>{paused=reduced.matches;clock()});
// The background copy is decorative and never receives pointer or keyboard input.
const echo=board.cloneNode(true);
echo.removeAttribute('id');echo.removeAttribute('role');echo.removeAttribute('aria-label');
echo.className='chess-echo';echo.setAttribute('aria-hidden','true');
scene.prepend(echo);
const echoPieces=Array.from(echo.children);
const header=q('header'), spacer=document.createElement('div');
header.before(spacer);
let baseHeight, departure=null, previous=-1;
function reserveHeader(){
 const was=header.classList.contains('compact');
 header.classList.remove('compact');
 baseHeight=header.offsetHeight;
 spacer.style.height=baseHeight+'px';
 header.classList.toggle('compact',was);
}
const mobile=matchMedia('(max-width: 800px)');
const trigger=q('.mobile-menu'), nav=q('#portfolio-nav');
const menus=all('#portfolio-nav details');
function showMenu(open) {
 header.classList.toggle('menu-open',open);
 trigger.setAttribute('aria-expanded',String(open));
 trigger.setAttribute('aria-label',open?'Close menu':'Open menu');
 if(!open) menus.forEach(item=>item.open=false);
}
trigger.addEventListener('click',()=>showMenu(!header.classList.contains('menu-open')));
document.addEventListener('click',event=>{
 if(header.classList.contains('menu-open') && (!header.contains(event.target)||event.target.closest('nav a'))) showMenu(false);
 menus.forEach(item=>{if(!item.contains(event.target)||event.target.closest('a'))item.open=false});
 const link=event.target.closest('a[href="#wetico"],a[href="#action"]');
 if(link)q(link.hash).open=true;
});
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 if(header.classList.contains('menu-open')) {showMenu(false);trigger.focus({preventScroll:true});return}
 const item=menus.find(m=>m.open);
 if(item){item.open=false;item.querySelector('summary').focus({preventScroll:true})}
});
mobile.addEventListener('change',()=>showMenu(false));
const narrow=matchMedia('(max-width: 1099px)');
const main=q('main');
// Cache document positions. Opening a case or resizing invalidates them.
const readingSections=[
 ['.match-hero','Explore my work in water and energy.'],
 ['#toolkit','See where I used each tool.'],
 ['#training','Explore my training and reporting examples.'],
 ['.executive','My experience and project results at a glance.'],
 ['#work','Explore the two projects I worked on.'],
 ['#sharakah','We compared two ways to desalinate seawater.'],
 ['#water-process','Follow seawater from intake to city supply.'],
 ['#mix','Change the power mix and compare costs.'],
 ['#sharakah .lab','See how electricity prices affect water prices.'],
 ['#sharakah .physical-lab','See how much power water delivery takes.'],
 ['#power-to-x','We designed hydrogen production using renewable electricity.'],
 ['#ptx-process','Follow the steps from water to ammonia.'],
 ['#power-to-x .lab','See when the project earns back investment.'],
 ['#power-to-x .physical-lab','See how much ammonia hydrogen can produce.'],
 ['#experience','Explore my field and design experience.'],
 ['#action','I helped keep construction sites dry.'],
 ['#wetico','I drew water treatment diagrams at WETICO.'],
 ['#education','My chemical engineering studies in Riyadh.'],
 ['.closing','Get in touch about working together.'],
 ['#contact','Choose how to reach me.']
].map(([selector,message])=>({element:q(selector),message}));
let ranges;
function invalidateSections(){ranges=null;queue()}
function describeSection(y,vh){
 if(!ranges){
  ranges=readingSections.flatMap(({element,message})=>{
   if(!element||element.parentElement.closest('details:not([open])'))return [];
   const bounds=element.getBoundingClientRect();
   return bounds.height?[{top:bounds.top+y,bottom:bounds.bottom+y,message}]:[];
  });
 }
 const focus=y+vh*.37;
 let active=null, preceding=ranges[0];
 for(const range of ranges){
  if(range.top>focus)continue;
  if(range.top>=preceding.top)preceding=range;
  if(focus<range.bottom)active=range;
 }
 active=active||preceding;
 if(focus>ranges[ranges.length-1].bottom || y+vh>=document.documentElement.scrollHeight-2)active=ranges[ranges.length-1];
 if(active&&caption.textContent!==active.message)caption.textContent=active.message;
}
const moveMark=document.createElement('i');
moveMark.className='arrival-square';echo.append(moveMark);
function scrollScene(){
 frame=0;
 const y=Math.max(0,scrollY);
 const compact=y>28;
 if(header.classList.contains('compact')!==compact){
  const fromNav=nav.contains(document.activeElement);
  const fromButton=document.activeElement===trigger;
  showMenu(false);
  header.classList.toggle('compact',compact);
  if(mobile.matches && compact && fromNav)trigger.focus({preventScroll:true});
  if(mobile.matches && !compact && fromButton)nav.querySelector('summary').focus({preventScroll:true});
 }
 if(y<2){
   if(departure!==null){render(departure);departure=null;clock()}
   previous=-1;scene.style.visibility='hidden';board.style.opacity='1';
   hero.style.removeProperty('--scene-progress');hero.style.removeProperty('--drift');
   return;
 }
 if(departure===null){departure=ply;clearInterval(timer)}
 const bounds=board.getBoundingClientRect();
 const fraction=Math.min(1,y/Math.max(220,hero.offsetHeight*.72));
 const ease=reduced.matches?Number(fraction===1):fraction*fraction*(3-2*fraction);
 const vw=document.documentElement.clientWidth, vh=innerHeight, small=narrow.matches;
 // The desktop reading column leaves room for the full board and its profile.
 // On phones a window beneath the navigation reveals the upper part of the board.
 const rail=Math.min(520,vw*.30);
 const size=mobile.matches?Math.min(90,vw*.23):small?Math.min(vw*.45,vh*.4,245):Math.min(rail-22,vh*.59);
 const x=mobile.matches?12:small?-size*.10:vw-rail+(rail-size)/2;
 const yEnd=mobile.matches?5:small?Math.max(68,vh*.085):Math.max(80,(vh-size-95)/2);
 const width=bounds.width+(size-bounds.width)*ease;
 const left=bounds.left+(x-bounds.left)*ease,top=bounds.top+(yEnd-bounds.top)*ease;
 const total=Math.max(hero.offsetHeight,document.documentElement.scrollHeight-vh);
 const n=paused||reduced.matches?departure:Math.min(moves.length,departure+Math.round(y/total*(moves.length-departure)));
 if(n!==previous){
   render(n);
   echoPieces.forEach((piece,i)=>{piece.style.cssText=pieces[i].style.cssText});
   moveMark.hidden=!n;
   if(n){const square=moves[n-1].slice(2);moveMark.style.transform='translate('+files.indexOf(square[0])*100+'%,'+(8-Number(square[1]))*100+'%)'}
   previous=n;
 }
 hero.style.setProperty('--drift',reduced.matches?'0px':Math.min(85,y*.15)+'px');
 hero.style.setProperty('--scene-progress',ease);
 scene.style.visibility='visible';scene.style.opacity=ease;
 board.style.opacity=String(1-ease);
 echo.style.width=bounds.width+'px';
 echo.style.transform='translate3d('+left+'px,'+top+'px,0) scale('+width/bounds.width+')';
 const focus=n?moves[n-1].slice(2):'e4';
 const file=files.indexOf(focus[0])+.5, rank=8.5-Number(focus[1]);
 const cameraX=Math.min(6,Math.max(vw*.33-size,vw*.19-file*size/8));
 const cameraY=72-rank*size/8;
 echo.style.translate=mobile.matches?'0px calc(env(safe-area-inset-top, 0px) * '+ease+')':small?(cameraX-x)*ease+'px '+(cameraY-yEnd)*ease+'px':'none';
 describeSection(y,vh);
 caption.style.left=(mobile.matches?x+size+8:small?vw*.41:vw-rail+12)+'px';
 caption.style.width=mobile.matches?'calc(100% - '+(x+size+8+76)+'px - env(safe-area-inset-right, 0px))':(small?vw*.56:rail-24)+'px';
 caption.style.top=mobile.matches?'calc(env(safe-area-inset-top, 0px) + 9px)':(small?55:yEnd-54)+'px';
 caption.style.opacity=ease;
}
function queue(){if(!frame)frame=requestAnimationFrame(scrollScene)}
addEventListener('scroll',queue,{passive:true});
let layoutWidth=document.documentElement.clientWidth;
addEventListener('resize',()=>{
 const width=document.documentElement.clientWidth;
 if(width!==layoutWidth){layoutWidth=width;reserveHeader()}
 invalidateSections();
});
window.visualViewport?.addEventListener('resize',queue,{passive:true});
new ResizeObserver(()=>{
 if(!header.classList.contains('compact') && spacer.offsetHeight!==header.offsetHeight)
  spacer.style.height=header.offsetHeight+'px';
}).observe(header);
new ResizeObserver(invalidateSections).observe(main);
document.addEventListener('toggle',invalidateSections,true);
reserveHeader();render(0);clock();queue();
const tools=[
 ['X','Excel','#16774f','sharakah','Al-Sahil PPP','Electricity-price sensitivity, weighted costs and tariff modeling.'],
 ['BI','Power BI','#a3770e','sharakah','SHARAKAH','Turning reporting data into dashboards and communicating comparisons.'],
 ['HYS','Aspen HYSYS','#724c91','power-to-x','Power-to-X','Process simulation, compressor duty and reactor heat balances.'],
 ['A+','Aspen Plus','#385f96','power-to-x','Graduation project','Modeling process streams and checking mass and energy balances.'],
 ['V','Visio','#485aa1','wetico','WETICO co-op','At WETICO I drew water-treatment P&IDs. For Power-to-X I mapped the process from seawater treatment to hydrogen and ammonia synthesis.'],
 ['P','PowerPoint','#9b4937','sharakah','Hackathon presentation','Explaining the technical and commercial case to an evaluation panel.'],
 ['PQ','Power Query','#457b62','training','Reporting & dashboards','Preparing tabular data for Excel and Power BI reports.'],
 ['DAX','DAX','#806428','training','Business intelligence','Defining measures to summarize report data in Power BI.'],
 ['VB','Excel VBA','#237358','training','Transactions tracker','Timestamp entry and row-management controls support monthly open, overdue and closed transaction counts.'],
 ['PM','Polymath','#755384','education','Chemical engineering','Solving engineering balance equations and inspecting numerical results.'],
 ['W','Word','#366a9d','wetico','Engineering reports','Documenting treatment processes and preparing internship progress reports.'],
 ['Z','Zoom','#4165a4','training','Five training sessions','Excel, Power BI, data analysis, reporting and dashboard exercises.'],
 ['Git','GitHub','#435368','toolkit','Portfolio publishing','Versioned the portfolio and deployed revisions through GitHub Pages.'],
 ['AI','OpenAI','#426e69','training','AI-assisted analysis','Used AI assistance for a 5 × 5 workplace risk dashboard, scenario analysis in Excel Data and Decision Studio, and conceptual plant illustrations.']
];
const panel=document.createElement('dialog');panel.className='tool-dialog';document.body.append(panel);
let origin,originY,target,opened=[];
function restore(){origin.setAttribute("aria-expanded","false");if(target)target.classList.remove("tool-target");opened.forEach(e=>e.open=false);opened=[];origin.focus({preventScroll:true});window.scrollTo({top:originY,behavior:'instant'})}
panel.onclose=restore;panel.onclick=e=>{if(e.target===panel)panel.close()};
for(const [mark,name,c,id,label,skill] of tools){const btn=document.createElement('button');btn.style.setProperty('--brand',c);btn.setAttribute('aria-haspopup','dialog');btn.setAttribute('aria-expanded','false');btn.innerHTML='<b>' +mark+'</b><span>'+name+' '+icon('chevron')+'</span>';q('.toolgrid').append(btn);btn.onclick=()=>{origin=btn;btn.setAttribute("aria-expanded","true");originY=scrollY;const dest=q('#'+id);const disclosure=dest.matches('details')?dest:dest.querySelector('details.project-expand');if(disclosure&&!disclosure.open){opened.push(disclosure);disclosure.open=true}target=dest;target.classList.add('tool-target');dest.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});panel.innerHTML='<article><button aria-label="Close and return">×</button><small>'+name+' '+icon('right')+' '+label+'</small><h3>'+name+'</h3><p>'+skill+'</p></article>';if(name==='Visio'){
 const switcher=document.createElement('button');switcher.className='also-used';switcher.innerHTML='View Power-to-X application '+icon('right');panel.querySelector('article').append(switcher);
 switcher.onclick=()=>{const project=q('#power-to-x');const detail=project.querySelector('.project-expand');if(!detail.open){opened.push(detail);detail.open=true}target.classList.remove('tool-target');target=project;target.classList.add('tool-target');project.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});panel.querySelector('small').innerHTML='Visio '+icon('right')+' Power-to-X';switcher.remove()};
 }
 panel.querySelector('button').onclick=()=>panel.close();panel.showModal()}}
// AlSahil_3.0, Energy Mix tab. Gas is the balancing source.
const mix=q('#mix-ui'),sources=['Solar PV','Combined-cycle gas','Nuclear'],rates=[.10,(.22-.33*.10)/.67,.24375],factors=[43,486,13];
mix.innerHTML='<form><table><thead><tr><th>Supply</th><th>Share (%)</th><th>SAR/kWh</th></tr></thead><tbody>'+sources.map((s,i)=>'<tr><th>'+s+'</th><td><input aria-label="'+s+' share" type="range" min="0" max="100" step="1" value="'+[33,32,35][i]+'"><output>'+[33,32,35][i]+'%</output></td><td><input aria-label="'+s+' price" min="0" step="any" type="number" value="'+rates[i]+'"></td></tr>').join('')+'</tbody></table><button type="reset">Workbook mix '+icon('reset')+'</button></form><div class="mix-result" aria-live="polite"></div><details><summary>'+icon('chevron')+'Source and calculation</summary><p>AlSahil_3.0 · Energy Mix. Changing one share redistributes the remainder in proportion to the other two. When both are zero the remainder is split equally. Multiply the blended price change from 0.22 SAR/kWh by 3.20 (A) or 3.05 (expanded B) kWh/m³ and add the baseline full-cost tariff. Electricity life-cycle factors are 43, 486 and 13 g CO₂e/kWh for PV, gas and nuclear. These exclude other plant emissions.</p></details>';
const inputs=[...mix.querySelectorAll('input')],result=mix.querySelector('.mix-result');
const sliders=Array.from(mix.querySelectorAll('[type="range"]'));
function rebalance(changed){
 const others=sliders.filter(s=>s!==changed),left=100-changed.valueAsNumber;
 const prior=others[0].valueAsNumber+others[1].valueAsNumber;
 const first=Math.round(left*(prior?others[0].valueAsNumber/prior:.5));
 others[0].value=first;others[1].value=left-first;
}
function calculate(){
 const [solar,sp,gas,gp,nuclear,np]=inputs.map(i=>i.valueAsNumber);
 sliders.forEach(slider=>slider.nextElementSibling.textContent=slider.value+'%');
 if(!mix.querySelector('form').checkValidity()||![sp,gp,np].every(Number.isFinite)){result.textContent='Enter a valid nonnegative electricity price for each source.';return}
 const shares=[solar,gas,nuclear],blend=shares.reduce((a,v,i)=>a+v*[sp,gp,np][i]/100,0),ef=shares.reduce((a,v,i)=>a+v*factors[i]/100000,0);result.innerHTML='<p>100% allocated · Blended electricity <strong>'+blend.toFixed(4)+' SAR/kWh</strong></p><table><tr><th>Configuration</th><th>SAR/m³</th><th>kg CO₂e/m³</th></tr>'+[3.2,3.05].map((e,i)=>'<tr><th>'+['A','B · expanded'][i]+'</th><td>'+([7.107287671232877,7.490742143432716][i]+e*(blend-.22)).toFixed(4)+'</td><td>'+(ef*e).toFixed(4)+'</td></tr>').join('')+'</table>'
 // Sensitivity across the feasible nuclear range, holding solar constant.
 const width=560,left=66,right=525,top=42,bottom=181;
 const max=100-solar;
 const priceAt=n=>(solar*sp+(max-n)*gp+n*np)/100;
 const lines=[3.2,3.05].map((e,i)=>[0,max].map(n=>[7.107287671232877,7.490742143432716][i]+e*(priceAt(n)-.22)));
 const low=Math.floor(Math.min(...lines.flat())*10)/10,high=Math.max(low+.1,Math.ceil(Math.max(...lines.flat())*10)/10);
 const Y=t=>bottom-(t-low)/(high-low)*(bottom-top),X=n=>left+(right-left)*n/(max||1);
 let svg='<svg viewBox="0 0 '+width+' 235" role="img" aria-label="Full-cost water tariff against nuclear electricity share, with solar fixed"><text x="16" y="21">Full-cost tariff (SAR/m³)</text>';
 for(let i=0;i<4;i++){const value=low+(high-low)*i/3,y=Y(value);svg+='<path d="M66 '+y+'H525" stroke="#3d5361"/><text x="60" y="'+(y+4)+'" text-anchor="end">'+value.toFixed(2)+'</text>'}
 lines.forEach(([v,w],i)=>{const color=i?'#efb774':'#81ddc7';svg+='<path d="M66 '+Y(v)+'L'+X(max)+' '+Y(w)+'" fill="none" stroke="'+color+'" stroke-width="3" '+(i?'stroke-dasharray="8 4"':'')+'/>';const t=v+(w-v)*nuclear/(max||1);svg+='<circle cx="'+X(nuclear)+'" cy="'+Y(t)+'" r="4" fill="'+color+'"/>'});
 const ticks=max?Math.min(5,max):0;
 for(let i=0;i<=ticks;i++){
  const value=ticks?max*i/ticks:0,x=X(value);
  svg+='<path d="M'+x+' 182v5" stroke="#8fa4ae"/><text x="'+x+'" y="203" text-anchor="middle">'+Number(value.toFixed(1))+'%</text>';
 }
 svg+='<text x="286" y="224" text-anchor="middle">Nuclear share of total electricity</text></svg>';
 result.insertAdjacentHTML('beforeend','<figure><figcaption>Tariff sensitivity · A (solid), expanded B (dashed)</figcaption>'+svg+'</figure>');
}
mix.oninput=e=>{if(sliders.includes(e.target))rebalance(e.target);calculate()};mix.querySelector('form').onreset=()=>setTimeout(calculate,0);mix.querySelector('form').onsubmit=e=>e.preventDefault();calculate();
})();
