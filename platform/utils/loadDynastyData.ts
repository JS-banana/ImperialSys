import {
  DynastyDataSchema,
  DynastyThemeSchema,
  type ValidatedDynastyData,
  type ValidatedDynastyTheme,
} from './validation';

/**
 * 校验并加载朝代原始数据（institutions / relations / timelines / figures）。
 *
 * 跑 {@link DynastyDataSchema}（strictObject + superRefine 引用完整性），把
 * 「数据完整性」变成构建期 / 测试期的硬门：未知类别、悬空 relation 端点、
 * 孤儿 timeline / figure 键都会在此抛出，而不是悄悄渲染成坏 UI。
 *
 * 返回值的 `category` / `type` 已收窄为枚举（精确类型），调用方无需再 `as` 强转。
 *
 * @param raw   原始数据对象
 * @param label 可选，朝代名等错误前缀，便于在构建日志里定位是哪一朝的数据坏了
 */
export function loadDynastyData(
  raw: unknown,
  label?: string,
): ValidatedDynastyData {
  const result = DynastyDataSchema.safeParse(raw);
  if (!result.success) {
    const prefix = label ? `[${label}] ` : '';
    const detail = result.error.issues
      .map((issue) => `  · ${issue.path.join('.') || '<root>'}: ${issue.message}`)
      .join('\n');
    throw new Error(`${prefix}朝代数据校验失败：\n${detail}`);
  }
  return result.data;
}

/**
 * 校验并加载朝代主题（表达令牌 + 站位）。
 *
 * 跑 {@link DynastyThemeSchema}（strictObject + 全字段必填 + .min(1)），把
 * 「主题完整性」变成构建期硬门：缺槽位、空串、拼错的多余字段都会在此抛出，
 * 杜绝「写了一半的主题」静默回退成平台默认（明朝色）——即旧 P2 断线根因之一。
 *
 * @param raw   主题对象
 * @param label 可选，朝代名等错误前缀，便于在构建日志里定位是哪一朝的主题坏了
 */
export function loadDynastyTheme(
  raw: unknown,
  label?: string,
): ValidatedDynastyTheme {
  const result = DynastyThemeSchema.safeParse(raw);
  if (!result.success) {
    const prefix = label ? `[${label}] ` : '';
    const detail = result.error.issues
      .map((issue) => `  · ${issue.path.join('.') || '<root>'}: ${issue.message}`)
      .join('\n');
    throw new Error(`${prefix}朝代主题校验失败：\n${detail}`);
  }
  return result.data;
}
