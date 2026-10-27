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
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- OPÇÕES PREDEFINIDAS DE GRUPOS E RESTRIÇÕES ---
const PRESET_GROUPS = [
  'Família',
  'Amigos Próximos',
  'Trabalho / Colegas',
  'Esposa / Marido / Cônjuge',
  'Acompanhante / Namorado(a)',
  'Vizinhos',
  'Crianças / Filhos de Amigos'
];

const PRESET_RESTRICTIONS = [
  'Sem restrições',
  'Vegetariano',
  'Vegano',
  'Sem glúten (Celíaco)',
  'Sem lactose',
  'Sem frutos do mar',
  'Não consome carne vermelha',
  'Não consome carne de porco'
];

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
  servesBeer: true,
  servesWine: true,
  safetyMarginPct: 15,
  materialMode: "rental", // 'rental' | 'disposable'
  tableCapacity: 4
};

const INITIAL_MENU = [
  { id: '1', name: 'Dadinhos de Tapioca com Geléia de Pimenta', category: 'starter', isHot: true },
  { id: '2', name: 'Mini Coxinhas e Quibes Artesanais', category: 'starter', isHot: true },
  { id: '3', name: 'Costela Suína com Barbecue de Goiabada', category: 'main', isHot: true },
  { id: '4', name: 'Filé Mignon ao Molho Madeira e Champignon', category: 'main', isHot: true },
  { id: '5', name: 'Arroz Biro-Biro Especial', category: 'side', isHot: true },
  { id: '6', name: 'Farofa Crocante de Castanhas', category: 'side', isHot: false },
  { id: '7', name: 'Mix de Folhas com Redução Balsâmica', category: 'side', isHot: false },
  { id: '8', name: 'Bolo Trufado Red Velvet', category: 'dessert', isHot: false },
  { id: '9', name: 'Brigadeiros Gourmet e Beijinhos de Coco', category: 'dessert', isHot: false },
  { id: '10', name: 'Chopp Pilsen Artesanal e Caipirinhas', category: 'drink', isHot: false }
];

const INITIAL_GUESTS = [
  { id: '1', name: 'Carlos Eduardo', group: 'Amigos Próximos', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '2', name: 'Fernanda Lima', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: ['Vegetariana', 'Sem lactose'] },
  { id: '3', name: 'Lucas Lima (Filho)', group: 'Família', category: 'child_6_11', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'] },
  { id: '4', name: 'Beatriz Costa', group: 'Trabalho / Colegas', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem glúten (Celíaco)'] },
  { id: '5', name: 'Rodrigo Alves', group: 'Amigos Próximos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '6', name: 'Juliana Pires', group: 'Esposa / Marido / Cônjuge', category: 'adult', status: 'declined', drinksAlcohol: true, restrictions: ['Não consome frutos do mar'] },
  { id: '7', name: 'Gabriel Pires (Bebê)', group: 'Crianças / Filhos de Amigos', category: 'child_0_5', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'] }
];

const INITIAL_EXPENSES = [
  { id: '1', description: 'Locação Salão Villa Verde', category: 'Locação Espaço', estimated: 2800, actual: 2800, paid: true },
  { id: '2', description: 'Carnes e Proteínas Nobres (Filé e Costela)', category: 'Buffet & Comidas', estimated: 1400, actual: 1250, paid: true },
  { id: '3', description: 'Chopp Artesanal & Cervejas', category: 'Bebidas & Gelo', estimated: 950, actual: 920, paid: true },
  { id: '4', description: 'Bolo Decorado & Docinhos Finos', category: 'Confeitaria', estimated: 650, actual: 650, paid: false },
  { id: '5', description: 'Aluguel de Rechauds e Louças', category: 'Aluguel Materiais', estimated: 420, actual: 400, paid: true },
  { id: '6', description: 'Cama Elástica com Monitor', category: 'Brinquedos', estimated: 350, actual: 350, paid: true }
];

const INITIAL_RENTALS = [
  { id: '1', name: 'Salão Villa Verde', category: 'venue', cost: 2800, supplier: 'Espaço Villa Verde', notes: 'Incluso limpeza pós-evento' },
  { id: '2', name: 'Cama Elástica 3,05m', category: 'toy', cost: 350, supplier: 'Tio Pipoca Festas', hasMonitor: true, notes: 'Montagem 1h antes com monitor' },
  { id: '3', name: '10 Jogos de Mesas e Cadeiras', category: 'furniture', cost: 220, supplier: 'LocMóveis Eventos', notes: 'Entrega na sexta-feira à tarde' },
  { id: '4', name: 'Kit Rechauds Inox com Cubas', category: 'furniture', cost: 180, supplier: 'LocMóveis Eventos', notes: 'Devolução limpo' }
];

const INITIAL_CHECKLIST = [
  { id: '1', title: 'Definir tema, estilo e data oficial', period: '45 dias antes', completed: true },
  { id: '2', title: 'Reservar local ou salão de festas', period: '45 dias antes', completed: true },
  { id: '3', title: 'Estruturar o cardápio e pratos quentes', period: '30 dias antes', completed: true },
  { id: '4', title: 'Contratar brinquedos infláveis e monitores', period: '20 dias antes', completed: true },
  { id: '5', title: 'Disparar convites e link de RSVP', period: '20 dias antes', completed: true },
  { id: '6', title: 'Fechar aluguel de louças, taças e rechauds', period: '15 dias antes', completed: false },
  { id: '7', title: 'Comprar bebidas não perecíveis e descartáveis', period: '7 dias antes', completed: false },
  { id: '8', title: 'Confirmar entrega de gelo filtrado e carnes', period: '3 dias antes', completed: false },
  { id: '9', title: 'Montar buffet e testar acendimento dos rechauds', period: 'No dia da festa', completed: false }
];

export default function App() {
  // --- ESTADOS COM PERSISTÊNCIA EM LOCALSTORAGE ---
  const [config, setConfig] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_EVENT_CONFIG;
    const saved = localStorage.getItem('festplanner_config');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_CONFIG;
  });

  const [menu, setMenu] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_MENU;
    const saved = localStorage.getItem('festplanner_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
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

  // Ordenação de convidados
  const [guestSortField, setGuestSortField] = useState('name');
  const [guestSortAsc, setGuestSortAsc] = useState(true);

  // Modais de Criação & Edição
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [selectedRestrictions, setSelectedRestrictions] = useState(['Sem restrições']);

  const [rsvpSimModalOpen, setRsvpSimModalOpen] = useState(false);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('festplanner_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('festplanner_menu', JSON.stringify(menu));
  }, [menu]);

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

  // --- CÁLCULOS PRINCIPAIS BASEADOS EM CONFIRMADOS & CARDÁPIO ---
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

    // Cardápio & Pratos Quentes
    const hotDishesInMenu = menu.filter(item => item.isHot).length;

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
      categoryTotals,
      hotDishesInMenu
    };
  }, [guests, expenses, checklist, config.date, menu]);

  // Cálculos de Comidas e Bebidas integrados ao cardápio
  const calculatedFoodAndBeverages = useMemo(() => {
    const eaters = stats.weightedEaters;
    const drinkers = stats.alcoholDrinkers;
    const hours = Number(config.durationHours) || 5;

    // Se o serviço for churrasco ou fingerfood ajustamos a cota
    const meatPerPersonKg = config.serviceType === 'churrasco' ? 0.38 : 0.25;
    const totalMeatKg = Math.round(eaters * meatPerPersonKg * 10) / 10;
    const sidesKg = Math.round(eaters * 0.22 * 10) / 10;
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

  // Cálculos de Louças, Rechauds (baseados nos pratos quentes do menu) e Mobiliário
  const calculatedMaterials = useMemo(() => {
    const confirmed = stats.confirmedCount;
    const safety = 1 + ((Number(config.safetyMarginPct) || 15) / 100);

    const mainPlates = Math.ceil(confirmed * 1.2 * safety);
    const dessertPlates = Math.ceil(confirmed * 1.3 * safety);
    const forksAndKnives = Math.ceil(confirmed * 1.25 * safety);
    const dessertCutlery = Math.ceil(confirmed * 1.3 * safety);
    const waterGlasses = Math.ceil(confirmed * 1.5 * safety);
    const beerTulips = Math.ceil(stats.alcoholDrinkers * 2 * safety);

    // Rechauds determinados dinamicamente pelo número de pratos quentes no cardápio
    const rechauds = Math.max(1, stats.hotDishesInMenu || 4);
    const durationHours = Number(config.durationHours) || 5;
    // Cada pastilha de álcool gel dura cerca de 2h a 2.5h
    const fuelPastesNeeded = Math.ceil(rechauds * (durationHours / 2));

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
  }, [stats.confirmedCount, stats.alcoholDrinkers, stats.hotDishesInMenu, config.safetyMarginPct, config.durationHours, config.tableCapacity]);

  // Lista ordenada de convidados
  const sortedGuests = useMemo(() => {
    return [...guests].sort((a, b) => {
      let valA = a[guestSortField];
      let valB = b[guestSortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return guestSortAsc ? -1 : 1;
      if (valA > valB) return guestSortAsc ? 1 : -1;
      return 0;
    });
  }, [guests, guestSortField, guestSortAsc]);

  const handleSortToggle = (field) => {
    if (guestSortField === field) {
      setGuestSortAsc(!guestSortAsc);
    } else {
      setGuestSortField(field);
      setGuestSortAsc(true);
    }
  };

  // --- HANDLERS DE CONVIDADOS ---
  const openGuestModal = (guest = null) => {
    setEditingGuest(guest);
    if (guest) {
      const rest = Array.isArray(guest.restrictions) 
        ? guest.restrictions 
        : typeof guest.restrictions === 'string' 
        ? [guest.restrictions] 
        : ['Sem restrições'];
      setSelectedRestrictions(rest);
    } else {
      setSelectedRestrictions(['Sem restrições']);
    }
    setGuestModalOpen(true);
  };

  const handleToggleRestriction = (r) => {
    if (r === 'Sem restrições') {
      setSelectedRestrictions(['Sem restrições']);
      return;
    }
    let updated = selectedRestrictions.filter(item => item !== 'Sem restrições');
    if (updated.includes(r)) {
      updated = updated.filter(item => item !== r);
      if (updated.length === 0) updated = ['Sem restrições'];
    } else {
      updated.push(r);
    }
    setSelectedRestrictions(updated);
  };

  const handleSaveGuest = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) return;

    const group = form.group.value.trim() || 'Família';
    const category = form.category.value;
    const status = form.status.value;
    const drinksAlcohol = form.drinksAlcohol.checked;
    const customRestriction = form.customRestriction?.value?.trim();

    let finalRestrictions = [...selectedRestrictions];
    if (customRestriction) {
      finalRestrictions = finalRestrictions.filter(item => item !== 'Sem restrições');
      finalRestrictions.push(customRestriction);
    }
    if (finalRestrictions.length === 0) finalRestrictions = ['Sem restrições'];

    if (editingGuest) {
      setGuests(guests.map(g => g.id === editingGuest.id ? {
        ...g,
        name,
        group,
        category,
        status,
        drinksAlcohol,
        restrictions: finalRestrictions
      } : g));
      showToast('Convidado atualizado com sucesso!');
    } else {
      const newGuest = {
        id: Date.now().toString(),
        name,
        group,
        category,
        status,
        drinksAlcohol,
        restrictions: finalRestrictions
      };
      setGuests([...guests, newGuest]);
      showToast('Convidado adicionado à lista!');
    }

    setGuestModalOpen(false);
    setEditingGuest(null);
  };

  const handleDeleteGuest = (id) => {
    setGuests(guests.filter(g => g.id !== id));
    showToast('Convidado removido.');
  };

  // --- HANDLERS DO CARDÁPIO ---
  const openMenuModal = (item = null) => {
    setEditingMenuItem(item);
    setMenuModalOpen(true);
  };

  const handleSaveMenuItem = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const isHot = form.isHot.checked;

    if (!name) return;

    if (editingMenuItem) {
      setMenu(menu.map(m => m.id === editingMenuItem.id ? { ...m, name, category, isHot } : m));
      showToast('Item do cardápio atualizado!');
    } else {
      const newItem = {
        id: Date.now().toString(),
        name,
        category,
        isHot
      };
      setMenu([...menu, newItem]);
      showToast('Prato adicionado ao cardápio!');
    }

    setMenuModalOpen(false);
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = (id) => {
    setMenu(menu.filter(m => m.id !== id));
    showToast('Item removido do cardápio.');
  };

  // --- HANDLERS DO CENTRO DE CUSTOS (CRIAR E EDITAR) ---
  const openExpenseModal = (expense = null) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const form = e.target;
    const description = form.description.value.trim();
    const category = form.category.value;
    const estimated = parseFloat(form.estimated.value) || 0;
    const actual = parseFloat(form.actual.value) || 0;
    const paid = form.paid.checked;

    if (!description) return;

    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? {
        ...exp,
        description,
        category,
        estimated,
        actual,
        paid
      } : exp));
      showToast('Despesa atualizada com sucesso!');
    } else {
      const newExpense = {
        id: Date.now().toString(),
        description,
        category,
        estimated,
        actual,
        paid
      };
      setExpenses([...expenses, newExpense]);
      showToast('Despesa cadastrada!');
    }

    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    showToast('Despesa removida.');
  };

  // --- HANDLERS DE LOCAÇÕES & MOBILIÁRIO (CRIAR E EDITAR) ---
  const openRentalModal = (rental = null) => {
    setEditingRental(rental);
    setRentalModalOpen(true);
  };

  const handleSaveRental = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const cost = parseFloat(form.cost.value) || 0;
    const supplier = form.supplier.value.trim();
    const notes = form.notes.value.trim();
    const hasMonitor = form.hasMonitor ? form.hasMonitor.checked : false;

    if (!name) return;

    if (editingRental) {
      setRentals(rentals.map(r => r.id === editingRental.id ? {
        ...r,
        name,
        category,
        cost,
        supplier,
        notes,
        hasMonitor
      } : r));
      showToast('Item de locação atualizado!');
    } else {
      const newRental = {
        id: Date.now().toString(),
        name,
        category,
        cost,
        supplier,
        notes,
        hasMonitor
      };
      setRentals([...rentals, newRental]);
      showToast('Item de locação cadastrado!');
    }

    setRentalModalOpen(false);
    setEditingRental(null);
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
    setMenu(INITIAL_MENU);
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
1. CARDÁPIO SUGERIDO E PRATOS
========================================
${menu.map(m => `- [${m.category.toUpperCase()}] ${m.name} ${m.isHot ? '(Requer Rechaud/Aquecimento)' : ''}`).join('\n')}

========================================
2. ALIMENTOS & BUFFET (CÁLCULO TOTAL)
========================================
- Carnes/Proteínas: ${calculatedFoodAndBeverages.totalMeatKg} kg
- Guarnições (arroz/massas/farofas): ${calculatedFoodAndBeverages.sidesKg} kg
- Salgadinhos/Canapés: ${calculatedFoodAndBeverages.totalSalgados} un
- Bolo de Aniversário: ${calculatedFoodAndBeverages.cakeKg} kg
- Docinhos Gourmet: ${calculatedFoodAndBeverages.docinhos} un

========================================
3. BEBIDAS & GELO
========================================
- Água Mineral: ${calculatedFoodAndBeverages.waterLiters} Litros
- Refrigerantes e Sucos: ${calculatedFoodAndBeverages.sodaJuiceLiters} Litros
${config.servesBeer ? `- Cervejas: ${calculatedFoodAndBeverages.totalBeerLiters} L (~${calculatedFoodAndBeverages.totalBeerCans} latas de 350ml)\n` : ''}${config.servesWine ? `- Vinhos/Espumantes: ${calculatedFoodAndBeverages.wineBottles} garrafas\n` : ''}- Gelo filtrado para consumo: ${calculatedFoodAndBeverages.filteredIceKg} kg
- Gelo para tina/coolers: ${calculatedFoodAndBeverages.coolerIceBags} sacos de 5kg

========================================
4. LOUÇAS & ESTRUTURA (${config.materialMode === 'rental' ? 'ALUGUEL' : 'DESCARTÁVEIS'})
========================================
- Pratos Principais: ${calculatedMaterials.mainPlates} un
- Pratos de Sobremesa: ${calculatedMaterials.dessertPlates} un
- Garfos e Facas de Mesa: ${calculatedMaterials.forksAndKnives} pares
- Copos/Taças de Água: ${calculatedMaterials.waterGlasses} un
- Tulipas/Copos de Chopp: ${calculatedMaterials.beerTulips} un
- Rechauds Inox com Banho-Maria: ${calculatedMaterials.rechauds} cubas (Para ${stats.hotDishesInMenu} pratos quentes)
- Pastilhas de Álcool Gel: ${calculatedMaterials.fuelPastesNeeded} un (Para ${config.durationHours}h de evento)
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
              onClick={() => openGuestModal()}
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
              { id: 'menu', label: 'Cardápio Sugerido', icon: BookOpen, count: menu.length },
              { id: 'catering', label: 'Buffet & Louças', icon: Utensils },
              { id: 'rentals', label: 'Locações & Espaço', icon: Gamepad2, count: rentals.length },
              { id: 'finance', label: 'Centro de Custos', icon: DollarSign, count: expenses.length },
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
        {/* ABA 1: DASHBOARD */}
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
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      {menu.length} pratos no cardápio ({stats.hotDishesInMenu} rechauds necessários)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    Ver Cardápio
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

            {/* 4 CARDS DE KPIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
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
                  <span>Cota alimentar:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {stats.weightedEaters.toFixed(1)} cotas
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Cardápio & Rechauds</span>
                  <Flame className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {stats.hotDishesInMenu}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    pratos quentes
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>Rechauds necessários:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {calculatedMaterials.rechauds} cubas ({calculatedMaterials.fuelPastesNeeded} pastilhas)
                  </span>
                </div>
              </div>

            </div>

            {/* SEÇÃO PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                
                {/* RSVP TRACKER */}
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
                </div>

                {/* RESUMO DO BUFFET & CARDÁPIO */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Cálculo Essencial de Buffet & Estrutura</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Calculado para {stats.confirmedCount} confirmados em {config.durationHours}h</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('catering')}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition"
                    >
                      <span>Calculadora detalhada</span>
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
                      <span className="text-[11px] text-zinc-400 block">Rechauds & Pastilhas</span>
                      <strong className="text-sm font-semibold mt-1 block">{calculatedMaterials.rechauds} cubas</strong>
                      <span className="text-[10px] text-zinc-500">{calculatedMaterials.fuelPastesNeeded} pastilhas</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                
                {/* GASTOS */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-tight">Distribuição de Gastos</h3>
                    <button
                      onClick={() => setActiveTab('finance')}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                    >
                      Editar
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

                {/* TAREFAS */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-tight">Próximos Passos</h3>
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
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 2: GESTÃO DE CONVIDADOS COM ORDENAÇÃO E PRESETS */}
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
                    onClick={() => openGuestModal()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Convidado</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Convidados com Ordenação */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="pb-2.5 font-medium cursor-pointer select-none" onClick={() => handleSortToggle('name')}>
                        <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
                          <span>Nome</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${guestSortField === 'name' ? 'text-zinc-900 dark:text-zinc-100' : 'opacity-40'}`} />
                        </div>
                      </th>
                      <th className="pb-2.5 font-medium cursor-pointer select-none" onClick={() => handleSortToggle('group')}>
                        <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
                          <span>Grupo / Vínculo</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${guestSortField === 'group' ? 'text-zinc-900 dark:text-zinc-100' : 'opacity-40'}`} />
                        </div>
                      </th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th className="pb-2.5 font-medium cursor-pointer select-none" onClick={() => handleSortToggle('status')}>
                        <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
                          <span>Status</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${guestSortField === 'status' ? 'text-zinc-900 dark:text-zinc-100' : 'opacity-40'}`} />
                        </div>
                      </th>
                      <th className="pb-2.5 font-medium">Álcool</th>
                      <th className="pb-2.5 font-medium">Restrições Selecionadas</th>
                      <th className="pb-2.5 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {sortedGuests.map(guest => (
                      <tr key={guest.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{guest.name}</td>
                        <td className="py-3">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {guest.group || 'Família'}
                          </span>
                        </td>
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
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(guest.restrictions) ? guest.restrictions : [guest.restrictions || 'Sem restrições']).map((r, i) => (
                              <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                                r === 'Sem restrições'
                                  ? 'text-zinc-400'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/40'
                              }`}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openGuestModal(guest)}
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA NOVA: CARDÁPIO SUGERIDO & PRATOS QUENTES (COM RECHAUDS) */}
        {/* ============================================================ */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Cardápio Sugerido do Evento</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cadastre os pratos do menu. Itens marcados como <strong>quentes</strong> alimentam automaticamente o cálculo de rechauds e pastilhas de aquecimento.
                  </p>
                </div>
                <button
                  onClick={() => openMenuModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Prato / Item</span>
                </button>
              </div>

              {/* Categorias do Menu */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['starter', 'main', 'side', 'dessert', 'drink'].map(cat => {
                  const catLabel = cat === 'starter' ? 'Entradas & Canapés' : cat === 'main' ? 'Pratos Principais' : cat === 'side' ? 'Guarnições & Saladas' : cat === 'dessert' ? 'Sobremesas & Doces' : 'Bebidas Oficiais';
                  const items = menu.filter(m => m.category === cat);

                  return (
                    <div key={cat} className={`p-4 rounded-xl border flex flex-col justify-between ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                            {catLabel}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                            {items.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {items.map(item => (
                            <div key={item.id} className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">{item.name}</span>
                                {item.isHot && (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                                    <Flame className="w-3 h-3" />
                                    <span>Servido quente (Rechaud)</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  onClick={() => openMenuModal(item)}
                                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  className="p-1 rounded text-zinc-400 hover:text-rose-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {items.length === 0 && (
                            <div className="py-4 text-center text-xs text-zinc-400 italic">
                              Nenhum item adicionado nesta categoria.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 3: CALCULADORA DE BUFFET & LOUÇAS */}
        {/* ============================================================ */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Calculadora de Suprimentos & Materiais</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cálculos baseados em <strong>{stats.confirmedCount} confirmados</strong> ({stats.weightedEaters.toFixed(1)} cotas alimentares), <strong>{stats.hotDishesInMenu} pratos quentes do cardápio</strong> e <strong>{config.durationHours}h de duração</strong>.
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

              {/* LOUÇAS E RECHAUDS VINCULADOS AO MENU */}
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
                    <span className="text-zinc-600 dark:text-zinc-400">Rechauds Inox ({stats.hotDishesInMenu} pratos quentes)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.rechauds} cubas</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Pastilhas de Álcool Gel ({config.durationHours}h)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedMaterials.fuelPastesNeeded} un</span>
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
        {/* ABA 4: LOCAÇÕES COM EDIÇÃO COMPLETA */}
        {/* ============================================================ */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Locações, Brinquedos e Mobiliário</h2>
                  <p className="text-xs text-zinc-500 mt-1">Gerencie e edite os equipamentos infantis, espaço físico e móveis contratados</p>
                </div>
                <button
                  onClick={() => openRentalModal()}
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
                            {rental.category === 'toy' ? 'Brinquedo & Recreação' : rental.category === 'furniture' ? 'Mobiliário' : 'Estrutura / Espaço'}
                          </span>
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{rental.name}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openRentalModal(rental)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Editar Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRental(rental.id)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-500"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 5: CENTRO DE CUSTOS COM EDIÇÃO COMPLETA */}
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
                  onClick={() => openExpenseModal()}
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
                      <th className="pb-2.5 font-medium">Item / Descrição</th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th className="pb-2.5 font-medium">Previsto</th>
                      <th className="pb-2.5 font-medium">Realizado</th>
                      <th className="pb-2.5 font-medium">Status</th>
                      <th className="pb-2.5 font-medium text-right">Ações</th>
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
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openExpenseModal(expense)}
                              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              title="Editar Despesa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 6: CRONOGRAMA */}
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
        {/* ABA 7: CONFIGURAÇÕES */}
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
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Capacidade por Mesa (Lugares)</label>
                  <input
                    type="number"
                    value={config.tableCapacity}
                    onChange={(e) => setConfig({ ...config, tableCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Margem de Segurança de Louças (%)</label>
                  <input
                    type="number"
                    value={config.safetyMarginPct}
                    onChange={(e) => setConfig({ ...config, safetyMarginPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* MODAL: CONVIDADO COM GRUPOS PREDEFINIDOS E RESTRIÇÕES EM CHIPS */}
      {/* ============================================================ */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingGuest ? 'Editar Convidado' : 'Novo Convidado'}
            </h3>
            <form onSubmit={handleSaveGuest} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Nome Completo</label>
                <input
                  type="text"
                  required
                  defaultValue={editingGuest?.name || ''}
                  name="name"
                  placeholder="Ex: Carlos Eduardo ou Esposa do Carlos"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>

              {/* SELEÇÃO DE GRUPO COM PRESETS */}
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Grupo / Vínculo</label>
                <select
                  name="group"
                  defaultValue={editingGuest?.group || 'Família'}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                >
                  {PRESET_GROUPS.map(grp => (
                    <option key={grp} value={grp} className="dark:bg-zinc-900">{grp}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1 font-medium">Faixa Etária</label>
                  <select
                    name="category"
                    defaultValue={editingGuest?.category || 'adult'}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                  >
                    <option value="adult" className="dark:bg-zinc-900">Adulto</option>
                    <option value="child_6_11" className="dark:bg-zinc-900">Criança (6-11 anos - meia cota)</option>
                    <option value="child_0_5" className="dark:bg-zinc-900">Criança (0-5 anos - isento)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1 font-medium">Confirmação (RSVP)</label>
                  <select
                    name="status"
                    defaultValue={editingGuest?.status || 'pending'}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                  >
                    <option value="confirmed" className="dark:bg-zinc-900">Confirmado</option>
                    <option value="pending" className="dark:bg-zinc-900">Pendente</option>
                    <option value="declined" className="dark:bg-zinc-900">Recusado</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="drinksAlcohol"
                    defaultChecked={editingGuest ? editingGuest.drinksAlcohol : true}
                    className="rounded border-zinc-300"
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Consome bebidas alcoólicas (Chopp / Cerveja / Vinho)</span>
                </label>
              </div>

              {/* SELEÇÃO DE RESTRIÇÕES ALIMENTARES COM CHIPS */}
              <div>
                <label className="block text-zinc-500 mb-1.5 font-medium">Restrições Alimentares (clique para selecionar):</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_RESTRICTIONS.map(r => {
                    const isSelected = selectedRestrictions.includes(r);
                    return (
                      <button
                        type="button"
                        key={r}
                        onClick={() => handleToggleRestriction(r)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  name="customRestriction"
                  placeholder="Ou digite outra restrição específica..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                >
                  {editingGuest ? 'Salvar Alterações' : 'Adicionar Convidado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ITEM DO CARDÁPIO (CRIAR / EDITAR) */}
      {/* ============================================================ */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingMenuItem ? 'Editar Prato / Item' : 'Novo Prato no Cardápio'}
            </h3>
            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome do Prato / Bebida</label>
                <input
                  type="text"
                  required
                  defaultValue={editingMenuItem?.name || ''}
                  name="name"
                  placeholder="Ex: Risoto de Alho Poró com Parmesão"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Categoria do Menu</label>
                <select
                  name="category"
                  defaultValue={editingMenuItem?.category || 'main'}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                >
                  <option value="starter" className="dark:bg-zinc-900">Entradas & Canapés</option>
                  <option value="main" className="dark:bg-zinc-900">Prato Principal</option>
                  <option value="side" className="dark:bg-zinc-900">Guarnição / Salada</option>
                  <option value="dessert" className="dark:bg-zinc-900">Sobremesa & Doces</option>
                  <option value="drink" className="dark:bg-zinc-900">Bebida</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isHot"
                    defaultChecked={editingMenuItem ? editingMenuItem.isHot : true}
                    className="rounded border-zinc-300"
                  />
                  <div>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">Prato quente (Requer Rechaud com Banho-Maria)</span>
                    <p className="text-[10px] text-zinc-400">Gera automaticamente cálculo de cuba e pastilha de combustível.</p>
                  </div>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                >
                  Salvar Prato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DESPESA (CRIAR / EDITAR) */}
      {/* ============================================================ */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingExpense ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}
            </h3>
            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Descrição</label>
                <input
                  type="text"
                  name="description"
                  required
                  defaultValue={editingExpense?.description || ''}
                  placeholder="Ex: Barril de Chopp 50L"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Categoria</label>
                <select
                  name="category"
                  defaultValue={editingExpense?.category || 'Bebidas & Gelo'}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                >
                  <option value="Locação Espaço" className="dark:bg-zinc-900">Locação Espaço</option>
                  <option value="Buffet & Comidas" className="dark:bg-zinc-900">Buffet & Comidas</option>
                  <option value="Bebidas & Gelo" className="dark:bg-zinc-900">Bebidas & Gelo</option>
                  <option value="Aluguel Materiais" className="dark:bg-zinc-900">Aluguel Materiais</option>
                  <option value="Brinquedos" className="dark:bg-zinc-900">Brinquedos</option>
                  <option value="Confeitaria" className="dark:bg-zinc-900">Confeitaria</option>
                  <option value="Outros" className="dark:bg-zinc-900">Outros</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Valor Previsto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="estimated"
                    required
                    defaultValue={editingExpense?.estimated || ''}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Valor Realizado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="actual"
                    defaultValue={editingExpense?.actual || ''}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="paid"
                    defaultChecked={editingExpense ? editingExpense.paid : false}
                    className="rounded border-zinc-300"
                  />
                  <span>Despesa já foi paga</span>
                </label>
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
                  {editingExpense ? 'Salvar Alterações' : 'Adicionar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: LOCAÇÕES E BRINQUEDOS (CRIAR / EDITAR) */}
      {/* ============================================================ */}
      {rentalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingRental ? 'Editar Item de Locação' : 'Adicionar Item de Locação'}
            </h3>
            <form onSubmit={handleSaveRental} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome do Item</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingRental?.name || ''}
                  placeholder="Ex: Cama Elástica 3,05m ou 10 Mesas Bistrô"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select
                    name="category"
                    defaultValue={editingRental?.category || 'toy'}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                  >
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
                    defaultValue={editingRental?.cost || ''}
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
                  defaultValue={editingRental?.supplier || ''}
                  placeholder="Ex: Tio Pipoca Festas - (71) 99999-0000"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Observações de Entrega/Montagem</label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={editingRental?.notes || ''}
                  placeholder="Ex: Montagem até 14h, monitor incluso"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasMonitor"
                    defaultChecked={editingRental ? editingRental.hasMonitor : false}
                    className="rounded border-zinc-300"
                  />
                  <span>Inclui monitor / operador infantil</span>
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
                  {editingRental ? 'Salvar Alterações' : 'Adicionar Locação'}
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

    </div>
  );
}
