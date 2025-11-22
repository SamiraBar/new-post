import {
  type ChangeEvent,
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field.tsx";
import TruckIconA from "@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx";
import TruckIconB from "@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Clock, HandCoins, Weight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import type { Order } from "@/types";
import { cities as senderCities } from "@/constants.ts";
import useFileStore from "@/stores/fileStore/fileStore.ts";
import { useTranslation } from "react-i18next";

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  onHandleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
}

const Step1Calculator: FC<Props> = ({ order, setOrder, onHandleChange, handleNext }) => {
  const { citiesPVZ, citiesHand, getCities, loadingCities } = useFileStore();
  const [citySearch, setCitySearch] = useState({ origin: "", destination: "" });
  const { t } = useTranslation();

  useEffect(() => {
    const type: "PVZ" | "Hand" = order.deliveryType === "courier" ? "Hand" : "PVZ";
    setOrder(prev => ({ ...prev, destinationCity: "" }));
    getCities(type);
  }, [order.deliveryType, getCities, setOrder]);

  const filteredOriginCities = senderCities.filter(c =>
    c.toLowerCase().includes(citySearch.origin.toLowerCase())
  );

  const recipientCities = order.deliveryType === "courier" ? citiesHand : citiesPVZ;

  const filteredDestinationCities = recipientCities.filter(c =>
    c.city.toLowerCase().includes(citySearch.destination.toLowerCase())
  );

  const selectedPrice = order.totalCost || 0;

  const isNextDisabled =
    !order.originCity ||
    !order.destinationCity ||
    !order.parcelValue ||
    !order.parcelWeight;

  return (
    <div className="w-full lg:flex pt-5">
      <div className="border p-5 rounded-lg w-full shadow-lg">
        <FieldGroup>
          <FieldSet>
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                <FieldGroup className="gap-4">
                  <div className="flex items-center">
                    <FieldLabel>{t("deliveryCostCalculator.stepOneForm.sender")}</FieldLabel>
                    <span className="w-[140] ml-auto">
                      <TruckIconA />
                    </span>
                  </div>
                  <Select
                    required
                    onValueChange={(value: string) =>
                      setOrder((prev) => ({ ...prev, originCity: value }))
                    }
                    value={order.originCity}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t(
                          "deliveryCostCalculator.stepOneForm.senderPlaceholder"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        name="origin"
                        value={citySearch.origin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch((prev) => ({ ...prev, origin: e.target.value }))
                        }
                        className="w-full"
                      />
                      {filteredOriginCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup className="gap-4">
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t("deliveryCostCalculator.stepOneForm.recipient")}</FieldLabel>
                    <span className="w-[140] ml-auto">
                      <TruckIconB />
                    </span>
                  </div>
                  <Select
                    required
                    disabled={loadingCities || recipientCities.length === 0}
                    onValueChange={(value: string) =>
                      setOrder((prev) => ({ ...prev, destinationCity: value }))
                    }
                    value={order.destinationCity}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          loadingCities
                            ? t("deliveryCostCalculator.stepOneForm.loadingCities")
                            : t("deliveryCostCalculator.stepOneForm.recipientPlaceholder")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        value={citySearch.destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch((prev) => ({ ...prev, destination: e.target.value }))
                        }
                      />
                      {filteredDestinationCities.map((city, index) => (
                        <SelectItem key={`${city.city}-${index}`} value={city.city}>
                          {city.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 min-w-0">
                <Field>
                  <FieldLabel>{t("deliveryCostCalculator.stepOneForm.parcelValue")}</FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="1000"
                      name="parcelValue"
                      type="number"
                      min={0}
                      className="w-full pr-8"
                      value={order.parcelValue || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value > 50000) return;
                        onHandleChange(e);
                      }}
                    />
                    <HandCoins
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <div className="mt-1 text-red-500 text-xs sm:text-sm italic">
                    {t("deliveryCostCalculator.stepOneForm.maxPrice")} - 50000 сом
                  </div>
                </Field>

                <Field>
                  <FieldLabel>{t("deliveryCostCalculator.stepOneForm.parcelWeight")}</FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="кг"
                      name="parcelWeight"
                      type="number"
                      min={1}
                      step={0.1}
                      className="w-full pr-8"
                      value={order.parcelWeight || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value > 15) return;
                        onHandleChange(e);
                      }}
                    />
                    <Weight
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <div className="mt-1 text-red-500 text-xs sm:text-sm italic">
                    {t("deliveryCostCalculator.stepOneForm.maxWeight")} - 15кг
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
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500" />
            <div>
              <p className="text-sm md:text-base font-medium">
                {t("deliveryCostCalculator.stepOneForm.sum")}
              </p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">
            {selectedPrice.toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500" />
            <div>
              <p className="text-sm md:text-base font-medium">
                {t("deliveryCostCalculator.stepOneForm.time")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg md:text-xl font-semibold">
              10 - {t("deliveryCostCalculator.stepOneForm.day")}
            </p>
          </div>
        </div>

        <Button
          disabled={isNextDisabled}
          className={`bg-orange-500 hover:bg-orange-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-colors
    ${isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `}
          onClick={handleNext}
        >
          {t("deliveryCostCalculator.buttons.forward")}
        </Button>
      </div>
    </div>
  );
};

export default Step1Calculator;
