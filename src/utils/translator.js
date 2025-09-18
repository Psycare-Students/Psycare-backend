import translate from "google-translate-api-x";

export async function translateText(text, lang = "en") {
  try {
    if (!text) return "";
    const res = await translate(text, { to: lang });
    return res.text;
  } catch (err) {
    console.error("Translation failed:", err);
    return text; // fallback to original English
  }
}
