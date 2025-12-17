import { useEffect, useMemo, useState } from 'react';
import i18n from '@/i18n/i18n.ts';
import axiosPublic from '@/axiosPublic.ts';

type Key = 'important.info' | 'about.company' | 'footer.address';

const KEY_LIST: Key[] = ['important.info', 'about.company', 'footer.address'];

export const usePublicSiteText = () => {
  const [data, setData] = useState<Partial<Record<Key, string>>>({});
  const lang = (i18n.language || 'ru') as 'ru' | 'kg';

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const keys = KEY_LIST.join(',');
        const res = await axiosPublic.get(`/public/site-content?lang=${lang}&keys=${keys}`);
        if (mounted) setData(res.data || {});
      } catch {
        if (mounted) setData({});
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lang]);

  return useMemo(() => ({ lang, data }), [lang, data]);
};
