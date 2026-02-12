import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Todo2 from './Todo';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Todo2 />
  </StrictMode>,
);
