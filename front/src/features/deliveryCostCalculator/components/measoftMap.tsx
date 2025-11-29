import { useEffect, useRef, useState } from 'react';
import type {MeasoftMapConfig, MeasoftMapGlobal, MeasoftMapInstance, MeasoftMapProps, PvzFilter} from '@/types';

declare global {
    interface Window {
        measoftMap: MeasoftMapGlobal;
    }
}

const MeasoftMap: React.FC<MeasoftMapProps> = ({
                                                   order,
                                                   onPvzSelect,
                                                   clientId = '8',
                                                   clientCode = ''
                                               }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const mapInstanceRef = useRef<MeasoftMapInstance | null>(null);

    useEffect(() => {
        if (document.getElementById('measoft-map-script')) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = 'measoft-map-script';
        script.src = 'https://home.courierexe.ru/js/measoft_map.js';
        script.type = 'text/javascript';
        script.async = true;

        script.onload = () => {
            setIsScriptLoaded(true);
        };

        script.onerror = () => {
            console.error('Failed to load Measoft map script');
        };

        document.head.appendChild(script);

        return () => {
            if (document.getElementById('measoft-map-script')) {
                document.head.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!isScriptLoaded || !mapContainerRef.current || !window.measoftMap) {
            return;
        }

        const filter: PvzFilter = {};

        if (order.parcelWeight) {
            filter.maxweight = order.parcelWeight;
        }

        try {
            const handlePvzChoice = () => {
                const pvzData = window.measoftMap.getSelectedPvzData();

                if (pvzData && pvzData.code && pvzData.code !== '0') {
                    const getElementValue = (id: string): string => {
                        const element = document.getElementById(id) as HTMLInputElement | null;
                        return element?.value || '';
                    };

                    const getElementNumberValue = (id: string): number => {
                        const element = document.getElementById(id) as HTMLInputElement | null;
                        return element?.value ? parseInt(element.value) : 0;
                    };

                    onPvzSelect({
                        code: pvzData.code,
                        name: pvzData.name,
                        address: pvzData.address,
                        phone: pvzData.phone,
                        worktime: pvzData.worktime,
                        maxweight: pvzData.maxweight,
                        parentcode: getElementValue('pvz_parentcode'),
                        parentname: getElementValue('pvz_parentname'),
                        town: getElementValue('pvz_town'),
                        towncode: getElementValue('pvz_towncode'),
                        region: getElementValue('pvz_region'),
                        acceptcash: getElementNumberValue('pvz_acceptcash'),
                        acceptcard: getElementNumberValue('pvz_acceptcard'),
                    });
                }
            };

            const config: MeasoftMapConfig = {
                mapBlock: 'measoftMapBlock',
                client_id: clientId,
                client_code: clientCode,
                mapSize: {
                    width: '100%',
                    height: '500'
                },
                centerCoords: ['42.8746', '74.5698'],
                lang: 'ru',
                showMapButton: '0',
                showMapButtonCaption: 'Выбрать пункт самовывоза',
                filter: filter,
                allowedFilterParams: ['acceptcash', 'acceptcard', 'acceptfitting'],
                choicePvzCallback: handlePvzChoice,
                townBlock: '',
                windowFixedPosition: '0'
            };

            mapInstanceRef.current = window.measoftMap.config(config).init();

            if (order.destinationCity && order.destinationCity.trim() !== '') {
                setTimeout(() => {
                    centerMapOnCity(order.destinationCity);
                }, 2000);
            }

        } catch (error) {
            console.error('Ошибка инициализации карты ПВЗ:', error);
        }

        return () => {
            if (mapInstanceRef.current?.close) {
                mapInstanceRef.current.close();
            }
        };
    }, [isScriptLoaded, order.destinationCity, order.parcelWeight, clientId, clientCode, onPvzSelect]);

    const centerMapOnCity = async (cityName: string) => {
        try {
            console.log(`🔍 Ищем координаты для города: ${cityName}`);

            const xml = `<?xml version="1.0" encoding="UTF-8" ?>
                <townlist>
                    <conditions>
                        <namestarts>${cityName}</namestarts>
                    </conditions>
                    <limit>
                        <limitcount>1</limitcount>
                    </limit>
                </townlist>`;

            const response = await fetch('https://home.courierexe.ru/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: xml
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseText, 'text/xml');
            const towns = xmlDoc.getElementsByTagName('town');

            if (towns.length > 0) {
                const coords = towns[0].getElementsByTagName('coords')[0];
                const lat = coords.getAttribute('lat');
                const lon = coords.getAttribute('lon');

                if (lat && lon && window.measoftMap?.map) {
                    window.measoftMap.map.setView([lat, lon], 11);
                    console.log(`Карта центрирована на: ${cityName} (${lat}, ${lon})`);
                } else {
                    console.warn(' Координаты получены, но карта недоступна');
                }
            } else {
                console.warn(`Город "${cityName}" не найден в базе MeaSoft`);
            }
        } catch (error) {
            console.error('Ошибка при центрировании карты на городе:', error);
        }
    };

    return (
        <div className="w-full">
            <div
                id="measoftMapBlock"
                ref={mapContainerRef}
                className="min-h-[500px] rounded-xl overflow-hidden border-2 border-gray-200"
            >
                {!isScriptLoaded && (
                    <div className="flex items-center justify-center h-[500px] bg-gray-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Загрузка карты...</p>
                        </div>
                    </div>
                )}
            </div>

            {order.pvzData && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-green-800 mb-2">Выбран пункт выдачи:</h4>
                            <p className="font-semibold text-gray-800">{order.pvzData.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{order.pvzData.address}</p>
                            {order.pvzData.phone && (
                                <p className="text-sm text-gray-600">Телефон: {order.pvzData.phone}</p>
                            )}
                            {order.pvzData.worktime && (
                                <p className="text-sm text-gray-600">Режим работы: {order.pvzData.worktime}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeasoftMap;