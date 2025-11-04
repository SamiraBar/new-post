import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Clock, HandCoins, Weight, MapPin, Package } from 'lucide-react';

interface MeasoftMapConfig {
  mapBlock: string;
  client_id: string;
  client_code: string;
  mapSize: {
    width: string;
    height: string;
  };
  centerCoords: [string, string];
  showMapButton: string;
  showMapButtonCaption: string;
  filter: {
    acceptcard: string;
    acceptcash: string;
  };
  choicePvzCallback: (code: string) => void;
  pvzCodeSelector?: string;
  pvzNameSelector?: string;
  pvzAddressSelector?: string;
}

interface PvzData {
  code: string;
  name: string;
  address: string;
  phone: string;
  worktime: string;
  maxweight: string;
  parentname: string;
}

interface MeasoftMap {
  config: (config: MeasoftMapConfig) => {
    init: () => void;
  };
  getSelectedPvzData?: () => PvzData;
  showMap?: (loadStores: number) => void;
  close?: () => void;
  open?: (openid?: string) => void;
}

declare global {
  interface Window {
    measoftMap: MeasoftMap;
  }
}

const DeliveryCostCalculator = () => {
  const cities = ['Bishkek', 'Osh', 'Karakol', 'Naryn', 'Tokmok', 'Kara-Balta', 'Kant'];
  const [selectedSenderCity, setSelectedSenderCity] = useState('');
  const [pickupPoint, setPickupPoint] = useState({
    code: '',
    name: '',
    address: '',
    phone: '',
    worktime: ''
  });
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [parcelValue, setParcelValue] = useState('');
  const [parcelWeight, setParcelWeight] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://home.courierexe.ru/js/measoft_map.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);

    script.onload = () => {
      console.log('Measoft map script loaded');
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedSenderCity && window.measoftMap && !isMapInitialized) {
      initializeMap();
    }
  }, [selectedSenderCity, isMapInitialized]);

  const initializeMap = () => {
    if (!window.measoftMap) {
      console.log('Measoft map not available');
      return;
    }

    try {
      const config: MeasoftMapConfig = {
        'mapBlock': 'measoftMapBlock',
        'client_id': '8',
        'client_code': '1513',
        'mapSize': {
          'width': '100%',
          'height': '450'
        },
        'centerCoords': ['42.8746', '74.5698'],
        'showMapButton': '1',
        'showMapButtonCaption': '📍 Выбрать пункт самовывоза',
        'filter': {
          'acceptcard': 'YES',
          'acceptcash': 'YES'
        },
        'choicePvzCallback': function(code: string) {
          console.log('Selected PVZ:', code);
          updatePickupPointData();
        },
        'pvzCodeSelector': '#pvz_code',
        'pvzNameSelector': '#pvz_name',
        'pvzAddressSelector': '#pvz_address'
      };

      window.measoftMap.config(config).init();
      setIsMapInitialized(true);
      addCustomStyles();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addCustomStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      #measoftMapBlock .leaflet-popup-content input[type="button"] {
        background: linear-gradient(135deg, #f97316, #fb923c) !important;
        color: white !important;
        border: none !important;
        padding: 10px 20px !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3) !important;
      }
      
      #measoftMapBlock .leaflet-popup-content input[type="button"]:hover {
        background: linear-gradient(135deg, #ea580c, #f97316) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4) !important;
      }
      #open_map_button {
        background: linear-gradient(135deg, #f97316, #fb923c) !important;
        color: white !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3) !important;
      }
      
      #open_map_button:hover {
        background: linear-gradient(135deg, #ea580c, #f97316) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4) !important;
      }
      
      #map_filter_block input[type="checkbox"] {
        accent-color: #f97316 !important;
      }
      
      #map_filter_block select {
        border: 2px solid #f97316 !important;
        border-radius: 6px !important;
        padding: 4px 8px !important;
      }
    `;
    document.head.appendChild(style);
  };

  const updatePickupPointData = () => {
    if (window.measoftMap?.getSelectedPvzData) {
      const pvzData = window.measoftMap.getSelectedPvzData();
      if (pvzData) {
        setPickupPoint({
          code: pvzData.code || '',
          name: pvzData.name || '',
          address: pvzData.address || '',
          phone: pvzData.phone || '',
          worktime: pvzData.worktime || ''
        });
      }
    }
  };

  const handleSenderCitySelect = (city: string) => {
    setSelectedSenderCity(city);
    setPickupPoint({
      code: '',
      name: '',
      address: '',
      phone: '',
      worktime: ''
    });
    setIsMapInitialized(false);
  };

  const isButtonDisabled = Boolean(selectedSenderCity && !pickupPoint.code) || !parcelValue || !parcelWeight;

  return (
      <div className="container">
        <h3 className="text-xl font-medium text-center mb-10">
          Жеткирүү баасын эсептөө калькулятору <br/> Калькулятор расчёта стоимости доставки
        </h3>
        <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg ">
          <input type="hidden" id="pvz_code" value={pickupPoint.code} />
          <input type="hidden" id="pvz_name" value={pickupPoint.name} />
          <input type="hidden" id="pvz_address" value={pickupPoint.address} />
          <input type="hidden" id="pvz_phone" value={pickupPoint.phone} />
          <input type="hidden" id="pvz_worktime" value={pickupPoint.worktime} />

          <form className="w-full lg:flex">
            <div className="border p-5 rounded-lg w-full shadow-lg bg-white">
              <FieldGroup>
                <FieldSet>
                  <div>
                    <FieldGroup className="gap-4 mb-6">
                      <div className="flex items-center">
                        <FieldLabel className="text-lg font-semibold flex items-center gap-2">
                          <Package className="w-5 h-5 text-orange-500" />
                          Жиберүүчү / Отправитель
                        </FieldLabel>
                      </div>

                      <Field>
                        <FieldLabel>Шаар / Город</FieldLabel>
                        <Select onValueChange={handleSenderCitySelect}>
                          <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-500 transition-colors">
                            <SelectValue placeholder="Өзүңүздүн шаарыңызды тандаңыз / Выберите ваш город"/>
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                                <SelectItem key={city} value={city} className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-orange-500" />
                                  {city}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                    {selectedSenderCity && (
                        <Field className="mt-6">
                          <FieldLabel className="flex items-center gap-2 text-lg font-semibold mb-3">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            Пункт самовывоза Получателя/ Pickup Point at End
                          </FieldLabel>

                          <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              🎯 <strong>Инструкция:</strong> Выберите удобный пункт самовывоза на карте.
                              Нажмите на маркер 📍 и затем кнопку "Выбрать ПВЗ"
                            </p>
                          </div>

                          <div className="border-2 border-orange-200 rounded-lg p-4 bg-white shadow-sm">
                            <div id="measoftMapBlock" className="min-h-[450px] border rounded-lg overflow-hidden">
                              <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                                  Загрузка карты...
                                </div>
                              </div>
                            </div>

                            {pickupPoint.code && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg shadow-sm">
                                  <h4 className="font-semibold text-green-800 mb-3 text-lg flex items-center gap-2">
                                    ✅ Выбран пункт самовывоза
                                  </h4>
                                  <div className="space-y-2">
                                    <p className="font-medium text-gray-800 text-lg">{pickupPoint.name}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <MapPin className="w-4 h-4" /> {pickupPoint.address}
                                    </p>
                                    {pickupPoint.phone && (
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                          📞 {pickupPoint.phone}
                                        </p>
                                    )}
                                    {pickupPoint.worktime && (
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                          🕒 {pickupPoint.worktime}
                                        </p>
                                    )}
                                  </div>
                                </div>
                            )}
                          </div>
                        </Field>
                    )}
                    <FieldGroup className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                      <Field className="flex-1">
                        <FieldLabel className="flex items-center gap-2">
                          <HandCoins className="w-4 h-4 text-orange-500" />
                          Посылканын баалуулугу / Ценность посылки
                        </FieldLabel>
                        <div className="relative">
                          <Input
                              placeholder="1000"
                              required
                              className="w-full pr-8 border-2 border-orange-200 focus:border-orange-500"
                              value={parcelValue}
                              onChange={(e) => setParcelValue(e.target.value)}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">сом</span>
                        </div>
                      </Field>
                      <Field className="flex-1">
                        <FieldLabel className="flex items-center gap-2">
                          <Weight className="w-4 h-4 text-orange-500" />
                          Посылканын салмагы / Вес посылки
                        </FieldLabel>
                        <div className="relative">
                          <Input
                              placeholder="кг"
                              required
                              className="w-full pr-8 border-2 border-orange-200 focus:border-orange-500"
                              value={parcelWeight}
                              onChange={(e) => setParcelWeight(e.target.value)}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">кг</span>
                        </div>
                      </Field>
                    </FieldGroup>
                  </div>
                </FieldSet>
              </FieldGroup>
            </div>
            <div className="shadow-lg border flex flex-col gap-4 p-5 rounded-lg w-full mt-5 lg:mt-0 lg:ml-5 lg:w-1/2 bg-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500"/>
                  <div>
                    <p className="text-sm md:text-base font-medium">Жеткирүү наркы</p>
                    <p className="text-sm md:text-base text-gray-600">Стоимость доставки</p>
                  </div>
                </div>
                <span className="text-2xl md:text-3xl text-orange-500 font-bold">0 сом</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500"/>
                  <div>
                    <p className="text-sm md:text-base font-medium">Жеткирүү убактысы</p>
                    <p className="text-sm md:text-base text-gray-600">Время доставки</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg md:text-xl font-semibold">10 - Күн</p>
                  <p className="text-sm text-gray-600">Дней</p>
                </div>
              </div>

              {selectedSenderCity && !pickupPoint.code ? (
                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 text-center">
                      ⚠️ Пожалуйста, выберите пункт самовывоза на карте выше
                    </p>
                  </div>
              ) : null}

              <Button
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  type="submit"
                  disabled={isButtonDisabled}
              >
                <div className="text-center">
                  <div className="font-semibold">Посылканы онлайн каттоо</div>
                  <div>Оформить посылку онлайн</div>
                </div>
              </Button>

              {pickupPoint.code && (
                  <div className="lg:hidden mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-700 text-sm">Выбран ПВЗ:</p>
                    <p className="text-sm text-gray-600">{pickupPoint.name}</p>
                  </div>
              )}
            </div>
          </form>
        </div>
      </div>
  );
};

export default DeliveryCostCalculator;