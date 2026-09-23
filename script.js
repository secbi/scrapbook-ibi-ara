(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var book = $('book');
  var pages = Array.prototype.slice.call(book.querySelectorAll('.page'));
  var total = pages.length;
  var current = 0;
  var busy = false;

  var prevBtn = $('prevBtn');
  var nextBtn = $('nextBtn');
  var curPg = $('curPg');
  var totPg = $('totPg');
  var curTitle = $('curTitle');

  totPg.textContent = total;

  /* ============ FUNGSI FLIP BUKU ============ */
  function onTransformEnd(el, cb) {
    var done = false;
    function h(e) {
      if (e && e.propertyName && e.propertyName !== 'transform') return;
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', h);
      cb();
    }
    el.addEventListener('transitionend', h);
    window.setTimeout(h, 1100);
  }

  function relayout() {
    /* paksa reflow agar transisi berjalan */
    void book.offsetWidth;
  }

  function refreshUI() {
    var p = pages[current];
    curPg.textContent = current + 1;
    curTitle.textContent = p.getAttribute('data-title') || '';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    /* siapkan pemutar lagu saat halaman lagu terbuka */
    var player = p.querySelector('audio');
    if (player && player.paused && player.readyState === 0) {
      try { player.load(); } catch (e) { /* abaikan */ }
    }
  }

  function goNext() {
    if (busy) return;
    if (current >= total - 1) return;

    busy = true;
    var leaf = pages[current];

    leaf.classList.add('flipping');
    relayout();
    leaf.classList.remove('current');
    leaf.classList.add('flipped');

    current += 1;
    pages[current].classList.add('current');

    onTransformEnd(leaf, function () {
      leaf.classList.remove('flipping');
      busy = false;
      refreshUI();
    });
    refreshUI();
  }

  function goPrev() {
    if (busy) return;
    if (current <= 0) return;

    busy = true;
    var leaf = pages[current - 1]; /* balik dari tumpukan kiri ke kanan */

    leaf.classList.add('flipping');
    relayout();
    leaf.classList.remove('flipped');

    current -= 1;
    pages[current].classList.add('current');

    onTransformEnd(leaf, function () {
      leaf.classList.remove('flipping');
      busy = false;
      refreshUI();
    });
    refreshUI();
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  /* swipe utk perangkat sentuh */
  var touchX = null;
  book.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) goNext();
    else goPrev();
  }, { passive: true });

  /* tombol favicon samul */
  $('openBook').addEventListener('click', goNext);

  /* ============ AUTO PLAY LAGU ============ */
  var audioStarted = false;

  function tryPlay() {
    if (audioStarted) return;
    var a = document.getElementById('songPlayer');
    if (!a) return;
    a.volume = 0.5;
    var pr = a.play();
    if (pr) {
      pr.then(function () { audioStarted = true; }).catch(function () { /* browser blokir, coba lagi saat interaksi berikutnya */ });
    }
  }

  /* coba otomatis setelah halaman dimuat */
  window.setTimeout(tryPlay, 400);

  /* mulai dari interaksi pertama pengguna (klik/tombol/sentuh) */
  ['click', 'keydown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, function listener() {
      tryPlay();
      /* tetap pasang, karena gesture kedua mungkin yang diizinkan browser */
      if (audioStarted) document.removeEventListener(ev, listener);
    });
  });

  refreshUI();

  /* ============ LIGHTBOX ============ */
  var lightbox = $('lightbox');
  var lbImg = $('lbImg');
  var lbCap = $('lbCap');

  function openLightbox(src, lbl) {
    lbImg.src = src;
    lbCap.innerHTML = lbl || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.polaroid[data-src]').forEach(function (ph) {
    ph.addEventListener('click', function () {
      openLightbox(ph.getAttribute('data-src'), ph.getAttribute('data-lbl'));
    });
  });

  $('lbClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

  /* ============ MEMORY JAR ============ */
  var jarBtn = $('jarBtn');
  var jarNote = $('jarNote');

  var memories = [
    'First date kita bulan April. Deg-degannya sampai sekarang masih terasa ,  dan aku bersyukur kita memutuskan untuk bertemu.',
    'Sendirian di Sakuta Coffee tiba-tiba terasa lebih hangat, karena aku duduk di seberangmu.',
    'Ultahmu ke-21 di Bintaro Xchange. Senyum kagetmu waktu melihat kejutannya adalah hadiah terbaik untuk semua persiapan.',
    'Candaan-candaan receh yang hanya kita berdua yang mengerti. Lucunya tidak semua orang paham ,  dan itu justru bikin spesial.',
    'Jalan sore sambil menggenggam tangan, tidak perlu ke mana-mana, niatnya cuma menemani.',
    'Saat kamu bilang \u201caku suka sama kamu\u201d ,  dan seluruh dunia terasa berhenti sejenak untuk memberitahuku bahwa ini nyata.',
    'Pesan selamat pagi yang selalu berhasil membuat hari-hari berat terasa lebih ringan.',
    'Kamu menyanyikan lagu favoritmu dengan nada yang tidak pernah pas ,  dan tertawaku jadi lebih keras dari lagunya.',
    'Sebuah doa: \u201cTuhan, izinkan aku ada di setiap ulang tahunnya, mulai sekarang.\u201d',
    'Catatan terakhir dari toples ini: I love you, Ara. Lebih dari yang bisa dituliskan.'
  ];

  // KAMU BISA TAMBAH / HAPUS kenangan pada daftar "memories" di script.js

  var lastMemory = -1;

  jarBtn.addEventListener('click', function () {
    jarBtn.classList.add('jar-shake');
    window.setTimeout(function () { jarBtn.classList.remove('jar-shake'); }, 550);

    var idx;
    do {
      idx = Math.floor(Math.random() * memories.length);
    } while (memories.length > 1 && idx === lastMemory);
    lastMemory = idx;

    jarNote.classList.add('filled');
    jarNote.innerHTML = memories[idx];
  });

  /* ============ AMPLOP SURAT ============ */
  var envBtn = $('envBtn');
  var letterModal = $('letterModal');

  envBtn.addEventListener('click', function () {
    envBtn.classList.add('open');
    window.setTimeout(function () {
      letterModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }, 500);
  });

  $('letterClose').addEventListener('click', function () {
    letterModal.classList.add('hidden');
    document.body.style.overflow = '';
    envBtn.classList.remove('open');
  });
  letterModal.addEventListener('click', function (e) {
    if (e.target === letterModal) {
      letterModal.classList.add('hidden');
      document.body.style.overflow = '';
      envBtn.classList.remove('open');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  console.log('Buku Kenangan Ibi & Ara dimuat. \u2661');
})();