(function(){
var T={en:{add:"Add",added:"Added",item:"item",items:"items",empty:"Your request list is empty.",total:"Total",remove:"Remove",onreq:"On request",subject:"Spa request",hello:"Hello, I would like to request the following:",name:"Name",date:"Preferred date",time:"Preferred time",notes:"Notes"},
tr:{add:"Ekle",added:"Eklendi",item:"hizmet",items:"hizmet",empty:"Talep listeniz boş.",total:"Toplam",remove:"Kaldır",onreq:"Fiyat için sorunuz",subject:"Spa talebi",hello:"Merhaba, aşağıdaki spa hizmetlerini talep etmek istiyorum:",name:"Ad soyad",date:"Tercih edilen tarih",time:"Tercih edilen saat",notes:"Notlar"}};
var lang=document.documentElement.lang==="tr"?"tr":"en",L=T[lang];
function key(s){return "ss-request-"+s}
function load(s){try{return JSON.parse(localStorage.getItem(key(s))||"[]")}catch(e){return[]}}
function save(s,l){try{localStorage.setItem(key(s),JSON.stringify(l))}catch(e){}}
function money(c,n){return c+new Intl.NumberFormat(lang==="tr"?"tr-TR":"en-US",{maximumFractionDigits:2}).format(n)}
function sum(l){return l.reduce(function(a,x){return a+(x.price||0)},0)}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function paint(){
document.querySelectorAll("[data-add]").forEach(function(b){var on=load(b.dataset.spa).some(function(x){return x.id===b.dataset.id});b.classList.toggle("on",on);b.textContent=on?L.added:L.add;b.setAttribute("aria-pressed",String(on))});
document.querySelectorAll("[data-cart]").forEach(function(bar){var l=load(bar.dataset.cart);bar.hidden=!l.length;bar.querySelector(".n").textContent=l.length+" "+(l.length===1?L.item:L.items)+" · "+money(bar.dataset.cur,sum(l))});
var r=document.getElementById("request");if(r)request(r)}
function request(r){var d=r.dataset,l=load(d.spa),box=r.querySelector(".list");
box.innerHTML=l.length?l.map(function(x,i){return '<div class="row"><div><strong>'+esc(x.title)+'</strong><p class="meta">'+esc(x.dur)+'</p></div><span class="price">'+(x.price===null?L.onreq:money(d.cur,x.price))+'</span><button class="rm" data-rm="'+i+'" aria-label="'+L.remove+'">×</button></div>'}).join("")+'<div class="row"><div><strong>'+L.total+'</strong></div><span class="price">'+money(d.cur,sum(l))+'</span></div>':'<p class="meta" style="padding:14px 0">'+L.empty+'</p>';
r.querySelectorAll("[data-send]").forEach(function(b){b.hidden=!l.length})}
function body(r){var d=r.dataset,l=load(d.spa),f=function(n){var el=r.querySelector('[name="'+n+'"]');return el?el.value.trim():""};
var lines=[L.hello,""].concat(l.map(function(x){return "- "+x.title+(x.dur?" ("+x.dur+")":"")+" · "+(x.price===null?L.onreq:money(d.cur,x.price))}));
lines.push("",L.total+": "+money(d.cur,sum(l)),"");
[["name",L.name],["date",L.date],["time",L.time],["notes",L.notes]].forEach(function(p){if(f(p[0]))lines.push(p[1]+": "+f(p[0]))});
return lines.join("\n")}
document.addEventListener("click",function(e){
var b=e.target.closest("[data-add]");
if(b){e.preventDefault();var s=b.dataset.spa,l=load(s),i=l.findIndex(function(x){return x.id===b.dataset.id});
if(i>=0)l.splice(i,1);else l.push({id:b.dataset.id,title:b.dataset.title,price:b.dataset.price?Number(b.dataset.price):null,dur:b.dataset.dur||""});save(s,l);paint();return}
var rm=e.target.closest("[data-rm]");
if(rm){var r=document.getElementById("request"),l2=load(r.dataset.spa);l2.splice(Number(rm.dataset.rm),1);save(r.dataset.spa,l2);paint();return}
var m=e.target.closest("[data-mail]");
if(m){var rq=document.getElementById("request");m.href="mailto:"+rq.dataset.email+"?subject="+encodeURIComponent(L.subject+" · "+rq.dataset.name)+"&body="+encodeURIComponent(body(rq))}});
addEventListener("pageshow",paint);paint()})();