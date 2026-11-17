'use strict';
(()=>{
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],cfg=window.PORTFOLIO_SETTINGS,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const videos=qa('video[data-motion]');
 function play(v){const enabled=v.dataset.motion==='hero'?cfg.heroAutoplay:cfg.projectAutoplay;if(enabled&&!reduced.matches&&!document.hidden&&v.dataset.visible==='true'){v.muted=true;v.play().catch(()=>{})}else v.pause()}
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.dataset.visible=String(e.isIntersecting);play(e.target)}),{rootMargin:'80px'});videos.forEach(v=>observer.observe(v));
 function motion(){document.documentElement.classList.toggle('motion-off',reduced.matches);document.documentElement.classList.toggle('process-motion-off',!cfg.processAnimation);videos.forEach(play)}
 reduced.addEventListener('change',motion);document.addEventListener('visibilitychange',motion);motion();
 function openProject(hash){const el=q(hash);if(!el)return;const d=el.querySelector('.project-expand');if(d)d.open=true}
 qa('a[data-open-project]').forEach(a=>a.addEventListener('click',()=>openProject(a.hash)));
 if(['#sharakah','#power-to-x'].includes(location.hash))openProject(location.hash);
 addEventListener('hashchange',()=>{if(['#sharakah','#power-to-x'].includes(location.hash))openProject(location.hash)});
 const number=(n,d=0)=>n.toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
 function energy(){const v=+q('#delivery').value,p=+q('#power-price').value,a=v*3.2/1000,b=v*3.05/1000;q('#delivery-value').textContent=number(v)+' m³/day';q('#power-price-value').textContent=p.toFixed(2)+' SAR/kWh';q('#energy-a').textContent=number(a,1)+' MWh/day';q('#energy-b').textContent=number(b,1)+' MWh/day';q('#bar-a').style.width=(a/800*100)+'%';q('#bar-b').style.width=(b/800*100)+'%';q('#energy-description').textContent=`At ${number(v)} m³/day, expanded B uses ${number(a-b,1)} MWh/day less electricity than A.`;q('#energy-cost').textContent=`Daily electricity cost: A SAR ${number(a*1000*p)} · B SAR ${number(b*1000*p)}. Electricity only; the full-cost tariff comparison includes other costs.`}
 ['delivery','power-price'].forEach(id=>q('#'+id).addEventListener('input',energy));energy();
 function molecules(){const h=+q('#hydrogen-feed').value,n=h*28.014/(3*2.016),a=h*2*17.031/(3*2.016);q('#hydrogen-value').textContent=number(h)+' kg/day';q('#hydrogen-out').textContent=number(h);q('#nitrogen-out').textContent=number(n);q('#ammonia-out').textContent=number(a);q('#molecule-summary').textContent=`N₂ + 3H₂ → 2NH₃ · ${number(h)} kg/day H₂ plus ${number(n)} kg/day N₂ gives ${number(a)} kg/day NH₃ at ideal complete conversion.`}
 q('#hydrogen-feed').addEventListener('input',molecules);molecules();
 // One decorative object follows native scroll; it never captures input.
 const obj=q('.scroll-object'),geo=q('#scroll-geometry'),equation=q('#scroll-equation');let queued=false;
 function paint(){queued=false;if(reduced.matches||!cfg.scrollEffects){obj.style.display='none';return}obj.style.display='';const y=scrollY,total=Math.max(1,document.documentElement.scrollHeight-innerHeight),ratio=y/total;obj.style.transform=`translateY(${Math.sin(ratio*Math.PI*2)*45}px) rotate(${ratio*100-15}deg)`;geo.style.transformOrigin='150px 145px';geo.style.transform=`scale(${.8+ratio*.35})`;let text='Σṁin − Σṁout = dM/dt',color='#a0bfd0';if(q('#sharakah').getBoundingClientRect().top<innerHeight*.6){text='T(p) = T₀ + e(p − p₀)';color='#92c8c0'}if(q('#power-to-x').getBoundingClientRect().top<innerHeight*.6){text='N₂ + 3H₂ → 2NH₃';color='#b8a6d0'}if(q('#experience').getBoundingClientRect().top<innerHeight*.6){text='Define → test → refine';color='#d1bb91'}equation.textContent=text;obj.style.color=color}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint)}},{passive:true});addEventListener('resize',paint);reduced.addEventListener('change',paint);paint();
})();
