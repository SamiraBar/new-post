import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const AboutCompany = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="container">
      <Card className="flex flex-col p-6 md:p-8 shadow-md rounded-2xl transition-transform transform duration-700 hover:scale-[1.02]">
        <CardHeader className="text-center md:text-left">
          <CardTitle className="text-2xl md:text-3xl font-semibold mb-3">
            {t('aboutCompany.title')}
          </CardTitle>
          <Separator className="bg-amber-600 mb-4" />
        </CardHeader>

        <CardContent className="p-0 text-gray-700 text-sm md:text-base space-y-2">
          <p>{t('aboutCompany.textInfo')}</p>
        </CardContent>
      </Card>
    </section>
  );
};

export default AboutCompany;
