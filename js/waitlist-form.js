function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initWaitlistForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    const input = form.querySelector('input[type="email"]');
    const status = form.querySelector('.form__status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = input.value.trim();

      if (!isValidEmail(email)) {
        status.textContent = 'Неверный формат. Проверьте адрес.';
        status.classList.add('form__status--error');
        return;
      }

      status.classList.remove('form__status--error');
      status.textContent = 'Принято. Ждите сигнала.';
      form.reset();
    });
  }

  const telegramLink = document.querySelector('[data-telegram-placeholder]');
  if (telegramLink) {
    telegramLink.addEventListener('click', (event) => {
      event.preventDefault();
      alert('Регистрация через Telegram откроется отдельно, после публикации бота.');
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidEmail, initWaitlistForm };
}
if (typeof window !== 'undefined') {
  window.CikadaWaitlistForm = { isValidEmail, initWaitlistForm };
}
