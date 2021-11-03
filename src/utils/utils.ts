/**
 * tools funcion
 */

// 格式化时间
export function formatDate(date, str) {
  const obj = {
    yyyy: date.getFullYear(),
    yy: ("" + date.getFullYear()).slice(-2),
    M: date.getMonth() + 1,
    MM: ("0" + (date.getMonth() + 1)).slice(-2),
    d: date.getDate(),
    dd: ("0" + date.getDate()).slice(-2),
    H: date.getHours(),
    HH: ("0" + date.getHours()).slice(-2),
    h: date.getHours() % 12,
    hh: ("0" + (date.getHours() % 12)).slice(-2),
    m: date.getMinutes(),
    mm: ("0" + date.getMinutes()).slice(-2),
    s: date.getSeconds(),
    ss: ("0" + date.getSeconds()).slice(-2),
    w: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]
  };
  return str.replace(/[a-z]+/gi, function ($1) {
    return obj[$1];
  });
}

// 函数柯里化
export function curryFunc(fn) {
  let [len, args] = [fn.length, []];
  const result = function (arg) {
    args.push(arg);
    len--;
    if (len <= 1) {
      return fn.apply(this, args);
    } else {
      return result;
    }
  };
  return result;
}

// 深拷贝
export const deepClone = (target, cache = new Map()) => {
  const isObject = (obj) => typeof obj === "object" && obj !== null;

  if (isObject(target)) {
    const cacheTarget = cache.get(target);
    if (cacheTarget) {
      return cacheTarget;
    }

    let cloneTarget = Array.isArray(target) ? [] : {};

    cache.set(target, cloneTarget);

    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        const value = target[key];
        cloneTarget[key] = isObject(value) ? deepClone(value, cache) : value;
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
};

// 判断数据类型
export function getType(val) {
  const rep = Object.prototype.toString.call(val);
  return rep.replace(/\[object (.*?)\]/, "$1").toLowerCase();
}

// 千分位格式化数字
export const formatNumber = (number: number): string => {
  const [integer, decimal = ""] = number.toString().split(".");
  return (
    integer.replace(/\B(?=(\d{3})+$)/g, ",") + (decimal ? "." + decimal : "")
  );
};

// 数字转换成大写金额
export const digitUppercase = (n) => {
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];
  n = Math.abs(n);
  let s = "";
  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, "");
  }
  s = s || "整";
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = "";
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return s
    .replace(/(零.)*零元/, "元")
    .replace(/(零.)+/g, "零")
    .replace(/^整$/, "零元整");
};

/**
 * 数字转换为中文数字
 * @param value ：number
 */
export const intToChinese = (value: number) => {
  const str = String(value);
  const len = str.length - 1;
  const idxs = [
    "",
    "十",
    "百",
    "千",
    "万",
    "十",
    "百",
    "千",
    "亿",
    "十",
    "百",
    "千",
    "万",
    "十",
    "百",
    "千",
    "亿"
  ];
  const num = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return str.replace(/([1-9]|0+)/g, ($, $1, idx, full) => {
    let pos = 0;
    if ($1[0] !== "0") {
      pos = len - idx;
      if (idx === 0 && $1[0] === 1 && idxs[len - idx] === "十") {
        return idxs[len - idx];
      }
      return num[$1[0]] + idxs[len - idx];
    } else {
      let left = len - idx;
      let right = len - idx + $1.length;
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - (left % 4);
      }
      if (pos) {
        return idxs[pos] + num[$1[0]];
      } else if (idx + $1.length >= len) {
        return "";
      } else {
        return num[$1[0]];
      }
    }
  });
};

/**
 * 防抖函数
 * @param fn ：function
 * @param wait ：延迟时间
 */
export const debounce = (fn, wait: number) => {
  let timer = null;

  return function () {
    let context = this,
      args = arguments;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
};

/**
 * 节流函数
 * @param fn ：function
 * @param delay ：延迟时间
 */
export const throttle = (fn, delay: number) => {
  let currTime = Date.now();

  return function () {
    let context = this,
      args = arguments,
      nowTime = Date.now();

    if (nowTime - currTime >= delay) {
      currTime = Date.now();
      return fn.apply(context, args);
    }
  };
};
