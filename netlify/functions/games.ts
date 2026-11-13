import type { Handler } from "@netlify/functions";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!RAWG_API_KEY) {
    console.error("RAWG_API_KEY is not set in environment");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "Сервер поиска игр не настроен. Обратись к разработчику: нет ключа RAWG_API_KEY.",
      }),
    };
  }

  const query = event.queryStringParameters?.q?.trim();

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Нет строки для поиска" }),
    };
  }

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("RAWG API error:", response.status, text);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Сервис поиска игр ответил с ошибкой. Попробуй позже.",
        }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results: data.results || [] }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Что-то сломалось на стороне поиска игр" }),
    };
  }
};
