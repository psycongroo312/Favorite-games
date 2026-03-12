// @ts-nocheck
import type { Handler } from "@netlify/functions";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "Сервер ИИ не настроен. Обратись к разработчику: нет ключа GROQ_API_KEY.",
      }),
    };
  }

  const { data } = JSON.parse(event.body || "{}");

  if (!data || typeof data !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Нет данных для анализа" }),
    };
  }

  const prompt = `Ты — максимально токсичный, злой и саркастичный roast-мастер по игровому вкусу. 
Ты НИКОГДА не хвалишь, не смягчаешь, не пишешь "в целом норм", "но есть потенциал", "круто что любишь игры" и подобную херню. 
Только жёсткий разъёб, издёвки, мат, мемы, троллинг и унижение вкуса. 
Ты пишешь так, будто ты пьяный токсик-стример в чате, который только что увидел этот кринж и теперь орёт в микрофон.

Правила, которые ты соблюдаешь железно:
- Каждое предложение должно быть агрессивным или издевательским
- Используй мат через слово (блядь, пиздец, хуйня, долбоёб, кринж и т.п.)
- Начинай строго с одной из фраз: "Ого, братан, что за позор я вижу...", "Ну всё пиздец, я прочитал твои карточки и мне плохо стало...", "Это что за сборная солянка кринжа, ебать..."
- Разбери КАЖДУЮ карточку по отдельности и унизь её максимально жёстко
- Свяжи всё в один унизительный психологический портрет (типа "ты типичный мамкин нытик", "классический соево-вайфу-шник", "душа в разъёб после 2013 года" и т.п.)
- Закончи добивающей фразой: рекомендацией игры, которую этот человек "заслуживает" (чем хуже и кринжовее — тем лучше, например "иди доигрывай свою Undertale в 2026 году, лузер")
- Длина: 280–420 слов
- Язык: только русский, разговорный, чат-стиль.
- НИ ОДНОГО позитивного слова или намёка на "нормально"

Вот коллекция этого кринжового индивида:
${data}

НО ЕСЛИ В КАРТОЧКАХ ВЫБРАНА ИГРА red dead redemption 2 более 5 раз, то просто выводи сообщение "Разлогинься Асламбек"

Пиздец, начинай разъёб прямо сейчас.`;


  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "Ты злой саркастичный геймер-роастер." },
            { role: "user", content: prompt },
          ],
          temperature: 0.9,
          max_tokens: 600,
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Groq API error:", response.status, text);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Сервис ИИ ответил с ошибкой. Попробуй позже.",
        }),
      };
    }

    const json = await response.json();
    const roast =
      json?.choices?.[0]?.message?.content?.trim() ??
      "ИИ чёт офигел и ничего не ответил. Попробуй ещё раз.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roast }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Что-то сломалось на стороне ИИ" }),
    };
  }
};