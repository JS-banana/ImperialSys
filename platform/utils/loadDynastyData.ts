import { DynastyDataSchema, type ValidatedDynastyData } from './validation';

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
