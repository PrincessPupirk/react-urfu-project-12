import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";

const PORT = 5001;
const READY_TIMEOUT = 60_000;
const POLL_INTERVAL = 500;

let server: ChildProcess | undefined;

// Тесты входят в приложение через code/src/init. Без этого файла отказывает
// vite на импорте, и студент читает «Failed to resolve import» вместо
// требования, которого он не выполнил. Проверка экспортируется, чтобы
// прогоняться без докера.
const entryPoints = ["js", "jsx", "ts", "tsx"].map((extension) => `code/src/init.${extension}`);

export const checkEntryPoint = () => {
  if (entryPoints.some((path) => existsSync(path))) {
    return;
  }

  throw new Error(
    "Точка входа не найдена. Проверка запускает приложение через файл src/init, который экспортирует по умолчанию асинхронную функцию, принимает сокет и возвращает разметку. Форма описана в шаге «Запуск проекта».",
  );
};

const isUp = async () => {
  try {
    await fetch(`http://localhost:${PORT}/`);
    return true;
  } catch {
    return false;
  }
};

const waitUntilUp = async () => {
  const deadline = Date.now() + READY_TIMEOUT;

  while (Date.now() < deadline) {
    if (await isUp()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error(`Бэкенд чата не поднялся на порту ${PORT} за ${READY_TIMEOUT} мс`);
};

// Готовность определяется опросом порта, а не паузой: на холодном старте
// сервер поднимается заметно дольше, чем на прогретом, и фиксированное
// ожидание либо тормозит прогон, либо не попадает в окно.
export const setup = async () => {
  checkEntryPoint();

  if (await isUp()) {
    return;
  }

  server = spawn("make", ["-C", "code", "start"], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  await waitUntilUp();
};

export const teardown = async () => {
  server?.kill("SIGTERM");
};
