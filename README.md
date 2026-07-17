# ЦИКАДА 0859 — лендинг

Статический сайт: `index.html` + `styles.css` + `js/*.js`. GSAP + ScrollTrigger + Lenis
через CDN, без сборщика.

## Запуск локально

```bash
python3 -m http.server 8000
```
Открыть `http://localhost:8000/`.

## Что нужно заменить перед публикацией

| Что | Где | Чем заменить |
|---|---|---|
| `assets/video/night-road.mp4` | Hero-секция | Реальное видео ночной дороги/города (см. `assets/video/README.md`). Пока файла нет, hero показывает живую цикаду из зелёной матрицы цифр (`js/matrix-cicada.js`) — она отключится сама, как только видео загрузится |
| `assets/video/city-drift.mp4` | Секция "ГОРОД СТАНЕТ ШИФРОМ." | Реальное видео проезда/прохода по городу |
| `assets/posters/*.webp` | `poster` у обоих `<video>` | Пересоздать через `scripts/generate-posters.sh` или заменить вручную |
| `[ДАТА]` | `index.html`, секция `#register` | Дата проведения квеста |
| `[ЦЕНА]` | `index.html`, секция `#register` | Стоимость участия |
| `[EMAIL]` | `index.html`, футер | Контактный email |
| `[TELEGRAM]` | `index.html`, футер | Юзернейм/ссылка на канал поддержки |
| `href="#telegram"` на кнопке "Регистрация через Telegram" | `index.html`, секция `#register` | Реальная ссылка на Telegram-бота, когда он будет создан |
| Alert-заглушка в `initWaitlistForm` (`js/waitlist-form.js`) | Клик по Telegram-кнопке | Убрать `event.preventDefault()`/alert, оставить обычный переход по ссылке |

## Тесты

Чистая логика (без DOM) покрыта тестами на встроенном `node:test`:

```bash
node --test js/*.test.js
```
