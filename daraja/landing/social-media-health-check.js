// Set by the production build when a WhatsApp contact number is configured.
var BRAND = "Daraja";
var WHATSAPP = "";
var CATS = [
  {k:"Profile & brand",w:10,i:"👤",tip:"Rewrite your bio to say what you sell, where, and for whom. Add a working link or WhatsApp button and use a real logo as your avatar.",q:[
    ["Your bio clearly says what you offer, where, and who it’s for.",["Not at all","Vaguely","Mostly","Crystal clear"]],
    ["Your profile has a working link or contact button.",["No link","Link, not tracked","Link that works","Tracked link/WhatsApp"]],
    ["Your avatar and name match your brand across every platform.",["No two match","Some match","Mostly match","Fully consistent"]]]},
  {k:"Content",w:25,i:"🎬",tip:"Move from static posts to short video with a 2-second hook. Plan three pillars: education, proof, and offers, then reuse every project as content.",q:[
    ["What share of your posts are short video?",["None","Under 25%","25-60%","Over 60%"]],
    ["Do your posts open with a strong hook in the first 2 seconds?",["Never","Rarely","Often","Almost always"]],
    ["You publish proof: testimonials, results, case studies.",["Never","Once in a while","Monthly","Weekly"]]]},
  {k:"Performance",w:20,i:"📈",tip:"Post at least 3 times a week for 30 days, then review top posts and double down on what earns saves, shares, and watch time.",q:[
    ["How often do you post?",["Under once a month","Monthly","Weekly","3+ times a week"]],
    ["Your follower count over the last 90 days is…",["Falling","Flat","Growing slowly","Growing steadily"]],
    ["Typical post reach compared to your follower count?",["Under 5%","5-15%","15-40%","Over 40%"]]]},
  {k:"Audience",w:15,i:"🎯",tip:"Check your analytics: if followers don’t match your ideal buyer’s age, place, and interests, adjust your topics and tags to attract the right people.",q:[
    ["You know the age, gender, and location of your followers.",["No idea","Roughly","Checked once","Reviewed monthly"]],
    ["Most followers are in your target market and buyer group.",["Few are","Some","Most","Nearly all"]],
    ["You answer common audience questions in your content.",["Never","Rarely","Sometimes","Regularly"]]]},
  {k:"Conversion",w:20,i:"💬",tip:"Use one clear call to action per post, reply to every comment and DM within hours, and track leads from post to quote to sale.",q:[
    ["How fast do you reply to comments and DMs?",["Days or never","Within a day","Within hours","Within the hour"]],
    ["Every post has one clear call to action.",["None","Some","Most","All"]],
    ["You track where leads come from.",["Not at all","Memory","Spreadsheet","CRM or tagged links"]]]},
  {k:"Discoverability",w:10,i:"🔍",tip:"Put the words buyers search for (product, price, city) in captions, on-screen text, and speech. Add location tags and a few specific hashtags.",q:[
    ["Captions and on-screen text include keywords buyers search.",["No","Sometimes","Often","Always"]],
    ["You use location tags and focused hashtags.",["Neither","One of them","Both, occasionally","Both, consistently"]],
    ["You publish price or “how much does it cost” content.",["Never","Once","Occasionally","Regularly"]]]}
];
var A = [];
var step = -1;
var app = document.getElementById("app");
CATS.forEach(function(){A.push([null,null,null])});

function intro(){
  app.innerHTML='<span class="pill">FREE · 3 MINUTES</span><h1>How healthy is your social media?</h1><p class="mut">Answer 18 quick questions across 6 areas and get your score, a breakdown, and the three fixes that will move the needle most.</p><button class="btn" data-action="start">Start the check</button>';
}
function go(n){step=n;n>=CATS.length?result():ask()}
function ask(){
  var c=CATS[step],h='<progress class="bar" max="'+CATS.length+'" value="'+step+'" aria-label="Assessment progress"></progress><span class="pill">'+(step+1)+' / '+CATS.length+'</span><h2>'+c.i+' '+c.k+'</h2>';
  c.q.forEach(function(q,qi){
    h+='<div class="q"><p>'+q[0]+'</p><div class="opts">';
    q[1].forEach(function(o,oi){h+='<button class="opt'+(A[step][qi]===oi?' on':'')+'" data-action="pick" data-question="'+qi+'" data-option="'+oi+'">'+o+'</button>'});
    h+='</div></div>'});
  h+='<div class="nav"><button class="btn ghost" data-action="back">Back</button><button class="btn" data-action="next" '+(A[step].indexOf(null)>-1?'disabled':'')+'>'+(step===CATS.length-1?'See my score':'Next')+'</button></div>';
  app.innerHTML=h;
}
function pick(q,o){A[step][q]=o;ask()}
function pct(i){return A[i].reduce(function(a,b){return a+b},0)/9}
function col(p){return p>=.7?"var(--ok)":p>=.4?"var(--warn)":"var(--bad)"}
function level(p){return p>=.7?"good":p>=.4?"warn":"bad"}
function result(){
  var tot=0,rows=[];
  CATS.forEach(function(c,i){var p=pct(i);tot+=p*c.w;rows.push({c:c,p:p})});
  var s=Math.round(tot),g=s>=85?["Authority","You’re running a strong, conversion-ready account."]:s>=70?["Growth-ready","Solid base. A few tweaks will unlock real leads."]:s>=50?["Leaking leads","People find you, but too many slip away."]:s>=30?["Needs a reset","The fundamentals need rebuilding before you scale."]:["Starting line","Great news: every fix will show quickly."];
  var h='<div class="center"><span class="pill">YOUR RESULT</span><div class="ring"><svg viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="86" fill="none" stroke="var(--line)" stroke-width="16"/><circle id="arc" class="score-arc" cx="100" cy="100" r="86" fill="none" stroke="'+col(s/100)+'" stroke-width="16" stroke-linecap="round" stroke-dasharray="0 540" transform="rotate(-90 100 100)"/></svg><b>'+s+'<small>out of 100</small></b></div><h1>'+g[0]+'</h1><p class="mut">'+g[1]+'</p></div>';
  h+='<div class="chart center">'+radar(rows)+'</div><h2>Score by area</h2>';
  rows.forEach(function(r){h+='<div class="row"><div><span>'+r.c.i+' '+r.c.k+'</span><span>'+Math.round(r.p*100)+'%</span></div><div class="t"><progress class="f f--'+level(r.p)+'" max="100" value="0" data-w="'+Math.round(r.p*100)+'" aria-label="'+r.c.k+' score"></progress></div></div>'});
  var w=rows.slice().sort(function(a,b){return a.p*a.c.w-b.p*b.c.w}).slice(0,3);
  h+='<h2 class="fix-heading">Your top 3 fixes</h2>';
  w.forEach(function(r,i){h+='<div class="fix"><b>'+(i+1)+'. '+r.c.k+' ('+Math.round(r.p*100)+'%)</b><span class="mut">'+r.c.tip+'</span></div>'});
  var msg=encodeURIComponent("Hi "+BRAND+", I scored "+s+"/100 ("+g[0]+") on your Social Media Health Check. Weakest areas: "+w.map(function(r){return r.c.k}).join(", ")+". Can you help?");
  var action=WHATSAPP?'<a class="btn" href="https://wa.me/'+WHATSAPP+'?text='+msg+'" target="_blank" rel="noopener">Get my free action plan</a>':'<a class="btn" href="/daraja/contact/">Talk to Daraja</a>';
  h+='<div class="center result-actions">'+action+' <button class="btn ghost" data-action="retake">Retake</button></div>';
  app.innerHTML=h;
  setTimeout(function(){document.getElementById("arc").setAttribute("stroke-dasharray",(s/100*540)+" 540");document.querySelectorAll(".f").forEach(function(e){e.value=Number(e.dataset.w)})},60);
}
function radar(rows){
  var n=rows.length,cx=150,cy=140,R=95,pts=[],grid="",lab="";
  for(var r=1;r<=4;r++){var p=[];for(var i=0;i<n;i++){var a=i/n*2*Math.PI-Math.PI/2;p.push((cx+R*r/4*Math.cos(a)).toFixed(1)+","+(cy+R*r/4*Math.sin(a)).toFixed(1))}grid+='<polygon points="'+p.join(" ")+'" fill="none" stroke="var(--line)"/>'}
  rows.forEach(function(x,i){var a=i/n*2*Math.PI-Math.PI/2;pts.push((cx+R*Math.max(x.p,.04)*Math.cos(a)).toFixed(1)+","+(cy+R*Math.max(x.p,.04)*Math.sin(a)).toFixed(1));lab+='<text x="'+(cx+(R+24)*Math.cos(a)).toFixed(1)+'" y="'+(cy+(R+20)*Math.sin(a)+4).toFixed(1)+'" text-anchor="middle" font-size="11" fill="var(--mut)">'+x.c.i+' '+x.c.k.split(" ")[0]+'</text>'});
  return '<svg class="chart-svg" viewBox="0 0 300 290" width="100%">'+grid+'<polygon points="'+pts.join(" ")+'" fill="rgba(255,90,54,.25)" stroke="var(--acc)" stroke-width="2"/>'+lab+'</svg>';
}
function again(){A=[];CATS.forEach(function(){A.push([null,null,null])});intro()}
app.addEventListener("click",function(event){
  var button=event.target.closest("button[data-action]");
  if(!button||button.disabled)return;
  switch(button.dataset.action){
    case "start":go(0);break;
    case "pick":pick(Number(button.dataset.question),Number(button.dataset.option));break;
    case "back":if(step>0)go(step-1);else{step=-1;intro()}break;
    case "next":go(step+1);break;
    case "retake":again();break;
  }
});
intro();
