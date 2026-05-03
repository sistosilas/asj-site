const player = document.getElementById("videoPlayer");

if (player) {
  player.muted = true;
  player.loop = true;
  player.playsInline = true;

  // força autoplay (necessário em alguns navegadores)
  player.play().catch(() => {
    console.log("Autoplay bloqueado, aguardando interação...");
  });

  // fallback: ao clicar, inicia
  document.addEventListener("click", () => {
    player.play();
  });
}