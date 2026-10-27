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
  UserCheck,
  Sparkles,
  Users,
  Wine,
  AlertCircle
} from 'lucide-react';

export default function PublicRsvpPage() {
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [status, setStatus] = useState('confirmed');
  const [drinksAlcohol, setDrinksAlcohol] = useState(true);
  const [customRestriction, setCustomRestriction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Acompanhantes extras
  const [companions, setCompanions] = useState([]);

  useEffect(() => {
    async function loadEventData() {
      try {
        const res = await fetch('/api/rsvp');
        const json = await res.json();
        if (json.success) {
          setEventInfo(json.event);
          setGuests(json.guests || []);
        } else {
          setErrorMessage('Não foi possível carregar os dados deste evento.');
        }
      } catch (err) {
        setErrorMessage('Erro de conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    }
    loadEventData();
  }, []);

  const filteredGuests = search.trim().length >= 2
    ? guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSelectGuest = (g) => {
    setSelectedGuest(g);
    setStatus(g.status === 'declined' ? 'declined' : 'confirmed');
    setDrinksAlcohol(g.drinksAlcohol ?? true);
    setSearch('');
  };

  const handleAddCompanion = () => {
    setCompanions([...companions, { name: '', category: 'adult', drinksAlcohol: false }]);
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

    try {
      const payload = {
        guestId: selectedGuest?.id,
        name: selectedGuest?.name || search.trim(),
        status,
        drinksAlcohol,
        restrictions: customRestriction ? [customRestriction] : selectedGuest?.restrictions || ['Sem restrições'],
        companions: companions.filter(c => c.name.trim().length > 0)
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
        setErrorMessage(resJson.message || 'Erro ao registrar confirmação.');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão ao enviar confirmação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2.5 text-zinc-500 text-sm">
          <Cake className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Carregando convite e confirmação de presença...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-50 text-zinc-900 py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        
        {/* CABEÇALHO DO CONVITE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-200/80 text-center relative overflow-hidden mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 text-white mb-4 shadow-sm">
            <Cake className="w-7 h-7 text-amber-400" />
          </div>

          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 block w-max mx-auto mb-2">
            Confirmação de Presença
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {eventInfo?.celebrantName || 'Aniversário'}
          </h1>
          {eventInfo?.age && (
            <p className="text-zinc-500 text-sm font-medium mt-0.5">
              Comemoração de {eventInfo.age} anos!
            </p>
          )}

          <div className="mt-6 pt-5 border-t border-zinc-100 space-y-2.5 text-xs text-left text-zinc-600">
            {eventInfo?.date && (
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Data: <strong>{eventInfo.date}</strong></span>
              </div>
            )}
            {eventInfo?.startTime && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Horário: <strong>{eventInfo.startTime}</strong> {eventInfo.endTime ? `às ${eventInfo.endTime}` : ''}</span>
              </div>
            )}
            {eventInfo?.venueName && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{eventInfo.venueName}</strong>
                  {eventInfo.venueAddress && <span className="block text-zinc-400 text-[11px]">{eventInfo.venueAddress}</span>}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* MENSAGEM DE SUCESSO APÓS CONFIRMAR */}
        {submitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">
              {status === 'confirmed' ? 'Presença confirmada!' : 'Resposta registrada!'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              {status === 'confirmed'
                ? `Obrigado, ${selectedGuest?.name || search}! Já registramos sua presença na lista do anfitrião.`
                : `Agradecemos por nos avisar, ${selectedGuest?.name || search}! Sentiremos sua falta.`}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedGuest(null);
                setCompanions([]);
              }}
              className="mt-6 text-xs text-zinc-500 hover:text-zinc-900 font-medium underline"
            >
              Confirmar para outra pessoa
            </button>
          </div>
        ) : (
          /* FORMULÁRIO DE CONFIRMAÇÃO */
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* BUSCA DE CONVIDADO */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5">
                  1. Localize seu nome na lista:
                </label>

                {selectedGuest ? (
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-semibold text-zinc-900 block">{selectedGuest.name}</strong>
                      <span className="text-[11px] text-zinc-500">{selectedGuest.group || 'Convidado'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      className="text-xs text-zinc-400 hover:text-zinc-700 px-2 py-1 rounded bg-zinc-200/60"
                    >
                      Trocar
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Digite seu nome (ex: Carlos, Mariana...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-zinc-900 outline-none"
                      />
                    </div>

                    {filteredGuests.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-lg z-10 divide-y divide-zinc-100">
                        {filteredGuests.map(g => (
                          <div
                            key={g.id}
                            onClick={() => handleSelectGuest(g)}
                            className="p-2.5 hover:bg-zinc-50 cursor-pointer flex items-center justify-between"
                          >
                            <span className="font-medium text-zinc-900">{g.name}</span>
                            <span className="text-[10px] text-zinc-400">{g.group}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* OPÇÃO DE PRESENÇA (SIM / NÃO) */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5">
                  2. Você vai comparecer?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('confirmed')}
                    className={`py-3 px-3 rounded-xl font-medium border flex items-center justify-center gap-2 transition ${
                      status === 'confirmed'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
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
                        ? 'bg-zinc-800 text-white border-zinc-800 shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Não poderei ir</span>
                  </button>
                </div>
              </div>

              {/* DETALHES EXTRAS QUANDO CONFIRMAR */}
              {status === 'confirmed' && (
                <div className="space-y-3 pt-2 border-t border-zinc-100">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <input
                      type="checkbox"
                      checked={drinksAlcohol}
                      onChange={(e) => setDrinksAlcohol(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-0"
                    />
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <Wine className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Consome bebidas alcoólicas (cerveja/vinho)</span>
                    </div>
                  </label>

                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      Possui alguma restrição alimentar ou alergia?
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Vegetariano, alérgico a camarão, etc."
                      value={customRestriction}
                      onChange={(e) => setCustomRestriction(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs"
                    />
                  </div>

                  {/* ACOMPANHANTES */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-zinc-700">Vai levar acompanhante ou filhos?</span>
                      <button
                        type="button"
                        onClick={handleAddCompanion}
                        className="text-[10px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg"
                      >
                        + Adicionar Acompanhante
                      </button>
                    </div>

                    <div className="space-y-2">
                      {companions.map((comp, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Nome do acompanhante"
                              value={comp.name}
                              onChange={(e) => handleUpdateCompanion(idx, 'name', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCompanion(idx)}
                              className="text-zinc-400 hover:text-rose-500 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <select
                              value={comp.category}
                              onChange={(e) => handleUpdateCompanion(idx, 'category', e.target.value)}
                              className="px-2 py-1 rounded border border-zinc-300 bg-white"
                            >
                              <option value="adult">Adulto</option>
                              <option value="child_6_11">Criança (6-11 anos)</option>
                              <option value="child_0_5">Criança (0-5 anos)</option>
                            </select>
                            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600">
                              <input
                                type="checkbox"
                                checked={comp.drinksAlcohol}
                                onChange={(e) => handleUpdateCompanion(idx, 'drinksAlcohol', e.target.checked)}
                                className="rounded border-zinc-300"
                              />
                              <span>Bebe álcool</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || (!selectedGuest && !search.trim())}
                className="w-full py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 transition shadow-sm mt-4 text-xs"
              >
                {submitting ? 'Gravando resposta...' : 'Confirmar Resposta'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
