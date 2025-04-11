(async () => {
  const params = new URLSearchParams(window.location.search);
  const clientParam = params.get("client");
  const client = clientParam && clientParam.trim() !== "" ? clientParam : null;

  if (!client) {
    console.error("❌ Kein 'client' Parameter angegeben.");
    return;
  }

  const configUrl = `https://smobit.github.io/chatbots/config/${client}.json`;
  const styleUrl = `https://smobit.github.io/chatbots/styles/${client}.css`;

  // CSS laden
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = styleUrl;
  document.head.appendChild(style);

  try {
    const config = await fetch(configUrl).then(res => res.json());

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@n8n/chat@latest/dist/chat.iife.js";
    script.onload = () => {
      window.createChat({
        webhookUrl: config.webhookUrl,
        introMessage: config.introMessage,
        quickReplies: config.quickReplies,
        theme: {
          title: config.title,
          position: "bottom-right"
        }
      });
    };
    document.body.appendChild(script);
  } catch (error) {
    console.error("❌ Fehler beim Laden der Konfiguration:", error);
  }
})();
