import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MeasoftConfigParams } from "@/types";

interface PvzMapProps {
    city?: string;
    weight?: number;
    onPvzSelected: (pvzCode: string) => void;
}

const MAP_PX = 450;
const MAP_ID = "measoftMapBlock";

const PvzMap = ({ city, weight, onPvzSelected }: PvzMapProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const townInputRef = useRef<HTMLInputElement | null>(null);

    const [ready, setReady] = useState(false);
    const initializedRef = useRef(false);

    useLayoutEffect(() => {
        if (containerRef.current) {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        if (!ready) return;
        let cancelled = false;

        const initMeasoft = () => {
            if (cancelled) return;

            const m = window.measoftMap;
            if (!m) {
                setTimeout(initMeasoft, 50);
                return;
            }
            if (initializedRef.current) return;

            if (townInputRef.current) {
                townInputRef.current.value = city ?? "";
            }

            const cfg: Partial<MeasoftConfigParams> = {
                mapBlock: MAP_ID,
                client_id: "8",
                client_code: "1513",
                lang: "ru",
                showMapButton: "0",
                showMapButtonCaption: "Выбрать пункт самовывоза",
                mapSize: { width: "auto", height: MAP_PX },
                centerCoords: ["55.755814", "37.617635"],
                townBlock: `#${MAP_ID}-town`,
                filter: {
                    acceptcard: "YES",
                    maxweight: weight ?? 0,
                },
                allowedFilterParams: ["acceptcash", "acceptcard", "acceptfitting", "store"],

                choicePvzCallback: (pvzCode: string) => {
                    console.log("choicePvzCallback from Measoft:", pvzCode);
                    onPvzSelected(pvzCode);
                },
            };

            try {
                m.config(cfg).init(1);
                initializedRef.current = true;
            } catch (e) {
                console.error("Measoft init failed", e);
            }
        };

        initMeasoft();

        return () => {
            cancelled = true;
            try {
                window.measoftMap?.close?.();
                window.measoftMap?.clear?.();
            } catch {
            }
            initializedRef.current = false;
        };
    }, [ready, city, weight, onPvzSelected]);

    useEffect(() => {
        if (!ready || !window.measoftMap || !initializedRef.current) return;

        if (townInputRef.current) {
            townInputRef.current.value = city ?? "";
        }

        window.measoftMap.config({
            townBlock: `#${MAP_ID}-town`,
            filter: {
                acceptcard: "YES",
                maxweight: weight ?? 0,
            },
            lang: "ru",
        });

        window.measoftMap.showMap?.(1);
    }, [ready, city, weight]);

    return (
        <div
            ref={containerRef}
            className="w-full rounded-lg border bg-white p-2"
            style={{
                height: MAP_PX,
                width: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <input
                ref={townInputRef}
                id={`${MAP_ID}-town`}
                type="hidden"
                defaultValue={city ?? ""}
            />
            <div id={MAP_ID} className="w-full h-full" />
        </div>
    );
};

export default PvzMap;
