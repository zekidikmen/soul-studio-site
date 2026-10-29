(function(){
var T={en:{add:"Add",added:"Added",addMain:"Add to request",addedMain:"Added to request",item:"item",items:"items",total:"Total",remove:"Remove",onreq:"On request",onreqN:"on request",subject:"Spa request",hello:"Hello, I would like to request the following:",name:"Name",date:"Preferred date",time:"Preferred time",notes:"Notes"},
tr:{add:"Ekle",added:"Eklendi",addMain:"Talebe ekle",addedMain:"Talebe eklendi",item:"hizmet",items:"hizmet",total:"Toplam",remove:"Kaldır",onreq:"Fiyat için sorunuz",onreqN:"fiyatı sorulacak",subject:"Spa talebi",hello:"Merhaba, aşağıdaki spa hizmetlerini talep etmek istiyorum:",name:"Ad soyad",date:"Tercih edilen tarih",time:"Tercih edilen saat",notes:"Notlar"}};
var lang=document.documentElement.lang==="tr"?"tr":"en",L=T[lang];
function key(s){return "ss-request-"+s}
function load(s){try{return JSON.parse(localStorage.getItem(key(s))||"[]")}catch(e){return[]}}
function save(s,l){try{localStorage.setItem(key(s),JSON.stringify(l))}catch(e){}}
function money(c,n){return c+new Intl.NumberFormat(lang==="tr"?"tr-TR":"en-US",{maximumFractionDigits:2}).format(n)}
function sum(l){return l.reduce(function(a,x){return a+(x.price||0)},0)}
function total(c,l){var n=l.filter(function(x){return x.price===null}).length,priced=l.length-n;if(!n)return money(c,sum(l));return (priced?money(c,sum(l))+" + ":"")+n+" "+L.onreqN}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function paint(){
document.querySelectorAll("[data-add]").forEach(function(b){var on=load(b.dataset.spa).some(function(x){return x.id===b.dataset.id}),main=b.classList.contains("main");b.classList.toggle("on",on);b.textContent=main?(on?L.addedMain:L.addMain):(on?L.added:L.add);b.setAttribute("aria-pressed",String(on))});
document.querySelectorAll("[data-cart]").forEach(function(bar){var l=load(bar.dataset.cart);bar.hidden=!l.length;bar.querySelector(".n").textContent=l.length+" "+(l.length===1?L.item:L.items)+" · "+total(bar.dataset.cur,l)});
var r=document.getElementById("request");if(r)request(r)}
function request(r){var d=r.dataset,l=load(d.spa),box=r.querySelector(".list"),sent=r.querySelector("[data-sent]");
box.innerHTML=l.map(function(x,i){return '<div class="row"><div><strong>'+esc(x.title)+'</strong>'+(x.dur?'<p class="meta">'+esc(x.dur)+'</p>':'')+'</div><span class="price">'+(x.price===null?L.onreq:money(d.cur,x.price))+'</span><button class="rm" type="button" data-rm="'+i+'" aria-label="'+L.remove+': '+esc(x.title)+'">×</button></div>'}).join("")+(l.length?'<div class="row"><div><strong>'+L.total+'</strong></div><span class="price">'+total(d.cur,l)+'</span></div>':'');
box.hidden=!l.length;
r.querySelectorAll("[data-needs]").forEach(function(el){el.hidden=!l.length||!sent.hidden});
r.querySelectorAll("[data-empty]").forEach(function(el){el.hidden=!!l.length})}
function body(r){var d=r.dataset,l=load(d.spa),f=function(n){var el=r.querySelector('[name="'+n+'"]');return el?el.value.trim():""};
var lines=[L.hello,""].concat(l.map(function(x){return "- "+x.title+(x.dur?" ("+x.dur+")":"")+" · "+(x.price===null?L.onreq:money(d.cur,x.price))}));
lines.push("",L.total+": "+total(d.cur,l),"");
[["name",L.name],["date",L.date],["time",L.time],["notes",L.notes]].forEach(function(p){if(f(p[0]))lines.push(p[1]+": "+f(p[0]))});
return lines.join("\n")}
function showSent(r,on){var s=r.querySelector("[data-sent]");s.hidden=!on;request(r);if(on){var h=s.querySelector("h2");if(h){h.setAttribute("tabindex","-1");h.focus()}}}
document.addEventListener("click",function(e){
var b=e.target.closest("[data-add]");
if(b){e.preventDefault();var s=b.dataset.spa,l=load(s),i=l.findIndex(function(x){return x.id===b.dataset.id});
if(i>=0)l.splice(i,1);else l.push({id:b.dataset.id,title:b.dataset.title,price:b.dataset.price?Number(b.dataset.price):null,dur:b.dataset.dur||""});save(s,l);paint();return}
var r=document.getElementById("request");if(!r)return;
var rm=e.target.closest("[data-rm]");
if(rm){var l2=load(r.dataset.spa);l2.splice(Number(rm.dataset.rm),1);save(r.dataset.spa,l2);paint();return}
var m=e.target.closest("[data-mail]");
if(m){m.href="mailto:"+r.dataset.email+"?subject="+encodeURIComponent(L.subject+" · "+r.dataset.name)+"&body="+encodeURIComponent(body(r));setTimeout(function(){showSent(r,true)},300);return}
if(e.target.closest("[data-clear]")){save(r.dataset.spa,[]);showSent(r,false);paint();return}
if(e.target.closest("[data-keep]")){showSent(r,false);return}});
addEventListener("pageshow",paint);paint()})();