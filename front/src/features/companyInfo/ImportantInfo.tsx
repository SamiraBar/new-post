import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const ImportantInfo = () => {
  const { t } = useTranslation();

  const text = t('importantInfo.textInfo');
  const blocks = text
    .split('\n\n')
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <section id="important-info" className="container">
      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg mt-20">
        <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-medium text-center mb-3">
                {t('importantInfo.title')}
              </h3>

              <Separator className="bg-amber-600 mb-6" />

              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                {blocks.map((b, i) => (
                  <p key={i}>{b}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImportantInfo;
