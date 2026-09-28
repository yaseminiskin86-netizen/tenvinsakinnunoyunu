
'use strict';
const CONFIG={
  title:'Tenvin ve Sakin Nunun Halleri: İklab',
  course:'Kur’an-ı Kerim',
  grade:'9. Sınıf',
  outcome:'KK.9.2.5. Tenvin ve sakin nunun halleri ile ilgili tecvit kurallarını telaffuz edebilme',
  rights:3,
  points:[100,75,50],
  assessPoints:[40,30,20],
  version:'1.1.0',
  media:{stage:'assets/images/stage.png',character:'assets/images/character3.png',mindmap:'assets/images/mindmap.png',scale:'assets/images/scale.png',scaleQ:'assets/images/scale_q.png',lips:'assets/images/lips.png',lipsClosed:'assets/images/lips_closed.png'}
};
const EVIDENCE=[
  {id:'fein',img:'assets/images/evidence_fein.png',audio:'assets/audio/evidence_fein.mp3',label:'فَإِنْ آمَنُوا',iklab:false},
  {id:'minqarn',img:'assets/images/evidence_minqarn.png',audio:'assets/audio/evidence_minqarn.mp3',label:'مِنْ قَرْنٍ',iklab:false},
  {id:'sedid',img:'assets/images/evidence_sedid.png',audio:'assets/audio/evidence_sedid.mp3',label:'شَدِيدٌ بِمَا',iklab:true},
  {id:'basir',img:'assets/images/evidence_basir.png',audio:'assets/audio/evidence_basir.mp3',label:'بَصِيرٌ بِالْعِبَادِ',iklab:true},
  {id:'yumin',img:'assets/images/evidence_yumin.png',audio:'assets/audio/evidence_yumin.mp3',label:'يُؤْمِنْ بِاللَّهِ',iklab:true},
  {id:'munbesse',img:'assets/images/evidence_munbesse.png',audio:'assets/audio/evidence_munbesse.mp3',label:'مُنْبَثًّا',iklab:true}
];
const ASSESSMENT=[
  {id:1,q:'Sakin nun veya tenvinden sonra “ب” harfi gelirse hangi tecvit kuralı uygulanır?',options:['İhfa','İzhar','İklab','İdgam mealunne'],correct:'İklab',tip:'Be harfi görüldüğünde iklab uygulanır.'},
  {id:2,q:'İklab uygulanırken nun sesi hangi sese çevrilerek okunur?',options:['Lam sesi','Ra sesi','Mim sesi','Ha sesi'],correct:'Mim sesi',tip:'İklabda nun sesi mim sesine çevrilir.'},
  {id:3,q:'İklab okunurken aşağıdakilerden hangisi yapılır?',options:['Gunnesiz hızlı geçilir','Gunne ile okunur','Med yapılır','Hiç duraksama olmaz'],correct:'Gunne ile okunur',tip:'İklabda gunne vardır.'},
  {id:4,q:'İklab telaffuzunda dudaklar nasıl olmalıdır?',options:['Tamamen açık','Hafifçe kapalı','Sıkıca büzülmüş','Sürekli gülümser halde'],correct:'Hafifçe kapalı',tip:'Mim sesine yaklaşırken dudaklar hafifçe kapanır.'},
  {id:5,q:'Aşağıdaki ifadelerden hangisi doğrudur?',options:['Her tenvinden sonra iklab olur','İklab yalnızca be harfi geldiğinde olur','İklabda nun sesi kaybolur ve hiç duyulmaz','İklabda dudaklar tamamen açık kalır'],correct:'İklab yalnızca be harfi geldiğinde olur',tip:'İklabın temel işareti be harfidir.'}
];

const FLOW_ITEMS=[
  {id:1,img:'assets/images/flow_minden.png',label:'مِنْ بَيْنٍ',hasSakin:true,hasTanwin:true,nextBe:true,result:true},
  {id:2,img:'assets/images/flow_yensurukum.png',label:'يَنْصُرُكُمْ',hasSakin:true,hasTanwin:false,nextBe:false,result:false},
  {id:3,img:'assets/images/flow_azabun_alim.png',label:'عَذَابٌ أَلِيمٌ',hasSakin:false,hasTanwin:true,nextBe:false,result:false},
  {id:4,img:'assets/images/flow_semii_basir.png',label:'سَمِيعٌ بَصِيرٌ',hasSakin:false,hasTanwin:true,nextBe:true,result:true}
];

const TRUE_FALSE=[
  {text:'İklab, sakin nun veya tenvinden sonra be harfi geldiğinde, nunun mime çevrilerek bir buçuk elif miktarı gunne ile okunmasıdır.',correct:'D'},
  {text:'İklabda nun, mime çevrildikten sonra ses yalnızca ağızdan çıkarılır, geniz sesi kullanılmaz.',correct:'Y'},
  {text:'İklab yalnızca sakin nunda görülür, tenvinde uygulanmaz.',correct:'Y'},
  {text:'<span class="tfArabic" lang="ar" dir="rtl">مُنْبَثًّا</span> kelimesinde sakin nundan sonra be harfi geldiği için iklab meydana gelir.',correct:'D',html:true}
];

let state={screen:'start',name:'',score:0,wrong:0,attempt:1,evidenceSelected:[],evidenceActive:null,evidenceAttempt:1,evidenceDone:false,tfAnswers:[null,null,null,null],tfAttempt:1,tfDone:false,tfScore:0,flowIndex:0,flowStep:0,flowAttempt:1,flowCorrect:0,flowDone:false,flowAnswers:[],assessIndex:0,assessAttempt:1,assessCorrect:0,assessQuestions:[],audio:null,sound:true};
const app=document.getElementById('app');
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2400)}
function firstName(){return esc(state.name.split(/\s+/)[0]||state.name)}
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function prepareAssessment(){
  return shuffle(ASSESSMENT).map(item=>{
    const options=shuffle(item.options.map(text=>({text,isCorrect:text===item.correct})));
    return {...item,options};
  });
}
function getSectionName(){
  switch(state.screen){
    case 'start': return 'Başlangıç';
    case 'intro': return 'Hazırlık';
    case 'prelearn': return 'Ön Öğrenmeler';
    case 'map': return 'Keşfedelim';
    case 'lips': return 'Öğrenelim';
    case 'evidence': return 'Öğrenme Kanıtları';
    case 'truefalse': return 'Öğrenme Kanıtları 4';
    case 'flowcheck': return 'Öğrenme Kanıtları 5';
    case 'assess': return 'Değerlendirelim';
    case 'result': return 'Sonuç';
    default: return '';
  }
}
function getProgressText(){
  if(state.screen==='evidence') return `Öğrenme Kanıtları: <b>${state.evidenceSelected.length}/4</b>`;
  if(state.screen==='truefalse') return `Doğru / Yanlış: <b>${state.tfAnswers.filter(Boolean).length}/4</b>`;
  if(state.screen==='flowcheck') return `Karar Akışı: <b>${Math.min(state.flowIndex+1,FLOW_ITEMS.length)}/${FLOW_ITEMS.length}</b>`;
  if(state.screen==='assess') return `Değerlendirme: <b>${Math.min(state.assessIndex+1,state.assessQuestions.length||1)}/${state.assessQuestions.length||1}</b>`;
  if(state.screen==='result') return `<b>Tamamlandı</b>`;
  return `Bölüm: <b>${getSectionName()}</b>`;
}
function shell(content,showHud=true){
  return `<main class="screen"><header class="topbar"><div class="title">${CONFIG.title}</div>${showHud?`<div class="hud"><span class="pill">Puan: <b>${state.score}</b></span><span class="pill">${getProgressText()}</span><span class="pill">Hak: <b>${Math.max(0,CONFIG.rights-state.attempt+1)}</b></span><button class="btn btn-ghost" style="padding:9px 13px" onclick="toggleSound()" aria-pressed="${state.sound}">${state.sound?'🔊 Ses':'🔇 Ses'}</button></div>`:''}</header><section class="content">${content}</section></main>`;
}
function render(){
  if(state.screen==='start') renderStart();
  else if(state.screen==='intro') renderIntro();
  else if(state.screen==='prelearn') renderPrelearn();
  else if(state.screen==='map') renderMap();
  else if(state.screen==='lips') renderLips();
  else if(state.screen==='evidence') renderEvidence();
  else if(state.screen==='truefalse') renderTrueFalse();
  else if(state.screen==='flowcheck') renderFlowCheck();
  else if(state.screen==='assess') renderAssess();
  else if(state.screen==='result') renderResult();
}
function renderStart(){
  app.innerHTML=shell(`<div class="hero"><div class="panel"><h1>İklab Keşif Oyunu</h1><p>Bu oyunda <b>tenvin</b> ve <b>sakin nun</b>dan sonra <b>be (ب)</b> harfi geldiğinde oluşan <b>iklab</b> kuralını keşfedecek, örnekler üzerinde uygulayacak ve sonunda kendini değerlendireceksin.</p><label class="label" for="studentName">Ad Soyad</label><input id="studentName" class="nameInput" maxlength="60" autocomplete="off" placeholder="Adınızı ve soyadınızı yazınız"><div class="sectionSteps"><div class="stepCard"><h3>Keşfedelim</h3><p>Zihin haritası ve kısa bilgi kartlarıyla kuralı fark et.</p></div><div class="stepCard"><h3>Öğrenme Kanıtları</h3><p>Sürükle-bırak, doğru-yanlış ve karar akışı etkinlikleriyle öğrendiklerini uygula.</p></div><div class="stepCard"><h3>Değerlendirelim</h3><p>Öğrendiklerini kısa bir değerlendirme bölümüyle kontrol et.</p></div></div><div class="actions" style="justify-content:flex-start"><button class="btn btn-primary" onclick="startGame()">Oyuna Başla</button><button class="btn btn-ghost" onclick="showHow()">Nasıl Oynanır?</button></div><p class="tiny">Adınız yalnızca bu oyun oturumunda ve sertifikada kullanılır.</p></div><div class="center"><img class="hero-art" src="assets/images/character2.png" alt="Sakin nun ve be harflerini temsil eden öğretici karakter"></div></div>`,false);
  document.getElementById('studentName').focus();
}
function showHow(){toast('Önce keşfet, ardından öğrenme kanıtları etkinliklerini tamamla ve en sonda kendini değerlendir.');}
function startGame(){
  const v=document.getElementById('studentName').value.trim();
  if(!v){toast('Lütfen adınızı ve soyadınızı yazınız.');return}
  state.name=v;
  state.assessQuestions=prepareAssessment();
  state.screen='intro';
  render();
}
function renderIntro(){
  app.innerHTML=shell(`<div class="lesson-grid"><div class="stage"><img class="bg" src="${CONFIG.media.stage}" alt="Kırmızı tiyatro perdesi"><img class="character" src="${CONFIG.media.character}" alt="Sakin nun ve be harflerini temsil eden karakter"></div><div class="panel info"><h2>Hazırlık</h2><p>Kur’an-ı Kerim okurken tenvin ve sakin nun, kendilerinden sonra gelen harflere göre farklı okunur.</p><div class="mini-cards"><div class="mini"><b>Sakin nun (نْ)</b><br>Sonraki harfe göre okunuşu değişebilir.</div><div class="mini"><b>Tenvin</b><br>Yazılışı farklı olsa da okunuşunda nun sesi vardır.</div></div><p>Şimdi <b>Keşfedelim</b> bölümünde verilen zihin haritasıyla bütün yolları görecek, özellikle <b>iklab</b> yoluna odaklanacağız.</p><div class="actions" style="justify-content:flex-start"><button class="btn btn-primary" onclick="state.screen='prelearn';state.attempt=1;render()">Ön Öğrenmeler</button></div></div></div>`);
}
function renderPrelearn(){
  const letters=['İ','H','F','A'];
  const boxes=letters.map((_,i)=>`<input id="pre${i}" class="letterBox" maxlength="1" inputmode="text" autocomplete="off" aria-label="${i+1}. harf" oninput="preInput(${i})" onkeydown="preKey(event,${i})">`).join('');
  app.innerHTML=shell(`<div class="panel assessBox"><h2 style="text-align:center;color:#0d6d70;font-size:40px;margin-top:0">Ön Öğrenmeler</h2><p class="questionText" style="font-size:clamp(24px,2vw,34px);line-height:1.4">Sakin nun veya tenvinden sonra gelen harfi, iki farklı okuyuş arasında <b>bir buçuk elif miktarı gunne</b> ile okumayı sağlayan tecvit kuralının adını aşağıdaki boşluğa yazınız.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center"><div><div class="letterBoxes">${boxes}</div><div class="actions"><button class="btn btn-primary" onclick="checkPrelearn()">Kontrol Et</button></div><div id="preFeedback" class="feedback" role="status">Dört harfli kural adını yazınız. Kalan hak: ${CONFIG.rights-state.attempt+1}</div></div><div class="center"><img src="${CONFIG.media.scaleQ}" alt="İzhar ile idgam arasındaki dengeyi temsil eden terazi görseli" style="width:min(620px,100%);max-height:390px;object-fit:contain"></div></div><div class="navBottom"><button class="btn btn-ghost" onclick="state.screen='intro';state.attempt=1;render()">← Geri</button><button class="btn btn-ghost" onclick="state.screen='map';state.attempt=1;render()">Keşfedelim'e Geç →</button></div></div>`);
  setTimeout(()=>document.getElementById('pre0')?.focus(),0);
}
function preInput(i){
  const el=document.getElementById('pre'+i);
  if(!el) return;
  el.value=el.value.toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ]/g,'').slice(0,1);
  if(el.value && i<3) document.getElementById('pre'+(i+1))?.focus();
}
function preKey(e,i){
  if(e.key==='Backspace' && !e.currentTarget.value && i>0){document.getElementById('pre'+(i-1))?.focus();}
  if(e.key==='Enter') checkPrelearn();
}
function checkPrelearn(){
  const answer=[0,1,2,3].map(i=>document.getElementById('pre'+i)?.value||'').join('').toLocaleUpperCase('tr-TR');
  const fb=document.getElementById('preFeedback');
  if(answer==='İHFA'){
    const gain=CONFIG.points[Math.min(state.attempt-1,2)];
    state.score+=gain;
    playFeedbackSound('correct');
    fb.className='feedback good';
    fb.textContent='Doğru! Cevap İHFA. +'+gain+' puan';
    setTimeout(()=>{state.screen='map';state.attempt=1;render()},1100);
  }else{
    state.wrong++;
    state.attempt++;
    playFeedbackSound('wrong');
    const remain=Math.max(0,CONFIG.rights-state.attempt+1);
    fb.className='feedback bad';
    if(remain>0){
      fb.textContent='Henüz değil. '+remain+' hakkın kaldı. İpucu: Bu kural, izhar ile idgam arasında bir okuyuş özelliği taşır.';
    }else{
      const correctLetters=['İ','H','F','A'];
      correctLetters.forEach((ch,i)=>{
        const box=document.getElementById('pre'+i);
        if(box){
          box.value=ch;
          box.disabled=true;
          box.setAttribute('aria-label',(i+1)+'. harf: '+ch);
        }
      });
      fb.textContent='Üç hakkın da tamamlandı. Doğru cevap kutulara yazıldı: İHFA. Hazır olduğunda Keşfedelim bölümüne geçebilirsin.';
    }
  }
}
function renderMap(){
  app.innerHTML=shell(`<div class="panel"><h2 style="text-align:center;color:#0e6d70;font-size:40px;margin-top:0">Keşfedelim</h2><p style="text-align:center;font-size:22px;max-width:1100px;margin:0 auto 20px">Aşağıdaki zihin haritasında <b>tenvin veya sakin nun</b>dan sonra gelen harflere göre oluşan tecvit kuralları gösterilmektedir. Bu oyunda özellikle <b>ب</b> harfiyle oluşan <b>iklab</b> kuralını keşfedeceğiz.</p><div class="mapWrap"><img src="${CONFIG.media.mindmap}" alt="Tenvin veya sakin nundan sonra gelen harflere göre ihfa, izhar, iklab ve idgam kurallarını gösteren zihin haritası"></div><div class="exploreGrid"><div class="discover"><b>1. İpucu</b><p>Tenvin veya sakin nundan sonra <b>ب</b> harfi gelirse <b>iklab</b> oluşur.</p></div><div class="discover"><b>2. İpucu</b><p>İklabda nun sesi <b>mim sesine</b> çevrilerek okunur.</p></div><div class="discover"><b>3. İpucu</b><p>Okuyuş sırasında <b>gunne</b> yapılır; ses genizden desteklenir.</p></div><div class="discover"><b>4. İpucu</b><p>Telaffuzda <b>dudaklar hafifçe kapanır</b> ve sonra be harfi okunur.</p></div></div><div class="actions"><button class="btn btn-primary" onclick="state.screen='lips';state.attempt=1;render()">Öğrenelim</button></div></div>`);
}
function renderLips(){
  app.innerHTML=shell(`<div class="panel"><h2 style="text-align:center;color:#0d6d70;font-size:40px">Öğrenelim</h2><p style="text-align:center;font-size:22px;max-width:1000px;margin:0 auto 24px">Sakin nun veya tenvin, be (ب) harfinden önce <b>mim sesine çevrilerek</b> okunur. Mim sesi <b>gunne</b> ile genizden çıkarılır; dudaklar hafifçe kapatılır.</p><div class="lipsGrid"><div class="lipCard"><img src="${CONFIG.media.lipsClosed}" alt="Hafifçe kapalı dudak görseli"><h3>1. Hafifçe kapat</h3><p>Dudakları sıkıca bastırmadan hafifçe kapat.</p></div><div class="lipCard"><img src="${CONFIG.media.lips}" alt="Doğal dudak pozisyonu görseli"><h3>2. Okuyuşa devam et</h3><p>Gunne tamamlandıktan sonra okuyuşu kesmeden be harfiyle devam et.</p></div></div><div class="actions"><button class="btn btn-primary" onclick="state.screen='evidence';state.attempt=1;render()">Öğrenme Kanıtları</button></div></div>`);
}
function evidenceCardHtml(item){
  const placed=state.evidenceSelected.includes(item.id);
  const selected=state.evidenceActive===item.id;
  return `<div class="evidenceCard ${placed?'placed':''} ${selected?'selected':''}" draggable="${placed?'false':'true'}" data-id="${item.id}" tabindex="${placed?'-1':'0'}" role="button" aria-label="${esc(item.label)} kartı. ${placed?'İklab alanına yerleştirildi.':'Sürükleyin veya seçmek için Enter tuşuna basın.'}" onclick="selectEvidence('${item.id}')" onkeydown="evidenceKey(event,'${item.id}')" ondragstart="evidenceDragStart(event,'${item.id}')"><button class="evidenceAudio" onclick="event.stopPropagation();playEvidenceAudio('${item.audio}','${esc(item.label)}')" aria-label="${esc(item.label)} örneğini dinle">🔊</button><img src="${item.img}" alt="${esc(item.label)} Arapça örnek kartı"></div>`;
}
function renderEvidence(){
  const pool=EVIDENCE.map(evidenceCardHtml).join('');
  const placed=state.evidenceSelected.map(id=>EVIDENCE.find(x=>x.id===id)).filter(Boolean).map(item=>`<div class="dropMini"><img src="${item.img}" alt="${esc(item.label)}"></div>`).join('');
  const remain=EVIDENCE.length-state.evidenceSelected.length;
  app.innerHTML=shell(`<div class="panel"><h2 style="text-align:center;color:#0d6d70;font-size:40px;margin:0 0 8px">Öğrenme Kanıtları 1</h2><p style="font-size:22px;line-height:1.45;margin:0 auto 24px;max-width:1180px;text-align:center">Ses butonlarına tıklayarak örnekleri dinleyiniz. Ardından <b>iklab örneği içeren</b> kartları sürükleyerek <b>“İklab”</b> alanına bırakınız.</p><div class="evidenceLayout"><div><div class="evidencePool">${pool}</div><p class="evidenceHelp">Dokunmatik veya klavye ile kullanım için: önce bir kartı seçin, sonra sağdaki İklab alanına tıklayın. Kartı tekrar çıkarmak için hedef alandaki kartı seçip “Geri Al” düğmesini kullanabilirsiniz.</p></div><div class="dropZoneWrap"><div id="iklabDrop" class="dropZone" tabindex="0" role="button" aria-label="İklab hedef alanı. Seçili kartı yerleştirmek için Enter tuşuna basın." onclick="placeSelectedEvidence()" onkeydown="dropKey(event)" ondragover="evidenceDragOver(event)" ondragleave="evidenceDragLeave(event)" ondrop="evidenceDrop(event)"><div class="dropLabel">م</div><div class="dropItems">${placed}</div></div><div class="evidenceStatus">İklab alanındaki kart: ${state.evidenceSelected.length} &nbsp;•&nbsp; Havuzda kalan: ${remain}</div><div class="evidenceControls"><button class="btn btn-ghost" onclick="undoEvidence()">Geri Al</button><button class="btn btn-primary" onclick="checkEvidence()">Kontrol Et</button></div><div id="evidenceFeedback" class="feedback" role="status">İklab örneklerini seçip hedef alana yerleştiriniz. Kalan hak: ${CONFIG.rights-state.evidenceAttempt+1}</div></div></div><div class="navBottom"><button class="btn btn-ghost" onclick="state.screen='lips';state.attempt=1;render()">← Öğrenelim</button><button class="btn btn-ghost" ${state.evidenceDone?'':'disabled'} onclick="state.screen='truefalse';state.attempt=1;render()">Öğrenme Kanıtları 4 →</button></div></div>`);
}
function selectEvidence(id){
  if(state.evidenceSelected.includes(id)) return;
  state.evidenceActive = state.evidenceActive===id ? null : id;
  renderEvidence();
}
function evidenceKey(e,id){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();selectEvidence(id)}
}
function dropKey(e){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();placeSelectedEvidence()}
}
function placeSelectedEvidence(){
  if(!state.evidenceActive){toast('Önce bir kart seçiniz.');return}
  if(!state.evidenceSelected.includes(state.evidenceActive)) state.evidenceSelected.push(state.evidenceActive);
  state.evidenceActive=null;
  renderEvidence();
}
function evidenceDragStart(e,id){
  state.evidenceActive=id;
  e.dataTransfer.setData('text/plain',id);
  e.dataTransfer.effectAllowed='move';
}
function evidenceDragOver(e){e.preventDefault();e.currentTarget.classList.add('dragover');e.dataTransfer.dropEffect='move'}
function evidenceDragLeave(e){e.currentTarget.classList.remove('dragover')}
function evidenceDrop(e){
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const id=e.dataTransfer.getData('text/plain')||state.evidenceActive;
  if(id&&!state.evidenceSelected.includes(id)) state.evidenceSelected.push(id);
  state.evidenceActive=null;
  renderEvidence();
}
function undoEvidence(){
  if(!state.evidenceSelected.length){toast('Geri alınacak kart yok.');return}
  state.evidenceSelected.pop();
  state.evidenceDone=false;
  renderEvidence();
}
function checkEvidence(){
  const correctIds=EVIDENCE.filter(x=>x.iklab).map(x=>x.id).sort();
  const chosen=state.evidenceSelected.slice().sort();
  const fb=document.getElementById('evidenceFeedback');
  const exact=correctIds.length===chosen.length&&correctIds.every((x,i)=>x===chosen[i]);
  if(exact){
    if(!state.evidenceDone){state.score+=100;state.evidenceDone=true}
    playFeedbackSound('correct');
    fb.className='feedback good';
    fb.textContent='Doğru! Şedîdün bimâ, Basîrun bil-ibâd, Yü’min billâh ve Münbessen örneklerinde iklab vardır. +100 puan';
    setTimeout(()=>{state.screen='truefalse';state.attempt=1;render()},1300);
    return;
  }
  state.wrong++;
  state.evidenceAttempt++;
  playFeedbackSound('wrong');
  const correctSelected=state.evidenceSelected.filter(id=>EVIDENCE.find(x=>x.id===id)?.iklab);
  const incorrectSelected=state.evidenceSelected.filter(id=>!EVIDENCE.find(x=>x.id===id)?.iklab);
  const remain=Math.max(0,CONFIG.rights-state.evidenceAttempt+1);
  fb.className='feedback bad';
  if(remain>0){
    state.evidenceSelected=correctSelected;
    fb.textContent=`Henüz tamamlanmadı. ${incorrectSelected.length?incorrectSelected.length+' yanlış kart hedef alandan çıkarıldı. ':''}${remain} hakkın kaldı. İpucu: Tenvin veya sakin nundan sonra ب harfini arayın.`;
    setTimeout(()=>renderEvidence(),1300);
  }else{
    state.evidenceSelected=correctIds.slice();
    state.evidenceDone=true;
    fb.textContent='Doğru iklab örnekleri hedef alana yerleştirildi. Şimdi değerlendirme bölümüne geçebilirsiniz.';
    setTimeout(()=>renderEvidence(),1400);
  }
}

function renderTrueFalse(){
  const rows=TRUE_FALSE.map((item,i)=>{
    const a=state.tfAnswers[i];
    const stmt=item.html?item.text:esc(item.text);
    return `<div class="tfControls" role="group" aria-label="${i+1}. yargı için doğru yanlış seçimi"><button class="tfChoice ${a==='D'?'selected':''}" aria-pressed="${a==='D'}" aria-label="Doğru" onclick="selectTF(${i},'D')"></button><button class="tfChoice ${a==='Y'?'selected':''}" aria-pressed="${a==='Y'}" aria-label="Yanlış" onclick="selectTF(${i},'Y')"></button></div><div class="tfStatement">${stmt}</div>`;
  }).join('');
  app.innerHTML=shell(`<div class="panel tfWrap"><h2 style="color:#8b6157;font-size:38px;margin:0 0 10px">Öğrenme Kanıtları 4</h2><p class="tfInstruction">Aşağıdaki yargılardan doğru olanlar için <b>“D”</b>, yanlış olanlar için <b>“Y”</b> seçeneğini işaretleyiniz.</p><div class="tfLegend"><span class="tfHead">D</span><span class="tfHead">Y</span></div><div class="tfGrid">${rows}</div><div class="actions"><button class="btn btn-primary" onclick="checkTrueFalse()">Kontrol Et</button></div><div id="tfFeedback" class="feedback" role="status">Dört yargı için D veya Y seçeneğini işaretleyiniz. Kalan hak: ${CONFIG.rights-state.tfAttempt+1}</div><div class="navBottom"><button class="btn btn-ghost" onclick="state.screen='evidence';render()">← Öğrenme Kanıtları 1</button><button class="btn btn-ghost" ${state.tfDone?'':'disabled'} onclick="state.screen='flowcheck';state.attempt=1;render()">Öğrenme Kanıtları 5 →</button></div></div>`);
}
function selectTF(i,val){
  if(state.tfDone) return;
  state.tfAnswers[i]=val;
  renderTrueFalse();
}
function checkTrueFalse(){
  const fb=document.getElementById('tfFeedback');
  if(state.tfAnswers.some(v=>!v)){fb.className='feedback bad';fb.textContent='Lütfen dört yargının tamamı için D veya Y seçiniz.';return}
  const wrongIdx=[];
  TRUE_FALSE.forEach((item,i)=>{if(state.tfAnswers[i]!==item.correct) wrongIdx.push(i)});
  if(!wrongIdx.length){
    if(!state.tfDone){state.tfScore=100;state.score+=100;state.tfDone=true}
    playFeedbackSound('correct');
    fb.className='feedback good';
    fb.textContent='Tebrikler! Tüm yargıları doğru işaretlediniz. Cevaplar: D, Y, Y, D. +100 puan';
    setTimeout(()=>{state.screen='flowcheck';state.flowIndex=0;state.flowStep=0;state.flowAttempt=1;render()},1400);
    return;
  }
  state.wrong+=wrongIdx.length;
  state.tfAttempt++;
  playFeedbackSound('wrong');
  const remain=Math.max(0,CONFIG.rights-state.tfAttempt+1);
  fb.className='feedback bad';
  if(remain>0){
    fb.textContent=`${wrongIdx.length} yargıda yeniden düşünmeniz gerekiyor. ${remain} hakkınız kaldı.`;
  }else{
    state.tfAnswers=TRUE_FALSE.map(x=>x.correct);
    state.tfDone=true;
    state.tfScore=0;
    fb.textContent='Haklarınız tamamlandı. Doğru cevaplar gösterildi: D, Y, Y, D.';
    setTimeout(()=>renderTrueFalse(),1300);
  }
}


function currentFlow(){return FLOW_ITEMS[state.flowIndex]}
function flowNodeHtml(title,index,expected){
  const answers=state.flowAnswers||[null,null,null];
  const selected=answers[index];
  const done=selected!==null && selected!==undefined;
  return `<div class="flowNode ${done?'done':'active'} ${index===2?'wide':''}">
    <div class="flowNodeTitle">${title}</div>
    <div class="flowMiniChoices" role="group" aria-label="${title}">
      <button class="flowMini yes ${done&&selected===true?'selected':''}" ${done?'disabled':''} onclick="answerFlowNode(${index},true)">Evet</button>
      <button class="flowMini no ${done&&selected===false?'selected':''}" ${done?'disabled':''} onclick="answerFlowNode(${index},false)">Hayır</button>
    </div>
  </div>`;
}
function renderFlowCheck(){
  if(state.flowIndex>=FLOW_ITEMS.length){state.flowDone=true;state.screen='assess';state.attempt=1;render();return}
  const item=currentFlow();
  if(!state.flowAnswers || state.flowAnswers.length!==3) state.flowAnswers=[null,null,null];
  const a=state.flowAnswers;
  const firstDone=a[0]!==null && a[1]!==null;
  const allDone=firstDone && a[2]!==null;
  const node1=flowNodeHtml('Sakin nun var mı?',0,item.hasSakin);
  const node2=flowNodeHtml('Tenvin var mı?',1,item.hasTanwin);
  const node3=firstDone ? flowNodeHtml('Sonraki harf be (ب) mi?',2,item.nextBe) : `<div class="flowNode locked wide"><div class="flowNodeTitle">Sonraki harf be (ب) mi?</div><div class="tiny">Önce üstteki iki soruyu cevaplayınız.</div></div>`;
  const resultHtml=allDone ? `<div class="flowResult ${item.result?'yes':'no'}">${item.result?'İklab var.':'İklab yok.'}</div>` : '';
  const info = allDone ? 'Karar ağacı tamamlandı.' : (firstDone ? 'Şimdi sonraki harfin be (ب) olup olmadığını seçiniz.' : 'Her kutuda Evet veya Hayır seçeneğini işaretleyiniz.');
  app.innerHTML=shell(`<div class="panel flowGame"><h2 style="text-align:center;color:#8b6157;font-size:38px;margin:0 0 8px">Öğrenme Kanıtları 5</h2><p style="text-align:center;font-size:21px;line-height:1.45;margin:0 auto 8px">Verilen ifadeyi dikkatlice inceleyiniz. Her soruda <b>Evet</b> veya <b>Hayır</b> seçeneğini işaretleyerek iklab kuralının oluşup oluşmadığını tespit ediniz.</p><div class="flowExample"><img src="${item.img}" alt="${esc(item.label)} Arapça örneği"></div><div class="flowPath interactive">${node1}${node2}${node3}</div>${resultHtml}<div id="flowFeedback" class="feedback" role="status">${info} Kalan hak: ${CONFIG.rights-state.flowAttempt+1}</div><div class="navBottom"><button class="btn btn-ghost" onclick="state.screen='truefalse';state.attempt=1;render()">← Öğrenme Kanıtları 4</button>${allDone?`<button class="btn btn-primary" onclick="nextFlowItem()">${state.flowIndex===FLOW_ITEMS.length-1?'Değerlendirelim →':'Devam Et →'}</button>`:`<span class="tiny">Örnek ${state.flowIndex+1} / ${FLOW_ITEMS.length}</span>`}</div></div>`);
}
function answerFlowNode(index,val){
  const item=currentFlow();
  if(index===2 && (state.flowAnswers[0]===null || state.flowAnswers[1]===null)) return;
  const expected=index===0?item.hasSakin:index===1?item.hasTanwin:item.nextBe;
  const fb=document.getElementById('flowFeedback');
  if(val===expected){
    state.flowAnswers[index]=val;
    state.flowAttempt=1;
    playFeedbackSound('correct');
    fb.className='feedback good';
    fb.textContent='Doğru seçim. Karar ağacında ilerleyebilirsiniz.';
    if(index===2){
      state.flowCorrect++;
      state.score+=40;
    }
    setTimeout(renderFlowCheck,450);
  }else{
    state.wrong++;
    state.flowAttempt++;
    playFeedbackSound('wrong');
    fb.className='feedback bad';
    const remain=Math.max(0,CONFIG.rights-state.flowAttempt+1);
    if(remain>0){
      fb.textContent='Henüz değil. '+remain+' hakkınız kaldı. İfadeyi yeniden inceleyiniz.';
    }else{
      state.flowAnswers[index]=expected;
      state.flowAttempt=1;
      fb.textContent='Doğru cevap '+(expected?'Evet':'Hayır')+' olarak gösterildi.';
      if(index===2){state.flowCorrect++;}
      setTimeout(renderFlowCheck,850);
    }
  }
}
function nextFlowItem(){
  state.flowIndex++;
  state.flowStep=0;
  state.flowAttempt=1;
  state.flowAnswers=[];
  if(state.flowIndex>=FLOW_ITEMS.length){state.flowDone=true;state.screen='assess';state.attempt=1;render();return}
  renderFlowCheck();
}

function currentAssess(){return state.assessQuestions[state.assessIndex]}
function renderAssess(){
  if(state.assessIndex>=state.assessQuestions.length){state.screen='result';render();return}
  const q=currentAssess();
  const pct=(state.assessIndex/state.assessQuestions.length)*100;
  const optionsHtml=q.options.map((opt,i)=>`<button class="btn btn-ghost optionBtn" onclick="answerAssess(${i})">${esc(opt.text)}</button>`).join('');
  app.innerHTML=shell(`<div class="assessBox"><div class="progressTrack" aria-label="Değerlendirme ilerlemesi"><div class="progressFill" style="width:${pct}%"></div></div><div style="height:18px"></div><div class="panel"><h2 style="text-align:center;color:#0d6d70;font-size:38px;margin-top:0">Değerlendirelim</h2><p class="questionText" style="margin-top:0">${esc(q.q)}</p><div class="answerRow">${optionsHtml}</div><div id="assessFeedback" class="feedback" role="status">Cevabınızı seçiniz. Kalan hak: ${CONFIG.rights-state.attempt+1}</div><p class="tiny" style="margin-top:14px;text-align:center">Bu bölüm, öğrendiğiniz iklab bilgisini pekiştirmek içindir.</p></div><div class="navBottom"><button class="btn btn-ghost" onclick="backFromAssess()">← Önceki bölüm</button><span class="tiny">Bölüm: Değerlendirelim</span></div></div>`);
}
function answerAssess(idx){
  const q=currentAssess();
  const fb=document.getElementById('assessFeedback');
  const opt=q.options[idx];
  if(opt.isCorrect){
    const gain=CONFIG.assessPoints[Math.min(state.attempt-1,2)];
    state.score+=gain;
    state.assessCorrect++;
    playFeedbackSound('correct');
    fb.className='feedback good';
    fb.textContent='Doğru! '+q.tip+' +'+gain+' puan';
    setTimeout(()=>{state.assessIndex++;state.attempt=1;renderAssess()},1000);
  }else{
    state.wrong++;
    state.attempt++;
    fb.className='feedback bad';
    const remain=Math.max(0,CONFIG.rights-state.attempt+1);
    if(remain>0){
      fb.textContent='Henüz değil. '+remain+' hakkın kaldı. Tekrar düşün.';
    }else{
      fb.textContent='Hakların tamamlandı. Doğru bilgi: '+q.tip;
      setTimeout(()=>{state.assessIndex++;state.attempt=1;renderAssess()},1500);
    }
  }
}
function backFromAssess(){state.screen='flowcheck';state.attempt=1;render()}
function playEvidenceAudio(src,label){
  if(!state.sound){toast('Ses kapalı.');return;}
  if(state.audio){try{state.audio.pause();state.audio.currentTime=0;}catch(e){}}
  const a=new Audio(src);
  a.preload='auto';
  state.audio=a;
  a.play().catch(()=>toast(label+' ses dosyası oynatılamadı.'));
}
function playFeedbackSound(kind){
  if(!state.sound)return;
  if(state.audio){try{state.audio.pause();state.audio.currentTime=0;}catch(e){}}
  const src=kind==='correct'?'assets/audio/dogru.mp3':'assets/audio/yanlis.mp3';
  const a=new Audio(src);
  a.preload='auto';
  state.audio=a;
  a.play().catch(()=>{});
}

function renderResult(){
  const evidenceScore=state.evidenceDone?1:0;
  const tfScoreUnit=state.tfDone?1:0;
  const flowScoreUnit=state.flowDone?1:0;
  const success=Math.round(((state.assessCorrect+evidenceScore+tfScoreUnit+flowScoreUnit)/(state.assessQuestions.length+3))*100);
  const date=new Date().toLocaleDateString('tr-TR');
  const cert=`<div class="certificate"><h2>Başarı Belgesi</h2><p>${CONFIG.course} dersi</p><div class="name">${esc(state.name)}</div><p><b>${CONFIG.title}</b> etkinliğini tamamlamıştır.</p><div class="scoreBig">${state.score} puan</div><p>Başarı: %${success}<br>${date}</p></div>`;
  app.innerHTML=shell(`<div class="resultGrid"><div>${cert}</div><div class="panel"><h2 style="font-size:38px;color:#0d6d70">Tebrikler ${firstName()}!</h2><div class="summary"><b>Öğrenme Kanıtları 1:</b> ${state.evidenceDone?'Tamamlandı':'Tamamlanmadı'}<br><b>Öğrenme Kanıtları 4:</b> ${state.tfDone?'Tamamlandı (D-Y-Y-D)':'Tamamlanmadı'}<br><b>Öğrenme Kanıtları 5:</b> ${state.flowDone?'Tamamlandı ('+state.flowCorrect+'/'+FLOW_ITEMS.length+')':'Tamamlanmadı'}<br><b>Değerlendirme doğru sayısı:</b> ${state.assessCorrect}/${state.assessQuestions.length}<br><b>Yanlış deneme:</b> ${state.wrong}<br><b>Toplam puan:</b> ${state.score}<br><b>Başarı yüzdesi:</b> %${success}</div><hr style="margin:24px 0;border:0;border-top:2px solid #ddc993"><h3>Bu oyunda neler öğrendin?</h3><ul class="summary"><li>Tenvin ve sakin nunun okunuşu sonraki harfe göre değişebilir.</li><li>Be (ب) harfi geldiğinde iklab oluşur.</li><li>İklabda nun sesi mim sesine çevrilerek gunne ile okunur.</li><li>Telaffuz sırasında dudaklar hafifçe kapanır.</li></ul><div class="actions"><button class="btn btn-primary" onclick="printCertificate()">Sertifikayı Yazdır / PDF</button><button class="btn btn-ghost" onclick="downloadTxt()">Sonuçları TXT İndir</button><button class="btn btn-gold" onclick="newGame()">Yeni Oyun</button></div></div></div>`,false);
  document.getElementById('certificatePrint').innerHTML=cert;
}
function printCertificate(){const p=document.getElementById('certificatePrint');p.classList.remove('hidden');window.print();setTimeout(()=>p.classList.add('hidden'),500)}
function downloadTxt(){
  const evidenceScore=state.evidenceDone?1:0;
  const tfScoreUnit=state.tfDone?1:0;
  const flowScoreUnit=state.flowDone?1:0;
  const success=Math.round(((state.assessCorrect+evidenceScore+tfScoreUnit+flowScoreUnit)/(state.assessQuestions.length+3))*100);
  const s=`Ad Soyad: ${state.name}\nDers: ${CONFIG.course}\nKonu: ${CONFIG.title}\nSkor: ${state.score}\nÖğrenme Kanıtları 1: ${state.evidenceDone?'Tamamlandı':'Tamamlanmadı'}\nÖğrenme Kanıtları 4: ${state.tfDone?'Tamamlandı (D-Y-Y-D)':'Tamamlanmadı'}\nÖğrenme Kanıtları 5: ${state.flowDone?'Tamamlandı ('+state.flowCorrect+'/'+FLOW_ITEMS.length+')':'Tamamlanmadı'}\nDeğerlendirme Doğru Sayısı: ${state.assessCorrect}/${state.assessQuestions.length}\nYanlış Deneme: ${state.wrong}\nTamamlama: %${success}\nTarih: ${new Date().toLocaleString('tr-TR')}\n`;
  const blob=new Blob([s],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='iklab_sonuc.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}
function newGame(){
  if(state.audio) state.audio.pause();
  state={screen:'start',name:'',score:0,wrong:0,attempt:1,evidenceSelected:[],evidenceActive:null,evidenceAttempt:1,evidenceDone:false,tfAnswers:[null,null,null,null],tfAttempt:1,tfDone:false,tfScore:0,flowIndex:0,flowStep:0,flowAttempt:1,flowCorrect:0,flowDone:false,flowAnswers:[],assessIndex:0,assessAttempt:1,assessCorrect:0,assessQuestions:[],audio:null,sound:true};
  render();
}
render();
