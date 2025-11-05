import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from './components/UserPage/UserPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminLoginForm from "@/components/AdminPanel/AdminLoginForm.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<UserPage />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="admin/login" element={<AdminLoginForm />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
