import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from '@/components/userPage/UserPage';
import AdminPanel from '@/features/adminPanel/AdminPanel';
import AdminLoginForm from '@/features/adminPanel/AdminLoginForm.tsx';
import { Toaster } from '@/components/ui/sonner';
import AdminModeration from '@/features/adminPanel/AdminModeration.tsx';
import ParcelDetails from './features/parcels/admin/ParcelDetails';
import AdminSiteContent from '@/features/adminPanel/components/AdminSiteContent/AdminSiteContent.tsx';
import AdminProfileEdit from '@/features/adminPanel/components/AdminProfileEdit.tsx';

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
          <Route path="/admin/site-content" element={<AdminSiteContent />} />
          <Route path="/admin/profile" element={<AdminProfileEdit />} />
          <Route path="parcels/:id" element={<ParcelDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
