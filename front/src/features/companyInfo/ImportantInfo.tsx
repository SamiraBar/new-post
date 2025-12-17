import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { usePublicSiteText } from '@/features/adminPanel/hooks/usePublicSiteText.ts';
import { Package } from 'lucide-react';

const ImportantInfo = () => {
  const { t } = useTranslation();
  const { data } = usePublicSiteText();

  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const normalize = (value: string) =>
    value
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const text = normalize(data['important.info']?.trim() || t('importantInfo.textInfo'));

  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const renderBlock = (block: string, index: number) => {
    if (/^[•\-–]/.test(block)) {
      const items = block
        .split('\n')
        .map((line) => line.replace(/^[•\-–]\s?/, '').trim())
        .filter(Boolean);

      return (
        <ul key={index} className="space-y-2 pl-5 text-gray-700">
          {items.map((item, i) => (
            <li
              key={i}
              className="list-disc marker:text-amber-500 font-normal leading-snug tracking-normal"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    }

    const isHeading = /^[A-Za-zА-Яа-яЁёҮүӨөҚқІі\s]+$/.test(block) && block.length <= 48;
    if (isHeading) {
      return (
        <h3
          key={index}
          className="pt-6 text-base sm:text-lg font-semibold text-gray-900 flex items-start gap-2 tracking-tight"
        >
          <Package className="mt-1 h-4 w-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>{block}</span>
        </h3>
      );
    }

    return (
      <p key={index} className="text-gray-700 font-normal leading-normal tracking-normal">
        {block}
      </p>
    );
  };

  return (
    <section
      id="important-info"
      ref={sectionRef}
      className={`container mt-20 transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="p-2 sm:p-5 rounded-lg bg-gradient-to-br from-yellow-50 via-yellow-50 to-amber-100/40">
        <Card className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 cursor-pointer">
          <CardContent className="p-5 sm:p-8">
            <div className="w-full">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900">
                  {t('importantInfo.title')}
                </h3>

                <Separator className="bg-amber-600 my-4 mx-auto w-20" />
              </div>

              <div className="space-y-5 text-sm sm:text-base">
                {blocks.map((b, i) => renderBlock(b, i))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImportantInfo;
