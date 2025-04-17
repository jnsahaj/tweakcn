# Codemod

## V4

convert named export to default

If you want to run it against `.js` or `.jsx` files, please use the command below:

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/vite-plugin-svgr/codemods/src/v4/default-export/default-export.js
```

If you want to run it against `.ts` or `.tsx` files, please use the command below:

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/vite-plugin-svgr/codemods/src/v4/default-export/default-export.js
```

**Note:** Applying the codemod might break your code formatting, so please don't forget to run `prettier` and/or `eslint` after you've applied the codemod!

Above codemod will convert as imports as bellow

```diff
- import { ReactComponent as NoticeModeIconActive2 } from 'assets/icon.svg';
+ import NoticeModeIconActive2 from 'assets/icon.svg?react';
```
