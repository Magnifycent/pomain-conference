document.addEventListener('DOMContentLoaded', function () {

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

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function wireUpForm(form, statusEl) {
    if (!form || !statusEl) return;

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
        statusEl.textContent = 'Please fill in all required fields correctly.';
        statusEl.classList.add('status-error', 'status-visible');
        firstInvalid.focus();
        return;
      }

      submitBtn.disabled = true;
      btnText.textContent = 'Submitting...';
      btnSpinner.hidden = false;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
      })
        .then(() => {
          statusEl.textContent = 'Thank you! Your registration has been submitted successfully.';
          statusEl.classList.add('status-success', 'status-visible');
          form.reset();
        })
        .catch((error) => {
          console.error('Submission error:', error);
          statusEl.textContent = 'Something went wrong. Please try again or contact us directly.';
          statusEl.classList.add('status-error', 'status-visible');
        })
        .finally(() => {
          submitBtn.disabled = false;
          btnText.textContent = btnText.dataset.original || 'Submit';
          btnSpinner.hidden = true;
        });
    });

    // remember original button label
    btnText.dataset.original = btnText.textContent;
  }

  wireUpForm(document.getElementById('volunteer-form'), document.getElementById('form-status'));
  wireUpForm(document.getElementById('attendee-form'), document.getElementById('attendee-form-status'));

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
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  setTimeout(() => {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }, 2500);

});