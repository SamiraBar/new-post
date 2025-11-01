import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { type ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';

const DeliveryCostCalculator = () => {
  const cities = ['Bishkek', 'Osh', 'Karakol', 'Naryn'];
  const [city, setCity] = useState('');
  const filteredCities = cities.filter((c) => c.toLowerCase().includes(city.toLowerCase()));

  return (
    <div
      className="mt-20 min-h-screen md:flex md:items-center md:justify-center overflow-x-hidden">
      <form className="md:w-10/12 p-2 lg:flex">
        <div className="border p-5 rounded-lg w-full shadow-lg">
          <FieldGroup>
            <FieldSet>
              <h1 className="text-lg md:text-2xl">
                Жеткирүү баасын эсептөө калькулятору / Калькулятор расчёта стоимости доставки
              </h1>
              <div>
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                  <FieldGroup className="gap-4">
                    <FieldLabel>Жиберүүчү / Отправитель</FieldLabel>
                    <Select onOpenChange={(open) => {
                      if (!open) {
                        setCity('');
                      }
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Жиберүүчү өлкө / Страна отправителя"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Кыргызстан</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Жиберүүчү шаар / Город отправителя"/>
                      </SelectTrigger>
                      <SelectContent>
                        <Input
                          value={city}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                          className="w-full"
                        />
                        {filteredCities.map((city) => (
                          <SelectItem value={city} key={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>

                  <FieldGroup className="gap-4">
                    <FieldLabel>Алуучу / Получатель</FieldLabel>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Алуучу өлкө / Страна получателя"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Кыргызстан</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Алуучу шаар / Город получателя"/>
                      </SelectTrigger>
                      <SelectContent>
                        <Input
                          value={city}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                        />
                        {filteredCities.map((city) => (
                          <SelectItem value={city} key={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>

                <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 min-w-0">
                  <Field>
                    <FieldLabel>Посылканын баалуулугу / Ценность посылки</FieldLabel>
                    <Input
                      placeholder="1000"
                      required
                      className="w-full"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Посылканын салмагы / Вес посылки</FieldLabel>
                    <Input
                      placeholder="кг"
                      required
                      className="w-full"
                    />
                  </Field>
                </FieldGroup>
              </div>
            </FieldSet>
          </FieldGroup>
        </div>
        <div
          className="shadow-lg border flex flex-col gap-2 sm:gap-4 p-5 rounded-lg w-full mt-5 lg:mt-0 lg:ml-5 lg:w-1/3">
          <p>Жеткирүү наркы <br/> Стоимость доставки</p>
          <span className="text-2xl md:text-3xl text-orange-500 font-medium">0сом</span>
          <p className="text-sm md:text-base">Жеткирүү убактысы / Время доставки: <span className="text-orange-500">10 Күн / День</span>
          </p>
          <Button className="bg-orange-400 px-5 py-3 md:py-5"
                  type="submit">
            Посылканы онлайн каттоо
            <br/>
            Оформить посылку онлайн
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryCostCalculator;