(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  /* ============ BUKA SAMUL ============ */
  var cover = document.getElementById('cover');
  var navbar = document.getElementById('navbar');
  var openBtn = $('openBtn');

  openBtn.addEventListener('click', function () {
    cover.classList.add('hidden');
    navbar.classList.remove('hidden');
    document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
  });

  /* ============ NAVBAR: sembunyikan/tampilkan saat scroll ============ */
  window.addEventListener('scroll', function () {
    var show = cover.classList.contains('hidden');
    if (show && window.scrollY < 40) {
      navbar.classList.add('hidden');
    } else if (show) {
      navbar.classList.remove('hidden');
    }
  });

  /* ============ LIGHTBOX GALERI ============ */
  var lightbox = $('lightbox');
  var lbImg = $('lbImg');
  var lbCap = $('lbCap');
  var lbClose = $('lbClose');
  var photos = document.querySelectorAll('.photo, .polaroid, .thumb-row img');
  var currentSrc = '';
  var lbSources = [];

  function buildSources() {
    var list = document.querySelectorAll('.gallery .photo');
    lbSources = Array.prototype.slice.call(list).map(function (ph) {
      return { src: ph.getAttribute('data-src'), lbl: ph.getAttribute('data-lbl') };
    });
  }

  function openLightbox(src, lbl) {
    lbImg.src = src;
    lbCap.textContent = lbl || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery .photo').forEach(function (ph) {
    ph.addEventListener('click', function () {
      openLightbox(ph.getAttribute('data-src'), ph.getAttribute('data-lbl'));
    });
  });

  document.querySelectorAll('.timeline .polaroid').forEach(function (p) {
    p.addEventListener('click', function () {
      var img = p.querySelector('img');
      openLightbox(img.getAttribute('src'), p.getAttribute('data-caption') || '');
    });
  });

  document.querySelectorAll('.thumb-row img').forEach(function (t) {
    t.addEventListener('click', function () {
      openLightbox(t.getAttribute('src'), t.getAttribute('alt') || '');
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeLightbox(); closeLetter(); } });

  /* ============ MEMORY JAR ============ */
  var jarBtn = $('jarBtn');
  var jarNote = $('jarNote');

  var memories = [
    'First date kita di bulan April. Deg-degannya masih kerasa sampai sekarang. \u2764',
    'Sendirian kopi di Sakuta Coffee tiba-tiba jadi lebih seru karena kamu ada.',
    'Ultahmu ke-21 di Bintaro Xchange. Senyum kagetmu itu hadiah buatku.',
    'Candaan receh yang cuma kita berdua yang ngerti.',
    'Jalan sore sambil genggam tangan, nggak perlu ke mana-mana.',
    'Kamu bilang suka... dan hatiku langsung hangat.',
    'Pesan selamat pagi yang bikin hari jadi lebih cerah.',
    'Kamu nyanyi lagu favoritmu dan ketawamu bikin semuanya membaik.',
    'Masih banyak momen kecil yang aku simpan diam-diam di sini. \u2661',
    'I love you, Ara. Catatan terakhir dari toples kecil ini.'
  ];

  // KAMU BISA TAMBAH / UBAH kenangan di daftar "memories" di atas ayat script ini.

  var lastMemory = -1;

  jarBtn.addEventListener('click', function () {
    jarBtn.classList.add('jar-shake');
    setTimeout(function () { jarBtn.classList.remove('jar-shake'); }, 550);

    var idx;
    do {
      idx = Math.floor(Math.random() * memories.length);
    } while (memories.length > 1 && idx === lastMemory);
    lastMemory = idx;

    jarNote.classList.add('filled');
    jarNote.innerHTML = '<span class="caveat">' + memories[idx] + '</span>';
  });

  /* ============ AMPLOP SURAT ============ */
  var envBtn = $('envBtn');
  var letterModal = $('letterModal');
  var letterClose = $('letterClose');

  function openLetter() {
    letterModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLetter() {
    letterModal.classList.add('hidden');
    document.body.style.overflow = '';
    envBtn.classList.remove('open');
  }

  envBtn.addEventListener('click', function () {
    envBtn.classList.add('open');
    setTimeout(openLetter, 450);
  });

  letterClose.addEventListener('click', closeLetter);
  letterModal.addEventListener('click', function (e) { if (e.target === letterModal) closeLetter(); });

  /* ============ KEMBALI KE ATAS ============ */
  $('toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ MUNCUL SAAT SCROLL (reveal) ============ */
  var revealEls = document.querySelectorAll('.polaroid-stack, .tl-text, .momen-card, .photo, .note, .prayer-card');
  // Reveal sederhana: beri delay bertingkat agar terasa hidup di mobile.

  console.log('Srapbook Ibi & Ara dimuat. \u2764');
  buildSources();
})();