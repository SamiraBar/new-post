import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Clock, HandCoins, Weight, MapPin, Package, Navigation } from 'lucide-react';

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
  const [isMapVisible, setIsMapVisible] = useState(false);

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
          'height': '500'
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
          setIsMapVisible(false);
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
      #measoftMapBlock {
        margin-right: 25px !important;
        margin-top: 15px !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        border: 2px solid #fed7aa !important;
      }
      
      #measoftMapBlock .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid #fdba74 !important;
      }
      
      #measoftMapBlock .leaflet-popup-content input[type="button"] {
        background: linear-gradient(135deg, #f97316, #fb923c) !important;
        color: white !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 10px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3) !important;
        font-size: 14px !important;
        width: 100% !important;
        margin-top: 8px !important;
      }
      
      #measoftMapBlock .leaflet-popup-content input[type="button"]:hover {
        background: linear-gradient(135deg, #ea580c, #f97316) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
      }
      
      #open_map_button {
        background: linear-gradient(135deg, #f97316, #fb923c) !important;
        color: white !important;
        border: none !important;
        padding: 14px 28px !important;
        border-radius: 10px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3) !important;
        font-size: 14px !important;
      }
      
      #open_map_button:hover {
        background: linear-gradient(135deg, #ea580c, #f97316) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
      }
      
      #map_filter_block {
        background: white !important;
        border-radius: 10px !important;
        padding: 16px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid #fed7aa !important;
        margin: 10px !important;
      }
      
      #map_filter_block input[type="checkbox"] {
        accent-color: #f97316 !important;
        transform: scale(1.2) !important;
        margin-right: 8px !important;
      }
      
      #map_filter_block select {
        border: 2px solid #fed7aa !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        background: white !important;
        font-size: 14px !important;
        transition: all 0.3s ease !important;
      }
      
      #map_filter_block select:focus {
        border-color: #f97316 !important;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
        outline: none !important;
      }
      
      .leaflet-marker-icon {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) !important;
      }
      
      .map-search-container {
        position: absolute !important;
        top: 20px !important;
        left: 20px !important;
        right: 20px !important;
        z-index: 1000 !important;
        background: white !important;
        border-radius: 10px !important;
        padding: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid #fed7aa !important;
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
    setIsMapVisible(true);
  };

  const isButtonDisabled = Boolean(selectedSenderCity && !pickupPoint.code) || !parcelValue || !parcelWeight;

  return (
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-medium text-center mb-10 text-gray-800">
          Жеткирүү баасын эсептөө калькулятору <br/>
          <span className="text-lg text-gray-600">Калькулятор расчёта стоимости доставки</span>
        </h3>

        <div className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 shadow-sm">
          <input type="hidden" id="pvz_code" value={pickupPoint.code} />
          <input type="hidden" id="pvz_name" value={pickupPoint.name} />
          <input type="hidden" id="pvz_address" value={pickupPoint.address} />
          <input type="hidden" id="pvz_phone" value={pickupPoint.phone} />
          <input type="hidden" id="pvz_worktime" value={pickupPoint.worktime} />

          <form className="w-full lg:flex gap-6">
            <div className="border border-orange-200 p-6 rounded-2xl w-full shadow-lg bg-white">
              <FieldGroup>
                <FieldSet>
                  <div>
                    <FieldGroup className="gap-4 mb-6">
                      <div className="flex items-center">
                        <FieldLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                          <Package className="w-5 h-5 text-orange-500" />
                          Жиберүүчү / Отправитель
                        </FieldLabel>
                      </div>

                      <Field>
                        <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                          Шаар / Город отправления
                        </FieldLabel>
                        <Select onValueChange={handleSenderCitySelect}>
                          <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-500 transition-all duration-300 rounded-xl py-6 bg-white hover:border-orange-300">
                            <SelectValue placeholder={
                              <div className="flex items-center gap-2 text-gray-500">
                                <Navigation className="w-4 h-4" />
                                Өзүңүздүн шаарыңызды тандаңыз / Выберите ваш город
                              </div>
                            }/>
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-orange-200 shadow-lg">
                            {cities.map((city) => (
                                <SelectItem key={city} value={city} className="flex items-center gap-2 py-3 rounded-lg hover:bg-orange-50 transition-colors">
                                  <MapPin className="w-4 h-4 text-orange-500" />
                                  <span className="font-medium">{city}</span>
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>

                    {selectedSenderCity && (
                        <Field className="mt-6">
                          <FieldLabel className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-800">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            Пункт самовывоза Получателя / Pickup Point at End
                          </FieldLabel>

                          <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl shadow-sm">
                            <p className="text-sm text-orange-800 flex items-start gap-2">
                              <span className="text-orange-500 text-lg">🎯</span>
                              <span>
                                <strong>Инструкция:</strong> Выберите удобный пункт самовывоза на карте для получателя.
                                Нажмите на маркер 📍 и затем кнопку "Выбрать ПВЗ"
                              </span>
                            </p>
                          </div>
                          <div className="relative border-2 border-orange-200 rounded-2xl bg-white shadow-lg overflow-hidden">
                            {isMapVisible && (
                                <div
                                    id="measoftMapBlock"
                                    className="min-h-[500px] transition-all duration-500 ease-in-out"
                                    style={{
                                      marginRight: '25px',
                                      marginTop: '15px'
                                    }}
                                >
                                  <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
                                      <p className="text-sm">Загрузка карты...</p>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {!isMapVisible && (
                                <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                  <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <MapPin className="w-8 h-8 text-orange-500" />
                                    </div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Карта пунктов самовывоза</h4>
                                    <p className="text-sm text-gray-500 mb-4">Выберите город, чтобы увидеть доступные пункты</p>
                                    <Button
                                        onClick={() => setIsMapVisible(true)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                      Показать карту
                                    </Button>
                                  </div>
                                </div>
                            )}
                          </div>

                          {pickupPoint.code && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm transition-all duration-500">
                                <h4 className="font-semibold text-green-800 mb-3 text-lg flex items-center gap-2">
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                  </div>
                                  ✅ Выбран пункт самовывоза
                                </h4>
                                <div className="space-y-3">
                                  <p className="font-semibold text-gray-800 text-base">{pickupPoint.name}</p>
                                  <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                                    <span>{pickupPoint.address}</span>
                                  </p>
                                  {pickupPoint.phone && (
                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <span className="text-green-500">📞</span> {pickupPoint.phone}
                                      </p>
                                  )}
                                  {pickupPoint.worktime && (
                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <span className="text-green-500">🕒</span> {pickupPoint.worktime}
                                      </p>
                                  )}
                                </div>
                              </div>
                          )}
                        </Field>
                    )}

                    <FieldGroup className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                      <Field className="flex-1">
                        <FieldLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <HandCoins className="w-4 h-4 text-orange-500" />
                          Посылканын баалуулугу / Ценность посылки
                        </FieldLabel>
                        <div className="relative">
                          <Input
                              placeholder="1000"
                              required
                              type="number"
                              className="w-full pr-12 border-2 border-orange-200 focus:border-orange-500 rounded-xl py-6 transition-all duration-300 bg-white"
                              value={parcelValue}
                              onChange={(e) => setParcelValue(e.target.value)}
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">сом</span>
                        </div>
                      </Field>
                      <Field className="flex-1">
                        <FieldLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Weight className="w-4 h-4 text-orange-500" />
                          Посылканын салмагы / Вес посылки
                        </FieldLabel>
                        <div className="relative">
                          <Input
                              placeholder="0.5"
                              required
                              type="number"
                              step="0.1"
                              className="w-full pr-12 border-2 border-orange-200 focus:border-orange-500 rounded-xl py-6 transition-all duration-300 bg-white"
                              value={parcelWeight}
                              onChange={(e) => setParcelWeight(e.target.value)}
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">кг</span>
                        </div>
                      </Field>
                    </FieldGroup>
                  </div>
                </FieldSet>
              </FieldGroup>
            </div>
            <div className="shadow-lg border border-orange-200 flex flex-col gap-6 p-6 rounded-2xl w-full mt-6 lg:mt-0 lg:w-2/5 bg-white h-fit">
              <div className="text-center mb-2">
                <h4 className="text-lg font-bold text-gray-800">Расчет стоимости</h4>
                <p className="text-sm text-gray-600">Предварительный расчет</p>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <HandCoins className="w-5 h-5 text-white"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Жеткирүү наркы</p>
                    <p className="text-xs text-gray-600">Стоимость доставки</p>
                  </div>
                </div>
                <span className="text-2xl text-orange-600 font-bold">0 сом</span>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Жеткирүү убактысы</p>
                    <p className="text-xs text-gray-600">Время доставки</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">10 - Күн</p>
                  <p className="text-xs text-gray-600">Дней</p>
                </div>
              </div>

              {selectedSenderCity && !pickupPoint.code ? (
                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-700 text-center flex items-center justify-center gap-2">
                      <span>⚠️</span>
                      Пожалуйста, выберите пункт самовывоза на карте.
                    </p>
                  </div>
              ) : null}

              <Button
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
                  type="submit"
                  disabled={isButtonDisabled}
              >
                <div className="text-center w-full">
                  <div className="font-semibold text-lg">Посылканы онлайн каттоо</div>
                  <div className="text-sm opacity-90">Оформить посылку онлайн</div>
                </div>
              </Button>

              {pickupPoint.code && (
                  <div className="p-3 bg-green-50 border border-green-300 rounded-lg">
                    <p className="font-semibold text-green-700 text-sm flex items-center gap-2">
                      <span>✅</span>
                      Выбран ПВЗ:
                    </p>
                    <p className="text-sm text-gray-600 truncate">{pickupPoint.name}</p>
                  </div>
              )}
            </div>
          </form>
        </div>
      </div>
  );
};

export default DeliveryCostCalculator;