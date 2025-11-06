import { createRoot } from 'react-dom/client'
import { Route, createBrowserRouter, RouterProvider, } from 'react-router-dom'
import './index.css'
import { store } from './Redux/Store.js'
import { Provider } from 'react-redux'

import App from './App.jsx'
import { Home, About, Projects, Sign, Login, Profile, Propeers,ForgotPassword,ResetPassword, Edit, ContactUs,ProjectUpload } from './Component/Pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <ContactUs />
      },
      {
        path: "propeers",
        element: <Propeers />
      },
      {
        path: "register",
        element: <Sign />
      },
      {
        path: "upload",
        element: <ProjectUpload />
      },
      {
        path: "edit",
        element: <Edit />
      },
      {
        path: "projects",
        element: <Projects />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />
      },
    ]
  }
])

// const router = createBrowserRouter([
//   <Route path='/' element={<App />}>
//     <Route path='' element={<Home />} />
//     <Route path='about' element={<About />} />
//     <Route path='projects' element={<Projects />} />
//     <Route path='register' element={<Sign />} />
//     <Route path='login' element={<Login />} />
//   </Route>
// ])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <>
  <RouterProvider router={router} />
  </>
  </Provider>

)

