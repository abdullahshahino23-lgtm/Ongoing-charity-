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
function renderPrayer(){
  showPanel("مواقيت الصلاة", `<p class="muted">اكتب اسم مدينة للحصول على مواقيت الصلاة من خدمة AlAdhan. يجب السماح بالاتصال بالإنترنت.</p><form id="prayerForm" class="form-row"><input id="cityInput" value="الرياض" placeholder="اسم المدينة" required><input id="countryInput" value="السعودية" placeholder="الدولة" required><button class="pill-btn" type="submit">عرض المواقيت</button></form><div id="prayerResult" style="margin-top:14px"></div><small class="muted">تحقق من طريقة الحساب المعتمدة محليًا؛ قد تختلف المواقيت قليلًا حسب الجهة الرسمية.</small>`);
  $("#prayerForm").addEventListener("submit",async e=>{e.preventDefault();const city=$("#cityInput").value.trim(),country=$("#countryInput").value.trim(),out=$("#prayerResult");out.textContent="جارٍ تحميل المواقيت…";
    try{const url=`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`;const r=await fetch(url);if(!r.ok)throw Error();const j=await r.json();if(j.code!==200)throw Error();const t=j.data.timings;const keys=[["الفجر","Fajr"],["الشروق","Sunrise"],["الظهر","Dhuhr"],["العصر","Asr"],["المغرب","Maghrib"],["العشاء","Isha"]];out.innerHTML=`<div class="prayer-grid">${keys.map(([ar,k])=>`<div class="prayer-time"><small>${ar}</small><strong>${t[k]}</strong></div>`).join("")}</div><p class="muted">التاريخ الهجري: ${j.data.date.hijri.date} — ${j.data.date.hijri.month.ar}</p>`;}
    catch{out.textContent="تعذر تحميل المواقيت. تحقق من اسم المدينة والاتصال بالإنترنت ثم أعد المحاولة.";}
  });
}
function openView(view){if(view==="quran")renderQuran();if(view==="azkar")renderAzkar();if(view==="tasbih")renderTasbih();if(view==="prayer")renderPrayer();}
$$("[data-view]").forEach(el=>el.addEventListener("click",()=>openView(el.dataset.view)));
$("#closePanel").addEventListener("click",()=>{panel.hidden=true;});
$("#copyVerse").addEventListener("click",async()=>{const text="وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ — سورة الكهف، الآية ٢٤";try{await navigator.clipboard.writeText(text);$("#copyVerse").textContent="تم النسخ ✓";}catch{$("#copyVerse").textContent="تعذر النسخ";}});
document.addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent="تم النسخ ✓";}catch{b.textContent="تعذر النسخ";}});
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("zad_dark",document.body.classList.contains("dark")?"1":"0");});
if(localStorage.getItem("zad_dark")==="1")document.body.classList.add("dark");
function updateProgress(){const checks=$$("[data-task]");let count=0;checks.forEach(c=>{c.checked=(JSON.parse(localStorage.getItem("zad_tasks_"+todayKey)||"{}")[c.dataset.task]||false);if(c.checked)count++;});$("#progressLabel").textContent=`${count} من ٣`;$("#progressBar").style.width=(count/3*100)+"%";}
$$("[data-task]").forEach(c=>c.addEventListener("change",()=>{const obj=JSON.parse(localStorage.getItem("zad_tasks_"+todayKey)||"{}");obj[c.dataset.task]=c.checked;localStorage.setItem("zad_tasks_"+todayKey,JSON.stringify(obj));updateProgress();}));
updateProgress();
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
