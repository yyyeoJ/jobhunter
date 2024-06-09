import React from 'react';
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from 'next-themes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Profile from './components/Profile';
import JobPosting from './components/JobPosting';
import Layout from './components/Layout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'profile', element: <Profile /> },
            { path: 'jobposting', element: <JobPosting /> }
        ]
    }
]);

function App() {
    return (
        <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
                <RouterProvider router={router} />
            </ThemeProvider>
        </NextUIProvider>
    );
}

export default App;
