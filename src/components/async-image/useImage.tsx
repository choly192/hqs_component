import * as React from "react";
import { useState, useEffect } from "react";

/** 将图片加载转换为promise调用形式 */
const imagePromise = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve;
    img.onerror = reject;
    img.src = src;
  });
};

const useImage = ({
  src
}: {
  src: string;
}): {
  src: string;
  isLoading: boolean;
  error: unknown;
} => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState<undefined | string>(undefined);
  useEffect(() => {
    imagePromise(src)
      .then(() => {
        // 加载成功
        setLoading(false);
        setValue(src);
      })
      .catch((error) => {
        // 加载失败
        setLoading(false);
        setError(error);
      });
  }, [src]);
  return { isLoading: loading, src: value, error };
};
