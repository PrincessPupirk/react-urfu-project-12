# Чат (Slack)

[![hexlet-check](https://github.com/PrincessPupirk/react-urfu-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/PrincessPupirk/react-urfu-project-12/actions)

Напишите real-time приложение на React, используя AJAX, REST, websockets, React (с хуками) + Zustand + TanStack Query + @mantine/form

Учебный проект Хекслета: https://ru.hexlet.io/

Как это должно работать: https://files.hexlet.app/a/ose685

## Демо

После деплоя на Render укажите здесь URL сервиса, например: `https://<имя-сервиса>.onrender.com`

## Стек

- JavaScript
- React, Vite
- @hexlet/chat-server

## Установка

```bash
git clone https://github.com/PrincessPupirk/react-urfu-project-12.git
cd react-urfu-project-12
make install
```

## Использование

Сборка фронтенда и запуск сервера (API + статика из `dist`):

```bash
make build
make start
```

Сервер слушает порт **5001**. Проверка API:

```bash
curl http://localhost:5001/api/v1/channels
```

Разработка с hot reload (нужен отдельно запущенный сервер на 5001):

```bash
npx start-server &
npm run dev
```

## Деплой

Проект можно развернуть на [Render](https://render.com/) по файлу `render.yaml` (команды `make build` и `make start`).

Перед сборкой на Render добавьте переменную окружения **`VITE_SENTRY_DSN`** (DSN из [Bugsink](https://www.bugsink.com/)). Значение подставляется в бандл на этапе `make build`.

## Мониторинг ошибок (Bugsink)

1. Зарегистрируйтесь в [Bugsink](https://www.bugsink.com/) и создайте проект.
2. Скопируйте **DSN** из настроек проекта.
3. Локально создайте файл `.env` по образцу `.env.example` и укажите DSN:

```bash
VITE_SENTRY_DSN=https://<public-key>@<your-host>/<project-id>
```

4. Пересоберите приложение: `make build` (или `npm run build`).
5. После деплоя проверьте отправку: в консоли браузера на продакшен-странице выполните
   `throw new Error('Bugsink test')` — событие должно появиться в Bugsink.

Используется [@sentry/react](https://docs.sentry.io/platforms/javascript/guides/react/) с DSN Bugsink (протокол совместим с Sentry).

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
