document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('volunteer-form');
  const statusEl = document.getElementById('form-status');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  if (form) {
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      const requiredFields = form.querySelectorAll('[required]');
      let firstInvalid = null;

      requiredFields.forEach((field) => {
        field.classList.remove('input-error');
        const value = field.value.trim();

        if (!value) {
          field.classList.add('input-error');
          if (!firstInvalid) firstInvalid = field;
        }

        if (field.type === 'email' && value && !isValidEmail(value)) {
          field.classList.add('input-error');
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (firstInvalid) {
        showStatus('Please fill in all required fields correctly.', 'error');
        firstInvalid.focus();
        return;
      }

      setLoading(true);

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
      })
        .then(() => {
          showStatus('Thank you! Your application has been submitted successfully.', 'success');
          form.reset();
        })
        .catch((error) => {
          console.error('Submission error:', error);
          showStatus('Something went wrong. Please try again or contact us directly.', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    });

    function setLoading(isLoading) {
      submitBtn.disabled = isLoading;
      btnText.textContent = isLoading ? 'Submitting...' : 'Submit Application';
      btnSpinner.hidden = !isLoading;
    }

    function showStatus(message, type) {
      statusEl.textContent = message;
      statusEl.classList.add(`status-${type}`, 'status-visible');
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // ---- Fade-in on scroll, with a safety fallback ----
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // Browser doesn't support IntersectionObserver — just show everything
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  // Failsafe: force everything visible after 2.5s no matter what,
  // in case the observer never fires for any reason
  setTimeout(() => {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }, 2500);

});