# isbot 🤖/👨‍🦰

[![](https://img.shields.io/npm/v/isbot?style=flat-square)](https://www.npmjs.com/package/isbot) [![](https://img.shields.io/circleci/build/github/omrilotan/isbot?style=flat-square)](https://circleci.com/gh/omrilotan/isbot) [![](https://img.shields.io/github/last-commit/omrilotan/isbot?style=flat-square)](https://github.com/omrilotan/isbot/graphs/commit-activity) [![](https://img.shields.io/npm/dt/isbot?style=flat-square)](https://www.npmjs.com/package/isbot) [![](https://data.jsdelivr.com/v1/package/npm/isbot/badge)](https://www.jsdelivr.com/package/npm/isbot)

[![](./page/isbot.svg)](https://isbot.js.org)

Identify bots, crawlers, and spiders using the user agent string.

## Usage

Install

```sh
npm i isbot
```

Straightforward usage

```ts
import { isbot } from "isbot";

// Request
isbot(request.headers.get("User-Agent"));

// Nodejs HTTP
isbot(request.getHeader("User-Agent"));

// ExpressJS
isbot(req.get("user-agent"));

// Browser
isbot(navigator.userAgent);

// User Agent string
isbot(
  "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
); // true

isbot(
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
); // false
```

Use JSDeliver CDN you can import to the browser directly

> See specific versions and instructions [https://www.jsdelivr.com/package/npm/isbot](https://www.jsdelivr.com/package/npm/isbot)

ESM

```html
<script type="module">
  import { isbot } from "https://cdn.jsdelivr.net/npm/isbot@5/+esm";
  isbot(navigator.userAgent);
</script>
```

UMD

```html
<script src="https://cdn.jsdelivr.net/npm/isbot@5"></script>
<script>
  // isbot is now global
  isbot(navigator.userAgent);
</script>
```

## All named imports

| import              | Type                             | Description                                                                  |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| isbot               | _(string?): boolean_             | Check if the user agent is a bot                                             |
| isbotNaive          | _(string?): boolean_             | Check if the user agent is a bot using a naive pattern (less accurate)       |
| getPattern          | (): _RegExp_                     | The regular expression used to identify bots                                 |
| list                | _string[]_                       | List of all individual pattern parts                                         |
| isbotMatch          | _(string?): string \| null_      | The substring matched by the regular expression                              |
| isbotMatches        | _(string?): string[]_            | All substrings matched by the regular expression                             |
| isbotPattern        | _(string?): string \| null_      | The regular expression used to identify bot substring in the user agent      |
| isbotPatterns       | _(string?): string[]_            | All regular expressions used to identify bot substrings in the user agent    |
| createIsbot         | _(RegExp): (string?): boolean_   | Create a custom isbot function                                               |
| createIsbotFromList | _(string[]): (string?): boolean_ | Create a custom isbot function from a list of string representation patterns |

## Example usages of helper functions

Create a custom `isbot` that does not consider Chrome Lighthouse user agent as bots.

```ts
import { createIsbotFromList, isbotMatches, list } from "isbot";

const ChromeLighthouseUserAgentStrings: string[] = [
  "mozilla/5.0 (macintosh; intel mac os x 10_15_7) applewebkit/537.36 (khtml, like gecko) chrome/94.0.4590.2 safari/537.36 chrome-lighthouse",
  "mozilla/5.0 (linux; android 7.0; moto g (4)) applewebkit/537.36 (khtml, like gecko) chrome/94.0.4590.2 mobile safari/537.36 chrome-lighthouse",
];
const patternsToRemove = new Set<string>(
  ChromeLighthouseUserAgentStrings.map(isbotMatches).flat(),
);
const isbot: (ua: string) => boolean = createIsbotFromList(
  list.filter(
    (record: string): boolean => patternsToRemove.has(record) === false,
  ),
);
```

Create a custom isbot that considers another pattern as a bot, which is not included in the package originally.

```ts
import { createIsbotFromList, list } from "isbot";

const isbot = createIsbotFromList(list.concat("shmulik"));
```

## Definitions

- **Bot.** Autonomous program imitating or replacing some aspect of a human behaviour, performing repetitive tasks much faster than human users could.
- **Good bot.** Automated programs who visit websites in order to collect useful information. Web crawlers, site scrapers, stress testers, preview builders and other programs are welcomed on most websites because they serve purposes of mutual benefits.
- **Bad bot.** Programs which are designed to perform malicious actions, ultimately hurting businesses. Testing credential databases, DDoS attacks, spam bots.

## Clarifications

### What does "isbot" do?

This package aims to identify "Good bots". Those who voluntarily identify themselves by setting a unique, preferably descriptive, user agent, usually by setting a dedicated request header.

### What doesn't "isbot" do?

It does not try to recognise malicious bots or programs disguising themselves as real users.

### Why would I want to identify good bots?

Recognising good bots such as web crawlers is useful for multiple purposes. Although it is not recommended to serve different content to web crawlers like Googlebot, you can still elect to

- Flag pageviews to consider with **business analysis**.
- Prefer to serve cached content and **relieve service load**.
- Omit third party solutions' code (tags, pixels) and **reduce costs**.

> It is not recommended to **whitelist** requests for any reason based on user agent header only. Instead, other methods of identification can be added such as [reverse dns lookup](https://www.npmjs.com/package/reverse-dns-lookup).

## How `isbot` maintains accuracy

`isbot` is an asset when it can most accurately identify bots by the user agent string. It uses expansive and regularly updated lists of user agent strings to create a regular expression that matches bots and only bots.

And above everything else, it is maintained by a community of contributers who help keep the list up to date.

### Fallback

The pattern uses lookbehind methods which are not supported in all environments. A fallback is provided for environments that do not support lookbehind. The fallback is less accurate. The test suite includes a percentage of false positives and false negatives which is deemed acceptable for the fallback: 1% false positive and 75% bot coverage.

## Data sources

We use external data sources on top of our own lists to keep up to date

### Crawlers user agents

- [user-agents.net](https://user-agents.net/bots)
- [monperrus/crawler-user-agents](https://github.com/monperrus/crawler-user-agents/blob/master/crawler-user-agents.json)
- [Kikobeats/top-crawler-agents](https://github.com/Kikobeats/top-crawler-agents/blob/master/index.json)
- [myip.ms](https://www.myip.ms/files/bots/live_webcrawlers.txt)
- [matomo.org](https://github.com/matomo-org/device-detector/blob/master/Tests/fixtures/bots.yml)
- A Manual list

### Non bot user agents

- [user-agents npm package](https://www.npmjs.com/package/user-agents)
- A Manual list

Missing something? Please [open an issue](https://github.com/omrilotan/isbot/issues/new/choose)

## Major releases breaking changes ([full changelog](./CHANGELOG.md))

### [**Version 5**](https://github.com/omrilotan/isbot/releases/tag/v5.0.0)

Remove named export "pattern" from the interface, instead use "getPattern" method

### [**Version 4**](https://github.com/omrilotan/isbot/releases/tag/v4.0.0)

Remove `isbot` function default export in favour of a named export.

```ts
import { isbot } from "isbot";
```

### [**Version 3**](https://github.com/omrilotan/isbot/releases/tag/v3.0.0)

Remove testing for node 6 and 8

### [**Version 2**](https://github.com/omrilotan/isbot/releases/tag/v2.0.0)

Change return value for isbot: `true` instead of matched string

### [**Version 1**](https://github.com/omrilotan/isbot/releases/tag/v1.0.0)

No functional change
