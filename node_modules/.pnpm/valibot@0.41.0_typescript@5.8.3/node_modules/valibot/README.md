![Valibot Logo](https://github.com/fabian-hiller/valibot/blob/main/valibot.jpg?raw=true)

# Valibot

[![License: MIT][license-image]][license-url]
[![CI][ci-image]][ci-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![JSR version][jsr-image]][jsr-url]
[![Discord][discord-image]][discord-url]

Hello, I am Valibot and I would like to help you validate data easily using a schema. No matter if it is incoming data on a server, a form or even configuration files. I have no dependencies and can run in any JavaScript environment.

> I highly recommend you read the [announcement post](https://www.builder.io/blog/introducing-valibot), and if you are a nerd like me, the [bachelor's thesis](https://valibot.dev/thesis.pdf) I am based on.

## Highlights

- Fully type safe with static type inference
- Small bundle size starting at less than 600 bytes
- Validate everything from strings to complex objects
- Open source and fully tested with 100 % coverage
- Many transformation and validation actions included
- Well structured source code without dependencies
- Minimal, readable and well thought out API

## Example

First you create a schema that describes a structured data set. A schema can be compared to a type definition in TypeScript. The big difference is that TypeScript types are "not executed" and are more or less a DX feature. A schema on the other hand, apart from the inferred type definition, can also be executed at runtime to guarantee type safety of unknown data.

<!-- prettier-ignore -->
```ts
import * as v from 'valibot'; // 1.2 kB

// Create login schema with email and password
const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

// Infer output TypeScript type of login schema
type LoginData = v.InferOutput<typeof LoginSchema>; // { email: string; password: string }

// Throws error for `email` and `password`
v.parse(LoginSchema, { email: '', password: '' });

// Returns data as { email: string; password: string }
v.parse(LoginSchema, { email: 'jane@example.com', password: '12345678' });
```

Apart from `parse` I also offer a non-exception-based API with `safeParse` and a type guard function with `is`. You can read more about it [here](https://valibot.dev/guides/parse-data/).

## Comparison

Instead of relying on a few large functions with many methods, my API design and source code is based on many small and independent functions, each with just a single task. This modular design has several advantages.

For example, this allows a bundler to use the import statements to remove code that is not needed. This way, only the code that is actually used gets into your production build. This can reduce the bundle size by up to 95 % compared to [Zod](https://zod.dev/).

In addition, it allows you to easily extend my functionality with external code and makes my source code more robust and secure because the functionality of the individual functions can be tested much more easily through unit tests.

## Credits

My friend [Fabian](https://twitter.com/FabianHiller) created me as part of his bachelor thesis at [Stuttgart Media University](https://www.hdm-stuttgart.de/en/), supervised by Walter Kriha, [Miško Hevery](https://twitter.com/mhevery) and [Ryan Carniato](https://twitter.com/RyanCarniato). My role models also include [Colin McDonnell](https://twitter.com/colinhacks), who had a big influence on my API design with [Zod](https://zod.dev/).

## Feedback

Find a bug or have an idea how to improve my code? Please fill out an [issue](https://github.com/fabian-hiller/valibot/issues/new). Together we can make the library even better!

## License

I am completely free and licensed under the [MIT license](https://github.com/fabian-hiller/valibot/blob/main/LICENSE.md). But if you like, you can feed me with a star on [GitHub](https://github.com/fabian-hiller/valibot).

[license-image]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[ci-image]: https://img.shields.io/github/actions/workflow/status/fabian-hiller/valibot/ci.yml?branch=main&logo=github&style=flat-square
[ci-url]: https://github.com/fabian-hiller/valibot/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/valibot.svg?style=flat-square
[npm-url]: https://npmjs.org/package/valibot
[downloads-image]: https://img.shields.io/npm/dm/valibot.svg?style=flat-square
[jsr-image]: https://jsr.io/badges/@valibot/valibot?style=flat-square
[jsr-url]: https://jsr.io/@valibot/valibot
[discord-image]: https://img.shields.io/discord/1252985447273992222?label=Discord&style=flat-square
[discord-url]: https://discord.gg/tkMjQACf2P
