import {Button} from "@/components/ui/button.tsx";

const DeliveryCalculating = () => {
    return (
        <div className="container mx-auto my-10 p-5 max-w-6xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                    <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 mx-auto"
                    >Жеткирүү баасын эсептегиле</h4>
                    <Button className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 border-2 border-orange-500 bg-orange-500 text-white
                    hover:bg-white hover:text-black rounded-xl
                    active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200"
                    >
                        Расчитать/Эсептөө
                    </Button>

                    <p>Рассчитать доставку</p>
                </div>

                <div className="space-y-4">
                    <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-medium px-2 mx-auto"
                    >Посылканы көзөмөлдөгүлө</h4>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Трек-номер..."
                            className="flex-1 p-2 border rounded"
                        />
                        <Button>
                            Издөө 🔍
                        </Button>
                    </div>
                    <p>Отследить посылку</p>
                </div>

            </div>
        </div>
    );
};

export default DeliveryCalculating;