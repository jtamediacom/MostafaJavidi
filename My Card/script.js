document.addEventListener('DOMContentLoaded', () => {

  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);

  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Copied'))
        .catch(() => fallback(text));
    } else {
      fallback(text);
    }
  }

  function fallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Copied'); }
    catch { showToast('Failed'); }
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href') || '';

      // ----- لینک tel: -----
      if (href.startsWith('tel:')) {
        if (isMobile) {
          // روی موبایل: بگذار مرورگر خودش اپ تماس را باز کند،
          // سیستم‌عامل شماره را در فیلد شماره‌گیری قرار می‌دهد.
          return;
        }
        // روی دسکتاپ: tel: کار نمی‌کند، پس کپی کن
        e.preventDefault();
        copy(item.dataset.copy || href.replace('tel:', ''));
        return;
      }

      // ----- Ctrl/Cmd + کلیک = کپی -----
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const txt = item.dataset.copy || item.querySelector('.value')?.textContent?.trim();
        if (txt) copy(txt);
      }
    });
  });

  // انیمیشن ورود پله‌ای
  document.querySelectorAll('.contact-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 60);
  });
});