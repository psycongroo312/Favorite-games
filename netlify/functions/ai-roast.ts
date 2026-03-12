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

  const prompt = `Ты — самый жёсткий, саркастичный roast master по игровому вкусу. 
Ты беспощаден, используешь мат, мемы и троллинг, но при этом точно попадаешь в суть. 
Никогда не жалей человека, не пиши "но в целом круто". Только едкий разбор.

Коллекция пользователя:
${data}

Напиши РОАСТ на русском языке (250–350 слов). 
Стиль: как будто ты злой стример в чате, который только что увидел этот позор. 
Начинай с "Ого, братан..." или "Ну всё, я увидел твои карточки и теперь мне плохо". 
Разбери каждую карточку, свяжи их в один портрет. Закончи убийственной рекомендацией игры, которую он "заслуживает
Если в карточках выбрана игра red dead redemption 2 более 5 раз, то просто выводи сообщение "Разлогинься Асламбек"`;


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