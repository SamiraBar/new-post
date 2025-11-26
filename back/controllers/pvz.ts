import { NextFunction, Request, Response } from "express";
import axios from "axios";

const MEASOFT_EXTRA = process.env.MEASOFT_EXTRA || "8";
const MEASOFT_CLIENT_CODE = process.env.MEASOFT_CLIENT_CODE || "1513";
const MEASOFT_MAP_URL = `https://home.courierexe.ru/${MEASOFT_EXTRA}/map`;

interface MeasoftRawPvz {
    co: string;
    na: string;
    la: string;
    lo: string;
    ad?: string;
    ph?: string;
    wt?: string;
    ac?: string;
    cc?: string;
    af?: string;
}

interface PvzDto {
    code: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    phone?: string;
    worktime?: string;
    acceptcash?: boolean;
    acceptcard?: boolean;
    acceptfitting?: boolean;
}

const escapeXml = (v: string) =>
    v
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const buildXml = (city: string, weight?: number) => {
    let xml = '<?xml version="1.0" encoding="UTF-8" ?>';
    xml += "<pvzlist>";
    xml += `<auth extra="${MEASOFT_EXTRA}"></auth>`;
    if (MEASOFT_CLIENT_CODE) {
        xml += `<client_code>${MEASOFT_CLIENT_CODE}</client_code>`;
    }

    xml += `<town>${escapeXml(city)}</town>`;

    if (typeof weight === "number" && weight > 0 && !Number.isNaN(weight)) {
        xml += `<maxweight>${weight}</maxweight>`;
    }

    xml += "<json>YES</json>";
    xml += "</pvzlist>";
    return xml;
};

const callMeasoft = async (xml: string) => {
    const resp = await axios.post(MEASOFT_MAP_URL, xml, {
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            Accept: "application/json,text/plain,*/*",
        },
        timeout: 15000,
        responseType: "text",
        transformResponse: (r) => r,
    });

    return resp.data;
};

const normalizeMeasoftResponse = (data: unknown): MeasoftRawPvz[] => {
    let parsed: any = data;

    if (typeof parsed === "string") {
        if (!parsed.trim()) return [];
        parsed = JSON.parse(parsed);
    }

    if (Array.isArray(parsed)) return parsed;

    if (parsed?.pvzlist && Array.isArray(parsed.pvzlist)) return parsed.pvzlist;
    if (parsed?.data && Array.isArray(parsed.data)) return parsed.data;

    return [];
};

export const getPvzList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { city, weight } = req.query;

        if (!city || typeof city !== "string") {
            return res.status(400).json({ error: "city is required" });
        }

        const weightNumber =
            weight !== undefined ? Number(weight) : undefined;

        let xml = buildXml(city, weightNumber);
        let data = await callMeasoft(xml);

        let rawList: MeasoftRawPvz[] = [];
        try {
            rawList = normalizeMeasoftResponse(data);
        } catch (err) {
            console.error("Measoft bad JSON:", data);
            return res.status(502).json({
                error: "Invalid response from Measoft",
                raw: typeof data === "string" ? data.slice(0, 500) : data,
            });
        }

        if (rawList.length === 0 && weightNumber) {
            const xmlNoWeight = buildXml(city, undefined);
            const data2 = await callMeasoft(xmlNoWeight);

            try {
                rawList = normalizeMeasoftResponse(data2);
            } catch (err) {
                console.error("Measoft bad JSON on retry:", data2);
                rawList = [];
            }
        }

        const result: PvzDto[] = rawList.map((pvz) => ({
            code: pvz.co,
            name: pvz.na,
            latitude: pvz.la ? Number(pvz.la) : 0,
            longitude: pvz.lo ? Number(pvz.lo) : 0,
            address: pvz.ad,
            phone: pvz.ph,
            worktime: pvz.wt,
            acceptcash: pvz.ac === "1" || pvz.ac === "YES",
            acceptcard: pvz.cc === "1" || pvz.cc === "YES",
            acceptfitting: pvz.af === "1" || pvz.af === "YES",
        }));
        return res.json(result);
    } catch (e) {
        next(e);
    }
};

