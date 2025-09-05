document.addEventListener('DOMContentLoaded', function () {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');
  var captionEl = document.getElementById('lightbox-caption');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);
  var gallery = Array.prototype.slice.call(document.querySelectorAll('.lightbox-trigger'));
  var currentIndex = -1;
  
  function openLightbox(src, caption, index) {
    lightboxImg.src = src;
    captionEl.textContent = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('open');
    closeBtn.focus();
    if (typeof index === 'number') currentIndex = index;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.removeAttribute('src');
  }

  document.querySelectorAll('.lightbox-trigger').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var src = link.getAttribute('data-src') || link.getAttribute('href');
      var card = link.closest('.card');
      var title = card ? card.querySelector('h3') : null;
      var caption = title ? title.textContent : '';
      var index = gallery.indexOf(link);
      openLightbox(src, caption, index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function showByOffset(delta) {
    if (!gallery.length) return;
    currentIndex = (currentIndex + delta + gallery.length) % gallery.length;
    var link = gallery[currentIndex];
    var src = link.getAttribute('data-src') || link.getAttribute('href');
    var card = link.closest('.card');
    var title = card ? card.querySelector('h3') : null;
    var caption = title ? title.textContent : '';
    openLightbox(src, caption, currentIndex);
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () { showByOffset(-1); });
    nextBtn.addEventListener('click', function () { showByOffset(1); });
  }
  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'ArrowLeft') showByOffset(-1);
      if (e.key === 'ArrowRight') showByOffset(1);
    }
  });

  // Scrollspy
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('.nav a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -60% 0px', threshold: 0.25 });

    sections.forEach(function (sec) { observer.observe(sec); });
  }

  // Smooth scroll with sticky header offset
  var header = document.querySelector('.site-header');
  var inPageLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
  inPageLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8; // small gap
      window.scrollTo({ top: top, behavior: 'smooth' });
      // update URL hash without jumping
      history.replaceState(null, '', hash);
    });
  });
});

