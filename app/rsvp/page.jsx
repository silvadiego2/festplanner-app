'use client';

import React, { useState, useEffect } from 'react';
import {
  Cake,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  Search,
  Sparkles,
  AlertCircle,
  Heart,
  Navigation
} from 'lucide-react';

const PRESET_DECLINE_REASONS = [
  'Viagem já agendada',
  'Compromisso de trabalho / plantão',
  'Outro evento familiar na mesma data',
  'Motivo de saúde / repouso',
  'Distância / logística',
  'Outro motivo'
];

const PRESET_RESTRICTION_OPTIONS = [
  'Sem restrições',
  'Vegetariano',
  'Vegano',
  'Sem glúten',
  'Sem lactose',
  'Sem frutos do mar',
  'Não come carne vermelha',
  'Não come carne de porco'
];

export default function PublicInviteAndRsvpPage() {
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  
  // Resposta do Convidado
  const [status, setStatus] = useState('confirmed'); // 'confirmed' | 'declined'
  const [selectedRestrictions, setSelectedRestrictions] = useState(['Sem restrições']);
  const [customRestriction, setCustomRestriction] = useState('');
  const [declineReason, setDeclineReason] = useState(PRESET_DECLINE_REASONS[0]);
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  const [messageToCelebrant, setMessageToCelebrant] = useState('');
  const [companions, setCompanions] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Contagem regressiva
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/rsvp');
        const json = await res.json();
        if (json.success) {
          setEventInfo(json.event);
          setGuests(json.guests || []);

          if (json.event?.date) {
            calculateCountdown(json.event.date, json.event.startTime);
          }
        } else {
          setErrorMessage('Não foi possível carregar as informações do convite.');
        }
      } catch (err) {
        setErrorMessage('Erro de conexão ao carregar o convite.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const calculateCountdown = (dateStr, timeStr) => {
    try {
      const targetTime = timeStr || '16:00';
      const targetDate = new Date(`${dateStr}T${targetTime}:00`);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    } catch (_) {}
  };

  const filteredGuests = search.trim().length >= 2
    ? guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSelectGuest = (g) => {
    setSelectedGuest(g);
    setStatus(g.status === 'declined' ? 'declined' : 'confirmed');
    if (Array.isArray(g.restrictions) && g.restrictions.length > 0) {
      setSelectedRestrictions(g.restrictions);
    } else {
      setSelectedRestrictions(['Sem restrições']);
    }
    setSearch('');
  };

  const handleToggleRestriction = (opt) => {
    if (opt === 'Sem restrições') {
      setSelectedRestrictions(['Sem restrições']);
      return;
    }

    const withoutSem = selectedRestrictions.filter(r => r !== 'Sem restrições');
    if (selectedRestrictions.includes(opt)) {
      const filtered = withoutSem.filter(r => r !== opt);
      setSelectedRestrictions(filtered.length === 0 ? ['Sem restrições'] : filtered);
    } else {
      setSelectedRestrictions([...withoutSem, opt]);
    }
  };

  const handleAddCompanion = () => {
    setCompanions([...companions, { name: '', category: 'adult' }]);
  };

  const handleUpdateCompanion = (index, field, value) => {
    const updated = [...companions];
    updated[index][field] = value;
    setCompanions(updated);
  };

  const handleRemoveCompanion = (index) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGuest && !search.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const finalDeclineReason = declineReason === 'Outro motivo' && customDeclineReason.trim()
      ? customDeclineReason.trim()
      : declineReason;

    let finalRestrictions = selectedRestrictions.filter(r => r !== 'Sem restrições');
    if (customRestriction.trim()) finalRestrictions.push(customRestriction.trim());
    if (finalRestrictions.length === 0) finalRestrictions = ['Sem restrições'];

    try {
      const payload = {
        guestId: selectedGuest?.id,
        name: selectedGuest?.name || search.trim(),
        status,
        drinksAlcohol: true, // valor padrão do sistema sem incomodar o convidado
        restrictions: finalRestrictions,
        declineReason: status === 'declined' ? finalDeclineReason : '',
        messageToCelebrant: messageToCelebrant.trim(),
        companions: status === 'confirmed' ? companions.filter(c => c.name && c.name.trim().length > 0) : []
      };

      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      if (resJson.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(resJson.message || 'Erro ao registrar sua resposta.');
      }
    } catch (err) {
      setErrorMessage('Erro ao conectar com o servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMapLink = () => {
    if (eventInfo?.venueMapUrl && eventInfo.venueMapUrl.startsWith('http')) {
      return eventInfo.venueMapUrl;
    }
    const query = encodeURIComponent(`${eventInfo?.venueName || ''} ${eventInfo?.venueAddress || ''}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="flex items-center gap-2.5 text-zinc-400 text-sm">
          <Cake className="w-5 h-5 animate-spin text-emerald-500" />
          <span>Carregando convite especial...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto space-y-6">

        {/* ============================================================ */}
        {/* PARTE 1: CARTÃO DO CONVITE DIGITAL */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-900/90 shadow-2xl backdrop-blur-md p-6 sm:p-8 text-center">
          
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Selo do Convite */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 mb-3 shadow-lg">
            <Cake className="w-7 h-7 text-zinc-950" />
          </div>

          <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60 block w-max mx-auto mb-2.5">
            Você é nosso convidado especial!
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            {eventInfo?.celebrantName || 'Aniversariante'}
          </h1>

          {eventInfo?.age && (
            <p className="text-sm font-medium text-zinc-400">
              Celebração de <span className="text-emerald-400 font-bold">{eventInfo.age} anos</span>
            </p>
          )}

          {/* Texto do Tema Editável */}
          {eventInfo?.theme && (
            <p className="text-xs italic text-zinc-300 mt-2 font-medium">
              "{eventInfo.theme}"
            </p>
          )}

          {/* Contador Regressivo */}
          {timeLeft.days > 0 && (
            <div className="my-5 p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-around text-center">
              <div>
                <span className="block text-lg font-bold text-emerald-400 leading-none">{timeLeft.days}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Dias</span>
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div>
                <span className="block text-lg font-bold text-white leading-none">{timeLeft.hours}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Horas</span>
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div>
                <span className="block text-lg font-bold text-white leading-none">{timeLeft.minutes}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Minutos</span>
              </div>
            </div>
          )}

          {/* Dados do Evento */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-3 text-left text-xs">
            {eventInfo?.date && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800/70 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Data</span>
                  <span className="font-semibold text-zinc-200">
                    {new Date(eventInfo.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )}

            {/* Apenas horário de início */}
            {eventInfo?.startTime && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800/70 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Horário de Início</span>
                  <span className="font-semibold text-zinc-200">
                    A partir das {eventInfo.startTime}
                  </span>
                </div>
              </div>
            )}

            {eventInfo?.venueName && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800/70 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-zinc-500 block">Local</span>
                  <span className="font-semibold text-zinc-200 block">{eventInfo.venueName}</span>
                  {eventInfo.venueAddress && (
                    <span className="text-[11px] text-zinc-400 block mt-0.5">{eventInfo.venueAddress}</span>
                  )}
                  <a
                    href={getMapLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-emerald-400 transition"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Como chegar (Abrir no GPS / Waze)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PARTE 2: CONFIRMAÇÃO DE PRESENÇA (RSVP) */}
        {/* ============================================================ */}
        {submitted ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-zinc-900/90 p-6 sm:p-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {status === 'confirmed' ? 'Presença confirmada com sucesso!' : 'Mensagem enviada com sucesso!'}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              {status === 'confirmed'
                ? `Que alegria ter você com a gente, ${selectedGuest?.name || search}! Sua presença já foi atualizada na lista oficial da festa.`
                : `Agradecemos por nos avisar, ${selectedGuest?.name || search}. Sentiremos sua falta, mas guardaremos um abraço bem forte!`}
            </p>
            {messageToCelebrant && (
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-300 italic text-left mt-3">
                "{messageToCelebrant}"
              </div>
            )}
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedGuest(null);
                setCompanions([]);
                setMessageToCelebrant('');
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline pt-4 block mx-auto"
            >
              Confirmar para outra pessoa
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-4">
            
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Confirme sua participação abaixo:</span>
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Por favor, nos confirme para organizarmos o buffet e os lugares com carinho.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* PASSO 1: LOCALIZAR O NOME (SEM EXIBIR GRUPO) */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  1. Localize seu nome na lista:
                </label>

                {selectedGuest ? (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-semibold text-white block">{selectedGuest.name}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800"
                    >
                      Trocar
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Digite seu nome (ex: Carlos, Mariana, Paulo...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {filteredGuests.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-20 divide-y divide-zinc-900">
                        {filteredGuests.map(g => (
                          <div
                            key={g.id}
                            onClick={() => handleSelectGuest(g)}
                            className="p-3 hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition"
                          >
                            <span className="font-medium text-zinc-200">{g.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PASSO 2: ESCOLHER SE COMPARECE OU NÃO */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  2. Você poderá comparecer?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('confirmed')}
                    className={`py-3 px-3 rounded-xl font-medium border flex items-center justify-center gap-2 transition ${
                      status === 'confirmed'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Sim, com certeza!</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStatus('declined')}
                    className={`py-3 px-3 rounded-xl font-medium border flex items-center justify-center gap-2 transition ${
                      status === 'declined'
                        ? 'bg-zinc-800 text-white border-zinc-700 shadow-md font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Não poderei ir</span>
                  </button>
                </div>
              </div>

              {/* CENÁRIO A: CONFIRMOU PRESENÇA */}
              {status === 'confirmed' && (
                <div className="space-y-4 pt-2 border-t border-zinc-800">
                  
                  {/* RESTRIÇÕES ALIMENTARES CLICÁVEIS (CHIPS) */}
                  <div>
                    <label className="block text-[11px] text-zinc-300 font-semibold mb-2">
                      Possui alguma restrição alimentar ou preferência? (Clique nas opções):
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PRESET_RESTRICTION_OPTIONS.map((opt, i) => {
                        const isSelected = selectedRestrictions.includes(opt);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleToggleRestriction(opt)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="Outra alergia ou observação (opcional)..."
                      value={customRestriction}
                      onChange={(e) => setCustomRestriction(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  {/* Acompanhantes */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-zinc-300">Vai levar filhos ou acompanhante?</span>
                      <button
                        type="button"
                        onClick={handleAddCompanion}
                        className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-800/60 px-2.5 py-1 rounded-lg"
                      >
                        + Adicionar
                      </button>
                    </div>

                    <div className="space-y-2">
                      {companions.map((comp, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Nome do acompanhante"
                              value={comp.name}
                              onChange={(e) => handleUpdateCompanion(idx, 'name', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCompanion(idx)}
                              className="text-zinc-500 hover:text-rose-400 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <select
                              value={comp.category}
                              onChange={(e) => handleUpdateCompanion(idx, 'category', e.target.value)}
                              className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                            >
                              <option value="adult">Adulto</option>
                              <option value="child_6_11">Criança (6-11 anos)</option>
                              <option value="child_0_5">Criança (0-5 anos)</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CENÁRIO B: NÃO PODERÁ COMPARECER */}
              {status === 'declined' && (
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <div>
                    <label className="block text-[11px] text-zinc-300 font-medium mb-1.5">
                      Qual o motivo da ausência? (Opcional, para o anfitrião saber):
                    </label>
                    <select
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                    >
                      {PRESET_DECLINE_REASONS.map((reason, i) => (
                        <option key={i} value={reason}>{reason}</option>
                      ))}
                    </select>

                    {declineReason === 'Outro motivo' && (
                      <input
                        type="text"
                        placeholder="Conte rapidamente o motivo se desejar..."
                        value={customDeclineReason}
                        onChange={(e) => setCustomDeclineReason(e.target.value)}
                        className="w-full mt-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* RECADO CARINHOSO / FELICITAÇÕES */}
              <div>
                <label className="block text-[11px] text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Deixe um recado carinhoso para {eventInfo?.celebrantName || 'o aniversariante'}:</span>
                </label>
                <textarea
                  rows={2}
                  value={messageToCelebrant}
                  onChange={(e) => setMessageToCelebrant(e.target.value)}
                  placeholder="Escreva seus votos de parabéns ou uma mensagem especial..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || (!selectedGuest && !search.trim())}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold hover:opacity-90 disabled:opacity-50 transition shadow-lg text-xs"
              >
                {submitting ? 'Enviando...' : 'Confirmar Resposta'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
