import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Time from './Time';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Time />
  </StrictMode>,
);
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Time from './Time.jsx';

// ReactDOM.createRoot(document.getElementById('root')).render(<Time />);
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Time from './Time';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <Time />
//   </React.StrictMode>,
// );

// import ReactDOM from 'react-dom/client';
// import Time from './Time';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <Time />
// );
