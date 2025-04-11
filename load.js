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

  // Konfiguration laden
  const config = await fetch(configUrl).then(res => res.json());

  // Chat-Script (IIFE) einbinden
  const chatScript = document.createElement("script");
  chatScript.src = "https://cdn.jsdelivr.net/npm/@n8n/chat@latest/dist/chat.iife.js";
  chatScript.onload = () => {
    if (window.createChat) {
      window.createChat({
        webhookUrl: config.webhookUrl,
        introMessage: config.introMessage,
        quickReplies: config.quickReplies,
        theme: {
          title: config.title,
          position: "bottom-right"
        }
      });
    } else {
      console.error("createChat not available.");
    }
  };
  document.body.appendChild(chatScript);
})();
