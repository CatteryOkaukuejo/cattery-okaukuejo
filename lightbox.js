/* Cattery Okaukuejo - foto's vergroten bij de nestpagina's.
   Klik op een foto in .photo-masonry: de foto wordt groot getoond.
   Pijltjes (of vegen op een telefoon) = vorige/volgende, Esc of kruisje = sluiten. */
(function () {
  function start() {
    var pics = Array.prototype.slice.call(document.querySelectorAll('.photo-masonry img'));
    if (!pics.length) return;

    var css = document.createElement('style');
    css.textContent =
      '.photo-masonry img{cursor:zoom-in;}' +
      '#cattery-lightbox{display:none;position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;}' +
      '#cattery-lightbox.open{display:flex;}' +
      '#cattery-lightbox img{max-width:92vw;max-height:90vh;width:auto;height:auto;object-fit:contain;box-shadow:0 4px 30px rgba(0,0,0,.5);}' +
      '#cattery-lightbox button{position:absolute;background:rgba(255,255,255,.18);color:#fff;border:0;border-radius:50%;width:48px;height:48px;font-size:26px;line-height:48px;cursor:pointer;padding:0;}' +
      '#cattery-lightbox button:hover{background:rgba(255,255,255,.32);}' +
      '#cattery-lightbox .lb-close{top:16px;right:16px;}' +
      '#cattery-lightbox .lb-prev{left:16px;top:50%;margin-top:-24px;}' +
      '#cattery-lightbox .lb-next{right:16px;top:50%;margin-top:-24px;}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'cattery-lightbox';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Sluiten">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="Vorige">&#8249;</button>' +
      '<img src="" alt="">' +
      '<button type="button" class="lb-next" aria-label="Volgende">&#8250;</button>';
    document.body.appendChild(box);

    var big = box.querySelector('img');
    var cur = 0;

    function show(i) {
      cur = (i + pics.length) % pics.length;
      big.src = pics[cur].src;
      big.alt = pics[cur].alt;
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
    }
    function hide() {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      big.src = '';
    }

    pics.forEach(function (p, i) {
      p.addEventListener('click', function () { show(i); });
    });
    box.querySelector('.lb-close').addEventListener('click', hide);
    box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
    box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target === big) hide(); });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });

    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(dx > 0 ? cur - 1 : cur + 1);
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
