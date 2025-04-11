(async () => {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client") || "default";

  const configUrl = `https://smobit.github.io/chatbots/config/${client}.json`;
  const styleUrl = `https://smobit.github.io/chatbots/styles/${client}.css`;

  // CSS laden
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = styleUrl;
  document.head.appendChild(style);

  // Konfiguration holen
  const config = await fetch(configUrl).then(res => res.json());

  // Chat initialisieren
  const script = document.createElement("script");
  script.type = "module";
  script.innerHTML = `
    import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
    createChat({
      webhookUrl: '${config.webhookUrl}',
      introMessage: '${config.introMessage}',
      quickReplies: ${JSON.stringify(config.quickReplies)},
      theme: {
        title: '${config.title}',
        position: 'bottom-right'
      }
    });
  `;
  document.body.appendChild(script);
})();
