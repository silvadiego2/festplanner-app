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
  GlassWater,
  Coins,
  ChevronDown,
  Info
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

// --- DADOS INICIAIS DO EVENTO ---
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
  serviceType: "buffet",
  servesBeer: true,
  servesWine: true,
  safetyMarginPct: 15,
  materialMode: "rental", // 'rental' | 'disposable'
  rentalPlateCost: 1.8,
  rentalCutleryCost: 1.2,
  rentalGlassCost: 1.5,
  rentalRechaudCost: 45.0,
  rentalTableSetCost: 22.0, // jogo mesa + cadeiras
  tableCapacity: 4
};

// --- CARDÁPIO COM INGREDIENTES / RECEITA E CUSTO ESTIMADO POR UNIDADE DE MEDIDA ---
const INITIAL_MENU = [
  {
    id: '1',
    name: 'Dadinhos de Tapioca com Geléia de Pimenta',
    category: 'starter',
    isHot: true,
    ingredients: [
      { name: 'Tapioca Granulada', amountPerPerson: 0.05, unit: 'kg', unitPrice: 12.0 },
      { name: 'Queijo Coalho', amountPerPerson: 0.06, unit: 'kg', unitPrice: 48.0 },
      { name: 'Leite Integral', amountPerPerson: 0.08, unit: 'L', unitPrice: 5.5 },
      { name: 'Geléia de Pimenta Artesanal', amountPerPerson: 0.02, unit: 'kg', unitPrice: 35.0 }
    ]
  },
  {
    id: '2',
    name: 'Mini Coxinhas e Quibes Artesanais',
    category: 'starter',
    isHot: true,
    ingredients: [
      { name: 'Mini Salgados Finos Fritos/Assados', amountPerPerson: 5, unit: 'un', unitPrice: 0.85 }
    ]
  },
  {
    id: '3',
    name: 'Filé Mignon ao Molho Madeira e Champignon',
    category: 'main',
    isHot: true,
    ingredients: [
      { name: 'Filé Mignon Limpo', amountPerPerson: 0.16, unit: 'kg', unitPrice: 78.0 },
      { name: 'Vinho Tinto Seco & Molho Madeira', amountPerPerson: 0.03, unit: 'L', unitPrice: 28.0 },
      { name: 'Champignon Fatiado', amountPerPerson: 0.03, unit: 'kg', unitPrice: 42.0 }
    ]
  },
  {
    id: '4',
    name: 'Costela Suína com Barbecue de Goiabada',
    category: 'main',
    isHot: true,
    ingredients: [
      { name: 'Costelinha Suína Especial', amountPerPerson: 0.18, unit: 'kg', unitPrice: 32.0 },
      { name: 'Molho Barbecue com Goiabada', amountPerPerson: 0.04, unit: 'kg', unitPrice: 22.0 }
    ]
  },
  {
    id: '5',
    name: 'Arroz Biro-Biro Especial com Bacon e Palha',
    category: 'side',
    isHot: true,
    ingredients: [
      { name: 'Arroz Agulhinha Tipo 1', amountPerPerson: 0.07, unit: 'kg', unitPrice: 7.0 },
      { name: 'Bacon em Cubos', amountPerPerson: 0.025, unit: 'kg', unitPrice: 38.0 },
      { name: 'Batata Palha & Ovos', amountPerPerson: 0.02, unit: 'kg', unitPrice: 26.0 }
    ]
  },
  {
    id: '6',
    name: 'Farofa Crocante de Castanhas de Caju',
    category: 'side',
    isHot: false,
    ingredients: [
      { name: 'Farinha de Mandioca Biju', amountPerPerson: 0.04, unit: 'kg', unitPrice: 8.5 },
      { name: 'Castanha de Caju Triturada', amountPerPerson: 0.025, unit: 'kg', unitPrice: 75.0 },
      { name: 'Manteiga de Garrafa', amountPerPerson: 0.015, unit: 'kg', unitPrice: 45.0 }
    ]
  },
  {
    id: '7',
    name: 'Salada de Folhas Nobres, Figos e Parmesão',
    category: 'side',
    isHot: false,
    ingredients: [
      { name: 'Mix de Folhas (Rúcula, Alface Americana)', amountPerPerson: 0.05, unit: 'kg', unitPrice: 24.0 },
      { name: 'Lâminas de Parmesão', amountPerPerson: 0.02, unit: 'kg', unitPrice: 85.0 },
      { name: 'Figos Frescos & Molho Mostarda e Mel', amountPerPerson: 0.025, unit: 'kg', unitPrice: 32.0 }
    ]
  },
  {
    id: '8',
    name: 'Bolo Trufado Red Velvet com Frutas Vermelhas',
    category: 'dessert',
    isHot: false,
    ingredients: [
      { name: 'Bolo Decorado Red Velvet', amountPerPerson: 0.1, unit: 'kg', unitPrice: 95.0 }
    ]
  },
  {
    id: '9',
    name: 'Brigadeiros Gourmet (Pistache, Belga e Ninho)',
    category: 'dessert',
    isHot: false,
    ingredients: [
      { name: 'Docinhos Artesanais Finos', amountPerPerson: 5, unit: 'un', unitPrice: 2.2 }
    ]
  }
];

// --- BEBIDAS DISCRIMINADAS COM ESTIMATIVAS DE CONSUMO E PREÇO UNITÁRIO ---
const INITIAL_BEVERAGE_TYPES = [
  { id: 'coca', name: 'Refrigerante Cola (Coca-Cola / Zero)', category: 'soft', mlPerPerson: 350, unitCostPerLiter: 7.5, unitFormat: 'Garrafa 2L' },
  { id: 'guarana', name: 'Refrigerante Guaraná (Antarctica)', category: 'soft', mlPerPerson: 250, unitCostPerLiter: 6.8, unitFormat: 'Garrafa 2L' },
  { id: 'suco_uva', name: 'Suco de Uva Integral', category: 'juice', mlPerPerson: 180, unitCostPerLiter: 14.0, unitFormat: 'Garrafa 1.5L' },
  { id: 'suco_laranja', name: 'Sucos Variados (Laranja / Maracujá)', category: 'juice', mlPerPerson: 220, unitCostPerLiter: 9.5, unitFormat: 'Caixa / Garrafa 1L' },
  { id: 'agua_coco', name: 'Água de Coco Natural', category: 'juice', mlPerPerson: 150, unitCostPerLiter: 11.0, unitFormat: 'Caixa 1L' },
  { id: 'agua_sem_gas', name: 'Água Mineral sem Gás', category: 'water', mlPerPerson: 350, unitCostPerLiter: 3.0, unitFormat: 'Garrafa 500ml / Galão' },
  { id: 'agua_com_gas', name: 'Água Mineral com Gás', category: 'water', mlPerPerson: 200, unitCostPerLiter: 4.5, unitFormat: 'Garrafa 500ml' },
  { id: 'cerveja', name: 'Chopp / Cerveja Puro Malte (Consumidores de álcool)', category: 'alcohol', mlPerPerson: 1800, unitCostPerLiter: 13.5, unitFormat: 'Lata 350ml / Barril' },
  { id: 'vinho', name: 'Vinho / Espumante Brut', category: 'alcohol', mlPerPerson: 300, unitCostPerLiter: 48.0, unitFormat: 'Garrafa 750ml' },
  { id: 'gelo_filtrado', name: 'Gelo Filtrado para Bebidas', category: 'ice', mlPerPerson: 700, unitCostPerLiter: 2.5, unitFormat: 'Saco 5kg' },
  { id: 'gelo_tina', name: 'Gelo em Barra/Cubo para Tina e Coolers', category: 'ice', mlPerPerson: 600, unitCostPerLiter: 1.8, unitFormat: 'Saco 10kg' }
];

const INITIAL_GUESTS = [
  { id: '1', name: 'Carlos Eduardo', group: 'Amigos Próximos', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '2', name: 'Fernanda Lima', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: ['Vegetariana', 'Sem lactose'] },
  { id: '3', name: 'Lucas Lima (Filho)', group: 'Família', category: 'child_6_11', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'] },
  { id: '4', name: 'Beatriz Costa', group: 'Trabalho / Colegas', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem glúten (Celíaco)'] },
  { id: '5', name: 'Rodrigo Alves', group: 'Amigos Próximos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '6', name: 'Juliana Pires', group: 'Esposa / Marido / Cônjuge', category: 'adult', status: 'declined', drinksAlcohol: true, restrictions: ['Sem frutos do mar'] },
  { id: '7', name: 'Gabriel Pires (Bebê)', group: 'Crianças / Filhos de Amigos', category: 'child_0_5', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'] },
  { id: '8', name: 'Marcelo Santos', group: 'Trabalho / Colegas', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '9', name: 'Camila Rocha', group: 'Amigos Próximos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'] },
  { id: '10', name: 'Patrícia Souza', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: ['Não consome carne vermelha'] }
];

const INITIAL_RENTALS = [
  { id: '1', name: 'Salão Villa Verde & Lounge', category: 'venue', cost: 2800, supplier: 'Espaço Villa Verde', notes: 'Incluso limpeza pós-evento' },
  { id: '2', name: 'Cama Elástica 3,05m Premium', category: 'toy', cost: 380, supplier: 'Tio Pipoca Festas', hasMonitor: true, notes: 'Montagem às 14h, monitor incluso' },
  { id: '3', name: 'Piscina de Bolinhas Inflável', category: 'toy', cost: 260, supplier: 'Tio Pipoca Festas', hasMonitor: true, notes: 'Monitor incluso' },
  { id: '4', name: 'Jogos de Mesas e Cadeiras Revestidas', category: 'furniture', cost: 320, supplier: 'LocMóveis Eventos', notes: 'Entrega na sexta-feira à tarde' },
  { id: '5', name: 'Kit Rechauds Inox com Banho-Maria', category: 'furniture', cost: 220, supplier: 'LocMóveis Eventos', notes: 'Devolução limpo' }
];

// Despesas avulsas complementares (decoração, dj, fotografia, etc.)
const INITIAL_MANUAL_EXPENSES = [
  { id: 'man_1', description: 'Decoração Floral & Painel de Fotos', category: 'Decoração & Cenografia', estimated: 1200, actual: 1200, paid: true },
  { id: 'man_2', description: 'DJ e Iluminação Cênica', category: 'Música & Atrações', estimated: 900, actual: 900, paid: false },
  { id: 'man_3', description: 'Fotógrafo Profissional (4h)', category: 'Fotografia & Vídeo', estimated: 800, actual: 800, paid: true }
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
  const [config, setConfig] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_EVENT_CONFIG;
    const saved = localStorage.getItem('festplanner_config_v2');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_CONFIG;
  });

  const [menu, setMenu] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_MENU;
    const saved = localStorage.getItem('festplanner_menu_v2');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [beverages, setBeverages] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_BEVERAGE_TYPES;
    const saved = localStorage.getItem('festplanner_beverages_v2');
    return saved ? JSON.parse(saved) : INITIAL_BEVERAGE_TYPES;
  });

  const [guests, setGuests] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_GUESTS;
    const saved = localStorage.getItem('festplanner_guests_v2');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [rentals, setRentals] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_RENTALS;
    const saved = localStorage.getItem('festplanner_rentals_v2');
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  const [manualExpenses, setManualExpenses] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_MANUAL_EXPENSES;
    const saved = localStorage.getItem('festplanner_manual_expenses_v2');
    return saved ? JSON.parse(saved) : INITIAL_MANUAL_EXPENSES;
  });

  const [checklist, setChecklist] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_CHECKLIST;
    const saved = localStorage.getItem('festplanner_checklist_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [budgetScenario, setBudgetScenario] = useState('both'); // 'confirmed' | 'all' | 'both'

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

  // Persistência
  useEffect(() => {
    localStorage.setItem('festplanner_config_v2', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('festplanner_menu_v2', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('festplanner_beverages_v2', JSON.stringify(beverages));
  }, [beverages]);

  useEffect(() => {
    localStorage.setItem('festplanner_guests_v2', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('festplanner_rentals_v2', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem('festplanner_manual_expenses_v2', JSON.stringify(manualExpenses));
  }, [manualExpenses]);

  useEffect(() => {
    localStorage.setItem('festplanner_checklist_v2', JSON.stringify(checklist));
  }, [checklist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- ESTATÍSTICAS DOS CONVIDADOS (CONFIRMADOS VS. TODOS) ---
  const guestStats = useMemo(() => {
    const totalCount = guests.length;
    const confirmedList = guests.filter(g => g.status === 'confirmed');
    const pendingList = guests.filter(g => g.status === 'pending');
    const declinedList = guests.filter(g => g.status === 'declined');

    // Confirmados
    const confAdults = confirmedList.filter(g => g.category === 'adult').length;
    const confKids611 = confirmedList.filter(g => g.category === 'child_6_11').length;
    const confKids05 = confirmedList.filter(g => g.category === 'child_0_5').length;
    const confWeightedEaters = confAdults + (confKids611 * 0.5);
    const confDrinkers = confirmedList.filter(g => g.category === 'adult' && g.drinksAlcohol).length;

    // Cenário se fossem TODOS os convidados (desconsiderando os expressamente recusados ou simulando 100%)
    const allEligible = guests.filter(g => g.status !== 'declined');
    const allAdults = allEligible.filter(g => g.category === 'adult').length;
    const allKids611 = allEligible.filter(g => g.category === 'child_6_11').length;
    const allKids05 = allEligible.filter(g => g.category === 'child_0_5').length;
    const allWeightedEaters = allAdults + (allKids611 * 0.5);
    const allDrinkers = allEligible.filter(g => g.category === 'adult' && g.drinksAlcohol).length;

    return {
      totalCount,
      confirmedCount: confirmedList.length,
      pendingCount: pendingList.length,
      declinedCount: declinedList.length,
      confAdults,
      confKids611,
      confKids05,
      confWeightedEaters,
      confDrinkers,
      allEligibleCount: allEligible.length,
      allWeightedEaters,
      allDrinkers
    };
  }, [guests]);

  // --- CÁLCULO DE COMIDAS & RECEITAS POR INGREDIENTE (CONFIRMADOS VS. TODOS) ---
  const foodCalculations = useMemo(() => {
    const calcForEaters = (eaters) => {
      let totalCost = 0;
      const ingredientDetails = [];

      menu.forEach(item => {
        let itemCost = 0;
        const ingList = (item.ingredients || []).map(ing => {
          const requiredAmount = Math.round(eaters * (Number(ing.amountPerPerson) || 0) * 100) / 100;
          const subtotal = requiredAmount * (Number(ing.unitPrice) || 0);
          itemCost += subtotal;
          return {
            name: ing.name,
            amount: requiredAmount,
            unit: ing.unit,
            unitPrice: ing.unitPrice,
            subtotal
          };
        });

        totalCost += itemCost;
        ingredientDetails.push({
          menuItemId: item.id,
          menuItemName: item.name,
          category: item.category,
          isHot: item.isHot,
          itemCost,
          ingredients: ingList
        });
      });

      return { totalCost, ingredientDetails };
    };

    const confirmed = calcForEaters(guestStats.confWeightedEaters);
    const all = calcForEaters(guestStats.allWeightedEaters);

    return { confirmed, all };
  }, [menu, guestStats.confWeightedEaters, guestStats.allWeightedEaters]);

  // --- CÁLCULO DE BEBIDAS DISCRIMINADAS (CONFIRMADOS VS. TODOS) ---
  const beverageCalculations = useMemo(() => {
    const calcDrinks = (totalGuests, drinkers) => {
      let totalCost = 0;
      const list = beverages.map(bev => {
        const isAlcohol = bev.category === 'alcohol';
        const basePeople = isAlcohol ? drinkers : totalGuests;
        const totalVolumeLiters = Math.round((basePeople * (Number(bev.mlPerPerson) || 0) / 1000) * 10) / 10;
        const cost = Math.round(totalVolumeLiters * (Number(bev.unitCostPerLiter) || 0) * 100) / 100;
        totalCost += cost;

        return {
          id: bev.id,
          name: bev.name,
          category: bev.category,
          unitFormat: bev.unitFormat,
          unitCostPerLiter: bev.unitCostPerLiter,
          litersOrKg: totalVolumeLiters,
          cost
        };
      });

      return { totalCost, list };
    };

    const confirmed = calcDrinks(guestStats.confirmedCount, guestStats.confDrinkers);
    const all = calcDrinks(guestStats.allEligibleCount, guestStats.allDrinkers);

    return { confirmed, all };
  }, [beverages, guestStats]);

  // --- CÁLCULO DE LOUÇAS, RECHAUDS E MOBILIÁRIO (CONFIRMADOS VS. TODOS) ---
  const materialCalculations = useMemo(() => {
    const calcMaterials = (confirmedCount, drinkers) => {
      const safety = 1 + ((Number(config.safetyMarginPct) || 15) / 100);
      const isRental = config.materialMode === 'rental';

      const mainPlates = Math.ceil(confirmedCount * 1.2 * safety);
      const dessertPlates = Math.ceil(confirmedCount * 1.3 * safety);
      const forksAndKnives = Math.ceil(confirmedCount * 1.25 * safety);
      const waterGlasses = Math.ceil(confirmedCount * 1.5 * safety);
      const beerTulips = Math.ceil(drinkers * 2 * safety);

      // Rechauds determinados pelo número de pratos quentes cadastrados no menu
      const hotDishesCount = menu.filter(m => m.isHot).length;
      const rechauds = Math.max(1, hotDishesCount);
      const durationHours = Number(config.durationHours) || 6;
      const fuelPastesNeeded = Math.ceil(rechauds * (durationHours / 2.2));

      const capacity = Number(config.tableCapacity) || 4;
      const tablesNeeded = Math.ceil(confirmedCount / capacity);
      const chairsNeeded = tablesNeeded * capacity;

      // Custos estimados
      let tablewareCost = 0;
      if (isRental) {
        tablewareCost =
          (mainPlates + dessertPlates) * (Number(config.rentalPlateCost) || 1.8) +
          forksAndKnives * (Number(config.rentalCutleryCost) || 1.2) +
          (waterGlasses + beerTulips) * (Number(config.rentalGlassCost) || 1.5) +
          rechauds * (Number(config.rentalRechaudCost) || 45.0) +
          (fuelPastesNeeded * 8.5); // pastilhas de álcool gel
      } else {
        // Descartáveis ecológicos/biodegradáveis
        tablewareCost =
          (mainPlates + dessertPlates) * 0.65 +
          forksAndKnives * 0.5 +
          (waterGlasses + beerTulips) * 0.45 +
          rechauds * (Number(config.rentalRechaudCost) || 45.0) +
          (fuelPastesNeeded * 8.5);
      }

      const tablesCost = tablesNeeded * (Number(config.rentalTableSetCost) || 22.0);

      return {
        mainPlates,
        dessertPlates,
        forksAndKnives,
        waterGlasses,
        beerTulips,
        rechauds,
        fuelPastesNeeded,
        tablesNeeded,
        chairsNeeded,
        tablewareCost,
        tablesCost,
        totalCost: tablewareCost + tablesCost
      };
    };

    const confirmed = calcMaterials(guestStats.confirmedCount, guestStats.confDrinkers);
    const all = calcMaterials(guestStats.allEligibleCount, guestStats.allDrinkers);

    return { confirmed, all };
  }, [config, menu, guestStats]);

  // --- CUSTO TOTAL DE LOCAÇÕES CADASTRADAS (ESPAÇO, BRINQUEDOS, MOBÍLIA AVULSA) ---
  const totalRentalsCost = useMemo(() => {
    return rentals.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  }, [rentals]);

  // --- CENTRO DE CUSTOS INTEGRADO E AUTOMATIZADO ---
  const consolidatedBudget = useMemo(() => {
    // 1. Locações Cadastradas
    const venueRentals = rentals.filter(r => r.category === 'venue');
    const toyRentals = rentals.filter(r => r.category === 'toy');
    const furnitureRentals = rentals.filter(r => r.category === 'furniture');

    const venueCost = venueRentals.reduce((a, b) => a + (Number(b.cost) || 0), 0) + (config.locationType === 'home' ? (Number(config.condoFee) || 0) : 0);
    const toysCost = toyRentals.reduce((a, b) => a + (Number(b.cost) || 0), 0);
    const furnitureCost = furnitureRentals.reduce((a, b) => a + (Number(b.cost) || 0), 0);

    // 2. Insumos do Buffet (Comida)
    const foodCostConfirmed = foodCalculations.confirmed.totalCost;
    const foodCostAll = foodCalculations.all.totalCost;

    // 3. Bebidas & Gelo
    const drinksCostConfirmed = beverageCalculations.confirmed.totalCost;
    const drinksCostAll = beverageCalculations.all.totalCost;

    // 4. Louças, Rechauds & Mesas de Apoio
    const materialsCostConfirmed = materialCalculations.confirmed.totalCost;
    const materialsCostAll = materialCalculations.all.totalCost;

    // 5. Despesas Manuais / Extras (Decoração, DJ, etc.)
    const manualExpensesTotal = manualExpenses.reduce((a, b) => a + (Number(b.actual) || Number(b.estimated) || 0), 0);

    // Totais Consolidados
    const totalConfirmed = venueCost + toysCost + furnitureCost + foodCostConfirmed + drinksCostConfirmed + materialsCostConfirmed + manualExpensesTotal;
    const totalAll = venueCost + toysCost + furnitureCost + foodCostAll + drinksCostAll + materialsCostAll + manualExpensesTotal;

    const diff = totalAll - totalConfirmed;
    const costPerConfirmed = guestStats.confirmedCount > 0 ? (totalConfirmed / guestStats.confirmedCount) : 0;
    const costPerAll = guestStats.allEligibleCount > 0 ? (totalAll / guestStats.allEligibleCount) : 0;

    // Linhas estruturadas para exibição no Centro de Custos
    const lineItems = [
      { id: 'cat_venue', name: 'Locação do Espaço / Salão', category: 'Espaço & Infra', confirmedCost: venueCost, allCost: venueCost, source: 'Locações' },
      { id: 'cat_toys', name: 'Brinquedos & Recreação Infantil', category: 'Entretenimento', confirmedCost: toysCost, allCost: toysCost, source: 'Locações' },
      { id: 'cat_furniture', name: 'Mobiliário Extra Locado', category: 'Locações', confirmedCost: furnitureCost, allCost: furnitureCost, source: 'Locações' },
      { id: 'cat_food', name: 'Insumos do Cardápio (Carnes, Pratos & Doces)', category: 'Buffet & Cozinha', confirmedCost: foodCostConfirmed, allCost: foodCostAll, source: 'Cardápio / Receitas' },
      { id: 'cat_drinks', name: 'Bebidas Detalhadas & Gelo', category: 'Bebidas', confirmedCost: drinksCostConfirmed, allCost: drinksCostAll, source: 'Bebidas' },
      { id: 'cat_materials', name: `Louças, Rechauds e Jogos de Mesas (${config.materialMode === 'rental' ? 'Aluguel' : 'Descartáveis'})`, category: 'Utensílios & Mesas', confirmedCost: materialsCostConfirmed, allCost: materialsCostAll, source: 'Calculadora' },
      ...manualExpenses.map(m => ({
        id: m.id,
        name: m.description,
        category: m.category,
        confirmedCost: Number(m.actual) || Number(m.estimated) || 0,
        allCost: Number(m.actual) || Number(m.estimated) || 0,
        source: 'Despesa Avulsa',
        paid: m.paid
      }))
    ];

    return {
      totalConfirmed,
      totalAll,
      diff,
      costPerConfirmed,
      costPerAll,
      lineItems
    };
  }, [rentals, config, foodCalculations, beverageCalculations, materialCalculations, manualExpenses, guestStats]);

  // Lista de convidados ordenada
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
      showToast('Convidado atualizado!');
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

  // --- HANDLERS DO CARDÁPIO & INGREDIENTES ---
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

    // Ingrediente principal simplificado
    const ingName = form.ingName.value.trim() || name;
    const ingAmount = parseFloat(form.ingAmount.value) || 0.1;
    const ingUnit = form.ingUnit.value;
    const ingPrice = parseFloat(form.ingPrice.value) || 0;

    if (!name) return;

    const updatedIngredients = [
      { name: ingName, amountPerPerson: ingAmount, unit: ingUnit, unitPrice: ingPrice }
    ];

    if (editingMenuItem) {
      setMenu(menu.map(m => m.id === editingMenuItem.id ? {
        ...m,
        name,
        category,
        isHot,
        ingredients: (m.ingredients && m.ingredients.length > 1)
          ? [{ ...m.ingredients[0], name: ingName, amountPerPerson: ingAmount, unit: ingUnit, unitPrice: ingPrice }, ...m.ingredients.slice(1)]
          : updatedIngredients
      } : m));
      showToast('Prato atualizado e custos recalculados!');
    } else {
      const newItem = {
        id: Date.now().toString(),
        name,
        category,
        isHot,
        ingredients: updatedIngredients
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

  // --- HANDLERS DE LOCAÇÃO ---
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
      showToast('Locação atualizada! Centro de Custos sincronizado.');
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
      showToast('Locação adicionada ao orçamento!');
    }

    setRentalModalOpen(false);
    setEditingRental(null);
  };

  const handleDeleteRental = (id) => {
    setRentals(rentals.filter(r => r.id !== id));
    showToast('Locação removida.');
  };

  // --- HANDLERS DE DESPESAS AVULSAS ---
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
      setManualExpenses(manualExpenses.map(exp => exp.id === editingExpense.id ? {
        ...exp,
        description,
        category,
        estimated,
        actual,
        paid
      } : exp));
      showToast('Despesa atualizada!');
    } else {
      const newExpense = {
        id: Date.now().toString(),
        description,
        category,
        estimated,
        actual,
        paid
      };
      setManualExpenses([...manualExpenses, newExpense]);
      showToast('Despesa avulsa registrada!');
    }

    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    setManualExpenses(manualExpenses.filter(e => e.id !== id));
    showToast('Despesa excluída.');
  };

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleResetDemoData = () => {
    setConfig(INITIAL_EVENT_CONFIG);
    setMenu(INITIAL_MENU);
    setBeverages(INITIAL_BEVERAGE_TYPES);
    setGuests(INITIAL_GUESTS);
    setRentals(INITIAL_RENTALS);
    setManualExpenses(INITIAL_MANUAL_EXPENSES);
    setChecklist(INITIAL_CHECKLIST);
    showToast('Dados padrão restaurados!');
  };

  // Exportar lista completa de compras e suprimentos
  const handleExportShoppingList = () => {
    const textContent = `
======================================================================
FESTPLANNER PRO - LISTA CONSOLIDADA DE COMPRAS E ORÇAMENTO
Evento: Aniversário de ${config.celebrantName} (${config.age} anos)
Data: ${config.date} | Horário: ${config.startTime} às ${config.endTime} (${config.durationHours}h)
Local: ${config.locationType === 'home' ? 'Espaço Próprio / Condomínio' : config.venueName}
----------------------------------------------------------------------
CONVIDADOS & QUÓRUM:
- Confirmados no RSVP: ${guestStats.confirmedCount} pessoas (${guestStats.confWeightedEaters.toFixed(1)} cotas alimentares)
- Lista Completa (Elegíveis): ${guestStats.allEligibleCount} pessoas (${guestStats.allWeightedEaters.toFixed(1)} cotas)
- Consumidores de Álcool Confirmados: ${guestStats.confDrinkers} adultos
----------------------------------------------------------------------
CENÁRIO FINANCEIRO TOTAL:
- CUSTO TOTAL COM CONFIRMADOS: R$ ${consolidatedBudget.totalConfirmed.toFixed(2)} (R$ ${consolidatedBudget.costPerConfirmed.toFixed(2)} / pessoa)
- CUSTO SE TODOS COMPARECEREM: R$ ${consolidatedBudget.totalAll.toFixed(2)} (R$ ${consolidatedBudget.costPerAll.toFixed(2)} / pessoa)
- DIFERENÇA ESTIMADA (ECONOMIA ATUAL): R$ ${consolidatedBudget.diff.toFixed(2)}
======================================================================

1. INSUMOS E INGREDIENTES DO CARDÁPIO (BASEADO NOS CONFIRMADOS):
${foodCalculations.confirmed.ingredientDetails.map(item => {
  return `\n* [${item.category.toUpperCase()}] ${item.menuItemName} ${item.isHot ? '(Rechaud Quente)' : ''}\n` +
    item.ingredients.map(ing => `   - ${ing.name}: ${ing.amount} ${ing.unit} (R$ ${ing.subtotal.toFixed(2)})`).join('\n');
}).join('\n')}

Subtotal Comidas (Confirmados): R$ ${foodCalculations.confirmed.totalCost.toFixed(2)}
Subtotal Comidas (Se todos fossem): R$ ${foodCalculations.all.totalCost.toFixed(2)}

----------------------------------------------------------------------
2. BEBIDAS DETALHADAS & GELO:
${beverageCalculations.confirmed.list.map(bev => `
- ${bev.name}:
  * Volume para confirmados: ${bev.litersOrKg} L/kg (~ R$ ${bev.cost.toFixed(2)})
  * Formato sugerido: ${bev.unitFormat}`).join('')}

Subtotal Bebidas (Confirmados): R$ ${beverageCalculations.confirmed.totalCost.toFixed(2)}
Subtotal Bebidas (Se todos fossem): R$ ${beverageCalculations.all.totalCost.toFixed(2)}

----------------------------------------------------------------------
3. LOUÇAS, RECHAUDS E MOBILIÁRIO (${config.materialMode === 'rental' ? 'ALUGUEL' : 'DESCARTÁVEIS'}):
- Pratos de Refeição: ${materialCalculations.confirmed.mainPlates} un
- Pratos de Sobremesa: ${materialCalculations.confirmed.dessertPlates} un
- Talheres (Garfos e Facas): ${materialCalculations.confirmed.forksAndKnives} pares
- Copos / Taças de Água: ${materialCalculations.confirmed.waterGlasses} un
- Copos / Tulipas de Cerveja: ${materialCalculations.confirmed.beerTulips} un
- Rechauds Banho-Maria: ${materialCalculations.confirmed.rechauds} cubas (${materialCalculations.confirmed.fuelPastesNeeded} pastilhas de combustível)
- Mesas de Convidados: ${materialCalculations.confirmed.tablesNeeded} jogos (${materialCalculations.confirmed.chairsNeeded} cadeiras)
Subtotal Materiais & Louças: R$ ${materialCalculations.confirmed.totalCost.toFixed(2)}

----------------------------------------------------------------------
4. LOCAÇÕES CONTRATADAS (ESPAÇO, BRINQUEDOS E MÓVEIS):
${rentals.map(r => `- ${r.name} (${r.supplier}): R$ ${Number(r.cost).toFixed(2)} ${r.hasMonitor ? '[Monitor incluso]' : ''}`).join('\n')}
Subtotal Locações: R$ ${totalRentalsCost.toFixed(2)}

----------------------------------------------------------------------
5. DESPESAS EXTRAS & AVULSAS:
${manualExpenses.map(m => `- ${m.description} (${m.category}): R$ ${(Number(m.actual) || Number(m.estimated)).toFixed(2)} [${m.paid ? 'Pago' : 'Pendente'}]`).join('\n')}
======================================================================
`.trim();

    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `FestPlanner_Orcamento_Completo_${config.celebrantName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Relatório completo baixado!');
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${darkMode ? 'bg-zinc-950 text-zinc-100 selection:bg-zinc-800' : 'bg-zinc-50/70 text-zinc-900 selection:bg-zinc-200'}`}>
      
      {/* TOAST DE FEEDBACK */}
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
                <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50">
                  Auto Cost Sync
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
              { id: 'guests', label: 'Convidados & RSVP', icon: Users, count: guestStats.confirmedCount },
              { id: 'menu', label: 'Cardápio & Receitas', icon: BookOpen, count: menu.length },
              { id: 'beverages', label: 'Bebidas Detalhadas', icon: GlassWater, count: beverages.length },
              { id: 'catering', label: 'Buffet & Louças', icon: Utensils },
              { id: 'rentals', label: 'Locações & Espaço', icon: Gamepad2, count: rentals.length },
              { id: 'finance', label: 'Centro de Custos Auto', icon: DollarSign, badge: 'Sincronizado' },
              { id: 'checklist', label: 'Cronograma', icon: CheckSquare },
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
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
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
        {/* ABA 1: DASHBOARD COM COMPARATIVO DUAL (CONFIRMADOS VS TODOS) */}
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
                      Painel Executivo do Evento
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-zinc-400" />
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                      Orçamento Dinâmico Ativo
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
                      {menu.length} pratos com ingredientes calculados
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    Ver Centro de Custos
                  </button>
                  <button
                    onClick={handleExportShoppingList}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 shadow-sm transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Relatório & Compras</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SELETOR DE CENÁRIO DUAL (TODOS OS CONVIDADOS VS. APENAS CONFIRMADOS) */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-amber-50/60 border-amber-200/60'
            }`}>
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Cenários de Projeção Financeira
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Compare o desembolso caso 100% dos convidados compareçam versus o valor real contratado para os confirmados no RSVP.
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium self-start sm:self-auto">
                <button
                  onClick={() => setBudgetScenario('confirmed')}
                  className={`px-3 py-1 rounded-md transition ${budgetScenario === 'confirmed' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-500'}`}
                >
                  Só Confirmados
                </button>
                <button
                  onClick={() => setBudgetScenario('all')}
                  className={`px-3 py-1 rounded-md transition ${budgetScenario === 'all' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-500'}`}
                >
                  Se Todos Fossem
                </button>
                <button
                  onClick={() => setBudgetScenario('both')}
                  className={`px-3 py-1 rounded-md transition ${budgetScenario === 'both' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-500'}`}
                >
                  Lado a Lado
                </button>
              </div>
            </div>

            {/* 4 CARDS DE KPIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* CARD 1: PRESENÇA CONFIRMADA */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Presença no RSVP</span>
                  <Users className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {guestStats.confirmedCount}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    de {guestStats.totalCount} convidados
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>{guestStats.confAdults} adultos ({guestStats.confDrinkers} bebem)</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {guestStats.totalCount > 0 ? Math.round((guestStats.confirmedCount / guestStats.totalCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* CARD 2: CUSTO TOTAL COM CONFIRMADOS */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Custo Real (Confirmados)</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                    R$ {Math.round(consolidatedBudget.totalConfirmed).toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    p/ {guestStats.confirmedCount} pess.
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>Custo médio unitário:</span>
                  <strong className="text-zinc-800 dark:text-zinc-200">
                    R$ {Math.round(consolidatedBudget.costPerConfirmed)} / pessoa
                  </strong>
                </div>
              </div>

              {/* CARD 3: CUSTO SE TODOS FOSSEM (100%) */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Custo se Todos Fossem</span>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    R$ {Math.round(consolidatedBudget.totalAll).toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    p/ {guestStats.allEligibleCount} pess.
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>Economia no RSVP:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    - R$ {Math.round(consolidatedBudget.diff).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* CARD 4: RECHAUDS & CARDÁPIO */}
              <div className={`p-4 rounded-xl border transition-all ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Rechauds & Pratos Quentes</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {materialCalculations.confirmed.rechauds}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    cubas necessárias
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span>Álcool gel ({config.durationHours}h):</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {materialCalculations.confirmed.fuelPastesNeeded} pastilhas
                  </span>
                </div>
              </div>

            </div>

            {/* SEÇÃO PRINCIPAL DE COMPARAÇÃO DINÂMICA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                
                {/* TABELA DE DEMONSTRAÇÃO SINTÉTICA DE CUSTOS POR GRUPO */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Sincronização Automática de Despesas</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Valores atualizados automaticamente conforme edições em cardápio, bebidas e locações</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('finance')}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition"
                    >
                      <span>Abrir Centro de Custos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                        <tr>
                          <th className="pb-2.5 font-medium">Categoria / Origem</th>
                          <th className="pb-2.5 font-medium">Origem do Dado</th>
                          <th className="pb-2.5 font-medium text-right">Confirmados ({guestStats.confirmedCount})</th>
                          <th className="pb-2.5 font-medium text-right">Se Todos Fossem ({guestStats.allEligibleCount})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                        {consolidatedBudget.lineItems.map(item => (
                          <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                            <td className="py-2.5 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                            <td className="py-2.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                                {item.source}
                              </span>
                            </td>
                            <td className="py-2.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                              R$ {item.confirmedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 text-right font-medium text-zinc-500">
                              R$ {item.allCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t-2 border-zinc-200 dark:border-zinc-700">
                        <tr>
                          <td colSpan={2} className="pt-3 font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                            TOTAL GERAL CONSOLIDADO
                          </td>
                          <td className="pt-3 text-right font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            R$ {consolidatedBudget.totalConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="pt-3 text-right font-bold text-sm text-zinc-700 dark:text-zinc-300">
                            R$ {consolidatedBudget.totalAll.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* PRÉVIA DAS BEBIDAS DISCRIMINADAS */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">Bebidas & Volumes Calculados</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Coca-Cola, Guaraná, Sucos integrais, Águas com e sem gás, Chopp e Gelo</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('beverages')}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition"
                    >
                      <span>Ver todas bebidas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {beverageCalculations.confirmed.list.slice(0, 4).map(b => (
                      <div key={b.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                        <span className="text-[11px] text-zinc-400 block truncate">{b.name}</span>
                        <strong className="text-sm font-semibold mt-1 block">{b.litersOrKg} L/kg</strong>
                        <span className="text-[10px] text-zinc-500">R$ {b.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                
                {/* CARD DE ECONOMIA DO RSVP */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <h3 className="text-sm font-semibold tracking-tight mb-2">Impacto Real das Confirmações</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Com base nos {guestStats.confirmedCount} convidados que confirmaram até o momento contra {guestStats.allEligibleCount} convidados potenciais:
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40">
                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium block">
                        Economia Direta em Alimentos e Bebidas
                      </span>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        R$ {Math.round(consolidatedBudget.diff).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        Insumos que não precisarão ser comprados
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Custo Buffet (Confirmados):</span>
                        <span className="font-semibold">R$ {foodCalculations.confirmed.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Custo Bebidas (Confirmados):</span>
                        <span className="font-semibold">R$ {beverageCalculations.confirmed.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Locações Fixas:</span>
                        <span className="font-semibold">R$ {totalRentalsCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TAREFAS */}
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold tracking-tight">Próximos Passos</h3>
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="space-y-2">
                    {checklist.filter(c => !c.completed).slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleChecklist(task.id)}
                        className="p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/70 dark:border-zinc-800"
                      >
                        <span className="truncate">{task.title}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 shrink-0">{task.period.split(' ')[0]}</span>
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
                    {guestStats.confirmedCount} confirmados ({guestStats.confAdults} adultos, {guestStats.confKids611 + guestStats.confKids05} crianças), {guestStats.pendingCount} pendentes e {guestStats.declinedCount} recusados
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
        {/* ABA 3: CARDÁPIO SUGERIDO COM CÁLCULO BASEADO EM RECEITAS */}
        {/* ============================================================ */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Cardápio & Cálculo de Receitas / Insumos</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cada prato possui ingredientes com gramatura por pessoa e preço unitário. O valor total do buffet no Centro de Custos é alimentado automaticamente por aqui.
                  </p>
                </div>
                <button
                  onClick={() => openMenuModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Prato / Receita</span>
                </button>
              </div>

              {/* Comparativo de Custo Total do Buffet */}
              <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-zinc-500">Subtotal Insumos (Confirmados - {guestStats.confWeightedEaters.toFixed(1)} cotas):</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 ml-1 font-semibold text-sm">
                    R$ {foodCalculations.confirmed.totalCost.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-500">Subtotal Insumos (Se todos fossem - {guestStats.allWeightedEaters.toFixed(1)} cotas):</span>
                  <strong className="text-zinc-700 dark:text-zinc-300 ml-1 font-semibold text-sm">
                    R$ {foodCalculations.all.totalCost.toFixed(2)}
                  </strong>
                </div>
                <div className="text-zinc-400 text-[11px]">
                  {menu.filter(m => m.isHot).length} pratos quentes vinculados aos Rechauds
                </div>
              </div>

              {/* Lista dos Pratos e Ingredientes */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {foodCalculations.confirmed.ingredientDetails.map(item => (
                  <div key={item.menuItemId} className={`p-4 rounded-xl border flex flex-col justify-between ${
                    darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
                  }`}>
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {item.category === 'starter' ? 'Entrada' : item.category === 'main' ? 'Prato Principal' : item.category === 'side' ? 'Guarnição' : 'Sobremesa'}
                            </span>
                            {item.isHot && (
                              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                <Flame className="w-3 h-3" /> Rechaud
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mt-1">{item.menuItemName}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openMenuModal(menu.find(m => m.id === item.menuItemId))}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Editar Receita"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.menuItemId)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-500"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Tabela de Ingredientes da Receita */}
                      <div className="mt-3 space-y-1.5 text-xs">
                        <span className="text-[11px] text-zinc-400 font-medium">Ingredientes calculados p/ {guestStats.confWeightedEaters.toFixed(1)} cotas:</span>
                        {item.ingredients.map((ing, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60 text-[11px]">
                            <span className="text-zinc-600 dark:text-zinc-400">{ing.name} ({ing.amount} {ing.unit})</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">R$ {ing.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Custo Total deste Prato:</span>
                      <strong className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        R$ {item.itemCost.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 4: BEBIDAS DETALHADAS & DISCRIMINADAS */}
        {/* ============================================================ */}
        {activeTab === 'beverages' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Detalhamento de Bebidas & Gelo</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cálculo individualizado por tipo de bebida (Coca-Cola, Guaraná, Sucos Naturais, Águas com e sem gás, Chopp e Gelo).
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="p-2 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-zinc-500">Subtotal Bebidas (Confirmados):</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 ml-1 font-semibold">
                      R$ {beverageCalculations.confirmed.totalCost.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="pb-2.5 font-medium">Bebida / Insumo</th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th className="pb-2.5 font-medium">Embalagem Sugerida</th>
                      <th className="pb-2.5 font-medium">Preço Base</th>
                      <th className="pb-2.5 font-medium text-right">Volume (Confirmados)</th>
                      <th className="pb-2.5 font-medium text-right">Custo Estimado</th>
                      <th className="pb-2.5 font-medium text-right">Se Todos Fossem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {beverageCalculations.confirmed.list.map(bev => {
                      const allEquiv = beverageCalculations.all.list.find(a => a.id === bev.id);
                      return (
                        <tr key={bev.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                          <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{bev.name}</td>
                          <td className="py-3 text-zinc-500 capitalize">{bev.category}</td>
                          <td className="py-3 text-zinc-500">{bev.unitFormat}</td>
                          <td className="py-3 text-zinc-500">R$ {bev.unitCostPerLiter.toFixed(2)} / L-kg</td>
                          <td className="py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                            {bev.litersOrKg} {bev.category === 'ice' ? 'kg' : 'L'}
                          </td>
                          <td className="py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            R$ {bev.cost.toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-zinc-400">
                            R$ {allEquiv ? allEquiv.cost.toFixed(2) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 5: CALCULADORA DE BUFFET & LOUÇAS */}
        {/* ============================================================ */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Calculadora de Suprimentos & Materiais</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cálculos baseados em <strong>{guestStats.confirmedCount} confirmados</strong> ({guestStats.confWeightedEaters.toFixed(1)} cotas), <strong>{materialCalculations.confirmed.rechauds} pratos quentes do cardápio</strong> e <strong>{config.durationHours}h de duração</strong>.
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
              
              {/* ALIMENTOS */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-zinc-400" /> Resumo do Cardápio
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Total de Pratos Cadastrados</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{menu.length} pratos</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Pratos Quentes (Rechauds)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{materialCalculations.confirmed.rechauds} pratos</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Custo Total Insumos (Confirmados)</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">R$ {foodCalculations.confirmed.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Custo Total Insumos (Se Todos Fossem)</span>
                    <span className="font-semibold text-zinc-500">R$ {foodCalculations.all.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* BEBIDAS */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                  <Wine className="w-4 h-4 text-zinc-400" /> Resumo de Bebidas
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Tipos de Bebidas Detalhadas</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{beverages.length} itens</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Consumidores de Álcool</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{guestStats.confDrinkers} pessoas</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Custo Total Bebidas (Confirmados)</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">R$ {beverageCalculations.confirmed.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Custo Total Bebidas (Se Todos Fossem)</span>
                    <span className="font-semibold text-zinc-500">R$ {beverageCalculations.all.totalCost.toFixed(2)}</span>
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
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{materialCalculations.confirmed.mainPlates + materialCalculations.confirmed.dessertPlates} un</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Talheres (Garfos e Facas)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{materialCalculations.confirmed.forksAndKnives} pares</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Rechauds ({materialCalculations.confirmed.rechauds} pratos quentes)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{materialCalculations.confirmed.rechauds} cubas ({materialCalculations.confirmed.fuelPastesNeeded} pastilhas)</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Mesas & Cadeiras</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{materialCalculations.confirmed.tablesNeeded} mesas ({materialCalculations.confirmed.chairsNeeded} cad.)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 6: LOCAÇÕES COM EDIÇÃO COMPLETA & SINCRONIZAÇÃO */}
        {/* ============================================================ */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Locações, Brinquedos e Mobiliário</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Qualquer alteração feita aqui atualiza instantaneamente o <strong>Centro de Custos</strong> da festa.
                  </p>
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
        {/* ABA 7: CENTRO DE CUSTOS TOTALMENTE AUTOMATIZADO E DINÂMICO */}
        {/* ============================================================ */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold tracking-tight">Centro de Custos Integrado & Automatizado</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 font-medium">
                      Auto-Sync Ativo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Este centro de custos reflete automaticamente os valores de <strong>Locações</strong>, <strong>Receitas do Cardápio</strong>, <strong>Bebidas</strong> e <strong>Louças</strong>, comparando os confirmados com a lista completa.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openExpenseModal()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Despesa Avulsa</span>
                  </button>
                  <button
                    onClick={handleExportShoppingList}
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar TXT</span>
                  </button>
                </div>
              </div>

              {/* BARRA COMPARATIVA DE TOTAIS */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium block">
                    Total Real (Apenas Confirmados - {guestStats.confirmedCount} pessoas)
                  </span>
                  <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
                    R$ {consolidatedBudget.totalConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    R$ {consolidatedBudget.costPerConfirmed.toFixed(2)} / convidado confirmado
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 font-medium block">
                    Total Previsto (Se Todos Fossem - {guestStats.allEligibleCount} pessoas)
                  </span>
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 block">
                    R$ {consolidatedBudget.totalAll.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    R$ {consolidatedBudget.costPerAll.toFixed(2)} / pessoa elegível
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50">
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium block">
                    Economia Atual por Ausências/Pendências
                  </span>
                  <span className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1 block">
                    R$ {consolidatedBudget.diff.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">
                    Economia gerada por convites não confirmados
                  </span>
                </div>
              </div>

              {/* TABELA CONSOLIDADA DE DESPESAS */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="pb-2.5 font-medium">Item / Origem</th>
                      <th className="pb-2.5 font-medium">Categoria</th>
                      <th className="pb-2.5 font-medium">Origem do Cálculo</th>
                      <th className="pb-2.5 font-medium text-right">Confirmados</th>
                      <th className="pb-2.5 font-medium text-right">Se Todos Fossem</th>
                      <th className="pb-2.5 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {consolidatedBudget.lineItems.map(item => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                        <td className="py-3 text-zinc-500">{item.category}</td>
                        <td className="py-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                            {item.source}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                          R$ {item.confirmedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right font-medium text-zinc-600 dark:text-zinc-300">
                          R$ {item.allCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right">
                          {item.source === 'Despesa Avulsa' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openExpenseModal(manualExpenses.find(m => m.id === item.id))}
                                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                title="Editar Despesa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(item.id)}
                                className="p-1 rounded text-zinc-400 hover:text-rose-600"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-400 italic">Automático</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <td colSpan={3} className="pt-3 font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                        VALOR TOTAL DA FESTA
                      </td>
                      <td className="pt-3 text-right font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        R$ {consolidatedBudget.totalConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="pt-3 text-right font-bold text-sm text-zinc-800 dark:text-zinc-200">
                        R$ {consolidatedBudget.totalAll.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 8: CRONOGRAMA */}
        {/* ============================================================ */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Linha do Tempo & Tarefas</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Controle de prazos e providências para antes e no dia do evento
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
        {/* ABA 9: CONFIGURAÇÕES */}
        {/* ============================================================ */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-zinc-200/70 shadow-2xs'}`}>
              <h2 className="text-base font-semibold tracking-tight">Parâmetros do Evento</h2>
              <p className="text-xs text-zinc-500 mt-1 mb-5">Configure dados de local, horário e parâmetros de cálculo de louças</p>

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
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Custo Aluguel Jogo Mesa + Cadeiras (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.rentalTableSetCost}
                    onChange={(e) => setConfig({ ...config, rentalTableSetCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* MODAL: CONVIDADO COM GRUPOS E RESTRIÇÕES */}
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
      {/* MODAL: PRATO DO CARDÁPIO & INGREDIENTE/RECEITA */}
      {/* ============================================================ */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingMenuItem ? 'Editar Prato & Receita' : 'Novo Prato no Cardápio'}
            </h3>
            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nome do Prato</label>
                <input
                  type="text"
                  required
                  defaultValue={editingMenuItem?.name || ''}
                  name="name"
                  placeholder="Ex: Filé ao Molho Madeira"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoria</label>
                  <select
                    name="category"
                    defaultValue={editingMenuItem?.category || 'main'}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                  >
                    <option value="starter" className="dark:bg-zinc-900">Entradas & Canapés</option>
                    <option value="main" className="dark:bg-zinc-900">Prato Principal</option>
                    <option value="side" className="dark:bg-zinc-900">Guarnição / Salada</option>
                    <option value="dessert" className="dark:bg-zinc-900">Sobremesa & Doces</option>
                  </select>
                </div>
                <div className="pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isHot"
                      defaultChecked={editingMenuItem ? editingMenuItem.isHot : true}
                      className="rounded border-zinc-300"
                    />
                    <span className="font-medium">Servido Quente (Rechaud)</span>
                  </label>
                </div>
              </div>

              {/* DADOS DA RECEITA / INSUMO */}
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">Ingrediente Principal / Insumo:</span>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-0.5">Nome do Insumo</label>
                  <input
                    type="text"
                    name="ingName"
                    defaultValue={editingMenuItem?.ingredients?.[0]?.name || ''}
                    placeholder="Ex: Filé Mignon Limpo"
                    className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-0.5">Qtd / Pessoa</label>
                    <input
                      type="number"
                      step="0.01"
                      name="ingAmount"
                      defaultValue={editingMenuItem?.ingredients?.[0]?.amountPerPerson || 0.15}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-0.5">Unidade</label>
                    <select
                      name="ingUnit"
                      defaultValue={editingMenuItem?.ingredients?.[0]?.unit || 'kg'}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                    >
                      <option value="kg">kg</option>
                      <option value="L">L</option>
                      <option value="un">un</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-0.5">Preço Unit. (R$)</label>
                    <input
                      type="number"
                      step="0.5"
                      name="ingPrice"
                      defaultValue={editingMenuItem?.ingredients?.[0]?.unitPrice || 60}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                  </div>
                </div>
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
      {/* MODAL: LOCAÇÕES (CRIAR / EDITAR) */}
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
      {/* MODAL: DESPESA AVULSA */}
      {/* ============================================================ */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <h3 className="text-sm font-semibold mb-4">
              {editingExpense ? 'Editar Despesa Avulsa' : 'Nova Despesa Avulsa'}
            </h3>
            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Descrição</label>
                <input
                  type="text"
                  name="description"
                  required
                  defaultValue={editingExpense?.description || ''}
                  placeholder="Ex: Decoração de Balões ou Fotógrafo"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Categoria</label>
                <select
                  name="category"
                  defaultValue={editingExpense?.category || 'Decoração & Cenografia'}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                >
                  <option value="Decoração & Cenografia" className="dark:bg-zinc-900">Decoração & Cenografia</option>
                  <option value="Música & Atrações" className="dark:bg-zinc-900">Música & Atrações</option>
                  <option value="Fotografia & Vídeo" className="dark:bg-zinc-900">Fotografia & Vídeo</option>
                  <option value="Lembrancinhas" className="dark:bg-zinc-900">Lembrancinhas</option>
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
                  Salvar Despesa
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
