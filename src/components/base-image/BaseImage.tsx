/**
 * deal with error image show
 */
import React, { useEffect, useState } from "react";

interface BaseImageProps {
  src: string;
  imageErrorPath?: string;
  alt?: string;
  className?: string;
  title?: string;
  isShowText?: boolean;
  textClass?: any;
}
enum LoadingType {
  Init = 0,
  Loading = 1,
  Loaded = 2,
  Error = 3
}

const BaseImage: React.FC<BaseImageProps> = (props) => {
  const { src, isShowText, alt, imageErrorPath, className, textClass } = props;

  const [loadStatus, setLoadStatus] = useState<LoadingType>(LoadingType.Init);

  useEffect(() => {
    setLoadStatus(LoadingType.Loading);
  }, []);

  return (
    <>
      {(loadStatus === LoadingType.Loading ||
        loadStatus === LoadingType.Loaded) && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoadStatus(LoadingType.Loaded)}
          onError={() => setLoadStatus(LoadingType.Error)}
        />
      )}

      {loadStatus === LoadingType.Error && !isShowText && (
        <img className={className} src={imageErrorPath} alt={alt} />
      )}
      {loadStatus === LoadingType.Error && isShowText && (
        <div className={textClass}>{alt}</div>
      )}
    </>
  );
};

export default BaseImage;
