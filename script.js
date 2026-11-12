document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ano no rodapé
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Revelar seções ao rolar
  const targets = document.querySelectorAll(".section__head, .pain, .card, .case, .steps li, .principles > div, .about, .faq, .proof__grid > div");
  if (!reduceMotion && "IntersectionObserver" in window) {
    targets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((el) => io.observe(el));
  }

  // Console "ao vivo" do hero (simulação)
  const log = document.getElementById("log");
  const feed = [
    ["erp", "t-erp", "Faturas do dia geradas e enviadas", "ok"],
    ["portal", "t-port", "Ocorrência de entrega publicada para o cliente", "ok"],
    ["sefaz", "t-fisc", "Status de 46 CT-e conferidos", "ok"],
    ["e-mail", "t-mail", "3 pedidos de embarcador lidos e lançados", "ok"],
    ["banco", "t-bank", "Remessa de pagamentos gerada", "ok"],
    ["portal", "t-port", "Prova de entrega anexada à solicitação", "ok"],
    ["erp", "t-erp", "Baixa de 128 títulos recebidos", "ok"],
    ["alerta", "t-warn", "Rastreador sem sinal há 2h · operação avisada", "aviso"],
  ];
  if (log && !reduceMotion) {
    let i = 0;
    let clock = 6 * 3600 + 3 * 60 + 9; // 06:03:09
    const fmt = (s) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":");
    const tick = () => {
      if (document.hidden) return;
      const [tag, cls, msg, status] = feed[i++ % feed.length];
      clock += 20 + Math.floor(Math.random() * 50);
      const li = document.createElement("li");
      li.className = "is-new";
      li.innerHTML = `<time>${fmt(clock)}</time><em class="${cls}">${tag}</em><span>${msg}</span><i class="${status === "ok" ? "ok" : "warn"}">${status}</i>`;
      log.appendChild(li);
      while (log.children.length > 6) log.removeChild(log.firstElementChild);
      setTimeout(() => li.classList.remove("is-new"), 1600);
    };
    setInterval(tick, 2600);
  }

  // Formulário (Formspree) sem sair da página
  const form = document.getElementById("form");
  const status = document.getElementById("form-status");
  if (form && window.fetch) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Enviando…";
      status.className = "form__status";
      status.textContent = "";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.classList.add("is-ok");
        status.textContent = "Recebido. Respondo em até 1 dia útil.";
      } catch {
        status.classList.add("is-err");
        status.innerHTML = 'Não consegui enviar. Me chame no <a href="https://wa.me/5519982756410">WhatsApp</a> ou em rayan@arcanetech.com.br.';
      } finally {
        btn.disabled = false;
        btn.textContent = "Enviar";
      }
    });
  }
});
