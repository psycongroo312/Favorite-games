import FindGame from "./FindGame"; // Функция, которую тестируем
import { searchGames, convertApiToGame } from "../services/gameApi"; // Импорт зависимостей
import { type Game } from "../data/games"; // Тип Game

// Мокаем (имитируем) зависимости, чтобы не делать реальные API-запросы
jest.mock("../services/gameApi");

describe("FindGame", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тест 1: Успешный сценарий
  it("возвращает Game при успешном поиске", async () => {
    // async, потому что функция async
    // Подготавливаем фейковые данные
    const mockResults = [
      { id: 1, name: "The Witcher 3", background_image: "image-url" },
    ]; // Пример ответа от API
    const mockGame: Game = {
      name: "The Witcher 3",
      imageUrl:
        "https://ru.wikipedia.org/wiki/%D0%A4%D0%B0%D0%B9%D0%BB:The_Witcher_3-_Wild_Hunt_Cover.jpg",
    }; // Что ожидаем после конвертации

    // Мокаем searchGames: говорим, что она вернёт mockResults
    (searchGames as jest.Mock).mockResolvedValue(mockResults); // mockResolvedValue — для async resolve
    // Мокаем convertApiToGame: вернёт mockGame
    (convertApiToGame as jest.Mock).mockReturnValue(mockGame); // mockReturnValue — для sync

    // Вызываем функцию
    const result = await FindGame("Witcher"); // Передаём тестовое имя

    // Проверки (expectations)
    expect(searchGames).toHaveBeenCalledWith("Witcher"); // Была ли вызвана с правильным аргументом?
    expect(convertApiToGame).toHaveBeenCalledWith(mockResults[0]); // Конвертер вызван с первым результатом?
    expect(result).toEqual(mockGame); // Результат — ожидаемый Game?
  });

  // Тест 2: Нет результатов
  it("возвращает null, если нет результатов", async () => {
    (searchGames as jest.Mock).mockResolvedValue([]); // Пустой массив от API

    const result = await FindGame("NonExistentGame");

    expect(result).toBeNull(); // Должен быть null
    expect(convertApiToGame).not.toHaveBeenCalled(); // Конвертер не должен вызываться
  });

  // Тест 3: Ошибка
  it("возвращает null при ошибке и логирует её", async () => {
    // Мокаем console.error, чтобы проверить лог
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {}); // Имитируем console.error

    (searchGames as jest.Mock).mockRejectedValue(new Error("API error")); // API кидает ошибку (reject)

    const result = await FindGame("Witcher");

    expect(result).toBeNull(); // null
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error finding game:",
      expect.any(Error),
    ); // Лог вызван?
    consoleErrorSpy.mockRestore(); // Восстанавливаем оригинальный console после теста
  });
});
