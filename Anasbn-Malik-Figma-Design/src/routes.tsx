import { createBrowserRouter } from 'react-router'
import Root from './pages/Root'
import Home from './pages/Home'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Mosque from './pages/Mosque'
import Events from './pages/Events'
import Donate from './pages/Donate'
import Waqf from './pages/Waqf'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'leadership', Component: Leadership },
      { path: 'mosque', Component: Mosque },
      { path: 'events', Component: Events },
      { path: 'donate', Component: Donate },
      { path: 'waqf', Component: Waqf },
      { path: 'articles', Component: Articles },
      { path: 'articles/:id', Component: ArticleDetail },
      { path: 'contact', Component: Contact },
    ],
  },
])
