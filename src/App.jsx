import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Campaigns from './pages/Campaigns'
import CampaignDetails from './pages/CampaignDetails'
import Assets from './pages/Assets'
import AIWorkspace from './pages/AIWorkspace'
import Approvals from './pages/Approvals'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Layout from './components/Layout/Layout'

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />

                        {/* Protected routes */}
                        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route index element={<Dashboard />} />
                            <Route path="campaigns" element={<Campaigns />} />
                            <Route path="campaigns/:id" element={<CampaignDetails />} />
                            <Route path="assets" element={<Assets />} />
                            <Route path="ai" element={<AIWorkspace />} />
                            <Route path="approvals" element={<Approvals />} />
                            <Route path="users" element={<Users />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        {/* Catch all - redirect to dashboard */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AppProvider>
            </AuthProvider>
        </Router>
    )
}

export default App
