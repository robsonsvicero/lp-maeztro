/**
 * MAEZTRO Gestão — Comportamentos Interativos
 * - Island Nav & Menu Mobile com Staggered Mask Reveal
 * - Scroll Reveal via IntersectionObserver
 * - Tagline Reveal Section com Ativação Palavra por Palavra (B11)
 * - FAQ Accordion
 * - Envio Formspree via AJAX com validação e estados (Loading, Erro, Sucesso)
 * - Modal Interativo para Políticas e Termos
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ano dinâmico no rodapé
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 1. Mobile Menu Fluid Expansion
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    menuToggle.setAttribute('aria-expanded', menuOpen);
    if (menuOpen) {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
      bar1.classList.add('rotate-45', 'translate-y-1.5');
      bar2.classList.add('opacity-0');
      bar3.classList.add('-rotate-45', '-translate-y-1.5');
      
      mobileNavLinks.forEach((link, idx) => {
        setTimeout(() => {
          link.classList.remove('translate-y-8', 'opacity-0');
          link.classList.add('translate-y-0', 'opacity-100');
        }, 80 * (idx + 1));
      });
    } else {
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      bar1.classList.remove('rotate-45', 'translate-y-1.5');
      bar2.classList.remove('opacity-0');
      bar3.classList.remove('-rotate-45', '-translate-y-1.5');
      
      mobileNavLinks.forEach((link) => {
        link.classList.remove('translate-y-0', 'opacity-100');
        link.classList.add('translate-y-8', 'opacity-0');
      });
    }
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (menuOpen) toggleMenu();
      });
    });
  }

  // 2. Scroll Reveal com IntersectionObserver (sem scroll contínuo pesado)
  const reveals = document.querySelectorAll('.reveal-elem');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // 3. Tagline Reveal Section (B11): ativação palavra por palavra no scroll via requestAnimationFrame
  const wordTokens = document.querySelectorAll('.word-token');
  const taglineContainer = document.getElementById('tagline-container');
  
  if (taglineContainer && wordTokens.length > 0) {
    let isTicking = false;

    const updateWords = () => {
      const rect = taglineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Progresso relativo da seção na janela
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.35;
      const current = rect.top;

      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      const activeCount = Math.floor(progress * wordTokens.length);
      wordTokens.forEach((token, index) => {
        if (index <= activeCount) {
          token.classList.add('active');
        } else {
          token.classList.remove('active');
        }
      });

      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateWords);
        isTicking = true;
      }
    }, { passive: true });
    
    updateWords();
  }

  // 4. FAQ Accordion
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Fecha os outros acordions abertos
      faqToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          otherToggle.nextElementSibling.classList.add('hidden');
          otherToggle.querySelector('.faq-icon').classList.remove('rotate-180');
        }
      });

      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
      }
    });
  });

  // 5. Formspree AJAX Submission com Validação e Estados
  const form = document.getElementById('lead-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');
  const formFeedback = document.getElementById('form-feedback');

  const validateInput = (input, errorId) => {
    const errEl = document.getElementById(errorId);
    if (!input.value.trim() || (input.tagName === 'SELECT' && !input.value)) {
      if (errEl) errEl.classList.remove('hidden');
      input.classList.add('border-rose-500');
      return false;
    } else {
      if (errEl) errEl.classList.add('hidden');
      input.classList.remove('border-rose-500');
      return true;
    }
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome');
      const whatsapp = document.getElementById('whatsapp');
      const tipo = document.getElementById('tipo_negocio');
      const faturamento = document.getElementById('faturamento');

      const v1 = validateInput(nome, 'error-nome');
      const v2 = validateInput(whatsapp, 'error-whatsapp');
      const v3 = validateInput(tipo, 'error-tipo');
      const v4 = validateInput(faturamento, 'error-faturamento');

      if (!v1 || !v2 || !v3 || !v4) {
        return;
      }

      // Estado de Loading
      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');
      btnLoading.classList.add('inline-flex');
      formFeedback.classList.add('hidden');

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Sucesso
          formFeedback.className = 'p-4 rounded-xl text-sm font-medium bg-[#eaf3f9] text-[#1B4166] border border-[#9DC3DE]';
          formFeedback.innerHTML = '<strong>Solicitação enviada com sucesso.</strong> Em breve você receberá os detalhes de acesso via WhatsApp.';
          formFeedback.classList.remove('hidden');
          form.reset();
        } else {
          // Erro retornado pela API
          const data = await response.json();
          throw new Error(data.error || 'Falha ao processar solicitação.');
        }
      } catch (error) {
        // Erro genérico / conexão
        formFeedback.className = 'p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-700 border border-rose-200';
        formFeedback.innerHTML = 'Não foi possível enviar sua solicitação no momento. Por favor, tente novamente ou entre em contato pelo suporte.';
        formFeedback.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        btnLoading.classList.remove('inline-flex');
      }
    });
  }

  // 6. Modal Legal (Termos e Privacidade)
  const modal = document.getElementById('legal-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModal = document.getElementById('close-modal');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  const openModal = (title, content) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  const hideModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
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
