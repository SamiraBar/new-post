import { create } from 'zustand';
import axiosApi from '@/axiosApi';

export type Lang = 'ru' | 'kg';

export type Key = 'about.company' | 'important.info' | 'footer.address';

export interface SiteContentDoc {
  _id: string;
  key: Key;
  lang: Lang;
  value: string;
}

type DocsByLang = Record<Lang, Record<Key, SiteContentDoc | null>>;

interface State {
  loading: boolean;
  error: string | null;
  docs: DocsByLang;

  fetchKey: (key: Key, lang: Lang) => Promise<void>;
  saveKey: (key: Key, lang: Lang, value: string) => Promise<boolean>;
}

const emptyLangDocs = (): Record<Key, SiteContentDoc | null> => ({
  'about.company': null,
  'important.info': null,
  'footer.address': null,
});

const useSiteContentStore = create<State>((set) => ({
  loading: false,
  error: null,
  docs: {
    ru: emptyLangDocs(),
    kg: emptyLangDocs(),
  },

  fetchKey: async (key, lang) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosApi.get(`/site-content/${key}?lang=${lang}`);
      set((s) => ({
        loading: false,
        docs: {
          ...s.docs,
          [lang]: { ...s.docs[lang], [key]: data },
        },
      }));
    } catch (e: any) {
      if (e?.response?.status === 404) {
        set((s) => ({
          loading: false,
          docs: {
            ...s.docs,
            [lang]: { ...s.docs[lang], [key]: null },
          },
        }));
        return;
      }
      set({ loading: false, error: e?.message || 'Error' });
    }
  },

  saveKey: async (key, lang, value) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosApi.put(`/site-content/${key}`, { lang, value });
      set((s) => ({
        loading: false,
        docs: {
          ...s.docs,
          [lang]: { ...s.docs[lang], [key]: data },
        },
      }));
      return true;
    } catch (e: any) {
      set({ loading: false, error: e?.message || 'Error' });
      return false;
    }
  },
}));

export default useSiteContentStore;
