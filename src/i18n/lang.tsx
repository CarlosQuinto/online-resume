import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dicts, LANGS, type Dict, type Lang } from './ui'

const KEY = 'lang'

/** Inglés por defecto; `?lang=es` en la URL o la elección guardada lo cambian. */
function initial(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (LANGS.includes(fromUrl as Lang)) return fromUrl as Lang
  try {
    const saved = localStorage.getItem(KEY)
    if (LANGS.includes(saved as Lang)) return saved as Lang
  } catch {
    /* ignore */
  }
  return 'en'
}

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: dicts.en })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial)
  const t = dicts[lang]
  useEffect(() => {
    document.documentElement.lang = t.htmlLang
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description)
    // Si se entró con ?lang=…, la URL sigue al selector para que un recargo no lo revierta.
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang') && url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang)
      history.replaceState(null, '', url)
    }
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang, t])
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
