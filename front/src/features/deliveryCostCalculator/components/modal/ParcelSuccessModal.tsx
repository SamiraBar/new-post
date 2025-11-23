import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface ParcelSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    trackingNumber: string;
}

const ParcelSuccessModal = ({ isOpen, onClose, trackingNumber }: ParcelSuccessModalProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingNumber);
        setCopied(true);
        toast.success('Трек-номер скопирован!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob(
            [
                `===========================================\n` +
                `      ПОДТВЕРЖДЕНИЕ СОЗДАНИЯ ПОСЫЛКИ      \n` +
                `===========================================\n\n` +
                `Трек-номер: ${trackingNumber}\n\n` +
                `ВАЖНО! Сохраните этот номер.\n` +
                `Предъявите его в офисе отправки.\n\n` +
                `Дата создания: ${new Date().toLocaleString('ru-RU')}\n\n` +
                `===========================================\n`
            ],
            { type: 'text/plain' }
        );
        element.href = URL.createObjectURL(file);
        element.download = `tracking-${trackingNumber}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Файл загружен!');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <Check size={28} className="bg-green-100 rounded-full p-1" />
                        Посылка успешно создана!
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-6 text-center">
                        <p className="text-sm text-gray-600 mb-2">Ваш трек-номер:</p>
                        <p className="text-2xl md:text-3xl font-bold text-orange-600 font-mono tracking-wider break-all">
                            {trackingNumber}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300"
                        >
                            {copied ? (
                                <>
                                    <Check size={18} className="text-green-600" />
                                    Скопировано!
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    Копировать
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300"
                        >
                            <Download size={18} />
                            Скачать
                        </Button>
                    </div>
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                        <div className="flex items-start gap-3">
                            <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-amber-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-800 mb-1">Важно!</h4>
                                <ul className="text-sm text-amber-700 space-y-1">
                                    <li>• Сохраните этот трек-номер</li>
                                    <li>• Предъявите его в офисе отправки</li>
                                    <li>• Используйте для отслеживания посылки</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={onClose}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        Понятно, закрыть
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ParcelSuccessModal;