import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import parcelOnline from '../../assets/images/parcel-online.png';
import number from '../../assets/images/number.png';
import office from '../../assets/images/office.png';
import tracking from '../../assets/images/tracking.png';
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
              src={parcelOnline}
              alt="Оформление посылки"
              className="object-cover w-[160px] h-[158px] ml-[10px]"
            />
            <AvatarFallback>Оформление посылки</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 whitespace-pre-line">
            {t('infoSendPost.subtitleTwo')}
          </div>
          <Avatar className="w-42 h-42 border-5 border-orange-500 flex-shrink-0 mb-1 flex items-center justify-center">
            <AvatarImage
              src={number}
              alt="Получение трек номера"
              className="object-cover w-[158px] h-[160px] ml-[15px]"
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
              src={office}
              alt="Принести посылку в офис"
              className="absolute top-1/2 left-1/2 w-[150px] h-[150px] ml-[4px] object-cover -translate-x-1/2 -translate-y-1/2"
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
              src={tracking}
              alt="Отслеживание посылки"
              className="object-cover w-[200px] h-[185px] ml-[10px] -mt-[7px]"
            />
            <AvatarFallback>Отслеживание посылки</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default InfoSendPost;
