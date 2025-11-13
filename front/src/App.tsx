import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from '@/components/userPage/UserPage';
import AdminPanel from '@/features/adminPanel/AdminPanel';
import AdminLoginForm from '@/features/adminPanel/AdminLoginForm.tsx';
import { Toaster } from '@/components/ui/sonner';
import AdminModeration from '@/features/adminPanel/AdminModeration.tsx';

const App = () => {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route index element={<UserPage />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="admin/login" element={<AdminLoginForm />} />
          <Route path="admin/moderation" element={<AdminModeration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
