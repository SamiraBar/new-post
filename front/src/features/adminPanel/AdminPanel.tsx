import AdminToolbar from '@/features/adminPanel/components/AdminToolbar.tsx';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ParcelsList from '../parcels/ParcelsList';

const AdminPanel = () => {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    trackingNumber: '',
    sender: '',
    recipient: '',
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [navigate, admin]);

  return (
    <div className="container">
      <AdminToolbar searchFilters={searchFilters} onSearchChange={setSearchFilters} />
      <ParcelsList searchFilters={searchFilters} />
    </div>
  );
};

export default AdminPanel;
