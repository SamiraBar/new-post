import { useEffect, useRef, useState } from 'react';
import type { MeasoftMapConfig, MeasoftMapGlobal, MeasoftMapInstance, MeasoftMapProps, PvzFilter } from '@/types';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    measoftMap: MeasoftMapGlobal;
  }
}

const MeasoftMap: React.FC<MeasoftMapProps> = ({
                                                 form,
                                                 onPvzSelect,
                                                 clientId = '8',
                                                 clientCode = ''
                                               }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const mapInstanceRef = useRef<MeasoftMapInstance | null>(null);
  const {
    t,
    i18n
  } = useTranslation();

  const {watch} = form;
  const {destinationCity, parcelWeight, pvzData} = watch();

  const getMapLanguage = () => {
    const currentLang = i18n.language;
    return currentLang === 'kg' ? 'ru' : currentLang;
  };

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
      console.error(t('measoftMap.errors.scriptLoadFailed'));
    };

    document.head.appendChild(script);

    return () => {
      if (document.getElementById('measoft-map-script')) {
        document.head.removeChild(script);
      }
    };
  }, [t]);

  useEffect(() => {
    if (!isScriptLoaded || !mapContainerRef.current || !window.measoftMap) {
      return;
    }

    const filter: PvzFilter = {};

    if (parcelWeight) {
      filter.maxweight = parcelWeight;
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

          const parentcode = getElementValue('pvz_parentcode');
          console.log('=' .repeat(60));
          console.log('🗺️ ПВЗ выбран на карте');
          console.log('=' .repeat(60));
          console.log('📋 Базовые данные из pvzData:');
          console.log('  - code:', pvzData.code);
          console.log('  - name:', pvzData.name);
          console.log('  - address:', pvzData.address);
          console.log('  - phone:', pvzData.phone);
          console.log('  - worktime:', pvzData.worktime);
          console.log('  - maxweight:', pvzData.maxweight);

          console.log('\n📋 Данные из скрытых полей DOM:');
          console.log('  - pvz_parentcode:', parentcode);
          console.log('  - pvz_parentname:', getElementValue('pvz_parentname'));
          console.log('  - pvz_town:', getElementValue('pvz_town'));
          console.log('  - pvz_towncode:', getElementValue('pvz_towncode'));
          console.log('  - pvz_region:', getElementValue('pvz_region'));
          console.log('  - pvz_acceptcash:', getElementNumberValue('pvz_acceptcash'));
          console.log('  - pvz_acceptcard:', getElementNumberValue('pvz_acceptcard'));

          console.log('\n🎯 Определение РЦ:');
          if (parentcode === '2495') {
            console.log('  ✅ РЦ: Екатеринбург (ЕКБ)');
            console.log('  📦 service для E-Kit: 15');
          } else if (parentcode === '18483') {
            console.log('  ✅ РЦ: Москва (МСК)');
            console.log('  📦 service для E-Kit: 14');
          } else {
            console.log('  ⚠️ Неизвестный parentcode:', parentcode);
            console.log('  📦 service по умолчанию: 14 (МСК)');
          }
          console.log('=' .repeat(60));

          onPvzSelect({
            code: pvzData.code,
            name: pvzData.name,
            address: pvzData.address,
            phone: pvzData.phone,
            worktime: pvzData.worktime,
            maxweight: pvzData.maxweight,
            parentcode: parentcode,
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
        lang: getMapLanguage(),
        showMapButton: '0',
        showMapButtonCaption: t('measoftMap.mapButtonCaption'),
        filter: filter,
        allowedFilterParams: ['acceptcash', 'acceptcard', 'acceptfitting'],
        choicePvzCallback: handlePvzChoice,
        townBlock: '',
        windowFixedPosition: '0'
      };

      mapInstanceRef.current = window.measoftMap.config(config).init();

      if (destinationCity && destinationCity.trim() !== '') {
        const tryToCenter = () => {
          if (window.measoftMap?.map?.getCenter) {
            centerMapOnCity(destinationCity);
          } else {
            setTimeout(tryToCenter, 500);
          }
        };

        setTimeout(tryToCenter, 300);
      }

    } catch (error) {
      console.error(t('measoftMap.errors.mapInitializationFailed'), error);
    }

    return () => {
      if (mapInstanceRef.current?.close) {
        mapInstanceRef.current.close();
      }
    };
  }, [isScriptLoaded, destinationCity, parcelWeight, clientId, clientCode, onPvzSelect, t, getMapLanguage]);

  const centerMapOnCity = async (cityName: string) => {
    try {
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
        }
      } else {
        console.warn(t('measoftMap.errors.cityNotFound', {city: cityName}));
      }
    } catch (error) {
      console.error(t('measoftMap.errors.geocodingError'), error);
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
              <p className="text-gray-600">{t('measoftMap.loading')}</p>
            </div>
          </div>
        )}
      </div>

      {pvzData && (
        <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-green-800 mb-2">{t('measoftMap.selectedTitle')}</h4>
              <p className="font-semibold text-gray-800">{pvzData.name}</p>
              <p className="text-sm text-gray-600 mt-1">{pvzData.address}</p>
              {pvzData.phone && (
                <p className="text-sm text-gray-600">
                  {t('measoftMap.phone')}: {pvzData.phone}
                </p>
              )}
              {pvzData.worktime && (
                <p className="text-sm text-gray-600">
                  {t('measoftMap.worktime')}: {pvzData.worktime}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasoftMap;