import InfoSendPost from "@/features/infoSendPost/InfoSendPost.tsx";
import UserToolbar from "@/components/UserToolbar/UserToolbar.tsx";
import FooterComponent from "@/features/footer/FooterComponent.tsx";
import DeliveryCostCalculator from '@/features/deliveryCostCalculator/DeliveryCostCalculator.tsx';
import DeliveryCalculating from '@/features/DeliveryCalculating/DeliveryCalculating.tsx';
import ImportantInfo from '@/features/company-info/ImportantInfo.tsx';
import AboutCompany from '@/features/company-info/AboutCompany.tsx';

const UserPage = () => {
    return (
        <div>
            <header className={'mb-20'}><h1><UserToolbar/></h1></header>
            <main>
                <div className={'pl-2 mb-15'}>
                    <DeliveryCalculating/>
                </div>
                <div className={'pl-2'}>
                    <InfoSendPost/>
                </div>
              <div className={'pl-2'}>
                <DeliveryCostCalculator/>
              </div>
                <ImportantInfo />
                <AboutCompany />
                <div className={'pl-2'}>
                    <FooterComponent/>
                </div>
            </main>
        </div>
    );
};

export default UserPage;