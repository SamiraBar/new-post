import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const AboutCompany = () => {
  const { t } = useTranslation();

  const text = t('aboutCompany.textInfo');
  const blocks = text
    .split('\n\n')
    .map((b) => b.trim())
    .filter(Boolean);

  const renderBlock = (block: string, index: number) => {
    if (block.startsWith('•')) {
      const items = block
        .split('\n')
        .map((line) => line.replace(/^•\s?/, '').trim())
        .filter(Boolean);

      return (
        <ul key={index} className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    const isHeading = /^[A-Za-zА-Яа-яЁёҮүӨөҚқІі\s]+$/.test(block) && block.length <= 48;

    if (isHeading) {
      return (
        <h3 key={index} className="pt-2 text-lg font-semibold text-gray-900">
          {block}
        </h3>
      );
    }

    return (
      <p key={index} className="text-gray-700 leading-relaxed">
        {block}
      </p>
    );
  };

  return (
    <section id="about" className="container">
      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
        <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-medium text-center mb-3">
                {t('aboutCompany.title')}
              </h3>

              <Separator className="bg-amber-600 mb-6" />

              <div className="space-y-4 text-sm sm:text-base">
                {blocks.map((b, i) => renderBlock(b, i))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutCompany;
