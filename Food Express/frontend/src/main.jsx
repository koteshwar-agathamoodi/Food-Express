import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { BrowserRouter } from 'react-router-dom'

// 🗑️ CLEANUP: Purge any legacy localStorage data (except auth token) to ensure database-only persistence
const token = localStorage.getItem('food_express_token');
localStorage.clear();
if (token) localStorage.setItem('food_express_token', token);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <App />
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
