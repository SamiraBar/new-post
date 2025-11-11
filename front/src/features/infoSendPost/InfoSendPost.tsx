import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import macnewpost from '../../assets/images/macnewpost.jpg';
import number from '../../assets/images/number.jpg';
import cafe from '../../assets/images/cafe.jpg';
import map from '../../assets/images/map.jpg';
import { useTranslation } from 'react-i18next';

const InfoSendPost = () => {
  const { t } = useTranslation();
  return (
    <div className={'mx-auto my-20 p-5 rounded-lg max-w-6xl overflow-hidden'}>
      <h2 className="text-xl font-bold text-center mb-10">{t('infoSendPost.title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="flex flex-col items-center ">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 whitespace-pre-line">
            {t('infoSendPost.subtitleOne')}
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage
              src={macnewpost}
              alt="Оформление посылки"
              className="object-cover w-[158px] h-[158px]"
            />
            <AvatarFallback>Оформление посылки</AvatarFallback>120px
          </Avatar>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 whitespace-pre-line">
            {t('infoSendPost.subtitleTwo')}
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage
              src={number}
              alt="Получение трек номера"
              className="object-cover w-[158px] h-[158px]"
            />
            <AvatarFallback>Получение трек номера</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 whitespace-pre-line">
            {t('infoSendPost.subtitleThee')}
          </div>
          <Avatar className="relative w-[168px] h-[168px] border-4 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage
              src={cafe}
              alt="Принести посылку в офис"
              className="absolute top-1/2 left-1/2 w-[120px] h-[120px] object-cover -translate-x-1/2 -translate-y-1/2"
            />
            <AvatarFallback>Принести посылку в офис</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 whitespace-pre-line">
            {t('infoSendPost.subtitleFor')}
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1">
            <AvatarImage
              src={map}
              alt="Отслеживание посылки"
              className="object-cover w-[150px] h-[130px]"
            />
            <AvatarFallback>Отслеживание посылки</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default InfoSendPost;
