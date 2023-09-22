import React, { useEffect, useState } from "react";

const DelayedRender = ({ delay, children, onComplete }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setIsRendered(true);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  useEffect(() => {
    if (isRendered) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [isRendered, onComplete]);

  return isRendered && <>{children}</>;
};

export default DelayedRender;