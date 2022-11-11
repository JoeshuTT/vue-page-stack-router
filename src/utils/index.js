/**
 * 是否有值
 * @param {*} val
 */
export function isDef(val) {
  return val !== undefined && val !== null;
}

/**
 * 根据 key 获取对应路由元信息字段值，值默认为 `true`
 */
export function getRouteMetaValue(key, defaultValue = true, meta = {}) {
  let value = meta[key];

  if (!isDef(value)) {
    value = defaultValue;
  }

  return value;
}
