import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route
} from 'react-router-dom'

import './styles/Main.scss'

import Layout from './components/Layout.tsx'
import Home from './components/Home.tsx'
import Teams from './components/Teams.tsx'
import Tickets from './components/Tickets.tsx'
import AboutLeague from './components/League.tsx'
import Sponsors from './components/Sponsors.tsx'
import News from './components/News.tsx'
import Join from './components/Join.tsx'
import Contact from './components/Contact.tsx'
import Shop from './components/Shop.tsx'
import Events from './components/Events.tsx'
import SeasonSchedule from './components/SeasonSchedule.tsx'
import Derby from './components/Derby.tsx'
import Login from './components/Login.tsx'
import Players from './components/Players.tsx'
import EditorRoutes from './components/ProtectedRoute.tsx'
import NotFound from './components/NotFound.tsx'
import QuickLinks from './components/QuickLinks.tsx'

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/league" element={<AboutLeague />} />
        <Route path="/derby" element={<Derby />} />
        <Route
            path="/teams/:teamId"
            element={<Teams />}
            loader={async ({ params }) => { return fetch(`/api/teams/${params.teamId}`) }}
        />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/news" element={<News />} />
        <Route path="/join" element={<Join />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quick-links" element={<QuickLinks />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/events" element={<Events />} />
        <Route
            path="/season"
            element={<SeasonSchedule />}
            loader={async () => { return fetch(`/api/bouts`) }}
        />
        <Route path="/login" element={<Login />} />
        <Route element={<EditorRoutes />} >
            <Route path="/players" element={<Players />} />
        </Route>
        <Route path="*" element={<NotFound />} />
    </Route>
));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
