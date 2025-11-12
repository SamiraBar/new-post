import AdminToolbar from '@/features/adminPanel/components/AdminToolbar.tsx';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ParcelDetails from '@/features/parcels/admin/ParcelDetails.tsx';

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
      <ParcelDetails/>
    </div>
  );
};

export default AdminPanel;
