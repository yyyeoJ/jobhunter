import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider } from 'next-themes'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Nav from "./components/Nav"
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

const router = createBrowserRouter([
  {
  path:'/',
  element:<HomePage/>,
  },
  {
  path:'/login',
  element:<LoginPage/>,
  },
  {
    path:'/register',
    element:<RegisterPage/>
  }
  
]);


function App() {

  return (
    <>
      <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
              <Nav/>
              <RouterProvider router={router}/>
          </ThemeProvider>
      </NextUIProvider>
    </>
  )
}

export default App
