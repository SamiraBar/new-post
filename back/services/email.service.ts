import nodemailer from "nodemailer";

function env(name: string, fallback?: string): string {
    const v = process.env[name] ?? fallback;
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
}

const transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: env("SMTP_USER"),
        pass: env("SMTP_PASS"),
    },
});

function buildParcelCreatedEmail(params: {
    fullName: string;
    city: string;
    trackingNumber: string;
}) {
    const { fullName, city, trackingNumber } = params;

    const subject = `Посылка оформлена: ${trackingNumber}`;
    const text =
        `Уважаемый(ая) ${fullName},

Вы оформили посылку в город ${city}.
Трек-номер посылки: ${trackingNumber}
`;

    return { subject, text };
}

export async function sendParcelCreatedEmail(params: {
    to: string;
    fullName: string;
    city: string;
    trackingNumber: string;
}) {
    const { to, fullName, city, trackingNumber } = params;

    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    if (!from) throw new Error("EMAIL_FROM or SMTP_USER must be set");
    if (!to) throw new Error("Recipient email is empty");

    const { subject, text } = buildParcelCreatedEmail({ fullName, city, trackingNumber });

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
}
