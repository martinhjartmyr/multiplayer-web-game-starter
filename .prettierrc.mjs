//** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
  useTabs: false,
  singleQuote: true,
  semi: false,
  printWidth: 100,
  trailingComma: 'all',
  tailwindFunctions: ['clsx'],
  organizeImportsSkipDestructiveCodeActions: false,
}
export default config
