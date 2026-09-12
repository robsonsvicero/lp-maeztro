document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  document.querySelectorAll('.lead-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
      }
    });
  });


// Modal Legal (Termos e Privacidade)
  const modal = document.getElementById('legal-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModal = document.getElementById('close-modal');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  const openModal = (title, content) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const hideModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  const privacyBtn = document.getElementById('open-privacy');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('Política de Privacidade', `
        <p>O MAEZTRO Gestão valoriza sua privacidade e a confidencialidade das suas informações pedagógicas e financeiras.</p>
        <p>Seus dados cadastrais (nome, WhatsApp, atuação e faturamento informado) são utilizados exclusivamente para fins de criação e suporte da sua conta de teste durante os 14 dias.</p>
        <p>Não comercializamos nem compartilhamos seus dados com terceiros. A qualquer momento você pode solicitar a exclusão total dos seus dados de nossa base.</p>
      `);
    });
  }

  const termsBtn = document.getElementById('open-terms');
  if (termsBtn) {
    termsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('Termos de Uso', `
        <p>O período de teste gratuito concede direito de uso das ferramentas do MAEZTRO Gestão por 14 dias consecutivos a partir do cadastro.</p>
        <p>O usuário é responsável pela veracidade dos dados inseridos e pela correta gestão das aulas e recibos emitidos aos seus alunos.</p>
        <p>O serviço não possui cláusula de fidelidade obrigatória e pode ser cancelado pelo usuário a qualquer momento sem penalidades.</p>
      `);
    });
  }

  if (closeModal) closeModal.addEventListener('click', hideModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', hideModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });
  }
});
