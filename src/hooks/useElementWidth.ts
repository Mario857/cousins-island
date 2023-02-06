import { useEffect, useState } from 'react';

export const useElementWidth = (elementId: string, deps?: any[]) => {
  const [width, setWidth] = useState(0);

  if (!deps) deps = [];

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (element) setWidth(element.offsetWidth);
  }, [elementId, [...deps]]);

  return {
    width,
  };
};
