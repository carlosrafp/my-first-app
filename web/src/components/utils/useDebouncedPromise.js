import { useRef } from 'react';

export default function useDebouncedPromise(fn, delay) {
  //const [timeoutRef, setTimeoutRef] = useState(null); // poderia ser usado useState obriga renderizacao toda vez que o estado muda
  let timeoutRef = useRef(null); // useRef registra valor sem precisar renderizar o objeto
  // novo valor eh registrado em current

  function handler(...params) {
    return new Promise((resolve, reject) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(async () => {
        try {
          const response = await fn(...params);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
  }
  return handler;
}