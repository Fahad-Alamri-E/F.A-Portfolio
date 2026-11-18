'use strict';
(() => {
const q=s=>document.querySelector(s), all=s=>Array.from(document.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const hero=q('.match-hero'),board=q('#board');
const notation='e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#'.split(' ');
const moves='e2e4 e7e5 f2f4 e5f4 f1c4 d8h4 e1f1 b7b5 c4b5 g8f6 g1f3 h4h6 d2d3 f6h5 f3h4 h6g5 h4f5 c7c6 g2g4 h5f6 h1g1 c6b5 h2h4 g5g6 h4h5 g6g5 d1f3 f6g8 c1f4 g5f6 b1c3 f8c5 c3d5 f6b2 f4d6 c5g1 e4e5 b2a1 f1e2 b8a6 f5g7 e8d8 f3f6 g8f6 d6e7'.split(' ');
const files='abcdefgh',pieces=[],positions=[];
const symbols='♜♞♝♛♚♝♞♜';
for(let i=0;i<8;i++)for(const [rank,piece,white] of [[8,symbols[i],false],[7,'♟',false],[2,'♟',true],[1,symbols[i],true]]){
 const el=document.createElement('b');el.textContent=piece+'\uFE0E';el.className=white?'ivory':'onyx';board.append(el);pieces.push(el);positions.push(files[i]+rank);
}
const states=[positions.slice()];
for(const move of moves){const pos=states.at(-1).slice(),from=pos.indexOf(move.slice(0,2)),dest=move.slice(2),cap=pos.indexOf(dest);if(from<0)throw Error('Invalid game score');if(cap>=0)pos[cap]='';pos[from]=dest;states.push(pos)}
const laws=[['Mass diffusion · Fick','Jₐ = −Dₐᵦ ∇cₐ'],['Viscous momentum flux','Jₚ = −μ ∂u/∂y'],['Heat conduction · Fourier','q″ = −k ∇T']];
const story=['Opening · Challenge: convert variable electricity prices into a water tariff.','Development · Response: compare the conventional and modular SWRO cases.','Middlegame · Challenge: balance hydrogen production with synthesis demand.','Endgame · Response: trace the material balance from polished water to ammonia.'];
let ply=0,paused=reduced.matches,visible=true,timer,frame;
function render(n){ply=Math.max(0,Math.min(n,moves.length));states[ply].forEach((s,i)=>{const e=pieces[i];e.style.opacity=s?'1':'0';if(s)e.style.transform='translate('+files.indexOf(s[0])*100+'%,'+(8-Number(s[1]))*100+'%)'});const law=laws[Math.floor(ply/3)%3];q('#law').textContent=law[0];q('#formula').textContent=law[1];q('#notation').textContent=ply?Math.ceil(ply/2)+(ply%2?'. ':'… ')+notation[ply-1]:'Starting position';board.setAttribute('aria-label','Immortal Game, '+q('#notation').textContent);q('#challenge').textContent=story[Math.min(3,Math.floor(ply/12))]}
function clock(){clearInterval(timer);q('#toggle').textContent=paused?'Play':'Pause';if(!paused&&visible&&!document.hidden)timer=setInterval(()=>render((ply+1)%states.length),2200)}
q('#toggle').onclick=()=>{paused=!paused;clock()};for(const [id,d] of [['prev',-1],['next',1]])q('#'+id).onclick=()=>{paused=true;clock();render(ply+d)};
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;clock()}).observe(hero);
document.addEventListener('visibilitychange',clock);reduced.addEventListener('change',()=>{paused=reduced.matches;clock()});
let lastStep=0;
addEventListener('scroll',()=>{if(frame||!visible||reduced.matches)return;frame=requestAnimationFrame(()=>{frame=0;const y=Math.max(0,-hero.getBoundingClientRect().top);hero.style.setProperty('--drift',Math.min(85,y*.15)+'px');const step=Math.floor(y/38);if(!paused&&step!==lastStep)render(ply+step-lastStep);lastStep=step})},{passive:true});render(0);clock();
const menus=all('nav details');
document.addEventListener('click',ev=>{menus.forEach(m=>{if(!m.contains(ev.target)||ev.target.closest('a'))m.open=false});const link=ev.target.closest('a[href="#wetico"],a[href="#action"]');if(link)q(link.hash).open=true});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape')menus.forEach(m=>{if(m.open){m.open=false;m.querySelector('summary').focus()}})});
const tools=[
 ['X','Excel','#16774f','sharakah','Al-Sahil PPP','Electricity-price sensitivity, weighted costs and tariff modeling.'],
 ['BI','Power BI','#a3770e','sharakah','SHARAKAH','Turning reporting data into dashboards and communicating comparisons.'],
 ['HYS','Aspen HYSYS','#724c91','power-to-x','Power-to-X','Process simulation, compressor duty and reactor heat balances.'],
 ['A+','Aspen Plus','#385f96','power-to-x','Graduation project','Modeling process streams and checking mass and energy balances.'],
 ['V','Visio','#485aa1','wetico','WETICO co-op','Drawing treatment process and instrumentation diagrams.'],
 ['P','PowerPoint','#9b4937','sharakah','Hackathon presentation','Explaining the technical and commercial case to an evaluation panel.']
];
const panel=document.createElement('dialog');panel.className='tool-dialog';document.body.append(panel);
let origin,originY,target,opened=[];
function restore(){if(target)target.classList.remove("tool-target");opened.forEach(e=>e.open=false);opened=[];origin.focus({preventScroll:true});window.scrollTo({top:originY,behavior:'instant'})}
panel.onclose=restore;panel.onclick=e=>{if(e.target===panel)panel.close()};
for(const [mark,name,c,id,label,skill] of tools){const btn=document.createElement('button');btn.style.setProperty('--brand',c);btn.innerHTML='<b>'+mark+'</b><span>'+name+' ↗</span>';q('.toolgrid').append(btn);btn.onclick=()=>{origin=btn;originY=scrollY;const dest=q('#'+id);const disclosure=dest.matches('details')?dest:dest.querySelector('details.project-expand');if(disclosure&&!disclosure.open){opened.push(disclosure);disclosure.open=true}target=dest;target.classList.add('tool-target');dest.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});panel.innerHTML='<article><button aria-label="Close and return">×</button><small>'+name+' → '+label+'</small><h3>'+name+'</h3><p>'+skill+'</p></article>';panel.querySelector('button').onclick=()=>panel.close();panel.showModal()}}
// AlSahil_3.0, Energy Mix tab. Gas is the balancing source.
const mix=q('#mix-ui'),sources=['Solar PV','Combined-cycle gas','Nuclear'],rates=[.10,(.22-.33*.10)/.67,.24375],factors=[43,486,13];
mix.innerHTML='<form><table><thead><tr><th>Supply</th><th>Share (%)</th><th>SAR/kWh</th></tr></thead><tbody>'+sources.map((s,i)=>'<tr><th>'+s+'</th><td><input aria-label="'+s+' share" type="number" min="0" max="100" step="any" value="'+[33,32,35][i]+'" '+(i===1?'readonly':'')+'></td><td><input aria-label="'+s+' price" min="0" step="any" type="number" value="'+rates[i]+'"></td></tr>').join('')+'</tbody></table><button type="reset">Workbook mix ↺</button></form><div class="mix-result" aria-live="polite"></div><details><summary>Source and calculation</summary><p>AlSahil_3.0 · Energy Mix. Gas fills the remaining share. Multiply the blended price change from 0.22 SAR/kWh by 3.20 (A) or 3.05 (expanded B) kWh/m³ and add the baseline full-cost tariff. Electricity life-cycle factors are 43, 486 and 13 g CO₂e/kWh for PV, gas and nuclear. These exclude other plant emissions.</p></details>';
const inputs=[...mix.querySelectorAll('input')],result=mix.querySelector('.mix-result');
function calculate(){const [solar,sp,,gp,nuclear,np]=inputs.map(i=>i.valueAsNumber),gas=100-solar-nuclear;inputs[2].value=gas>=0?+gas.toFixed(6):'';if(!mix.querySelector('form').checkValidity()||![solar,sp,gp,nuclear,np].every(Number.isFinite)||gas<0){result.textContent='Enter nonnegative prices and shares totaling at most 100% before gas.';return}const shares=[solar,gas,nuclear],blend=shares.reduce((a,v,i)=>a+v*[sp,gp,np][i]/100,0),ef=shares.reduce((a,v,i)=>a+v*factors[i]/100000,0);result.innerHTML='<p>Blended electricity <strong>'+blend.toFixed(4)+' SAR/kWh</strong></p><table><tr><th>Configuration</th><th>SAR/m³</th><th>kg CO₂e/m³</th></tr>'+[3.2,3.05].map((e,i)=>'<tr><th>'+['A','B · expanded'][i]+'</th><td>'+([7.107287671232877,7.490742143432716][i]+e*(blend-.22)).toFixed(4)+'</td><td>'+(ef*e).toFixed(4)+'</td></tr>').join('')+'</table>'
 // Sensitivity across the feasible nuclear range, holding solar constant.
 const width=560,left=66,right=525,top=42,bottom=181;
 const max=100-solar;
 const priceAt=n=>(solar*sp+(max-n)*gp+n*np)/100;
 const lines=[3.2,3.05].map((e,i)=>[0,max].map(n=>[7.107287671232877,7.490742143432716][i]+e*(priceAt(n)-.22)));
 const low=Math.floor(Math.min(...lines.flat())*10)/10,high=Math.max(low+.1,Math.ceil(Math.max(...lines.flat())*10)/10);
 const Y=t=>bottom-(t-low)/(high-low)*(bottom-top),X=n=>left+(right-left)*n/(max||1);
 let svg='<svg viewBox="0 0 '+width+' 235" role="img" aria-label="Full-cost water tariff against nuclear electricity share, with solar fixed"><text x="16" y="21">Full-cost tariff (SAR/m³)</text>';
 for(let i=0;i<4;i++){const value=low+(high-low)*i/3,y=Y(value);svg+='<path d="M66 '+y+'H525" stroke="#d1dbd9"/><text x="60" y="'+(y+4)+'" text-anchor="end">'+value.toFixed(2)+'</text>'}
 lines.forEach(([v,w],i)=>{const color=i?'#9e5029':'#12635e';svg+='<path d="M66 '+Y(v)+'L'+X(max)+' '+Y(w)+'" fill="none" stroke="'+color+'" stroke-width="3" '+(i?'stroke-dasharray="8 4"':'')+'/>';const t=v+(w-v)*nuclear/(max||1);svg+='<circle cx="'+X(nuclear)+'" cy="'+Y(t)+'" r="4" fill="'+color+'"/>'});
 svg+='<text x="66" y="203">0%</text>'+(max?'<text x="525" y="203" text-anchor="end">'+Number(max.toFixed(2))+'%</text>':'')+'<text x="286" y="224" text-anchor="middle">Nuclear share of total electricity</text></svg>';
 result.insertAdjacentHTML('beforeend','<figure><figcaption>Tariff sensitivity · A (solid), expanded B (dashed)</figcaption>'+svg+'</figure>');
}
mix.oninput=calculate;mix.querySelector('form').onreset=()=>setTimeout(calculate,0);mix.querySelector('form').onsubmit=e=>e.preventDefault();calculate();
})();
