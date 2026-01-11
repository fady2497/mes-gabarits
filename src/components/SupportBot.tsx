import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  LifeBuoy,
  Truck,
  Ruler,
  Sparkles,
  ClipboardList,
  ShoppingCart
} from 'lucide-react';
import {
  buildSystemPrompt,
  SERIES,
  SIZES,
  MATERIALS,
  MODELS,
  LOGISTICS,
  recommendPas,
  catalogueUrl
} from '../lib/botKnowledge';
import { whatsappUrl } from '../config';

type ChatMsg = { role: 'user' | 'assistant'; content: string; time: number };

const SUGGESTIONS = [
  { label: 'Guide des gabarits', icon: ClipboardList, key: 'guide' },
  { label: 'Choisir la taille', icon: Ruler, key: 'taille' },
  { label: 'Motifs disponibles', icon: Sparkles, key: 'motifs' },
  { label: 'Compatibilité modèle', icon: ClipboardList, key: 'compatibilite' },
  { label: 'Tarifs & packs', icon: ShoppingCart, key: 'tarifs' },
  { label: 'Livraison & retours', icon: Truck, key: 'livraison' },
  { label: 'Sur‑mesure', icon: LifeBuoy, key: 'surmesure' },
  { label: 'Catalogue Moto', icon: ShoppingCart, key: 'catalogue' },
  { label: 'Exemples images', icon: Sparkles, key: 'exemples' },
  { label: 'Calcul pas', icon: Ruler, key: 'calc_pas' },
  { label: 'BMW GS', icon: ClipboardList, key: 'bmw_gs' },
  { label: 'BMW R nineT', icon: ClipboardList, key: 'r_ninet' },
  { label: 'Yamaha TMAX', icon: ClipboardList, key: 'tmax' },
  { label: 'Yamaha MT', icon: ClipboardList, key: 'yamaha_mt' },
  { label: 'Honda Goldwing', icon: ClipboardList, key: 'goldwing' },
  { label: 'Ducati Multistrada', icon: ClipboardList, key: 'multistrada' },
  { label: 'KTM Adventure', icon: ClipboardList, key: 'ktm_adventure' },
  { label: 'Suzuki Burgman', icon: ClipboardList, key: 'burgman' },
  { label: 'Piaggio MP3', icon: ClipboardList, key: 'mp3' },
  { label: 'Harley Davidson', icon: ClipboardList, key: 'harley' }
];

const KB: Record<string, string> = {
  guide:
    'Nos gabarits couvrent les séries: Hexagone (A/M), Chevron (B), Curve/Wave (C/L), Line sport (F), Spider (E), Spécial (G/H/I). Chaque série propose plusieurs pas (30/40/50/70 mm) pour adapter le rendu à la taille de selle.',
  taille:
    'Taille recommandée: selle sport/route → 40–50 mm; custom/touring large → 50–70 mm; petite assise → 30–40 mm. Mesurez la largeur utile et vise ~8–12 pavés visibles.',
  motifs:
    'Motifs: Hexagone, Chevron (aligné/décalé), Curve/Wave (courbes), Line sport (lignes parallèles), Spider (rayonnant). Associez matière (alcantara/perforé/lisse) et couleur de surpiqûre.',
  compatibilite:
    'Compatibilité: gabarits génériques applicables à la majorité des selles. Pour modèles spécifiques (BMW GS, TMAX, Honda Goldwing), envoyez une photo + dimensions pour vérification.',
  tarifs:
    'Tarifs: gabarits standards dès 9€. Packs séries disponibles (ex: Hexagone 30/40/50/70). Sur‑mesure sur devis. Remises par quantité.',
  livraison:
    'Livraison: 2–4 jours ouvrés en France avec suivi. Retours sous 14 jours pour standards (hors sur‑mesure).',
  surmesure:
    'Sur‑mesure: fournissez photo, largeur/longueur utiles et motif souhaité. Nous générons un gabarit adapté et validons par un essai visuel.',
  bmw_gs:
    'BMW GS: rendu premium avec Hexagone 40–50 mm. Surpiqûre contrastée (gris/blanc) fréquente. Panneaux latéraux lisses + alcantara au centre recommandés.',
  tmax: 'Yamaha TMAX: selle sport → Hexagone 40–50 mm ou Line sport. Logo brodé optionnel. Teinte surpiqûre assortie (doré/noir).',
  goldwing:
    'Honda Goldwing: large touring → Hexagone 50–70 mm ou Chevron 50–70. Dosseret conforme au motif central. Privilégier confort et régularité du pas.',
  harley:
    'Harley Davidson: style custom → Chevron (aligné/décalé) 40–70 mm ou Wave. Cuir lisse/perforé et surpiqûre épaisse conseillés.'
};

function buildPrompt() {
  const parts = [
    "Tu es l'assistant de Gabarits.fr. Réponds UNIQUEMENT sur les gabarits de sellerie moto.",
    'Domaines: motifs, tailles, compatibilité modèles (BMW GS, TMAX, Goldwing, Harley), tarifs, livraison, sur‑mesure.',
    'Style: concis, français, 3–6 puces max; propose étapes simples quand utile.',
    'Guide: séries Hexagone/Chevron/Curve/Wave/Line/Spider; pas 30/40/50/70 mm.',
    'Recommandations: BMW GS → Hexagone 40–50; TMAX → Hexagone 40–50 ou Line; Goldwing → 50–70; Harley → Chevron/Wave 40–70.'
  ];
  return parts.join(' \n ');
}

async function callAI(input: string, history: ChatMsg[]) {
  try {
    const body = JSON.stringify({
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: input }
      ]
    });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const rsp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: ctrl.signal
    });
    if (!rsp.ok) throw new Error('bad_status');
    const data = await rsp.json();
    return (data?.reply as string) || '';
  } catch {
    try {
      const alt = await fetch('https://traemes-gabaritstuxw.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ]
        })
      });
      if (!alt.ok) return '';
      const data2 = await alt.json();
      return (data2?.reply as string) || '';
    } catch {
      return '';
    }
  }
}

function respondFallback(input: string) {
  const q = input.toLowerCase();
  for (const key of Object.keys(KB)) {
    if (q.includes(key)) return KB[key];
  }
  if (q.includes('bmw') && q.includes('gs')) {
    return KB.bmw_gs;
  }
  if ((q.includes('r') && q.includes('nine')) || q.includes('ninet')) {
    return KB.r_ninet;
  }
  if (q.includes('tmax')) {
    return KB.tmax;
  }
  if (q.includes('mt-') || (q.includes('yamaha') && q.includes('mt'))) {
    return KB.yamaha_mt;
  }
  if (q.includes('goldwing') || (q.includes('honda') && q.includes('gold'))) {
    return KB.goldwing;
  }
  if (q.includes('harley')) {
    return KB.harley;
  }
  if (q.includes('multistrada') || (q.includes('ducati') && q.includes('multi'))) {
    return KB.multistrada;
  }
  if (q.includes('ktm') && q.includes('adventure')) {
    return KB.ktm_adventure;
  }
  if (q.includes('burgman') || (q.includes('suzuki') && q.includes('burg'))) {
    return KB.burgman;
  }
  if (q.includes('mp3') || (q.includes('piaggio') && q.includes('mp'))) {
    return KB.mp3;
  }
  if (q.includes('livraison') || q.includes('delivery')) {
    return KB.livraison;
  }
  if (q.includes('taille') || q.includes('dimension')) {
    return KB.taille;
  }
  if (q.includes('motif') || q.includes('motifs')) {
    return KB.motifs;
  }
  if (q.includes('sur') && q.includes('mesure')) {
    return KB.surmesure;
  }
  if (q.includes('prix') || q.includes('tarif')) {
    return KB.tarifs;
  }
  if (q.includes('compatibilit') || q.includes('modele') || q.includes('modèle')) {
    return KB.compatibilite;
  }
  return 'Je réponds sur les gabarits (motifs, tailles, compatibilité, tarifs, livraison, sur‑mesure). Dites votre modèle et le motif/ taille envisagés.';
}

export default function SupportBot() {
  const [open, setOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    const raw = localStorage.getItem('support_bot_msgs');
    return raw ? JSON.parse(raw) : [];
  });
  const [formOpen, setFormOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcWidth, setCalcWidth] = useState('');
  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState(false);
  const prevOverflow = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    modele: '',
    largeur: '',
    longueur: '',
    motif: '',
    color: '',
    contact: ''
  });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('support_bot_msgs', JSON.stringify(msgs));
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs]);

  useEffect(() => {
    if (open) {
      prevOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow.current || '';
    }
    return () => {
      document.body.style.overflow = prevOverflow.current || '';
    };
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const now = Date.now();
    const trimmed = text.trim();
    setMsgs((m) => [...m, { role: 'user', content: trimmed, time: now }]);
    // Instant KB response for known topics to reduce latency
    const instant = KB[trimmed.toLowerCase()] || respondFallback(trimmed);
    if (instant) {
      setMsgs((m) => [...m, { role: 'assistant', content: instant, time: now + 1 }]);
    }
    setLoading(true);
    const ai = await callAI(text.trim(), msgs);
    const ans = ai || respondFallback(text.trim());
    // If we already sent instant, append an AI refinement; else send AI
    if (!instant) {
      setMsgs((m) => [...m, { role: 'assistant', content: ans, time: now + 1 }]);
    } else if (ai) {
      setMsgs((m) => [...m, { role: 'assistant', content: ai, time: now + 2 }]);
    }
    if (!ai) {
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Mode hors‑connexion: réponse fournie par le guide intégré.',
          time: Date.now()
        }
      ]);
    }
    setLoading(false);
    setInput('');
  };

  const submitForm = () => {
    const spec = `Sur‑mesure demandé:\n• Modèle: ${form.modele}\n• Largeur: ${form.largeur} cm\n• Longueur: ${form.longueur} cm\n• Motif: ${form.motif}\n• Couleur surpiqûre: ${form.color}\n• Contact: ${form.contact}`;
    setMsgs((m) => [
      ...m,
      { role: 'user', content: 'Demande sur‑mesure', time: Date.now() },
      {
        role: 'assistant',
        content:
          spec +
          '\nNous validons par photo + dimensions. Je peux proposer une taille de pas et un motif précis si vous confirmez l’usage.',
        time: Date.now() + 1
      }
    ]);
    const wa = `${whatsappUrl}?text=${encodeURIComponent(spec)}`;
    window.open(wa, '_blank');
    setFormOpen(false);
  };

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-support-bot', handler);
    return () => window.removeEventListener('open-support-bot', handler);
  }, []);
  useEffect(() => {
    const update = () => {
      const mq =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(!!mq);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update as any);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update as any);
    };
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed z-[60] w-[360px] max-w-[92vw] max-h-[75vh] overflow-y-auto"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{
            overscrollBehavior: 'contain',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: isLandscape
              ? 'calc(env(safe-area-inset-bottom) + 120px)'
              : 'calc(env(safe-area-inset-bottom) + 96px)'
          }}
          ref={containerRef}
        >
          <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-black/90 backdrop-blur-xl text-white shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20">
              <div className="font-semibold">Assistance Gabarits.fr</div>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="px-3 py-2 flex gap-2 flex-wrap max-h-24 overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
              style={{ overscrollBehavior: 'contain' }}
            >
              {(expand ? SUGGESTIONS : SUGGESTIONS.slice(0, 6)).map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    disabled={loading}
                    onClick={() => {
                      if (s.key === 'surmesure') setFormOpen(true);
                      else if (s.key === 'catalogue') window.location.href = catalogueUrl;
                      else if (s.key === 'exemples') window.location.href = '/#exemples-stories';
                      else if (s.key === 'calc_pas') setCalcOpen(true);
                      else send(s.label);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{s.label}</span>
                  </button>
                );
              })}
              <button
                disabled={loading}
                onClick={() => setExpand((v) => !v)}
                className="px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/15"
              >
                {expand ? 'Afficher moins' : 'Afficher plus'}
              </button>
            </div>
            {calcOpen && (
              <div className="px-4 pb-2 space-y-2">
                <div className="text-sm text-amber-100">Calcul du pas recommandé</div>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Largeur utile (cm)"
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(e.target.value)}
                  />
                  <button
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white"
                    onClick={() => {
                      const w = parseFloat(calcWidth);
                      const ans = recommendPas(w);
                      setMsgs((m) => [
                        ...m,
                        {
                          role: 'assistant',
                          content: `Largeur ${isNaN(w) ? '?' : w + ' cm'} → pas conseillé: ${ans}`,
                          time: Date.now()
                        }
                      ]);
                    }}
                  >
                    Calculer
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white"
                    onClick={() => setCalcOpen(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
            {formOpen && (
              <div className="px-4 pb-2 space-y-2">
                <div className="text-sm text-amber-100">Demande sur‑mesure</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Modèle (ex: BMW GS)"
                    value={form.modele}
                    onChange={(e) => setForm({ ...form, modele: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Motif (ex: Hexagone 40 mm)"
                    value={form.motif}
                    onChange={(e) => setForm({ ...form, motif: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Largeur utile (cm)"
                    value={form.largeur}
                    onChange={(e) => setForm({ ...form, largeur: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Longueur utile (cm)"
                    value={form.longueur}
                    onChange={(e) => setForm({ ...form, longueur: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Couleur surpiqûre"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-amber-500/30 rounded-lg px-2 py-1 text-sm"
                    placeholder="Email/Téléphone"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white"
                    onClick={submitForm}
                  >
                    Envoyer
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white"
                    onClick={() => setFormOpen(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
            <div
              ref={boxRef}
              className="max-h-[320px] overflow-y-auto px-4 py-3 space-y-3"
              onWheel={(e) => e.stopPropagation()}
              style={{ overscrollBehavior: 'contain' }}
            >
              {msgs.length === 0 && (
                <div className="text-sm text-amber-100">
                  Posez une question (ex: livraison, motif, taille, sur‑mesure).
                </div>
              )}
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                      m.role === 'user' ? 'bg-amber-600 text-white' : 'bg-white/10 text-amber-100'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && send(input)}
                  className="flex-1 bg-white/10 border border-amber-500/30 rounded-lg px-3 py-2 text-sm placeholder:text-white/50"
                  placeholder="Votre question..."
                />
                <button
                  className="px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-60"
                  disabled={loading}
                  onClick={() => send(input)}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {loading && (
                <div className="mt-2 text-xs text-white/70">Rédaction de la réponse…</div>
              )}
              <div className="text-xs text-white/60 mt-2 space-x-2">
                <a href="/contact" className="underline">
                  Contact
                </a>
                <span>•</span>
                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent('Bonjour Gabarits.fr')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
