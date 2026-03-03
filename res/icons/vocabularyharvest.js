const CATEGORIES=[
  {id:0,name:"The Alphabet",words:[
    {ar:"أ",en:"Alif"},{ar:"ب",en:"Bāʾ"},{ar:"ت",en:"Tāʾ"},{ar:"ث",en:"Thāʾ"},
    {ar:"ج",en:"Jīm"},{ar:"ح",en:"Ḥāʾ"},{ar:"خ",en:"Khāʾ"},{ar:"د",en:"Dāl"},
    {ar:"ذ",en:"Thāl"},{ar:"ر",en:"Rāʾ"},{ar:"ز",en:"Zāy"},{ar:"س",en:"Sīn"},
    {ar:"ش",en:"Shīn"},{ar:"ص",en:"Ṣād"},{ar:"ض",en:"Ḍād"},{ar:"ط",en:"Ṭāʾ"},
    {ar:"ظ",en:"Ẓāʾ"},{ar:"ع",en:"ʿAyn"},{ar:"غ",en:"Ghayn"},{ar:"ف",en:"Fāʾ"},
    {ar:"ق",en:"Qāf"},{ar:"ك",en:"Kāf"},{ar:"ل",en:"Lām"},{ar:"م",en:"Mīm"},
    {ar:"ن",en:"Nūn"},{ar:"هـ",en:"Hāʾ"},{ar:"و",en:"Wāw"},{ar:"ي",en:"Yāʾ"}
  ]},
  {id:1,name:"Greetings",words:[
    {ar:"أهلاً",en:"Hi"},{ar:"مرحباً",en:"Hello"},{ar:"صباح الخير",en:"Good morning"},
    {ar:"مساء الخير",en:"Good evening"},{ar:"كيف حالك؟",en:"How are you?"},
    {ar:"سررت بلقائك",en:"Nice to meet you"},{ar:"أهلاً بك",en:"Welcome"},
    {ar:"تحياتي",en:"Greetings"},{ar:"وداعاً",en:"Goodbye"},
    {ar:"مع السلامة",en:"Bye"},{ar:"أراك لاحقاً",en:"See you later"},
    {ar:"انتبه لنفسك",en:"Take care"},{ar:"من فضلك",en:"Please"},
    {ar:"شكراً لك",en:"Thank you"},{ar:"آسف",en:"Sorry"}
  ]}
];

const state={
  view:'home',currentCategory:0,lives:3,scores:{},
  feedback:null,hiddenOptions:[],targetWord:null,options:[],
  sessionStreak:0,sessionPeakStreak:0,sessionXPGained:0,sessionWordsCorrect:0,
  sessionStartCategory:0,
  sessionStartMode:'recall', // 'recall' | 'assemble'
  usedHint:false,questionStart:0,
  productionTiles:[],userInput:[],selectedPlacedIdx:null
};

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function getCat(id){return CATEGORIES.find(c=>c.id===id);}
function getCategoryStats(id){
  const cat=getCat(id);if(!cat||!cat.words.length)return{score:0,max:1,percent:0};
  const score=cat.words.reduce((a,w)=>a+(state.scores[w.en]||0),0);
  const max=cat.words.length*50;return{score,max,percent:(score/max)*100};
}
function getXpStatus(xp){
  if(xp>=50)return'Harvested ✨';if(xp>=38)return'Flourishing 🍂';
  if(xp>=28)return'Ripening 🌾';if(xp>=16)return'Growing 🌿';
  if(xp>=8)return'Sprouting 🌱';return'Dormant';
}
function pickWord(catId){const cat=getCat(catId);return cat.words[Math.floor(Math.random()*cat.words.length)];}
function speak(text,isArabic){
  if(!window.speechSynthesis)return;
  const synth=window.speechSynthesis;synth.cancel();
  const msg=new SpeechSynthesisUtterance(text);msg.lang=isArabic?'ar-SA':'en-US';
  const voices=synth.getVoices();
  if(voices.length){const m=voices.find(v=>v.lang===msg.lang)||voices.find(v=>v.lang.startsWith(isArabic?'ar':'en'));if(m)msg.voice=m;}
  synth.speak(msg);
}
function navigate(fn){
  const app=document.getElementById('app');
  app.style.transition='opacity 0.15s ease,transform 0.15s ease';
  app.style.opacity='0';app.style.transform='translateY(8px)';
  setTimeout(()=>{fn();render();app.getBoundingClientRect();app.style.opacity='1';app.style.transform='translateY(0)';},150);
}
function returnHome(){
  if(state.sessionWordsCorrect>0||state.sessionXPGained>0)
    navigate(()=>{state.view='summary';});
  else
    navigate(()=>{state.view='home';});
}

/* HOME */
function renderHome(){
  const app=document.getElementById('app');
  app.innerHTML=`
    <header style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:20px 1rem 8px;width:100%;">
      <div style="width:36px;"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <h1>Vocabulary <em>Harvest</em></h1>
        <span style="font-size:0.62rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);font-family:'Lora',serif;">Arabic Garden · Preview</span>
      </div>
      <div style="width:36px;"></div>
    </header>
    <div class="home-scroll">
      <div class="leaf-divider" style="width:100%;"><hr><span>✦</span><hr></div>
      <div class="continue-card" style="width:100%;">
        <div class="continue-label">Begin your journey</div>
        <div class="continue-title">Start with the alphabet</div>
        <div class="continue-sub">28 letters · three game modes</div>
        <div class="growth-bar-wrap">
          <div class="growth-bar"><div class="growth-fill" style="width:${getCategoryStats(0).percent}%"></div></div>
          <span class="growth-pct">${Math.round(getCategoryStats(0).percent)}%</span>
        </div>
        <div class="continue-actions">
          <button onclick="navigate(()=>startRecall(0))" class="btn-continue-primary">🌾 Start Recalling</button>
          <button onclick="navigate(()=>{state.view='study';state.currentCategory=0;})" class="btn-continue-ghost">Study</button>
        </div>
      </div>
      <div class="section-label" style="margin-top:8px;">Lessons in this preview</div>
      ${CATEGORIES.map((cat,i)=>{
        const stats=getCategoryStats(cat.id);
        return`<div class="lesson-card" style="animation-delay:${i*0.08}s">
          <div class="lesson-top">
            <div class="lesson-name"><span class="lesson-num">${String(i+1).padStart(2,'0')} </span>${cat.name}</div>
            <div class="lesson-status">${Math.round(stats.percent)}% 🌿</div>
          </div>
          <div class="plant-bar-wrap"><div class="plant-bar"><div class="plant-fill" style="width:${stats.percent}%"></div></div></div>
          <div class="lesson-actions">
            <button onclick="navigate(()=>startRecall(${cat.id}))" class="btn-harvest">🌾 Recall</button>
            <button onclick="navigate(()=>{state.view='study';state.currentCategory=${cat.id};})" class="btn-outline">Garden</button>
            <button onclick="navigate(()=>startAssemble(${cat.id}))" class="btn-outline">Assemble</button>
          </div>
        </div>`;
      }).join('')}
      <div style="text-align:center;padding:2rem 0 1rem;font-size:0.72rem;color:var(--muted);font-style:italic;opacity:0.8;">
        The full garden has 55 lessons · 800+ words<br><br>
        <a href="https://vocabulary-harvest.vercel.app/" style="color:var(--action);text-decoration:none;border-bottom:1px solid rgba(61,92,46,0.3);font-weight:700;" target="_blank">Unlock the full app →</a>
      </div>
    </div>`;
}

/* RECALL */
function startRecall(catId){
  state.view='game';state.currentCategory=catId;state.lives=3;
  state.sessionStreak=0;state.sessionPeakStreak=0;state.sessionXPGained=0;state.sessionWordsCorrect=0;
  state.sessionStartCategory=catId;state.sessionStartMode='recall';
  state.feedback=null;state.usedHint=false;nextRecallQ();
}
function nextRecallQ(){
  state.feedback=null;state.hiddenOptions=[];state.usedHint=false;
  const cat=getCat(state.currentCategory);
  state.targetWord=pickWord(state.currentCategory);state.questionStart=Date.now();
  const all=cat.words.map(w=>w.en).filter(Boolean);
  const dis=shuffle([...new Set(all)].filter(o=>o!==state.targetWord.en)).slice(0,8);
  state.options=shuffle([...dis,state.targetWord.en]);render();
}
function showHint(){
  if(state.feedback||state.hiddenOptions.length>0)return;
  state.usedHint=true;const wk=state.targetWord.en;state.scores[wk]=Math.max((state.scores[wk]||0)-2,0);
  const wrong=[];state.options.forEach((o,i)=>{if(o!==state.targetWord.en)wrong.push(i);});
  state.hiddenOptions=shuffle(wrong).slice(0,3);render();
}
function handleGuess(choice){
  if(state.feedback||state.lives<=0||!state.targetWord)return;
  const isCorrect=choice===state.targetWord.en;
  const wk=state.targetWord.en;const t=Date.now()-state.questionStart;
  state.feedback={choice,isCorrect};
  if(isCorrect){
    state.sessionStreak++;state.sessionWordsCorrect++;state.lives=3;
    if(state.sessionStreak>state.sessionPeakStreak)state.sessionPeakStreak=state.sessionStreak;
    const prev=state.scores[wk]||0;const bonus=t<2000?7:t<5000?5:3;
    state.scores[wk]=Math.min(prev+bonus,50);state.sessionXPGained+=(state.scores[wk]-prev);
    render();setTimeout(nextRecallQ,700);
  } else {
    state.lives--;state.sessionStreak=0;state.scores[wk]=Math.max((state.scores[wk]||0)-2,0);
    render();if(state.lives>0)setTimeout(()=>{state.feedback=null;render();},800);
  }
}
function renderGame(){
  const app=document.getElementById('app');
  const isDead=state.lives<=0;const stats=getCategoryStats(state.currentCategory);
  const wordXP=state.targetWord?(state.scores[state.targetWord.en]||0):0;
  const xpStatus=getXpStatus(wordXP);const hintDisabled=wordXP<2||isDead||state.hiddenOptions.length>0;
  app.innerHTML=`
    ${isDead?`<div class="death-overlay"><div class="death-card">
      <span class="death-icon">🥀</span>
      <div class="death-title">Harvest Interrupted.</div>
      <div class="death-sub">The field needs tending before it yields.</div>
      <div class="death-answer-label">The answer was</div>
      <div class="death-answer">${state.targetWord?state.targetWord.en:''}</div>
      <button onclick="navigate(()=>startRecall(${state.currentCategory}))" class="death-btn">🌱 Return to the Field</button>
    </div></div>`:''}
    <div class="game-layout">
      <div class="game-header">
        <div class="header-container">
          <div class="header-left"><button onclick="returnHome()" class="game-return-btn">RETURN</button></div>
          <div class="header-center" style="gap:8px;align-items:center;">
            <div style="font-size:1.1rem;">${'⭐'.repeat(state.lives)}${'⚫'.repeat(3-state.lives)}</div>
            ${state.sessionStreak>0?`<div class="streak-badge">${state.sessionStreak} 🔥</div>`:''}
          </div>
          <div class="header-right"><button onclick="showHint()" ${hintDisabled?'disabled':''} class="game-hint-btn" style="opacity:${hintDisabled?'0.3':'1'};">💡 Hint (-2 XP)</button></div>
        </div>
      </div>
      <div class="game-word-card">
        <div class="word-card ${isDead?'opacity-50':''}" onclick="speak('${state.targetWord.ar.replace(/'/g,"\\'")}',true)">
          <div class="word-card-inner">
            <div class="word-card-label">What does this mean?</div>
            <div class="word-card-word arabic-text">${state.targetWord.ar}</div>
            <div class="word-card-tap">Tap to hear</div>
          </div>
          <div class="word-xp">
            <div class="word-xp-top"><span class="word-xp-status">${xpStatus}</span><span class="word-xp-num">${wordXP}/50</span></div>
            <div class="xp-bar-track"><div class="xp-bar-fill" style="width:${(wordXP/50)*100}%"></div></div>
          </div>
        </div>
      </div>
      <div class="game-options-wrap">
        <div class="game-options ${isDead?'opacity-50':''}">
          ${state.options.map((opt,idx)=>{
            if(state.hiddenOptions.includes(idx)&&!state.feedback)return'';
            let extra='';
            if(state.feedback){
              if(opt===state.targetWord.en&&(state.feedback.isCorrect||isDead))extra='correct';
              else if(opt===state.feedback.choice&&!state.feedback.isCorrect)extra='wrong';
            }
            const sz=opt.length>14?'text-sm':opt.length>8?'text-xl':'text-2xl';
            const safe=opt.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            return`<button onclick="handleGuess('${safe}')" class="option-btn ${extra} ${sz}">${opt}</button>`;
          }).join('')}
        </div>
      </div>
      <div class="game-footer">
        <div class="field-progress">
          <div class="field-progress-top"><span class="field-progress-label">Field Progress</span><span class="field-progress-pct">${Math.round(stats.percent)}%</span></div>
          <div class="field-progress-bar-wrap"><span style="font-size:0.85rem;">🌱</span><div class="field-progress-bar"><div class="field-progress-fill" style="width:${stats.percent}%"></div></div></div>
        </div>
      </div>
    </div>`;
}

/* STUDY */
function renderStudy(){
  const app=document.getElementById('app');const cat=getCat(state.currentCategory);const stats=getCategoryStats(cat.id);
  app.innerHTML=`
    <div class="study-layout">
      <div class="study-header-fixed"><div class="study-header-card"><div class="study-header-inner">
        <button onclick="navigate(()=>{state.view='home';})" class="study-back-btn">← Back to Garden</button>
        <div class="study-header-label">Garden · Level ${CATEGORIES.indexOf(cat)+1}</div>
        <div class="study-header-title">${cat.name}</div>
        <div class="study-header-sub">${cat.words.length} words · tap any row to hear</div>
        <div class="study-overall-bar-wrap">
          <div class="study-overall-bar"><div class="study-overall-fill" style="width:${stats.percent}%"></div></div>
          <span class="study-overall-pct">${Math.round(stats.percent)}%</span>
        </div>
      </div></div></div>
      <div class="study-body-scroll">
        <div class="study-table-wrap">
          ${cat.words.map(w=>{
            const xp=state.scores[w.en]||0;
            const xpS=xp>=50?'Harvested':xp>=38?'Flourishing':xp>=28?'Ripening':xp>=16?'Growing':xp>=8?'Sprouting':'Dormant';
            const safe=w.ar.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            return`<div class="study-row" onclick="speak('${safe}',true)">
              <div class="study-row-left">
                <div class="study-row-word-line"><span class="study-row-word arabic">${w.ar}</span>${xp>=50?'<span style="font-size:0.75rem;">✨</span>':''}</div>
                <div class="study-row-xp">
                  <span class="study-row-status">${xpS}</span>
                  <div class="study-row-bar"><div class="study-row-bar-fill" style="width:${(xp/50)*100}%"></div></div>
                  <span class="study-row-num">${xp}/50</span>
                </div>
              </div>
              <div class="study-row-right"><div class="study-row-translation non-arabic">${w.en}</div></div>
            </div>`;
          }).join('')}
        </div>
        <button onclick="navigate(()=>startRecall(${cat.id}))" class="study-harvest-btn">🌾 Start Harvesting</button>
      </div>
    </div>`;
}

/* ASSEMBLE */
function startAssemble(catId){
  state.view='production';state.currentCategory=catId;state.lives=3;
  state.sessionStreak=0;state.sessionPeakStreak=0;state.sessionXPGained=0;state.sessionWordsCorrect=0;
  state.sessionStartCategory=catId;state.sessionStartMode='assemble'; // KEY FIX
  state.feedback=null;state.selectedPlacedIdx=null;state.usedHint=false;nextAssembleQ();
}
function nextAssembleQ(){
  state.feedback=null;state.lives=3;state.hiddenOptions=[];state.selectedPlacedIdx=null;state.usedHint=false;
  const cat=getCat(state.currentCategory);
  state.targetWord=pickWord(state.currentCategory);state.questionStart=Date.now();
  const target=state.targetWord.ar;const words=target.split(' ');
  const correctTiles=words.length<=2?target.split(''):words;
  const correctSet=new Set(correctTiles);
  const wrongPool=cat.words.filter(w=>w.en!==state.targetWord.en).map(w=>w.ar).sort(()=>0.5-Math.random());
  const wrongTiles=[];
  for(const w of wrongPool){
    const parts=w.includes(' ')?w.split(' '):w.split('');
    for(const part of parts){if(!correctSet.has(part)&&!wrongTiles.includes(part)){wrongTiles.push(part);if(wrongTiles.length>=correctTiles.length)break;}}
    if(wrongTiles.length>=correctTiles.length)break;
  }
  state.productionTiles=[...correctTiles,...wrongTiles].sort(()=>0.5-Math.random());
  state.userInput=[];render();
}
function selectPoolTile(idx){
  if(state.selectedPlacedIdx!==null){
    const ret=state.userInput.splice(state.selectedPlacedIdx,1)[0];
    state.productionTiles.splice(idx,0,ret);const inc=state.productionTiles.splice(idx+1,1)[0];
    state.userInput.splice(state.selectedPlacedIdx,0,inc);state.selectedPlacedIdx=null;
  } else {const tile=state.productionTiles.splice(idx,1)[0];state.userInput.push(tile);}
  render();
}
function selectPlacedTile(idx){
  if(state.selectedPlacedIdx===null){state.selectedPlacedIdx=idx;}
  else if(state.selectedPlacedIdx===idx){const t=state.userInput.splice(idx,1)[0];state.productionTiles.push(t);state.selectedPlacedIdx=null;}
  else{const tmp=state.userInput[state.selectedPlacedIdx];state.userInput[state.selectedPlacedIdx]=state.userInput[idx];state.userInput[idx]=tmp;state.selectedPlacedIdx=null;}
  render();
}
function resetInput(){state.productionTiles=[...state.userInput,...state.productionTiles];state.userInput=[];state.hiddenOptions=[];state.selectedPlacedIdx=null;render();}
function submitProduction(){
  if(state.feedback?.type==='gameover')return;
  const correct=state.targetWord.ar;const isWordMode=correct.split(' ').length>2;
  const user=isWordMode?state.userInput.join(' '):state.userInput.join('');
  const isCorrect=user===correct;const wk=state.targetWord.en;
  if(isCorrect){
    const prev=state.scores[wk]||0;state.scores[wk]=Math.min(prev+5,50);
    state.sessionXPGained+=(state.scores[wk]-prev);state.sessionStreak++;state.sessionWordsCorrect++;
    if(state.sessionStreak>state.sessionPeakStreak)state.sessionPeakStreak=state.sessionStreak;
    state.feedback={type:'correct'};render();setTimeout(()=>nextAssembleQ(),900);
  } else {
    state.scores[wk]=Math.max((state.scores[wk]||0)-2,0);state.lives--;
    if(state.lives<=0){state.feedback={type:'gameover',message:correct};render();return;}
    state.feedback={type:'wrong'};state.productionTiles=[...state.userInput,...state.productionTiles];state.userInput=[];state.selectedPlacedIdx=null;
    render();setTimeout(()=>{state.feedback=null;render();},1200);
  }
}
function showProductionHint(){
  if(state.hiddenOptions.length>0)return;state.usedHint=true;
  const wk=state.targetWord.en;state.scores[wk]=Math.max((state.scores[wk]||0)-2,0);
  const ar=state.targetWord.ar;const correctSet=new Set(ar.includes(' ')?ar.split(' '):ar.split(''));
  const wi=state.productionTiles.map((t,i)=>correctSet.has(t)?null:i).filter(i=>i!==null);
  state.hiddenOptions=wi.sort(()=>0.5-Math.random()).slice(0,3);render();
}
function renderProduction(){
  const app=document.getElementById('app');
  const isDead=state.feedback?.type==='gameover';
  const wordXP=state.targetWord?(state.scores[state.targetWord.en]||0):0;
  const stats=getCategoryStats(state.currentCategory);
  const xpStatus=getXpStatus(wordXP);const hintDisabled=wordXP<2||isDead||state.hiddenOptions.length>0;
  const tilesHTML=state.productionTiles.map((tile,idx)=>{
    if(state.hiddenOptions.includes(idx))return'';
    return`<button onclick="selectPoolTile(${idx})" class="pool-tile">${tile}</button>`;
  }).join('');
  const inputHTML=state.userInput.length===0
    ?`<span class="input-bed-empty">tap tiles below to build your answer</span>`
    :state.userInput.map((tile,i)=>`<button onclick="selectPlacedTile(${i})" class="placed-tile ${state.selectedPlacedIdx===i?'selected':''}">${tile}</button>`).join('');
  app.innerHTML=`
    ${isDead?`<div class="death-overlay"><div class="death-card">
      <span class="death-icon">🥀</span>
      <div class="death-title">Harvest Interrupted.</div>
      <div class="death-sub">The field needs tending before it yields.</div>
      <div class="death-answer-label">The answer was</div>
      <div class="death-answer" style="font-family:'Amiri',serif;font-size:1.8rem;direction:rtl;">${state.feedback.message}</div>
      <button onclick="navigate(()=>startAssemble(${state.currentCategory}))" class="death-btn">🌱 Return to the Field</button>
    </div></div>`:''}
    <div class="prod-layout">
      <div class="prod-header">
        <div class="header-container">
          <div class="header-left"><button onclick="returnHome()" class="game-return-btn">RETURN</button></div>
          <div class="header-center" style="gap:4px;font-size:1.1rem;">${'⭐'.repeat(state.lives)}${'⚫'.repeat(3-state.lives)}</div>
          <div class="header-right"><button onclick="showProductionHint()" ${hintDisabled?'disabled':''} class="game-hint-btn" style="opacity:${hintDisabled?'0.3':'1'};">💡 Hint (-2 XP)</button></div>
        </div>
      </div>
      <div class="prod-word-card">
        <div class="word-card" onclick="speak('${state.targetWord.ar.replace(/'/g,"\\'")}',true)">
          <div class="word-card-inner">
            <div class="word-card-label">Spell it in Arabic</div>
            <div class="word-card-word">${state.targetWord.en}</div>
            <div class="word-card-tap">Tap to hear Arabic</div>
          </div>
          <div class="word-xp">
            <div class="word-xp-top"><span class="word-xp-status">${xpStatus}</span><span class="word-xp-num">${wordXP}/50</span></div>
            <div class="xp-bar-track"><div class="xp-bar-fill" style="width:${(wordXP/50)*100}%"></div></div>
          </div>
        </div>
      </div>
      <div class="prod-input-area">
        <div class="input-bed-label">Your answer</div>
        <div class="input-bed" dir="rtl">${inputHTML}</div>
      </div>
      <div class="prod-divider">
        <div style="display:flex;align-items:center;gap:8px;margin:4px 0 8px;opacity:0.35;"><hr style="flex:1;border:0;border-top:1px solid var(--muted);"><span style="font-size:0.8rem;color:var(--muted);">✦</span><hr style="flex:1;border:0;border-top:1px solid var(--muted);"></div>
      </div>
      <div class="prod-tile-area">
        <div class="tile-pool-label">Available tiles</div>
        <div class="tile-pool" dir="rtl">${tilesHTML}</div>
      </div>
      <div class="prod-footer">
        ${state.feedback&&state.feedback.type!=='gameover'?`<div class="feedback-banner ${state.feedback.type}">${state.feedback.type==='correct'?'🌱 Correct! Growing nicely.':'✗ Not quite. Tiles returned — try again.'}</div>`:''}
        <div class="prod-actions">
          <button onclick="submitProduction()" class="btn-submit" ${isDead?'disabled':''}>Submit</button>
          <button onclick="resetInput()" class="btn-reset" ${isDead?'disabled':''}>Reset</button>
        </div>
        <div class="field-progress">
          <div class="field-progress-top"><span class="field-progress-label">Field Progress</span><span class="field-progress-pct">${Math.round(stats.percent)}%</span></div>
          <div class="field-progress-bar-wrap"><span style="font-size:0.85rem;">🌱</span><div class="field-progress-bar"><div class="field-progress-fill" style="width:${stats.percent}%"></div></div></div>
        </div>
      </div>
    </div>`;
}

/* SUMMARY — mode-aware */
function renderSummary(){
  const app=document.getElementById('app');
  const cat=getCat(state.sessionStartCategory);
  const catName=cat?cat.name:'Session';
  const mapIdx=cat?CATEGORIES.indexOf(cat):0;
  const stats=cat?getCategoryStats(cat.id):{percent:0};
  const isAssemble=state.sessionStartMode==='assemble';
  const againLabel=isAssemble?'🧩 Assemble Again':'🌾 Harvest Again';
  const againFn=isAssemble?`startAssemble(${state.sessionStartCategory})`:`startRecall(${state.sessionStartCategory})`;

  app.innerHTML=`
    <div class="summary-scroll">
      <div class="summary-wrap">
        <div class="summary-icon">🌾</div>
        <div class="summary-title">Harvest Complete</div>
        <div class="summary-sub">Level ${mapIdx+1} · ${catName}</div>
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="summary-stat-val">${state.sessionWordsCorrect}</div>
            <div class="summary-stat-label">words recalled</div>
          </div>
          <div class="summary-stat-divider"></div>
          <div class="summary-stat">
            <div class="summary-stat-val">+${state.sessionXPGained}</div>
            <div class="summary-stat-label">XP gained</div>
          </div>
          <div class="summary-stat-divider"></div>
          <div class="summary-stat">
            <div class="summary-stat-val">${state.sessionPeakStreak>0?state.sessionPeakStreak+' 🔥':'—'}</div>
            <div class="summary-stat-label">best streak</div>
          </div>
        </div>
        <div class="summary-progress-wrap">
          <div class="summary-progress-label"><span>Field Progress</span><span>${Math.round(stats.percent)}%</span></div>
          <div class="summary-bar"><div class="summary-bar-fill" style="width:${stats.percent}%"></div></div>
        </div>
        <div class="summary-actions">
          <button onclick="navigate(()=>${againFn})" class="btn-continue-primary">${againLabel}</button>
          <button onclick="navigate(()=>{state.view='home';})" class="btn-continue-ghost">Return to Garden</button>
        </div>
      </div>
    </div>`;
}

function render(){
  if(state.view==='home')renderHome();
  else if(state.view==='game')renderGame();
  else if(state.view==='study')renderStudy();
  else if(state.view==='production')renderProduction();
  else if(state.view==='summary')renderSummary();
}

render();