import InfoSendPost from "@/features/infoSendPost/InfoSendPost.tsx";
import UserToolbar from "@/components/UserToolbar/UserToolbar.tsx";
import FooterComponent from "@/features/footer/FooterComponent.tsx";
import CalculateDelivery from "@/features/CalculateDelivery/CalculateDelivery.tsx";

const UserPage = () => {
    return (
        <div>
            <header><h1><UserToolbar/></h1></header>
            <main>
                <div className={'pl-2'}>
                    <CalculateDelivery/>
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