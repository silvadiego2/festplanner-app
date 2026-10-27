'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Building,
  Cake,
  ArrowUpDown,
  BookOpen,
  GlassWater,
  Coins,
  Database,
  Upload,
  Cloud,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Info,
  Copy,
  MessageSquareQuote,
  HeartHandshake
} from 'lucide-react';

// ==============================================================================
// BANCO REGIONAL DE PREÇOS MÉDIOS DE SALVADOR - BA
// ==============================================================================
const SALVADOR_INGREDIENT_DATABASE = [
  { keywords: ['picanha'], defaultAmount: 0.18, unit: 'kg', defaultCost: 74.90, category: 'Carnes Nobres' },
  { keywords: ['file mignon', 'filé mignon'], defaultAmount: 0.18, unit: 'kg', defaultCost: 78.90, category: 'Carnes Nobres' },
  { keywords: ['alcatra', 'miolo de alcatra', 'baby beef'], defaultAmount: 0.18, unit: 'kg', defaultCost: 49.90, category: 'Carnes Bovinas' },
  { keywords: ['fraldinha', 'maminha'], defaultAmount: 0.18, unit: 'kg', defaultCost: 52.00, category: 'Carnes Bovinas' },
  { keywords: ['contra file', 'contrafilé'], defaultAmount: 0.18, unit: 'kg', defaultCost: 56.90, category: 'Carnes Bovinas' },
  { keywords: ['patinho', 'carne moida', 'carne moída'], defaultAmount: 0.15, unit: 'kg', defaultCost: 42.90, category: 'Carnes Bovinas' },
  { keywords: ['costela', 'cupim'], defaultAmount: 0.22, unit: 'kg', defaultCost: 36.90, category: 'Carnes Bovinas' },
  { keywords: ['frango', 'peito de frango', 'file de frango', 'filé de frango'], defaultAmount: 0.16, unit: 'kg', defaultCost: 22.90, category: 'Aves' },
  { keywords: ['sobrecoxa', 'coxa de frango', 'asa', 'tulipa'], defaultAmount: 0.20, unit: 'kg', defaultCost: 19.50, category: 'Aves' },
  { keywords: ['coracao', 'coração de frango'], defaultAmount: 0.08, unit: 'kg', defaultCost: 39.90, category: 'Aves' },
  { keywords: ['costelinha suina', 'costela de porco', 'costelinha'], defaultAmount: 0.18, unit: 'kg', defaultCost: 32.90, category: 'Suínos' },
  { keywords: ['pernil', 'lombo suino', 'lombo'], defaultAmount: 0.16, unit: 'kg', defaultCost: 28.50, category: 'Suínos' },
  { keywords: ['linguica', 'linguiça toscana', 'linguica cuiabana'], defaultAmount: 0.12, unit: 'kg', defaultCost: 26.90, category: 'Churrasco' },
  { keywords: ['bacon'], defaultAmount: 0.03, unit: 'kg', defaultCost: 38.00, category: 'Frios & Embutidos' },
  { keywords: ['camarao', 'camarão'], defaultAmount: 0.18, unit: 'kg', defaultCost: 65.00, category: 'Frutos do Mar' },
  { keywords: ['peixe', 'tilapia', 'robalo', 'pescada', 'salmao', 'salmão'], defaultAmount: 0.20, unit: 'kg', defaultCost: 48.00, category: 'Pescados' },
  { keywords: ['polvo', 'lula'], defaultAmount: 0.15, unit: 'kg', defaultCost: 75.00, category: 'Frutos do Mar' },
  { keywords: ['leite de coco'], defaultAmount: 0.04, unit: 'L', defaultCost: 9.50, category: 'Ingredientes Baianos' },
  { keywords: ['azeite de dende', 'dendê', 'dende'], defaultAmount: 0.015, unit: 'L', defaultCost: 18.00, category: 'Ingredientes Baianos' },
  { keywords: ['queijo coalho', 'coalho'], defaultAmount: 0.08, unit: 'kg', defaultCost: 48.90, category: 'Queijos' },
  { keywords: ['parmesao', 'parmesão'], defaultAmount: 0.03, unit: 'kg', defaultCost: 88.00, category: 'Queijos' },
  { keywords: ['mussarela', 'muçarela', 'queijo prato'], defaultAmount: 0.05, unit: 'kg', defaultCost: 44.90, category: 'Queijos' },
  { keywords: ['arroz arboreo', 'arroz arbóreo', 'arroz de risoto'], defaultAmount: 0.07, unit: 'kg', defaultCost: 22.00, category: 'Grãos' },
  { keywords: ['arroz', 'arroz branco'], defaultAmount: 0.06, unit: 'kg', defaultCost: 6.80, category: 'Grãos' },
  { keywords: ['farinha', 'farinha de mandioca', 'farinha biju', 'farofa'], defaultAmount: 0.05, unit: 'kg', defaultCost: 8.50, category: 'Acompanhamentos' },
  { keywords: ['salgado', 'coxinha', 'kibe', 'pastel', 'empada', 'quiche'], defaultAmount: 8, unit: 'un', defaultCost: 1.40, category: 'Entradas' },
  { keywords: ['bolo', 'torta'], defaultAmount: 0.10, unit: 'kg', defaultCost: 75.00, category: 'Confeitaria' },
  { keywords: ['doce', 'docinho', 'brigadeiro', 'beijinho'], defaultAmount: 4, unit: 'un', defaultCost: 2.20, category: 'Doces' }
];

const SUGGESTED_DISH_TEMPLATES = [
  {
    name: 'Churrasco Baiano: Picanha & Queijo Coalho',
    category: 'protein',
    isHot: true,
    ingredients: [
      { name: 'Picanha Bovina Resfriada', amountPerPerson: 0.18, unit: 'kg', unitCost: 74.90 },
      { name: 'Espeto de Queijo Coalho', amountPerPerson: 0.08, unit: 'kg', unitCost: 48.90 },
      { name: 'Sal Grosso com Alho e Ervas', amountPerPerson: 0.015, unit: 'kg', unitCost: 12.00 }
    ]
  },
  {
    name: 'Bobó de Camarão Cremoso com Dendê',
    category: 'protein',
    isHot: true,
    ingredients: [
      { name: 'Camarão Limpo Médio', amountPerPerson: 0.18, unit: 'kg', unitCost: 65.00 },
      { name: 'Leite de Coco Natural', amountPerPerson: 0.05, unit: 'L', unitCost: 9.50 },
      { name: 'Azeite de Dendê da Bahia', amountPerPerson: 0.015, unit: 'L', unitCost: 18.00 },
      { name: 'Mandioca / Aipim Cozido', amountPerPerson: 0.12, unit: 'kg', unitCost: 7.50 }
    ]
  },
  {
    name: 'Risoto de Filé Mignon ao Gorgonzola',
    category: 'protein',
    isHot: true,
    ingredients: [
      { name: 'Filé Mignon em Tiras', amountPerPerson: 0.15, unit: 'kg', unitCost: 78.90 },
      { name: 'Arroz Arbóreo', amountPerPerson: 0.07, unit: 'kg', unitCost: 22.00 },
      { name: 'Queijo Gorgonzola', amountPerPerson: 0.03, unit: 'kg', unitCost: 89.00 }
    ]
  },
  {
    name: 'Buffet de Mini Salgados Finos & Canapés',
    category: 'starter',
    isHot: false,
    ingredients: [
      { name: 'Mini Salgados Sortidos', amountPerPerson: 10, unit: 'un', unitCost: 1.40 }
    ]
  },
  {
    name: 'Bolo Comemorativo & Brigadeiros Gourmet',
    category: 'dessert',
    isHot: false,
    ingredients: [
      { name: 'Bolo Artesanal Recheado', amountPerPerson: 0.10, unit: 'kg', unitCost: 75.00 },
      { name: 'Docinhos Gourmet', amountPerPerson: 5, unit: 'un', unitCost: 2.20 }
    ]
  }
];

function findIngredientIntel(ingredientName) {
  if (!ingredientName || typeof ingredientName !== 'string') return null;
  const clean = ingredientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const item of SALVADOR_INGREDIENT_DATABASE) {
    for (const kw of item.keywords) {
      const cleanKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (clean.includes(cleanKw)) return item;
    }
  }
  return { defaultAmount: 0.10, unit: 'kg', defaultCost: 25.00, category: 'Outros' };
}

// DADOS INICIAIS
const INITIAL_EVENT_CONFIG = {
  celebrantName: "Mariana Souza",
  age: 30,
  theme: "Sunset Chic & Boteco Moderno",
  date: "2026-11-14",
  startTime: "16:00",
  endTime: "22:00",
  durationHours: 6,
  locationType: "rented",
  condoFee: 150,
  noiseRules: "Música ao vivo permitida até as 22h no salão.",
  venueName: "Espaço Villa Verde & Lounge",
  venueAddress: "Av. dos Coqueiros, 1420 - Itapuã, Salvador - BA",
  venueCost: 2800,
  venueDeposit: 800,
  setupStartTime: "11:00",
  teardownEndTime: "02:00",
  venueMapUrl: "https://maps.google.com",
  venueContact: "(71) 98765-4321 - Paula",
  serviceType: "buffet",
  safetyMarginPct: 15,
  materialMode: "rental",
  tableCapacity: 4,
  rentalUnitCost: 4.50,
  disposableUnitCost: 1.80,
  rechaudRentalCost: 45.00,
  fuelPasteCost: 8.00
};

const INITIAL_GUESTS = [
  { id: '1', name: 'Carlos Eduardo', group: 'Amigos Próximos', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem restrições'], declineReason: '', messageToCelebrant: 'Ansioso pela comemoração!' },
  { id: '2', name: 'Fernanda Lima', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: ['Vegetariano'], declineReason: '', messageToCelebrant: 'Parabéns adiantado!' },
  { id: '3', name: 'Lucas Lima (Filho)', group: 'Família', category: 'child_6_11', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'], declineReason: '', messageToCelebrant: '' },
  { id: '4', name: 'Rodrigo Alves', group: 'Amigos Próximos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'], declineReason: '', messageToCelebrant: '' },
  { id: '5', name: 'Juliana Pires', group: 'Amigos Próximos', category: 'adult', status: 'declined', drinksAlcohol: false, restrictions: ['Sem restrições'], declineReason: 'Viagem já agendada', messageToCelebrant: 'Mari, estarei fora da cidade nessa data mas desejo um ano maravilhoso para você! ❤️' }
];

const INITIAL_BEVERAGE_TYPES = [
  { id: 'b1', name: 'Refrigerante Cola (Coca-Cola / Zero)', category: 'soda', mlPerPersonPerHour: 90, unitCostPerLiter: 5.50, unitPackage: 'Garrafa 2L', packageVolume: 2.0 },
  { id: 'b2', name: 'Refrigerante Guaraná (Antarctica)', category: 'soda', mlPerPersonPerHour: 60, unitCostPerLiter: 5.00, unitPackage: 'Garrafa 2L', packageVolume: 2.0 },
  { id: 'b3', name: 'Suco de Uva Integral', category: 'juice', mlPerPersonPerHour: 40, unitCostPerLiter: 11.00, unitPackage: 'Garrafa 1.5L', packageVolume: 1.5 },
  { id: 'b4', name: 'Água de Coco Natural', category: 'juice', mlPerPersonPerHour: 40, unitCostPerLiter: 7.80, unitPackage: 'Garrafa 1L', packageVolume: 1.0 },
  { id: 'b5', name: 'Água Mineral sem Gás', category: 'water', mlPerPersonPerHour: 80, unitCostPerLiter: 2.20, unitPackage: 'Garrafão 5L', packageVolume: 5.0 },
  { id: 'b6', name: 'Água Mineral com Gás', category: 'water', mlPerPersonPerHour: 40, unitCostPerLiter: 3.50, unitPackage: 'Garrafa 500ml', packageVolume: 0.5 },
  { id: 'b7', name: 'Chopp Artesanal / Puro Malte', category: 'alcohol', mlPerPersonPerHour: 320, unitCostPerLiter: 14.00, unitPackage: 'Barril 50L ou Lata', packageVolume: 0.35 },
  { id: 'b8', name: 'Vinho / Espumante Brut', category: 'alcohol', mlPerPersonPerHour: 60, unitCostPerLiter: 48.00, unitPackage: 'Garrafa 750ml', packageVolume: 0.75 },
  { id: 'b9', name: 'Gelo Filtrado (Consumo)', category: 'ice', mlPerPersonPerHour: 80, unitCostPerLiter: 3.00, unitPackage: 'Saco 5kg', packageVolume: 5.0 },
  { id: 'b10', name: 'Gelo em Cubos/Barra (Tina)', category: 'ice', mlPerPersonPerHour: 100, unitCostPerLiter: 2.20, unitPackage: 'Saco 10kg', packageVolume: 10.0 }
];

const INITIAL_RENTALS = [
  { id: '1', name: 'Salão Villa Verde & Lounge', category: 'venue', cost: 2800, supplier: 'Espaço Villa Verde', notes: 'Incluso limpeza pós-evento' },
  { id: '2', name: 'Cama Elástica 3,05m', category: 'toy', cost: 350, supplier: 'Tio Pipoca Festas', hasMonitor: true, notes: 'Montagem 1h antes' },
  { id: '3', name: '10 Jogos de Mesas e Cadeiras Bistrô', category: 'furniture', cost: 250, supplier: 'LocMóveis Eventos', notes: 'Madeira maciça' }
];

const INITIAL_MANUAL_EXPENSES = [
  { id: 'm-1', description: 'Decoração Floral & Painel', category: 'Decoração', estimated: 1200, actual: 1200, paid: true },
  { id: 'm-2', description: 'Sonorização & DJ de Sunset', category: 'Atração / Som', estimated: 900, actual: 850, paid: true },
  { id: 'm-3', description: 'Garçom de Apoio (2 profissionais)', category: 'Mão de Obra', estimated: 500, actual: 500, paid: false }
];

const INITIAL_CHECKLIST = [
  { id: '1', title: 'Definir tema e data oficial', period: '45 dias antes', completed: true },
  { id: '2', title: 'Reservar local ou salão de festas', period: '45 dias antes', completed: true },
  { id: '3', title: 'Contratar brinquedos e monitores', period: '20 dias antes', completed: true },
  { id: '4', title: 'Disparar convites e link de RSVP', period: '20 dias antes', completed: true },
  { id: '5', title: 'Confirmar entrega de gelo filtrado e carnes', period: '3 dias antes', completed: false }
];

const PRESET_GROUPS = [
  'Família',
  'Amigos Próximos',
  'Trabalho / Colegas',
  'Esposa / Marido / Cônjuge',
  'Acompanhante / Namorado(a)',
  'Vizinhos'
];

const PRESET_RESTRICTIONS = [
  'Sem restrições',
  'Vegetariano',
  'Vegano',
  'Sem glúten',
  'Sem lactose',
  'Sem frutos do mar',
  'Não come carne vermelha'
];

export default function App() {
  const [mounted, setMounted] = useState(false);

  // States principais
  const [config, setConfig] = useState(INITIAL_EVENT_CONFIG);
  const [menu, setMenu] = useState(SUGGESTED_DISH_TEMPLATES);
  const [beverages, setBeverages] = useState(INITIAL_BEVERAGE_TYPES);
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [rentals, setRentals] = useState(INITIAL_RENTALS);
  const [manualExpenses, setManualExpenses] = useState(INITIAL_MANUAL_EXPENSES);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  // Navegação
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cateringSubTab, setCateringSubTab] = useState('menu');
  const [structureSubTab, setStructureSubTab] = useState('rentals');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventEditModalOpen, setEventEditModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Status de Sincronização
  const [cloudSyncStatus, setCloudSyncStatus] = useState('syncing');
  const isInitialLoadDone = useRef(false);

  // Ordenação
  const [guestSortField, setGuestSortField] = useState('name');
  const [guestSortAsc, setGuestSortAsc] = useState(true);

  // Modais
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [selectedRestrictions, setSelectedRestrictions] = useState(['Sem restrições']);

  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editingIngredients, setEditingIngredients] = useState([]);

  const [beverageModalOpen, setBeverageModalOpen] = useState(false);
  const [editingBeverage, setEditingBeverage] = useState(null);

  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [rsvpSimModalOpen, setRsvpSimModalOpen] = useState(false);
  const [guestMessageModalOpen, setGuestMessageModalOpen] = useState(false);
  const [viewingGuestMessage, setViewingGuestMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carrega do Postgres ou fallback
  useEffect(() => {
    async function loadData() {
      try {
        setCloudSyncStatus('syncing');
        const res = await fetch('/api/event');
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          if (d.config) setConfig(d.config);
          if (d.guests) setGuests(d.guests);
          if (d.menu) setMenu(d.menu);
          if (d.beverages) setBeverages(d.beverages);
          if (d.rentals) setRentals(d.rentals);
          if (d.manualExpenses) setManualExpenses(d.manualExpenses);
          if (d.checklist) setChecklist(d.checklist);
          setCloudSyncStatus('synced');
          isInitialLoadDone.current = true;
          setMounted(true);
          return;
        }
      } catch (err) {
        console.warn('Postgres fetch fallback:', err);
      }

      // Fallback local
      try {
        const savedGuests = localStorage.getItem('festplanner_guests_v3');
        if (savedGuests) setGuests(JSON.parse(savedGuests));
      } catch (_) {}

      setCloudSyncStatus('offline');
      isInitialLoadDone.current = true;
      setMounted(true);
    }

    loadData();
  }, []);

  // Auto-save no Postgres
  useEffect(() => {
    if (!mounted || !isInitialLoadDone.current) return;

    try {
      localStorage.setItem('festplanner_guests_v3', JSON.stringify(guests));
      localStorage.setItem('festplanner_config_v3', JSON.stringify(config));
    } catch (_) {}

    const timeout = setTimeout(async () => {
      setCloudSyncStatus('saving');
      try {
        const payload = { config, guests, menu, beverages, rentals, manualExpenses, checklist };
        const res = await fetch('/api/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) {
          setCloudSyncStatus('synced');
        } else {
          setCloudSyncStatus('offline');
        }
      } catch (e) {
        setCloudSyncStatus('offline');
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [config, guests, menu, beverages, rentals, manualExpenses, checklist, mounted]);

  // Estatísticas
  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const confirmedList = guests.filter(g => g.status === 'confirmed');
    const pendingList = guests.filter(g => g.status === 'pending');
    const declinedList = guests.filter(g => g.status === 'declined');

    const confirmedAdults = confirmedList.filter(g => g.category === 'adult').length;
    const confirmedKids611 = confirmedList.filter(g => g.category === 'child_6_11').length;
    const confirmedKids05 = confirmedList.filter(g => g.category === 'child_0_5').length;
    const confirmedEaters = confirmedAdults + (confirmedKids611 * 0.5);
    const confirmedDrinkers = confirmedList.filter(g => g.category === 'adult' && g.drinksAlcohol).length;

    const allAdults = guests.filter(g => g.category === 'adult').length;
    const allKids611 = guests.filter(g => g.category === 'child_6_11').length;
    const allPotentialEaters = allAdults + (allKids611 * 0.5);
    const allPotentialDrinkers = guests.filter(g => g.category === 'adult' && g.drinksAlcohol).length;

    const hotDishesCount = menu.filter(item => item.isHot).length;
    const completedChecklist = checklist.filter(c => c.completed).length;
    const checklistProgress = checklist.length > 0 ? Math.round((completedChecklist / checklist.length) * 100) : 0;

    let daysUntilEvent = 0;
    try {
      const eventDate = new Date(config.date + 'T00:00:00Z');
      const today = new Date();
      const diffTime = eventDate.getTime() - today.getTime();
      daysUntilEvent = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (_) {}

    return {
      totalGuests,
      confirmedCount: confirmedList.length,
      pendingCount: pendingList.length,
      declinedCount: declinedList.length,
      confirmedAdults,
      confirmedKids611,
      confirmedKids05,
      confirmedEaters,
      confirmedDrinkers,
      allPotentialEaters,
      allPotentialDrinkers,
      hotDishesCount,
      completedChecklist,
      checklistProgress,
      daysUntilEvent
    };
  }, [guests, menu, checklist, config.date]);

  // Cálculos do Cardápio
  const calculatedMenu = useMemo(() => {
    let totalCostConfirmed = 0;
    let totalCostAll = 0;

    const itemsDetailed = menu.map(item => {
      let itemCostConfirmed = 0;
      let itemCostAll = 0;

      const detailedIngredients = (item.ingredients || []).map(ing => {
        const qtyConfirmed = Number((ing.amountPerPerson * stats.confirmedEaters).toFixed(2));
        const costConfirmed = Number((qtyConfirmed * ing.unitCost).toFixed(2));

        const qtyAll = Number((ing.amountPerPerson * stats.allPotentialEaters).toFixed(2));
        const costAll = Number((qtyAll * ing.unitCost).toFixed(2));

        itemCostConfirmed += costConfirmed;
        itemCostAll += costAll;

        return { ...ing, qtyConfirmed, costConfirmed, qtyAll, costAll };
      });

      totalCostConfirmed += itemCostConfirmed;
      totalCostAll += itemCostAll;

      return { ...item, ingredients: detailedIngredients, itemCostConfirmed, itemCostAll };
    });

    return { itemsDetailed, totalCostConfirmed: Math.round(totalCostConfirmed), totalCostAll: Math.round(totalCostAll) };
  }, [menu, stats.confirmedEaters, stats.allPotentialEaters]);

  // Cálculos de Bebidas
  const calculatedBeverages = useMemo(() => {
    const hours = Number(config.durationHours) || 5;
    let totalBeveragesCostConfirmed = 0;
    let totalBeveragesCostAll = 0;

    const list = beverages.map(bev => {
      const isAlcohol = bev.category === 'alcohol';
      const headcountConfirmed = isAlcohol ? stats.confirmedDrinkers : stats.confirmedCount;
      const headcountAll = isAlcohol ? stats.allPotentialDrinkers : stats.totalGuests;

      const totalLitersConfirmed = Number(((bev.mlPerPersonPerHour * headcountConfirmed * hours) / 1000).toFixed(1));
      const totalCostConfirmed = Number((totalLitersConfirmed * bev.unitCostPerLiter).toFixed(2));

      const totalLitersAll = Number(((bev.mlPerPersonPerHour * headcountAll * hours) / 1000).toFixed(1));
      const totalCostAll = Number((totalLitersAll * bev.unitCostPerLiter).toFixed(2));

      const packagesConfirmed = Math.ceil(totalLitersConfirmed / (bev.packageVolume || 1));
      const packagesAll = Math.ceil(totalLitersAll / (bev.packageVolume || 1));

      totalBeveragesCostConfirmed += totalCostConfirmed;
      totalBeveragesCostAll += totalCostAll;

      return { ...bev, totalLitersConfirmed, totalCostConfirmed, packagesConfirmed, totalLitersAll, totalCostAll, packagesAll };
    });

    return { list, totalCostConfirmed: Math.round(totalBeveragesCostConfirmed), totalCostAll: Math.round(totalBeveragesCostAll) };
  }, [beverages, config.durationHours, stats.confirmedCount, stats.confirmedDrinkers, stats.totalGuests, stats.allPotentialDrinkers]);

  // Cálculos de Louças & Estrutura
  const calculatedMaterials = useMemo(() => {
    const confirmed = stats.confirmedCount;
    const all = stats.totalGuests;
    const safety = 1 + ((Number(config.safetyMarginPct) || 15) / 100);

    const mainPlates = Math.ceil(confirmed * 1.25 * safety);
    const dessertPlates = Math.ceil(confirmed * 1.35 * safety);
    const forksAndKnives = Math.ceil(confirmed * 1.3 * safety);
    const waterGlasses = Math.ceil(confirmed * 1.5 * safety);
    const beerTulips = Math.ceil(stats.confirmedDrinkers * 2 * safety);

    const rechauds = Math.max(1, stats.hotDishesCount);
    const durationHours = Number(config.durationHours) || 5;
    const fuelPastesNeeded = Math.ceil(rechauds * (durationHours / 2.5));

    const capacity = Number(config.tableCapacity) || 4;
    const guestTablesNeeded = Math.ceil(confirmed / capacity);
    const guestChairsNeeded = guestTablesNeeded * capacity;

    const unitMaterialCost = config.materialMode === 'rental'
      ? (Number(config.rentalUnitCost) || 4.50)
      : (Number(config.disposableUnitCost) || 1.80);

    const rechaudUnitCost = Number(config.rechaudRentalCost) || 45.00;
    const pasteUnitCost = Number(config.fuelPasteCost) || 8.00;

    const equipmentBaseCost = (rechauds * rechaudUnitCost) + (fuelPastesNeeded * pasteUnitCost);
    const tablewareCostConfirmed = Math.round((confirmed * unitMaterialCost) + equipmentBaseCost);
    const tablewareCostAll = Math.round((all * unitMaterialCost) + equipmentBaseCost);

    return {
      mainPlates,
      dessertPlates,
      forksAndKnives,
      waterGlasses,
      beerTulips,
      rechauds,
      fuelPastesNeeded,
      guestTablesNeeded,
      guestChairsNeeded,
      tablewareCostConfirmed,
      tablewareCostAll
    };
  }, [stats.confirmedCount, stats.totalGuests, stats.confirmedDrinkers, stats.hotDishesCount, config.safetyMarginPct, config.durationHours, config.tableCapacity, config.materialMode, config.rentalUnitCost, config.disposableUnitCost, config.rechaudRentalCost, config.fuelPasteCost]);

  // Orçamento Consolidado
  const budget = useMemo(() => {
    const rentalsCost = rentals.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    const foodCostConfirmed = calculatedMenu.totalCostConfirmed;
    const foodCostAll = calculatedMenu.totalCostAll;
    const beveragesCostConfirmed = calculatedBeverages.totalCostConfirmed;
    const beveragesCostAll = calculatedBeverages.totalCostAll;
    const tablewareCostConfirmed = calculatedMaterials.tablewareCostConfirmed;
    const tablewareCostAll = calculatedMaterials.tablewareCostAll;

    const manualTotalActual = manualExpenses.reduce((acc, curr) => acc + (Number(curr.actual) || Number(curr.estimated) || 0), 0);
    const manualTotalEstimated = manualExpenses.reduce((acc, curr) => acc + (Number(curr.estimated) || 0), 0);

    const grandTotalConfirmed = rentalsCost + foodCostConfirmed + beveragesCostConfirmed + tablewareCostConfirmed + manualTotalActual;
    const grandTotalAll = rentalsCost + foodCostAll + beveragesCostAll + tablewareCostAll + manualTotalEstimated;
    const rsvpSavings = Math.max(0, grandTotalAll - grandTotalConfirmed);
    const costPerConfirmed = stats.confirmedCount > 0 ? (grandTotalConfirmed / stats.confirmedCount) : 0;

    return {
      rentalsCost,
      foodCostConfirmed,
      beveragesCostConfirmed,
      tablewareCostConfirmed,
      manualTotalActual,
      grandTotalConfirmed,
      grandTotalAll,
      rsvpSavings,
      costPerConfirmed
    };
  }, [rentals, calculatedMenu, calculatedBeverages, calculatedMaterials, manualExpenses, stats.confirmedCount]);

  // Ordenação de Convidados
  const sortedGuests = useMemo(() => {
    return [...guests].sort((a, b) => {
      let valA = a[guestSortField] || '';
      let valB = b[guestSortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return guestSortAsc ? -1 : 1;
      if (valA > valB) return guestSortAsc ? 1 : -1;
      return 0;
    });
  }, [guests, guestSortField, guestSortAsc]);

  const handleSortGuests = (field) => {
    if (guestSortField === field) {
      setGuestSortAsc(!guestSortAsc);
    } else {
      setGuestSortField(field);
      setGuestSortAsc(true);
    }
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
    const customRestriction = form.customRestriction.value.trim();

    let finalRestrictions = selectedRestrictions.filter(r => r !== 'Sem restrições');
    if (customRestriction) finalRestrictions.push(customRestriction);
    if (finalRestrictions.length === 0) finalRestrictions = ['Sem restrições'];

    if (editingGuest) {
      setGuests(guests.map(g => g.id === editingGuest.id ? { ...g, name, group, category, status, drinksAlcohol, restrictions: finalRestrictions } : g));
      showToast('Convidado atualizado!');
    } else {
      const newGuest = { id: Date.now().toString(), name, group, category, status, drinksAlcohol, restrictions: finalRestrictions, declineReason: '', messageToCelebrant: '' };
      setGuests([...guests, newGuest]);
      showToast('Convidado adicionado!');
    }

    setGuestModalOpen(false);
    setEditingGuest(null);
  };

  const handleOpenGuestModal = (guest = null) => {
    setEditingGuest(guest);
    if (guest && Array.isArray(guest.restrictions)) {
      setSelectedRestrictions(guest.restrictions);
    } else {
      setSelectedRestrictions(['Sem restrições']);
    }
    setGuestModalOpen(true);
  };

  const handleDeleteGuest = (id) => {
    setGuests(guests.filter(g => g.id !== id));
    showToast('Convidado removido.');
  };

  // Mensagem pronta para o WhatsApp
  const handleCopyWhatsAppInvite = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://seu-app.vercel.app';
    const link = `${origin}/rsvp`;
    const text = `🎉 *CONVITE ESPECIAL: ANIVERSÁRIO DE ${config.celebrantName.toUpperCase()}!* 🎂✨\n\nOlá! Gostaria muito de celebrar esse momento tão especial com você!\n\n📅 *Data:* ${config.date ? new Date(config.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' }) : 'A definir'}\n⏰ *Horário:* Das ${config.startTime} às ${config.endTime}\n📍 *Local:* ${config.venueName} (${config.venueAddress})\n\n👉 *Por favor, confirme sua presença (ou nos avise caso não possa ir) pelo link abaixo:*\n🔗 ${link}\n\nEsperamos você! 🥳`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Mensagem para WhatsApp copiada com sucesso!');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Cake className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Carregando FestPlanner Pro...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: Sparkles },
    { id: 'guests', label: 'Convidados & RSVP', icon: Users, badge: stats.confirmedCount },
    { id: 'catering_hub', label: 'Gastronomia & Bar', icon: Utensils, subtext: 'Cardápio, Bebidas e Gelo' },
    { id: 'structure_hub', label: 'Estrutura & Locações', icon: Building, subtext: 'Brinquedos, Louças e Mesas' },
    { id: 'finance', label: 'Centro de Custos', icon: DollarSign, badge: `R$ ${budget.grandTotalConfirmed >= 1000 ? `${(budget.grandTotalConfirmed/1000).toFixed(1)}k` : budget.grandTotalConfirmed}` },
    { id: 'checklist', label: 'Linha do Tempo', icon: CheckSquare, badge: `${stats.checklistProgress}%` },
    { id: 'config', label: 'Configurações', icon: SlidersHorizontal },
  ];

  return (
    <div className={`min-h-screen font-sans antialiased flex ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2.5 rounded-xl shadow-xl border border-zinc-800 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SIDEBAR LATERAL FIXA */}
      {/* ============================================================ */}
      <aside className={`hidden lg:flex w-72 flex-col justify-between border-r shrink-0 sticky top-0 h-screen p-5 backdrop-blur-md z-40 ${
        darkMode ? 'bg-zinc-950/95 border-zinc-800/80' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Cake className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight">FestPlanner</span>
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-[170px]">
                {config.celebrantName || 'Aniversário'}
              </p>
            </div>
          </div>

          {/* Programação Rápida */}
          <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" /> Programação
              </span>
              <button
                onClick={() => setEventEditModalOpen(true)}
                className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <Edit2 className="w-2.5 h-2.5" /> Editar
              </button>
            </div>
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {config.date ? new Date(config.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' }) : 'Data a definir'}
            </p>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1">
              <span>{config.startTime} às {config.endTime}</span>
              <span className="px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 font-medium text-[10px] text-zinc-700 dark:text-zinc-300">
                {config.durationHours} horas
              </span>
            </div>
          </div>

          {/* Navegação */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-zinc-400'}`} />
                    <span className="block leading-none">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-zinc-200 dark:bg-zinc-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Sidebar */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <button
            onClick={() => setRsvpSimModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar Convite Digital</span>
          </button>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
              <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'synced' ? 'text-emerald-500' : 'text-zinc-400'}`} />
              {cloudSyncStatus === 'synced' ? 'Postgres Conectado' : 'Gravando...'}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* CORPO PRINCIPAL */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className={`border-b sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 ${
          darkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-zinc-200'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm">{config.celebrantName || 'Meu Evento'}</span>
            <span className="text-xs text-zinc-400 hidden sm:inline">•</span>
            <button
              onClick={() => setEventEditModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{config.startTime} às {config.endTime} ({config.durationHours}h)</span>
              <Edit2 className="w-2.5 h-2.5 text-zinc-400 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRsvpSimModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Link do Convite</span>
            </button>

            <button
              onClick={() => handleOpenGuestModal(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Convidado</span>
            </button>
          </div>
        </header>

        {/* Conteúdo das Abas */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/50">
                      {stats.daysUntilEvent > 0 ? `Faltam ${stats.daysUntilEvent} dias para a festa` : 'É hoje!'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
                      Aniversário de {config.celebrantName} ({config.age} anos)
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {config.venueName} • {config.venueAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm hover:bg-emerald-500"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Convite WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Cards de Indicadores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <span className="text-xs text-zinc-500">Presença Confirmada</span>
                  <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {stats.confirmedCount} <span className="text-xs text-zinc-400 font-normal">de {stats.totalGuests}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-500 flex justify-between">
                    <span>{stats.confirmedAdults} adultos</span>
                    <span>•</span>
                    <span>{stats.confirmedKids611 + stats.confirmedKids05} crianças</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <span className="text-xs text-zinc-500">Não Poderão Ir (Ausentes)</span>
                  <div className="mt-2 text-2xl font-bold text-rose-500">
                    {stats.declinedCount}
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400">
                    {stats.pendingCount} convites pendentes
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <span className="text-xs text-zinc-500">Custo Total (Confirmados)</span>
                  <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {budget.grandTotalConfirmed.toLocaleString('pt-BR')}
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-500">
                    R$ {Math.round(budget.costPerConfirmed)} / pessoa confirmada
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <span className="text-xs text-zinc-500">Economia Obtida (RSVP)</span>
                  <div className="mt-2 text-2xl font-bold text-amber-500">
                    R$ {budget.rsvpSavings.toLocaleString('pt-BR')}
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400">
                    Se todos fossem: R$ {budget.grandTotalAll.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CONVIDADOS & RSVP COM AUSÊNCIAS E RECADOS */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-base font-bold tracking-tight">Lista de Convidados & Confirmações</h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      {stats.confirmedCount} confirmados, {stats.pendingCount} aguardando resposta e {stats.declinedCount} não poderão ir
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleOpenGuestModal(null)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    >
                      + Novo Convidado
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                      <tr>
                        <th onClick={() => handleSortGuests('name')} className="pb-2.5 font-medium cursor-pointer">
                          Nome
                        </th>
                        <th className="pb-2.5 font-medium">Grupo</th>
                        <th className="pb-2.5 font-medium">Faixa Etária</th>
                        <th className="pb-2.5 font-medium">Status RSVP</th>
                        <th className="pb-2.5 font-medium">Restrições Alimentares</th>
                        <th className="pb-2.5 font-medium">Recado / Motivo</th>
                        <th className="pb-2.5 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {sortedGuests.map(guest => (
                        <tr key={guest.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                          <td className="py-3 font-semibold">{guest.name}</td>
                          <td className="py-3 text-zinc-500">{guest.group || 'Geral'}</td>
                          <td className="py-3 text-zinc-500">
                            {guest.category === 'adult' ? 'Adulto' : guest.category === 'child_6_11' ? 'Criança (6-11)' : 'Criança (0-5)'}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              guest.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200'
                                : guest.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200'
                            }`}>
                              {guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'pending' ? 'Pendente' : 'Não poderá ir (Ausente)'}
                            </span>
                          </td>
                          <td className="py-3 text-zinc-500">
                            {Array.isArray(guest.restrictions) ? guest.restrictions.join(', ') : 'Sem restrições'}
                          </td>
                          <td className="py-3">
                            {guest.messageToCelebrant || guest.declineReason ? (
                              <button
                                onClick={() => {
                                  setViewingGuestMessage(guest);
                                  setGuestMessageModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 border border-transparent"
                              >
                                <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Ver recado</span>
                              </button>
                            ) : (
                              <span className="text-zinc-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenGuestModal(guest)}
                                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="p-1 rounded text-zinc-400 hover:text-rose-600"
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

          {/* TAB 3: GASTRONOMIA & BAR */}
          {activeTab === 'catering_hub' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <button
                  onClick={() => setCateringSubTab('menu')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${cateringSubTab === 'menu' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500'}`}
                >
                  Cardápio & Receitas Salvador
                </button>
                <button
                  onClick={() => setCateringSubTab('beverages')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${cateringSubTab === 'beverages' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500'}`}
                >
                  Bebidas & Gelo
                </button>
              </div>

              {cateringSubTab === 'menu' && (
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <h3 className="text-base font-bold mb-4">Pratos Sugeridos & Preços Médios de Salvador</h3>
                  <div className="space-y-4">
                    {calculatedMenu.itemsDetailed.map(item => (
                      <div key={item.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                        <div className="flex justify-between items-center mb-2">
                          <strong className="text-sm font-semibold">{item.name}</strong>
                          <span className="text-xs font-bold text-emerald-600">R$ {item.itemCostConfirmed.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="text-xs text-zinc-500 space-y-1">
                          {item.ingredients.map((ing, i) => (
                            <div key={i} className="flex justify-between">
                              <span>- {ing.name} ({ing.amountPerPerson} {ing.unit}/pessoa)</span>
                              <span>{ing.qtyConfirmed} {ing.unit} = R$ {ing.costConfirmed.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cateringSubTab === 'beverages' && (
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <h3 className="text-base font-bold mb-4">Discriminação de Bebidas & Gelo</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                          <th className="pb-2">Bebida</th>
                          <th className="pb-2">Consumo</th>
                          <th className="pb-2">Volume Total</th>
                          <th className="pb-2">Embalagens</th>
                          <th className="pb-2 text-right">Custo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {calculatedBeverages.list.map(bev => (
                          <tr key={bev.id}>
                            <td className="py-2.5 font-medium">{bev.name}</td>
                            <td className="py-2.5 text-zinc-500">{bev.mlPerPersonPerHour} ml/h</td>
                            <td className="py-2.5 font-bold">{bev.totalLitersConfirmed} L</td>
                            <td className="py-2.5 text-zinc-500">~{bev.packagesConfirmed} {bev.unitPackage}</td>
                            <td className="py-2.5 text-right font-bold">R$ {bev.totalCostConfirmed.toLocaleString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ESTRUTURA & LOCAÇÕES */}
          {activeTab === 'structure_hub' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <button
                  onClick={() => setStructureSubTab('rentals')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${structureSubTab === 'rentals' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500'}`}
                >
                  Locações de Brinquedos & Espaço
                </button>
                <button
                  onClick={() => setStructureSubTab('tableware')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${structureSubTab === 'tableware' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500'}`}
                >
                  Calculadora de Louças, Rechauds & Mesas
                </button>
              </div>

              {structureSubTab === 'rentals' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rentals.map(rental => (
                    <div key={rental.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <span className="text-[10px] uppercase text-zinc-400 font-semibold">{rental.category}</span>
                      <h4 className="font-bold text-sm mt-1">{rental.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{rental.supplier}</p>
                      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                        <span>{rental.hasMonitor ? 'Monitor incluso' : 'Sem monitor'}</span>
                        <strong className="font-bold text-sm">R$ {Number(rental.cost).toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {structureSubTab === 'tableware' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                    <strong className="block font-bold mb-2">Pratos & Talheres</strong>
                    <div className="flex justify-between"><span>Pratos Refeição:</span><strong>{calculatedMaterials.mainPlates} un</strong></div>
                    <div className="flex justify-between"><span>Pratos Sobremesa:</span><strong>{calculatedMaterials.dessertPlates} un</strong></div>
                    <div className="flex justify-between"><span>Talheres:</span><strong>{calculatedMaterials.forksAndKnives} pares</strong></div>
                  </div>
                  <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                    <strong className="block font-bold mb-2">Copos & Taças</strong>
                    <div className="flex justify-between"><span>Copos de Água:</span><strong>{calculatedMaterials.waterGlasses} un</strong></div>
                    <div className="flex justify-between"><span>Tulipas Chopp:</span><strong>{calculatedMaterials.beerTulips} un</strong></div>
                  </div>
                  <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                    <strong className="block font-bold mb-2">Rechauds & Mesas</strong>
                    <div className="flex justify-between"><span>Rechauds Inox:</span><strong>{calculatedMaterials.rechauds} cubas</strong></div>
                    <div className="flex justify-between"><span>Pastilhas Álcool Gel:</span><strong>{calculatedMaterials.fuelPastesNeeded} un</strong></div>
                    <div className="flex justify-between"><span>Mesas ({config.tableCapacity} lug.):</span><strong>{calculatedMaterials.guestTablesNeeded} jogos</strong></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CENTRO DE CUSTOS */}
          {activeTab === 'finance' && (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'} space-y-4`}>
              <h2 className="text-base font-bold">Centro de Custos Integrado</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">Buffet (Receitas)</span>
                  <strong className="text-sm font-bold text-emerald-600">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">Bebidas & Gelo</span>
                  <strong className="text-sm font-bold text-amber-500">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">Locações & Espaço</span>
                  <strong className="text-sm font-bold">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">Louças & Estrutura</span>
                  <strong className="text-sm font-bold">R$ {budget.tablewareCostConfirmed.toLocaleString('pt-BR')}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LINHA DO TEMPO */}
          {activeTab === 'checklist' && (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'} space-y-3`}>
              <h2 className="text-base font-bold">Linha do Tempo</h2>
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => setChecklist(checklist.map(c => c.id === item.id ? { ...c, completed: !c.completed } : c))}
                  className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300'}`}>
                      {item.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span className={item.completed ? 'line-through text-zinc-400' : 'font-medium'}>{item.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{item.period}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: CONFIGURAÇÕES */}
          {activeTab === 'config' && (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'} space-y-4 text-xs`}>
              <h2 className="text-base font-bold">Parâmetros do Evento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Nome do Aniversariante</label>
                  <input
                    type="text"
                    value={config.celebrantName}
                    onChange={(e) => setConfig({ ...config, celebrantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Idade Comemorada</label>
                  <input
                    type="number"
                    value={config.age}
                    onChange={(e) => setConfig({ ...config, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: MODAL DE RECADO DO CONVIDADO */}
      {/* ============================================================ */}
      {guestMessageModalOpen && viewingGuestMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm">{viewingGuestMessage.name}</h3>
                <span className="text-[10px] text-zinc-400">{viewingGuestMessage.group}</span>
              </div>
              <button onClick={() => setGuestMessageModalOpen(false)} className="text-zinc-400">✕</button>
            </div>

            {viewingGuestMessage.status === 'declined' && viewingGuestMessage.declineReason && (
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs">
                <span className="text-[10px] text-rose-300 uppercase font-semibold block mb-0.5">Motivo informado:</span>
                <p className="text-rose-200">{viewingGuestMessage.declineReason}</p>
              </div>
            )}

            {viewingGuestMessage.messageToCelebrant && (
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block mb-1 flex items-center gap-1">
                  <MessageSquareQuote className="w-3.5 h-3.5" /> Recado para o aniversariante:
                </span>
                <p className="text-zinc-200 italic">"{viewingGuestMessage.messageToCelebrant}"</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setGuestMessageModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: LINK DE RSVP E TEXTO PRONTO PARA WHATSAPP */}
      {/* ============================================================ */}
      {rsvpSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4">
            <h3 className="font-bold text-sm">Convite Digital & Link de RSVP</h3>
            <p className="text-xs text-zinc-400">
              Copie a mensagem formatada para WhatsApp ou envie o link direto com QR Code para seus convidados:
            </p>

            {(() => {
              const currentUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/rsvp`
                : 'https://seu-app.vercel.app/rsvp';

              return (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-[11px] font-mono break-all text-emerald-400 select-all">
                    {currentUrl}
                  </div>

                  <div className="flex justify-center p-3 bg-white rounded-2xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(currentUrl)}`}
                      alt="QR Code do Convite"
                      className="w-28 h-28"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar Texto P/ WhatsApp</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(currentUrl);
                            showToast('Link copiado!');
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold"
                      >
                        Copiar Apenas o Link
                      </button>
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl border border-zinc-700 text-xs font-semibold flex items-center justify-center"
                      >
                        Testar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setRsvpSimModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: EDIÇÃO DE HORÁRIO */}
      {/* ============================================================ */}
      {eventEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4 text-xs">
            <h3 className="font-bold text-sm">Editar Horário e Programação</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const startTime = form.startTime.value;
              const endTime = form.endTime.value;
              const date = form.date.value;

              let duration = 6;
              try {
                const [sH, sM] = startTime.split(':').map(Number);
                const [eH, eM] = endTime.split(':').map(Number);
                let diff = (eH + eM/60) - (sH + sM/60);
                if (diff <= 0) diff += 24;
                duration = Math.round(diff * 10) / 10;
              } catch (_) {}

              setConfig({ ...config, date, startTime, endTime, durationHours: duration });
              setEventEditModalOpen(false);
              showToast(`Horário atualizado para ${startTime} às ${endTime} (${duration}h)!`);
            }} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Data da Festa</label>
                <input type="date" name="date" defaultValue={config.date} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Início</label>
                  <input type="time" name="startTime" defaultValue={config.startTime} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Término</label>
                  <input type="time" name="endTime" defaultValue={config.endTime} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setEventEditModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar Horário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CONVIDADO */}
      {/* ============================================================ */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-3 text-xs">
            <h3 className="font-bold text-sm">{editingGuest ? 'Editar Convidado' : 'Novo Convidado'}</h3>
            <form onSubmit={handleSaveGuest} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Nome Completo</label>
                <input type="text" name="name" defaultValue={editingGuest?.name || ''} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Grupo</label>
                  <select name="group" defaultValue={editingGuest?.group || 'Família'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    {PRESET_GROUPS.map((g, i) => <option key={i} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Faixa Etária</label>
                  <select name="category" defaultValue={editingGuest?.category || 'adult'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    <option value="adult">Adulto</option>
                    <option value="child_6_11">Criança (6-11 anos)</option>
                    <option value="child_0_5">Criança (0-5 anos)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Status RSVP</label>
                  <select name="status" defaultValue={editingGuest?.status || 'pending'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    <option value="confirmed">Confirmado</option>
                    <option value="pending">Pendente</option>
                    <option value="declined">Não poderá ir (Ausente)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="drinksAlcohol" defaultChecked={editingGuest ? editingGuest.drinksAlcohol : true} className="rounded" />
                    <span>Consome Álcool</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Outra Restrição</label>
                <input type="text" name="customRestriction" placeholder="Ex: Alergia a frutos do mar" className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setGuestModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
