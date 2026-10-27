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
  Sparkle,
  SlidersHorizontal,
  Info
} from 'lucide-react';

// ==============================================================================
// 1. BANCO DE DADOS REGIONAL DE PREÇOS MÉDIOS DE SALVADOR - BA (ATACADO & VAREJO)
// E MATRIZ DE CONSUMO TÉCNICO POR PESSOA (GRAMATURA E ML)
// ==============================================================================
const SALVADOR_INGREDIENT_DATABASE = [
  // Carnes Bovinas Nobres & Churrasco
  { keywords: ['picanha'], defaultAmount: 0.18, unit: 'kg', defaultCost: 74.90, category: 'Carnes Nobres' },
  { keywords: ['file mignon', 'filé mignon'], defaultAmount: 0.18, unit: 'kg', defaultCost: 78.90, category: 'Carnes Nobres' },
  { keywords: ['alcatra', 'miolo de alcatra', 'baby beef'], defaultAmount: 0.18, unit: 'kg', defaultCost: 49.90, category: 'Carnes Bovinas' },
  { keywords: ['fraldinha', 'maminha'], defaultAmount: 0.18, unit: 'kg', defaultCost: 52.00, category: 'Carnes Bovinas' },
  { keywords: ['contra file', 'contrafilé'], defaultAmount: 0.18, unit: 'kg', defaultCost: 56.90, category: 'Carnes Bovinas' },
  { keywords: ['patinho', 'carne moida', 'carne moída'], defaultAmount: 0.15, unit: 'kg', defaultCost: 42.90, category: 'Carnes Bovinas' },
  { keywords: ['costela', 'cupim'], defaultAmount: 0.22, unit: 'kg', defaultCost: 36.90, category: 'Carnes Bovinas' },

  // Aves e Suínos
  { keywords: ['frango', 'peito de frango', 'file de frango', 'filé de frango'], defaultAmount: 0.16, unit: 'kg', defaultCost: 22.90, category: 'Aves' },
  { keywords: ['sobrecoxa', 'coxa de frango', 'asa', 'tulipa'], defaultAmount: 0.20, unit: 'kg', defaultCost: 19.50, category: 'Aves' },
  { keywords: ['coracao', 'coração de frango'], defaultAmount: 0.08, unit: 'kg', defaultCost: 39.90, category: 'Aves' },
  { keywords: ['costelinha suina', 'costela de porco', 'costelinha'], defaultAmount: 0.18, unit: 'kg', defaultCost: 32.90, category: 'Suínos' },
  { keywords: ['pernil', 'lombo suino', 'lombo'], defaultAmount: 0.16, unit: 'kg', defaultCost: 28.50, category: 'Suínos' },
  { keywords: ['linguica', 'linguiça toscana', 'linguica cuiabana'], defaultAmount: 0.12, unit: 'kg', defaultCost: 26.90, category: 'Churrasco' },
  { keywords: ['bacon'], defaultAmount: 0.03, unit: 'kg', defaultCost: 38.00, category: 'Frios & Embutidos' },

  // Frutos do Mar & Peixes (Culinária Baiana)
  { keywords: ['camarao', 'camarão'], defaultAmount: 0.18, unit: 'kg', defaultCost: 65.00, category: 'Frutos do Mar' },
  { keywords: ['peixe', 'tilapia', 'robalo', 'pescada', 'salmao', 'salmão'], defaultAmount: 0.20, unit: 'kg', defaultCost: 48.00, category: 'Pescados' },
  { keywords: ['polvo', 'lula'], defaultAmount: 0.15, unit: 'kg', defaultCost: 75.00, category: 'Frutos do Mar' },
  { keywords: ['leite de coco'], defaultAmount: 0.04, unit: 'L', defaultCost: 9.50, category: 'Ingredientes Baianos' },
  { keywords: ['azeite de dende', 'dendê', 'dende'], defaultAmount: 0.015, unit: 'L', defaultCost: 18.00, category: 'Ingredientes Baianos' },

  // Queijos e Frios
  { keywords: ['queijo coalho', 'coalho'], defaultAmount: 0.08, unit: 'kg', defaultCost: 48.90, category: 'Queijos' },
  { keywords: ['parmesao', 'parmesão'], defaultAmount: 0.03, unit: 'kg', defaultCost: 88.00, category: 'Queijos' },
  { keywords: ['mussarela', 'muçarela', 'queijo prato'], defaultAmount: 0.05, unit: 'kg', defaultCost: 44.90, category: 'Queijos' },
  { keywords: ['gorgonzola', 'brie', 'gouda'], defaultAmount: 0.04, unit: 'kg', defaultCost: 89.00, category: 'Queijos Especiais' },
  { keywords: ['presunto', 'salame', 'peito de peru'], defaultAmount: 0.04, unit: 'kg', defaultCost: 52.00, category: 'Frios' },

  // Acompanhamentos, Massas, Arroz & Farofas
  { keywords: ['arroz arboreo', 'arroz arbóreo', 'arroz de risoto'], defaultAmount: 0.07, unit: 'kg', defaultCost: 22.00, category: 'Grãos' },
  { keywords: ['arroz', 'arroz branco', 'arroz parboilizado'], defaultAmount: 0.06, unit: 'kg', defaultCost: 6.80, category: 'Grãos' },
  { keywords: ['farinha', 'farinha de mandioca', 'farinha biju', 'farofa'], defaultAmount: 0.05, unit: 'kg', defaultCost: 8.50, category: 'Acompanhamentos' },
  { keywords: ['massa', 'macarrao', 'macarrão', 'penne', 'espaguete'], defaultAmount: 0.08, unit: 'kg', defaultCost: 8.90, category: 'Massas' },
  { keywords: ['manteiga'], defaultAmount: 0.02, unit: 'kg', defaultCost: 42.00, category: 'Laticínios' },
  { keywords: ['creme de leite'], defaultAmount: 0.04, unit: 'L', defaultCost: 14.50, category: 'Laticínios' },
  { keywords: ['azeite de oliva', 'azeite extra virgem'], defaultAmount: 0.015, unit: 'L', defaultCost: 46.00, category: 'Óleos' },
  { keywords: ['castanha', 'castanha de caju', 'nozes'], defaultAmount: 0.02, unit: 'kg', defaultCost: 85.00, category: 'Castanhas' },
  { keywords: ['molho barbecue', 'barbecue'], defaultAmount: 0.04, unit: 'kg', defaultCost: 24.00, category: 'Molhos' },
  { keywords: ['sal grosso', 'tempero', 'alho'], defaultAmount: 0.015, unit: 'kg', defaultCost: 12.00, category: 'Temperos' },

  // Salgados, Entradas & Canapés
  { keywords: ['salgado', 'coxinha', 'kibe', 'pastel', 'empada', 'quiche', 'canapé'], defaultAmount: 8, unit: 'un', defaultCost: 1.40, category: 'Entradas' },

  // Sobremesas, Bolos & Doces
  { keywords: ['bolo', 'torta'], defaultAmount: 0.10, unit: 'kg', defaultCost: 75.00, category: 'Confeitaria' },
  { keywords: ['doce', 'docinho', 'brigadeiro', 'beijinho', 'trufa'], defaultAmount: 4, unit: 'un', defaultCost: 2.20, category: 'Doces' },
  { keywords: ['leite condensado'], defaultAmount: 0.05, unit: 'kg', defaultCost: 16.50, category: 'Confeitaria' },
  { keywords: ['chocolate em po', 'cacau', 'nutella'], defaultAmount: 0.02, unit: 'kg', defaultCost: 42.00, category: 'Confeitaria' }
];

// MODELOS RÁPIDOS DE PRATOS SUGERIDOS PARA FESTA EM SALVADOR
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
      { name: 'Leite de Coco Natural', amountPerPerson: 0.05, unit: 'L', defaultCost: 9.50, unitCost: 9.50 },
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
      { name: 'Queijo Gorgonzola', amountPerPerson: 0.03, unit: 'kg', unitCost: 89.00 },
      { name: 'Manteiga e Parmesão', amountPerPerson: 0.02, unit: 'kg', unitCost: 55.00 }
    ]
  },
  {
    name: 'Farofa Crocante de Castanhas de Caju e Bacon',
    category: 'side',
    isHot: false,
    ingredients: [
      { name: 'Farinha de Mandioca Biju', amountPerPerson: 0.05, unit: 'kg', unitCost: 8.50 },
      { name: 'Castanha de Caju Picada', amountPerPerson: 0.02, unit: 'kg', unitCost: 85.00 },
      { name: 'Bacon em Cubinhos', amountPerPerson: 0.03, unit: 'kg', unitCost: 38.00 }
    ]
  },
  {
    name: 'Buffet de Mini Salgados Finos & Canapés',
    category: 'starter',
    isHot: false,
    ingredients: [
      { name: 'Mini Salgados & Quiches Sortidos', amountPerPerson: 10, unit: 'un', unitCost: 1.40 }
    ]
  },
  {
    name: 'Bolo Comemorativo & Brigadeiros Gourmet',
    category: 'dessert',
    isHot: false,
    ingredients: [
      { name: 'Bolo Artesanal Recheado', amountPerPerson: 0.10, unit: 'kg', unitCost: 75.00 },
      { name: 'Docinhos Gourmet (Brigadeiro / Ninho)', amountPerPerson: 5, unit: 'un', unitCost: 2.20 }
    ]
  }
];

// Função inteligente de predição de consumo e preço com base no nome do insumo
function findIngredientIntel(ingredientName) {
  if (!ingredientName || typeof ingredientName !== 'string') return null;
  const clean = ingredientName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const item of SALVADOR_INGREDIENT_DATABASE) {
    for (const kw of item.keywords) {
      const cleanKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      if (clean.includes(cleanKw)) {
        return item;
      }
    }
  }

  // Fallback padrão se não reconhecido:
  return { defaultAmount: 0.10, unit: 'kg', defaultCost: 25.00, category: 'Outros' };
}

// --- DADOS INICIAIS ---
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
  noiseRules: "Música ao vivo permitida até as 22h no salão de festas.",
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
  { id: '1', name: 'Carlos Eduardo', group: 'Amigos Próximos', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '2', name: 'Fernanda Lima', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: ['Vegetariano'] },
  { id: '3', name: 'Lucas Lima (Filho)', group: 'Família', category: 'child_6_11', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'] },
  { id: '4', name: 'Beatriz Costa', group: 'Trabalho / Colegas', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem glúten'] },
  { id: '5', name: 'Rodrigo Alves', group: 'Amigos Próximos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '6', name: 'Juliana Pires', group: 'Amigos Próximos', category: 'adult', status: 'declined', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '7', name: 'Gabriel Pires (Bebê)', group: 'Amigos Próximos', category: 'child_0_5', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'] }
];

const INITIAL_BEVERAGE_TYPES = [
  { id: 'b1', name: 'Refrigerante Cola (Coca-Cola / Zero)', category: 'soda', mlPerPersonPerHour: 90, unitCostPerLiter: 5.50, unitPackage: 'Garrafa 2L', packageVolume: 2.0 },
  { id: 'b2', name: 'Refrigerante Guaraná (Antarctica)', category: 'soda', mlPerPersonPerHour: 60, unitCostPerLiter: 5.00, unitPackage: 'Garrafa 2L', packageVolume: 2.0 },
  { id: 'b3', name: 'Suco de Uva Integral', category: 'juice', mlPerPersonPerHour: 40, unitCostPerLiter: 11.00, unitPackage: 'Garrafa 1.5L', packageVolume: 1.5 },
  { id: 'b4', name: 'Sucos Variados (Laranja / Maracujá)', category: 'juice', mlPerPersonPerHour: 50, unitCostPerLiter: 8.50, unitPackage: 'Garrafa 1L', packageVolume: 1.0 },
  { id: 'b5', name: 'Água de Coco Natural', category: 'juice', mlPerPersonPerHour: 40, unitCostPerLiter: 7.80, unitPackage: 'Garrafa 1L', packageVolume: 1.0 },
  { id: 'b6', name: 'Água Mineral sem Gás', category: 'water', mlPerPersonPerHour: 80, unitCostPerLiter: 2.20, unitPackage: 'Garrafão 5L', packageVolume: 5.0 },
  { id: 'b7', name: 'Água Mineral com Gás', category: 'water', mlPerPersonPerHour: 40, unitCostPerLiter: 3.50, unitPackage: 'Garrafa 500ml', packageVolume: 0.5 },
  { id: 'b8', name: 'Chopp Artesanal / Cerveja Puro Malte', category: 'alcohol', mlPerPersonPerHour: 320, unitCostPerLiter: 14.00, unitPackage: 'Barril 50L ou Lata', packageVolume: 0.35 },
  { id: 'b9', name: 'Vinho / Espumante Brut', category: 'alcohol', mlPerPersonPerHour: 60, unitCostPerLiter: 48.00, unitPackage: 'Garrafa 750ml', packageVolume: 0.75 },
  { id: 'b10', name: 'Gelo Filtrado (Consumo)', category: 'ice', mlPerPersonPerHour: 80, unitCostPerLiter: 3.00, unitPackage: 'Saco 5kg', packageVolume: 5.0 },
  { id: 'b11', name: 'Gelo em Cubos/Barra (Tina & Coolers)', category: 'ice', mlPerPersonPerHour: 100, unitCostPerLiter: 2.20, unitPackage: 'Saco 10kg', packageVolume: 10.0 }
];

const INITIAL_RENTALS = [
  { id: '1', name: 'Salão Villa Verde & Lounge', category: 'venue', cost: 2800, supplier: 'Espaço Villa Verde', notes: 'Incluso limpeza pós-evento' },
  { id: '2', name: 'Cama Elástica 3,05m', category: 'toy', cost: 350, supplier: 'Tio Pipoca Festas', hasMonitor: true, notes: 'Montagem 1h antes' },
  { id: '3', name: 'Piscina de Bolinhas Inflável', category: 'toy', cost: 280, supplier: 'Tio Pipoca Festas', hasMonitor: false, notes: 'Sem recreador' },
  { id: '4', name: '10 Jogos de Mesas e Cadeiras Bistrô', category: 'furniture', cost: 250, supplier: 'LocMóveis Eventos', notes: 'Madeira maciça' }
];

const INITIAL_MANUAL_EXPENSES = [
  { id: 'm-1', description: 'Decoração Floral & Painel Cenográfico', category: 'Decoração', estimated: 1200, actual: 1200, paid: true },
  { id: 'm-2', description: 'Sonorização & DJ de Sunset', category: 'Atração / Som', estimated: 900, actual: 850, paid: true },
  { id: 'm-3', description: 'Garçom e Copeira de Apoio (2 profissionais)', category: 'Mão de Obra', estimated: 500, actual: 500, paid: false }
];

const INITIAL_CHECKLIST = [
  { id: '1', title: 'Definir tema e data oficial', period: '45 dias antes', completed: true },
  { id: '2', title: 'Reservar local ou salão de festas', period: '45 dias antes', completed: true },
  { id: '3', title: 'Contratar brinquedos e monitores', period: '20 dias antes', completed: true },
  { id: '4', title: 'Disparar convites e link de RSVP', period: '20 dias antes', completed: true },
  { id: '5', title: 'Fechar aluguel de louças e rechauds', period: '15 dias antes', completed: false },
  { id: '6', title: 'Comprar bebidas não perecíveis e descartáveis', period: '7 dias antes', completed: false },
  { id: '7', title: 'Confirmar entrega de gelo filtrado e carnes', period: '3 dias antes', completed: false },
  { id: '8', title: 'Montar buffet e testar acendimento dos rechauds', period: 'No dia', completed: false }
];

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
  'Sem glúten',
  'Sem lactose',
  'Sem frutos do mar',
  'Não come carne vermelha',
  'Não come carne de porco'
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

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Status de Sincronização na Nuvem (Vercel Postgres)
  const [cloudSyncStatus, setCloudSyncStatus] = useState('syncing'); // 'synced' | 'saving' | 'offline' | 'syncing'
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const isInitialLoadDone = useRef(false);

  // Ordenação de convidados
  const [guestSortField, setGuestSortField] = useState('name');
  const [guestSortAsc, setGuestSortAsc] = useState(true);

  // Modais de Controle
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
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [rawLocalStorageDump, setRawLocalStorageDump] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==============================================================================
  // SINCRONIZAÇÃO EM NUVEM (VERCEL POSTGRES) + FALLBACK LOCALSTORAGE
  // ==============================================================================
  useEffect(() => {
    async function loadDataFromCloudOrLocal() {
      try {
        setCloudSyncStatus('syncing');
        // 1. Tenta carregar do Vercel Postgres
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
          setLastSyncTime(new Date());
          isInitialLoadDone.current = true;
          setMounted(true);
          return;
        }
      } catch (err) {
        console.warn('Postgres fetch fallback to local:', err);
      }

      // 2. Se falhar ou estiver offline, resgata do localStorage
      try {
        const savedConfig = localStorage.getItem('festplanner_config_v3') || localStorage.getItem('festplanner_config');
        if (savedConfig) setConfig(JSON.parse(savedConfig));

        const savedGuests = localStorage.getItem('festplanner_guests_v3') || localStorage.getItem('festplanner_guests');
        if (savedGuests) setGuests(JSON.parse(savedGuests));

        const savedMenu = localStorage.getItem('festplanner_menu_v3') || localStorage.getItem('festplanner_menu');
        if (savedMenu) setMenu(JSON.parse(savedMenu));

        const savedBeverages = localStorage.getItem('festplanner_beverages_v3') || localStorage.getItem('festplanner_beverages');
        if (savedBeverages) setBeverages(JSON.parse(savedBeverages));

        const savedRentals = localStorage.getItem('festplanner_rentals_v3') || localStorage.getItem('festplanner_rentals');
        if (savedRentals) setRentals(JSON.parse(savedRentals));

        const savedExpenses = localStorage.getItem('festplanner_manual_expenses_v3') || localStorage.getItem('festplanner_expenses');
        if (savedExpenses) setManualExpenses(JSON.parse(savedExpenses));

        const savedChecklist = localStorage.getItem('festplanner_checklist_v3') || localStorage.getItem('festplanner_checklist');
        if (savedChecklist) setChecklist(JSON.parse(savedChecklist));
      } catch (_) {}

      setCloudSyncStatus('offline');
      isInitialLoadDone.current = true;
      setMounted(true);
    }

    loadDataFromCloudOrLocal();
  }, []);

  // Salvamento contínuo: Grava no localStorage E envia para o Vercel Postgres
  useEffect(() => {
    if (!mounted || !isInitialLoadDone.current) return;

    // Backup local
    try {
      localStorage.setItem('festplanner_config_v3', JSON.stringify(config));
      localStorage.setItem('festplanner_guests_v3', JSON.stringify(guests));
      localStorage.setItem('festplanner_menu_v3', JSON.stringify(menu));
      localStorage.setItem('festplanner_beverages_v3', JSON.stringify(beverages));
      localStorage.setItem('festplanner_rentals_v3', JSON.stringify(rentals));
      localStorage.setItem('festplanner_manual_expenses_v3', JSON.stringify(manualExpenses));
      localStorage.setItem('festplanner_checklist_v3', JSON.stringify(checklist));
    } catch (_) {}

    // Auto-save no Postgres com debounce de 1 segundo
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
          setLastSyncTime(new Date());
        } else {
          setCloudSyncStatus('offline');
        }
      } catch (e) {
        setCloudSyncStatus('offline');
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [config, guests, menu, beverages, rentals, manualExpenses, checklist, mounted]);

  // Função manual para forçar sincronização
  const handleForceCloudSync = async () => {
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
        setLastSyncTime(new Date());
        showToast('Dados salvos no Vercel Postgres!');
      } else {
        setCloudSyncStatus('offline');
        showToast('Nuvem offline. Salvo localmente.');
      }
    } catch (e) {
      setCloudSyncStatus('offline');
      showToast('Erro ao sincronizar na nuvem.');
    }
  };

  // --- ESTATÍSTICAS E COTAS DE CONSUMO ---
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
    const pendingUrgentTasks = checklist.filter(c => !c.completed).slice(0, 3);

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
      pendingUrgentTasks,
      daysUntilEvent
    };
  }, [guests, menu, checklist, config.date]);

  // --- MOTOR 1: CARDÁPIO & INGREDIENTES (CONFIRMADOS VS. TODOS) ---
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

  // --- MOTOR 2: BEBIDAS & GELO (CONFIRMADOS VS. TODOS) ---
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

  // --- MOTOR 3: LOUÇAS, RECHAUDS, MOBILIÁRIO E DESCARTÁVEIS ---
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

    const allTablesNeeded = Math.ceil(all / capacity);
    const allChairsNeeded = allTablesNeeded * capacity;

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
      allTablesNeeded,
      allChairsNeeded,
      unitMaterialCost,
      rechaudUnitCost,
      pasteUnitCost,
      equipmentBaseCost,
      tablewareCostConfirmed,
      tablewareCostAll
    };
  }, [
    stats.confirmedCount,
    stats.totalGuests,
    stats.confirmedDrinkers,
    stats.hotDishesCount,
    config.safetyMarginPct,
    config.durationHours,
    config.tableCapacity,
    config.materialMode,
    config.rentalUnitCost,
    config.disposableUnitCost,
    config.rechaudRentalCost,
    config.fuelPasteCost
  ]);

  // --- MOTOR 4: CENTRO DE CUSTOS INTEGRADO E SINCRONIZADO ---
  const budget = useMemo(() => {
    const rentalsCost = rentals.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    const foodCostConfirmed = calculatedMenu.totalCostConfirmed;
    const foodCostAll = calculatedMenu.totalCostAll;
    const beveragesCostConfirmed = calculatedBeverages.totalCostConfirmed;
    const beveragesCostAll = calculatedBeverages.totalCostAll;
    const tablewareCostConfirmed = calculatedMaterials.tablewareCostConfirmed;
    const tablewareCostAll = calculatedMaterials.tablewareCostAll;

    const manualTotalEstimated = manualExpenses.reduce((acc, curr) => acc + (Number(curr.estimated) || 0), 0);
    const manualTotalActual = manualExpenses.reduce((acc, curr) => acc + (Number(curr.actual) || Number(curr.estimated) || 0), 0);

    const grandTotalConfirmed = rentalsCost + foodCostConfirmed + beveragesCostConfirmed + tablewareCostConfirmed + manualTotalActual;
    const grandTotalAll = rentalsCost + foodCostAll + beveragesCostAll + tablewareCostAll + manualTotalEstimated;
    const rsvpSavings = Math.max(0, grandTotalAll - grandTotalConfirmed);
    const costPerConfirmed = stats.confirmedCount > 0 ? (grandTotalConfirmed / stats.confirmedCount) : 0;
    const costPerAll = stats.totalGuests > 0 ? (grandTotalAll / stats.totalGuests) : 0;

    return {
      rentalsCost,
      foodCostConfirmed,
      foodCostAll,
      beveragesCostConfirmed,
      beveragesCostAll,
      tablewareCostConfirmed,
      tablewareCostAll,
      manualTotalActual,
      manualTotalEstimated,
      grandTotalConfirmed,
      grandTotalAll,
      rsvpSavings,
      costPerConfirmed,
      costPerAll
    };
  }, [rentals, calculatedMenu, calculatedBeverages, calculatedMaterials, manualExpenses, stats.confirmedCount, stats.totalGuests]);

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

  // --- CRUD 1: CONVIDADOS ---
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
      const newGuest = { id: Date.now().toString(), name, group, category, status, drinksAlcohol, restrictions: finalRestrictions };
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
    } else if (guest && typeof guest.restrictions === 'string') {
      setSelectedRestrictions([guest.restrictions]);
    } else {
      setSelectedRestrictions(['Sem restrições']);
    }
    setGuestModalOpen(true);
  };

  const handleDeleteGuest = (id) => {
    setGuests(guests.filter(g => g.id !== id));
    showToast('Convidado removido.');
  };

  // --- CRUD 2: CARDÁPIO COM AUTO-CÁLCULO E PREÇOS DE SALVADOR ---
  const handleOpenMenuModal = (item = null) => {
    setEditingMenuItem(item);
    if (item && Array.isArray(item.ingredients)) {
      setEditingIngredients(JSON.parse(JSON.stringify(item.ingredients)));
    } else {
      setEditingIngredients([
        { name: 'Picanha Bovina Resfriada', amountPerPerson: 0.18, unit: 'kg', unitCost: 74.90 }
      ]);
    }
    setMenuModalOpen(true);
  };

  const handleAddIngredientRow = () => {
    setEditingIngredients([
      ...editingIngredients,
      { name: '', amountPerPerson: 0.10, unit: 'kg', unitCost: 25.00 }
    ]);
  };

  const handleRemoveIngredientRow = (idx) => {
    setEditingIngredients(editingIngredients.filter((_, i) => i !== idx));
  };

  const handleUpdateIngredient = (idx, field, value) => {
    const updated = [...editingIngredients];
    updated[idx] = { ...updated[idx], [field]: value };

    // Se o usuário digitou o nome do ingrediente, aciona o motor de busca inteligente
    if (field === 'name' && value && value.length >= 3) {
      const intel = findIngredientIntel(value);
      if (intel) {
        // Sugere automaticamente a gramatura e unidade se o usuário ainda não tiver alterado
        updated[idx].amountPerPerson = intel.defaultAmount;
        updated[idx].unit = intel.unit;
        updated[idx].unitCost = intel.defaultCost;
      }
    }

    setEditingIngredients(updated);
  };

  // Botão de 1-Clique: Auto-calcular todos os ingredientes com a tabela de Salvador
  const handleAutoApplySalvadorPricing = () => {
    let matchedCount = 0;
    const updated = editingIngredients.map(ing => {
      const intel = findIngredientIntel(ing.name);
      if (intel) {
        matchedCount++;
        return {
          ...ing,
          amountPerPerson: intel.defaultAmount,
          unit: intel.unit,
          unitCost: intel.defaultCost
        };
      }
      return ing;
    });
    setEditingIngredients(updated);
    showToast(`${matchedCount} ingredientes calibrados com preços médios de Salvador!`);
  };

  // Aplicar Template de Prato Sugerido
  const handleApplyDishTemplate = (template) => {
    setEditingIngredients(JSON.parse(JSON.stringify(template.ingredients)));
    const nameInput = document.getElementById('menu-item-name-input');
    if (nameInput) nameInput.value = template.name;
    const categorySelect = document.getElementById('menu-item-category-input');
    if (categorySelect) categorySelect.value = template.category;
    const isHotCheckbox = document.getElementById('menu-item-ishot-input');
    if (isHotCheckbox) isHotCheckbox.checked = template.isHot;
    showToast(`Template "${template.name}" aplicado!`);
  };

  const handleSaveMenuItem = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const isHot = form.isHot.checked;

    if (!name) return;

    const validIngredients = editingIngredients
      .filter(ing => ing.name && ing.name.trim().length > 0)
      .map(ing => ({
        name: ing.name.trim(),
        amountPerPerson: parseFloat(ing.amountPerPerson) || 0.1,
        unit: ing.unit || 'kg',
        unitCost: parseFloat(ing.unitCost) || 0
      }));

    if (editingMenuItem) {
      setMenu(menu.map(m => m.id === editingMenuItem.id ? { ...m, name, category, isHot, ingredients: validIngredients } : m));
      showToast('Prato atualizado e Centro de Custos recalculado!');
    } else {
      const newItem = {
        id: 'm-' + Date.now(),
        name,
        category,
        isHot,
        ingredients: validIngredients
      };
      setMenu([...menu, newItem]);
      showToast('Novo prato adicionado ao cardápio!');
    }

    setMenuModalOpen(false);
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = (id) => {
    setMenu(menu.filter(m => m.id !== id));
    showToast('Prato removido do cardápio.');
  };

  // --- CRUD 3: BEBIDAS ---
  const handleOpenBeverageModal = (bev = null) => {
    setEditingBeverage(bev);
    setBeverageModalOpen(true);
  };

  const handleSaveBeverage = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const mlPerPersonPerHour = parseFloat(form.mlPerPersonPerHour.value) || 50;
    const unitCostPerLiter = parseFloat(form.unitCostPerLiter.value) || 5.0;
    const unitPackage = form.unitPackage.value.trim() || 'Garrafa';
    const packageVolume = parseFloat(form.packageVolume.value) || 1.0;

    if (!name) return;

    if (editingBeverage) {
      setBeverages(beverages.map(b => b.id === editingBeverage.id ? {
        ...b,
        name,
        category,
        mlPerPersonPerHour,
        unitCostPerLiter,
        unitPackage,
        packageVolume
      } : b));
      showToast('Bebida atualizada!');
    } else {
      const newBev = {
        id: 'b-' + Date.now(),
        name,
        category,
        mlPerPersonPerHour,
        unitCostPerLiter,
        unitPackage,
        packageVolume
      };
      setBeverages([...beverages, newBev]);
      showToast('Nova bebida adicionada!');
    }

    setBeverageModalOpen(false);
    setEditingBeverage(null);
  };

  const handleDeleteBeverage = (id) => {
    setBeverages(beverages.filter(b => b.id !== id));
    showToast('Bebida removida.');
  };

  // --- CRUD 4: LOCAÇÕES, BRINQUEDOS E MOBILIÁRIO ---
  const handleOpenRentalModal = (rental = null) => {
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
      setRentals(rentals.map(r => r.id === editingRental.id ? { ...r, name, category, cost, supplier, notes, hasMonitor } : r));
      showToast('Locação atualizada e sincronizada!');
    } else {
      const newRental = { id: Date.now().toString(), name, category, cost, supplier, notes, hasMonitor };
      setRentals([...rentals, newRental]);
      showToast('Locação adicionada ao centro de custos!');
    }

    setRentalModalOpen(false);
    setEditingRental(null);
  };

  const handleDeleteRental = (id) => {
    setRentals(rentals.filter(r => r.id !== id));
    showToast('Locação removida.');
  };

  // --- CRUD 5: DESPESAS MANUAIS ---
  const handleOpenExpenseModal = (exp = null) => {
    setEditingExpense(exp);
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
      setManualExpenses(manualExpenses.map(exp => exp.id === editingExpense.id ? { ...exp, description, category, estimated, actual, paid } : exp));
      showToast('Despesa atualizada!');
    } else {
      const newExp = { id: Date.now().toString(), description, category, estimated, actual: actual || estimated, paid };
      setManualExpenses([...manualExpenses, newExp]);
      showToast('Despesa registrada!');
    }

    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    setManualExpenses(manualExpenses.filter(e => e.id !== id));
    showToast('Despesa removida.');
  };

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleResetDemoData = () => {
    setConfig(INITIAL_EVENT_CONFIG);
    setGuests(INITIAL_GUESTS);
    setMenu(SUGGESTED_DISH_TEMPLATES);
    setBeverages(INITIAL_BEVERAGE_TYPES);
    setRentals(INITIAL_RENTALS);
    setManualExpenses(INITIAL_MANUAL_EXPENSES);
    setChecklist(INITIAL_CHECKLIST);
    showToast('Dados de teste restaurados!');
  };

  const handleExportBackup = () => {
    const backupData = { version: '3.5', timestamp: new Date().toISOString(), config, guests, menu, beverages, rentals, manualExpenses, checklist };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FestPlanner_Backup_${(config.celebrantName || 'evento').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Backup exportado com sucesso!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.config) setConfig(data.config);
        if (data.guests) setGuests(data.guests);
        if (data.menu) setMenu(data.menu);
        if (data.beverages) setBeverages(data.beverages);
        if (data.rentals) setRentals(data.rentals);
        if (data.manualExpenses) setManualExpenses(data.manualExpenses);
        if (data.checklist) setChecklist(data.checklist);
        showToast('Backup restaurado!');
        setBackupModalOpen(false);
      } catch (_) {
        showToast('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  const openDiagnostics = () => {
    if (typeof window === 'undefined') return;
    const dump = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      const val = localStorage.getItem(key) || '';
      dump.push({ key, preview: val.slice(0, 120), full: val });
    }
    setRawLocalStorageDump(dump);
    setBackupModalOpen(true);
  };

  const handleRestoreFromKey = (rawVal) => {
    try {
      const parsed = JSON.parse(rawVal);
      if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].name || parsed[0].status)) {
        setGuests(parsed);
        showToast('Convidados restaurados com sucesso!');
        setBackupModalOpen(false);
        return;
      }
      if (typeof parsed === 'object' && parsed.celebrantName) {
        setConfig(parsed);
        showToast('Configurações recuperadas!');
        setBackupModalOpen(false);
        return;
      }
      showToast('Formato reconhecido.');
    } catch (_) {
      showToast('Erro ao ler conteúdo desta chave.');
    }
  };

  const handleExportShoppingList = () => {
    const textContent = `
============================================================
FESTPLANNER PRO - RELATÓRIO OPERACIONAL & LISTA DE COMPRAS
Evento: Aniversário de ${config.celebrantName} (${config.age} anos)
Localidade de Referência: Salvador - BA (Preços Médios de Mercado)
Data: ${config.date} | Duração: ${config.durationHours}h
Confirmados: ${stats.confirmedCount} pessoas (${stats.confirmedEaters.toFixed(1)} cotas de consumo)
Total na Lista Geral: ${stats.totalGuests} convidados (${stats.allPotentialEaters.toFixed(1)} cotas)

============================================================
COMPARATIVO FINANCEIRO SINCRONIZADO
============================================================
- Custo com CONFIRMADOS: R$ ${budget.grandTotalConfirmed.toLocaleString('pt-BR')} (R$ ${Math.round(budget.costPerConfirmed)} / pessoa)
- Custo se TODOS FOREM:   R$ ${budget.grandTotalAll.toLocaleString('pt-BR')} (R$ ${Math.round(budget.costPerAll)} / pessoa)
- Economia obtida (RSVP): R$ ${budget.rsvpSavings.toLocaleString('pt-BR')}

============================================================
CARDÁPIO SUGERIDO & FICHA TÉCNICA (RECEITAS & GRAMATURA)
============================================================
${calculatedMenu.itemsDetailed.map(item => `
* ${item.name} (${item.isHot ? 'Prato Quente - Rechaud' : 'Servido Frio'})
  Subtotal Estimado (Confirmados): R$ ${item.itemCostConfirmed.toLocaleString('pt-BR')}
  Subtotal se Todos Forem:       R$ ${item.itemCostAll.toLocaleString('pt-BR')}
  Ingredientes Calculados:
${item.ingredients.map(ing => `    - ${ing.name}: ${ing.qtyConfirmed} ${ing.unit} x R$ ${ing.unitCost.toFixed(2)} = R$ ${ing.costConfirmed.toFixed(2)} (Gramatura: ${ing.amountPerPerson} ${ing.unit}/pessoa)`).join('\n')}
`).join('')}
Subtotal do Buffet: R$ ${budget.foodCostConfirmed.toLocaleString('pt-BR')} (Se todos: R$ ${budget.foodCostAll.toLocaleString('pt-BR')})

============================================================
BEBIDAS DISCRIMINADAS & GELO
============================================================
${calculatedBeverages.list.map(bev => `
- ${bev.name}: 
    * Com Confirmados: ${bev.totalLitersConfirmed} L (~${bev.packagesConfirmed} ${bev.unitPackage}) | Custo: R$ ${bev.totalCostConfirmed.toLocaleString('pt-BR')}
    * Se Todos Forem:   ${bev.totalLitersAll} L (~${bev.packagesAll} ${bev.unitPackage}) | Custo: R$ ${bev.totalCostAll.toLocaleString('pt-BR')}
`).join('')}
Subtotal de Bebidas & Gelo: R$ ${budget.beveragesCostConfirmed.toLocaleString('pt-BR')}

============================================================
LOCAÇÕES, BRINQUEDOS E MOBILIÁRIO
============================================================
${rentals.map(r => `- ${r.name} (${r.category}): R$ ${Number(r.cost).toLocaleString('pt-BR')} | Fornecedor: ${r.supplier || 'N/A'}${r.hasMonitor ? ' (Com Monitor)' : ''}`).join('\n')}
Total em Locações: R$ ${budget.rentalsCost.toLocaleString('pt-BR')}

============================================================
ESTRUTURA DE LOUÇAS & MESAS (${config.materialMode === 'rental' ? 'ALUGUEL' : 'DESCARTÁVEIS'})
============================================================
- Pratos Principais: ${calculatedMaterials.mainPlates} un
- Pratos de Sobremesa: ${calculatedMaterials.dessertPlates} un
- Talheres: ${calculatedMaterials.forksAndKnives} pares
- Copos / Taças de Água: ${calculatedMaterials.waterGlasses} un
- Tulipas de Chopp: ${calculatedMaterials.beerTulips} un
- Rechauds Inox (Sincronizado c/ pratos quentes): ${calculatedMaterials.rechauds} cubas quentes
- Pastilhas de Álcool Gel (${config.durationHours}h de queima): ${calculatedMaterials.fuelPastesNeeded} un
- Mesas e Cadeiras: ${calculatedMaterials.guestTablesNeeded} jogos (${calculatedMaterials.guestChairsNeeded} assentos)
Subtotal de Louças & Estrutura: R$ ${budget.tablewareCostConfirmed.toLocaleString('pt-BR')}

============================================================
DESPESAS MANUAIS / EXTRAS
============================================================
${manualExpenses.map(e => `- ${e.description} (${e.category}): Previsto R$ ${Number(e.estimated).toLocaleString('pt-BR')} | Real R$ ${Number(e.actual || e.estimated).toLocaleString('pt-BR')} [${e.paid ? 'Pago' : 'Pendente'}]`).join('\n')}
Subtotal Despesas Manuais: R$ ${budget.manualTotalActual.toLocaleString('pt-BR')}
`.trim();

    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `FestPlanner_Relatorio_Salvador_${(config.celebrantName || 'evento').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Relatório baixado com sucesso!');
  };

  // Safe SSR placeholder to prevent hydration crash
  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Cake className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Carregando FestPlanner Pro (Salvador Engine)...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${darkMode ? 'bg-zinc-950 text-zinc-100 selection:bg-zinc-800' : 'bg-zinc-50/70 text-zinc-900 selection:bg-zinc-200'}`}>
      
      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2.5 rounded-xl shadow-lg border border-zinc-800 dark:border-zinc-200 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${darkMode ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white/80 border-zinc-200/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-base shadow-sm">
              <Cake className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight">FestPlanner</span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
                  Salvador Pro
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                {config.celebrantName} • {config.age} anos • {config.venueAddress.split('-')[1]?.trim() || 'Salvador - BA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* BADGE DE SINCRONIZAÇÃO EM NUVEM (VERCEL POSTGRES) */}
            <button
              onClick={handleForceCloudSync}
              title={cloudSyncStatus === 'synced' ? 'Nuvem Conectada e Sincronizada' : 'Salvar no Vercel Postgres'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                cloudSyncStatus === 'synced'
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : cloudSyncStatus === 'saving'
                  ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'synced' ? 'text-emerald-500' : cloudSyncStatus === 'saving' ? 'animate-pulse text-amber-500' : 'text-zinc-400'}`} />
              <span className="hidden md:inline">
                {cloudSyncStatus === 'synced' ? 'Nuvem Salva' : cloudSyncStatus === 'saving' ? 'Gravando...' : 'Nuvem Offline'}
              </span>
              <RefreshCw className={`w-3 h-3 text-zinc-400 ${cloudSyncStatus === 'saving' ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openDiagnostics}
              title="Backup e Diagnóstico"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Database className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <button
              onClick={() => setRsvpSimModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Link RSVP</span>
            </button>

            <button
              onClick={() => handleOpenGuestModal(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Convidado</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <button
              onClick={handleResetDemoData}
              title="Restaurar dados de teste"
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

        {/* HORIZONTAL NAVIGATION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: Sparkles },
              { id: 'guests', label: 'Convidados & RSVP', icon: Users, count: stats.confirmedCount },
              { id: 'menu', label: 'Cardápio & Receitas', icon: BookOpen },
              { id: 'beverages', label: 'Bebidas Detalhadas', icon: GlassWater },
              { id: 'rentals', label: 'Locações & Brinquedos', icon: Gamepad2 },
              { id: 'catering', label: 'Louças & Rechauds', icon: Utensils },
              { id: 'finance', label: 'Centro de Custos', icon: DollarSign },
              { id: 'checklist', label: 'Linha do Tempo', icon: CheckSquare, badge: `${stats.checklistProgress}%` },
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

      {/* MAIN BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        {/* ============================================================ */}
        {/* TAB 1: VISÃO GERAL */}
        {/* ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* HERO */}
            <div className={`rounded-2xl border p-6 transition-all ${
              darkMode ? 'bg-gradient-to-b from-zinc-900/80 to-zinc-950 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-xs'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      Painel do Anfitrião
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-zinc-400" />
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                      {stats.daysUntilEvent > 0 ? `Faltam ${stats.daysUntilEvent} dias` : stats.daysUntilEvent === 0 ? 'É hoje!' : 'Evento finalizado'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Aniversário de {config.celebrantName} <span className="text-zinc-400 font-normal">({config.age} anos)</span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-zinc-500 dark:text-zinc-400 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {config.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {config.startTime} - {config.endTime} ({config.durationHours}h)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {config.locationType === 'home' ? 'Espaço Próprio / Condomínio' : config.venueName} (Salvador - BA)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-zinc-400" />
                      {stats.hotDishesCount} pratos quentes ({calculatedMaterials.rechauds} rechauds)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    Centro de Custos
                  </button>
                  <button
                    onClick={handleExportShoppingList}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 shadow-sm transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Relatório Operacional</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
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
                  <span>•</span>
                  <span>{stats.confirmedKids611 + stats.confirmedKids05} crianças</span>
                  <span>•</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {stats.totalGuests > 0 ? Math.round((stats.confirmedCount / stats.totalGuests) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Custo Real (Confirmados)</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                    R$ {budget.grandTotalConfirmed.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>R$ {Math.round(budget.costPerConfirmed)} / pessoa</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {stats.confirmedEaters.toFixed(1)} cotas
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Custo se Todos Forem</span>
                  <Coins className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    R$ {budget.grandTotalAll.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">(100%)</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>Economia RSVP:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    R$ {budget.rsvpSavings.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Prontidão Operacional</span>
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

            {/* LOWER GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                
                {/* RSVP TRACKER */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Status de Convites & Presenças</h3>
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
                    />
                    <div
                      style={{ width: `${stats.totalGuests > 0 ? (stats.pendingCount / stats.totalGuests) * 100 : 0}%` }}
                      className="bg-amber-400 h-full transition-all"
                    />
                    <div
                      style={{ width: `${stats.totalGuests > 0 ? (stats.declinedCount / stats.totalGuests) * 100 : 0}%` }}
                      className="bg-zinc-300 dark:bg-zinc-700 h-full transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-500">Confirmados</span>
                      <div className="text-base font-semibold mt-0.5">{stats.confirmedCount}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-500">Pendentes</span>
                      <div className="text-base font-semibold mt-0.5">{stats.pendingCount}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-500">Recusados</span>
                      <div className="text-base font-semibold mt-0.5">{stats.declinedCount}</div>
                    </div>
                  </div>
                </div>

                {/* BUFFET SUMMARY */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Síntese de Operação & Cardápio (Referência: Salvador)</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Calculado para {stats.confirmedEaters.toFixed(1)} cotas alimentares em {config.durationHours}h</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('menu')}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition"
                    >
                      <span>Ver receitas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Buffet (Receitas)</span>
                      <strong className="text-sm font-semibold mt-1 block">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</strong>
                      <span className="text-[10px] text-zinc-500">{calculatedMenu.itemsDetailed.length} pratos</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Bebidas & Gelo</span>
                      <strong className="text-sm font-semibold mt-1 block">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</strong>
                      <span className="text-[10px] text-zinc-500">{calculatedBeverages.list.length} tipos</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Rechauds Inox</span>
                      <strong className="text-sm font-semibold mt-1 block">{calculatedMaterials.rechauds} cubas</strong>
                      <span className="text-[10px] text-zinc-500">{calculatedMaterials.fuelPastesNeeded} pastilhas</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[11px] text-zinc-400 block">Locações & Brinquedos</span>
                      <strong className="text-sm font-semibold mt-1 block">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</strong>
                      <span className="text-[10px] text-zinc-500">{rentals.length} itens</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                
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

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Locações & Espaço</span>
                        <span className="font-medium">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (budget.rentalsCost / (budget.grandTotalConfirmed || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Cardápio & Alimentos</span>
                        <span className="font-medium">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (budget.foodCostConfirmed / (budget.grandTotalConfirmed || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Bebidas Detalhadas</span>
                        <span className="font-medium">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (budget.beveragesCostConfirmed / (budget.grandTotalConfirmed || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Louças & Apoio</span>
                        <span className="font-medium">R$ {budget.tablewareCostConfirmed.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (budget.tablewareCostConfirmed / (budget.grandTotalConfirmed || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-tight">Próximos Passos</h3>
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                    >
                      Todas
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
        {/* TAB 2: CONVIDADOS & RSVP */}
        {/* ============================================================ */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Lista de Convidados & Presenças</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    {stats.confirmedCount} confirmados ({stats.confirmedEaters.toFixed(1)} cotas), {stats.pendingCount} pendentes e {stats.declinedCount} recusados
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
                    onClick={() => handleOpenGuestModal(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Convidado</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th onClick={() => handleSortGuests('name')} className="pb-2.5 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 select-none">
                        <div className="flex items-center gap-1">
                          <span>Nome</span>
                          <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                        </div>
                      </th>
                      <th onClick={() => handleSortGuests('group')} className="pb-2.5 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 select-none">
                        <div className="flex items-center gap-1">
                          <span>Grupo</span>
                          <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                        </div>
                      </th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th onClick={() => handleSortGuests('status')} className="pb-2.5 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 select-none">
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                        </div>
                      </th>
                      <th className="pb-2.5 font-medium">Álcool</th>
                      <th className="pb-2.5 font-medium">Restrições Alimentares</th>
                      <th className="pb-2.5 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {sortedGuests.map(guest => (
                      <tr key={guest.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{guest.name}</td>
                        <td className="py-3 text-zinc-500">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                            {guest.group || 'Geral'}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-600 dark:text-zinc-300">
                          {guest.category === 'adult' ? 'Adulto' : guest.category === 'child_6_11' ? 'Criança (6-11)' : 'Criança (0-5)'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            guest.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50'
                              : guest.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'pending' ? 'Pendente' : 'Recusado'}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-500">{guest.drinksAlcohol ? 'Sim' : 'Não'}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(guest.restrictions) && guest.restrictions.map((r, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenGuestModal(guest)}
                              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="p-1 rounded-md text-zinc-400 hover:text-rose-600"
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
        {/* TAB 3: CARDÁPIO SUGERIDO COM AUTO-CÁLCULO & PREÇOS SALVADOR */}
        {/* ============================================================ */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold tracking-tight">Cardápio Sugerido & Ficha Técnica de Receitas</h2>
                    <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      Salvador Market Engine
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Gramaturas calculadas automaticamente por pessoa. Preços médios de Salvador sincronizados em tempo real ao Centro de Custos.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-right">
                    <span className="text-zinc-400 block text-[10px]">Custo Buffet c/ Confirmados</span>
                    <strong className="text-sm text-emerald-600 dark:text-emerald-400">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenMenuModal(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Prato</span>
                  </button>
                </div>
              </div>

              {/* CARD DE TEMPLATES RÁPIDOS REGIONAIS */}
              <div className="mt-4 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-2">
                  Sugestões Rápidas de Pratos com Ficha Pronta:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_DISH_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const exists = menu.some(m => m.name === tpl.name);
                        if (!exists) {
                          setMenu([...menu, { ...tpl, id: 'tpl-' + Date.now() + '-' + i }]);
                          showToast(`Prato "${tpl.name}" adicionado ao cardápio!`);
                        } else {
                          showToast('Este prato já está no cardápio.');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-zinc-700 dark:text-zinc-300 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3 text-emerald-500" />
                      <span>{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LISTA DE PRATOS DO CARDÁPIO */}
              <div className="mt-6 space-y-4">
                {calculatedMenu.itemsDetailed.map(item => (
                  <div key={item.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Flame className={`w-4 h-4 ${item.isHot ? 'text-amber-500' : 'text-zinc-400'}`} />
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.isHot ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {item.isHot ? 'Prato Quente (Rechaud)' : 'Servido Frio'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-zinc-500">
                          Confirmados: <strong className="text-zinc-900 dark:text-zinc-100">R$ {item.itemCostConfirmed.toLocaleString('pt-BR')}</strong>
                        </span>
                        <span className="text-zinc-400">
                          | Se todos: R$ {item.itemCostAll.toLocaleString('pt-BR')}
                        </span>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => handleOpenMenuModal(item)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Editar receita"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-500"
                            title="Excluir prato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-zinc-400 text-[11px]">
                            <th className="pb-1.5 font-normal">Ingrediente / Insumo</th>
                            <th className="pb-1.5 font-normal">Qtd / Pessoa (Auto)</th>
                            <th className="pb-1.5 font-normal">Preço Unit. (Salvador)</th>
                            <th className="pb-1.5 font-normal">Total Confirmados ({stats.confirmedEaters.toFixed(1)} cotas)</th>
                            <th className="pb-1.5 font-normal text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40 text-zinc-600 dark:text-zinc-300">
                          {(item.ingredients || []).map((ing, idx) => (
                            <tr key={idx}>
                              <td className="py-1.5 font-medium text-zinc-800 dark:text-zinc-200">{ing.name}</td>
                              <td className="py-1.5">{ing.amountPerPerson} {ing.unit}</td>
                              <td className="py-1.5">R$ {Number(ing.unitCost || 0).toFixed(2)} / {ing.unit}</td>
                              <td className="py-1.5 font-semibold text-zinc-900 dark:text-zinc-100">{ing.qtyConfirmed} {ing.unit}</td>
                              <td className="py-1.5 text-right font-medium text-zinc-900 dark:text-zinc-100">R$ {Number(ing.costConfirmed || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: BEBIDAS DISCRIMINADAS (TOTALMENTE EDITÁVEL) */}
        {/* ============================================================ */}
        {activeTab === 'beverages' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Discriminação de Bebidas, Sucos & Gelo</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cálculo individualizado considerando {config.durationHours}h de evento.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-right">
                    <span className="text-zinc-400 block text-[10px]">Custo c/ Confirmados</span>
                    <strong className="text-sm text-emerald-600 dark:text-emerald-400">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenBeverageModal(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Bebida</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="pb-2.5 font-medium">Bebida / Insumo</th>
                      <th className="pb-2.5 font-medium">Consumo / Pessoa / Hora</th>
                      <th className="pb-2.5 font-medium">Preço / Litro</th>
                      <th className="pb-2.5 font-medium">Volume (Confirmados)</th>
                      <th className="pb-2.5 font-medium">Embalagens Sugeridas</th>
                      <th className="pb-2.5 font-medium">Custo (Confirmados)</th>
                      <th className="pb-2.5 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {calculatedBeverages.list.map(bev => (
                      <tr key={bev.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{bev.name}</td>
                        <td className="py-3 text-zinc-500">{bev.mlPerPersonPerHour} ml / h</td>
                        <td className="py-3 text-zinc-500">R$ {Number(bev.unitCostPerLiter || 0).toFixed(2)}</td>
                        <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">{bev.totalLitersConfirmed} L</td>
                        <td className="py-3 text-zinc-700 dark:text-zinc-300">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-medium">
                            ~{bev.packagesConfirmed} {bev.unitPackage}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">
                          R$ {bev.totalCostConfirmed.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenBeverageModal(bev)}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                              title="Editar bebida"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBeverage(bev.id)}
                              className="p-1 rounded text-zinc-400 hover:text-rose-500"
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
        {/* TAB 5: LOCAÇÕES, BRINQUEDOS E MOBILIÁRIO */}
        {/* ============================================================ */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Locações, Brinquedos e Mobiliário</h2>
                  <p className="text-xs text-zinc-500 mt-1">Gerencie os equipamentos infantis, espaço físico e móveis contratados.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-right">
                    <span className="text-zinc-400 block text-[10px]">Total de Locações</span>
                    <strong className="text-sm text-zinc-900 dark:text-zinc-100">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenRentalModal(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Item de Locação</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentals.map(rental => (
                  <div key={rental.id} className={`p-4 rounded-xl border flex flex-col justify-between ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            {rental.category === 'toy' ? 'Brinquedo & Recreação' : rental.category === 'furniture' ? 'Mobiliário' : 'Espaço Físico'}
                          </span>
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{rental.name}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenRentalModal(rental)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Editar locação"
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
                      <p className="text-xs text-zinc-500 mt-1.5">{rental.supplier || 'Fornecedor'}</p>
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
        {/* TAB 6: LOUÇAS, RECHAUDS, MOBILIÁRIO E DESCARTÁVEIS */}
        {/* ============================================================ */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Calculadora de Louças, Rechauds, Mesas & Descartáveis</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Altere parâmetros de custo unitário, margem de segurança e capacidade por mesa para recalcular tudo.
                  </p>
                </div>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setConfig({ ...config, materialMode: 'rental' })}
                    className={`px-3 py-1 rounded-md transition ${config.materialMode === 'rental' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500'}`}
                  >
                    Louças / Aluguel
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, materialMode: 'disposable' })}
                    className={`px-3 py-1 rounded-md transition ${config.materialMode === 'disposable' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500'}`}
                  >
                    Descartáveis
                  </button>
                </div>
              </div>

              {/* PAINEL DE PARÂMETROS EDITÁVEIS */}
              <div className="mt-5 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40">
                <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Parâmetros de Custos e Margem
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">Margem de Quebra/Segurança (%)</label>
                    <input
                      type="number"
                      value={config.safetyMarginPct}
                      onChange={(e) => setConfig({ ...config, safetyMarginPct: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">Lugares por Mesa de Convidado</label>
                    <input
                      type="number"
                      value={config.tableCapacity}
                      onChange={(e) => setConfig({ ...config, tableCapacity: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">
                      {config.materialMode === 'rental' ? 'Aluguel Louça/Pessoa (R$)' : 'Descartáveis/Pessoa (R$)'}
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={config.materialMode === 'rental' ? config.rentalUnitCost : config.disposableUnitCost}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (config.materialMode === 'rental') {
                          setConfig({ ...config, rentalUnitCost: val });
                        } else {
                          setConfig({ ...config, disposableUnitCost: val });
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">Aluguel Rechaud Inox (R$/un)</label>
                    <input
                      type="number"
                      step="1.00"
                      value={config.rechaudRentalCost}
                      onChange={(e) => setConfig({ ...config, rechaudRentalCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* GRIDS DE RESULTADOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-400" /> Pratos & Talheres
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Pratos Refeição (+{config.safetyMarginPct}%)</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.mainPlates} un</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Pratos Sobremesa / Bolo</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.dessertPlates} un</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Talheres (Garfos e Facas)</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.forksAndKnives} pares</strong>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                    <Wine className="w-4 h-4 text-zinc-400" /> Copos & Taças
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Copos / Taças de Água</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.waterGlasses} un</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Tulipas de Chopp</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.beerTulips} un</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Guardanapos</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{stats.confirmedCount * 8} folhas</strong>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-zinc-400" /> Rechauds & Mesas
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Rechauds Inox (Sincronizado)</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.rechauds} cubas</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Pastilhas Álcool Gel ({config.durationHours}h)</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.fuelPastesNeeded} un</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Jogos de Mesas ({config.tableCapacity} lug.)</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.guestTablesNeeded} jogos ({calculatedMaterials.guestChairsNeeded} cad.)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: CENTRO DE CUSTOS (100% SINCRONIZADO & AUTOMÁTICO) */}
        {/* ============================================================ */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Centro de Custos Integrado & Sincronizado</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Custo Real com Confirmados: <strong>R$ {budget.grandTotalConfirmed.toLocaleString('pt-BR')}</strong> | Se Todos Forem: <strong>R$ {budget.grandTotalAll.toLocaleString('pt-BR')}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                    Economia RSVP: <strong>R$ {budget.rsvpSavings.toLocaleString('pt-BR')}</strong>
                  </span>
                  <button
                    onClick={() => handleOpenExpenseModal(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Despesa Manual</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Custos Sincronizados em Tempo Real (Base Salvador):</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Locações, Espaço & Brinquedos</span>
                    <strong className="text-base block mt-1">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500">{rentals.length} itens cadastrados</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Cardápio (Receitas & Insumos)</span>
                    <strong className="text-base block mt-1 text-emerald-600 dark:text-emerald-400">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500">Se todos forem: R$ {budget.foodCostAll.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Bebidas Detalhadas & Gelo</span>
                    <strong className="text-base block mt-1 text-amber-600 dark:text-amber-400">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500">Se todos forem: R$ {budget.beveragesCostAll.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Louças, Rechauds & Mesas</span>
                    <strong className="text-base block mt-1">R$ {budget.tablewareCostConfirmed.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500">{config.materialMode === 'rental' ? 'Modo Aluguel' : 'Descartáveis'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Despesas Manuais & Contratações Extras:</h4>
                  <span className="text-xs text-zinc-500 font-medium">Subtotal Manual: R$ {budget.manualTotalActual.toLocaleString('pt-BR')}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                      <tr>
                        <th className="pb-2.5 font-medium">Descrição</th>
                        <th className="pb-2.5 font-medium">Categoria</th>
                        <th className="pb-2.5 font-medium">Previsto</th>
                        <th className="pb-2.5 font-medium">Real / Pago</th>
                        <th className="pb-2.5 font-medium">Status</th>
                        <th className="pb-2.5 font-medium text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {manualExpenses.map(expense => (
                        <tr key={expense.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                          <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{expense.description}</td>
                          <td className="py-3 text-zinc-500">{expense.category}</td>
                          <td className="py-3 text-zinc-600 dark:text-zinc-300">R$ {Number(expense.estimated || 0).toLocaleString('pt-BR')}</td>
                          <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">
                            R$ {Number(expense.actual || expense.estimated || 0).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              expense.paid ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}>
                              {expense.paid ? 'Pago' : 'Pendente'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenExpenseModal(expense)}
                                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                title="Editar despesa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="p-1 rounded text-zinc-400 hover:text-rose-600"
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
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: CHECKLIST */}
        {/* ============================================================ */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <h2 className="text-base font-semibold tracking-tight">Linha do Tempo & Tarefas</h2>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                {stats.completedChecklist} de {checklist.length} concluídas ({stats.checklistProgress}%)
              </p>

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
        {/* TAB 9: CONFIGURAÇÕES GERAIS */}
        {/* ============================================================ */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <h2 className="text-base font-semibold tracking-tight">Parâmetros Gerais do Evento</h2>
              <p className="text-xs text-zinc-500 mt-1 mb-5">Configure dados do aniversariante e regras do espaço em Salvador</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Nome do Aniversariante</label>
                  <input
                    type="text"
                    value={config.celebrantName}
                    onChange={(e) => setConfig({ ...config, celebrantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Idade Comemorada</label>
                  <input
                    type="number"
                    value={config.age}
                    onChange={(e) => setConfig({ ...config, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Data da Festa</label>
                  <input
                    type="date"
                    value={config.date}
                    onChange={(e) => setConfig({ ...config, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Duração (horas)</label>
                  <input
                    type="number"
                    value={config.durationHours}
                    onChange={(e) => setConfig({ ...config, durationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Tipo de Local</label>
                  <select
                    value={config.locationType}
                    onChange={(e) => setConfig({ ...config, locationType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  >
                    <option value="home">Espaço Próprio / Condomínio</option>
                    <option value="rented">Espaço / Salão Locado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Nome do Salão / Local</label>
                  <input
                    type="text"
                    value={config.venueName}
                    onChange={(e) => setConfig({ ...config, venueName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={config.venueAddress}
                    onChange={(e) => setConfig({ ...config, venueAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* MODAL 1: EDITAR / ADICIONAR PRATO COM MOTOR DE INSUMOS & SALVADOR */}
      {/* ============================================================ */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-2xl rounded-2xl border p-5 shadow-xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">{editingMenuItem ? 'Editar Prato & Ficha Técnica' : 'Novo Prato no Cardápio'}</h3>
              </div>
              <button onClick={() => setMenuModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
            </div>

            {/* SELETOR DE TEMPLATES RÁPIDOS */}
            <div className="mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                Preencher com um Template Pronto de Salvador:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_DISH_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyDishTemplate(tpl)}
                    className="px-2 py-0.5 rounded text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 text-zinc-700 dark:text-zinc-300"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Nome do Prato</label>
                  <input
                    type="text"
                    name="name"
                    id="menu-item-name-input"
                    required
                    defaultValue={editingMenuItem?.name || ''}
                    placeholder="Ex: Picanha na Brasa com Alho"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent font-medium"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria do Prato</label>
                  <select name="category" id="menu-item-category-input" defaultValue={editingMenuItem?.category || 'protein'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="protein" className="dark:bg-zinc-900">Proteína / Prato Principal</option>
                    <option value="side" className="dark:bg-zinc-900">Guarnição / Acompanhamento</option>
                    <option value="starter" className="dark:bg-zinc-900">Entrada / Salgado / Canapé</option>
                    <option value="dessert" className="dark:bg-zinc-900">Sobremesa / Bolo / Doces</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isHot"
                    id="menu-item-ishot-input"
                    defaultChecked={editingMenuItem ? editingMenuItem.isHot : true}
                    className="rounded border-zinc-300"
                  />
                  <span><strong>Prato servido quente</strong> (adiciona automaticamente rechaud inox e pastilhas de aquecimento)</span>
                </label>
              </div>

              {/* LISTA DINÂMICA DE INGREDIENTES COM AUTO-PREENCHIMENTO */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-xs flex items-center gap-1.5">
                      <span>Ingredientes / Insumos</span>
                      <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/50">
                        Auto-calculado por pessoa
                      </span>
                    </h4>
                    <span className="text-[11px] text-zinc-400">Digite o nome do insumo (ex: picanha, queijo coalho, arroz, camarão) e os valores se ajustam sozinhos.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoApplySalvadorPricing}
                      title="Aplicar preços médios de Salvador em todos os itens"
                      className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Preços Salvador</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddIngredientRow}
                      className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Insumo</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  {editingIngredients.map((ing, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          placeholder="Ex: Picanha Bovina, Camarão, Queijo Coalho..."
                          value={ing.name}
                          onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs font-medium"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[9px] text-zinc-400 block sm:hidden">Qtd/pessoa</label>
                        <input
                          type="number"
                          step="0.005"
                          placeholder="Qtd/pess"
                          value={ing.amountPerPerson}
                          onChange={(e) => handleUpdateIngredient(idx, 'amountPerPerson', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                        />
                      </div>
                      <div className="w-20">
                        <select
                          value={ing.unit}
                          onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                        >
                          <option value="kg" className="dark:bg-zinc-900">kg</option>
                          <option value="L" className="dark:bg-zinc-900">L</option>
                          <option value="un" className="dark:bg-zinc-900">un</option>
                          <option value="pct" className="dark:bg-zinc-900">pct</option>
                        </select>
                      </div>
                      <div className="w-28">
                        <label className="text-[9px] text-zinc-400 block sm:hidden">R$ Salvador</label>
                        <input
                          type="number"
                          step="0.10"
                          placeholder="R$ Preço/un"
                          value={ing.unitCost}
                          onChange={(e) => handleUpdateIngredient(idx, 'unitCost', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredientRow(idx)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500"
                        title="Remover insumo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {editingIngredients.length === 0 && (
                    <p className="text-[11px] text-zinc-400 italic py-2 text-center">Nenhum ingrediente adicionado. Clique no botão acima para incluir.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setMenuModalOpen(false)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium">Salvar Prato</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: EDITAR / ADICIONAR BEBIDA */}
      {/* ============================================================ */}
      {beverageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">{editingBeverage ? 'Editar Bebida / Insumo' : 'Nova Bebida'}</h3>
            <form onSubmit={handleSaveBeverage} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome da Bebida</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingBeverage?.name || ''}
                  placeholder="Ex: Suco de Maracujá da Fruta"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingBeverage?.category || 'juice'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="soda" className="dark:bg-zinc-900">Refrigerante</option>
                    <option value="juice" className="dark:bg-zinc-900">Suco / Água de Coco</option>
                    <option value="water" className="dark:bg-zinc-900">Água Mineral</option>
                    <option value="alcohol" className="dark:bg-zinc-900">Alcoólica (Chopp/Vinho)</option>
                    <option value="ice" className="dark:bg-zinc-900">Gelo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Consumo (ml/pessoa/hora)</label>
                  <input
                    type="number"
                    name="mlPerPersonPerHour"
                    required
                    defaultValue={editingBeverage?.mlPerPersonPerHour || 60}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Preço Médio por Litro (R$)</label>
                  <input
                    type="number"
                    step="0.10"
                    name="unitCostPerLiter"
                    required
                    defaultValue={editingBeverage?.unitCostPerLiter || 6.00}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Tipo de Embalagem</label>
                  <input
                    type="text"
                    name="unitPackage"
                    defaultValue={editingBeverage?.unitPackage || 'Garrafa 2L'}
                    placeholder="Ex: Fardo Lata, Garrafa 2L"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Volume da Embalagem (Litros ou kg)</label>
                <input
                  type="number"
                  step="0.05"
                  name="packageVolume"
                  defaultValue={editingBeverage?.packageVolume || 2.0}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setBeverageModalOpen(false)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium">Salvar Bebida</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CONVIDADO */}
      {/* ============================================================ */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">{editingGuest ? 'Editar Convidado' : 'Novo Convidado'}</h3>
            <form onSubmit={handleSaveGuest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  defaultValue={editingGuest?.name || ''}
                  name="name"
                  placeholder="Ex: Carlos Oliveira"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Grupo / Vínculo</label>
                  <select name="group" defaultValue={editingGuest?.group || 'Família'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    {PRESET_GROUPS.map((grp, i) => (
                      <option key={i} value={grp} className="dark:bg-zinc-900">{grp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Faixa Etária</label>
                  <select name="category" defaultValue={editingGuest?.category || 'adult'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="adult" className="dark:bg-zinc-900">Adulto (cota integral)</option>
                    <option value="child_6_11" className="dark:bg-zinc-900">Criança 6-11 anos (0.5 cota)</option>
                    <option value="child_0_5" className="dark:bg-zinc-900">Criança 0-5 anos (isento)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Confirmação RSVP</label>
                  <select name="status" defaultValue={editingGuest?.status || 'pending'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="confirmed" className="dark:bg-zinc-900">Confirmado</option>
                    <option value="pending" className="dark:bg-zinc-900">Pendente</option>
                    <option value="declined" className="dark:bg-zinc-900">Recusado</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="drinksAlcohol" defaultChecked={editingGuest ? editingGuest.drinksAlcohol : true} className="rounded border-zinc-300" />
                    <span>Consome Bebidas Alcoólicas</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1.5">Restrições Alimentares</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_RESTRICTIONS.map((res, i) => {
                    const isSelected = selectedRestrictions.includes(res);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (res === 'Sem restrições') {
                            setSelectedRestrictions(['Sem restrições']);
                          } else {
                            const withoutSem = selectedRestrictions.filter(r => r !== 'Sem restrições');
                            if (isSelected) {
                              const filtered = withoutSem.filter(r => r !== res);
                              setSelectedRestrictions(filtered.length === 0 ? ['Sem restrições'] : filtered);
                            } else {
                              setSelectedRestrictions([...withoutSem, res]);
                            }
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${
                          isSelected ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' : 'border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {res}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  name="customRestriction"
                  placeholder="Outra restrição específica (ex: Alergia a frutos do mar)"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setGuestModalOpen(false)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: LOCAÇÃO, BRINQUEDOS E MOBILIÁRIO */}
      {/* ============================================================ */}
      {rentalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">{editingRental ? 'Editar Locação' : 'Nova Locação'}</h3>
            <form onSubmit={handleSaveRental} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome do Item</label>
                <input type="text" name="name" required defaultValue={editingRental?.name || ''} placeholder="Ex: Cama Elástica 3m" className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingRental?.category || 'toy'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="toy" className="dark:bg-zinc-900">Brinquedo</option>
                    <option value="furniture" className="dark:bg-zinc-900">Mobiliário</option>
                    <option value="venue" className="dark:bg-zinc-900">Espaço</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Custo Total (R$)</label>
                  <input type="number" step="0.01" name="cost" required defaultValue={editingRental?.cost || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Fornecedor</label>
                <input type="text" name="supplier" defaultValue={editingRental?.supplier || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Observações de Montagem / Devolução</label>
                <input type="text" name="notes" defaultValue={editingRental?.notes || ''} placeholder="Ex: Montagem 1h antes do início" className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasMonitor" defaultChecked={editingRental ? editingRental.hasMonitor : false} className="rounded border-zinc-300" />
                  <span>Inclui monitor / operador</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setRentalModalOpen(false)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium">Salvar Locação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: DESPESA MANUAL */}
      {/* ============================================================ */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">{editingExpense ? 'Editar Despesa' : 'Nova Despesa'}</h3>
            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Descrição</label>
                <input type="text" name="description" required defaultValue={editingExpense?.description || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingExpense?.category || 'Decoração'} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="Decoração" className="dark:bg-zinc-900">Decoração</option>
                    <option value="Atração / Som" className="dark:bg-zinc-900">Atração / Som</option>
                    <option value="Mão de Obra" className="dark:bg-zinc-900">Mão de Obra</option>
                    <option value="Fotografia" className="dark:bg-zinc-900">Fotografia</option>
                    <option value="Outros" className="dark:bg-zinc-900">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Valor Estimado (R$)</label>
                  <input type="number" step="0.01" name="estimated" required defaultValue={editingExpense?.estimated || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Valor Real / Pago (R$)</label>
                <input type="number" step="0.01" name="actual" defaultValue={editingExpense?.actual || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="paid" defaultChecked={editingExpense ? editingExpense.paid : false} className="rounded border-zinc-300" />
                  <span>Despesa quitada</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setExpenseModalOpen(false)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: BACKUP E DIAGNÓSTICO */}
      {/* ============================================================ */}
      {backupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-2xl rounded-2xl border p-5 shadow-xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">Backup, Diagnóstico & Recuperação</h3>
              </div>
              <button onClick={() => setBackupModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleExportBackup}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-xs font-medium"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Exportar Backup (.json)</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-medium cursor-pointer">
                <Upload className="w-4 h-4 text-zinc-500" />
                <span>Restaurar de Arquivo JSON</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Memória Local ({rawLocalStorageDump.length} registros):
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {rawLocalStorageDump.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="truncate">
                      <strong className="text-zinc-900 dark:text-zinc-100 block font-mono text-[11px]">{item.key}</strong>
                      <span className="text-[10px] text-zinc-400 truncate block max-w-md">{item.preview}...</span>
                    </div>
                    <button
                      onClick={() => handleRestoreFromKey(item.full)}
                      className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 text-[10px] font-medium shrink-0"
                    >
                      Carregar Desta Chave
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-zinc-100 dark:border-zinc-800 mt-6">
              <button onClick={() => setBackupModalOpen(false)} className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 7: LINK DE RSVP */}
      {rsvpSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-sm rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-1">Link de RSVP</h3>
            <p className="text-xs text-zinc-500 mb-4">Compartilhe o endereço com seus convidados.</p>
            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-mono break-all mb-4">
              https://festplanner.app/rsvp/{encodeURIComponent((config.celebrantName || 'festa').toLowerCase().replace(/\s+/g, '-'))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast('Link copiado!');
                  setRsvpSimModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium"
              >
                Copiar Link
              </button>
              <button onClick={() => setRsvpSimModalOpen(false)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs">Fechar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
