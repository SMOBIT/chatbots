(async () => {
  let client = null;

  try {
    // 1. Versuche client aus window.location.search
    const params = new URLSearchParams(window.location.search);
    const fromURL = params.get("client");

    // 2. Versuche client aus dem aktuellen Skript-Tag
    const currentScript = document.currentScript;
    const src = currentScript ? new URL(currentScript.src) : null;
    const fromSrc = src ? new URLSearchParams(src.search).get("client") : null;

    // 3. Nutze, was du bekommst – oder fallback
    client = fromURL || fromSrc || null;
  } catch (e) {
    console.error("Fehler beim Ermitteln des client-Parameters:", e);
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
