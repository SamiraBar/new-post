import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import useAdminStore from '@/stores/adminStore/adminStore';
import { Link, useNavigate } from 'react-router-dom';
import useSiteContentStore from '@/stores/adminStore/siteContentStore.ts';
import { ChevronLeft, Info, Eye, Pencil, Package } from 'lucide-react';

type Lang = 'ru' | 'kg';
type Mode = 'edit' | 'preview';

const normalizeText = (value: string) =>
  (value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // keep it, but we no longer require blank lines
    .trim();

const splitBlocks = (text: string) => {
  const lines = normalizeText(text)
    .split('\n')
    .map((l) => l.trimEnd());

  const blocks: string[] = [];
  let paragraphBuf: string[] = [];
  let bulletBuf: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuf.length) {
      blocks.push(paragraphBuf.join(' ').trim());
      paragraphBuf = [];
    }
  };

  const flushBullets = () => {
    if (bulletBuf.length) {
      blocks.push(bulletBuf.join('\n').trim());
      bulletBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushBullets();
      flushParagraph();
      continue;
    }

    if (/^[•\-–]\s?/.test(line)) {
      flushParagraph();
      bulletBuf.push(line);
      continue;
    }

    flushBullets();
    paragraphBuf.push(line);
  }

  flushBullets();
  flushParagraph();

  return blocks.filter(Boolean);
};

const isHeadingLine = (block: string) => {
  const cleaned = block.trim();
  if (!/^[A-Za-zА-Яа-яЁёҮүӨөҚқІі\s]+$/.test(cleaned)) return false;
  if (cleaned.length > 48) return false;
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length > 2) return false;
  return true;
};


const renderPublicLikeBlocks = (blocks: string[]) =>
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
          className="pt-6 text-base sm:text-lg font-semibold text-gray-900 flex gap-2 tracking-tight"
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

const AdminSiteContent = () => {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();

  const { fetchKey, saveKey, docs, loading } = useSiteContentStore();

  const [lang, setLang] = useState<Lang>('ru');
  const [mode, setMode] = useState<Mode>('edit');

  const [form, setForm] = useState<
    Record<Lang, { about: string; important: string; footer: string }>
  >({
    ru: { about: '', important: '', footer: '' },
    kg: { about: '', important: '', footer: '' },
  });

  const [orig, setOrig] = useState<
    Record<Lang, { about: string; important: string; footer: string }>
  >({
    ru: { about: '', important: '', footer: '' },
    kg: { about: '', important: '', footer: '' },
  });

  useEffect(() => {
    if (!admin || admin.role !== 'superAdmin') navigate('/admin');
  }, [admin, navigate]);

  useEffect(() => {
    void fetchKey('about.company', lang);
    void fetchKey('important.info', lang);
    void fetchKey('footer.address', lang);
  }, [lang, fetchKey]);

  useEffect(() => {
    const aboutStr = docs[lang]['about.company']?.value ?? '';
    const importantStr = docs[lang]['important.info']?.value ?? '';
    const footerStr = docs[lang]['footer.address']?.value ?? '';

    const isDirty =
      form[lang].about !== orig[lang].about ||
      form[lang].important !== orig[lang].important ||
      form[lang].footer !== orig[lang].footer;

    if (!isDirty) {
      setForm((prev) => ({
        ...prev,
        [lang]: { about: aboutStr, important: importantStr, footer: footerStr },
      }));
      setOrig((prev) => ({
        ...prev,
        [lang]: { about: aboutStr, important: importantStr, footer: footerStr },
      }));
    }
  }, [docs, lang]);

  const hasChanges =
    form[lang].about !== orig[lang].about ||
    form[lang].important !== orig[lang].important ||
    form[lang].footer !== orig[lang].footer;

  const saveAll = async () => {
    const ok1 = await saveKey('about.company', lang, form[lang].about);
    const ok2 = await saveKey('important.info', lang, form[lang].important);
    const ok3 = await saveKey('footer.address', lang, form[lang].footer);

    if (ok1 && ok2 && ok3) {
      toast.success('Сохранено');
      setOrig((prev) => ({ ...prev, [lang]: { ...form[lang] } }));
      void fetchKey('about.company', lang);
      void fetchKey('important.info', lang);
      void fetchKey('footer.address', lang);
    } else {
      toast.error('Ошибка сохранения');
    }
  };

  const formattingHelp = (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium">Форматирование текста</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Новый абзац — новая строка (Enter один раз)</li>
            <li>
              Список — строки, начинающиеся с <span className="font-mono">•</span>,{' '}
              <span className="font-mono">-</span> или <span className="font-mono">–</span>
            </li>
            <li>Пустая строка добавляет разделитель (необязательно)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const aboutBlocks = useMemo(() => splitBlocks(form[lang].about), [form, lang]);
  const importantBlocks = useMemo(() => splitBlocks(form[lang].important), [form, lang]);

  return (
    <div className="container mx-auto pt-24 pb-16 space-y-6">
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

          <div className="flex items-center gap-2 flex-wrap justify-end">
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
              className="bg-brand hover:bg-amber-600"
              disabled={loading || !hasChanges}
              onClick={saveAll}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {mode === 'edit' ? (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">Важная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Текст ({lang.toUpperCase()})</Label>
              <Textarea
                value={form[lang].important}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [lang]: { ...p[lang], important: e.target.value } }))
                }
                rows={10}
              />
              {formattingHelp}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">О компании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Текст ({lang.toUpperCase()})</Label>
              <Textarea
                value={form[lang].about}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [lang]: { ...p[lang], about: e.target.value } }))
                }
                rows={12}
              />
              {formattingHelp}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">Адрес в футере</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Адрес ({lang.toUpperCase()})</Label>
              <Textarea
                value={form[lang].footer}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [lang]: { ...p[lang], footer: e.target.value } }))
                }
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-10">
          <section className="container px-0">
            <div className="p-2 sm:p-5 rounded-lg bg-gradient-to-br from-yellow-50 via-yellow-50 to-amber-100/40">
              <Card className="group rounded-2xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 sm:p-8">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900">
                      Важная информация
                    </h3>
                    <Separator className="bg-amber-600 my-4 mx-auto w-20" />
                  </div>
                  <div className="space-y-3 text-sm sm:text-base">
                    {renderPublicLikeBlocks(importantBlocks)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-0">
            <div className="p-2 sm:p-5 rounded-lg bg-gradient-to-br from-yellow-50 via-yellow-50 to-amber-100/40">
              <Card className="group rounded-2xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5 sm:p-8">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900">О компании</h3>
                    <Separator className="bg-amber-600 my-4 mx-auto w-20" />
                  </div>
                  <div className="space-y-3 text-sm sm:text-base">
                    {renderPublicLikeBlocks(aboutBlocks)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-0">
            <Card className="rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-300">
              <CardContent className="py-8">
                <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between gap-8">
                  <div className="text-sm leading-normal space-y-1">
                    <p>{form[lang].footer || '—'}</p>
                    <p>
                      Телефон: <span className="text-blue-400">+996 778 465 557</span>
                    </p>
                    <p>
                      Электронная почта:{' '}
                      <span className="text-blue-400">janypochta.kg@gmail.com</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminSiteContent;
