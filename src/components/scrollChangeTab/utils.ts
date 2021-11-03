export const throttle = (fn, threshold = 100) => {
  let last;
  let timer;

  return () => {
    const now = +new Date();
    const timePassed = !!last && now < last + threshold;

    if (timePassed) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        last = now;
        fn();
      }, threshold);
    } else {
      last = now;
      fn();
    }
  };
};
export const getClassName = (classNameObj) => {
  let tempK = [];
  for (const [k, v] of Object.entries(classNameObj)) {
    if (v) {
      tempK.push(k);
    }
  }
  if (!tempK.length) return '';
  return tempK.join(' ');
};
