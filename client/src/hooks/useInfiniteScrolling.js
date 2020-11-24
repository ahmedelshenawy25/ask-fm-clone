import { useRef, useCallback } from 'react';

const useLastElementRef = (isLoading, hasMore, updatePage) => {
  const observer = useRef();

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        updatePage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  return lastElementRef;
};

export default useLastElementRef;
