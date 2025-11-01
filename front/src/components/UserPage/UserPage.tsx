import InfoSendPost from "@/features/infoSendPost/InfoSendPost.tsx";
import UserToolbar from "@/components/UserToolbar/UserToolbar.tsx";
import FooterComponent from "@/features/footer/FooterComponent.tsx";

const UserPage = () => {
    return (
        <div>
            <header><h1><UserToolbar/></h1></header>
            <main>
                <div style={{color: '#666'}} className={'mx-auto my-10 max-w-6xl'}>
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