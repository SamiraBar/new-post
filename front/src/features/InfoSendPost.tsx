import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

const InfoSendPost = () => {
    return (
        <div className={'m-10 p-5 border border-chart-2 bg-chart-4/20 rounded-lg'}>
            <h2 className="text-xl font-bold text-center mb-4">Посылканы кантип жиберсе болот?</h2>
            <h2 className="text-xl font-bold text-center mb-10">Как отправить посылку?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 justify-items-center">
                <div className="flex flex-col items-center">
                    <div className="mb-2 text-center text-shadow-md">Посылканы онлайн каттоодон откор</div>
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 border-chart-1">
                        <AvatarImage src="/src/assets/images/Image.png" alt="Оформление посылки" />
                        <AvatarFallback>Оформление посылки</AvatarFallback>
                    </Avatar>
                    <div className="text-sm mt-2 text-center">Оформи посылку онлайн</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-shadow-md mb-2 text-center">Посылканын трек номерин ал</div>
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 border-chart-1">
                        <AvatarImage src="/src/assets/images/Image.png" alt="Получение трек номера" />
                        <AvatarFallback>Получение трек номера</AvatarFallback>
                    </Avatar>
                    <div className="text-sm mt-2 text-center">Получи трек номер посылки</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-shadow-md mb-2 text-center">Посылканы офиске алып кел</div>
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 border-chart-1">
                        <AvatarImage src="/src/assets/images/Image.png" alt="Принести посылку в офис" />
                        <AvatarFallback>Принести посылку в офис</AvatarFallback>
                    </Avatar>
                    <div className="text-sm mt-2 text-center">Принести посылку в офис</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-shadow-md mb-2 text-center">Посылканы онлайн козомолдоо</div>
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 border-chart-1">
                        <AvatarImage src="/src/assets/images/Image.png" alt="Отслеживание посылки" />
                        <AvatarFallback>Отслеживание посылки</AvatarFallback>
                    </Avatar>
                    <div className="text-sm mt-2 text-center">Отслеживание посылки</div>
                </div>
            </div>
        </div>
    );
};

export default InfoSendPost;