import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.tsx';

// 빌드 때 검색엔진용 HTML을 미리 만드는 데 사용 (scripts/prerender.ts)
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
