'use strict';
(() => {
 const $=id=>document.getElementById(id);
 const baseline=[-3,-182,-376,-294.845,-213.69,-132.535,-51.38,29.775,110.93,192.085,273.24,354.395,435.55,516.705,597.86,679.015,760.17,841.325,922.48,1003.635,1120.59];
 const format=(n,d=2)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
 const text=(x,y,s,extra='')=>`<text x="${x}" y="${y}" fill="#b9c9d9" font-family="Arial,sans-serif" font-size="17" ${extra}>${s}</text>`;
 const line=(x1,y1,x2,y2,color='#2c3d4f',extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${extra}/>`;
 const path=(points,color,dash='')=>`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="3.5" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
 function water(){
  const p=+$('electricity').value,d=+$('deadband').value/100,view=$('tariff-view').value;
  $('electricity-value').value=p.toFixed(3)+' SAR/kWh';$('deadband-value').value=Math.round(d*100)+'%';
  const bases=[7.107287671232877,7.490742143432716],intensities=[3.2,3.05];
  const calc=(j,price,payment=false)=>bases[j]+intensities[j]*(payment?Math.sign(price-.22)*Math.max(Math.abs(price-.22)-.22*d,0):price-.22);
  const a=calc(0,p),b=calc(1,p),pa=calc(0,p,true),pb=calc(1,p,true),pay=view==='payment';
  $('water-a').textContent=format(a);$('water-b').textContent=format(b);$('water-gap').textContent=format(b-a);
  const X=v=>65+(v-.1)/.5*490,Y=v=>280-(v-6.5)/2.5*235;
  let svg=text(65,23,'Water tariff · SAR/m³');
  [6.5,7,7.5,8,8.5,9].forEach(t=>{svg+=line(65,Y(t),555,Y(t))+text(53,Y(t)+6,t.toFixed(1),'text-anchor="end"')});
  [.1,.2,.3,.4,.5,.6].forEach(t=>{svg+=text(X(t),307,t.toFixed(2),'text-anchor="middle"')});
  svg+=text(310,336,'Electricity · SAR/kWh','text-anchor="middle"');
  [0,1].forEach(j=>{const color=j?'#ffcb77':'#69edce';const pts=Array.from({length:101},(_,k)=>{const v=.1+k*.005;return[X(v),Y(calc(j,v,pay))]});svg+=path(pts,color);const cx=X(p),cy=Y(calc(j,p,pay));svg+=j?`<rect x="${cx-5}" y="${cy-5}" width="10" height="10" transform="rotate(45 ${cx} ${cy})" fill="${color}"/>`:`<circle cx="${cx}" cy="${cy}" r="6" fill="${color}"/>`;});
  svg+=line(X(p),45,X(p),280,'#c3d4e5','stroke-dasharray="4 5" opacity=".45"');$('water-chart').innerHTML=svg;
  $('water-summary').textContent=`At SAR ${p.toFixed(3)}/kWh, ${pay?'indexed-payment':'full-cost'} tariffs are A ${format(pay?pa:a)} and expanded B ${format(pay?pb:b)} SAR/m³.`;
  $('payment-summary').textContent=`Indexed-payment tariffs: A ${format(pa)}, B ${format(pb)} SAR/m³. Full cost minus indexed payment: A ${format(a-pa,3)}, B ${format(b-pb,3)} SAR/m³ (positive = project-company shortfall). The deadband changes payment allocation, not electricity cost.`;
 }
 function cash(){
  const inv=+$('investment').value/100,op=+$('operating').value/100,year=+$('year').value;
  $('investment-value').value=Math.round(inv*100)+'% of baseline';$('operating-value').value=Math.round(op*100)+'% of baseline';$('year-value').value=year;
  let cumulative=0;const scenario=baseline.map((_,i)=>{cumulative+=i===0?-3*inv:i===1?-179*inv:i===2?-194*inv:81.155*op+(i===20?35.8:0);return cumulative});
  const low=Math.floor(Math.min(...scenario,...baseline)/250)*250,high=Math.ceil(Math.max(...scenario,...baseline)/250)*250;
  const X=v=>75+v/20*480,Y=v=>280-(v-low)/(high-low)*235;
  let svg=text(75,22,'Cumulative cash flow · USD million');
  const step=(high-low)>2250?500:250;
  for(let t=Math.ceil(low/step)*step;t<=high;t+=step)svg+=line(75,Y(t),555,Y(t),t===0?'#a9bed0':'#2c3d4f')+text(64,Y(t)+5,format(t,0),'text-anchor="end"');
  [0,5,10,15,20].forEach(t=>{svg+=text(X(t),307,t,'text-anchor="middle"')});svg+=text(315,336,'Year','text-anchor="middle"');
  svg+=path(baseline.map((v,i)=>[X(i),Y(v)]),'#ffcb77')+path(scenario.map((v,i)=>[X(i),Y(v)]),'#69edce','7 5');
  svg+=line(X(year),45,X(year),280,'#aac1d6','stroke-dasharray="3 5" opacity=".6"')+`<circle cx="${X(year)}" cy="${Y(scenario[year])}" r="6" fill="#69edce"/>`;
  $('cash-chart').innerHTML=svg;
  const first=scenario.findIndex((v,i)=>i>2&&v>0),interval=first>=0?`${first-1}–${first}`:'Not reached';
  $('cash-end').textContent=format(scenario[20]);$('cash-cross').textContent=interval;$('cash-cross-unit').textContent=first>=0?'years · scenario':'within 20 years';$('cash-selected').textContent=format(scenario[year]);$('selected-year').textContent=`SCENARIO · YEAR ${year}`;
  $('cash-summary').textContent=`Report baseline: US$1,120.59 million at year 20; positive between years 6 and 7. Your scenario: US$${format(scenario[20])} million at year 20; ${first>=0?'positive between years '+interval:'does not turn positive within 20 years'}. Selected year ${year}: US$${format(scenario[year])} million.`;
 }
 $('water-form').addEventListener('input',water);$('water-form').addEventListener('change',water);$('water-form').addEventListener('reset',()=>setTimeout(water,0));
 document.querySelector('[data-water="event"]').addEventListener('click',()=>{$('electricity').value=.28;$('deadband').value=5;$('tariff-view').value='cost';water()});
 $('cash-form').addEventListener('input',cash);$('cash-form').addEventListener('reset',()=>setTimeout(cash,0));$('cash-stress').addEventListener('click',()=>{$('investment').value=125;$('operating').value=80;cash()});
 water();cash();document.querySelectorAll('.interactive').forEach(el=>el.hidden=false);document.documentElement.classList.add('js-ready');
})();
