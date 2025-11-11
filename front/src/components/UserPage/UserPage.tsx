import InfoSendPost from '@/features/infoSendPost/InfoSendPost.tsx';
import UserToolbar from '@/components/UserToolbar/UserToolbar.tsx';
import FooterComponent from '@/features/footer/FooterComponent.tsx';
import DeliveryCostCalculator from '@/features/deliveryCostCalculator/DeliveryCostCalculator.tsx';
import DeliveryCalculating from '@/features/deliveryCalculating/DeliveryCalculating.tsx';
import ImportantInfo from '@/features/company-info/ImportantInfo.tsx';
import AboutCompany from '@/features/company-info/AboutCompany.tsx';

const UserPage = () => {
  return (
    <div>
      <header className={'mb-20'}>
        <h1>
          <UserToolbar />
        </h1>
      </header>
      <main>
        <div className={'mb-15'}>
          <DeliveryCalculating />
        </div>
        <InfoSendPost />
        <DeliveryCostCalculator />
        <div className={'mt-4 mb-4 sm:mt-6 sm:mb-6 md:mt-8 md:mb-8 lg:mt-10 lg:mb-10'}>
          <ImportantInfo />
        </div>
        <div className={'mt-4 mb-4 sm:mt-6 sm:mb-6 md:mt-8 md:mb-8 lg:mt-10 lg:mb-10'}>
          <AboutCompany />
        </div>
        <div className={'sm:mt-6 md:mt-8 lg:mt-10'}>
          <FooterComponent />
        </div>
      </main>
    </div>
  );
};

export default UserPage;
