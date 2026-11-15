const NS="http://www.w3.org/2000/svg";
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const svg=document.getElementById("g"),stage=document.getElementById("stage"),note=document.getElementById("note");
const state={filter:"all",hideC:false,goal:null,sel:null,hover:null,q:"",show:"none",mine:false,help:false,panelOff:false};
const AL={D3:"vitamin d холекальциферол витамин д",K2:"mk-7 mk7 менахинон витамин к",A:"retinol ретинол бета-каротин",E:"tocopherol токоферол",C:"ascorbic аскорбиновая кислота",B1:"thiamine тиамин бенфотиамин",B6:"pyridoxine пиридоксин p5p",B9:"folate folic фолиевая метилфолат",B12:"cobalamin кобаламин метилкобаламин",Ca:"calcium",Mg:"magnesium глицинат цитрат",Zn:"zinc",Cu:"copper",Fe:"iron ферритин",Se:"selenium",I:"iodine",O3:"omega fish oil рыбий жир epa dha омега",Cur:"curcumin turmeric куркума",Pip:"piperine bioperine чёрный перец",Q10:"coq10 убихинон убихинол коэнзим",Cre:"creatine",Gly:"glycine",NAD:"nmn nr никотинамид рибозид",Api:"apigenin ромашка",NAC:"nac n-acetylcysteine ацетилцистеин глутатион",Tau:"taurine",LT:"l-theanine theanine теанин",Ash:"ashwagandha ksm-66",Cof:"coffee caffeine tea кофеин чай",Mel:"melatonin",Gar:"garlic aged kyolic чеснок",Beet:"beet beetroot nitrate нитраты свекла свёкла",Hib:"hibiscus каркаде",Rho:"rhodiola",Saf:"saffron affron",Bac:"bacopa",BA:"beta-alanine бета аланин",Bic:"bicarbonate сода",Prot:"protein whey протеин белок",Psy:"psyllium клетчатка",Pro:"probiotic пробиотик",GTE:"green tea egcg катехины зелёный чай",Coc:"cocoa cacao flavanols какао флаванолы",Res:"resveratrol ресвератрол"};
const norm=x=>x.toLowerCase().replace(/ё/g,"е");
N.forEach(n=>{n.hay=norm([n.name,n.s,n.id,AL[n.id]||""].join(" "));n.words=n.hay.split(/[\s()+,.\-]+/).filter(Boolean)});
function matches(){const q=norm(state.q.trim());if(!q){if(!state.mine)return null;const ms=mySet();return ms.size?new Set(ms.keys()):null}
  return new Set(N.filter(n=>n.words.some(w=>w.startsWith(q))||(q.length>=3&&n.hay.includes(q))).map(n=>n.id))}
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let W=800,H=640,S=1,R=17,alpha=1,raf=null;

function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);parent&&parent.appendChild(e);return e}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function pairName(e){return `${byId[e.a].name} + ${byId[e.b].name}`}
function gcol(n){return n.g.length?`var(${G[n.g[0]].c})`:"var(--muted)"}
function tags(goals){return `<div class="tags">${goals.map(k=>`<span class="tag" style="color:var(${G[k].c})">${G[k].n}</span>`).join("")}</div>`}

/* ---------- glossary: dotted terms with a tap/hover explanation ---------- */
const GL=[
 ["T4","Тироксин — главный гормон щитовидной железы. Сам по себе почти неактивен: организм превращает его в T3."],
 ["T3","Трийодтиронин — активный гормон щитовидной железы. Управляет скоростью обмена веществ, температурой тела и энергией."],
 ["ТТГ","Тиреотропный гормон гипофиза, он командует щитовидной железой. Высокий ТТГ — щитовидка работает слабо, низкий — слишком активно. Главный анализ щитовидной железы."],
 ["гомоцистеин","Аминокислота, которая копится при нехватке B9, B12 и B6. Высокий уровень связан с риском инсульта и болезней сосудов.",1],
 ["ферритин","Белок, в котором хранится железо. Анализ показывает запасы железа: ниже 30 нг/мл — дефицит, даже если гемоглобин ещё в норме.",1],
 ["25(OH)D","Анализ на витамин D: показывает, сколько его накоплено в организме."],
 ["ГАМК","Главный тормозящий медиатор мозга. Успокаивает нервную систему, на него действуют многие успокоительные и снотворные."],
 ["кортизол","Гормон стресса из надпочечников. Утром нужен для бодрости, но постоянно высокий кортизол ухудшает сон, давление и иммунитет.",1],
 ["глутатион","Главный антиоксидант внутри клеток. Организм делает его из глицина, цистеина и глутамата.",1],
 ["митохондри","Энергетические станции клетки: в них из еды и кислорода получается энергия.",1],
 ["CD38","Фермент, который расщепляет NAD+. С возрастом его становится больше, и уровень NAD+ падает."],
 ["NAD+","Молекула, без которой не работают митохондрии и ферменты, чинящие ДНК. С возрастом её становится меньше."],
 ["СРБ","С-реактивный белок — анализ на воспаление. Хронически повышенный СРБ связан с риском болезней сердца."],
 ["IL-6","Интерлейкин-6 — сигнальная молекула воспаления."],
 ["ЛПНП","«Плохой» холестерин. Чем его больше, тем быстрее растут бляшки в сосудах."],
 ["триглицерид","Жиры в крови. Высокий уровень повышает риск болезней сердца, растёт от сахара, алкоголя и лишнего веса.",1],
 ["VO2max","Сколько кислорода организм может использовать за минуту на кг веса. Главный показатель выносливости и сильный предиктор продолжительности жизни."],
 ["остеокальцин","Белок кости, который встраивает в неё кальций. Его активирует витамин K2.",1],
 ["MGP","Белок, который мешает кальцию оседать в стенках сосудов. Активируется витамином K2."],
 ["метаанализ","Исследование, которое объединяет результаты многих других исследований. Самый надёжный тип доказательств.",1],
 ["апноэ","Остановки дыхания во сне, обычно с громким храпом. Повышают давление и вызывают сонливость днём."],
 ["ХОБЛ","Хроническая обструктивная болезнь лёгких, чаще всего от курения."],
 ["EPA","Эйкозапентаеновая кислота — омега-3, которая сильнее всего гасит воспаление."],
 ["DHA","Докозагексаеновая кислота — омега-3, главный жир мозга и сетчатки глаза."],
 ["ретинол","Готовая форма витамина A из продуктов животного происхождения. В отличие от бета-каротина может накапливаться до токсичных доз.",1],
 ["кальциноз","Отложение кальция в стенках сосудов, делает их жёсткими.",1],
 ["метильн","Метильные группы нужны для метилирования — реакций, которыми организм включает и выключает гены и перерабатывает вещества. Для них нужны B9, B12 и B6.",1],
 ["гепсидин","Гормон печени, который регулирует всасывание железа.",1],
 ["адаптоген","Растение, которое помогает легче переносить стресс. Термин не строго научный.",1],
 ["оксид азота","Газ, который расширяет сосуды и улучшает кровоток."],
 ["биодоступност","Какая доля вещества реально попадает в кровь после приёма.",1],
 ["инсулин","Гормон поджелудочной железы, который помогает клеткам забирать сахар из крови.",1],
 ["DASH","Диета против гипертонии: овощи, фрукты, цельные злаки, молочка, мало соли, красного мяса и сладкого."],
 ["КПТ","Когнитивно-поведенческая терапия — вид психотерапии с доказанной пользой при тревоге, депрессии и бессоннице."],
 ["полифенол","Большая группа растительных веществ: катехины чая, флаванолы какао, куркумин, ресвератрол, антоцианы ягод. Влияют на сосуды, воспаление и микрофлору кишечника.",1],
 ["флаванол","Вид полифенолов из какао, чая, яблок и винограда. Улучшают работу сосудов.",1],
 ["EGCG","Эпигаллокатехин-галлат — главный катехин зелёного чая."],
 ["серотонин","Медиатор мозга, влияет на настроение, сон и аппетит.",1],
 ["дофамин","Медиатор мотивации, внимания и удовольствия.",1],
 ["норадреналин","Медиатор бодрости и концентрации, выделяется при стрессе и на холоде.",1],
 ["T-клет","Иммунные клетки, которые уничтожают заражённые клетки и управляют иммунным ответом.",1],
 ["ОРВИ","Острые респираторные вирусные инфекции — простуда и похожие болезни."],
 ["денситометри","Рентгеновское исследование плотности костей (DXA). Основной способ найти остеопороз.",1],
 ["остеопороз","Болезнь, при которой кости теряют плотность и легко ломаются.",1],
 ["артроз","Износ хряща в суставах: боль при нагрузке, скованность, хруст.",1],
 ["коллаген","Главный белок соединительной ткани: кожи, связок, хрящей и костей.",1],
 ["лейцин","Аминокислота, которая запускает рост мышц.",1],
 ["карнозин","Вещество в мышцах, которое гасит кислоту при интенсивной работе.",1]
];
const glRe=new RegExp(GL.map(([t,,st])=>`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}${st?"\\p{L}{0,3}(?![\\p{L}\\d])":"(?![\\p{L}\\d])"})`).join("|").replace(/^/,"(?<![\\p{L}\\d])(?:")+")","giu");
function decorate(root){
  if(!root)return;const used=new Set(),walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest(".term,h2,h3,h4,.ptype,.lbl,.kind,svg,.tag,.ev")?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);
  nodes.forEach(tn=>{const txt=tn.nodeValue;glRe.lastIndex=0;let m,last=0,frag=null;
    while((m=glRe.exec(txt))){const gi=m.slice(1).findIndex(x=>x!==undefined);if(gi<0||used.has(gi))continue;used.add(gi);
      frag=frag||document.createDocumentFragment();frag.append(txt.slice(last,m.index));
      const ab=document.createElement("abbr");ab.className="term";ab.tabIndex=0;ab.dataset.gi=gi;ab.textContent=m[0];frag.append(ab);last=m.index+m[0].length}
    if(frag){frag.append(txt.slice(last));tn.replaceWith(frag)}});
}
const tipEl=document.createElement("div");tipEl.id="tip";tipEl.setAttribute("role","tooltip");tipEl.hidden=true;document.body.appendChild(tipEl);
let tipFor=null,tipClicked=false;
function showTip(t){tipFor=t;const txt=GL[+t.dataset.gi][1];tipEl.innerHTML=`<b>${esc(t.textContent)}</b>${esc(txt)}`;tipEl.hidden=false;
  const r=t.getBoundingClientRect(),w=Math.min(320,innerWidth-24);tipEl.style.width=w+"px";
  let x=Math.min(Math.max(12,r.left+r.width/2-w/2),innerWidth-w-12),y=r.bottom+8;
  if(y+tipEl.offsetHeight>innerHeight-12)y=r.top-tipEl.offsetHeight-8;tipEl.style.left=x+"px";tipEl.style.top=y+"px"}
function hideTip(){tipEl.hidden=true;tipFor=null}
document.addEventListener("mouseover",ev=>{const t=ev.target.closest&&ev.target.closest(".term");if(t){if(t!==tipFor){tipClicked=false;showTip(t)}}else if(tipFor&&!ev.target.closest("#tip"))hideTip()});
document.addEventListener("focusin",ev=>{const t=ev.target.closest&&ev.target.closest(".term");if(t)showTip(t)});
document.addEventListener("focusout",ev=>{if(ev.target.closest&&ev.target.closest(".term"))hideTip()});
// a tap on a term explains it instead of activating the button it sits in
document.addEventListener("click",ev=>{const t=ev.target.closest&&ev.target.closest(".term");if(t){ev.preventDefault();ev.stopPropagation();if(tipFor===t&&!tipEl.hidden&&tipClicked){hideTip();tipClicked=false}else{showTip(t);tipClicked=true}}else if(!ev.target.closest("#tip"))hideTip()},true);
addEventListener("scroll",hideTip,{passive:true});

/* ---------- goal chips ---------- */
const goalRow=document.getElementById("goalRow");
goalRow.insertAdjacentHTML("beforeend",`<button class="chip goal" id="goal-all" data-g="" aria-pressed="true">Все</button>`+
  Object.entries(G).map(([k,g])=>`<button class="chip goal" id="goal-${k}" data-g="${k}" aria-pressed="false"><span class="gdot" style="background:var(${g.c})"></span>${g.en}</button>`).join(""));
goalRow.addEventListener("click",ev=>{const b=ev.target.closest(".goal");if(!b)return;
  state.goal=b.dataset.g||null;state.sel=null;state.help=false;state.panelOff=false;goalRow.querySelectorAll(".goal").forEach(x=>x.setAttribute("aria-pressed",x===b));applyView();renderNote()});

/* ---------- graph ---------- */
const RING=["sleep","infl","immune","bones","heart","energy","brain","long"],GA={};
let HUB=null,HR=44;
// every goal is a big hub on a ring; supplements hang off the hubs they serve
function anchors(){
  RING.forEach((k,i)=>{const a=-Math.PI/2+i/RING.length*Math.PI*2;const x=W/2+Math.cos(a)*W*(W<600?.2:.3),y=H/2+Math.sin(a)*H*(W<600?.37:.3);GA[k]={a,x,y,hx:x,hy:y,tx:null,ty:null}});HR=Math.max(34,Math.round(44*S));
  N.forEach(n=>{if(!n.g.length){n.ax=W/2;n.ay=H/2;return}
    let sx=0,sy=0,sw=0;n.g.forEach((k,j)=>{const w=j?1:2.5;sx+=GA[k].x*w;sy+=GA[k].y*w;sw+=w});n.ax=sx/sw;n.ay=sy/sw});
  if(HUB)RING.forEach(k=>{const h=HUB[k];h.setAttribute("transform",`translate(${GA[k].x.toFixed(1)},${GA[k].y.toFixed(1)})`);
    h.firstChild.setAttribute("r",HR);h.classList.toggle("sm",HR<40)});
}
function measure(){
  const ow=W,oh=H,w=Math.max(300,stage.clientWidth);
  W=w;H=w<600?Math.round(Math.max(980,w*2.8)):Math.round(Math.min(960,Math.max(700,w*.78)));S=Math.min(1,Math.max(.6,W/780));R=Math.round(17*Math.max(.78,S));
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);svg.style.height=H+"px";if(ow!==W||oh!==H||!GA.sleep)anchors();
  return [ow,oh];
}
measure();
N.forEach((n,i)=>{const a=i*2.4;n.x=n.ax+Math.cos(a)*50;n.y=n.ay+Math.sin(a)*50;n.vx=n.vy=0;n.tx=n.ty=null});

const gS=el("g",{},svg),gHub=el("g",{},svg),gE=el("g",{},svg),gH=el("g",{},svg),gN=el("g",{},svg);
HUB={};RING.forEach(k=>{const c=`var(${G[k].c})`,h=el("g",{class:"hub",tabindex:"0",role:"button","aria-label":"Цель: "+G[k].en},gHub);
  el("circle",{r:HR,style:`fill:${c};stroke:${c}`},h);
  const w=G[k].en.split(" & "),ln=w.length>1?[w[0]+" &",w[1]]:[G[k].en];
  ln.forEach((x,i)=>{const t=el("text",{y:(i-(ln.length-1)/2)*14,style:`fill:${c}`},h);t.textContent=x});
  h.addEventListener("pointerdown",ev=>{ev.preventDefault();hubDrag={k,cx:ev.clientX,cy:ev.clientY,moved:false};try{svg.setPointerCapture(ev.pointerId)}catch(_){}});
  h.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();hubGo(k)}});HUB[k]=h});
function hubGo(k){document.getElementById(state.goal===k?"goal-all":"goal-"+k).click()}
N.forEach(n=>{n.sp=n.g.map(k=>({k,l:el("line",{class:"spoke"+(defOnly(n.id,k)?" def":""),style:`stroke:var(${G[k].c})`},gS)}))});anchors();
E.forEach(e=>{
  e.line=el("line",{class:`edge ${e.t} ev${e.ev}`},gE);
  e.hit=el("line",{class:"hit"},gH);
  const t=document.createElementNS(NS,"title");t.textContent=`${pairName(e)}: ${TNAME[e.t].toLowerCase()}`;e.hit.appendChild(t);
  e.hit.addEventListener("click",ev=>{ev.stopPropagation();select({type:"edge",i:e.i})});
});
function arc(r,a0,a1){const p=a=>[Math.cos(a)*r,Math.sin(a)*r],[x0,y0]=p(a0),[x1,y1]=p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`}
function buildNodes(){
  gN.textContent="";
  N.forEach((n,i)=>{
    const g=el("g",{class:"node",tabindex:"0",role:"button","aria-label":n.en,style:`--glow:${gcol(n)}`},gN);
    const inn=el("g",{class:"in",style:`--d:${(i*.03).toFixed(2)}s`},g);
    const rr=R+4.5,k=n.g.length,gap=k>1?.32:0;
    if(k===0) el("circle",{class:"arc",r:rr,style:"stroke:var(--muted)","stroke-width":2,"stroke-dasharray":"2 4"},inn);
    else if(k===1) el("circle",{class:"arc",r:rr,style:`stroke:var(${G[n.g[0]].c})`,"stroke-width":3.5},inn);
    else n.g.forEach((gk,j)=>{const a0=-Math.PI/2+j*2*Math.PI/k+gap/2,a1=a0+2*Math.PI/k-gap;
      el("path",{class:"arc",d:arc(rr,a0,a1),style:`stroke:var(${G[gk].c})`,"stroke-width":3.5},inn)});
    el("circle",{class:"core",r:R},inn);
    const s=el("text",{class:"sym"},inn);s.textContent=n.s;if(n.s.length>2)s.style.fontSize="10px";
    const t=el("text",{class:"nm",y:rr+14},inn);t.textContent=n.en;n.t_el=t;
    n.g_el=g;
    g.addEventListener("pointerdown",ev=>startDrag(ev,n));
    g.addEventListener("pointerenter",ev=>{if(ev.pointerType==="touch")return;state.hover=n.id;applyView()});
    g.addEventListener("pointerleave",()=>{state.hover=null;applyView()});
    g.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();select({type:"node",id:n.id})}});
  });
}
buildNodes();

function visible(e){return (state.filter==="all"||state.filter===e.t)&&!(state.hideC&&e.ev==="C")}

let KEEP=null,keepKey="",FOCUS=false,focusKey="",LM=false; // search results: only these nodes move and gather in the centre
function tick(a){
  // focus mode: the rest of the map is frozen, the chosen group glides to its ego layout
  if(FOCUS){N.forEach(n=>{if(n.fx!=null){n.x=n.fx;n.y=n.fy}else if(n.tx!=null){n.x+=(n.tx-n.x)*.2;n.y+=(n.ty-n.y)*.2}});
    RING.forEach(k=>{const h=GA[k];if(h.tx!=null){h.x+=(h.tx-h.x)*.2;h.y+=(h.ty-h.y)*.2}});return}
  RING.forEach(k=>{const h=GA[k];h.x+=(h.hx-h.x)*.25;h.y+=(h.hy-h.y)*.25});
  const REP=30000*S*S,L=135*S,MIN=(R*2+26)**2,LH=HR+(W<600?40:64*S),KEEPOUT=HR+R+16;
  for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){
    const p=N[i],q=N[j];if(KEEP&&(!KEEP.has(p.id)||!KEEP.has(q.id)))continue;
    let dx=q.x-p.x,dy=q.y-p.y,d2=dx*dx+dy*dy;
    if(d2<1){dx=Math.random()-.5;dy=Math.random()-.5;d2=1}
    const d=Math.sqrt(d2),f=REP*a/Math.max(d2,MIN);
    p.vx-=dx/d*f;p.vy-=dy/d*f;q.vx+=dx/d*f;q.vy+=dy/d*f;
  }
  if(KEEP)E.forEach(e=>{if(!KEEP.has(e.a)||!KEEP.has(e.b))return;if(LM&&(!visible(e)||(state.show==="anti"&&e.t!=="anti")))return;const p=byId[e.a],q=byId[e.b],len=e.t==="syn"?L:L*1.35;
    const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy)||1,k=(d-len)/d*.055*a;
    p.vx+=dx*k;p.vy+=dy*k;q.vx-=dx*k;q.vy-=dy*k});
  const padT=R+(W<600?48:10),padB=R+28,cp=KEEP?(LM?(state.show==="all"?1:2.4):5):1;
  N.forEach(n=>{
    if(KEEP&&!KEEP.has(n.id))return;
    const cy=KEEP&&!LM?Math.min(H/2,330):H/2;
    if(KEEP||!n.g.length){n.vx+=((KEEP&&innerWidth>900&&note.classList.contains("open")?(W-424)/2:W/2)-n.x)*.006*cp*a;n.vy+=(cy-n.y)*.009*cp*a}
    else n.g.forEach(k=>{const h=GA[k],dx=h.x-n.x,dy=h.y-n.y,d=Math.hypot(dx,dy)||1,f=(d-LH)/d*.07*a;n.vx+=dx*f;n.vy+=dy*f});
    if(n.fx!=null){n.x=n.fx;n.y=n.fy;n.vx=n.vy=0;return}
    n.vx*=.6;n.vy*=.6;n.x+=n.vx;n.y+=n.vy;
    const padX=Math.max(R+8,n.en.length*3.2+6); // keep the whole label on screen
    n.x=Math.min(W-padX,Math.max(padX,n.x));n.y=Math.min(H-padB,Math.max(padT,n.y));
    // a supplement never sits on top of a goal hub
    if(!KEEP)for(const k of RING){const h=GA[k],dx=n.x-h.x,dy=n.y-h.y,d=Math.hypot(dx,dy)||1;if(d<KEEPOUT){n.x=h.x+dx/d*KEEPOUT;n.y=h.y+dy/d*KEEPOUT}}
  });
}
function render(){
  E.forEach(e=>{const p=byId[e.a],q=byId[e.b];
    for(const l of [e.line,e.hit]){l.setAttribute("x1",p.x.toFixed(1));l.setAttribute("y1",p.y.toFixed(1));l.setAttribute("x2",q.x.toFixed(1));l.setAttribute("y2",q.y.toFixed(1))}});
  RING.forEach(k=>HUB[k].setAttribute("transform",`translate(${GA[k].x.toFixed(1)},${GA[k].y.toFixed(1)})`));
  N.forEach(n=>{n.g_el.setAttribute("transform",`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`);
    n.sp.forEach(({k,l})=>{const h=GA[k],dx=n.x-h.x,dy=n.y-h.y,d=Math.hypot(dx,dy)||1;
      l.setAttribute("x1",(h.x+dx/d*HR).toFixed(1));l.setAttribute("y1",(h.y+dy/d*HR).toFixed(1));l.setAttribute("x2",n.x.toFixed(1));l.setAttribute("y2",n.y.toFixed(1))})});
}
function loop(){tick(alpha);render();alpha*=.985;if(alpha>.004||dragging)raf=requestAnimationFrame(loop);else raf=null}
function heat(a){alpha=Math.max(alpha,a);if(!raf)raf=requestAnimationFrame(loop)}
while(alpha>.35){tick(alpha);alpha*=.985}
render();
if(reduce){while(alpha>.004){tick(alpha);alpha*=.985}render()}else heat(alpha);

let dragging=null;
function pt(ev){const r=svg.getBoundingClientRect();return{x:(ev.clientX-r.left)*W/r.width,y:(ev.clientY-r.top)*H/r.height}}
function startDrag(ev,n){ev.preventDefault();const p=pt(ev);dragging={n,sx:p.x,sy:p.y,cx:ev.clientX,cy:ev.clientY,moved:false};try{svg.setPointerCapture(ev.pointerId)}catch(_){}}
svg.addEventListener("pointermove",ev=>{if(!dragging)return;const p=pt(ev);
  if(!dragging.moved&&Math.hypot(ev.clientX-dragging.cx,ev.clientY-dragging.cy)<8)return;
  dragging.moved=true;dragging.n.fx=p.x;dragging.n.fy=p.y;heat(.3)});
let lastNodeUp=0;
function endDrag(){if(!dragging)return;const {n,moved}=dragging;n.fx=n.fy=null;dragging=null;lastNodeUp=performance.now();if(!moved)select({type:"node",id:n.id});else heat(.15)}
svg.addEventListener("pointerup",endDrag);svg.addEventListener("pointercancel",endDrag);
// pointer capture retargets the click after a node tap to the svg; ignore that one
svg.addEventListener("click",ev=>{if(ev.target===svg&&performance.now()-lastNodeUp>400)resetView()});
// goal hubs can be dragged too; a tap without movement opens the goal
let hubDrag=null;
svg.addEventListener("pointermove",ev=>{if(!hubDrag||FOCUS)return;
  if(!hubDrag.moved&&Math.hypot(ev.clientX-hubDrag.cx,ev.clientY-hubDrag.cy)<8)return;
  hubDrag.moved=true;const q=pt(ev),h=GA[hubDrag.k];h.hx=h.x=Math.min(W-HR,Math.max(HR,q.x));h.hy=h.y=Math.min(H-HR,Math.max(HR,q.y));heat(.3)});
svg.addEventListener("pointerup",()=>{if(!hubDrag)return;const {k,moved}=hubDrag;hubDrag=null;lastNodeUp=performance.now();if(!moved)hubGo(k)});
svg.addEventListener("pointercancel",()=>{hubDrag=null});
// one way out of any focus: back to the whole map, goal filter cleared
function resetView(){state.sel=null;state.help=false;state.goal=null;state.mine=false;
  goalRow.querySelectorAll(".goal").forEach(x=>x.setAttribute("aria-pressed",x.dataset.g===""));applyView();renderNote()}

function select(s){state.sel=s;if(s){state.help=false;state.panelOff=false}applyView();renderNote();note.scrollTop=0}
function focusSets(){
  const M=matches();
  let s=state.sel||(state.hover?{type:"node",id:state.hover}:null);
  if(!s&&M&&M.size===1)s={type:"node",id:[...M][0],auto:true};
  if(s&&s.type==="node"){const rn=new Set([s.id]),re=new Set();E.forEach(e=>{if(visible(e)&&(e.a===s.id||e.b===s.id)){re.add(e.i);rn.add(e.a);rn.add(e.b)}});return {rn,re,s,M}}
  if(s&&s.type==="edge"){const e=E[s.i];return {rn:new Set([e.a,e.b]),re:new Set([e.i]),s,M}}
  if(M){const re=new Set();E.forEach(e=>{if(visible(e)&&M.has(e.a)&&M.has(e.b))re.add(e.i)});return {rn:M,re,s:null,M}}
  if(state.goal){const rn=new Set(N.filter(n=>n.g.includes(state.goal)).map(n=>n.id)),re=new Set();
    E.forEach(e=>{if(rn.has(e.a)&&rn.has(e.b))re.add(e.i)});return {rn,re,s:null,M:null}}
  return {rn:null,re:null,s:null,M:null};
}
function applyView(){
  const ms=mySet(),mb=document.getElementById("mineBtn"),clash=E.filter(e=>e.t==="anti"&&ms.has(e.a)&&ms.has(e.b)).length;
  if(!ms.size)state.mine=false;
  mb.hidden=!ms.size;mb.setAttribute("aria-pressed",state.mine);mb.textContent=`Мой набор · ${ms.size}`+(clash?` · конфликтов: ${clash}`:"");
  const {rn,re,s,M}=focusSets(),focus=!!s,ego=!!state.sel,gf=!ego&&!M&&!!state.goal;
  const ml=innerWidth<600&&!ego&&!gf&&!M&&state.show==="none"&&!state.help,gl=document.getElementById("glist");
  document.getElementById("view-graph").classList.toggle("mlist",ml);gl.hidden=!ml;
  if(ml&&!gl.firstChild){gl.innerHTML=RING.map(k=>`<button class="goalcard" data-k="${k}" style="--c:var(${G[k].c})"><b>${G[k].en}</b><span>${G[k].n} · ${N.filter(n=>n.g.includes(k)).length}</span></button>`).join("");
    gl.addEventListener("click",ev=>{const b=ev.target.closest(".goalcard");if(!b)return;hubGo(b.dataset.k);state.panelOff=true;renderNote();stage.scrollIntoView({block:"start"})})}
  const gset=gf?new Set(N.filter(n=>n.g.includes(state.goal)).map(n=>n.id)):null;
  layoutFocus(ego?state.sel:gf?{type:"goal",k:state.goal}:null,re);
  svg.classList.toggle("ego",ego);svg.classList.toggle("find",!!M||(!ego&&!gf&&state.show!=="none"));svg.classList.toggle("gf",gf);
  document.getElementById("mapBack").hidden=!(ego||gf||state.mine);document.getElementById("mapHelp").hidden=ego||gf||state.mine;
  // while searching, everything outside the matches (and the hovered node's partners) disappears entirely
  const keep=M?new Set([...M,...(rn||[])]):null;
  const lm=!M&&!ego&&!gf&&state.show!=="none",inMode=e=>visible(e)&&(state.show==="all"||e.t==="anti");
  const lset=lm?new Set(E.filter(inMode).flatMap(e=>[e.a,e.b])):null,ks=M?(M.size>1?M:null):lset;
  const k=(lm?"L"+state.show+state.hideC:"")+(M?[...M].sort().join():"");if(k!==keepKey){keepKey=k;KEEP=ks;LM=lm;heat(lm?1:.6)}
  E.forEach(e=>{
    const inRe=!!re&&re.has(e.i);
    let show=visible(e)||(!!s&&s.type==="edge"&&s.i===e.i);
    if((M||ego)&&!inRe)show=false;
    if(gf&&!(gset.has(e.a)&&gset.has(e.b)))show=false;
    if(lm){if(!inMode(e))show=false}else if(!M&&!(focus&&inRe))show=false;
    e.line.classList.toggle("hide",!show);e.hit.classList.toggle("hide",!show);
    e.line.classList.toggle("dim",show&&!!re&&!inRe);e.line.classList.toggle("on",inRe);
  });
  N.forEach(n=>{
    const gone=(!!keep&&!keep.has(n.id))||(ego&&!rn.has(n.id))||(gf&&!gset.has(n.id))||(lm&&!lset.has(n.id))||(!n.g.length&&!M&&!ego&&!lm&&!(rn&&rn.has(n.id)));
    n.g_el.classList.toggle("gone",gone);
    n.g_el.classList.toggle("dim",!gone&&!!rn&&!rn.has(n.id));
    n.g_el.classList.toggle("match",!!M&&M.has(n.id));n.g_el.classList.toggle("inset",ms.has(n.id));n.t_el.textContent=(ms.has(n.id)?"✓ ":"")+n.en;
    n.g_el.classList.toggle("sel",!!state.sel&&((state.sel.type==="node"&&state.sel.id===n.id)||(state.sel.type==="edge"&&rn.has(n.id))));
  });
  try{const cur=location.hash,h=state.sel&&state.sel.type==="node"?"#s-"+state.sel.id:state.goal?"#g-"+state.goal:"";
    if(h!==cur&&(cur===""||/^#[sg]-/.test(cur))&&!document.getElementById("view-graph").hidden)history.replaceState(null,"",location.pathname+location.search+h)}catch(_){}
  // hubs and spokes: a hovered supplement lights its goals, a chosen goal lights its supplements
  const hn=!ego&&!gf&&s&&s.type==="node"?byId[s.id]:null,lit=hn?new Set(hn.g):state.goal?new Set([state.goal]):null;
  RING.forEach(k=>{HUB[k].classList.toggle("dim",!!lit&&!lit.has(k));HUB[k].classList.toggle("on",!!lit&&lit.has(k))});
  N.forEach(n=>n.sp.forEach(({k,l})=>{const on=hn?n===hn:state.goal?k===state.goal:false;l.classList.toggle("on",on);l.classList.toggle("dim",!!lit&&!on)}));
}
function layoutFocus(s,re){
  const wide=innerWidth>900,panel=wide&&!state.panelOff?Math.min(400,W-24)+24:0;
  const key=s?[s.type,s.type==="node"?s.id:s.type==="goal"?s.k:s.i,state.filter,state.hideC,W,H,panel].join():"";
  if(key===focusKey)return;focusKey=key;
  N.forEach(n=>{n.tx=n.ty=null});RING.forEach(k=>{GA[k].tx=GA[k].ty=null});FOCUS=!!s;
  if(!s){heat(.5);return}
  const cx=(W-panel)/2,cy=wide?H/2:Math.min(H/2,300);
  // a chosen goal moves to the centre, its supplements form a ring (two rings when there are many)
  if(s.type==="goal"){const gy=wide?cy:Math.min(H/2,360),h=GA[s.k];h.tx=cx;h.ty=gy;
    const ns=N.filter(n=>n.g.includes(s.k)).sort((a,b)=>defOnly(a.id,s.k)-defOnly(b.id,s.k)||a.g.length-b.g.length),two=wide&&ns.length>9,sc=ns.length<=4?.6:ns.length<=7?.8:1;
    const rx=Math.max(100,Math.min(290,cx-76))*sc,ry=Math.max(120,Math.min(wide?270:310,gy-R-44))*sc;
    ns.forEach((n,i)=>{const a=-Math.PI/2+(i+.5)/ns.length*Math.PI*2,f=i%2&&ns.length>9?(two?.6:.84):1;n.tx=cx+Math.cos(a)*rx*f;n.ty=gy+Math.sin(a)*ry*f});
    heat(.5);return}
  if(s.type==="edge"){const e=E[s.i],d=Math.min(110,cx-70);
    byId[e.a].tx=cx-d;byId[e.b].tx=cx+d;byId[e.a].ty=byId[e.b].ty=cy;heat(.5);return}
  const c=byId[s.id];c.tx=cx;c.ty=cy;
  // partners sit on an ellipse around the centre, grouped by type: help, then dose-dependent, then clash
  const to={syn:0,warn:1,anti:2};
  const nb=E.filter(e=>re.has(e.i)).map(e=>({o:byId[e.a===s.id?e.b:e.a],t:e.t})).sort((x,y)=>to[x.t]-to[y.t]);
  const groups=new Set(nb.map(x=>x.t)).size,slots=nb.length+(groups>1?groups:0);
  const sc=nb.length<=3?.55:nb.length<=6?.75:1;
  const rx=Math.max(92,Math.min(270,cx-76))*sc,ry=Math.max(110,Math.min(250,cy-R-44))*sc;
  let i=0,last=null;
  nb.forEach(x=>{if(groups>1&&last!==null&&x.t!==last)i++;last=x.t;
    const a=-Math.PI/2+(i+.5)/slots*Math.PI*2;x.o.tx=cx+Math.cos(a)*rx;x.o.ty=cy+Math.sin(a)*ry;i++});
  heat(.5);
}
function connList(n){
  const ord={syn:0,anti:1,warn:2};
  const rel=E.filter(e=>(e.a===n.id||e.b===n.id)&&visible(e)).sort((x,y)=>ord[x.t]-ord[y.t]||x.ev.localeCompare(y.ev));
  return `<ul class="list">${rel.map(e=>{const o=e.a===n.id?byId[e.b]:byId[e.a];
    return `<li><button data-e="${e.i}"><span class="dot ${e.t}"></span><span><b>${esc(o.en)}</b> <span class="ev">${e.ev}</span><br><span class="t">${esc(e.txt)}</span></span></button></li>`}).join("")||'<li class="kind">Под этим фильтром связей нет.</li>'}</ul>`;
}
function renderNote(){
  const s=state.sel;
  const M=matches();
  if(!s&&M){
    const list=N.filter(n=>M.has(n.id));
    const mine=!state.q.trim()&&state.mine,om={anti:0,warn:1,syn:2},es=mine?E.filter(e=>M.has(e.a)&&M.has(e.b)).sort((x,y)=>om[x.t]-om[y.t]):[];
    const mineHtml=es.length?`<ul class="list">${es.map(e=>`<li><button data-e="${e.i}"><span class="dot ${e.t}"></span><span><b>${esc(byId[e.a].en)} + ${esc(byId[e.b].en)}</b> <span class="ev">${e.ev}</span><br><span class="t">${esc(e.txt)}</span></span></button></li>`).join("")}</ul>`:'<p class="kind">Между добавками набора связей нет.</p>';
    note.innerHTML=list.length?`<div><span class="kind">${mine?"Мой набор":"Поиск"}</span><h2>${mine?"Связи внутри набора":"Найдено: "+list.length}</h2></div>
      ${list.length===1?`<p class="how">${esc(list[0].tip)}</p>${connList(list[0])}`:`${mine?mineHtml:'<p class="kind">Наведи на добавку на графе, чтобы увидеть её связи, или нажми на неё в списке.</p>'}
      <ul class="list">${list.map(n=>`<li><button data-n="${n.id}"><span class="gdot" style="background:${gcol(n)};margin-top:7px"></span><span><b>${esc(n.en)}</b></span></button></li>`).join("")}</ul>`}`
      :`<h2>Ничего не нашлось</h2><p class="kind">Попробуй по-другому: по-русски, по-английски или первые буквы.</p>`;
  } else if(!s&&state.goal){
    const g=G[state.goal],list=N.filter(n=>n.g.includes(state.goal)).sort((a,b)=>defOnly(a.id,state.goal)-defOnly(b.id,state.goal));
    note.innerHTML=`<div><span class="kind">Цель</span><h2 style="color:var(${g.c})">${g.en}</h2></div>
      <p class="how">${esc(g.note)}</p>
      <ul class="list">${list.map(n=>`<li><button data-n="${n.id}"><span class="gdot" style="background:var(${g.c});margin-top:7px"></span><span><b>${esc(n.en)}</b>${defOnly(n.id,state.goal)?' <span class="deftag">только при дефиците</span>':""}<br><span class="t">${esc(((INFO[n.id]||{}).goals||{})[state.goal]||"")}</span></span></button></li>`).join("")}</ul>`;
  } else if(!s){
    note.innerHTML=`<h2>Коротко</h2><ol class="rules">
      <li>D3, K2 и магний работают в связке. D3 и K2 пей с едой, в которой есть жир.</li>
      <li>Железо пей с витамином C. Кальций, кофе и чай отодвинь от железа на 2 часа.</li>
      <li>Если пьёшь больше 40 мг цинка в день несколько месяцев, добавь медь.</li>
      <li>Куркумин без пиперина почти не всасывается.</li>
      <li>Магний и цинк в обычных дозах совместимы. Мешает только доза цинка около 140 мг.</li>
      <li>Кофе с L-теанином бодрит без нервозности.</li>
      <li>Глицин, магний и апигенин вечером хорошо сочетаются для сна.</li></ol>
      <section class="ns"><h4>Как читать карту</h4>
        <ul class="legendl">
          <li><span class="ln syn"></span><span>Бегущая белая линия — помогают друг другу</span></li>
          <li><span class="ln anti"></span><span>Красная — мешают, разноси по времени</span></li>
          <li><span class="ln warn"></span><span>Жёлтый пунктир — мешают только в больших дозах</span></li>
          <li><span class="thick"></span><span>Чем толще линия, тем надёжнее данные (A, B, C)</span></li>
          <li><span class="ln dash"></span><span>Пунктир к цели — помогает только при дефиците</span></li>
          <li><span style="width:16px;text-align:center;color:var(--ink)">✓</span><span>Галочка перед названием — добавка в твоём наборе</span></li>
        </ul></section>
      <section class="ns"><h4>Цвет кольца — цель</h4>
        <ul class="legendl">${Object.values(G).map(g=>`<li><span class="gdot" style="background:var(${g.c})"></span><span>${g.en}</span></li>`).join("")}</ul></section>
      <p class="kind">Большие круги — цели. Линия от добавки к кругу значит, что её принимают для этой цели: чем больше линий, тем шире действие. Нажми на добавку: останутся только она и её взаимодействия с другими.</p>`;
  } else if(s.type==="node"){
    const n=byId[s.id];
    const inSet=mySet().has(n.id),inf=INFO[n.id]||{};
    note.innerHTML=`<div class="nhead"><span class="kind">${KIND(n.id)} · ${esc(n.name)}</span><div class="ntitle"><h2>${esc(n.en)}</h2><button class="addp" data-toggle="${n.id}" aria-pressed="${inSet}" title="${inSet?"В моём наборе — убрать":"Добавить в набор"}" aria-label="${inSet?"Убрать из набора":"Добавить в набор"}">${inSet?"✓":"+"}</button></div>${n.g.length?`<div class="gtags">${n.g.map(k=>`<button class="gtag" data-goal="${k}" style="--c:var(${G[k].c})">${G[k].en}</button>`).join("")}</div>`:""}</div>
      ${inf.what?`<section class="ns"><h4>Зачем нужен</h4><p>${esc(inf.what)}</p></section>`:""}
      ${n.g.length?`<section class="ns"><h4>Для чего принимают</h4><ul class="glist">${n.g.map(k=>`<li><button data-goal="${k}"><span class="gdot" style="background:var(${G[k].c})"></span><span><b style="color:var(${G[k].c})">${G[k].en}</b><span class="t">${esc((inf.goals||{})[k]||"")}</span></span></button></li>`).join("")}</ul></section>`:""}
      <section class="ns"><h4>Как принимать</h4><p class="how">${esc(n.tip)}</p></section>
      ${inf.forms?`<section class="ns"><h4>Какую форму брать</h4><ul class="forms">${inf.forms.map(([f,g,t])=>`<li><div class="fh"><b>${esc(f)}</b><span class="grade ${g}">${GR[g]}</span></div><span class="t">${esc(t)}</span></li>`).join("")}</ul></section>`:""}
      ${inf.buy?`<section class="ns"><h4>Важно</h4><p>${esc(inf.buy)}</p></section>`:""}
      ${(()=>{const ms=mySet(),comp=E.filter(e=>(e.a===n.id&&ms.has(e.b))||(e.b===n.id&&ms.has(e.a)));
        return comp.length?`<section class="ns"><h4>С твоим набором</h4><ul class="alist">${comp.map(e=>{const o=byId[e.a===n.id?e.b:e.a];
          return `<li><span class="dot ${e.t}"></span><div><b>${e.t==="syn"?"Хорошо вместе":e.t==="anti"?"Мешают друг другу":"Зависит от дозы"}: ${esc(o.en)}</b><span class="t">${e.t==="anti"?"Пей их в разное время, минимум через 2 часа. ":""}${esc(e.txt)}</span></div></li>`}).join("")}</ul></section>`:""})()}
      <section class="ns"><h4>Связи</h4>${connList(n)}</section>`;
  } else {
    const e=E[s.i];
    note.innerHTML=`<div><span class="kind"><span class="dot ${e.t}" style="display:inline-block;margin:0 6px 0 0"></span>${TNAME[e.t]} · данные ${e.ev}</span><h2>${esc(byId[e.a].en)} + ${esc(byId[e.b].en)}</h2></div>
      <p>${esc(e.txt)}</p>
      <ul class="list"><li><button data-n="${e.a}"><span></span><span>Все связи: <b>${esc(byId[e.a].en)}</b></span></button></li>
      <li><button data-n="${e.b}"><span></span><span>Все связи: <b>${esc(byId[e.b].en)}</b></span></button></li></ul>`;
  }
  note.insertAdjacentHTML("afterbegin",'<button class="nclose" id="nclose" type="button" aria-label="Закрыть">✕</button>');
  const open=!!(state.help||((state.sel||matches()||state.goal)&&!state.panelOff));
  note.classList.toggle("open",open);
  note.querySelector("#nclose").addEventListener("click",()=>{state.panelOff=true;resetView()});
  note.querySelectorAll("[data-e]").forEach(b=>b.addEventListener("click",()=>select({type:"edge",i:+b.dataset.e})));
  decorate(note);
  note.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>select({type:"node",id:b.dataset.n})));
  note.querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",()=>toggleItem(b.dataset.toggle)));
  note.querySelectorAll("[data-goal]").forEach(b=>b.addEventListener("click",()=>{state.goal=b.dataset.goal;state.sel=null;
    goalRow.querySelectorAll(".goal").forEach(x=>x.setAttribute("aria-pressed",x.dataset.g===state.goal));applyView();renderNote();note.scrollTop=0}));
}

const ord={syn:0,anti:1,warn:2};
const sortSt={k:"type",d:1},tbl={f:"all",hideC:false};
function tvis(){document.querySelectorAll(".trow").forEach(r=>{const e=E[+r.dataset.i];r.hidden=!((tbl.f==="all"||tbl.f===e.t)&&!(tbl.hideC&&e.ev==="C"))});
  document.querySelectorAll(".tgrp").forEach(g=>{g.hidden=tbl.f!=="all"&&tbl.f!==g.dataset.t})}
function renderTable(){
  const tv={syn:0,anti:1,warn:2};
  const cmp={type:(x,y)=>tv[x.t]-tv[y.t]||x.ev.localeCompare(y.ev),pair:(x,y)=>pairName(x).localeCompare(pairName(y),"ru"),ev:(x,y)=>x.ev.localeCompare(y.ev)||tv[x.t]-tv[y.t]};
  const cnt={};E.forEach(e=>{cnt[e.t]=(cnt[e.t]||0)+1});let last=null;
  document.getElementById("table").innerHTML=[...E].sort((x,y)=>cmp[sortSt.k](x,y)*sortSt.d).map(e=>{
    const head=sortSt.k==="type"&&e.t!==last?`<div class="tgrp" data-t="${e.t}"><span class="dot ${e.t}"></span>${TNAME[e.t]} <span class="kind">${cnt[e.t]}</span></div>`:"";last=e.t;
    return head+`<button class="trow" data-i="${e.i}" aria-expanded="false"><span class="pr">${esc(pairName(e))}</span><span class="ty"><span class="dot ${e.t}"></span>${TNAME[e.t]}</span><span class="tx">${esc(e.txt)}</span><span class="ev">${e.ev}</span><span class="go">Показать на карте →</span></button>`}).join("");
  document.querySelectorAll("[data-sort]").forEach(b=>{const on=b.dataset.sort===sortSt.k;b.setAttribute("aria-pressed",on);b.querySelector("i").textContent=on?(sortSt.d>0?"▲":"▼"):""});
  tvis();
}
document.querySelectorAll(".trel").forEach(b=>b.addEventListener("click",()=>{tbl.f=b.dataset.f;document.querySelectorAll(".trel").forEach(x=>x.setAttribute("aria-pressed",x===b));tvis()}));
document.getElementById("tHideC").addEventListener("change",ev=>{tbl.hideC=ev.target.checked;tvis()});
document.querySelectorAll("[data-sort]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.sort;if(sortSt.k===k)sortSt.d*=-1;else{sortSt.k=k;sortSt.d=1}renderTable()}));
renderTable();
decorate(document.getElementById("table"));
document.getElementById("table").addEventListener("click",ev=>{const r=ev.target.closest(".trow");if(!r)return;
  if(ev.target.closest(".go")){showTab("graph");select({type:"edge",i:+r.dataset.i});stage.scrollIntoView({behavior:"auto",block:"start"});return}
  const on=!r.classList.contains("open");document.querySelectorAll(".trow.open").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-expanded","false")});
  r.classList.toggle("open",on);r.setAttribute("aria-expanded",on)});

document.querySelectorAll(".rel").forEach(b=>b.addEventListener("click",()=>{
  state.filter=b.dataset.f;document.querySelectorAll(".rel").forEach(x=>x.setAttribute("aria-pressed",x===b));
  if(state.sel&&state.sel.type==="edge"&&!visible(E[state.sel.i]))state.sel=null;applyView();renderNote()}));
document.getElementById("hideC").addEventListener("change",ev=>{state.hideC=ev.target.checked;
  if(state.sel&&state.sel.type==="edge"&&!visible(E[state.sel.i]))state.sel=null;applyView();renderNote()});

/* ---------- schedule ---------- */
let picked=new Set(),extras=new Set(),excluded=new Set(),schedMode="mine";
try{const sv=JSON.parse(localStorage.getItem("supp-set-v1")||"null");if(sv){picked=new Set(sv.p.filter(id=>STACKS.some(s=>s.id===id)));extras=new Set(sv.x.filter(id=>byId[id]));excluded=new Set(sv.e)}}catch(_){}
function save(){try{localStorage.setItem("supp-set-v1",JSON.stringify({p:[...picked],x:[...extras],e:[...excluded]}))}catch(_){}}
const pill=n=>`<span class="mini" style="border-color:${gcol(n)}">${esc(n.s)}</span>`;
const countPills=ids=>ids.filter(id=>id!=="Cof").length;
function inStacks(id){return STACKS.some(s=>picked.has(s.id)&&s.items.some(x=>x[0]===id))}
function mySet(){
  const m=new Map();
  STACKS.filter(s=>picked.has(s.id)).forEach(s=>s.items.forEach(([id,d,sl,opt])=>{
    if(excluded.has(id))return;const prev=m.get(id);
    if(!prev||(prev.opt&&!opt))m.set(id,{id,d,sl,opt:!!opt});
  }));
  extras.forEach(id=>{if(!m.has(id))m.set(id,{id,d:DEF[id][0],sl:DEF[id][1],opt:false})});
  return m;
}
function toggleItem(id){
  if(mySet().has(id)){extras.delete(id);if(inStacks(id))excluded.add(id)}
  else{excluded.delete(id);if(!inStacks(id))extras.add(id)}
  save();renderPlan();applyView();if((state.sel&&state.sel.type==="node")||state.mine)renderNote();
}
document.getElementById("stacks").innerHTML=STACKS.map((s,i)=>{
  const core=s.items.filter(x=>!x[3]);
  return `<article class="stack" id="stack-${s.id}"><div class="rank">${i+1}</div><div class="sbody">
   <div class="shead"><div><h3>${s.t}</h3><p class="who">${s.who}</p></div><button class="add" data-s="${s.id}" aria-pressed="false">Добавить в набор</button></div>
   <ul class="sitems">${s.items.map(([id,d,sl,opt])=>{const n=byId[id];return `<li class="sitem${opt?" opt":""}">${pill(n)}<span><b>${esc(n.name)}</b><span class="t">${opt?"по желанию · ":""}${esc(d)}</span></span></li>`}).join("")}</ul>
   <p class="why">${s.why}</p>
   <span class="cnt">${countPills(core.map(x=>x[0]))} обязательных${s.items.length>core.length?` + ${s.items.length-core.length} по желанию`:""}</span>
  </div></article>`}).join("");
document.getElementById("skip").innerHTML=SKIP.map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join("");

function itemBtn(x){const n=byId[x.id];return `<button class="titem${x.opt?" opt":""}" data-n="${x.id}">${pill(n)}<span><b>${esc(n.name)}</b>${x.d?`<span class="t">${x.opt?"по желанию · ":""}${esc(x.d)}</span>`:""}</span></button>`}
function rows(list){return list.map(r=>`<div class="tline"><div class="tl-when"><span class="when">${r.w}</span><h3>${r.t}</h3><p>${r.p}</p></div><div class="tl-items">${r.its.map(itemBtn).join("")}</div></div>`).join("")}
const SLOTNAME={empty:"утром натощак",morning:"утром с кофе",meal:"с едой",dinner:"с ужином",bed:"перед сном",any:"в любое время"};
// what goes well with the set, and how to split what clashes
function setAdvice(m){
  const cl=E.filter(e=>e.t!=="syn"&&m.has(e.a)&&m.has(e.b));
  const sug=new Map();
  E.filter(e=>e.t==="syn").forEach(e=>{const ia=m.has(e.a),ib=m.has(e.b);if(ia===ib)return;
    const add=ia?e.b:e.a,have=ia?e.a:e.b,cur=sug.get(add);if(!cur||cur.e.ev>e.ev)sug.set(add,{add,have,e})});
  return {cl,sug:[...sug.values()].sort((x,y)=>x.e.ev.localeCompare(y.e.ev)).slice(0,6)};
}
function clashLine(e,m){
  const a=m.get(e.a),b=m.get(e.b),na=byId[e.a].name,nb=byId[e.b].name;
  if(e.t==="warn")return `<span class="ok">В обычных дозах можно вместе.</span>`;
  if(a.sl===b.sl&&a.sl!=="any")return `<span class="bad">Сейчас оба ${SLOTNAME[a.sl]}. Разнеси минимум на 2 часа: например, ${na} — ${SLOTNAME[a.sl]}, а ${nb} — ${SLOTNAME[a.sl==="dinner"?"meal":"dinner"]}.</span>`;
  return `<span class="ok">В расписании уже разнесены: ${na} — ${SLOTNAME[a.sl]}, ${nb} — ${SLOTNAME[b.sl]}.</span>`;
}
function renderPlan(){
  const m=mySet();
  document.querySelectorAll(".add[data-s]").forEach(b=>{const on=picked.has(b.dataset.s);b.setAttribute("aria-pressed",on);b.textContent=on?"В наборе ✓":"Добавить в набор";document.getElementById("stack-"+b.dataset.s).classList.toggle("on",on)});
  document.getElementById("pchips").innerHTML=N.map(n=>`<button class="pchip" data-p="${n.id}" aria-pressed="${m.has(n.id)}">${pill(n)}<span>${esc(n.name)}</span></button>`).join("");
  document.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===schedMode));
  const plan=document.getElementById("plan"),title=document.getElementById("schedTitle"),clash=document.getElementById("clash");
  if(schedMode==="all"){
    title.textContent="Расписание: все добавки";clash.hidden=true;
    plan.innerHTML=rows(PLAN.map(r=>({w:r.w,t:r.t,p:r.p,its:r.items.map(([id,nt])=>({id,d:nt||""}))})));
    return;
  }
  const items=[...m.values()],req=items.filter(x=>!x.opt);
  title.textContent=items.length?`Мой набор: ${countPills(req.map(x=>x.id))} в день`+(items.length>req.length?` + ${items.length-req.length} по желанию`:""):"Мой набор";
  if(!items.length){plan.innerHTML=`<p class="empty">Набор пуст. Добавь «Базу» или выбери добавки выше, и здесь появится расписание на день.</p>`;clash.hidden=true;return}
  plan.innerHTML=rows(SLOTS.map(k=>({...SLOT[k],its:items.filter(x=>x.sl===k)})).filter(r=>r.its.length));
  const {cl,sug}=setAdvice(m);
  clash.hidden=false;
  document.getElementById("advBad").innerHTML=`<h4>Несочетаемое</h4>`+(cl.length?`<ul class="alist">${cl.map(e=>`<li><span class="dot ${e.t}"></span><div><b>${esc(pairName(e))}</b><span class="t">${esc(e.txt)}</span>${clashLine(e,m)}</div></li>`).join("")}</ul>`:`<p class="ok">Конфликтов в наборе нет ✓</p>`);
  document.getElementById("advGood").innerHTML=`<h4>Хорошо добавить</h4>`+(sug.length?`<ul class="alist">${sug.map(x=>`<li><span class="dot syn"></span><div><b>${esc(byId[x.add].name)} <span class="ev">${x.e.ev}</span></b><span class="t">К «${esc(byId[x.have].name)}»: ${esc(x.e.txt)}</span><button class="go" data-add="${x.add}">+ Добавить в набор</button></div></li>`).join("")}</ul>`:`<p class="kind">Подсказок пока нет.</p>`);
  decorate(clash);
}
document.getElementById("stacks").addEventListener("click",ev=>{const b=ev.target.closest(".add[data-s]");if(!b)return;
  const id=b.dataset.s,st=STACKS.find(x=>x.id===id);
  if(picked.has(id))picked.delete(id);else{picked.add(id);st.items.forEach(x=>excluded.delete(x[0]))}
  schedMode="mine";save();renderPlan()});
document.getElementById("pchips").addEventListener("click",ev=>{const b=ev.target.closest("[data-p]");if(!b)return;schedMode="mine";toggleItem(b.dataset.p)});
document.getElementById("resetSet").addEventListener("click",()=>{picked=new Set(["base"]);extras.clear();excluded.clear();schedMode="mine";save();renderPlan()});
document.querySelectorAll("[data-m]").forEach(b=>b.addEventListener("click",()=>{schedMode=b.dataset.m;renderPlan()}));
renderPlan();
document.getElementById("clash").addEventListener("click",ev=>{const b=ev.target.closest("[data-add]");if(b)toggleItem(b.dataset.add)});
decorate(document.getElementById("stacks"));

document.getElementById("plan").addEventListener("click",ev=>{const b=ev.target.closest("[data-n]");if(!b)return;showTab("graph");select({type:"node",id:b.dataset.n});stage.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});

/* ---------- training ---------- */
let trSel=null;
const trAll=()=>TR.flatMap(g=>g.items);
const stripe=it=>`linear-gradient(90deg,${it.g.map(k=>`var(${G[k].c})`).join(",")}${it.g.length===1?`,var(${G[it.g[0]].c})`:""})`;
function trDetail(it){const x=TRX[it.n]||{},steps=it.steps||x.steps||[];
  return `<section class="tdet" id="tdet" style="--stripe:${stripe(it)}">
   <div class="tdet-h"><div><span class="orig">${it.o}</span><h2 class="big">${it.n}</h2><span class="meta">${it.m}</span></div><button class="chip sm" id="trClose">Закрыть ✕</button></div>
   ${tags(it.g)}
   <div class="tdet-g">
    <div class="col"><h4>Как делать</h4><p>${it.how}</p>${steps.length?`<ol class="tsteps">${steps.map(([a,b,c])=>`<li><b>${a}</b><span>${b}</span>${c?`<span class="why">${c}</span>`:""}</li>`).join("")}</ol>`:""}</div>
    <div class="col"><h4>Что доказано <span class="ev">${it.ev}</span></h4><p>${it.proof}</p>
     ${x.pair&&x.pair.length?`<h4>С чем сочетать</h4><ul class="tpair">${x.pair.map(([id,w])=>`<li><button data-n="${id}">${pill(byId[id])}<span><b>${esc(byId[id].name)}</b><span class="t">${w}</span></span></button></li>`).join("")}</ul>`:""}
     ${x.tips&&x.tips.length?`<h4>Нюансы</h4><ul class="ttips">${x.tips.map(t=>`<li>${t}</li>`).join("")}</ul>`:""}
     ${x.caution?`<div class="tcaution"><b>Осторожно</b><span>${x.caution}</span></div>`:""}
    </div>
   </div>${x.learn&&x.learn.length?`<div class="learn"><h4>Разберёмся</h4><div class="lg">${x.learn.map(([a,b])=>`<article><b>${a}</b><p>${b}</p></article>`).join("")}</div></div>`:""}</section>`;}
function renderTrain(){
  const it=trSel&&trAll().find(i=>i.n===trSel);
  document.getElementById("train").innerHTML=`<div class="view">${it?trDetail(it):""}`+TR.map(gr=>`<section class="tgroup"><div><h2>${gr.h}</h2><p style="color:var(--muted);margin-top:4px;max-width:70ch">${gr.p}</p></div><div class="cards">${gr.items.map(it=>`
  <article class="card${trSel&&trSel!==it.n?" faded":""}${trSel===it.n?" picked":""}" data-name="${it.n}" tabindex="0" role="button" aria-expanded="${trSel===it.n}" style="--stripe:${stripe(it)}">
    <div class="top"><div><h3>${it.n}</h3><span class="orig">${it.o}</span></div><span class="ev">${it.ev}</span></div>
    <span class="meta">${it.m}</span>
    ${tags(it.g)}
    <p>${it.how}</p>
    <span class="more">${trSel===it.n?"Открыто выше ↑":"Подробнее →"}</span>
  </article>`).join("")}</div></section>`).join("")+
  `<section class="box"><h2>Тренировки и добавки</h2><ul class="nuance">${NU.map(([t,e])=>`<li><span>${t}</span><span class="ev">${e}</span></li>`).join("")}</ul></section></div>`;
  decorate(document.getElementById("train"));
}
function openTrain(name){trSel=name;renderTrain();const d=document.getElementById("tdet");if(d)d.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}
document.getElementById("train").addEventListener("click",ev=>{
  const n=ev.target.closest("[data-n]");if(n){showTab("graph");select({type:"node",id:n.dataset.n});stage.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});return}
  if(ev.target.closest("#trClose")){const was=trSel;trSel=null;renderTrain();const c=document.querySelector(`.card[data-name="${was}"]`);if(c)c.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});return}
  const c=ev.target.closest(".card");if(c){if(trSel===c.dataset.name){document.getElementById("tdet").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});return}openTrain(c.dataset.name)}
});
document.getElementById("train").addEventListener("keydown",ev=>{const c=ev.target.closest(".card");if(c&&(ev.key==="Enter"||ev.key===" ")){ev.preventDefault();openTrain(c.dataset.name)}});
renderTrain();

/* ---------- problems ---------- */
let probSel="pressure",probType="all";
const PG=[["life","Образ жизни и питание",["life","food","med"]],["train","Тренировки",["train"]],["supp","Добавки",["supp"]]];
function probItem(x,i,lead){const [t,title,txt,ev,ref]=x;
  return `<li class="pitem${lead?" lead3":""}"><span class="rk${i<3?" top":""}">${i+1}</span><div class="sc">${lead||t==="food"||t==="med"?`<span class="ptype" style="color:var(--pt-${t})">${PT[t]}</span>`:""}<b>${title}</b><span class="t">${txt}</span>${ref?`<button class="go" data-ref="${ref}">${ref[0]==="n"?"Открыть на карте →":"К тренировке →"}</button>`:""}</div><span class="ev">${ev}</span></li>`}
function renderProb(){
  document.getElementById("plist").innerHTML=PROB.map(p=>`<button class="pbtn" data-pr="${p.id}" aria-pressed="${p.id===probSel}">${p.t}<span>${p.items.length}</span></button>`).join("");
  const p=PROB.find(x=>x.id===probSel),idx=p.items.map((x,i)=>({x,i}));
  const body=document.getElementById("pbody");
  body.innerHTML=`<div><h2 class="big">${p.t}</h2><p class="lead">${p.intro}</p></div>
    <div class="pinfo">
      ${p.causes?`<section class="pcard"><h4>Почему так бывает</h4><ul class="causes">${p.causes.map(c=>`<li>${c}</li>`).join("")}</ul></section>`:""}
      <section class="pcard check"><h4>Сначала проверь</h4><p>${p.check}</p></section>
    </div>
    <section class="top3"><h3>Главное — начни с этого</h3><ol>${idx.slice(0,3).map(o=>probItem(o.x,o.i,true)).join("")}</ol></section>
    ${p.nuance?`<div class="box nu"><h3>${p.nuance.t}</h3><ul>${p.nuance.rows.map(([a,b],i)=>`<li${i===p.nuance.rows.length-1?' class="alarm"':""}><b>${a}</b><span>${b}</span></li>`).join("")}</ul></div>`:""}
    ${p.plan?`<section class="pplan"><h3>План на первый месяц</h3><ol>${p.plan.map(([w,t])=>`<li><span class="when">${w}</span><p>${t}</p></li>`).join("")}</ol></section>`:""}
    <div class="groups"><div><h3>Все меры по группам</h3><p class="kind">Номер — место по пользе среди всех мер этой проблемы.</p></div>
    ${PG.map(([k,name,types])=>{const its=idx.filter(o=>types.includes(o.x[0]));if(!its.length)return"";
      return `<section class="grp" style="--gc:var(--pt-${k})"><h3><span class="gdot" style="background:var(--pt-${k})"></span>${name}<span class="cnt">${its.length}</span></h3><ol>${its.map(o=>probItem(o.x,o.i)).join("")}</ol></section>`}).join("")}</div>
    ${p.missing.length?`<div class="box miss"><h3>Чего пока нет на карте</h3><ul>${p.missing.map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join("")}</ul></div>`:""}`;
  decorate(body);
}
document.getElementById("plist").addEventListener("click",ev=>{const b=ev.target.closest("[data-pr]");if(!b)return;probSel=b.dataset.pr;probType="all";renderProb();
  if(matchMedia("(max-width:860px)").matches)document.getElementById("pbody").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});
document.getElementById("pbody").addEventListener("click",ev=>{
  const t=ev.target.closest("[data-pt]");if(t){probType=t.dataset.pt;renderProb();return}
  const g=ev.target.closest("[data-ref]");if(!g)return;const r=g.dataset.ref,key=r.slice(2);
  if(r[0]==="n"){showTab("graph");select({type:"node",id:key});stage.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}
  else{showTab("train");openTrain(key)}
});
renderProb();

/* ---------- tabs ---------- */
function onResize(){if(!stage.clientWidth)return;const [ow,oh]=measure();if(ow===W&&oh===H)return;
  N.forEach(n=>{n.x=n.x*W/ow;n.y=n.y*H/oh});buildNodes();applyView();render();heat(.2)}
let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(onResize,150)});
const TABS=["graph","links","prob","plan","train","notes"];
function showTab(w){TABS.forEach(t=>{document.getElementById("view-"+t).hidden=t!==w;document.getElementById("tab-"+t).setAttribute("aria-selected",t===w)});if(w==="graph"){onResize();applyView()}}
TABS.forEach(t=>document.getElementById("tab-"+t).addEventListener("click",()=>{showTab(t);window.scrollTo({top:0})}));
if(location.hash==="#plan")showTab("plan");
if(location.hash==="#links")showTab("links");
if(location.hash==="#problems")showTab("prob");
if(location.hash==="#train")showTab("train");

const qIn=document.getElementById("q"),qCount=document.getElementById("qcount");
const qClear=document.getElementById("qclear");
function setQ(v){qIn.value=v;state.q=v;state.sel=null;state.help=false;state.panelOff=false;const M=matches();qCount.textContent=M?`${M.size}`:"";qClear.hidden=!v;applyView();renderNote()}
qIn.addEventListener("input",()=>setQ(qIn.value));
qClear.addEventListener("click",()=>{setQ("");qIn.focus()});
document.querySelectorAll(".shw").forEach(b=>b.addEventListener("click",()=>{state.show=b.dataset.s;document.querySelectorAll(".shw").forEach(x=>x.setAttribute("aria-pressed",x===b));applyView()}));
document.getElementById("mineBtn").addEventListener("click",()=>{state.mine=!state.mine;state.sel=null;state.help=false;state.panelOff=false;state.goal=null;
  goalRow.querySelectorAll(".goal").forEach(x=>x.setAttribute("aria-pressed",x.dataset.g===""));applyView();renderNote()});
qIn.addEventListener("keydown",ev=>{if(ev.key==="Enter"){const M=matches();if(M&&M.size){ev.preventDefault();select({type:"node",id:[...M][0]})}}
  if(ev.key==="Escape")setQ("")});

document.getElementById("mapHelp").addEventListener("click",()=>{state.help=!state.help||!!state.sel;state.sel=null;state.panelOff=false;applyView();renderNote()});
document.addEventListener("keydown",ev=>{if(ev.key!=="Escape"||document.activeElement===qIn)return;
  if(note.classList.contains("open")||state.sel||state.goal){state.panelOff=true;resetView()}});
document.getElementById("mapBack").addEventListener("click",resetView);

{const m=location.hash.match(/^#([sg])-(.+)$/);if(m){if(m[1]==="s"&&byId[m[2]])state.sel={type:"node",id:m[2]};else if(m[1]==="g"&&G[m[2]])state.goal=m[2]}}
applyView();renderNote();
(function(){const w=document.getElementById("welcome"),KEY="sw-welcome-v1";let seen=false;try{seen=!!localStorage.getItem(KEY)}catch(_){}
  if(seen&&!/[?&]welcome\b/.test(location.search))return;
  const base=STACKS.find(x=>x.id==="base");
  document.getElementById("wList").innerHTML=[["Что для чего",`${N.filter(n=>n.g.length).length} добавки по ${RING.length} целям, с пометкой, где данные сильные, а где слабые`],["Что с чем",`${E.length} связей: что усиливает друг друга и что надо разносить по времени`],["Когда принимать","расписание на день под твой набор"]].map(([a,b])=>`<li><span><b>${a}.</b> ${b}</span></li>`).join("");
  document.getElementById("wBase").textContent=base.items.map(x=>byId[x[0]].en).join(", ")+". Закрывает самые частые дефициты; дальше набор можно менять под себя.";
  const close=()=>{w.hidden=true;try{localStorage.setItem(KEY,"1")}catch(_){}};
  document.getElementById("wAdd").addEventListener("click",()=>{picked.add("base");save();renderPlan();applyView();close()});
  document.getElementById("wSkip").addEventListener("click",close);
  w.addEventListener("keydown",ev=>{if(ev.key==="Escape")close()});
  w.hidden=false;document.getElementById("wSkip").focus()})();
