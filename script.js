document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("videoPlayer");
  const soundBtn = document.getElementById("soundBtn");
  const soundIcon = document.getElementById("soundIcon");
  const soundText = document.getElementById("soundText");
  const btnTop = document.getElementById("btnTop");

  /* =========================
     MENU MOBILE
  ========================= */
  const menu = document.querySelector(".menu");

  if (menu) {
    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "mobile-menu-btn";
    menuBtn.innerHTML = "☰ Menu";
    menuBtn.setAttribute("aria-label", "Abrir menu");

    menu.parentNode.insertBefore(menuBtn, menu);

    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("menu-open");

      if (menu.classList.contains("menu-open")) {
        menuBtn.innerHTML = "✕ Fechar";
        menuBtn.setAttribute("aria-label", "Fechar menu");
      } else {
        menuBtn.innerHTML = "☰ Menu";
        menuBtn.setAttribute("aria-label", "Abrir menu");
      }
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("menu-open");
        menuBtn.innerHTML = "☰ Menu";
        menuBtn.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* =========================
     BOTÃO VOLTAR AO TOPO
  ========================= */
  if (btnTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        btnTop.classList.add("show");
      } else {
        btnTop.classList.remove("show");
      }
    });

    btnTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* =========================
     BOTÃO DE SOM - VÍDEO PRODUTOS
  ========================= */
  const aboutPlayer = document.getElementById("aboutPlayer");
  const aboutSoundBtn = document.getElementById("aboutSoundBtn");
  const aboutSoundIcon = document.getElementById("aboutSoundIcon");
  const aboutSoundText = document.getElementById("aboutSoundText");

  if (aboutPlayer && aboutSoundBtn && aboutSoundIcon && aboutSoundText) {
    aboutPlayer.muted = true;
    aboutPlayer.loop = true;
    aboutPlayer.playsInline = true;

    aboutSoundBtn.addEventListener("click", () => {
      aboutPlayer.muted = !aboutPlayer.muted;

      if (aboutPlayer.muted) {
        aboutSoundIcon.textContent = "🔇";
        aboutSoundText.textContent = "Ativar som";
      } else {
        aboutSoundIcon.textContent = "🔊";
        aboutSoundText.textContent = "Som ativo";
        aboutPlayer.play();
      }
    });
  }

  /* =========================
     PLAYER DE VÍDEO
  ========================= */
  if (player) {
    player.muted = true;
    player.loop = true;
    player.playsInline = true;

    player.play().catch(() => {
      console.log("Autoplay bloqueado pelo navegador.");
    });
  }

  /* =========================
     BOTÃO DE SOM
  ========================= */
  if (soundBtn && player && soundIcon && soundText) {
    soundBtn.addEventListener("click", () => {
      player.muted = !player.muted;

      if (player.muted) {
        soundIcon.textContent = "🔇";
        soundText.textContent = "Ativar som";
      } else {
        soundIcon.textContent = "🔊";
        soundText.textContent = "Som ativo";
        player.play();
      }
    });
  }

  /* =========================
     FORMULÁRIO VIA IFRAME
  ========================= */
  const leadForm = document.getElementById("leadForm");
  const formMessage = document.getElementById("formMessage");
  const hiddenIframe = document.querySelector('iframe[name="hidden_iframe"]');

  if (leadForm && formMessage && hiddenIframe) {
    let formEnviado = false;

    leadForm.addEventListener("submit", () => {
      const btn = leadForm.querySelector("button");

      formEnviado = true;

      formMessage.textContent = "Enviando...";
      formMessage.style.color = "#0c4cae";

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Enviando...";
      }
    });

    hiddenIframe.addEventListener("load", () => {
      if (!formEnviado) return;

      const btn = leadForm.querySelector("button");

      formMessage.textContent = "Contato enviado com sucesso!";
      formMessage.style.color = "green";

      leadForm.reset();

      if (btn) {
        btn.disabled = false;
        btn.textContent = "Enviar contato";
      }

      formEnviado = false;
    });
  }
});