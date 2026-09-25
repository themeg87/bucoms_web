import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import { initAnalytics } from './analytics';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// 빌드 때 미리 만든 HTML이 있으면 이어 붙이고(hydrate), 없으면(개발 서버) 새로 그림
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

initAnalytics();
