document.addEventListener("DOMContentLoaded", () => {

  const player = document.getElementById("videoPlayer");
  const soundBtn = document.getElementById("soundBtn");
  const soundIcon = document.getElementById("soundIcon");
  const soundText = document.getElementById("soundText");
  const btnTop = document.getElementById("btnTop");

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

const leadForm = document.getElementById("leadForm");
const formMessage = document.getElementById("formMessage");

if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = leadForm.querySelector("button");

    formMessage.textContent = "Enviando...";
    formMessage.style.color = "#0c4cae";

    btn.disabled = true;
    btn.textContent = "Enviando...";

    const formData = new FormData(leadForm);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxJXo4QatEW91MNtwx43ece-54Yo24gI7F2XBomd4RpEEw-TiFxe8kMnDVy9cjLJsrZ/exec", {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      formMessage.textContent = "Contato enviado com sucesso!";
      formMessage.style.color = "green";
      leadForm.reset();

    } catch (error) {
      formMessage.textContent = "Erro ao enviar. Tente novamente.";
      formMessage.style.color = "red";
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar contato";
    }
  });
}

});