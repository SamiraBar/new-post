import AdminToolbar from '@/features/adminPanel/components/AdminToolbar.tsx';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ParcelsList from '../parcels/ParcelsList';

const AdminPanel = () => {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [navigate, admin]);

  return (
    <div className="container">
      <AdminToolbar />
      <ParcelsList />
    </div>
  );
};

export default AdminPanel;
