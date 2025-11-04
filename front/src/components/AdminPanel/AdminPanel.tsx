import AdminToolbar from "@/components/AdminPanel/features/AdminToolbar.tsx";
import useUserStore from "@/stores/userStore/userStore.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const AdminPanel = () => {
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user){
      navigate("/admin/login");
    }
  },[navigate, user])

  return (
        <>
            <AdminToolbar/>
            <h1 className={'mx-auto my-10 max-w-6xl'}>Панель администратора</h1>
        </>
    );
};

export default AdminPanel;