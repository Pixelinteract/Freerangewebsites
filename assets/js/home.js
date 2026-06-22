/* ── HOME.JS — index.html only ───────────────────────────────────── */

/* ── HERO TESTIMONIAL TICKER ─────────────────── */
var heroTmCards=[
  {type:'photo',row:'a',url:'assets/images/dan-electrician.jpeg',alt:'Electrician',tall:false},
  {type:'quote',row:'a',size:'',av:'DM',ac:'#5a8a35',name:'Dan M.',role:'Bentleigh Electrics',hl:'1-2 new leads a week',qt:'"I was worried I would get garbage for $149/mo. Turns out these guys are really good."'},

  {type:'photo',row:'a',url:'assets/images/sarah-bookkeeper.jpeg',alt:'Sarah K. at her desk handling accounting paperwork for Practa Tax',tall:true},
  {type:'quote',row:'a',size:'wide',av:'SK',ac:'#7c5cbf',name:'Sarah K.',role:'Owner, Practa Tax · Clayton',hl:'Finally looks like a real business',qt:'"Paid an agency $5K for a site that looked like 2009. Free Range guys sorted me out in 9 days for a fraction."'},

  {type:'photo',row:'a',url:'assets/images/fishnchips-moorabbin.jpeg',alt:'The storefront of The Corals Fish \'N\' Chips shop with its main turquoise signage',tall:false},
  {type:'quote',row:'a',size:'',av:'MT',ac:'#fe9b24',name:'Mick T.',role:'Corals · Moorabbin',hl:null,qt:'"Calls from Google every week now. Pays for itself easily."'},

  {type:'photo',row:'b',url:'assets/images/sumi-lashplus.jpeg',alt:'Sumi, owner of Lash Plus Hair Carnegie, at the salon reception desk',tall:true},
  {type:'quote',row:'b',size:'wide',av:'S',ac:'#d4af37',name:'Sumi',role:'Lash Plus Hair Carnegie',hl:'Transformed my online presence completely',qt:'"I got a beautiful website where my customers can book appointments. Thank you, FRW"'},

  {type:'photo',row:'b',url:'assets/images/tony-builder.jpeg',alt:'Tony showing the website free range website made on his mobile phone.',tall:true},
  {type:'quote',row:'b',size:'',av:'TW',ac:'#3a7bd5',name:'Tony W.',role:'Partner, TW Builders · Melbourne',hl:null,qt:'"My website now shows up in Google Maps. The freelancer i worked with before didnt even bother"'},

  {type:'photo',row:'b',url:'assets/images/jake-driving-school.jpeg',alt:'Mahnoj got his license and is standing near Jake driving school car outside vicroads heatherton',tall:false},
  {type:'quote',row:'b',size:'',av:'JR',ac:'#e05c4b',name:'Jake R.',role:'Jake driving schools, Heatherton',hl:'No drama, just done',qt:'"The best thing is that I dont have to chase them and pay more money to update reviews on my site"'}
];

function buildHeroTmCard(d){
  var el=document.createElement('div');
  if(d.type==='photo'){
    el.className='htc';
    el.innerHTML='<img class="htc-photo'+(d.tall?' tall':'')+'" src="'+d.url+'" alt="'+d.alt+'" loading="lazy">';
  } else {
    el.className='htc htc-quote'+(d.size?' '+d.size:'');
    var hl=d.hl?'<div class="htc-hl">'+d.hl+'</div>':'';
    el.innerHTML='<div class="htc-head"><div class="htc-av" style="background:'+d.ac+'">'+d.av+'</div><div><div class="htc-nm">'+d.name+'</div><div class="htc-rl">'+d.role+'</div></div></div><div class="htc-stars">★★★★★</div>'+hl+'<div class="htc-qt">'+d.qt+'</div>';
  }
  return el;
}

var heroA=document.getElementById('heroTmA');
var heroB=document.getElementById('heroTmB');

function alternateRowData(rowId){
  var rowData=heroTmCards.filter(function(d){return d.row===rowId;});
  var photos=rowData.filter(function(d){return d.type==='photo';});
  var quotes=rowData.filter(function(d){return d.type==='quote';});
  var alternated=[];
  var maxLength=Math.max(photos.length,quotes.length);
  for(var i=0;i<maxLength;i++){
    if(i<photos.length)alternated.push(photos[i]);
    if(i<quotes.length)alternated.push(quotes[i]);
  }
  return alternated;
}

var setHA=alternateRowData('a');
var setHB=alternateRowData('b');
[].concat(setHA,setHA,setHA).forEach(function(d){if(heroA)heroA.appendChild(buildHeroTmCard(d));});
[].concat(setHB,setHB,setHB).forEach(function(d){if(heroB)heroB.appendChild(buildHeroTmCard(d));});

var hSpA=0.6,hSpB=0.38,hXA=0,hXB=0;
function animHeroTm(){
  hXA-=hSpA;hXB-=hSpB;
  if(heroA){var mA=heroA.scrollWidth/3;if(Math.abs(hXA)>=mA)hXA=0;heroA.style.transform='translateX('+hXA+'px)';}
  if(heroB){var mB=heroB.scrollWidth/3;if(Math.abs(hXB)>=mB)hXB=0;heroB.style.transform='translateX('+hXB+'px)';}
  requestAnimationFrame(animHeroTm);
}
if(heroA||heroB)animHeroTm();

/* ── SCROLL REVEAL ──────────────────────── */
var rvEls=document.querySelectorAll('.rv');
var rvObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');rvObs.unobserve(e.target);}
  });
},{threshold:0.08,rootMargin:'0px 0px -36px 0px'});
rvEls.forEach(function(el){rvObs.observe(el);});

/* ── FAQ ─────────────────────────────────── */
function toggleFaq(item){
  var isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(el){el.classList.remove('open');});
  if(!isOpen)item.classList.add('open');
}
