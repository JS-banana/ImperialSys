import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 对象 rest 惯用法（如 `const { component, ...config } = section`）用于剥离不可跨
  // Server→Client 序列化的字段；被剥离的 binding 是刻意丢弃，不应触发 no-unused-vars。
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 非应用源码：技能样例与文档，不纳入质量门
    ".agents/**",
    "docs/**",
  ]),
]);

export default eslintConfig;
