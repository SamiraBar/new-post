import { TriangleAlert } from 'lucide-react';

export const WarningNotices = () => {
    return (
        <div className="flex flex-col gap-5 mt-10 text-sm md:text-base px-1 sm:px-5">
            <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange" />
                <div>
                    <p>Посылканын баасын туура көрсөт. Посылка жоголсо, баасын кайтарып беребиз.</p>
                    <p>Указывай стоимость посылки правильно. В случае потери вернем указанную стоимость.</p>
                </div>
            </div>
            <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange" />
                <div>
                    <p>Посылканын салмагын туура көрсөт.</p>
                    <p>Правльно указывайте вес посылки.</p>
                </div>
            </div>
            <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange" />
                <div>
                    <p>Посылканын баардык тараптарынын суммасы 250 см ашпашы керек.</p>
                    <p>Эң узун тарап 100 см ашпашы керек.</p>
                    <p>Сумма всех сторон посылки не должна превышать 250 см.</p>
                    <p>Самая длинная сторона не должна превышать 100 см.</p>
                </div>
            </div>
        </div>
    );
};