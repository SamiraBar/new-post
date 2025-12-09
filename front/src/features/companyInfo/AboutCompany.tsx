import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const AboutCompany = () => {
  const { t } = useTranslation();

  const text = t('aboutCompany.textInfo');
  const paragraphs = text.split('\n\n');

  const formatParagraph = (paragraph: string, index: number) => {
    if (paragraph.trim().startsWith('•')) {
      const items = paragraph.split('\n').map((line) => line.replace('• ', ''));

      return (
          <ul key={index} className="list-disc list-inside space-y-1 text-gray-700">
            {items.map((item, i) => (
                <li key={i}>{item}</li>
            ))}
          </ul>
      );
    }

    const isTitle = /^[A-Za-zА-Яа-яЁёҮүӨөҚқІі\s]+$/.test(paragraph.trim()) &&
        paragraph.trim().length < 40; // small header-like line

    return (
        <p
            key={index}
            className={`${
                isTitle ? 'font-semibold text-lg mt-4 mb-1 text-gray-900' : 'text-gray-700'
            } leading-relaxed`}
        >
          {paragraph}
        </p>
    );
  };

  return (
      <section id="about" className="container">
        <Card className="flex flex-col p-6 md:p-8 shadow-md rounded-2xl transition-transform transform duration-700 hover:scale-[1.02]">
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-2xl md:text-3xl font-semibold mb-3">
              {t('aboutCompany.title')}
            </CardTitle>
            <Separator className="bg-amber-600 mb-4" />
          </CardHeader>

          <CardContent className="p-0 text-sm md:text-base space-y-3 font-[Arial]">
            {paragraphs.map((p, i) => formatParagraph(p, i))}
          </CardContent>
        </Card>
      </section>
  );
};

export default AboutCompany;
