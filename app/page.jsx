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
  Layers,
  Sun,
  Moon,
  ChevronRight,
  Check,
  Building,
  Cake,
  ArrowUpDown,
  Database,
  Upload,
  Cloud,
  SlidersHorizontal,
  Copy,
  MessageSquareQuote
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
  { keywords: ['mandioca', 'aipim'], defaultAmount: 0.12, unit: 'kg', defaultCost: 7.50, category: 'Acompanhamentos' },
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
    id: 'd1',
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
    id: 'd2',
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
    id: 'd3',
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
    id: 'd4',
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
    id: 'd5',
    name: 'Buffet de Mini Salgados Finos & Canapés',
    category: 'starter',
    isHot: false,
    ingredients: [
      { name: 'Mini Salgados & Quiches Sortidos', amountPerPerson: 10, unit: 'un', unitCost: 1.40 }
    ]
  },
  {
    id: 'd6',
    name: 'Bolo Comemorativo & Brigadeiros Gourmet',
    category: 'dessert',
    isHot: false,
    ingredients: [
      { name: 'Bolo Artesanal Recheado', amountPerPerson: 0.10, unit: 'kg', unitCost: 75.00 },
      { name: 'Docinhos Gourmet (Brigadeiro / Ninho)', amountPerPerson: 5, unit: 'un', unitCost: 2.20 }
    ]
  }
];

function findIngredientIntel(ingredientName) {
  if (!ingredientName || typeof ingredientName !== 'string') return null;
  const clean = ingredientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const item of SALVADOR_INGREDIENT_DATABASE) {
    for (const kw of item.keywords) {
      const cleanKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (clean.includes(cleanKw)) {
        return item;
      }
    }
  }
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

  // Navegação
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cateringSubTab, setCateringSubTab] = useState('menu'); // 'menu' | 'beverages'
  const [structureSubTab, setStructureSubTab] = useState('rentals'); // 'rentals' | 'tableware'

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventEditModalOpen, setEventEditModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sincronização na Nuvem
  const [cloudSyncStatus, setCloudSyncStatus] = useState('syncing');
  const isInitialLoadDone = useRef(false);

  // Ordenação de convidados
  const [guestSortField, setGuestSortField] = useState('name');
  const [guestSortAsc, setGuestSortAsc] = useState(true);

  // Modais de Controle
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [selectedRestrictions, setSelectedRestrictions] = useState(['Sem restrições']);

  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishIngredients, setDishIngredients] = useState([]);

  const [beverageModalOpen, setBeverageModalOpen] = useState(false);
  const [editingBeverage, setEditingBeverage] = useState(null);

  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [rsvpSimModalOpen, setRsvpSimModalOpen] = useState(false);
  const [guestMessageModalOpen, setGuestMessageModalOpen] = useState(false);
  const [viewingGuestMessage, setViewingGuestMessage] = useState(null);

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [rawLocalStorageDump, setRawLocalStorageDump] = useState([]);

  // PROTEÇÃO DE ACESSO AO PAINEL DO ANFITRIÃO (PIN DE SEGURANÇA)
  const [hostPin, setHostPin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('festplanner_host_pin') || '1234';
    }
    return '1234';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('festplanner_auth') === 'true';
    }
    return false;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [changePinModalOpen, setChangePinModalOpen] = useState(false);
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [newPinValue, setNewPinValue] = useState('');
  const [confirmNewPinValue, setConfirmNewPinValue] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === hostPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('festplanner_auth', 'true');
      setPinError(false);
      showToast('Acesso liberado!');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogoutHost = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('festplanner_auth');
    showToast('Painel bloqueado com sucesso.');
  };

  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    if (currentPinAttempt.trim() !== hostPin) {
      showToast('PIN atual incorreto.');
      return;
    }
    if (!newPinValue || newPinValue.trim().length < 4) {
      showToast('O novo PIN deve conter no mínimo 4 dígitos.');
      return;
    }
    if (newPinValue.trim() !== confirmNewPinValue.trim()) {
      showToast('A confirmação do novo PIN não confere.');
      return;
    }

    const updatedPin = newPinValue.trim();
    setHostPin(updatedPin);
    if (typeof window !== 'undefined') {
      localStorage.setItem('festplanner_host_pin', updatedPin);
    }
    setCurrentPinAttempt('');
    setNewPinValue('');
    setConfirmNewPinValue('');
    setChangePinModalOpen(false);
    showToast('PIN alterado com sucesso!');
  };

  // Carregamento do Postgres com fallback em localStorage
  useEffect(() => {
    async function loadData() {
      try {
        setCloudSyncStatus('syncing');
        const res = await fetch('/api/event');
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          if (d.config) setConfig(d.config);
          if (d.guests && d.guests.length > 0) setGuests(d.guests);
          if (d.menu && d.menu.length > 0) setMenu(d.menu);
          if (d.beverages && d.beverages.length > 0) setBeverages(d.beverages);
          if (d.rentals && d.rentals.length > 0) setRentals(d.rentals);
          if (d.manualExpenses && d.manualExpenses.length > 0) setManualExpenses(d.manualExpenses);
          if (d.checklist && d.checklist.length > 0) setChecklist(d.checklist);
          setCloudSyncStatus('synced');
          isInitialLoadDone.current = true;
          setMounted(true);
          return;
        }
      } catch (err) {
        console.warn('Postgres fetch fallback:', err);
      }

      try {
        const savedGuests = localStorage.getItem('festplanner_guests_v3') || localStorage.getItem('festplanner_guests');
        if (savedGuests) setGuests(JSON.parse(savedGuests));
        const savedConfig = localStorage.getItem('festplanner_config_v3') || localStorage.getItem('festplanner_config');
        if (savedConfig) setConfig(JSON.parse(savedConfig));
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

    loadData();
  }, []);

  // Auto-save no Postgres & LocalStorage
  useEffect(() => {
    if (!mounted || !isInitialLoadDone.current) return;

    try {
      localStorage.setItem('festplanner_config_v3', JSON.stringify(config));
      localStorage.setItem('festplanner_guests_v3', JSON.stringify(guests));
      localStorage.setItem('festplanner_menu_v3', JSON.stringify(menu));
      localStorage.setItem('festplanner_beverages_v3', JSON.stringify(beverages));
      localStorage.setItem('festplanner_rentals_v3', JSON.stringify(rentals));
      localStorage.setItem('festplanner_manual_expenses_v3', JSON.stringify(manualExpenses));
      localStorage.setItem('festplanner_checklist_v3', JSON.stringify(checklist));
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

  // Cálculos Estatísticos de Presença
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
    const allKids05 = guests.filter(g => g.category === 'child_0_5').length;
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

  // Cálculos do Cardápio & Insumos das Receitas (Confirmados vs. Todos)
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

  // Cálculos de Bebidas Detalhadas (Confirmados vs. Todos)
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

  // Cálculos de Louças, Rechauds, Mesas e Descartáveis
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

  // Centro de Custos Consolidado e Sincronizado
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

  // --- CRUD CONVIDADOS ---
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

  // --- CRUD DO CARDÁPIO & INSUMOS SALVADOR ---
  const handleOpenDishModal = (dish = null) => {
    setEditingDish(dish);
    if (dish && Array.isArray(dish.ingredients)) {
      setDishIngredients(JSON.parse(JSON.stringify(dish.ingredients)));
    } else {
      setDishIngredients([
        { name: 'Picanha Bovina Resfriada', amountPerPerson: 0.18, unit: 'kg', unitCost: 74.90 }
      ]);
    }
    setDishModalOpen(true);
  };

  const handleAddIngredientRow = () => {
    setDishIngredients([
      ...dishIngredients,
      { name: '', amountPerPerson: 0.10, unit: 'kg', unitCost: 25.00 }
    ]);
  };

  const handleRemoveIngredientRow = (index) => {
    setDishIngredients(dishIngredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index, field, value) => {
    const updated = [...dishIngredients];
    updated[index][field] = value;

    if (field === 'name' && value && value.length >= 3) {
      const intel = findIngredientIntel(value);
      if (intel) {
        updated[index].amountPerPerson = intel.defaultAmount;
        updated[index].unit = intel.unit;
        updated[index].unitCost = intel.defaultCost;
      }
    }

    setDishIngredients(updated);
  };

  const handleApplySalvadorPrices = () => {
    let matched = 0;
    const updated = dishIngredients.map(ing => {
      const intel = findIngredientIntel(ing.name);
      if (intel) {
        matched++;
        return { ...ing, amountPerPerson: intel.defaultAmount, unit: intel.unit, unitCost: intel.defaultCost };
      }
      return ing;
    });
    setDishIngredients(updated);
    showToast(`${matched} insumos calibrados com a média de Salvador!`);
  };

  const handleSaveDish = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.dishName.value.trim();
    const category = form.category.value;
    const isHot = form.isHot.checked;

    if (!name) return;

    const validIngredients = dishIngredients
      .filter(ing => ing.name && ing.name.trim().length > 0)
      .map(ing => ({
        name: ing.name.trim(),
        amountPerPerson: parseFloat(ing.amountPerPerson) || 0.1,
        unit: ing.unit || 'kg',
        unitCost: parseFloat(ing.unitCost) || 0
      }));

    if (editingDish) {
      setMenu(menu.map(d => d.id === editingDish.id ? { ...d, name, category, isHot, ingredients: validIngredients } : d));
      showToast('Prato atualizado e custos recalculados!');
    } else {
      const newDish = { id: 'dish-' + Date.now(), name, category, isHot, ingredients: validIngredients };
      setMenu([...menu, newDish]);
      showToast('Novo prato adicionado ao cardápio!');
    }

    setDishModalOpen(false);
    setEditingDish(null);
  };

  const handleDeleteDish = (id) => {
    setMenu(menu.filter(d => d.id !== id));
    showToast('Prato removido do cardápio.');
  };

  // --- CRUD BEBIDAS ---
  const handleOpenBeverageModal = (bev = null) => {
    setEditingBeverage(bev);
    setBeverageModalOpen(true);
  };

  const handleSaveBeverage = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const mlPerPersonPerHour = Number(form.mlPerPersonPerHour.value) || 0;
    const unitCostPerLiter = Number(form.unitCostPerLiter.value) || 0;
    const unitPackage = form.unitPackage.value.trim() || 'Garrafa 2L';
    const packageVolume = Number(form.packageVolume.value) || 1.0;

    if (!name) return;

    if (editingBeverage) {
      setBeverages(beverages.map(b => b.id === editingBeverage.id ? { ...b, name, category, mlPerPersonPerHour, unitCostPerLiter, unitPackage, packageVolume } : b));
      showToast('Bebida atualizada!');
    } else {
      const newBev = { id: 'bev-' + Date.now(), name, category, mlPerPersonPerHour, unitCostPerLiter, unitPackage, packageVolume };
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

  // --- CRUD LOCAÇÕES ---
  const handleOpenRentalModal = (rental = null) => {
    setEditingRental(rental);
    setRentalModalOpen(true);
  };

  const handleSaveRental = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const cost = Number(form.cost.value) || 0;
    const supplier = form.supplier.value.trim();
    const notes = form.notes.value.trim();
    const hasMonitor = form.hasMonitor ? form.hasMonitor.checked : false;

    if (!name) return;

    if (editingRental) {
      setRentals(rentals.map(r => r.id === editingRental.id ? { ...r, name, category, cost, supplier, notes, hasMonitor } : r));
      showToast('Item de locação atualizado!');
    } else {
      const newRent = { id: 'rent-' + Date.now(), name, category, cost, supplier, notes, hasMonitor };
      setRentals([...rentals, newRent]);
      showToast('Item de locação adicionado!');
    }

    setRentalModalOpen(false);
    setEditingRental(null);
  };

  const handleDeleteRental = (id) => {
    setRentals(rentals.filter(r => r.id !== id));
    showToast('Item de locação removido.');
  };

  // --- CRUD DESPESAS MANUAIS ---
  const handleOpenExpenseModal = (exp = null) => {
    setEditingExpense(exp);
    setExpenseModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const form = e.target;
    const description = form.description.value.trim();
    const category = form.category.value;
    const estimated = Number(form.estimated.value) || 0;
    const actual = Number(form.actual.value) || 0;
    const paid = form.paid.checked;

    if (!description) return;

    if (editingExpense) {
      setManualExpenses(manualExpenses.map(m => m.id === editingExpense.id ? { ...m, description, category, estimated, actual, paid } : m));
      showToast('Despesa atualizada!');
    } else {
      const newExp = { id: 'exp-' + Date.now(), description, category, estimated, actual: actual || estimated, paid };
      setManualExpenses([...manualExpenses, newExp]);
      showToast('Despesa adicionada!');
    }

    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    setManualExpenses(manualExpenses.filter(m => m.id !== id));
    showToast('Despesa removida.');
  };

  // --- BACKUP & DIAGNÓSTICO ---
  const handleExportBackup = () => {
    const backupData = { version: '3.6', timestamp: new Date().toISOString(), config, guests, menu, beverages, rentals, manualExpenses, checklist };
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
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
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
      showToast('Estrutura de dados restaurada.');
    } catch (_) {
      showToast('Erro ao ler conteúdo desta chave.');
    }
  };

  // WhatsApp e Exportação
  const handleCopyWhatsAppInvite = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://seu-app.vercel.app';
    const link = `${origin}/rsvp`;
    const text = `🎉 *CONVITE ESPECIAL: ANIVERSÁRIO DE ${config.celebrantName.toUpperCase()}!* 🎂✨\n\nOlá! Gostaria muito de celebrar esse momento tão especial com você!\n\n📅 *Data:* ${config.date ? new Date(config.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' }) : 'A definir'}\n⏰ *Horário de Início:* A partir das ${config.startTime}\n📍 *Local:* ${config.venueName} (${config.venueAddress})\n\n👉 *Por favor, confirme sua presença (ou nos avise caso não possa ir) pelo link abaixo:*\n🔗 ${link}\n\nEsperamos você! 🥳`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Mensagem para WhatsApp copiada com sucesso!');
    }
  };

  const handleExportShoppingList = () => {
    const content = `
LISTA CONSOLIDADA DE COMPRAS & SUPRIMENTOS - FESTPLANNER PRO (SALVADOR)
Evento: Aniversário de ${config.celebrantName} (${config.age} anos)
Tema: ${config.theme || 'Não definido'}
Data: ${config.date} | Horário de Início: A partir das ${config.startTime}
Local: ${config.venueName} (${config.venueAddress})

INDICADORES DE PRESENÇA (RSVP)
------------------------------------------------------------
- Total de Convidados: ${stats.totalGuests}
- Confirmados: ${stats.confirmedCount} (${stats.confirmedAdults} adultos, ${stats.confirmedKids611} crianças 6-11, ${stats.confirmedKids05} crianças 0-5)
- Cotas Alimentares Ponderadas: ${stats.confirmedEaters.toFixed(1)} cotas
- Ausentes que informaram não comparecer: ${stats.declinedCount}

============================================================
1. INSUMOS DO BUFFET & RECEITAS (Apenas Confirmados)
============================================================
${calculatedMenu.itemsDetailed.map(dish => `
[${dish.name.toUpperCase()}]
${dish.ingredients.map(ing => `  - ${ing.name}: ${ing.qtyConfirmed} ${ing.unit} (~R$ ${ing.costConfirmed.toFixed(2)})`).join('\n')}
`).join('')}
Subtotal Estimado do Buffet: R$ ${calculatedMenu.totalCostConfirmed.toLocaleString('pt-BR')}

============================================================
2. BEBIDAS & GELO
============================================================
${calculatedBeverages.list.map(bev => `  - ${bev.name}: ${bev.totalLitersConfirmed} L (~${bev.packagesConfirmed} un de ${bev.unitPackage}) - R$ ${bev.totalCostConfirmed.toFixed(2)}`).join('\n')}
Subtotal Estimado de Bebidas: R$ ${calculatedBeverages.totalCostConfirmed.toLocaleString('pt-BR')}

============================================================
3. LOUÇAS, RECHAUDS & MOBILIÁRIO
============================================================
- Modo de Serviço: ${config.materialMode === 'rental' ? 'Aluguel de Porcelana/Vidro' : 'Descartáveis'}
- Pratos Principais: ${calculatedMaterials.mainPlates} un
- Pratos Sobremesa: ${calculatedMaterials.dessertPlates} un
- Garfos e Facas de Refeição: ${calculatedMaterials.forksAndKnives} pares
- Copos e Taças de Água/Refri: ${calculatedMaterials.waterGlasses} un
- Tulipas de Chopp/Cerveja: ${calculatedMaterials.beerTulips} un
- Rechauds Inox com Banho-Maria: ${calculatedMaterials.rechauds} cubas
- Pastilhas de Álcool Gel (${config.durationHours}h de queima): ${calculatedMaterials.fuelPastesNeeded} un
- Jogos de Mesas (${config.tableCapacity} lugares): ${calculatedMaterials.guestTablesNeeded} jogos (${calculatedMaterials.guestChairsNeeded} cadeiras)
Subtotal Estrutura: R$ ${calculatedMaterials.tablewareCostConfirmed.toLocaleString('pt-BR')}

============================================================
4. RESUMO FINANCEIRO & ECONOMIA DE RSVP
============================================================
- Custo Real Baseado Apenas nos Confirmados: R$ ${budget.grandTotalConfirmed.toLocaleString('pt-BR')}
- Custo Caso 100% dos Convidados Comparecessem: R$ ${budget.grandTotalAll.toLocaleString('pt-BR')}
- ECONOMIA REAL OBTIDA PELO RSVP: R$ ${budget.rsvpSavings.toLocaleString('pt-BR')}
- Custo Médio por Convidado Confirmado: R$ ${Math.round(budget.costPerConfirmed)} / pessoa
`.trim();

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Lista_Compras_${(config.celebrantName || 'evento').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Lista de compras baixada com sucesso!');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Cake className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Carregando FestPlanner Pro Salvador...</span>
        </div>
      </div>
    );
  }

  // TELA DE BLOQUEIO CASO O CONVIDADO APAGUE /rsvp DA URL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Cake className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Painel do Anfitrião</h2>
          <p className="text-xs text-zinc-400 mt-1 mb-5">
            Área restrita de gestão. Digite seu PIN de segurança para continuar:
          </p>

          <form onSubmit={handleVerifyPin} className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Digite o PIN de acesso"
              className={`w-full px-4 py-2.5 rounded-xl bg-zinc-950 border text-center text-sm font-mono tracking-widest text-white outline-none transition ${
                pinError ? 'border-rose-500 text-rose-300' : 'border-zinc-800 focus:border-emerald-500'
              }`}
            />
            {pinError && (
              <p className="text-[11px] text-rose-400 font-medium animate-shake">
                PIN incorreto. Tente novamente.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
            >
              Acessar Painel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <a
              href="/rsvp"
              className="text-xs text-zinc-400 hover:text-emerald-400 transition underline"
            >
              É um convidado? Clique aqui para o Convite & RSVP
            </a>
          </div>
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
    <div className={`min-h-screen font-sans antialiased flex ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50/80 text-zinc-900'}`}>
      
      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2.5 rounded-xl shadow-xl border border-zinc-800 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. SIDEBAR LATERAL FIXA */}
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
                  Salvador Pro
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
              <span>A partir das {config.startTime}</span>
              <span className="px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 font-medium text-[10px] text-zinc-700 dark:text-zinc-300">
                {config.durationHours} horas
              </span>
            </div>
            {config.theme && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1.5 truncate">
                Tema: {config.theme}
              </p>
            )}
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
                    <div className="text-left">
                      <span className="block leading-none">{item.label}</span>
                      {item.subtext && !isActive && (
                        <span className="text-[10px] text-zinc-400 font-normal block mt-0.5">{item.subtext}</span>
                      )}
                    </div>
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

          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
              <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'synced' ? 'text-emerald-500' : 'text-zinc-400'}`} />
              {cloudSyncStatus === 'synced' ? 'Nuvem Conectada' : cloudSyncStatus === 'saving' ? 'Gravando...' : 'Nuvem Offline'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={openDiagnostics}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                title="Backup e Diagnóstico"
              >
                <Database className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. CORPO PRINCIPAL */}
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
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200/50 dark:border-zinc-700/60"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>A partir das {config.startTime}</span>
              <Edit2 className="w-2.5 h-2.5 text-zinc-400 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportShoppingList}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Relatório Operacional</span>
            </button>

            <button
              onClick={() => setRsvpSimModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Link RSVP</span>
            </button>

            <button
              onClick={() => handleOpenGuestModal(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm hover:opacity-90 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Convidado</span>
            </button>
          </div>
        </header>

        {/* Conteúdo das Abas */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          
          {/* ============================================================ */}
          {/* TAB 1: VISÃO GERAL (DASHBOARD) */}
          {/* ============================================================ */}
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
                    {config.theme && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        Tema: {config.theme}
                      </p>
                    )}
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {config.venueName} • {config.venueAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 transition"
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
                  <span className="text-xs text-zinc-500">Ausentes Informados</span>
                  <div className="mt-2 text-2xl font-bold text-rose-500">
                    {stats.declinedCount}
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400">
                    {stats.pendingCount} convites aguardando
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

              {/* Comparativo de Resumo Rápido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-tight">Status do Buffet & Insumos</h3>
                    <button onClick={() => setActiveTab('catering_hub')} className="text-xs text-emerald-500 font-medium hover:underline">Ver receitas</button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Pratos Quentes Registrados</span>
                      <strong>{stats.hotDishesCount} opções ({stats.hotDishesCount} rechauds necessários)</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Custo Insumos (Confirmados)</span>
                      <strong className="text-emerald-600 font-bold">R$ {calculatedMenu.totalCostConfirmed.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-500">Custo Insumos (100% Presença)</span>
                      <span className="text-zinc-400">R$ {calculatedMenu.totalCostAll.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold tracking-tight">Estrutura de Mesa & Refrigeração</h3>
                    <button onClick={() => setActiveTab('structure_hub')} className="text-xs text-emerald-500 font-medium hover:underline">Ver louças</button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Jogos de Mesas / Cadeiras</span>
                      <strong>{calculatedMaterials.guestTablesNeeded} mesas ({calculatedMaterials.guestChairsNeeded} assentos)</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Pratos de Refeição (+15% margem)</span>
                      <strong>{calculatedMaterials.mainPlates} unidades</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-500">Pastilhas de Álcool Gel Rechaud</span>
                      <strong>{calculatedMaterials.fuelPastesNeeded} pastilhas ({config.durationHours}h)</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: CONVIDADOS & RSVP COM AUSÊNCIAS E RECADOS */}
          {/* ============================================================ */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-base font-bold tracking-tight">Lista de Convidados & Confirmações</h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      {stats.confirmedCount} confirmados, {stats.pendingCount} aguardando resposta e {stats.declinedCount} ausentes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1.5 hover:bg-emerald-500 transition"
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
                        <th onClick={() => handleSortGuests('name')} className="pb-2.5 font-medium cursor-pointer hover:text-emerald-500">
                          Nome
                        </th>
                        <th onClick={() => handleSortGuests('group')} className="pb-2.5 font-medium cursor-pointer hover:text-emerald-500">
                          Grupo
                        </th>
                        <th className="pb-2.5 font-medium">Faixa Etária</th>
                        <th onClick={() => handleSortGuests('status')} className="pb-2.5 font-medium cursor-pointer hover:text-emerald-500">
                          Status RSVP
                        </th>
                        <th className="pb-2.5 font-medium">Restrições Alimentares</th>
                        <th className="pb-2.5 font-medium">Recado / Motivo</th>
                        <th className="pb-2.5 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {sortedGuests.map(guest => (
                        <tr key={guest.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                          <td className="py-3 font-semibold">{guest.name}</td>
                          <td className="py-3 text-zinc-500">
                            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                              {guest.group || 'Geral'}
                            </span>
                          </td>
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
                              {guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'pending' ? 'Pendente' : 'Ausente (Não irá)'}
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
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 border border-transparent transition"
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

          {/* ============================================================ */}
          {/* TAB 3: GASTRONOMIA & BAR */}
          {/* ============================================================ */}
          {activeTab === 'catering_hub' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCateringSubTab('menu')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      cateringSubTab === 'menu'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Cardápio & Receitas Salvador
                  </button>
                  <button
                    onClick={() => setCateringSubTab('beverages')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      cateringSubTab === 'beverages'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Bebidas Detalhadas & Gelo
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {cateringSubTab === 'menu' && (
                    <button
                      onClick={() => handleOpenDishModal(null)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Prato / Ficha Técnica</span>
                    </button>
                  )}
                  {cateringSubTab === 'beverages' && (
                    <button
                      onClick={() => handleOpenBeverageModal(null)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nova Bebida</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SUB-ABA 1: CARDÁPIO E INSUMOS */}
              {cateringSubTab === 'menu' && (
                <div className="space-y-4">
                  <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold">Fichas Técnicas & Preços Salvador - BA</h3>
                          <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            Salvador Engine
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Insumos calculados para {stats.confirmedEaters.toFixed(1)} cotas alimentares confirmadas
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-400 block uppercase">Subtotal Buffet</span>
                        <strong className="text-lg font-bold text-emerald-600">R$ {calculatedMenu.totalCostConfirmed.toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>

                    {/* Templates de Salvador rápidos */}
                    <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 mb-5">
                      <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-2">
                        Pratos Rápidos de Salvador (Clique para Adicionar à Festa):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_DISH_TEMPLATES.map((tpl) => (
                          <button
                            key={tpl.id}
                            onClick={() => {
                              const exists = menu.some(m => m.name === tpl.name);
                              if (!exists) {
                                setMenu([...menu, { ...tpl, id: 'dish-' + Date.now() + Math.random().toString(36).substring(2, 5) }]);
                                showToast(`Prato "${tpl.name}" adicionado!`);
                              } else {
                                showToast('Este prato já consta no cardápio.');
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 text-zinc-700 dark:text-zinc-300 transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-emerald-500" />
                            <span>{tpl.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lista Completa dos Pratos */}
                    <div className="space-y-4">
                      {calculatedMenu.itemsDetailed.map(dish => (
                        <div key={dish.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-sm font-semibold">{dish.name}</strong>
                                {dish.isHot ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200/50 flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5" /> Quente (Rechaud Inox)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    Servido Frio
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{dish.category}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-emerald-600">
                                R$ {dish.itemCostConfirmed.toLocaleString('pt-BR')} <span className="text-[10px] text-zinc-400 font-normal">(Confirmados)</span>
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenDishModal(dish)}
                                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  title="Editar receita & ingredientes"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDish(dish.id)}
                                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                  title="Remover prato"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="overflow-x-auto pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="text-zinc-400 text-[11px]">
                                  <th className="pb-1.5 font-normal">Ingrediente / Insumo</th>
                                  <th className="pb-1.5 font-normal">Qtd / Pessoa</th>
                                  <th className="pb-1.5 font-normal">Preço Unit. (Salvador)</th>
                                  <th className="pb-1.5 font-normal">Total ({stats.confirmedEaters.toFixed(1)} cotas)</th>
                                  <th className="pb-1.5 font-normal text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40 text-zinc-600 dark:text-zinc-300">
                                {(dish.ingredients || []).map((ing, i) => (
                                  <tr key={i}>
                                    <td className="py-1.5 font-medium text-zinc-800 dark:text-zinc-200">{ing.name}</td>
                                    <td className="py-1.5">{ing.amountPerPerson} {ing.unit}</td>
                                    <td className="py-1.5">R$ {Number(ing.unitCost || 0).toFixed(2)} / {ing.unit}</td>
                                    <td className="py-1.5 font-semibold text-zinc-900 dark:text-zinc-100">{ing.qtyConfirmed} {ing.unit}</td>
                                    <td className="py-1.5 text-right font-semibold text-zinc-900 dark:text-zinc-100">R$ {Number(ing.costConfirmed || 0).toFixed(2)}</td>
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

              {/* SUB-ABA 2: BEBIDAS E GELO */}
              {cateringSubTab === 'beverages' && (
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold">Discriminação de Bebidas, Sucos & Gelo</h3>
                      <p className="text-xs text-zinc-500">Estimativas dimensionadas para {config.durationHours} horas de celebração</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-zinc-400 block uppercase">Total Bebidas (Confirmados)</span>
                      <strong className="text-lg font-bold text-emerald-600">R$ {calculatedBeverages.totalCostConfirmed.toLocaleString('pt-BR')}</strong>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                          <th className="pb-2">Bebida / Insumo</th>
                          <th className="pb-2">Consumo por Hora</th>
                          <th className="pb-2">Volume Total</th>
                          <th className="pb-2">Embalagens Sugeridas</th>
                          <th className="pb-2">Custo Unitário</th>
                          <th className="pb-2 text-right">Custo Total</th>
                          <th className="pb-2 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {calculatedBeverages.list.map(bev => (
                          <tr key={bev.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                            <td className="py-2.5 font-medium">{bev.name}</td>
                            <td className="py-2.5 text-zinc-500">{bev.mlPerPersonPerHour} ml/h</td>
                            <td className="py-2.5 font-bold">{bev.totalLitersConfirmed} L</td>
                            <td className="py-2.5 text-zinc-500">~{bev.packagesConfirmed} un ({bev.unitPackage})</td>
                            <td className="py-2.5 text-zinc-500">R$ {Number(bev.unitCostPerLiter).toFixed(2)}/L</td>
                            <td className="py-2.5 text-right font-bold text-emerald-600">R$ {bev.totalCostConfirmed.toLocaleString('pt-BR')}</td>
                            <td className="py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleOpenBeverageModal(bev)} className="p-1 rounded text-zinc-400 hover:text-zinc-600">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteBeverage(bev.id)} className="p-1 rounded text-zinc-400 hover:text-rose-500">
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
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: ESTRUTURA & LOCAÇÕES */}
          {/* ============================================================ */}
          {activeTab === 'structure_hub' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStructureSubTab('rentals')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold ${structureSubTab === 'rentals' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500'}`}
                  >
                    Locações de Brinquedos, Espaço & Móveis
                  </button>
                  <button
                    onClick={() => setStructureSubTab('tableware')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold ${structureSubTab === 'tableware' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500'}`}
                  >
                    Calculadora de Louças, Rechauds & Mesas
                  </button>
                </div>

                {structureSubTab === 'rentals' && (
                  <button
                    onClick={() => handleOpenRentalModal(null)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Locação</span>
                  </button>
                )}
              </div>

              {structureSubTab === 'rentals' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rentals.map(rental => (
                    <div key={rental.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] uppercase text-zinc-400 font-semibold">{rental.category}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenRentalModal(rental)} className="p-1 rounded text-zinc-400 hover:text-zinc-600">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteRental(rental.id)} className="p-1 rounded text-zinc-400 hover:text-rose-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-bold text-sm mt-1">{rental.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{rental.supplier || 'Fornecedor padrão'}</p>
                        {rental.notes && <p className="text-[11px] text-zinc-400 mt-1.5 italic">{rental.notes}</p>}
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                        <span>{rental.hasMonitor ? 'Monitor incluso' : 'Sem monitor'}</span>
                        <strong className="font-bold text-sm text-emerald-600">R$ {Number(rental.cost).toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {structureSubTab === 'tableware' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'} flex flex-wrap items-center justify-between gap-4 text-xs`}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Modo de Serviço:</span>
                      <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg font-medium">
                        <button
                          onClick={() => setConfig({ ...config, materialMode: 'rental' })}
                          className={`px-3 py-1 rounded-md transition ${config.materialMode === 'rental' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold' : 'text-zinc-500'}`}
                        >
                          Louças / Aluguel
                        </button>
                        <button
                          onClick={() => setConfig({ ...config, materialMode: 'disposable' })}
                          className={`px-3 py-1 rounded-md transition ${config.materialMode === 'disposable' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold' : 'text-zinc-500'}`}
                        >
                          Descartáveis
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                      <span>Margem segurança: <strong>+{config.safetyMarginPct}%</strong></span>
                      <span>Capacidade/mesa: <strong>{config.tableCapacity} lug.</strong></span>
                      <span>Total estimado: <strong className="text-emerald-600 text-xs">R$ {calculatedMaterials.tablewareCostConfirmed.toLocaleString('pt-BR')}</strong></span>
                    </div>
                  </div>

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
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: CENTRO DE CUSTOS & COMPRAS */}
          {/* ============================================================ */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold">Centro de Custos Integrado & Sincronizado</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Valores atualizados automaticamente com base no cardápio, bebidas e locações</p>
                  </div>
                  <button
                    onClick={() => handleOpenExpenseModal(null)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Despesa Avulsa</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Buffet (Receitas)</span>
                    <strong className="text-sm font-bold text-emerald-600">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500 block">Se 100%: R$ {budget.foodCostAll.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Bebidas & Gelo</span>
                    <strong className="text-sm font-bold text-amber-500">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500 block">Se 100%: R$ {budget.beveragesCostAll.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Locações & Espaço</span>
                    <strong className="text-sm font-bold">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500 block">Fixo independente de RSVP</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Louças & Estrutura</span>
                    <strong className="text-sm font-bold">R$ {budget.tablewareCostConfirmed.toLocaleString('pt-BR')}</strong>
                    <span className="text-[10px] text-zinc-500 block">Se 100%: R$ {budget.tablewareCostAll.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Despesas Manuais & Contratações Adicionais</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                          <th className="pb-2">Descrição</th>
                          <th className="pb-2">Categoria</th>
                          <th className="pb-2">Previsto</th>
                          <th className="pb-2">Realizado</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {manualExpenses.map(exp => (
                          <tr key={exp.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                            <td className="py-2.5 font-medium">{exp.description}</td>
                            <td className="py-2.5 text-zinc-500">{exp.category}</td>
                            <td className="py-2.5 text-zinc-500">R$ {Number(exp.estimated).toLocaleString('pt-BR')}</td>
                            <td className="py-2.5 font-bold">R$ {Number(exp.actual || exp.estimated).toLocaleString('pt-BR')}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${exp.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {exp.paid ? 'Pago' : 'Pendente'}
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleOpenExpenseModal(exp)} className="p-1 rounded text-zinc-400 hover:text-zinc-600">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteExpense(exp.id)} className="p-1 rounded text-zinc-400 hover:text-rose-500">
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
          {/* TAB 6: LINHA DO TEMPO & CRONOGRAMA */}
          {/* ============================================================ */}
          {activeTab === 'checklist' && (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'} space-y-3`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold">Linha do Tempo & Tarefas</h2>
                <span className="text-xs text-zinc-500">{stats.completedChecklist} de {checklist.length} tarefas concluídas ({stats.checklistProgress}%)</span>
              </div>
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

          {/* ============================================================ */}
          {/* TAB 7: CONFIGURAÇÕES GERAIS COM CAMPO DO TEMA */}
          {/* ============================================================ */}
          {activeTab === 'config' && (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'} space-y-6 text-xs`}>
              <div>
                <h2 className="text-base font-bold">Parâmetros Gerais do Evento</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Configure os dados do aniversariante, local e segurança de acesso.</p>
              </div>

              {/* BLOCO DE SEGURANÇA E PIN */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      🔒 Senha de Proteção do Painel (PIN)
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Impede que pessoas que receberem o link de RSVP acessem seus custos, fornecedores ou convidados ao apagar /rsvp da URL.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setChangePinModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                    >
                      Alterar PIN
                    </button>
                    <button
                      type="button"
                      onClick={handleLogoutHost}
                      className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition text-xs"
                    >
                      Bloquear Agora
                    </button>
                  </div>
                </div>
              </div>

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
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 mb-1">Título da Comemoração / Subtítulo do Convite</label>
                  <input
                    type="text"
                    value={config.theme}
                    placeholder="Ex: Aniversário de 36 anos, B-Day Sunset, Boteco do Diego..."
                    onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent font-medium text-emerald-600 dark:text-emerald-400"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    Este texto aparece com destaque logo abaixo do seu nome no convite digital (/rsvp).
                  </span>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Nome do Espaço</label>
                  <input
                    type="text"
                    value={config.venueName}
                    onChange={(e) => setConfig({ ...config, venueName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={config.venueAddress}
                    onChange={(e) => setConfig({ ...config, venueAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Margem de Segurança de Louças (%)</label>
                  <input
                    type="number"
                    value={config.safetyMarginPct}
                    onChange={(e) => setConfig({ ...config, safetyMarginPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Capacidade por Mesa (Lugares)</label>
                  <input
                    type="number"
                    value={config.tableCapacity}
                    onChange={(e) => setConfig({ ...config, tableCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAIS */}
      {/* ============================================================ */}

      {/* MODAL: ALTERAR PIN DE SEGURANÇA */}
      {changePinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>Alterar PIN de Acesso</span>
              </h3>
              <button onClick={() => setChangePinModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">PIN Atual</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  required
                  value={currentPinAttempt}
                  onChange={(e) => setCurrentPinAttempt(e.target.value)}
                  placeholder="Digite seu PIN atual"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-emerald-500 tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Novo PIN (mínimo 4 dígitos)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  required
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="Digite o novo PIN"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-emerald-500 tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Confirme o Novo PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  required
                  value={confirmNewPinValue}
                  onChange={(e) => setConfirmNewPinValue(e.target.value)}
                  placeholder="Repita o novo PIN"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-emerald-500 tracking-widest text-center"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setChangePinModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 transition"
                >
                  Confirmar Novo PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECADO DO CONVIDADO */}
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
                <span className="text-[10px] text-rose-300 uppercase font-semibold block mb-0.5">Motivo da ausência:</span>
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

      {/* MODAL: LINK DE RSVP E WHATSAPP */}
      {rsvpSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4">
            <h3 className="font-bold text-sm">Convite Digital & Link de RSVP</h3>
            <p className="text-xs text-zinc-400">
              Copie a mensagem formatada para WhatsApp ou compartilhe o QR Code direto com os convidados:
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
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
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

      {/* MODAL: EDIÇÃO DE HORÁRIO, DATA E TEMA */}
      {eventEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4 text-xs">
            <h3 className="font-bold text-sm">Editar Programação & Tema da Festa</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const theme = form.theme.value.trim();
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

              setConfig({ ...config, theme, date, startTime, endTime, durationHours: duration });
              setEventEditModalOpen(false);
              showToast(`Programação e tema atualizados com sucesso!`);
            }} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Tema / Estilo da Festa</label>
                <input
                  type="text"
                  name="theme"
                  defaultValue={config.theme}
                  placeholder="Ex: Sunset Chic & Boteco Moderno"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-semibold text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Data da Festa</label>
                <input type="date" name="date" defaultValue={config.date} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Início (Aparece no convite)</label>
                  <input type="time" name="startTime" defaultValue={config.startTime} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Término (Uso interno p/ cálculo)</label>
                  <input type="time" name="endTime" defaultValue={config.endTime} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setEventEditModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONVIDADO (CRIAR / EDITAR) */}
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
                    <option value="declined">Ausente (Não poderá ir)</option>
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
                <label className="block text-zinc-400 mb-1">Outra Restrição / Observação</label>
                <input type="text" name="customRestriction" placeholder="Ex: Alergia a camarão" className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setGuestModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRATO DO CARDÁPIO & INSUMOS SALVADOR */}
      {dishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm">{editingDish ? 'Editar Receita & Ficha Técnica' : 'Novo Prato & Ficha Técnica'}</h3>
                <span className="text-[10px] text-zinc-400">Calcula gramatura e custo baseado na média de Salvador - BA</span>
              </div>
              <button onClick={() => setDishModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Nome do Prato / Preparação</label>
                  <input
                    type="text"
                    name="dishName"
                    defaultValue={editingDish?.name || ''}
                    placeholder="Ex: Picanha ao Alho & Queijo Coalho"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingDish?.category || 'protein'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    <option value="protein">Proteína / Principal</option>
                    <option value="starter">Entrada / Salgados</option>
                    <option value="side">Guarnição / Acompanhamento</option>
                    <option value="dessert">Sobremesa / Doces</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isHot" defaultChecked={editingDish ? editingDish.isHot : true} className="rounded" />
                  <span className="font-medium text-zinc-200">Servido quente no buffet (adiciona cuba e álcool de Rechaud)</span>
                </label>
                <button
                  type="button"
                  onClick={handleApplySalvadorPrices}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-emerald-900 transition shrink-0"
                >
                  ⚡ Calibrar Preços Salvador
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-zinc-300">Ingredientes & Gramaturas por Pessoa:</label>
                  <button
                    type="button"
                    onClick={handleAddIngredientRow}
                    className="text-[11px] text-emerald-400 font-semibold hover:underline"
                  >
                    + Adicionar Insumo
                  </button>
                </div>

                <div className="space-y-2">
                  {dishIngredients.map((ing, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Picanha, Camarão, Aipim..."
                        value={ing.name}
                        onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                        className="flex-1 min-w-[140px] px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                      />
                      <div className="flex items-center gap-1 w-28">
                        <input
                          type="number"
                          step="0.005"
                          value={ing.amountPerPerson}
                          onChange={(e) => handleUpdateIngredient(idx, 'amountPerPerson', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs text-right"
                          title="Quantidade por pessoa"
                        />
                        <select
                          value={ing.unit}
                          onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                          className="px-1.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-[10px]"
                        >
                          <option value="kg">kg</option>
                          <option value="L">L</option>
                          <option value="un">un</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 w-28">
                        <span className="text-[10px] text-zinc-500">R$</span>
                        <input
                          type="number"
                          step="0.10"
                          value={ing.unitCost}
                          onChange={(e) => handleUpdateIngredient(idx, 'unitCost', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs text-right"
                          title="Preço unitário"
                        />
                        <span className="text-[10px] text-zinc-500">/{ing.unit}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredientRow(idx)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-500 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setDishModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 transition">Salvar Receita</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BEBIDA & GELO */}
      {beverageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-3 text-xs">
            <h3 className="font-bold text-sm">{editingBeverage ? 'Editar Bebida' : 'Nova Bebida / Gelo'}</h3>
            <form onSubmit={handleSaveBeverage} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Nome da Bebida</label>
                <input type="text" name="name" defaultValue={editingBeverage?.name || ''} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingBeverage?.category || 'soda'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    <option value="soda">Refrigerante</option>
                    <option value="juice">Suco / Água de Coco</option>
                    <option value="water">Água Mineral</option>
                    <option value="alcohol">Bebida Alcoólica (Chopp/Vinho)</option>
                    <option value="ice">Gelo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Consumo (ml/pessoa/hora)</label>
                  <input type="number" name="mlPerPersonPerHour" defaultValue={editingBeverage?.mlPerPersonPerHour || 80} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Preço / Litro (R$)</label>
                  <input type="number" step="0.10" name="unitCostPerLiter" defaultValue={editingBeverage?.unitCostPerLiter || 5.00} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Embalagem</label>
                  <input type="text" name="unitPackage" defaultValue={editingBeverage?.unitPackage || 'Garrafa 2L'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Volume Emb. (L)</label>
                  <input type="number" step="0.1" name="packageVolume" defaultValue={editingBeverage?.packageVolume || 2.0} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setBeverageModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOCAÇÃO & BRINQUEDO */}
      {rentalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-3 text-xs">
            <h3 className="font-bold text-sm">{editingRental ? 'Editar Item de Locação' : 'Nova Locação'}</h3>
            <form onSubmit={handleSaveRental} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Nome do Item / Serviço</label>
                <input type="text" name="name" defaultValue={editingRental?.name || ''} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingRental?.category || 'toy'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    <option value="toy">Brinquedo Infantil / Inflável</option>
                    <option value="venue">Espaço Físico / Salão</option>
                    <option value="furniture">Mobiliário (Mesas, Bistrôs)</option>
                    <option value="structure">Tendas & Gerador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Valor Contratado (R$)</label>
                  <input type="number" step="1.00" name="cost" defaultValue={editingRental?.cost || 300} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Fornecedor / Contato</label>
                  <input type="text" name="supplier" defaultValue={editingRental?.supplier || ''} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasMonitor" defaultChecked={editingRental ? editingRental.hasMonitor : false} className="rounded" />
                    <span>Monitor Incluso</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Observações / Horário de Montagem</label>
                <input type="text" name="notes" defaultValue={editingRental?.notes || ''} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setRentalModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DESPESA MANUAL */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-3 text-xs">
            <h3 className="font-bold text-sm">{editingExpense ? 'Editar Despesa' : 'Nova Despesa Manual'}</h3>
            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Descrição</label>
                <input type="text" name="description" defaultValue={editingExpense?.description || ''} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Categoria</label>
                  <select name="category" defaultValue={editingExpense?.category || 'Decoração'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white">
                    <option value="Decoração">Decoração</option>
                    <option value="Atração / Som">Atração / Som / DJ</option>
                    <option value="Mão de Obra">Mão de Obra (Garçons)</option>
                    <option value="Lembrancinhas">Lembrancinhas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Valor Previsto (R$)</label>
                  <input type="number" step="1.00" name="estimated" defaultValue={editingExpense?.estimated || 100} required className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Valor Real / Pago (R$)</label>
                  <input type="number" step="1.00" name="actual" defaultValue={editingExpense?.actual || editingExpense?.estimated || 100} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="paid" defaultChecked={editingExpense ? editingExpense.paid : true} className="rounded" />
                    <span>Já foi pago</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setExpenseModalOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BACKUP & RECUPERAÇÃO DA MEMÓRIA LOCAL */}
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
                Memória Local ({rawLocalStorageDump.length} registros encontrados no navegador):
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

    </div>
  );
}
