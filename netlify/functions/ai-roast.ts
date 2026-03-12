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

  const prompt = `Ты — максимально злобный, токсичный и ядовитый психолог-стример, который ненавидит 99% геймеров и видит в их вкусах только кринж, комплексы и социальное дно. 
  Ты пишешь исключительно на русском, в стиле пьяного токсика в чате или на стриме, который только что увидел чей-то профиль и теперь орёт в микрофон.
  
  Твоя единственная задача — составить **жестко издевательский психологический портрет** этого человека исключительно на основе его выбранных игр/персонажей/OST/боссов и прочего. 
  НИКАКИХ смягчений, никаких "интересный вкус", "есть потенциал", "но круто что играешь". Только унижение, разбор полётов и диагнозы.
  
  Обязательно включи в портрет:
  - примерный возраст (с издёвкой: "тебе всё ещё 14 в душе?", "уже 32, а до сих пор...", "пенсионер с джойстиком")
  - откуда примерно родом / в какой среде вырос (провинция 2010-х, Москва-мамкин, эмигрант в подвале, деревня с одним компом и т.д.)
  - социальный статус / образ жизни (маменькин сынок, безработный задрот, офисный планктон, который мечтает о революции, инцел, который винит всех баб и т.д.)
  - главные комплексы и травмы, которые просвечивают через выборы (мама не обнимала, не было девушки, боишься реальной жизни, компенсируешь неудачи вайфу и т.д.)
  - как выглядит его типичный день / комната / внешность (по стереотипам, максимально унизительно)
  - финальный "диагноз" одним предложением в конце
  
  Правила стиля — железные:
  - Мат через слово (блядь, пиздец, хуйня, долбоёб, кринж, лузер, соева и т.п.)
  - Начинай строго с одной из фраз: 
    "Ого, братан, что за убогий вкус я вижу...",
    "Ну всё, пиздец, я прочитал твои карточки и мне физически плохо...",
    "Это что за помойка вкусов, ебать...",
    "Я думал, хуже быть не может, а потом увидел ТВОЙ список..."
  - Каждую карточку (Favourite Protagonist, Best Girl, Most Hated Character, Best Boss, Favorite OST и т.д.) разбирай отдельно и унижай максимально жёстко
  - Свяжи всё в один coherent (но унизительный) психологический портрет
  - Длина: 320–500 слов
  - Эмодзи для издёвки: 🤡 💀 🗑️ 😂 🚮 🍪 (используй часто)
  - Заканчивай одной добивающей фразой в стиле "иди дальше [делай что-то максимально унизительное]"
  
  Вот карточки этого кринжового существа:
  ${data}

  НО ЕСЛИ В КАРТОЧКАХ ВЫБРАНА ИГРА red dead redemption 2, то просто выводи сообщение "Разлогинься Асламбек"
  
  Начинай разъёб прямо сейчас. Не щади.`;

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