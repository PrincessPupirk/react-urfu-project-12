import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page, userEvent } from "@vitest/browser/context";
import { io, type Socket } from "socket.io-client";

import init from "../code/src/init";

const registeredUser = {
  username: "admin",
  password: "admin",
};

let socket: Socket | undefined;

// Каждый тест работает со своими данными: имена каналов и пользователей
// уникальны. Иначе тест зависит от того, что успели наделать соседние, и
// падает от перестановки, а не от ошибки в коде.
const unique = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 6)}`;

// Второго пользователя гоняем по протоколу, без интерфейса: в browser mode
// нет второго браузерного контекста, а два приложения на одной странице делят
// модульные хранилища и потому не могут быть разными пользователями.
const api = {
  signUp: async (username: string, password = "password") => {
    const response = await fetch("/api/v1/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return (await response.json()) as { token: string; username: string };
  },

  sendMessage: (token: string, body: string, channelId: string, username: string) =>
    fetch("/api/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ body, channelId, username }),
    }),

  createChannel: (token: string, name: string) =>
    fetch("/api/v1/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    }),
};

// Имя канала выводится с префиксом «# », поэтому локатор по регулярке,
// а не по точному совпадению доступного имени.
const channelButton = (name: string) =>
  page.getByRole("button", { name: new RegExp(`#\\s*${name}$`) });

const mountApp = async () => {
  // Приложение построено на BrowserRouter, а тест открывается по служебному
  // адресу vitest. Без подмены пути роутер отдал бы страницу 404.
  window.history.replaceState({}, "", "/");

  socket = io();
  return render(await init(socket));
};

const logIn = async (user: { username: string; password: string }) => {
  await userEvent.fill(page.getByLabelText("Ваш ник"), user.username);
  await userEvent.fill(page.getByLabelText(/^Пароль$/), user.password);
  await userEvent.click(page.getByRole("button", { name: "Войти" }));
};

const logInAndWait = async (user = registeredUser) => {
  await logIn(user);
  await expect.element(page.getByLabelText("Новое сообщение")).toBeVisible();
};

const openAddChannel = async () => {
  await userEvent.click(page.getByRole("button", { name: "+" }));
  await expect.element(page.getByLabelText("Имя канала")).toBeVisible();
};

const createChannel = async (name: string) => {
  await openAddChannel();
  await userEvent.fill(page.getByLabelText("Имя канала"), name);
  await userEvent.keyboard("{Enter}");
};

const openChannelMenu = async (name: string) => {
  const channel = channelButton(name);
  await expect.element(channel).toBeVisible();
  await userEvent.click(page.getByRole("button", { name: "Управление каналом" }).last());
};

beforeEach(async () => {
  localStorage.clear();
  await mountApp();
});

// Ничего разбирать вручную не нужно: приложение не держит состояние в модулях,
// поэтому оно умирает вместе с размонтированием, а токен из localStorage
// снимается очисткой. Следующий тест стартует с чистого листа независимо от
// того, что делал предыдущий и в каком порядке они шли.
afterEach(() => {
  socket?.disconnect();
  socket = undefined;
  cleanup();
  localStorage.clear();
});

describe("registration", () => {
  test("handle new user creation", async () => {
    const username = unique("user");

    await userEvent.click(page.getByRole("link", { name: "Регистрация" }));
    await userEvent.fill(page.getByLabelText("Имя пользователя"), username);
    await userEvent.fill(page.getByLabelText(/^Пароль$/), "password");
    await userEvent.fill(page.getByLabelText("Подтвердите пароль"), "password");
    await userEvent.click(page.getByRole("button", { name: "Зарегистрироваться" }));

    await expect.element(channelButton("general")).toBeVisible();
  });

  test("no duplicated users created", async () => {
    // Пользователя заводим сами, а не полагаемся на соседний тест.
    const username = unique("user");
    await api.signUp(username);

    await userEvent.click(page.getByRole("link", { name: "Регистрация" }));
    await userEvent.fill(page.getByLabelText("Имя пользователя"), username);
    await userEvent.fill(page.getByLabelText(/^Пароль$/), "password");
    await userEvent.fill(page.getByLabelText("Подтвердите пароль"), "password");
    await userEvent.click(page.getByRole("button", { name: "Зарегистрироваться" }));

    await expect.element(page.getByText("Такой пользователь уже существует")).toBeVisible();
  });

  test("handle validation", async () => {
    await userEvent.click(page.getByRole("link", { name: "Регистрация" }));
    await userEvent.fill(page.getByLabelText("Имя пользователя"), "u");
    await userEvent.fill(page.getByLabelText(/^Пароль$/), "pass");
    await userEvent.fill(page.getByLabelText("Подтвердите пароль"), "passw");
    await userEvent.click(page.getByRole("button", { name: "Зарегистрироваться" }));

    await expect.element(page.getByText("От 3 до 20 символов")).toBeVisible();
    await expect.element(page.getByText("Не менее 6 символов")).toBeVisible();
    await expect.element(page.getByText("Пароли должны совпадать")).toBeVisible();
  });
});

describe("auth", () => {
  test("login page on enter as guest", async () => {
    await expect.element(page.getByLabelText("Ваш ник")).toBeVisible();
    await expect.element(page.getByLabelText(/^Пароль$/)).toBeVisible();
  });

  test("successful login", async () => {
    await logInAndWait();

    await expect
      .element(page.getByText("Неверные имя пользователя или пароль"))
      .not.toBeInTheDocument();
  });

  test("handle login error", async () => {
    await logIn({ username: "guest", password: "pass" });

    await expect.element(page.getByText("Неверные имя пользователя или пароль")).toBeVisible();
  });
});

describe("chat", () => {
  beforeEach(async () => {
    await logInAndWait();
  });

  test("messaging", async () => {
    const body = unique("hello");

    await userEvent.fill(page.getByLabelText("Новое сообщение"), body);
    await userEvent.keyboard("{Enter}");

    await expect.element(page.getByText(body)).toBeVisible();
  });

  test("different channels", async () => {
    const forGeneral = unique("general msg");
    const forRandom = unique("random msg");

    await userEvent.fill(page.getByLabelText("Новое сообщение"), forGeneral);
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText(forGeneral)).toBeVisible();

    await userEvent.click(channelButton("random"));
    await expect.element(page.getByText(forGeneral)).not.toBeInTheDocument();

    await userEvent.fill(page.getByLabelText("Новое сообщение"), forRandom);
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText(forRandom)).toBeVisible();
  });

  test("adding channel", async () => {
    const name = unique("chan");

    await createChannel(name);

    await expect.element(page.getByText("Канал создан")).toBeVisible();
    await expect.element(channelButton(name)).toBeVisible();
  });

  test("adding channel validation", async () => {
    await createChannel("test long channel name");

    await expect.element(page.getByText("От 3 до 20 символов")).toBeVisible();
  });

  test("adding channel profanity", async () => {
    const suffix = unique("x").slice(-4);

    await createChannel(`boobs ${suffix}`);

    await expect.element(channelButton(`\\*\\*\\*\\*\\* ${suffix}`)).toBeVisible();
  });

  test("rename channel", async () => {
    const name = unique("chan");
    const renamed = unique("renamed");

    await createChannel(name);
    await openChannelMenu(name);
    await userEvent.click(page.getByRole("menuitem", { name: "Переименовать" }));

    await userEvent.fill(page.getByLabelText("Имя канала"), renamed);
    await userEvent.keyboard("{Enter}");

    await expect.element(page.getByText("Канал переименован")).toBeVisible();
    await expect.element(channelButton(renamed)).toBeVisible();
  });

  test("remove channel", async () => {
    const name = unique("chan");

    await createChannel(name);
    await openChannelMenu(name);
    await userEvent.click(page.getByRole("menuitem", { name: "Удалить" }));
    await userEvent.click(page.getByRole("button", { name: "Удалить" }).last());

    await expect.element(page.getByText("Канал удалён")).toBeVisible();
    await expect.element(channelButton(name)).not.toBeInTheDocument();
  });
});

describe("two users", () => {
  test("message from another user arrives over the socket", async () => {
    const other = unique("user");
    const { token } = await api.signUp(other);
    const body = unique("from other");

    await logInAndWait();
    await api.sendMessage(token, body, "1", other);

    await expect.element(page.getByText(body)).toBeVisible();
    await expect.element(page.getByText(other, { exact: false })).toBeVisible();
  });

  test("own message is delivered", async () => {
    const body = unique("mine");

    await logInAndWait();
    await userEvent.fill(page.getByLabelText("Новое сообщение"), body);
    await userEvent.keyboard("{Enter}");

    await expect.element(page.getByText(body)).toBeVisible();
  });

  test("only initiator switches channel", async () => {
    const other = unique("user");
    const { token } = await api.signUp(other);
    const theirChannel = unique("theirs");
    const ownChannel = unique("mine");

    await logInAndWait();

    // Канал, созданный другим пользователем, появляется в списке, но текущим
    // не становится: переносят только инициатора.
    await api.createChannel(token, theirChannel);
    await expect.element(channelButton(theirChannel)).toBeVisible();
    await expect.element(page.getByText("# general")).toBeVisible();

    // А свой созданный канал становится текущим сразу.
    await createChannel(ownChannel);
    await expect.element(page.getByText(`# ${ownChannel}`)).toBeVisible();
  });
});
