import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from './components/UserPage/UserPage';
import AdminPanel from './components/AdminPanel/AdminPanel';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<UserPage />} />
                <Route path="admin" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
