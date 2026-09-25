import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.tsx';

export { ALL_PATHS, SITE_URL, pageMeta } from './content/pages';

// 빌드 때 검색엔진용 HTML을 페이지마다 미리 만드는 데 사용 (scripts/prerender.ts)
export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
