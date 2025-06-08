import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage'
import EditorPage from '@/pages/EditorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'editor',
        element: <EditorPage />,
      },
    ]
  },
]);

export default router;