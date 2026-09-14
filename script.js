const CONFIG={
  api:"https://hero-rift-online.angeloslzxp.workers.dev",
  manifest:"/v1/update/manifest",
  package:"/v1/update/package?key=",
  launcher:"https://github.com/angeloslzxp-lab/hero-rift-updates/releases/latest/download/HeroRift-Launcher.zip",\n  rankings:"https://hero-rift-online.angeloslzxp.workers.dev/v1/rankings?type=level&limit=10"
};

const classes={
  barbaro:{name:"Bárbaro",role:"Força · Fúria · Impacto",description:"Avance sem medo e transforme cada golpe em uma onda de destruição. O Bárbaro domina o combate próximo e fica mais perigoso quando cercado.",skills:["Ruptura","Salto brutal","Fúria ancestral"],emblem:"ᚦ",weapon:"⚔",stats:[94,58,70]},
  mago:{name:"Mago",role:"Arcano · Controle · Explosão",description:"Dobre os elementos e controle o campo de batalha à distância. O Mago combina ataques poderosos com barreiras e efeitos em grandes áreas.",skills:["Orbe arcano","Nova glacial","Tempestade astral"],emblem:"ᛉ",weapon:"✦",stats:[88,93,55]},
  necromante:{name:"Necromante",role:"Invocação · Maldição · Drenagem",description:"Comande criaturas da Fenda e desgaste seus inimigos com magia sombria. Cada servo transforma o campo em um exército particular.",skills:["Erguer servo","Lança sombria","Exército profano"],emblem:"ᛟ",weapon:"☠",stats:[79,96,47]},
  arqueiro:{name:"Arqueiro",role:"Precisão · Agilidade · Crítico",description:"Ataque antes de ser alcançado. O Arqueiro combina disparos múltiplos, armadilhas e mobilidade para dominar qualquer distância.",skills:["Rajada tripla","Salto evasivo","Chuva de flechas"],emblem:"ᛏ",weapon:"➳",stats:[85,68,98]}
};

let ranking=[
  {name:"Ashen",class:"Bárbaro",level:42,power:18420,time:"38h 12m",icon:"ᚦ"},
  {name:"Nyxara",class:"Necromante",level:40,power:17980,time:"36h 48m",icon:"ᛟ"},
  {name:"Vhalor",class:"Mago",level:39,power:17210,time:"34h 05m",icon:"ᛉ"},
  {name:"Elyndra",class:"Arqueiro",level:37,power:16670,time:"31h 44m",icon:"ᛏ"},
  {name:"Dravenor",class:"Bárbaro",level:35,power:15890,time:"29h 20m",icon:"ᚦ"},
  {name:"Morrigan",class:"Mago",level:33,power:14950,time:"27h 13m",icon:"ᛉ"}
];

document.querySelector("#year").textContent=new Date().getFullYear();

const header=document.querySelector(".site-header");
const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
const setHeader=()=>header.classList.toggle("scrolled",scrollY>20);
setHeader();addEventListener("scroll",setHeader,{passive:true});
toggle.addEventListener("click",()=>{
  const open=!nav.classList.contains("open");
  nav.classList.toggle("open",open);toggle.setAttribute("aria-expanded",open);
  document.body.classList.toggle("menu-open",open);
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");document.body.classList.remove("menu-open");
}));

const sections=[...document.querySelectorAll("main section[id]")];
const navLinks=[...document.querySelectorAll(".nav a:not(.nav-download)")];
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));
    }
  });
},{rootMargin:"-40% 0px -50%",threshold:0});
sections.forEach(section=>sectionObserver.observe(section));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach((entry,index)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add("visible"),index*55);
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const classEls={
  role:document.querySelector("#classRole"),name:document.querySelector("#className"),
  description:document.querySelector("#classDescription"),skills:document.querySelector("#classSkills"),
  emblem:document.querySelector("#classEmblem"),weapon:document.querySelector("#classWeapon"),
  stats:[document.querySelector("#statPower"),document.querySelector("#statControl"),document.querySelector("#statMobility")]
};
document.querySelectorAll(".class-tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".class-tab").forEach(t=>t.classList.toggle("active",t===tab));
  const data=classes[tab.dataset.class];
  classEls.weapon.style.transform="scale(.75) rotate(-8deg)";
  setTimeout(()=>{
    classEls.role.textContent=data.role;classEls.name.textContent=data.name;classEls.description.textContent=data.description;
    classEls.emblem.textContent=data.emblem;classEls.weapon.textContent=data.weapon;
    classEls.skills.innerHTML=data.skills.map(s=>"<span><i>◆</i> "+s+"</span>").join("");
    classEls.stats.forEach((el,i)=>el.style.width=data.stats[i]+"%");
    classEls.weapon.style.transform="";
  },170);
}));

const body=document.querySelector("#rankBody");
const empty=document.querySelector("#emptyRank");
function renderRank(){
  const query=document.querySelector("#rankSearch").value.trim().toLowerCase();
  const selected=document.querySelector("#rankClass").value;
  const filtered=ranking.filter(p=>(selected==="all"||p.class===selected)&&p.name.toLowerCase().includes(query));
  body.innerHTML=filtered.map(p=>{
    const original=ranking.indexOf(p)+1;
    return '<tr class="'+(original<=3?"top-rank":"")+'"><td>'+String(original).padStart(2,"0")+'</td><td><span class="hero-cell"><i class="avatar">'+p.icon+'</i>'+p.name+'</span></td><td><span class="class-pill">'+p.class+'</span></td><td>'+p.level+'</td><td class="power">'+p.power.toLocaleString("pt-BR")+'</td><td>'+p.time+'</td></tr>';
  }).join("");
  empty.hidden=filtered.length>0;
}
renderRank();
document.querySelector("#rankSearch").addEventListener("input",renderRank);
document.querySelector("#rankClass").addEventListener("change",renderRank);

function normalizeClass(value){
  const key=String(value||"").toLowerCase();
  if(key.includes("barb"))return "Bárbaro";
  if(key.includes("mage")||key.includes("mago"))return "Mago";
  if(key.includes("necro"))return "Necromante";
  if(key.includes("arch")||key.includes("arque"))return "Arqueiro";
  return value||"Aventureiro";
}
function classIcon(value){
  return {"Bárbaro":"ᚦ","Mago":"ᛉ","Necromante":"ᛟ","Arqueiro":"ᛏ"}[value]||"◆";
}
async function loadRanking(){
  const status=document.querySelector(".rank-status span");
  const detail=document.querySelector(".rank-status small");
  try{
    const response=await fetch(CONFIG.rankings,{headers:{Accept:"application/json"},cache:"no-store"});
    if(!response.ok)throw new Error("ranking");
    const payload=await response.json();
    const rows=Array.isArray(payload)?payload:(payload.rankings||payload.players||payload.data||payload.results||[]);
    if(!Array.isArray(rows))throw new Error("formato");
    ranking=rows.map((item,index)=>{
      const className=normalizeClass(item.class_name||item.class||item.character_class||item.hero_class);
      return {
        name:item.character_name||item.player_name||item.username||item.name||("Herói "+(index+1)),
        class:className,
        level:Number(item.level||item.character_level||0),
        power:Number(item.power||item.combat_power||item.score||item.xp||0),
        time:item.play_time||item.playtime||item.time_played||"—",
        icon:classIcon(className)
      };
    });
    status.innerHTML="<i></i> Ranking online";
    detail.textContent="Dados oficiais · Top 10 por nível";
  }catch(error){
    status.innerHTML="<i></i> Ranking temporariamente offline";
    detail.textContent="Exibindo uma prévia até a API responder";
  }
  renderRank();
}
function setupDownload(){
  const button=document.querySelector("#downloadButton");
  const version=document.querySelector("#downloadVersion");
  const note=document.querySelector("#downloadNote");
  button.href=CONFIG.launcher;
  version.textContent="LAUNCHER OFICIAL";
  note.textContent="Download direto · atualizações automáticas incluídas";
}
setupDownload();
loadRanking();

const canvas=document.querySelector("#embers");
const ctx=canvas.getContext("2d");
let particles=[],raf;
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
function resetParticle(p,first=false){p.x=Math.random()*innerWidth;p.y=first?Math.random()*innerHeight:innerHeight+15;p.r=Math.random()*1.5+.3;p.vy=Math.random()*.45+.12;p.vx=(Math.random()-.5)*.25;p.a=Math.random()*.45+.1;return p}
function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of particles){p.y-=p.vy;p.x+=p.vx;p.a*=.999;if(p.y<-10||p.a<.03)resetParticle(p);ctx.beginPath();ctx.fillStyle="rgba(235,91,36,"+p.a+")";ctx.shadowBlur=8;ctx.shadowColor="#d84b1e";ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(animate)}
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){resize();particles=Array.from({length:Math.min(70,Math.floor(innerWidth/18))},()=>resetParticle({},true));animate();addEventListener("resize",resize)}
