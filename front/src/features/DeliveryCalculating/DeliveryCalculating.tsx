import {Button} from "@/components/ui/button.tsx";
import { Search } from 'lucide-react';

const DeliveryCalculating = () => {
    return (
        <div className="container mx-auto my-10 p-5 max-w-6xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                    <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-bold px-2 mx-auto"
                    >Жеткирүү баасын эсептөө</h4>
                    <Button className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 border-2 border-orange-500 bg-orange-500 text-white
                    hover:bg-white hover:text-black rounded-xl
                    active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Расчитать/Эсептөө
                    </Button>

                    <p>Рассчитать доставку</p>
                </div>

                <div className="space-y-4 text-center">
                    <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-bold px-2 mx-auto"
                    >Посылканы көзөмөлдөө</h4>

                    <div className="flex gap-0 w-full max-w-80 sm:max-w-96 md:max-w-110 mx-auto">
                        <input
                            type="text"
                            placeholder="Трек-номер..."
                            className="flex-1 p-2 rounded-l-xl border-2 border-orange-500 border-r-0
               focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
               transition-all duration-200 shadow-md"
                        />
                        <Button className="bg-orange-500 text-white border-2 border-orange-500 rounded-l-none rounded-r-xl
                  hover:bg-orange-400 hover:border-orange-500
                  active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 h-11 shadow-md hover:shadow-lg">
                            <Search className="w-8 h-8" />
                        </Button>
                    </div>
                    <p>Отследить посылку</p>
                </div>

            </div>
        </div>
    );
};

export default DeliveryCalculating;