import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import mackbookPro from "../../assets/images/macbook-pro.png"
import number from "../../assets/images/number-car.png"
import cafe from "../../assets/images/cafe.png"
import map from "../../assets/images/map-location.png"

const InfoSendPost = () => {
  return (
    <div className={'mx-auto my-10 p-5 rounded-lg max-w-6xl overflow-hidden'}>
      <h2 className="text-xl font-medium text-center mb-1">Посылканы кантип жиберсе болот?</h2>
      <h2 className="text-xl font-medium text-center mb-10">Как отправить посылку?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="flex flex-col items-center ">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2">
            Посылканы онлайн <br/> каттоодон өткөр
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage src={mackbookPro} alt="Оформление посылки" />
            <AvatarFallback>Оформление посылки</AvatarFallback>
          </Avatar>
          <div className="h-10 flex items-center justify-center text-base text-center font-medium">
            Оформи посылку<br/>онлайн
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2">
            Посылканын <br/>трек номерин ал
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage src={number} alt="Получение трек номера" />
            <AvatarFallback>Получение трек номера</AvatarFallback>
          </Avatar>
          <div className="h-10 flex items-center justify-center text-base text-center font-medium">
            Получи трек номер<br/>посылки
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2">
            Посылканы <br/>офиске алып кел
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage src={cafe} alt="Принести посылку в офис" />
            <AvatarFallback>Принести посылку в офис</AvatarFallback>
          </Avatar>
          <div className="h-10 flex items-center justify-center text-base text-center font-medium">
            Принеси посылку<br/>в офис
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2">
            Посылканы онлайн көзөмөлдөө
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage src={map} alt="Отслеживание посылки" />
            <AvatarFallback>Отслеживание посылки</AvatarFallback>
          </Avatar>
          <div className="h-10 flex items-center justify-center text-base text-center font-medium">
            Отслеживание<br/>посылки
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSendPost;