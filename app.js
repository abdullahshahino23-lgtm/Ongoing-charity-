const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const panel = $("#contentPanel"), panelTitle = $("#panelTitle"), panelContent = $("#panelContent");
const azkar = [
  {title:"أذكار الصباح", items:[
    ["أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ","مرة واحدة"],
    ["اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ","مرة واحدة"],
    ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ","١٠٠ مرة"]
  ]},
  {title:"أذكار المساء", items:[
    ["أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ","مرة واحدة"],
    ["أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ","٣ مرات"],
    ["أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ","حسب الاستطاعة"]
  ]},
  {title:"أذكار متنوعة", items:[
    ["سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ","ذكر"],
    ["اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ","ذكر"],
    ["رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ","دعاء قرآني"]
  ]}
];
const surahs = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
let tasbih = Number(localStorage.getItem("zad_tasbih") || 0);
const todayKey = new Date().toISOString().slice(0,10);
const AR_DIGITS="٠١٢٣٤٥٦٧٨٩";
const arNum=v=>String(v).replace(/\d/g,d=>AR_DIGITS[d]);
const arTime=hms=>arNum(hms);
const PRAYER_NAMES={Fajr:"الفجر",Sunrise:"الشروق",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const NEXT_PRAYER_KEYS=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const CITY_COORDS={"الرياض":[24.7136,46.6753],"جدة":[21.4858,39.1925],"مكة المكرمة":[21.3891,39.8579],"المدينة المنورة":[24.5247,39.5692],"الدمام":[26.4207,50.0888],"نجران":[17.4933,44.1277],"أبها":[18.2164,42.5053],"تبوك":[28.3998,36.5715],"بريدة":[26.3260,43.9750],"الطائف":[21.2703,40.4158],"القاهرة":[30.0444,31.2357],"عمّان":[31.9454,35.9284],"دبي":[25.2048,55.2708]};
const WINDS=["شمال","شمال شرق","شرق","جنوب شرق","جنوب","جنوب غرب","غرب","شمال غرب"];
let savedCity=localStorage.getItem("zad_city")||"الرياض";
let savedCountry=localStorage.getItem("zad_country")||"السعودية";
let prayerData=null;
let countdownTimer=null;
function parseHM(s){const m=String(s||"").match(/(\d{1,2}):(\d{2})/);return m?[Number(m[1]),Number(m[2])]:null;}
function nextPrayerInfo(){
  if(!prayerData)return null;
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  for(const key of NEXT_PRAYER_KEYS){
    const hm=parseHM(prayerData.timings[key]);if(!hm)continue;
    const d=new Date(today);d.setHours(hm[0],hm[1],0,0);
    if(d>now)return {name:PRAYER_NAMES[key],time:prayerData.timings[key],date:d,tomorrow:false};
  }
  const hm=parseHM(prayerData.timings.Fajr);if(!hm)return null;
  const d=new Date(today);d.setDate(d.getDate()+1);d.setHours(hm[0],hm[1],0,0);
  return {name:PRAYER_NAMES.Fajr,time:prayerData.timings.Fajr,date:d,tomorrow:true};
}
function fmtCountdown(ms){
  if(ms<0)ms=0;
  const s=Math.floor(ms/1000);
  const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;
  const pad=n=>String(n).padStart(2,"0");
  return arNum(`${pad(h)}:${pad(m)}:${pad(sec)}`);
}
function updateCountdown(){
  const el=$("#nextPrayerCountdown");
  const info=nextPrayerInfo();
  const text=info?("بعد "+fmtCountdown(info.date-new Date())):"—";
  if(el)el.textContent=text;
  const panelEl=$("#panelCountdown");
  if(panelEl)panelEl.textContent=text;
}
function renderHomePrayer(){
  const hijriEl=$("#hijriDate"),label=$("#nextPrayerLabel"),timeEl=$("#nextPrayerTime"),cityEl=$("#stripCity");
  if(!prayerData)return;
  const h=prayerData.hijri;
  hijriEl.textContent=`${arNum(h.day)} ${h.month.ar} ${arNum(h.year)}هـ — ${h.weekday.ar}`;
  cityEl.textContent=`${prayerData.city}، ${prayerData.country}`;
  const info=nextPrayerInfo();
  if(info){label.textContent="الصلاة القادمة: "+info.name+(info.tomorrow?" (غدًا)":"");timeEl.textContent=arTime(info.time);}
  else{label.textContent="الصلاة القادمة";timeEl.textContent="—";}
  updateCountdown();
  if(!countdownTimer)countdownTimer=setInterval(updateCountdown,1000);
}
async function fetchTimings(city,country){
  const url=`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`;
  const r=await fetch(url);
  if(!r.ok)throw Error("timings "+r.status);
  const j=await r.json();
  if(j.code!==200||!j.data||!j.data.timings)throw Error("timings bad data");
  return j.data;
}
async function loadHomePrayer(){
  const errEl=$("#stripError");
  try{
    const data=await fetchTimings(savedCity,savedCountry);
    prayerData={timings:data.timings,hijri:data.date.hijri,city:savedCity,country:savedCountry};
    if(errEl)errEl.hidden=true;
    renderHomePrayer();
    return true;
  }catch{
    if(errEl){errEl.hidden=false;errEl.textContent="تعذر تحميل مواقيت اليوم. تحقق من الاتصال بالإنترنت ثم اضغط «تحديث المواقيت».";}
    return false;
  }
}
async function fetchQibla(lat,lng,label){
  const text=$("#qiblaText"),needle=$("#qiblaNeedle");
  text.textContent="جارٍ حساب اتجاه القبلة…";
  try{
    const r=await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
    if(!r.ok)throw Error();
    const j=await r.json();
    if(j.code!==200||!j.data||typeof j.data.direction!=="number")throw Error();
    const dir=j.data.direction;
    const wind=WINDS[Math.round(dir/45)%8];
    text.textContent=`من ${label}: ${arNum(Math.round(dir))}° — ${wind}`;
    if(needle)needle.style.transform=`rotate(${dir}deg)`;
  }catch{
    text.textContent="تعذر حساب اتجاه القبلة. تحقق من الاتصال ثم أعد المحاولة.";
  }
}
function qiblaForCity(){
  const city=savedCity;
  const coords=CITY_COORDS[city];
  if(coords)fetchQibla(coords[0],coords[1],city);
  else if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
      pos=>fetchQibla(pos.coords.latitude,pos.coords.longitude,"موقعك الحالي"),
      ()=>{$("#qiblaText").textContent="مدينتك غير موجودة في القائمة. استخدم زر «موقعي الحالي» لتحديد الاتجاه من موقعك.";}
    );
  }else{$("#qiblaText").textContent="مدينتك غير موجودة في القائمة. استخدم زر «موقعي الحالي» لتحديد الاتجاه من موقعك.";}
}
function qiblaForGeolocation(){
  if(!("geolocation" in navigator)){$("#qiblaText").textContent="المتصفح لا يدعم تحديد الموقع.";return;}
  $("#qiblaText").textContent="جارٍ تحديد موقعك…";
  navigator.geolocation.getCurrentPosition(
    pos=>fetchQibla(pos.coords.latitude,pos.coords.longitude,"موقعك الحالي"),
    ()=>{$("#qiblaText").textContent="تعذر تحديد موقعك. تأكد من السماح بالوصول إلى الموقع ثم أعد المحاولة.";}
  );
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showPanel(title, html){panelTitle.textContent=title;panelContent.innerHTML=html;panel.hidden=false;panel.scrollIntoView({behavior:"smooth",block:"start"});}
function renderAzkar(){
  showPanel("الأذكار", `<div class="form-row">${azkar.map((z,i)=>`<button class="pill-btn azkar-tab" data-azkar="${i}">${z.title}</button>`).join("")}</div><div id="azkarItems" class="item-list" style="margin-top:14px"></div>`);
  const draw=(i)=>{$("#azkarItems").innerHTML=azkar[i].items.map(([txt,count])=>`<article class="list-item"><p>${txt}</p><small>${count}</small><div style="margin-top:10px"><button class="pill-btn copy-text" data-copy="${escapeHtml(txt)}">نسخ الذكر</button></div></article>`).join("");};
  $$(".azkar-tab").forEach(b=>b.addEventListener("click",()=>draw(Number(b.dataset.azkar))));
  draw(0);
}
function renderQuran(){
  showPanel("القرآن الكريم", `<p class="muted">اختر السورة لفتحها عبر مصدر القرآن الكريم الخارجي. يلزم اتصال بالإنترنت لعرض النص الكامل.</p><div class="form-row"><input id="surahSearch" placeholder="ابحث عن سورة..." aria-label="ابحث عن سورة"></div><div id="surahList" class="item-list" style="margin-top:14px"></div>`);
  const draw=(q="")=>{$("#surahList").innerHTML=surahs.map((name,i)=>({name,n:i+1})).filter(x=>x.name.includes(q)).map(x=>`<article class="list-item" style="display:flex;align-items:center;justify-content:space-between;gap:12px"><div><strong>${x.n}. سورة ${x.name}</strong><small>عرض النص من Quran.com</small></div><button class="pill-btn" data-surah="${x.n}">فتح السورة ↗</button></article>`).join("");};
  draw(); $("#surahSearch").addEventListener("input",e=>draw(e.target.value.trim()));
  $("#surahList").addEventListener("click",e=>{const b=e.target.closest("[data-surah]");if(b)window.open(`https://quran.com/${b.dataset.surah}`,"_blank","noopener");});
}
function renderTasbih(){
  showPanel("المسبحة الإلكترونية", `<div class="tasbih-wrap"><p class="muted">اضغط على المسبحة لزيادة العدد</p><div id="tasbihCount" class="tasbih-count">${tasbih}</div><button id="tasbihTap" class="tasbih-button" aria-label="زيادة التسبيح">سبّح الله</button><div><button id="tasbihReset" class="secondary-btn">إعادة التصفير</button><button id="tasbihPlus" class="secondary-btn">+1</button></div><small class="muted">يُحفظ العدد على هذا الجهاز.</small></div>`);
  const update=()=>{$("#tasbihCount").textContent=tasbih;localStorage.setItem("zad_tasbih",tasbih);};
  $("#tasbihTap").addEventListener("click",()=>{tasbih++;update();});
  $("#tasbihPlus").addEventListener("click",()=>{tasbih++;update();});
  $("#tasbihReset").addEventListener("click",()=>{if(confirm("هل تريد تصفير عداد التسبيح؟")){tasbih=0;update();}});
}
function drawPrayerResult(out,data,city,country){
  const t=data.timings;
  const keys=[["الفجر","Fajr"],["الشروق","Sunrise"],["الظهر","Dhuhr"],["العصر","Asr"],["المغرب","Maghrib"],["العشاء","Isha"]];
  const info=nextPrayerInfo();
  const nextLine=info?`<p class="next-prayer-line">الصلاة القادمة: <strong>${info.name}${info.tomorrow?" (غدًا)":""}</strong> — <span id="panelCountdown">${"بعد "+fmtCountdown(info.date-new Date())}</span></p>`:"";
  out.innerHTML=`<div class="prayer-grid">${keys.map(([ar,k])=>`<div class="prayer-time"><small>${ar}</small><strong>${arTime(t[k])}</strong></div>`).join("")}</div>${nextLine}<p class="muted">التاريخ الهجري: ${arNum(data.date.hijri.day)} ${data.date.hijri.month.ar} ${arNum(data.date.hijri.year)}هـ — ${escapeHtml(city)}، ${escapeHtml(country)}</p>`;
}
function renderPrayer(){
  showPanel("مواقيت الصلاة", `<p class="muted">اكتب اسم مدينة للحصول على مواقيت الصلاة من خدمة AlAdhan. يجب السماح بالاتصال بالإنترنت.</p><form id="prayerForm" class="form-row"><input id="cityInput" value="${escapeHtml(savedCity)}" placeholder="اسم المدينة" required><input id="countryInput" value="${escapeHtml(savedCountry)}" placeholder="الدولة" required><button class="pill-btn" type="submit">عرض المواقيت</button></form><div id="prayerResult" style="margin-top:14px"></div><small class="muted">تحقق من طريقة الحساب المعتمدة محليًا؛ قد تختلف المواقيت قليلًا حسب الجهة الرسمية.</small>`);
  const out=$("#prayerResult");
  const load=async(city,country)=>{
    out.textContent="جارٍ تحميل المواقيت…";
    try{
      const data=await fetchTimings(city,country);
      prayerData={timings:data.timings,hijri:data.date.hijri,city,country};
      savedCity=city;savedCountry=country;
      localStorage.setItem("zad_city",city);localStorage.setItem("zad_country",country);
      drawPrayerResult(out,data,city,country);
      renderHomePrayer();
    }catch{out.textContent="تعذر تحميل المواقيت. تحقق من اسم المدينة والاتصال بالإنترنت ثم أعد المحاولة.";}
  };
  $("#prayerForm").addEventListener("submit",e=>{e.preventDefault();load($("#cityInput").value.trim(),$("#countryInput").value.trim());});
  if(prayerData&&prayerData.city===savedCity&&prayerData.country===savedCountry){
    drawPrayerResult(out,{timings:prayerData.timings,date:{hijri:prayerData.hijri}},savedCity,savedCountry);
  }else{
    load(savedCity,savedCountry);
  }
}
function openView(view){if(view==="quran")renderQuran();if(view==="azkar")renderAzkar();if(view==="tasbih")renderTasbih();if(view==="prayer")renderPrayer();}
$$("[data-view]").forEach(el=>el.addEventListener("click",()=>openView(el.dataset.view)));
$("#closePanel").addEventListener("click",()=>{panel.hidden=true;});
$("#copyVerse").addEventListener("click",async()=>{const text="وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ — سورة الكهف، الآية ٢٤";try{await navigator.clipboard.writeText(text);$("#copyVerse").textContent="تم النسخ ✓";}catch{$("#copyVerse").textContent="تعذر النسخ";}});
document.addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent="تم النسخ ✓";}catch{b.textContent="تعذر النسخ";}});
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("zad_dark",document.body.classList.contains("dark")?"1":"0");});
if(localStorage.getItem("zad_dark")==="1")document.body.classList.add("dark");
function updateProgress(){const checks=$$("[data-task]");let count=0;checks.forEach(c=>{c.checked=(JSON.parse(localStorage.getItem("zad_tasks_"+todayKey)||"{}")[c.dataset.task]||false);if(c.checked)count++;});$("#progressLabel").textContent=`${arNum(count)} من ٣`;$("#progressBar").style.width=(count/3*100)+"%";}
$$("[data-task]").forEach(c=>c.addEventListener("change",()=>{const obj=JSON.parse(localStorage.getItem("zad_tasks_"+todayKey)||"{}");obj[c.dataset.task]=c.checked;localStorage.setItem("zad_tasks_"+todayKey,JSON.stringify(obj));updateProgress();}));
updateProgress();
$("#stripRefresh").addEventListener("click",()=>loadHomePrayer());
$("#qiblaBtn").addEventListener("click",qiblaForCity);
$("#qiblaGeoBtn").addEventListener("click",qiblaForGeolocation);
loadHomePrayer();
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
