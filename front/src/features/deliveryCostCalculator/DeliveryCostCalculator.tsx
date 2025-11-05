import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { type ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Clock, HandCoins, TriangleAlert, Weight } from 'lucide-react';

const DeliveryCostCalculator = () => {
  const cities = ['Bishkek', 'Osh', 'Karakol', 'Naryn'];
  const [city, setCity] = useState('');
  const filteredCities = cities.filter((c) => c.toLowerCase().includes(city.toLowerCase()));

  return (
    <div
      className="container" id={'calculator'}>
      <h3 className="text-xl font-medium text-center mb-10">
        Жеткирүү баасын эсептөө калькулятору <br/> Калькулятор расчёта стоимости доставки
      </h3>
      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg ">
        <form className="w-full lg:flex pt-5">
          <div className="border p-5 rounded-lg w-full shadow-lg">
            <FieldGroup>
              <FieldSet>
                <div>
                  <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                    <FieldGroup className="gap-4">
                      <div className="flex items-center">
                        <FieldLabel>Жиберүүчү / Отправитель</FieldLabel>
                        <span className="w-[140] ml-auto">
                          <svg width="140" height="21" viewBox="0 0 140 21" fill="none">
                            <path
                              d="M12 3.78516H8C7.46957 3.78516 6.96086 3.99587 6.58579 4.37094C6.21071 4.74602 6 5.25472 6 5.78516V17.7852H8V12.7852H12V17.7852H14V5.78516C14 5.25472 13.7893 4.74602 13.4142 4.37094C13.0391 3.99587 12.5304 3.78516 12 3.78516ZM8 10.7852V5.78516H12V10.7852H8Z"
                              fill="#9FB3C3"></path>
                            <path
                              d="M33.3333 10.7852C33.3333 12.2579 34.5272 13.4518 36 13.4518C37.4728 13.4518 38.6667 12.2579 38.6667 10.7852C38.6667 9.3124 37.4728 8.11849 36 8.11849C34.5272 8.11849 33.3333 9.3124 33.3333 10.7852ZM36 11.2852H37V10.2852H36V11.2852ZM39 11.2852H41V10.2852H39V11.2852ZM43 11.2852H45V10.2852H43V11.2852ZM47 11.2852H49V10.2852H47V11.2852ZM51 11.2852H53V10.2852H51V11.2852ZM55 11.2852H57V10.2852H55V11.2852ZM59 11.2852H61V10.2852H59V11.2852ZM63 11.2852H65V10.2852H63V11.2852ZM67 11.2852H69V10.2852H67V11.2852ZM71 11.2852H73V10.2852H71V11.2852ZM75 11.2852H77V10.2852H75V11.2852ZM79 11.2852H81V10.2852H79V11.2852ZM83 11.2852H85V10.2852H83V11.2852ZM87 11.2852H89V10.2852H87V11.2852ZM91 11.2852H93V10.2852H91V11.2852ZM95 11.2852H97V10.2852H95V11.2852ZM99 11.2852H101V10.2852H99V11.2852ZM103 11.2852H104V10.2852H103V11.2852Z"
                              fill="#9FB3C3"></path>
                            <path
                              d="M122.5 10.7852H130V12.0352H122.5V10.7852ZM121.25 7.66016H127.5V8.91016H121.25V7.66016Z"
                              fill="#9FB3C3"></path>
                            <path
                              d="M138.699 11.1639L136.824 6.78891C136.776 6.67646 136.696 6.58061 136.594 6.51328C136.492 6.44595 136.372 6.41009 136.25 6.41016H134.375V5.16016C134.375 4.9944 134.309 4.83542 134.192 4.71821C134.074 4.601 133.915 4.53516 133.75 4.53516H123.75V5.78516H133.125V13.6327C132.84 13.798 132.591 14.0181 132.391 14.2803C132.192 14.5425 132.047 14.8415 131.963 15.1602H128.036C127.884 14.571 127.522 14.0575 127.018 13.716C126.515 13.3745 125.904 13.2284 125.3 13.3051C124.697 13.3818 124.142 13.6759 123.739 14.1325C123.337 14.5891 123.115 15.1767 123.115 15.7852C123.115 16.3936 123.337 16.9812 123.739 17.4378C124.142 17.8944 124.697 18.1886 125.3 18.2652C125.904 18.3419 126.515 18.1958 127.018 17.8543C127.522 17.5128 127.884 16.9993 128.036 16.4102H131.963C132.099 16.9466 132.41 17.4223 132.847 17.7621C133.284 18.102 133.821 18.2865 134.375 18.2865C134.928 18.2865 135.466 18.102 135.902 17.7621C136.339 17.4223 136.65 16.9466 136.786 16.4102H138.125C138.29 16.4102 138.449 16.3443 138.567 16.2271C138.684 16.1099 138.75 15.9509 138.75 15.7852V11.4102C138.75 11.3255 138.732 11.2417 138.699 11.1639ZM125.625 17.0352C125.377 17.0352 125.136 16.9618 124.93 16.8245C124.725 16.6871 124.564 16.4919 124.47 16.2635C124.375 16.0351 124.35 15.7838 124.399 15.5413C124.447 15.2988 124.566 15.0761 124.741 14.9013C124.916 14.7265 125.138 14.6074 125.381 14.5592C125.623 14.5109 125.875 14.5357 126.103 14.6303C126.331 14.7249 126.527 14.8851 126.664 15.0907C126.801 15.2963 126.875 15.5379 126.875 15.7852C126.874 16.1166 126.742 16.4343 126.508 16.6687C126.274 16.903 125.956 17.0348 125.625 17.0352ZM134.375 7.66016H135.837L137.177 10.7852H134.375V7.66016ZM134.375 17.0352C134.127 17.0352 133.886 16.9618 133.68 16.8245C133.475 16.6871 133.314 16.4919 133.22 16.2635C133.125 16.0351 133.1 15.7838 133.149 15.5413C133.197 15.2988 133.316 15.0761 133.491 14.9013C133.666 14.7265 133.888 14.6074 134.131 14.5592C134.373 14.5109 134.625 14.5357 134.853 14.6303C135.081 14.7249 135.277 14.8851 135.414 15.0907C135.551 15.2963 135.625 15.5379 135.625 15.7852C135.624 16.1166 135.492 16.4343 135.258 16.6687C135.024 16.903 134.706 17.0348 134.375 17.0352ZM137.5 15.1602H136.786C136.648 14.6248 136.337 14.1503 135.9 13.8109C135.464 13.4716 134.927 13.2867 134.375 13.2852V12.0352H137.5V15.1602Z"
                              fill="#9FB3C3"></path>
                          </svg>
                    </span>
                      </div>
                      {/*<Select onOpenChange={(open) => {*/}
                      {/*  if (!open) {*/}
                      {/*    setCity('');*/}
                      {/*  }*/}
                      {/*}}>*/}
                      {/*  <SelectTrigger className="w-full">*/}
                      {/*    <SelectValue placeholder="Жиберүүчү өлкө / Страна отправителя"/>*/}
                      {/*  </SelectTrigger>*/}
                      {/*  <SelectContent>*/}
                      {/*    <SelectItem value="light">Кыргызстан</SelectItem>*/}
                      {/*  </SelectContent>*/}
                      {/*</Select>*/}
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
                      <div className="flex items-center justify-between">
                        <FieldLabel>
                          Алуучу / Получатель
                        </FieldLabel>
                        <span className="w-[140] ml-auto">
                        <svg width="140" height="21" viewBox="0 0 140 21" fill="none">
                        <path d="M2.5 10.7852H10V12.0352H2.5V10.7852ZM1.25 7.66016H7.5V8.91016H1.25V7.66016Z"
                              fill="#9FB3C3"></path>
                        <path
                          d="M18.699 11.1639L16.824 6.78891C16.7759 6.67646 16.6958 6.58061 16.5937 6.51328C16.4916 6.44595 16.3719 6.41009 16.2496 6.41016H14.3746V5.16016C14.3746 4.9944 14.3088 4.83542 14.1915 4.71821C14.0743 4.601 13.9154 4.53516 13.7496 4.53516H3.7496V5.78516H13.1246V13.6327C12.8398 13.798 12.5906 14.0181 12.3913 14.2803C12.192 14.5425 12.0465 14.8415 11.9633 15.1602H8.03585C7.88373 14.571 7.52196 14.0575 7.01834 13.716C6.51473 13.3745 5.90386 13.2284 5.30022 13.3051C4.69659 13.3818 4.14164 13.6759 3.7394 14.1325C3.33715 14.5891 3.11523 15.1767 3.11523 15.7852C3.11523 16.3936 3.33715 16.9812 3.7394 17.4378C4.14164 17.8944 4.69659 18.1886 5.30022 18.2652C5.90386 18.3419 6.51473 18.1958 7.01834 17.8543C7.52196 17.5128 7.88373 16.9993 8.03585 16.4102H11.9633C12.0993 16.9466 12.4102 17.4223 12.847 17.7621C13.2837 18.102 13.8212 18.2865 14.3746 18.2865C14.928 18.2865 15.4655 18.102 15.9022 17.7621C16.339 17.4223 16.6499 16.9466 16.7858 16.4102H18.1246C18.2904 16.4102 18.4493 16.3443 18.5665 16.2271C18.6838 16.1099 18.7496 15.9509 18.7496 15.7852V11.4102C18.7496 11.3255 18.7324 11.2417 18.699 11.1639ZM5.6246 17.0352C5.37737 17.0352 5.1357 16.9618 4.93014 16.8245C4.72457 16.6871 4.56436 16.4919 4.46975 16.2635C4.37514 16.0351 4.35039 15.7838 4.39862 15.5413C4.44685 15.2988 4.5659 15.0761 4.74072 14.9013C4.91553 14.7265 5.13826 14.6074 5.38074 14.5592C5.62321 14.5109 5.87455 14.5357 6.10295 14.6303C6.33136 14.7249 6.52658 14.8851 6.66394 15.0907C6.80129 15.2963 6.8746 15.5379 6.8746 15.7852C6.87427 16.1166 6.74247 16.4343 6.50812 16.6687C6.27377 16.903 5.95602 17.0348 5.6246 17.0352ZM14.3746 7.66016H15.8371L17.1771 10.7852H14.3746V7.66016ZM14.3746 17.0352C14.1274 17.0352 13.8857 16.9618 13.6801 16.8245C13.4746 16.6871 13.3144 16.4919 13.2197 16.2635C13.1251 16.0351 13.1004 15.7838 13.1486 15.5413C13.1968 15.2988 13.3159 15.0761 13.4907 14.9013C13.6655 14.7265 13.8883 14.6074 14.1307 14.5592C14.3732 14.5109 14.6245 14.5357 14.853 14.6303C15.0814 14.7249 15.2766 14.8851 15.4139 15.0907C15.5513 15.2963 15.6246 15.5379 15.6246 15.7852C15.6243 16.1166 15.4925 16.4343 15.2581 16.6687C15.0238 16.903 14.706 17.0348 14.3746 17.0352ZM17.4996 15.1602H16.7858C16.6482 14.6248 16.3367 14.1503 15.9004 13.8109C15.464 13.4716 14.9274 13.2867 14.3746 13.2852V12.0352H17.4996V15.1602Z"
                          fill="#9FB3C3"></path>
                        <path
                          d="M101.333 10.7852C101.333 12.2579 102.527 13.4518 104 13.4518C105.473 13.4518 106.667 12.2579 106.667 10.7852C106.667 9.3124 105.473 8.11849 104 8.11849C102.527 8.11849 101.333 9.3124 101.333 10.7852ZM36 11.2852H37V10.2852H36V11.2852ZM39 11.2852H41V10.2852H39V11.2852ZM43 11.2852H45V10.2852H43V11.2852ZM47 11.2852H49V10.2852H47V11.2852ZM51 11.2852H53V10.2852H51V11.2852ZM55 11.2852H57V10.2852H55V11.2852ZM59 11.2852H61V10.2852H59V11.2852ZM63 11.2852H65V10.2852H63V11.2852ZM67 11.2852H69V10.2852H67V11.2852ZM71 11.2852H73V10.2852H71V11.2852ZM75 11.2852H77V10.2852H75V11.2852ZM79 11.2852H81V10.2852H79V11.2852ZM83 11.2852H85V10.2852H83V11.2852ZM87 11.2852H89V10.2852H87V11.2852ZM91 11.2852H93V10.2852H91V11.2852ZM95 11.2852H97V10.2852H95V11.2852ZM99 11.2852H101V10.2852H99V11.2852ZM103 11.2852H104V10.2852H103V11.2852Z"
                          fill="#9FB3C3"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M126 6.53516V4.78516H134V6.78516H128V9.53516H132C132.53 9.53516 133.039 9.69319 133.414 9.9745C133.789 10.2558 134 10.6373 134 11.0352V15.5352C134 15.933 133.789 16.3145 133.414 16.5958C133.039 16.8771 132.53 17.0352 132 17.0352H126V6.78516V6.53516ZM128 11.0352V15.5352H132V11.0352H128Z"
                              fill="#9FB3C3"></path>
                    </svg>
                      </span>
                      </div>
                      {/*<Select>*/}
                      {/*  <SelectTrigger className="w-full">*/}
                      {/*    <SelectValue placeholder="Алуучу өлкө / Страна получателя"/>*/}
                      {/*  </SelectTrigger>*/}
                      {/*  <SelectContent>*/}
                      {/*    <SelectItem value="light">Кыргызстан</SelectItem>*/}
                      {/*  </SelectContent>*/}
                      {/*</Select>*/}
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
                      <div className="relative">
                        <Input
                          placeholder="1000"
                          required
                          className="w-full pr-8"
                        />
                        <HandCoins size={20}
                                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel>Посылканын салмагы / Вес посылки</FieldLabel>
                      <div className="relative">
                        <Input
                          placeholder="кг"
                          required
                          className="w-full pr-8"
                        />
                        <Weight size={20}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                      </div>
                    </Field>
                  </FieldGroup>
                </div>
              </FieldSet>
            </FieldGroup>
          </div>
          <div className="shadow-lg border flex flex-col gap-4 p-5 rounded-lg w-full mt-5 lg:mt-0 lg:ml-5 lg:w-1/2">
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

            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-colors"
              type="submit"
            >
              <div className="text-center">
                <div>Посылканы онлайн каттоо</div>
                <div>Оформить посылку онлайн</div>
              </div>
            </Button>
          </div>
        </form>
        <div className="flex flex-col gap-5 mt-10 text-sm md:text-base px-1 sm:px-5">
          <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
            <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange"/>
            <div>
              <p>Посылканын баасын туура көрсөт. Посылка жоголсо, баасын кайтарып беребиз.</p>
              <p>Указывай стоимость посылки правильно. В случае потери вернем указанную стоимость.</p>
            </div>
          </div>
          <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
            <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange"/>
            <div>
              <p>Посылканын салмагын туура көрсөт.</p>
              <p>Правльно указывайте вес посылки.</p>
            </div>
          </div>
          <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
            <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange"/>
            <div>
              <p>Посылканын баардык тараптарынын суммасы 250 см ашпашы керек.</p>
              <p>Эң узун тарап 100 см ашпашы керек.</p>
              <p>Сумма всех сторон посылки не должна превышать 250 см.</p>
              <p>Самая длинная сторона не должна превышать 100 см.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCostCalculator;