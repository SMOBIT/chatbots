
(async () => {
  let client = null;

  try {
    // 1. Versuche client aus dem Script-SRC auszulesen
    const currentScript = document.currentScript || [...document.getElementsByTagName("script")].pop();
    const scriptURL = new URL(currentScript.src);
    client = scriptURL.searchParams.get("client");
  } catch (err) {
    console.error("Fehler beim Ermitteln des client-Parameters:", err);
  }

  if (!client) {
    console.error("❌ Kein 'client' Parameter angegeben.");
    return;
  }

  const configUrl = `https://smobit.github.io/chatbots/config/${client}.json`;
  const styleUrl = `https://smobit.github.io/chatbots/styles/${client}.css`;

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
