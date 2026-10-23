import { Document, Font, Image, Link, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer'
import type { PortfolioData } from '../data/schema'
import type { Dict, Lang } from '../i18n/ui'
import { fmt } from '../components/Experience'

/**
 * CV en PDF generado en el navegador con @react-pdf/renderer. Este módulo se carga
 * solo al pulsar «Descargar CV», así no pesa en la carga del sitio.
 * Usa Helvetica (incluida en los PDF): cubre acentos y ñ sin descargar fuentes.
 */

// Sin guiones automáticos: el silabeo de la librería es para inglés y parte mal el español.
Font.registerHyphenationCallback((word) => [word])

const ACCENT = '#115E59'
const INK = '#141C3A'
const MUTED = '#475467'
const SUBTLE = '#667085'
const RULE = '#E4E9F0'

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 48, paddingHorizontal: 44, fontFamily: 'Helvetica', fontSize: 9.5, color: INK, lineHeight: 1.4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 },
  photo: { width: 64, height: 64, borderRadius: 32, objectFit: 'cover' },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 22, lineHeight: 1.15 },
  headline: { fontSize: 11.5, color: ACCENT, marginTop: 2 },
  contact: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, color: MUTED, fontSize: 8.5 },
  contactItem: { marginRight: 10, color: MUTED, textDecoration: 'none' },
  rule: { height: 1.5, backgroundColor: ACCENT, marginBottom: 12 },
  section: { marginTop: 12 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: ACCENT, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 0.75, borderBottomColor: RULE },
  item: { marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  itemTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10.5 },
  itemSub: { color: MUTED },
  dates: { fontSize: 8.5, color: SUBTLE },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 4 },
  bulletDot: { width: 9, color: ACCENT },
  bulletText: { flex: 1, color: INK },
  stack: { marginTop: 2, fontSize: 8.5, color: SUBTLE },
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillGroup: { width: 120, fontFamily: 'Helvetica-Bold', fontSize: 9 },
  skillList: { flex: 1, color: MUTED },
  footerLeft: { position: 'absolute', bottom: 22, left: 44, fontSize: 7.5, color: SUBTLE },
})

/** Solo JPEG/PNG en data URL: react-pdf no lee WebP y una URL externa puede fallar por CORS. */
const pdfImage = (url?: string) => (url && /^data:image\/(jpeg|png)/.test(url) ? url : undefined)

const strip = (url: string) => url.replace(/^mailto:|^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Resume({ data, t, siteUrl }: { data: PortfolioData; t: Dict; siteUrl: string }) {
  const p = data.profile
  const photo = pdfImage(p.avatarUrl)
  const key = (ym: string | null) => ym ?? '9999-99'
  const experience = [...data.experience].sort((a, b) => (key(b.end) + b.start).localeCompare(key(a.end) + a.start))
  const phone = p.phone?.trim()
  const contacts = [
    ...p.links.map((l) => ({ label: strip(l.url), url: l.url })),
    ...(phone ? [{ label: phone, url: `tel:${phone.replace(/[^\d+]/g, '')}` }] : []),
  ]

  return (
    <Document title={`${p.name} · ${t.pdf.title}`} author={p.name} subject={p.headline} language={t.htmlLang}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {photo && <Image src={photo} style={s.photo} />}
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{p.name}</Text>
            <Text style={s.headline}>{p.headline}</Text>
            <View style={s.contact}>
              <Text style={s.contactItem}>{p.location}</Text>
              {contacts.map((c) => (
                <Link key={c.url} src={c.url} style={s.contactItem}>
                  {c.label}
                </Link>
              ))}
            </View>
          </View>
        </View>
        <View style={s.rule} />

        <View style={s.section}>
          <Text style={s.sectionTitle}>{t.pdf.profile}</Text>
          <Text style={{ color: INK }}>{p.summary}</Text>
        </View>

        {experience.length > 0 && (
          <View style={s.section}>
            {experience.map((e, i) => (
              <View key={e.id} style={s.item} wrap={false}>
                {/* El título viaja con el primer elemento: nunca queda solo al pie de una página. */}
                {i === 0 && <Text style={s.sectionTitle}>{t.tabs.experiencia}</Text>}
                <View style={s.row}>
                  <Text style={s.itemTitle}>{e.role}</Text>
                  <Text style={s.dates}>
                    {fmt(e.start, t)} — {fmt(e.end, t)}
                  </Text>
                </View>
                <Text style={s.itemSub}>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ''}
                </Text>
                {e.summary && <Text style={{ marginTop: 2 }}>{e.summary}</Text>}
                {e.highlights.map((h) => (
                  <View key={h} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>{h}</Text>
                  </View>
                ))}
                {e.stack.length > 0 && <Text style={s.stack}>{e.stack.join(' · ')}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.skillGroups.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>{t.pdf.skills}</Text>
            {data.skillGroups.map((g) => (
              <View key={g.id} style={s.skillRow}>
                <Text style={s.skillGroup}>{g.name}</Text>
                <Text style={s.skillList}>
                  {g.skills.map((sk, i) => (g.years?.[i] ? `${sk} (${t.years(g.years[i])})` : sk)).join(' · ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>{t.education}</Text>
            {data.education.map((e) => (
              <View key={e.id} style={s.item}>
                <View style={s.row}>
                  <Text style={s.itemTitle}>{t.degreeIn(e.degree, e.field)}</Text>
                  <Text style={s.dates}>
                    {e.start.slice(0, 4)} — {e.end ? e.end.slice(0, 4) : t.present}
                  </Text>
                </View>
                <Text style={s.itemSub}>{e.institution}</Text>
                {(e.description || e.note) && <Text style={{ marginTop: 2 }}>{e.description || e.note}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.certifications.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>{t.credKicker}</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{c.name}</Text>
                  {` — ${c.issuer}${c.date ? ` · ${c.date}` : ''}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {data.projects.length > 0 && (
          <View style={s.section}>
            {data.projects.map((pr, i) => (
              <View key={pr.id} style={s.item} wrap={false}>
                {i === 0 && <Text style={s.sectionTitle}>{t.tabs.proyectos}</Text>}
                <View style={s.row}>
                  <Text style={s.itemTitle}>{pr.title}</Text>
                  {(pr.liveUrl || pr.repoUrl) && (
                    <Link src={pr.liveUrl || pr.repoUrl} style={[s.dates, { color: ACCENT, textDecoration: 'none' }]}>
                      {strip(pr.liveUrl || pr.repoUrl).split('/')[0]}
                    </Link>
                  )}
                </View>
                <Text style={{ marginTop: 1 }}>{pr.description}</Text>
                {pr.stack.length > 0 && <Text style={s.stack}>{pr.stack.join(' · ')}</Text>}
              </View>
            ))}
          </View>
        )}

        <Text style={s.footerLeft} fixed>
          {strip(siteUrl)}
        </Text>
      </Page>
    </Document>
  )
}

/** Genera el PDF con el contenido ya traducido y lo descarga. */
export async function downloadResume(data: PortfolioData, t: Dict, lang: Lang) {
  const siteUrl = window.location.origin
  const blob = await pdf(<Resume data={data} t={t} siteUrl={siteUrl} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.profile.name.replace(/\s+/g, '-')}-CV-${lang.toUpperCase()}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
