import AdminToolbar from '@/components/AdminPanel/features/AdminToolbar.tsx';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminPanel = () => {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [navigate, admin]);

  return (
    <>
      <AdminToolbar />
      <h1 className={'mx-auto my-10 max-w-6xl'}>Панель администратора</h1>
    </>
  );
};

export default AdminPanel;
