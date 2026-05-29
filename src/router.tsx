import { createBrowserRouter } from 'react-router-dom'

import { History } from './components/features/History/History'
import { RootLayout } from './components/layout/RootLayout'
import { SimulationFormPage } from './pages/SimulationFormPage'
import { SimulationResultsPage } from './pages/SimulationResultsPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />,
      },
      {
        path: '/resultado/:id',
        element: <SimulationResultsPage />,
      },
      {
        path: '/historico',
        element: <History />,
      },
    ],
  },
])