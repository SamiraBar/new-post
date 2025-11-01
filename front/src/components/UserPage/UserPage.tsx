import InfoSendPost from "@/features/InfoSendPost.tsx";
import UserToolbar from "@/components/UserToolbar/UserToolbar.tsx";
import FooterComponent from "@/features/FooterComponent.tsx";

const UserPage = () => {
    return (
        <div>
            <header><h1><UserToolbar/></h1></header>
            <main>
                <div style={{color: '#666'}}>
                    Расчитать/Следить за посылкой тут.
                </div>
                <div className={'pl-2'}>
                    <InfoSendPost/>
                </div>
                <div className={'pl-2'}>
                    <FooterComponent/>
                </div>
            </main>
        </div>
    );
};

export default UserPage;