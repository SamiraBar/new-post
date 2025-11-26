import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group.tsx";
import {
    type Dispatch,
    type FC,
    type SetStateAction,
    useCallback,
    useEffect,
    useMemo,
} from "react";
import { MapPin, SearchIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { Order } from "@/types";
import type { Pvz } from "@/stores/pvzStore/types";
import { useTranslation } from "react-i18next";
import { usePvzStore } from "@/stores/pvzStore/pvzStore.ts";
import PvzMap from "@/features/deliveryCostCalculator/components/pvzMap.tsx";
import { toast } from "sonner";

interface Props {
    order: Order;
    setOrder: Dispatch<SetStateAction<Order>>;
}

const Step3RecipientOfficeSelection: FC<Props> = ({ order, setOrder }) => {
    const { t } = useTranslation();

    if (!order.deliveryType) return null;

    const {
        pvzList,
        selectedPvz,
        loading,
        error,
        filters,
        fetchPvz,
        setSelectedPvz,
        setSearch,
        toggleFilter,
    } = usePvzStore();

    useEffect(() => {
        if (order.destinationCity) {
            void fetchPvz({
                city: order.destinationCity,
                weight: order.parcelWeight,
            });
        }
    }, [fetchPvz, order.destinationCity, order.parcelWeight]);

    const filteredPvz = useMemo(() => {
        const term = filters.search.toLowerCase().trim();

        return pvzList.filter((pvz) => {
            if (term) {
                const target = `${pvz.name ?? ""} ${pvz.address ?? ""}`.toLowerCase();
                if (!target.includes(term)) return false;
            }

            if (filters.acceptcash && !pvz.acceptcash) return false;
            if (filters.acceptcard && !pvz.acceptcard) return false;
            if (filters.acceptfitting && !pvz.acceptfitting) return false;

            return true;
        });
    }, [filters, pvzList]);

    const syncSelectedPvz = useCallback(
        (pvz: Pvz) => {
            if (!pvz?.code) return;

            setSelectedPvz(pvz);

            setOrder((prev) => ({
                ...prev,
                destinationPvzCode: String(pvz.code),
                destinationPvzName: pvz.name || "",
                destinationPvzAddress: pvz.address || "",
                destinationPvzPhone: pvz.phone || "",
                destinationPvzWorktime: pvz.worktime || "",
            }));

            try {
                if (
                    typeof window !== "undefined" &&
                    (window as any).measoftMap?.applyFilter
                ) {
                    (window as any).measoftMap.applyFilter(
                        "store",
                        String(pvz.code),
                        1
                    );
                }
            } catch (e) {
                console.error("Measoft applyFilter error:", e);
            }

            const labelForToast =
                pvz.name || pvz.address || `ПВЗ ${pvz.code}`;
            toast.success(`ПВЗ выбран: ${labelForToast}`);
        },
        [setOrder, setSelectedPvz]
    );

    const handleSelectPvzFromMap = useCallback(
        (pvzCode: string) => {
            if (!pvzCode) return;
            const codeStr = String(pvzCode);

            const measoftSelected =
                typeof window !== "undefined" &&
                (window as any).measoftMap?.getSelectedPvzData?.();

            const pvzFromList = pvzList.find(
                (p) => String(p.code) === codeStr
            );

            const mergedPvz: Pvz | null =
                pvzFromList ||
                (measoftSelected
                    ? {
                        code: String(measoftSelected.code ?? codeStr),
                        name:
                            measoftSelected.name ??
                            measoftSelected.parentname ??
                            "",
                        address: measoftSelected.address ?? "",
                        phone: measoftSelected.phone ?? "",
                        worktime: measoftSelected.worktime ?? "",
                        latitude: 0,
                        longitude: 0,
                        acceptcash: undefined,
                        acceptcard: undefined,
                        acceptfitting: undefined,
                    }
                    : null);

            if (!mergedPvz) return;

            syncSelectedPvz(mergedPvz);
        },
        [pvzList, syncSelectedPvz]
    );

    const handleSelectPvzFromList = useCallback(
        (pvz: Pvz) => {
            syncSelectedPvz(pvz);
        },
        [syncSelectedPvz]
    );

    return (
        <div className="w-full pt-5">
            {order.deliveryType === "courier" ? (
                <>
                    <h3 className="text-2xl font-bold text-center mb-8">
                        {t("deliveryCostCalculator.courierFields.title")}
                    </h3>

                    <div className="flex flex-col gap-4 px-5">
                        <input
                            type="text"
                            placeholder={t(
                                "deliveryCostCalculator.courierFields.cityPlaceholder"
                            )}
                            value={order.receiver.city || order.destinationCity || ""}
                            onChange={(e) =>
                                setOrder((prev) => ({
                                    ...prev,
                                    receiver: { ...prev.receiver, city: e.target.value },
                                }))
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                            type="text"
                            placeholder={t(
                                "deliveryCostCalculator.courierFields.streetPlaceholder"
                            )}
                            value={order.receiver.street || ""}
                            onChange={(e) =>
                                setOrder((prev) => ({
                                    ...prev,
                                    receiver: { ...prev.receiver, street: e.target.value },
                                }))
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                            type="text"
                            placeholder={t(
                                "deliveryCostCalculator.courierFields.housePlaceholder"
                            )}
                            value={order.receiver.house || ""}
                            onChange={(e) =>
                                setOrder((prev) => ({
                                    ...prev,
                                    receiver: { ...prev.receiver, house: e.target.value },
                                }))
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                            type="text"
                            placeholder={t(
                                "deliveryCostCalculator.courierFields.apartmentPlaceholder"
                            )}
                            value={order.receiver.apartment || ""}
                            onChange={(e) =>
                                setOrder((prev) => ({
                                    ...prev,
                                    receiver: { ...prev.receiver, apartment: e.target.value },
                                }))
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-center mb-6">
                        {t("deliveryCostCalculator.stepThreeForm.title")}
                    </h3>

                    <p className="text-center text-gray-600 mb-6">
                        {t("deliveryCostCalculator.stepThreeForm.subtitle")}
                    </p>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                        {/* Карта */}
                        <div className="border rounded-lg shadow-sm bg-white p-3">
                            <PvzMap
                                city={order.destinationCity}
                                weight={order.parcelWeight}
                                onPvzSelected={handleSelectPvzFromMap}
                            />
                        </div>

                        {/* Список */}
                        <div className="flex flex-col gap-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    <SearchIcon className="size-4 text-gray-500" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder={t(
                                        "deliveryCostCalculator.stepThreeForm.searchPlaceholder"
                                    )}
                                    value={filters.search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputGroup>

                            <div className="flex flex-wrap gap-3 text-sm">
                                <Label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="size-4"
                                        checked={filters.acceptcash}
                                        onChange={() => toggleFilter("acceptcash")}
                                    />
                                    {t("deliveryCostCalculator.stepThreeForm.filterCash")}
                                </Label>

                                <Label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="size-4"
                                        checked={filters.acceptcard}
                                        onChange={() => toggleFilter("acceptcard")}
                                    />
                                    {t("deliveryCostCalculator.stepThreeForm.filterCard")}
                                </Label>

                                <Label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="size-4"
                                        checked={filters.acceptfitting}
                                        onChange={() => toggleFilter("acceptfitting")}
                                    />
                                    {t("deliveryCostCalculator.stepThreeForm.filterFitting")}
                                </Label>
                            </div>

                            <ScrollArea className="h-80 rounded-lg border bg-white p-2">
                                {loading && (
                                    <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
                                        {t("deliveryCostCalculator.loading")}
                                    </div>
                                )}

                                {!loading && error && (
                                    <div className="text-red-500 text-sm text-center py-6">
                                        {error}
                                    </div>
                                )}

                                {!loading && !error && filteredPvz.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {filteredPvz.map((pvz, index) => {
                                            const codeStr = String(pvz.code);
                                            const isChecked =
                                                order.destinationPvzCode &&
                                                String(order.destinationPvzCode) === codeStr;

                                            return (
                                                <Label
                                                    key={`${codeStr}-${index}`}
                                                    htmlFor={codeStr}
                                                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                                                        isChecked
                                                            ? "border-orange-500 bg-orange-50"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <input
                                                        id={codeStr}
                                                        type="radio"
                                                        name="pvz"
                                                        value={codeStr}
                                                        checked={!!isChecked}
                                                        onChange={() => handleSelectPvzFromList(pvz)}
                                                        className="mt-1 size-4 accent-orange-500 cursor-pointer"
                                                    />

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="size-4 text-orange-500" />
                                                            <p className="font-semibold text-sm">
                                                                {pvz.name ||
                                                                    t(
                                                                        "deliveryCostCalculator.stepThreeForm.unnamedPoint"
                                                                    )}
                                                            </p>
                                                        </div>

                                                        {pvz.address && (
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {pvz.address}
                                                            </p>
                                                        )}

                                                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
                                                            {pvz.acceptcash && (
                                                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  {t(
                                      "deliveryCostCalculator.stepThreeForm.chipCash"
                                  )}
                                </span>
                                                            )}
                                                            {pvz.acceptcard && (
                                                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                  {t(
                                      "deliveryCostCalculator.stepThreeForm.chipCard"
                                  )}
                                </span>
                                                            )}
                                                            {pvz.acceptfitting && (
                                                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                  {t(
                                      "deliveryCostCalculator.stepThreeForm.chipFitting"
                                  )}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    !loading &&
                                    !error && (
                                        <div className="text-center text-gray-500 py-8">
                                            <MapPin className="size-12 mx-auto mb-2 opacity-30" />
                                            <p>
                                                {t("deliveryCostCalculator.stepThreeForm.notFound")}
                                            </p>
                                        </div>
                                    )
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Step3RecipientOfficeSelection;
