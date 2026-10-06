(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  let actorId = 0;

  function actor(person, action, className, older = false) {
    const id = `coat-${++actorId}`;
    const marx = person === 'marx', worker = person === 'worker';
    const coat = marx ? '#34302a' : worker ? '#7c705a' : '#776149';
    const hair = marx ? (older ? '#c7bda6' : '#29251f') : '#665039';
    const beard = marx
      ? `<path d="M95 99Q88 128 119 ${older ? '155' : '144'}Q143 135 148 106L135 112Q117 108 106 111Z" fill="${older ? '#c7bda6' : '#30271f'}"/><path d="M102 118l10 13m2-10 6 15m7-14 0 12m7-20-2 13" stroke="${older ? '#8c806c' : '#6d533c'}" stroke-width="1.5"/>`
      : '<path d="M101 110Q113 128 132 115L129 134Q111 140 102 117Z" fill="#765639"/>';
    const prop = action === 'news'
      ? '<path d="M190 210L245 197 249 257 195 266Z" fill="#e3d3b3"/><path d="M199 220l38-9m-37 17 37-9m-36 18 37-9m-35 17 37-9" stroke="#756247" stroke-width="2"/>'
      : action === 'read'
      ? '<path d="M195 217L220 209 242 215V251L220 245 196 253Z" fill="#e3d3b3"/><path d="M220 211V245" stroke="#756247"/>'
      : action === 'walk' && person === 'engels'
      ? '<rect x="190" y="230" width="35" height="44" rx="2" fill="#74342b"/><path d="M197 240h20m-20 7h15" stroke="#c5ae8a" stroke-width="1"/>' : '';
    return `<div class="actor-slot ${className} actor--${action}" aria-hidden="true"><svg viewBox="0 0 240 420">
      <defs><pattern id="${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)"><path d="M0 0V5" stroke="#d2bb95" stroke-opacity=".18" stroke-width=".7"/></pattern></defs>
      <ellipse cx="123" cy="405" rx="67" ry="9" fill="#28221a" opacity=".2"/>
      <g stroke="#28241e" stroke-width="2" stroke-linejoin="round">
        <g class="actor-leg-back"><path d="M109 273L136 281 143 386H119L105 325Z" fill="#514739"/><path d="M119 380H143L159 397Q157 403 137 402H118Z" fill="#28251f"/></g>
        <g class="actor-leg-front"><path d="M85 273L114 277 108 385H84L80 327Z" fill="#403a30"/><path d="M84 380H109L122 396Q120 404 101 402H78Z" fill="#26231e"/></g>
        <g class="actor-torso">
          <g class="actor-arm-back"><path d="M87 159Q63 174 64 219L81 258 97 251 87 216 106 178Z" fill="${coat}"/><path d="M82 249Q68 264 79 277L91 280 102 267 96 249Z" fill="#cba779"/></g>
          <path d="M93 146L140 145Q164 156 163 187L154 256 170 299Q125 313 68 294L82 244 79 182Z" fill="${coat}"/>
          <path d="M93 146L140 145Q164 156 163 187L154 256 170 299Q125 313 68 294L82 244 79 182Z" fill="url(#${id})" stroke="none"/>
          <path d="M105 145L127 144 139 173 122 239 97 172Z" fill="#c7b38e"/>
          <path d="M115 158L121 158 128 183 118 200 113 182Z" fill="#66352b"/>
          <path d="M98 151L85 171 102 183 93 196 119 244M137 151L152 172 137 187 145 199 121 244" fill="none" stroke="#a68e69" stroke-width="1.5"/>
          <path d="M119 244V290" stroke="#1c1a16"/><circle cx="126" cy="243" r="2" fill="#c1aa83"/><circle cx="126" cy="259" r="2" fill="#c1aa83"/>
          <g class="actor-head"><path d="M108 125L108 151 125 157 138 145 132 122Z" fill="#caa475"/><path d="M94 76Q104 51 132 64Q154 72 149 96L155 104 146 109Q145 130 125 135Q101 126 95 110Z" fill="#d8b88b"/>
            <path d="M91 97Q76 84 87 70Q81 56 97 52Q107 40 122 48Q139 42 148 57Q163 66 148 89L137 77Q119 90 104 80L104 105 96 107Z" fill="${hair}"/>
            ${worker ? '<path d="M83 71Q84 43 122 47Q149 47 153 69L164 76H82Z" fill="#454035"/>' : ''}
            <path d="M98 96Q85 89 90 108L101 115" fill="#caa475"/><path d="M128 93l10 0M138 102l6 2" stroke-width="1.5"/><circle cx="133" cy="96" r="1.6" fill="#29241c" stroke="none"/>${worker ? '' : beard}
          </g>
          <g class="actor-arm-front"><path d="M151 161Q172 166 177 195L203 234 189 248 159 221 137 181Z" fill="${coat}"/><path d="M190 231L202 229Q221 236 219 250L209 257 190 251 185 242Z" fill="#d5b080"/>${prop}<path d="M151 178l12 22 26 36" stroke="#b49a72" stroke-opacity=".4" stroke-width="1" fill="none"/></g>
        </g>
      </g>
    </svg>${action === 'meet' ? `<span class="actor-name">${marx ? 'Karl Marx' : 'Friedrich Engels'}</span>` : ''}</div>`;
  }

  const studyDesk = `<svg class="foreground-desk" viewBox="0 0 700 250"><path d="M30 130H670L700 155H0Z" fill="#876c49" stroke="#28251f" stroke-width="3"/><path d="M0 155H700V181H0Z" fill="#55422e"/><path d="M50 181H75V250H50ZM625 181H650V250H625Z" fill="#332b22"/><g class="book"><path d="M275 130L280 94Q340 76 367 104Q405 78 465 97L470 130Z" fill="#f2e8d3" stroke="#28251f" stroke-width="2"/><path d="M367 104V131M291 103L347 99M290 110L349 107M389 106L452 103M389 114L453 112" stroke="#857a67" stroke-width="2"/></g><path d="M130 124V80H154V124" fill="#d4ae69"/><ellipse cx="142" cy="80" rx="12" ry="3" fill="#f0d5a0"/><path class="flame" d="M142 77Q121 56 142 37Q158 59 142 77" fill="#eaaa4a"/><path d="M525 112H554V131H525Z" fill="#26221d"/></svg>`;
  const cafeTable = `<svg class="cafe-table" viewBox="0 0 400 270"><ellipse cx="200" cy="115" rx="185" ry="38" fill="#806345" stroke="#29241e" stroke-width="3"/><path d="M185 146H215L225 240H275V255H125V240H175Z" fill="#40362a"/><path d="M94 109L175 101 200 120 119 130Z" fill="#eee1c8" stroke="#31281e" stroke-width="2"/><path d="M110 112L170 108M118 120L169 115" stroke="#75694f"/><g fill="#e8d9bc" stroke="#31281e" stroke-width="2"><path d="M258 96H288V116H258Z"/><path d="M288 100Q311 102 288 112" fill="none"/></g><path class="coffee-steam" d="M266 88Q257 77 270 65T272 42M279 88Q270 75 284 61" fill="none" stroke="#e8d9bc" stroke-width="3"/></svg>`;
  const writingDesk = `<svg class="writing-desk" viewBox="0 0 700 310"><path d="M20 190H680L700 218H0Z" fill="#775c3e" stroke="#2b261e" stroke-width="3"/><path d="M0 218H700V245H0Z" fill="#3e3225"/><path d="M45 245H75V310H45ZM625 245H655V310H625Z" fill="#2b241c"/><path d="M190 175L479 141 510 205 220 235Z" fill="#ecdfc6" stroke="#514636" stroke-width="2"/><g class="ink-lines" fill="none" stroke="#514636" stroke-width="2" stroke-linecap="round"><path d="M230 178q20-8 36-3t30-6 34-1 27-5 39-1"/><path d="M238 190q16-9 34-3t30-5 32-2 30-4 24-1"/><path d="M246 202q16-5 26-2t24-5 23 0 27-6"/></g><path d="M543 177H573V199H543Z" fill="#25211c"/><g class="quill"><path d="M390 170Q431 95 514 53Q489 114 390 170Z" fill="#d8c7a6" stroke="#514636" stroke-width="2"/><path d="M385 185L505 61" stroke="#514636" stroke-width="2"/></g></svg>`;
  const newspaper = `<svg class="newspaper" viewBox="0 0 330 420"><path d="M12 8H315V405H12Z" fill="#ecdfc4" stroke="#796b53" stroke-width="2"/><text x="164" y="42" text-anchor="middle" fill="#393126" font-family="Georgia" font-size="20" font-weight="bold">Rheinische Zeitung</text><path d="M28 57H297M28 62H297" stroke="#393126"/><text x="164" y="82" text-anchor="middle" fill="#74664f" font-family="monospace" font-size="10">COLOGNE · 1843</text><g stroke="#a4967e" stroke-width="3"><path d="M29 104H146M29 120H146M29 136H146M29 152H146M29 168H146M29 184H146M178 104H295M178 120H295M178 136H295M178 152H295M178 168H295M178 184H295M29 227H146M29 243H146M29 259H146M29 275H146M29 291H146M29 307H146M29 323H146M178 227H295M178 243H295M178 259H295M178 275H295M178 291H295M178 307H295M178 323H295"/></g><g class="censorship-stamp" transform="rotate(-14 165 206)"><rect x="35" y="172" width="265" height="65" rx="3" fill="#eee0c8" stroke="#a93229" stroke-width="5"/><text x="168" y="217" text-anchor="middle" fill="#a93229" font-family="Georgia" font-weight="bold" font-size="37">BỊ CẤM</text></g></svg>`;
  const travel = `<svg class="exile-route" viewBox="0 0 400 100"><path class="route-dash" d="M30 52Q180 2 368 52" fill="none" stroke="#a93229" stroke-width="2" stroke-dasharray="5 7"/><circle cx="30" cy="52" r="5" fill="#a93229"/><circle cx="368" cy="52" r="5" fill="#a93229"/><text x="30" y="85" font-family="monospace" font-size="12" fill="#443b2d">PARIS</text><text x="300" y="85" font-family="monospace" font-size="12" fill="#443b2d">BRUSSELS</text><circle class="route-traveller" r="6" fill="#a93229"><animateMotion dur="4s" repeatCount="indefinite" path="M30 52Q180 2 368 52"/></circle></svg><svg class="exile-case" viewBox="0 0 170 130"><path d="M62 28V13H108V28" fill="none" stroke="#423225" stroke-width="7"/><rect x="5" y="28" width="160" height="98" rx="8" fill="#795d40" stroke="#3c3022" stroke-width="3"/><path d="M35 28V126M135 28V126" stroke="#c0a275" stroke-width="8"/><path d="M31 54H39V75H31ZM131 54H139V75H131Z" fill="#d8b77c"/><rect x="59" y="61" width="51" height="28" fill="#dec9a3" transform="rotate(-12 83 75)"/></svg>`;
  const press = `<svg class="printing-press" viewBox="0 0 480 450"><path d="M67 65H92V417H67ZM384 65H409V417H384Z" fill="#47392b" stroke="#251f18" stroke-width="3"/><path d="M46 55H430V89H46ZM45 400H431V434H45Z" fill="#795f40" stroke="#251f18" stroke-width="3"/><path d="M229 90H251V225H229Z" fill="#39342c"/><g class="press-platen"><path d="M133 231H350V262H133Z" fill="#5d4c36" stroke="#251f18" stroke-width="3"/><path d="M158 262H324V282H158Z" fill="#2c2820"/></g><path d="M100 319H376V340H100Z" fill="#9d7e52" stroke="#251f18" stroke-width="3"/><g class="printed-sheet"><path d="M155 294H339V412H155Z" fill="#efe0bd" stroke="#917d59"/><text x="247" y="331" text-anchor="middle" font-family="Georgia" font-size="15" fill="#a93229">TUYÊN NGÔN</text><text x="247" y="355" text-anchor="middle" font-family="monospace" font-size="11" fill="#4b3e2b">MARX &amp; ENGELS</text><path d="M177 375H317M177 386H317M177 397H275" stroke="#998768" stroke-width="2"/></g><g class="press-handle"><path d="M238 134L375 94" stroke="#47392b" stroke-width="9" stroke-linecap="round"/><circle cx="376" cy="94" r="12" fill="#332b22"/></g></svg>`;
  const rent = `<svg class="rent-notice" viewBox="0 0 160 190"><path d="M8 5H151V179H8Z" fill="#d9c9ab" stroke="#72634d"/><text x="80" y="53" text-anchor="middle" fill="#554736" font-family="Georgia" font-size="24">RENT</text><path d="M25 72H134M25 87H134M25 102H105M25 135H134" stroke="#958569" stroke-width="2"/><text x="105" y="163" fill="#9d4936" font-family="Georgia" font-size="30">£</text></svg>`;
  const capital = `<svg class="capital-book" viewBox="0 0 380 490"><path d="M42 20L345 39V458L42 434Z" fill="#bc995e" stroke="#352a1e" stroke-width="4"/><path d="M42 434L345 458 328 475 30 450Z" fill="#e1ceb0" stroke="#554532" stroke-width="2"/><path d="M30 13L53 22V447L30 450Z" fill="#843b2b" stroke="#352a1e" stroke-width="3"/><path d="M66 52L318 68V425L66 407Z" fill="none" stroke="#e6ce99" stroke-width="2"/><path d="M77 64L307 79V412L77 395Z" fill="none" stroke="#79552d"/><text x="191" y="139" text-anchor="middle" fill="#4d3022" font-family="Georgia" font-size="15" letter-spacing="3">KARL MARX</text><text x="191" y="205" text-anchor="middle" fill="#4d3022" font-family="Georgia" font-size="32" font-weight="bold">DAS KAPITAL</text><text x="191" y="247" text-anchor="middle" fill="#4d3022" font-family="monospace" font-size="13" letter-spacing="2">QUYỂN I</text><path d="M140 288H242" stroke="#7e5b30" stroke-width="2"/><text x="191" y="354" text-anchor="middle" fill="#4d3022" font-family="Georgia" font-size="28">1867</text><path class="book-shine" d="M83 87L297 102" stroke="#f6e4bc" stroke-width="2"/></svg>`;
  const scenes = [
    {id:'gioi-thieu', style:'intro', theme:'paper', date:'1818–1883 · Giới thiệu', stop:'Một đời, một hành trình', title:'Karl<br><i>Marx.</i>', hook:'Một ngòi bút. Một đời biến động.', insight:'Triết gia, nhà báo và nhà kinh tế người Đức. Từ những câu hỏi về xã hội đến tình bạn với Engels, hãy cùng đi qua sáu bước ngoặt trong cuộc đời ông.', name:'Khởi đầu từ Trier, Đức · Theo dấu một cuộc đời', image:'trier-intro.webp', art:actor('marx','read','marx-intro',true)},
    {id:'kiem-duyet', style:'study', theme:'paper', date:'Cologne · 1843', stop:'Tờ báo bị cấm', title:'Ngòi bút.<br><i>Bị chặn.</i>', insight:'Rheinische Zeitung bị cấm. Marx rời nước Đức, bắt đầu hành trình lưu vong.', name:'Karl Marx · 25 tuổi · Rheinische Zeitung', image:'cologne-newsroom.webp', art:actor('marx','news','marx-reader') + studyDesk + newspaper},
    {id:'engels', style:'meeting', theme:'paper', date:'Paris · 08.1844', stop:'Mười ngày, một đời bạn', title:'Mười ngày.<br><i>Cả một đời.</i>', insight:'Gặp Friedrich Engels. Cộng sự suốt đời.', name:'Karl Marx & Friedrich Engels · Cuộc gặp ở Paris', image:'paris-cafe.webp', art:actor('marx','meet','marx-meeting') + actor('engels','meet','engels-meeting') + cafeTable + '<span class="meeting-spark">✦</span>'},
    {id:'luan-de-11', style:'writing', theme:'paper', date:'Paris → Brussels · 1845', stop:'Bị trục xuất, vẫn viết', title:'Bị trục xuất.<br><i>Vẫn viết.</i>', insight:'Brussels. Luận đề 11 ra đời.', name:'Karl Marx · Từ lưu vong đến Luận đề 11', image:'paris-study.webp', art:actor('marx','write','marx-writer') + writingDesk + travel + '<div class="thesis-mark">XI<span>1845</span></div>'},
    {id:'tuyen-ngon', style:'manifesto', theme:'dark', date:'London · 02.1848', stop:'Tuyên ngôn giữa biến động', title:'Tuyên ngôn.<br><i>Giữa biến động.</i>', insight:'Marx & Engels. Một lời kêu gọi.', name:'Karl Marx & Friedrich Engels · Châu Âu trong năm cách mạng', image:'workers-square.webp', art:actor('marx','read','marx-manifesto') + actor('engels','read','engels-manifesto') + press + '<svg class="banner" viewBox="0 0 200 350"><path d="M38 28V350" stroke="#332820" stroke-width="6"/><path class="flag-cloth" d="M40 31Q100 4 172 32L157 126Q102 97 40 119Z" fill="#a12d25" stroke="#4d231e" stroke-width="2"/></svg>'},
    {id:'london', style:'poverty', theme:'dark', date:'London · 1849', stop:'Lưu vong và nghèo khó', title:'Lưu vong.<br><i>Không bỏ cuộc.</i>', insight:'Nghèo khó. Tiếp tục nghiên cứu.', name:'Karl Marx · Một khởi đầu khó khăn ở London', image:'london-attic.webp', art:actor('marx','write','marx-writer') + writingDesk + rent},
    {id:'tu-ban', style:'capital', theme:'paper', date:'London → Hamburg · 1867', stop:'Tư bản xuất bản', title:'Tư bản.<br><i>Sau bao năm.</i>', insight:'Quyển I xuất bản. Một đời nghiên cứu.', name:'Karl Marx · 49 tuổi · Das Kapital', image:'london-library.webp', art:actor('marx','read','marx-capital',true) + capital}
  ];
  const number = i => String(i + 1).padStart(2, '0');
  $('#journey').innerHTML = scenes.map((s, i) => `<section class="node node--${s.style}${i === 0 ? ' is-active' : ''}" id="${s.id}" data-theme="${s.theme}" aria-labelledby="title-${s.id}"><div class="scene-art" aria-hidden="true"><img class="backdrop" src="img/${s.image}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>${s.art}</div><div class="scene-caption"><p class="scene-date">${number(i)} / ${s.date}</p><${i ? 'h2' : 'h1'} id="title-${s.id}">${s.title}</${i ? 'h2' : 'h1'}>${s.hook ? `<p class="milestone-title">${s.hook}</p>` : ''}<p class="recognition">${s.insight}</p>${i === scenes.length - 1 ? '<button class="end-note" data-open-notes type="button">Nhìn lại hành trình ↗</button>' : ''}</div><span class="scene-name">${s.name}</span></section>`).join('');
  $('#timelineStops').innerHTML = scenes.map((s, i) => `<li><a href="#${s.id}" ${i === 0 ? 'aria-current="step"' : ''}><b>${number(i)}</b><span><small>${s.date}</small>${s.stop}</span></a></li>`).join('');

  const nodes = [...document.querySelectorAll('.node')];
  const links = [...document.querySelectorAll('.timeline a')];
  const notes = $('#notes');
  let active = -1, settleUntil = 0, lastWheel = -Infinity, gestureUsed = false, wheelSum = 0, framePending = false;
  const music = new JourneyMusic($('#musicToggle'), $('#musicLabel'));
  function syncMotion() {
    nodes.forEach((node, i) => node.querySelectorAll('svg').forEach(svg => {
      if (i === active && !reduced.matches) svg.unpauseAnimations();
      else svg.pauseAnimations();
    }));
  }
  reduced.addEventListener('change', syncMotion);
  function update() {
    const offsets = nodes.map(node => node.getBoundingClientRect().top + scrollY);
    let nearest = 0;
    offsets.forEach((y, i) => { if (Math.abs(y - scrollY) < Math.abs(offsets[nearest] - scrollY)) nearest = i; });
    if (nearest !== active) {
      active = nearest;
      nodes.forEach((node, i) => node.classList.toggle('is-active', i === active));
      links.forEach((link, i) => i === active ? link.setAttribute('aria-current', 'step') : link.removeAttribute('aria-current'));
      const dark = scenes[active].theme === 'dark';
      document.documentElement.style.setProperty('--current-ink', dark ? '#f0e6d2' : '#27241e');
      document.documentElement.style.setProperty('--current-paper', dark ? '#25231e' : '#e8e1d3');
      $('#stepCount').innerHTML = `${number(active)} <i>/ ${number(scenes.length - 1)}</i>`;
      $('#previous').disabled = active === 0;
      $('#next').disabled = active === nodes.length - 1;
      syncMotion();
      music.setScene(active);
    }
    let segment = 0;
    while (segment < offsets.length - 2 && scrollY > offsets[segment + 1]) segment++;
    const fraction = clamp((scrollY - offsets[segment]) / Math.max(1, offsets[segment + 1] - offsets[segment]));
    const progress = clamp((segment + fraction) / (nodes.length - 1));
    $('#timelineFill').style.transform = `scaleY(${progress})`;
    $('#timelineRunner').style.top = `${progress * 100}%`;
  }
  function go(index, instant = false) {
    index = clamp(index, 0, nodes.length - 1);
    settleUntil = performance.now() + (reduced.matches || instant ? 100 : 750);
    nodes[index].scrollIntoView({behavior: reduced.matches || instant ? 'instant' : 'smooth', block:'start'});
    // Replacing the hash keeps back navigation from accumulating every scene.
    history.replaceState(null, '', `#${scenes[index].id}`);
    if (instant || reduced.matches) update();
  }
  addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => { framePending = false; update(); });
  }, {passive:true});
  addEventListener('wheel', event => {
    if (event.ctrlKey || notes.open || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel > 200) {gestureUsed = false; wheelSum = 0;}
    lastWheel = now;
    if (gestureUsed || now < settleUntil) {gestureUsed = true; return;}
    const delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
    if (Math.sign(delta) !== Math.sign(wheelSum)) wheelSum = 0;
    wheelSum += delta;
    if (Math.abs(wheelSum) >= 18) {gestureUsed = true; go(active + Math.sign(wheelSum));}
  }, {passive:false});
  addEventListener('keydown', event => {
    if (notes.open || event.target.closest('button,a,input,summary,textarea,select')) return;
    const directions = {ArrowDown:1, PageDown:1, ArrowUp:-1, PageUp:-1, ' ':event.shiftKey ? -1 : 1};
    if (event.key in directions) {event.preventDefault(); if (performance.now() >= settleUntil) go(active + directions[event.key]);}
    if (event.key === 'Home' || event.key === 'End') {event.preventDefault(); go(event.key === 'Home' ? 0 : nodes.length - 1);}
  });
  $('#previous').addEventListener('click', () => go(active - 1));
  $('#next').addEventListener('click', () => go(active + 1));
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) {
      const index = scenes.findIndex(scene => '#' + scene.id === anchor.getAttribute('href'));
      if (index >= 0) {event.preventDefault(); go(index);}
    }
    if (event.target.closest('[data-open-notes]')) {notes.showModal(); document.documentElement.style.overflow = 'hidden';}
  });
  $('.close-notes').addEventListener('click', () => notes.close());
  notes.addEventListener('close', () => {document.documentElement.style.overflow = '';});
  notes.addEventListener('click', event => {
    if (event.target !== notes) return;
    const bounds = notes.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) notes.close();
  });
  let resizeTimer;
  addEventListener('resize', () => {clearTimeout(resizeTimer); resizeTimer = setTimeout(() => go(Math.max(0, active), true), 120);});
  addEventListener('hashchange', () => {
    const index = scenes.findIndex(scene => '#' + scene.id === location.hash);
    if (index >= 0) go(index);
  });
  const initial = scenes.findIndex(scene => '#' + scene.id === location.hash);
  requestAnimationFrame(() => {go(Math.max(0, initial), true); update();});
})();
