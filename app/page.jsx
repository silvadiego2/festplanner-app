'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Utensils,
  Wine,
  Sparkles,
  DollarSign,
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Download,
  Share2,
  Flame,
  Gamepad2,
  Layers,
  RotateCcw,
  Sun,
  Moon,
  ChevronRight,
  Check,
  TrendingUp,
  Building,
  Cake,
  Boxes
} from 'lucide-react';

// --- DADOS INICIAIS DE DEMONSTRAÇÃO ---
const INITIAL_EVENT_CONFIG = {
  celebrantName: "Mariana Souza",
  age: 30,
  theme: "Sunset Chic & Boteco Moderno",
  date: "2026-11-14",
  startTime: "16:00",
  endTime: "22:00",
  durationHours: 6,
  locationType: "rented", // 'home' | 'rented'
  condoFee: 150,
  noiseRules: "Música ao vivo permitida até as 22h no salão de festas.",
  venueName: "Espaço Villa Verde & Lounge",
  venueAddress: "Av. dos Coqueiros, 1420 - Salvador, BA",
  venueCost: 2800,
  venueDeposit: 800,
  setupStartTime: "11:00",
  teardownEndTime: "02:00",
  venueMapUrl: "https://maps.google.com",
  venueContact: "(71) 98765-4321 - Paula",
  serviceType: "buffet", // 'buffet' | 'alacarte' | 'churrasco' | 'fingerfood'
  hotDishesCount: 4,
  servesBeer: true,
  servesWine: true,
  safetyMarginPct: 15,
  materialMode: "rental", // 'rental' | 'disposable'
  tableCapacity: 4
};

const INITIAL_GUESTS = [
  { id: '1', name: 'Carlos Eduardo', group: 'Amigos', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: 'Sem restrições' },
  { id: '2', name: 'Fernanda Lima', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: 'Vegetariana' },
  { id: '3', name: 'Lucas Lima (Filho)', group: 'Família', category: 'child_6_11', status: 'confirmed', drinksAlcohol: false, restrictions: 'Sem restrições' },
  { id: '4', name: 'Beatriz Costa', group: 'Trabalho', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: 'Sem glúten' },
  { id: '5', name: 'Rodrigo Alves', group: 'Amigos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: 'Sem restrições' },
  { id: '6', name: 'Juliana Pires', group: 'Amigos', category: 'adult', status: 'declined', drinksAlcohol: true, restrictions: 'Sem restrições' },
  { id: '7', name: 'Gabriel Pires (Bebê)', group: 'Amigos', category: 'child_0_5', status: 'confirmed', drinksAlcohol: false, restrictions: 'Sem restrições' }
];

const INITIAL_EXPENSES = [
  { id: '1', description: 'Locação Salão Villa Verde', category: 'Locação Espaço', estimated: 2800, actual: 2800, paid: true },
  { id: '2', description: 'Carnes e Proteínas Nobres', category: 'Buffet & Comidas', estimated: 1400, actual: 1250, paid: true },
  { id: '3', description: 'Chopp Artesanal & Cervejas', category: 'Bebidas & Gelo', estimated: 950, actual: 920, paid: true },
  { id: '4', description: 'Bolo Decorado & Docinhos Finos', category: 'Confeitaria', estimated: 650, actual: 650, paid: false },
  { id: '5', description: 'Aluguel de Rechauds e Louças', category: 'Aluguel Materiais', estimated: 420, actual: 400, paid: true },
  { id: '6', description: 'Cama Elástica com Monitor', category: 'Brinquedos', estimated: 350, actual: 350, paid: true }
];

const INITIAL_RENTALS = [
  { id: '1', name: 'Salão Villa Verde', category: 'venue', cost: 2800, supplier: 'Espaço Villa Verde', notes: 'Incluso limpeza pós-evento' },
  { id: '2', name: 'Cama Elástica 3,05m', category: 'toy', cost: 350, supplier: 'Tio Pipoca Festas', hasMonitor: true, notes: 'Montagem 1h antes com monitor' },
  { id: '3', name: '10 Jogos de Mesas e Cadeiras', category: 'furniture', cost: 220, supplier: 'LocMóveis Eventos', notes: 'Entrega na sexta-feira à tarde' },
  { id: '4', name: 'Kit 4 Rechauds Inox com Cubas', category: 'furniture', cost: 180, supplier: 'LocMóveis Eventos', notes: 'Devolução limpo' }
];

const INITIAL_CHECKLIST = [
  { id: '1', title: 'Definir tema, estilo e data oficial', period: '45 dias antes', completed: true },
  { id: '2', title: 'Reservar local ou salão de festas', period: '45 dias antes', completed: true },
  { id: '3', title: 'Contratar brinquedos infláveis e monitores', period: '20 dias antes', completed: true },
  { id: '4', title: 'Disparar convites e link de RSVP', period: '20 dias antes', completed: true },
  { id: '5', title: 'Fechar aluguel de louças, taças e rechauds', period: '15 dias antes', completed: false },
  { id: '6', title: 'Comprar bebidas não perecíveis e descartáveis', period: '7 dias antes', completed: false },
  { id: '7', title: 'Confirmar entrega de gelo filtrado e carnes', period: '3 dias antes', completed: false },
  { id: '8', title: 'Montar buffet e testar acendimento dos rechauds', period: 'No dia da festa', completed: false }
];

export default function App() {
  // --- ESTADOS COM PERSISTÊNCIA EM LOCALSTORAGE ---
  const [config, setConfig] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_EVENT_CONFIG;
    const saved = localStorage.getItem('festplanner_config');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_CONFIG;
  });

  const [guests, setGuests] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_GUESTS;
    const saved = localStorage.getItem('festplanner_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [expenses, setExpenses] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_EXPENSES;
    const saved = localStorage.getItem('festplanner_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [rentals, setRentals] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_RENTALS;
    const saved = localStorage.getItem('festplanner_rentals');
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  const [checklist, setChecklist] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_CHECKLIST;
    const saved = localStorage.getItem('festplanner_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modais
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [rsvpSimModalOpen, setRsvpSimModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('festplanner_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('festplanner_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('festplanner_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('festplanner_rentals', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem('festplanner_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- CÁLCULOS PRINCIPAIS BASEADOS EM CONFIRMADOS ---
  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const confirmedList = guests.filter(g => g.status === 'confirmed');
    const pendingList = guests.filter(g => g.status === 'pending');
    const declinedList = guests.filter(g => g.status === 'declined');

    const confirmedAdults = confirmedList.filter(g => g.category === 'adult').length;
    const confirmedKids611 = confirmedList.filter(g => g.category === 'child_6_11').length;
    const confirmedKids05 = confirmedList.filter(g => g.category === 'child_0_5').length;

    // Crianças de 6 a 11 anos contam como 0.5 cota alimentar; de 0 a 5 são isentas
    const weightedEaters = confirmedAdults + (confirmedKids611 * 0.5);
    const alcoholDrinkers = confirmedList.filter(g => g.category === 'adult' && g.drinksAlcohol).length;

    // Custos
    const totalEstimatedCost = expenses.reduce((acc, curr) => acc + (Number(curr.estimated) || 0), 0);
    const totalActualCost = expenses.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0);
    const costPerConfirmed = confirmedList.length > 0 ? (totalEstimatedCost / confirmedList.length) : 0;

    // Gastos por categoria
    const categoryTotals = expenses.reduce((acc, exp) => {
      const cat = exp.category || 'Outros';
      acc[cat] = (acc[cat] || 0) + (Number(exp.actual) || Number(exp.estimated) || 0);
      return acc;
    }, {});

    // Checklist
    const completedChecklist = checklist.filter(c => c.completed).length;
    const checklistProgress = checklist.length > 0 ? Math.round((completedChecklist / checklist.length) * 100) : 0;
    const pendingUrgentTasks = checklist.filter(c => !c.completed).slice(0, 3);

    // Contagem de dias até o evento
    const eventDate = new Date(config.date);
    const today = new Date();
    const diffTime = eventDate - today;
    const daysUntilEvent = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      totalGuests,
      confirmedCount: confirmedList.length,
      pendingCount: pendingList.length,
      declinedCount: declinedList.length,
      confirmedAdults,
      confirmedKids611,
      confirmedKids05,
      weightedEaters,
      alcoholDrinkers,
      totalEstimatedCost,
      totalActualCost,
      costPerConfirmed,
      completedChecklist,
      checklistProgress,
      pendingUrgentTasks,
      daysUntilEvent,
      categoryTotals
    };
  }, [guests, expenses, checklist, config.date]);

  // Cálculos de Comidas e Bebidas
  const calculatedFoodAndBeverages = useMemo(() => {
    const eaters = stats.weightedEaters;
    const drinkers = stats.alcoholDrinkers;
    const hours = Number(config.durationHours) || 5;

    const meatPerPersonKg = config.serviceType === 'churrasco' ? 0.38 : 0.25;
    const totalMeatKg = Math.round(eaters * meatPerPersonKg * 10) / 10;
    const sidesKg = Math.round(eaters * 0.2 * 10) / 10;
    const totalSalgados = Math.round(eaters * (config.serviceType === 'fingerfood' ? 20 : 12));
    const cakeKg = Math.round(stats.confirmedCount * 0.1 * 10) / 10;
    const docinhos = Math.round(stats.confirmedCount * 5);

    const waterLiters = Math.round(stats.confirmedCount * 0.5 * 10) / 10;
    const sodaJuiceLiters = Math.round(stats.confirmedCount * 0.6 * 10) / 10;
    const beerPerDrinkerLiters = hours <= 4 ? 1.5 : hours <= 6 ? 2.0 : 2.5;
    const totalBeerLiters = Math.round(drinkers * beerPerDrinkerLiters * 10) / 10;
    const totalBeerCans = Math.round((totalBeerLiters * 1000) / 350);
    const wineBottles = Math.ceil(drinkers / 2.5);
    const filteredIceKg = Math.round(stats.confirmedCount * 0.8);
    const coolerIceBags = Math.ceil(stats.confirmedCount / 8);

    return {
      totalMeatKg,
      sidesKg,
      totalSalgados,
      cakeKg,
      docinhos,
      waterLiters,
      sodaJuiceLiters,
      totalBeerLiters,
      totalBeerCans,
      wineBottles,
      filteredIceKg,
      coolerIceBags
    };
  }, [stats, config.durationHours, config.serviceType]);

  // Cálculos de Louças, Rechauds e Mobiliário
  const calculatedMaterials = useMemo(() => {
    const confirmed = stats.confirmedCount;
    const safety = 1 + ((Number(config.safetyMarginPct) || 15) / 100);

    const mainPlates = Math.ceil(confirmed * 1.2 * safety);
    const dessertPlates = Math.ceil(confirmed * 1.3 * safety);
    const forksAndKnives = Math.ceil(confirmed * 1.25 * safety);
    const dessertCutlery = Math.ceil(confirmed * 1.3 * safety);
    const waterGlasses = Math.ceil(confirmed * 1.5 * safety);
    const beerTulips = Math.ceil(stats.alcoholDrinkers * 2 * safety);

    const rechauds = Number(config.hotDishesCount) || 4;
    const durationHours = Number(config.durationHours) || 5;
    const fuelPastesNeeded = Math.ceil(rechauds * (durationHours / 2.5));

    const capacity = Number(config.tableCapacity) || 4;
    const guestTablesNeeded = Math.ceil(confirmed / capacity);
    const guestChairsNeeded = guestTablesNeeded * capacity;

    return {
      mainPlates,
      dessertPlates,
      forksAndKnives,
      dessertCutlery,
      waterGlasses,
      beerTulips,
      rechauds,
      fuelPastesNeeded,
      guestTablesNeeded,
      guestChairsNeeded
    };
  }, [stats.confirmedCount, stats.alcoholDrinkers, config.safetyMarginPct, config.hotDishesCount, config.durationHours, config.tableCapacity]);

  // --- HANDLERS ---
  const handleSaveGuest = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) return;

    const group = form.group.value.trim() || 'Geral';
    const category = form.category.value;
    const status = form.status.value;
    const drinksAlcohol = form.drinksAlcohol.checked;
    const restrictions = form.restrictions.value.trim() || 'Sem restrições';

    if (editingGuest) {
      setGuests(guests.map(g => g.id === editingGuest.id ? { ...g, name, group, category, status, drinksAlcohol, restrictions } : g));
      showToast('Convidado atualizado!');
    } else {
      const newGuest = {
        id: Date.now().toString(),
        name,
        group,
        category,
        status,
        drinksAlcohol,
        restrictions
      };
      setGuests([...guests, newGuest]);
      showToast('Convidado adicionado!');
    }

    setGuestModalOpen(false);
    setEditingGuest(null);
  };

  const handleDeleteGuest = (id) => {
    setGuests(guests.filter(g => g.id !== id));
    showToast('Convidado removido.');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const form = e.target;
    const description = form.description.value.trim();
    const category = form.category.value;
    const estimated = parseFloat(form.estimated.value) || 0;

    if (!description) return;

    const newExpense = {
      id: Date.now().toString(),
      description,
      category,
      estimated,
      actual: 0,
      paid: false
    };

    setExpenses([...expenses, newExpense]);
    setExpenseModalOpen(false);
    showToast('Despesa registrada!');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    showToast('Despesa removida.');
  };

  const handleAddRental = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const cost = parseFloat(form.cost.value) || 0;
    const supplier = form.supplier.value.trim();
    const hasMonitor = form.hasMonitor ? form.hasMonitor.checked : false;

    if (!name) return;

    const newRental = {
      id: Date.now().toString(),
      name,
      category,
      cost,
      supplier,
      hasMonitor,
      notes: ''
    };

    setRentals([...rentals, newRental]);
    setRentalModalOpen(false);
    showToast('Item de locação salvo!');
  };

  const handleDeleteRental = (id) => {
    setRentals(rentals.filter(r => r.id !== id));
    showToast('Item de locação excluído.');
  };

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleResetDemoData = () => {
    setConfig(INITIAL_EVENT_CONFIG);
    setGuests(INITIAL_GUESTS);
    setExpenses(INITIAL_EXPENSES);
    setRentals(INITIAL_RENTALS);
    setChecklist(INITIAL_CHECKLIST);
    showToast('Dados padrão restaurados!');
  };

  const handleExportShoppingList = () => {
    const textContent = `
LISTA DE COMPRAS & SUPRIMENTOS - FESTPLANNER PRO
Evento: Aniversário de ${config.celebrantName} (${config.age} anos)
Data: ${config.date} | Duração: ${config.durationHours}h
Confirmados: ${stats.confirmedCount} pessoas (${stats.weightedEaters.toFixed(1)} cotas alimentares)

========================================
1. ALIMENTOS & BUFFET
========================================
- Carnes/Proteínas: ${calculatedFoodAndBeverages.totalMeatKg} kg
- Guarnições (arroz/massas/farofas): ${calculatedFoodAndBeverages.sidesKg} kg
- Salgadinhos/Canapés: ${calculatedFoodAndBeverages.totalSalgados} un
- Bolo de Aniversário: ${calculatedFoodAndBeverages.cakeKg} kg
- Docinhos Gourmet: ${calculatedFoodAndBeverages.docinhos} un

========================================
2. BEBIDAS & GELO
========================================
- Água Mineral: ${calculatedFoodAndBeverages.waterLiters} Litros
- Refrigerantes e Sucos: ${calculatedFoodAndBeverages.sodaJuiceLiters} Litros
${config.servesBeer ? `- Cervejas: ${calculatedFoodAndBeverages.totalBeerLiters} L (~${calculatedFoodAndBeverages.totalBeerCans} latas de 350ml)\n` : ''}${config.servesWine ? `- Vinhos/Espumantes: ${calculatedFoodAndBeverages.wineBottles} garrafas\n` : ''}- Gelo filtrado para consumo: ${calculatedFoodAndBeverages.filteredIceKg} kg
- Gelo para tina/coolers: ${calculatedFoodAndBeverages.coolerIceBags} sacos de 5kg

========================================
3. LOUÇAS & ESTRUTURA (${config.materialMode === 'rental' ? 'ALUGUEL' : 'DESCARTÁVEIS'})
========================================
- Pratos Principais: ${calculatedMaterials.mainPlates} un
- Pratos de Sobremesa: ${calculatedMaterials.dessertPlates} un
- Garfos e Facas de Mesa: ${calculatedMaterials.forksAndKnives} pares
- Copos/Taças de Água: ${calculatedMaterials.waterGlasses} un
- Tulipas/Copos de Chopp: ${calculatedMaterials.beerTulips} un
- Rechauds Inox com Banho-Maria: ${calculatedMaterials.rechauds} cubas
- Pastilhas de Álcool Gel: ${calculatedMaterials.fuelPastesNeeded} un
- Mesas de Convidados: ${calculatedMaterials.guestTablesNeeded} jogos (${calculatedMaterials.guestChairsNeeded} cadeiras)
`.trim();

    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Lista_Compras_${config.celebrantName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Arquivo baixado com sucesso!');
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${darkMode ? 'bg-zinc-950 text-zinc-100 selection:bg-zinc-800' : 'bg-zinc-50/70 text-zinc-900 selection:bg-zinc-200'}`}>
      
      {/* FEEDBACK TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2.5 rounded-xl shadow-lg border border-zinc-800 dark:border-zinc-200 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${darkMode ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white/80 border-zinc-200/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-base shadow-sm">
              <Cake className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight">FestPlanner</span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Pro
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[180px] sm:max-w-none">
                {config.celebrantName} • {config.age} anos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRsvpSimModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Link RSVP</span>
            </button>
            <button
              onClick={() => {
                setEditingGuest(null);
                setGuestModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Convidado</span>
            </button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <button
              onClick={handleResetDemoData}
              title="Restaurar dados padrão"
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: Sparkles },
              { id: 'guests', label: 'Convidados & RSVP', icon: Users, count: stats.confirmedCount },
              { id: 'catering', label: 'Buffet & Louças', icon: Utensils },
              { id: 'rentals', label: 'Locações & Espaço', icon: Gamepad2 },
              { id: 'finance', label: 'Centro de Custos', icon: DollarSign },
              { id: 'checklist', label: 'Cronograma', icon: CheckSquare, badge: `${stats.checklistProgress}%` },
              { id: 'config', label: 'Configurações', icon: Building },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        {/* ============================================================ */}
        {/* ABA 1: DASHBOARD MINIMALISTA E MODERNO */}
        {/* ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* HERO CARD */}
            <div className={`rounded-2xl border p-6 transition-all ${
              darkMode 
                ? 'bg-gradient-to-b from-zinc-900/80 to-zinc-950 border-zinc-800' 
                : 'bg-white border-zinc-200/80 shadow-xs'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      Painel do Evento
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-zinc-400" />
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                      {stats.daysUntilEvent > 0 ? `Faltam ${stats.daysUntilEvent} dias` : stats.daysUntilEvent === 0 ? 'É hoje!' : 'Concluído'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Aniversário de {config.celebrantName} <span className="text-zinc-400 font-normal">({config.age} anos)</span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-zinc-500 dark:text-zinc-400 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(config.date).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {config.startTime} - {config.endTime} ({config.durationHours}h)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {config.locationType === 'home' ? 'Espaço Próprio' : config.venueName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-zinc-400" />
                      {config.serviceType === 'buffet' ? 'Buffet & Rechauds' : config.serviceType === 'churrasco' ? 'Churrasco' : config.serviceType === 'fingerfood' ? 'Finger Foods' : 'À la Carte'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('catering')}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    Calculadora Buffet
                  </button>
                  <button
                    onClick={handleExportShoppingList}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 shadow-sm transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Lista de Compras</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 CARDS DE INDICADORES (KPIS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Confirmados */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Presença Confirmada</span>
                  <Users className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {stats.confirmedCount}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    de {stats.totalGuests} convidados
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>{stats.confirmedAdults} adultos</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span>{stats.confirmedKids611 + stats.confirmedKids05} crianças</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {stats.totalGuests > 0 ? Math.round((stats.confirmedCount / stats.totalGuests) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Orçamento */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Orçamento Executado</span>
                  <DollarSign className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    R$ {stats.totalActualCost.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    de R$ {stats.totalEstimatedCost.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Comprometido</span>
                    <span className="font-medium">
                      {Math.round((stats.totalActualCost / (stats.totalEstimatedCost || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-zinc-900 dark:bg-zinc-100 h-1 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((stats.totalActualCost / (stats.totalEstimatedCost || 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Custo por pessoa */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Custo por Confirmado</span>
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    R$ {Math.round(stats.costPerConfirmed)}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">/ pessoa</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>Base alimentar:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {stats.weightedEaters.toFixed(1)} cotas
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Prontidão Geral</span>
                  <CheckSquare className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {stats.checklistProgress}%
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    {stats.completedChecklist} de {checklist.length} tarefas
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1 rounded-full transition-all"
                      style={{ width: `${stats.checklistProgress}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* GRID PRINCIPAL DO DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* COLUNA ESQUERDA: RSVP E BUFFET RÁPIDO */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* STATUS DOS CONVITES */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Status de Convites & Restrições</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Visão consolidada do retorno dos convidados</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('guests')}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition"
                    >
                      <span>Gerenciar convidados</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex gap-0.5 mb-3">
                    <div
                      style={{ width: `${stats.totalGuests > 0 ? (stats.confirmedCount / stats.totalGuests) * 100 : 0}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title="Confirmados"
                    />
                    <div
                      style={{ width: `${stats.totalGuests > 0 ? (stats.pendingCount / stats.totalGuests) * 100 : 0}%` }}
                      className="bg-amber-400 h-full transition-all"
                      title="Pendentes"
                    />
                    <div
                      style={{ width: `${stats.totalGuests > 0 ? (stats.declinedCount / stats.totalGuests) * 100 : 0}%` }}
                      className="bg-zinc-300 dark:bg-zinc-700 h-full transition-all"
                      title="Recusados"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Confirmados</span>
                      </div>
                      <div className="text-base font-semibold mt-1">{stats.confirmedCount}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Pendentes</span>
                      </div>
                      <div className="text-base font-semibold mt-1">{stats.pendingCount}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span>Recusados</span>
                      </div>
                      <div className="text-base font-semibold mt-1">{stats.declinedCount}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Restrições apontadas:</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {Array.from(new Set(guests.filter(g => g.status === 'confirmed' && g.restrictions !== 'Sem restrições').map(g => g.restrictions))).slice(0, 3).map((r, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                          {r}
                        </span>
                      ))}
                      {guests.filter(g => g.status === 'confirmed' && g.restrictions !== 'Sem restrições').length === 0 && (
                        <span className="text-zinc-400 text-xs italic">Nenhuma restrição registrada.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RESUMO RÁPIDO DO BUFFET */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Cálculo Essencial de Buffet & Estrutura</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Para {stats.confirmedCount} confirmados em {config.durationHours}h de evento</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('catering')}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition"
                    >
                      <span>Ver calculadora completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Carnes / Proteínas</span>
                      <strong className="text-sm font-semibold mt-1 block">{calculatedFoodAndBeverages.totalMeatKg} kg</strong>
                      <span className="text-[10px] text-zinc-500">~250g / cota</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Bolo & Doces</span>
                      <strong className="text-sm font-semibold mt-1 block">{calculatedFoodAndBeverages.cakeKg} kg</strong>
                      <span className="text-[10px] text-zinc-500">+{calculatedFoodAndBeverages.docinhos} doces</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Cervejas</span>
                      <strong className="text-sm font-semibold mt-1 block">
                        {config.servesBeer ? `${calculatedFoodAndBeverages.totalBeerLiters} L` : 'Não'}
                      </strong>
                      <span className="text-[10px] text-zinc-500">~{calculatedFoodAndBeverages.totalBeerCans} latas</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Mesas & Cadeiras</span>
                      <strong className="text-sm font-semibold mt-1 block">{calculatedMaterials.guestTablesNeeded} jogos</strong>
                      <span className="text-[10px] text-zinc-500">{calculatedMaterials.guestChairsNeeded} assentos</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* COLUNA DIREITA: GASTOS E TAREFAS */}
              <div className="space-y-6">
                
                {/* DISTRIBUIÇÃO DE GASTOS */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-tight">Distribuição de Gastos</h3>
                    <button
                      onClick={() => setActiveTab('finance')}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                    >
                      Detalhes
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(stats.categoryTotals).slice(0, 5).map(([category, amount]) => {
                      const percentage = Math.round((amount / (stats.totalActualCost || stats.totalEstimatedCost || 1)) * 100);
                      return (
                        <div key={category} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-600 dark:text-zinc-400">{category}</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              R$ {amount.toLocaleString('pt-BR')} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-zinc-800 dark:bg-zinc-200 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, percentage)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PRÓXIMOS PASSOS PRIORITÁRIOS */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Próximos Passos</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Tarefas prioritárias pendentes</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                    >
                      Ver todas
                    </button>
                  </div>

                  <div className="space-y-2">
                    {stats.pendingUrgentTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleChecklist(task.id)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                          darkMode ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-200/70 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-600 flex items-center justify-center shrink-0" />
                          <span className="truncate text-zinc-800 dark:text-zinc-200">{task.title}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 shrink-0 ml-2">{task.period.split(' ')[0]}</span>
                      </div>
                    ))}
                    {stats.pendingUrgentTasks.length === 0 && (
                      <div className="text-center py-4 text-xs text-zinc-400 italic">
                        Todas as tarefas prioritárias concluídas!
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 2: GESTÃO DE CONVIDADOS & RSVP */}
        {/* ============================================================ */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Lista de Convidados & Confirmações (RSVP)</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    {stats.confirmedCount} confirmados ({stats.confirmedAdults} adultos, {stats.confirmedKids611 + stats.confirmedKids05} crianças), {stats.pendingCount} pendentes e {stats.declinedCount} recusados
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRsvpSimModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Link RSVP</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingGuest(null);
                      setGuestModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Convidado</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Convidados */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="pb-2.5 font-medium">Nome</th>
                      <th className="pb-2.5 font-medium">Grupo</th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th className="pb-2.5 font-medium">Status</th>
                      <th className="pb-2.5 font-medium">Álcool</th>
                      <th className="pb-2.5 font-medium">Restrições</th>
                      <th className="pb-2.5 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {guests.map(guest => (
                      <tr key={guest.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{guest.name}</td>
                        <td className="py-3 text-zinc-500">{guest.group || 'Geral'}</td>
                        <td className="py-3 text-zinc-600 dark:text-zinc-300">
                          {guest.category === 'adult' ? 'Adulto' : guest.category === 'child_6_11' ? 'Criança (6-11 anos)' : 'Criança (0-5 anos)'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            guest.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40'
                              : guest.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'pending' ? 'Pendente' : 'Recusado'}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-500">{guest.drinksAlcohol ? 'Sim' : 'Não'}</td>
                        <td className="py-3 text-zinc-500">{guest.restrictions || 'Sem restrições'}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingGuest(guest);
                                setGuestModalOpen(true);
                              }}
                              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 italic">
                          Nenhum convidado cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 3: CALCULADORA DE BUFFET, BEBIDAS & LOUÇAS */}
        {/* ============================================================ */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Calculadora de Suprimentos & Materiais</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cálculos baseados em <strong>{stats.confirmedCount} confirmados</strong> ({stats.weightedEaters.toFixed(1)} cotas alimentares) e <strong>{config.durationHours}h de duração</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
                    <button
                      onClick={() => setConfig({ ...config, materialMode: 'rental' })}
                      className={`px-3 py-1 rounded-md transition ${config.materialMode === 'rental' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                      Louças / Aluguel
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, materialMode: 'disposable' })}
                      className={`px-3 py-1 rounded-md transition ${config.materialMode === 'disposable' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                      Descartáveis
                    </button>
                  </div>
                  <button
                    onClick={handleExportShoppingList}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Lista</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid dos Cálculos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* COMIDAS */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-zinc-400" /> Alimentos & Doces
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Carnes e Proteínas Limpas</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.totalMeatKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Guarnições (Arroz/Massas/Farofa)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.sidesKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Salgadinhos / Finger Foods</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.totalSalgados} un</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Bolo de Aniversário (100g/pess.)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.cakeKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Docinhos Gourmet</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.docinhos} un</span>
                  </div>
                </div>
              </div>

              {/* BEBIDAS */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                  <Wine className="w-4 h-4 text-zinc-400" /> Bebidas & Gelo
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Água Mineral (com e sem gás)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.waterLiters} L</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Refrigerantes e Sucos</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.sodaJuiceLiters} L</span>
                  </div>
                  {config.servesBeer && (
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Cervejas (~{calculatedFoodAndBeverages.totalBeerCans} latas)</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.totalBeerLiters} L</span>
                    </div>
                  )}
                  {config.servesWine && (
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Vinho / Espumante</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.wineBottles} garrafas</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Gelo (Filtrado + Tina)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedFoodAndBeverages.filteredIceKg}kg + {calculatedFoodAndBeverages.coolerIceBags}scs</span>
                  </div>
                </div>
              </div>

              {/* LOUÇAS E RECHAUDS */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-400" /> Louças & Equipamentos
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Pratos (Refeição + Sobremesa)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.mainPlates + calculatedMaterials.dessertPlates} un</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Talheres (Garfos e Facas)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.forksAndKnives} pares</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Taças & Copos</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.waterGlasses + calculatedMaterials.beerTulips} un</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Rechauds Inox (Banho-Maria)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.rechauds} cubas ({calculatedMaterials.fuelPastesNeeded} pastilhas)</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Mesas & Cadeiras</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.guestTablesNeeded} mesas ({calculatedMaterials.guestChairsNeeded} cad.)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 4: LOCAÇÕES (ESPAÇO, MÓVEIS E BRINQUEDOS) */}
        {/* ============================================================ */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Locações, Brinquedos e Mobiliário</h2>
                  <p className="text-xs text-zinc-500 mt-1">Gerencie os equipamentos infantis, espaço físico e móveis contratados</p>
                </div>
                <button
                  onClick={() => setRentalModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Item de Locação</span>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentals.map(rental => (
                  <div key={rental.id} className={`p-4 rounded-xl border flex flex-col justify-between ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            {rental.category === 'toy' ? 'Brinquedo & Recreação' : rental.category === 'furniture' ? 'Mobiliário' : 'Estrutura'}
                          </span>
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{rental.name}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteRental(rental.id)}
                          className="text-zinc-400 hover:text-rose-500 transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1.5">{rental.supplier || 'Fornecedor padrão'}</p>
                      {rental.notes && <p className="text-[11px] text-zinc-400 mt-1">{rental.notes}</p>}
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{rental.hasMonitor ? 'Monitor incluso' : 'Sem monitor'}</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        R$ {Number(rental.cost || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
                {rentals.length === 0 && (
                  <div className="col-span-full py-8 text-center text-xs text-zinc-400 italic">
                    Nenhum item de locação cadastrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 5: FINANCEIRO & CENTRO DE CUSTOS */}
        {/* ============================================================ */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Centro de Custos & Compras</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Previsto: <strong>R$ {stats.totalEstimatedCost.toLocaleString('pt-BR')}</strong> | Realizado: <strong>R$ {stats.totalActualCost.toLocaleString('pt-BR')}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setExpenseModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Despesa</span>
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="pb-2.5 font-medium">Item</th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th className="pb-2.5 font-medium">Previsto</th>
                      <th className="pb-2.5 font-medium">Realizado</th>
                      <th className="pb-2.5 font-medium">Status</th>
                      <th className="pb-2.5 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {expenses.map(expense => (
                      <tr key={expense.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{expense.description}</td>
                        <td className="py-3 text-zinc-500">{expense.category}</td>
                        <td className="py-3 text-zinc-600 dark:text-zinc-300">R$ {Number(expense.estimated || 0).toLocaleString('pt-BR')}</td>
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">
                          {expense.actual ? `R$ ${Number(expense.actual).toLocaleString('pt-BR')}` : '-'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            expense.paid
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>
                            {expense.paid ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-1 rounded-md text-zinc-400 hover:text-rose-600 transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-400 italic">
                          Nenhum lançamento financeiro registrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 6: LINHA DO TEMPO & CHECKLIST */}
        {/* ============================================================ */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Linha do Tempo & Tarefas</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    {stats.completedChecklist} de {checklist.length} concluídas ({stats.checklistProgress}%)
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {checklist.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleChecklist(task.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                      task.completed
                        ? 'bg-zinc-50/60 dark:bg-zinc-900/20 border-zinc-200/50 dark:border-zinc-800/50 opacity-60'
                        : darkMode
                        ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-600'
                      }`}>
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`font-medium ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0 ml-3">{task.period}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 7: CONFIGURAÇÕES DO EVENTO */}
        {/* ============================================================ */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <h2 className="text-base font-semibold tracking-tight">Parâmetros do Evento</h2>
              <p className="text-xs text-zinc-500 mt-1 mb-5">Configure dados de local, horário e parâmetros de cálculo</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Nome do Aniversariante</label>
                  <input
                    type="text"
                    value={config.celebrantName}
                    onChange={(e) => setConfig({ ...config, celebrantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Idade Comemorada</label>
                  <input
                    type="number"
                    value={config.age}
                    onChange={(e) => setConfig({ ...config, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Data da Festa</label>
                  <input
                    type="date"
                    value={config.date}
                    onChange={(e) => setConfig({ ...config, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Duração do Evento (horas)</label>
                  <input
                    type="number"
                    value={config.durationHours}
                    onChange={(e) => setConfig({ ...config, durationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Tipo de Local</label>
                  <select
                    value={config.locationType}
                    onChange={(e) => setConfig({ ...config, locationType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="home">Espaço Próprio / Condomínio</option>
                    <option value="rented">Espaço / Salão Locado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Serviço de Alimentação</label>
                  <select
                    value={config.serviceType}
                    onChange={(e) => setConfig({ ...config, serviceType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="buffet">Buffet Livre & Rechauds</option>
                    <option value="alacarte">À La Carte</option>
                    <option value="churrasco">Churrasco</option>
                    <option value="fingerfood">Finger Foods & Salgados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Pratos Quentes (Rechauds)</label>
                  <input
                    type="number"
                    value={config.hotDishesCount}
                    onChange={(e) => setConfig({ ...config, hotDishesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Capacidade por Mesa (Lugares)</label>
                  <input
                    type="number"
                    value={config.tableCapacity}
                    onChange={(e) => setConfig({ ...config, tableCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* MODAL: CONVIDADO (CRIAR / EDITAR) */}
      {/* ============================================================ */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingGuest ? 'Editar Convidado' : 'Novo Convidado'}
            </h3>
            <form onSubmit={handleSaveGuest} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  defaultValue={editingGuest?.name || ''}
                  name="name"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Grupo</label>
                  <input
                    type="text"
                    defaultValue={editingGuest?.group || 'Família'}
                    name="group"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select
                    name="category"
                    defaultValue={editingGuest?.category || 'adult'}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  >
                    <option value="adult" className="dark:bg-zinc-900">Adulto</option>
                    <option value="child_6_11" className="dark:bg-zinc-900">Criança (6-11)</option>
                    <option value="child_0_5" className="dark:bg-zinc-900">Criança (0-5)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Confirmação</label>
                  <select
                    name="status"
                    defaultValue={editingGuest?.status || 'pending'}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  >
                    <option value="confirmed" className="dark:bg-zinc-900">Confirmado</option>
                    <option value="pending" className="dark:bg-zinc-900">Pendente</option>
                    <option value="declined" className="dark:bg-zinc-900">Recusado</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="drinksAlcohol"
                      defaultChecked={editingGuest ? editingGuest.drinksAlcohol : true}
                      className="rounded border-zinc-300"
                    />
                    <span>Consome Álcool</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Restrições Alimentares</label>
                <input
                  type="text"
                  placeholder="Ex: Vegetariano, Sem glúten..."
                  defaultValue={editingGuest?.restrictions || ''}
                  name="restrictions"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: LINK DE RSVP */}
      {/* ============================================================ */}
      {rsvpSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-sm rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-1">Link de Convite & RSVP</h3>
            <p className="text-xs text-zinc-500 mb-4">Compartilhe o endereço com seus convidados para registrar presença online.</p>
            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-mono break-all mb-4">
              https://festplanner.app/rsvp/{encodeURIComponent(config.celebrantName.toLowerCase().replace(/\s+/g, '-'))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast('Link do RSVP copiado!');
                  setRsvpSimModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium"
              >
                Copiar Link
              </button>
              <button
                onClick={() => setRsvpSimModalOpen(false)}
                className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: NOVA DESPESA */}
      {/* ============================================================ */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">Adicionar Lançamento</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Descrição</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Ex: Barril de Chopp 50L"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select name="category" className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="Bebidas & Gelo" className="dark:bg-zinc-900">Bebidas & Gelo</option>
                    <option value="Buffet & Comidas" className="dark:bg-zinc-900">Buffet & Comidas</option>
                    <option value="Locação Espaço" className="dark:bg-zinc-900">Locação Espaço</option>
                    <option value="Aluguel Materiais" className="dark:bg-zinc-900">Aluguel Materiais</option>
                    <option value="Brinquedos" className="dark:bg-zinc-900">Brinquedos</option>
                    <option value="Confeitaria" className="dark:bg-zinc-900">Confeitaria</option>
                    <option value="Outros" className="dark:bg-zinc-900">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="estimated"
                    required
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ITEM DE LOCAÇÃO */}
      {/* ============================================================ */}
      {rentalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">Adicionar Item de Locação</h3>
            <form onSubmit={handleAddRental} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome do Item</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Cama Elástica 3,05m"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select name="category" className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="toy" className="dark:bg-zinc-900">Brinquedo Infantil</option>
                    <option value="furniture" className="dark:bg-zinc-900">Mobiliário</option>
                    <option value="venue" className="dark:bg-zinc-900">Espaço Físico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Custo Total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    required
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Fornecedor / Contato</label>
                <input
                  type="text"
                  name="supplier"
                  placeholder="Ex: Tio Pipoca Festas"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasMonitor" className="rounded border-zinc-300" />
                  <span>Inclui monitor / operador</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRentalModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
