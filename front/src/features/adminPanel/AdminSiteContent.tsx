import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import useAdminStore from '@/stores/adminStore/adminStore';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Eye, Pencil, Package } from 'lucide-react';
import axiosApi from '@/axiosApi';
import { isHeadingLine, splitBlocks } from '@/components/ui/contentBlocks.ts';
import logoDark from '../../assets/logo/logo-2.png';
import whatsappIcon from '../../assets/cosialIcons/WhatsApp.png';
import instagramIcon from '../../assets/cosialIcons/Instagram.png';


type Lang = 'ru' | 'kg';
type Mode = 'edit' | 'preview';

const getDeep = (obj: any, dotted: string) =>
  dotted.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);

const AdminSiteContent = () => {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>('ru');
  const [mode, setMode] = useState<Mode>('edit');
  const [loading, setLoading] = useState(false);

  const [about, setAbout] = useState('');
  const [important, setImportant] = useState('');
  const [footer, setFooter] = useState('');

  const [orig, setOrig] = useState({ about: '', important: '', footer: '' });

  useEffect(() => {
    if (!admin || admin.role !== 'superAdmin') navigate('/admin');
  }, [admin, navigate]);

  const load = async (lng: Lang, opts?: { silent?: boolean }) => {
    const silent = Boolean(opts?.silent);

    if (!silent) setLoading(true);

    try {
      const { data } = await axiosApi.get(`/i18n-content/${lng}`);
      const aboutStr = String(getDeep(data, 'aboutCompany.textInfo') ?? '');
      const importantStr = String(getDeep(data, 'importantInfo.textInfo') ?? '');
      const footerStr = String(getDeep(data, 'footer.address') ?? '');

      setAbout(aboutStr);
      setImportant(importantStr);
      setFooter(footerStr);
      setOrig({ about: aboutStr, important: importantStr, footer: footerStr });
    } catch (e: any) {
      toast.error(e?.message || 'Ошибка загрузки');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    void load(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const hasChanges = about !== orig.about || important !== orig.important || footer !== orig.footer;

  const save = async () => {
    console.log('SAVE CLICKED');
    setLoading(true);
    try {
      await axiosApi.patch(`/i18n-content/${lang}`, {
        updates: {
          'aboutCompany.textInfo': about,
          'importantInfo.textInfo': important,
          'footer.address': footer,
        },
      });

      toast.success('Сохранено');

    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const formattingHelp = (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium">Форматирование</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Новый абзац — Enter один раз</li>
            <li>Список — строки, начинающиеся с • / - / –</li>
            <li>
              Заголовок — короткая строка (до 4 слов), <b>без цифр и символов</b>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const importantBlocks = useMemo(() => splitBlocks(important), [important]);
  const aboutBlocks = useMemo(() => splitBlocks(about), [about]);

  const renderPreviewBlocks = (blocks: string[]) =>
    blocks.map((block, index) => {
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

      if (isHeadingLine(block)) {
        return (
          <h3
            key={index}
            className="pt-4 text-base sm:text-lg font-semibold text-gray-900 flex items-start gap-2 tracking-tight"
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
    });

  return (
    <div className="container mx-auto pt-24 pb-24 space-y-6">
      <div className="sticky top-0 z-50 -mx-4 px-4 py-3 bg-background/85 backdrop-blur border-b">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="outline" size="icon" className="rounded-full">
                <ChevronLeft />
              </Button>
            </Link>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Контент сайта</h1>
              <p className="text-sm text-muted-foreground">
                {hasChanges ? (
                  <span className="text-amber-700 font-medium">Есть несохранённые изменения</span>
                ) : (
                  <span>Изменений нет</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:flex-nowrap flex-wrap justify-end">
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              onClick={() => setMode('edit')}
              disabled={loading}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Редактирование
            </Button>

            <Button
              variant={mode === 'preview' ? 'default' : 'outline'}
              onClick={() => setMode('preview')}
              disabled={loading}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Предпросмотр
            </Button>

            <Separator orientation="vertical" className="hidden md:block h-8 mx-1" />

            <Button
              variant={lang === 'ru' ? 'default' : 'outline'}
              onClick={() => setLang('ru')}
              disabled={loading}
            >
              RU
            </Button>
            <Button
              variant={lang === 'kg' ? 'default' : 'outline'}
              onClick={() => setLang('kg')}
              disabled={loading}
            >
              KG
            </Button>

            <Button
              type="button"
              className="bg-brand hover:bg-amber-600"
              disabled={loading || !hasChanges}
              onClick={save}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {mode === 'edit' ? (
        <>
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">Важная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-8">
              <Label>Текст ({lang.toUpperCase()})</Label>
              <Textarea
                value={important}
                onChange={(e) => setImportant(e.target.value)}
                rows={10}
              />
              {formattingHelp}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">О компании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-8">
              <Label>Текст ({lang.toUpperCase()})</Label>
              <Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={12} />
              {formattingHelp}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">Адрес в футере</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-8">
              <Label>Текст ({lang.toUpperCase()})</Label>
              <Textarea value={footer} onChange={(e) => setFooter(e.target.value)} rows={3} />
            </CardContent>
          </Card>

          <div className="h-6" />
        </>
      ) : (
        <div className="space-y-10 pb-10">
          <section className="container px-0">
            <div className="p-2 sm:p-5 rounded-lg">
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 sm:p-8">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900">
                      Важная информация
                    </h3>
                    <Separator className="bg-amber-600 my-4 mx-auto w-20" />
                  </div>

                  <div className="space-y-4 text-sm sm:text-base">
                    {renderPreviewBlocks(importantBlocks)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-0">
            <div className="p-2 sm:p-5 rounded-lg">
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 sm:p-8">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900">О компании</h3>
                    <Separator className="bg-amber-600 my-4 mx-auto w-20" />
                  </div>

                  <div className="space-y-4 text-sm sm:text-base">
                    {renderPreviewBlocks(aboutBlocks)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="px-0">
            <footer className="w-full bg-neutral-900 text-neutral-300 border-t border-neutral-800 rounded-2xl overflow-hidden pb-14 pt-10">
              <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <img
                    src={logoDark}
                    alt="New Post logo"
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </div>

                <div className="text-sm leading-relaxed space-y-1 text-neutral-300">
                  <p>{footer || '—'}</p>

                  <p>
                    Телефон: <span className="text-blue-400">+996 778 465 557</span>
                  </p>

                  <p>
                    Электронная почта:{' '}
                    <span className="text-blue-400">janypochta.kg@gmail.com</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href="https://wa.me/996778465557?text=Здравствуйте%2C+у+меня+есть+вопрос"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="group"
                  >
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 transition-all duration-300 group-hover:border-green-500/70">
                      <img
                        src={whatsappIcon}
                        alt="WhatsApp"
                        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/newpost.kg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group"
                  >
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 transition-all duration-300 group-hover:border-pink-500/70">
                      <img
                        src={instagramIcon}
                        alt="Instagram"
                        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminSiteContent;
