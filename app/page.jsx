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
  MessageSquareQuote,
  Calculator,
  RotateCcw,
  ThermometerSun,
  Scale
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
  { keywords: ['morango', 'morangos'], defaultAmount: 0.08, unit: 'kg', defaultCost: 28.00, category: 'Frutas' },
  { keywords: ['maracuja', 'maracujá'], defaultAmount: 0.05, unit: 'kg', defaultCost: 14.00, category: 'Frutas' },
  { keywords: ['limao', 'limão'], defaultAmount: 0.04, unit: 'kg', defaultCost: 6.50, category: 'Frutas' },
  { keywords: ['laranja'], defaultAmount: 0.15, unit: 'kg', defaultCost: 5.50, category: 'Frutas' },
  { keywords: ['abacaxi'], defaultAmount: 0.10, unit: 'kg', defaultCost: 7.00, category: 'Frutas' },
  { keywords: ['bolo', 'torta'], defaultAmount: 0.10, unit: 'kg', defaultCost: 75.00, category: 'Confeitaria' },
  { keywords: ['doce', 'docinho', 'brigadeiro', 'beijinho', 'trufa'], defaultAmount: 4, unit: 'un', defaultCost: 2.20, category: 'Doces' },
  { keywords: ['leite condensado'], defaultAmount: 0.05, unit: 'kg', defaultCost: 16.50, category: 'Confeitaria' },
  { keywords: ['chocolate em po', 'cacau', 'nutella'], defaultAmount: 0.02, unit: 'kg', defaultCost: 42.00, category: 'Confeitaria' }
];

// MODELOS RÁPIDOS DE PRATOS SUGERIDOS PARA FESTA EM SALVADOR
const SUGGESTED_DISH_TEMPLATES = [
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

// TABELA TÉCNICA DE RENDIMENTO DE FRUTAS PARA SUCOS EM EVENTOS
// (Quanto 1 kg de fruta in natura rende de suco pronto pronto para servir)
const FRUIT_JUICE_YIELD_TABLE = {
  morango: {
    name: 'Morango in Natura',
    yieldPerKgLiters: 1.85, // 1kg de morango batido com 1L de água/gelo rende ~1,85L
    waterRatio: '1 parte de fruta : 1 parte de água',
    description: '1 kg de morango limpo rende cerca de 1,8 a 2,0 Litros de suco pronto (~9 a 10 copos de 200ml).'
  },
  maracuja: {
    name: 'Maracujá (Fruta com casca)',
    yieldPerKgLiters: 1.60, // 1kg de fruta dá ~350g de polpa que rende ~1.6L
    waterRatio: '1 parte de polpa : 3 a 4 partes de água',
    description: '1 kg de maracujá rende ~350ml de polpa pura, diluindo para 1,5L a 1,7L de suco pronto.'
  },
  laranja: {
    name: 'Laranja Pêra',
    yieldPerKgLiters: 0.48, // Suco puro espremido sem água
    waterRatio: 'Puro (sem água)',
    description: '1 kg de laranja pera in natura espremida rende ~480ml de suco 100% puro (~2 a 3 copos).'
  },
  limao: {
    name: 'Limão Tahiti (Limonada Suíça)',
    yieldPerKgLiters: 2.40, // 1kg de limão faz bastante limonada
    waterRatio: '1kg rende 2,2L a 2,5L com água e gelo',
    description: '1 kg de limão rende cerca de 2,2L a 2,5L de limonada bem equilibrada.'
  },
  abacaxi: {
    name: 'Abacaxi Pérola',
    yieldPerKgLiters: 1.50,
    waterRatio: '1kg de polpa descascada + 500ml água',
    description: '1 kg de abacaxi descascado rende cerca de 1,5 Litros de suco denso com hortelã.'
  },
  uva: {
    name: 'Uva Roxa Integral',
    yieldPerKgLiters: 0.75,
    waterRatio: 'Extração integral',
    description: '1 kg de uva roxa rende aproximadamente 750ml de suco integral concentrado.'
  },
  polpa_congelada: {
    name: 'Polpa Congelada (100g / 1kg)',
    yieldPerKgLiters: 3.50, // 1kg de polpa (10 pacotinhos) rende ~3,5L
    waterRatio: '100g polpa : 250 a 300ml de água',
    description: '1 kg de polpa pura congelada rende cerca de 3,5 Litros de suco pronto.'
  }
};

// ORDEM CRONOLÓGICA DAS ETAPAS DO CARDÁPIO
const MENU_CATEGORY_ORDER = {
  starter: { order: 1, label: '1. Entradas, Canapés & Salgados' },
  protein: { order: 2, label: '2. Pratos Principais, Carnes & Almoço' },
  side: { order: 3, label: '3. Acompanhamentos & Guarnições' },
  dessert: { order: 4, label: '4. Sobremesas, Bolo & Doces' },
  other: { order: 5, label: '5. Outros Itens' }
};

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
  fuelPasteCost: 8.00,
  hostPin: "1234",
  servesAlcohol: true
};

const INITIAL_GUESTS = [
  { id: '1', name: 'Carlos Eduardo', group: 'Amigos Próximos', category: 'adult', status: 'confirmed', drinksAlcohol: true, restrictions: ['Sem restrições'], declineReason: '', messageToCelebrant: 'Ansioso pela comemoração!' },
  { id: '2', name: 'Fernanda Lima', group: 'Família', category: 'adult', status: 'confirmed', drinksAlcohol: false, restrictions: ['Vegetariano'], declineReason: '', messageToCelebrant: 'Parabéns adiantado!' },
  { id: '3', name: 'Lucas Lima (Filho)', group: 'Família', category: 'child_6_11', status: 'confirmed', drinksAlcohol: false, restrictions: ['Sem restrições'], declineReason: '', messageToCelebrant: '' },
  { id: '4', name: 'Rodrigo Alves', group: 'Amigos Próximos', category: 'adult', status: 'pending', drinksAlcohol: true, restrictions: ['Sem restrições'], declineReason: '', messageToCelebrant: '' },
  { id: '5', name: 'Juliana Pires', group: 'Amigos Próximos', category: 'adult', status: 'declined', drinksAlcohol: false, restrictions: ['Sem restrições'], declineReason: 'Viagem já agendada', messageToCelebrant: 'Mari, estarei fora da cidade nessa data mas desejo um ano maravilhoso para você! ❤️' }
];

const INITIAL_BEVERAGE_TYPES = [
  { id: 'b1', name: 'Refrigerante Cola (Coca-Cola / Zero)', category: 'soda', mlPerPersonPerHour: 90, unitCostPerLiter: 5.50, unitPackage: 'Garrafa 2L', packageVolume: 2.0, purchasedPackages: 0 },
  { id: 'b2', name: 'Refrigerante Guaraná (Antarctica)', category: 'soda', mlPerPersonPerHour: 60, unitCostPerLiter: 5.00, unitPackage: 'Garrafa 2L', packageVolume: 2.0, purchasedPackages: 0 },
  { id: 'b3', name: 'Suco de Uva Integral', category: 'juice', mlPerPersonPerHour: 40, unitCostPerLiter: 11.00, unitPackage: 'Garrafa 1.5L', packageVolume: 1.5, purchasedPackages: 0 },
  { id: 'b4', name: 'Sucos Variados (Laranja / Maracujá)', category: 'juice', mlPerPersonPerHour: 50, unitCostPerLiter: 8.50, unitPackage: 'Garrafa 1L', packageVolume: 1.0, purchasedPackages: 0 },
  { id: 'b5', name: 'Água de Coco Natural', category: 'juice', mlPerPersonPerHour: 40, unitCostPerLiter: 7.80, unitPackage: 'Garrafa 1L', packageVolume: 1.0, purchasedPackages: 0 },
  { id: 'b6', name: 'Água Mineral sem Gás', category: 'water', mlPerPersonPerHour: 80, unitCostPerLiter: 2.20, unitPackage: 'Garrafão 5L', packageVolume: 5.0, purchasedPackages: 0 },
  { id: 'b7', name: 'Água Mineral com Gás', category: 'water', mlPerPersonPerHour: 40, unitCostPerLiter: 3.50, unitPackage: 'Garrafa 500ml', packageVolume: 0.5, purchasedPackages: 0 },
  { id: 'b8', name: 'Chopp Artesanal / Cerveja Puro Malte', category: 'alcohol', mlPerPersonPerHour: 320, unitCostPerLiter: 14.00, unitPackage: 'Barril 50L ou Lata', packageVolume: 0.35, purchasedPackages: 0 },
  { id: 'b9', name: 'Vinho / Espumante Brut', category: 'alcohol', mlPerPersonPerHour: 60, unitCostPerLiter: 48.00, unitPackage: 'Garrafa 750ml', packageVolume: 0.75, purchasedPackages: 0 },
  { id: 'b10', name: 'Gelo Filtrado (Consumo)', category: 'ice', mlPerPersonPerHour: 80, unitCostPerLiter: 3.00, unitPackage: 'Saco 5kg', packageVolume: 5.0, purchasedPackages: 0 },
  { id: 'b11', name: 'Gelo em Cubos/Barra (Tina & Coolers)', category: 'ice', mlPerPersonPerHour: 100, unitCostPerLiter: 2.20, unitPackage: 'Saco 10kg', packageVolume: 10.0, purchasedPackages: 0 }
];

// MODELOS TÉCNICOS FIXOS DE CALCULADORA DE BEBIDAS (ESTILO DESCORCHA / EVENT MASTER)
// PRESERVAM SEMPRE OS VALORES ORIGINAIS CASO VOCÊ ALTERE E QUEIRA RESTAURAR
const BEVERAGE_CALCULATOR_PRESETS = {
  churrasco_boteco: {
    label: 'Churrasco & Boteco Sunset',
    description: 'Foco alto em cerveja/chopp bem gelado, água mineral, refrigerantes e água de coco.',
    rates: {
      soda: 140, // ml/pessoa/h somados
      juice: 80,
      water: 120,
      alcohol_beer: 360,
      alcohol_wine: 30,
      ice: 200
    }
  },
  jantar_formal: {
    label: 'Jantar Formal & Casamento / 15 Anos',
    description: 'Consumo equilibrado com ênfase em vinhos tintos, brancos, espumante brut para brindes e água.',
    rates: {
      soda: 100,
      juice: 60,
      water: 140,
      alcohol_beer: 180,
      alcohol_wine: 90,
      ice: 140
    }
  },
  balada_animada: {
    label: 'Festa Animada & Balada',
    description: 'Público festeiro com alto consumo de chopp, cerveja, energéticos e gelo abundante.',
    rates: {
      soda: 150,
      juice: 70,
      water: 150,
      alcohol_beer: 420,
      alcohol_wine: 40,
      ice: 240
    }
  },
  padrao_salvador: {
    label: 'Padrão Técnico Salvador (Equilibrado)',
    description: 'Proporções clássicas testadas para o calor de Salvador, com margem de segurança.',
    rates: {
      soda: 150,
      juice: 90,
      water: 120,
      alcohol_beer: 320,
      alcohol_wine: 60,
      ice: 180
    }
  }
};

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

  // CALCULADORA DE BEBIDAS (ESTILO DESCORCHA)
  const [calcEventType, setCalcEventType] = useState('padrao_salvador');
  const [calcIntensity, setCalcIntensity] = useState('normal'); // 'light' (0.85) | 'normal' (1.0) | 'heavy' (1.2)
  const [calcWeather, setCalcWeather] = useState('hot'); // 'mild' (0.95) | 'hot' (1.15) | 'very_hot' (1.30)
  const [calcPanelOpen, setCalcPanelOpen] = useState(false);

  // CALCULADORA DE RENDIMENTO DE FRUTAS / SUCOS
  const [fruitCalcModalOpen, setFruitCalcModalOpen] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState('morango');
  const [fruitKgInput, setFruitKgInput] = useState(1);

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
  const [hostPin, setHostPin] = useState('1234');
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
    const effectivePin = config.hostPin || hostPin || '1234';
    if (pinInput.trim() === effectivePin.trim()) {
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
    const effectivePin = config.hostPin || hostPin || '1234';
    if (currentPinAttempt.trim() !== effectivePin.trim()) {
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
    setConfig(prev => ({ ...prev, hostPin: updatedPin }));
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
          if (d.config) {
            setConfig(d.config);
            if (d.config.hostPin) setHostPin(d.config.hostPin);
          }
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
        const savedPin = localStorage.getItem('festplanner_host_pin');
        if (savedPin) setHostPin(savedPin);
        const savedGuests = localStorage.getItem('festplanner_guests_v3') || localStorage.getItem('festplanner_guests');
        if (savedGuests) setGuests(JSON.parse(savedGuests));
        const savedConfig = localStorage.getItem('festplanner_config_v3') || localStorage.getItem('festplanner_config');
        if (savedConfig) {
          const parsedCfg = JSON.parse(savedConfig);
          setConfig(parsedCfg);
          if (parsedCfg.hostPin) setHostPin(parsedCfg.hostPin);
        }
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

  // Estatísticas e Métricas de Convidados e Consumo
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

  // Cálculos do Cardápio & Insumos de Salvador
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

    return {
      itemsDetailed,
      totalCostConfirmed: Math.round(totalCostConfirmed), 
      totalCostAll: Math.round(totalCostAll) 
    };
  }, [menu, stats.confirmedEaters, stats.allPotentialEaters]);

  // Cálculos de Bebidas Detalhadas com MOTOR DE COMPENSAÇÃO DE SOBRAS (Pools de Intercâmbio)
  const calculatedBeverages = useMemo(() => {
    const hours = Number(config.durationHours) || 5;
    const servesAlcohol = config.servesAlcohol !== false;
    let totalBeveragesCostConfirmed = 0;
    let totalBeveragesCostAll = 0;

    // Ordenação Alfabética A-Z das Bebidas
    const sortedBeverages = [...beverages].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    // PASSO 1: Cálculo base de volume necessário e comprado em Litros
    const rawList = sortedBeverages.map(bev => {
      const isAlcohol = bev.category === 'alcohol';

      if (isAlcohol && !servesAlcohol) {
        return {
          ...bev,
          totalLitersConfirmed: 0,
          totalCostConfirmed: 0,
          packagesConfirmed: 0,
          totalLitersAll: 0,
          totalCostAll: 0,
          packagesAll: 0,
          purchasedPackages: 0,
          purchasedLiters: 0,
          purchasedCost: 0,
          balanceLiters: 0,
          disabled: true
        };
      }

      const compensationFactor = (!servesAlcohol && (bev.category === 'soda' || bev.category === 'juice')) ? 1.25 : 1.0;
      const effectiveRate = bev.mlPerPersonPerHour * compensationFactor;

      const headcountConfirmed = isAlcohol ? stats.confirmedDrinkers : stats.confirmedCount;
      const headcountAll = isAlcohol ? stats.allPotentialDrinkers : stats.totalGuests;

      const totalLitersConfirmed = Number(((effectiveRate * headcountConfirmed * hours) / 1000).toFixed(1));
      const totalCostConfirmed = Number((totalLitersConfirmed * bev.unitCostPerLiter).toFixed(2));

      const totalLitersAll = Number(((effectiveRate * headcountAll * hours) / 1000).toFixed(1));
      const totalCostAll = Number((totalLitersAll * bev.unitCostPerLiter).toFixed(2));

      const packagesConfirmed = Math.ceil(totalLitersConfirmed / (bev.packageVolume || 1));
      const packagesAll = Math.ceil(totalLitersAll / (bev.packageVolume || 1));

      const purchased = Number(bev.purchasedPackages) || 0;
      const purchasedLiters = Number((purchased * (bev.packageVolume || 1)).toFixed(1));
      const purchasedCost = Number((purchasedLiters * bev.unitCostPerLiter).toFixed(2));

      totalBeveragesCostConfirmed += totalCostConfirmed;
      totalBeveragesCostAll += totalCostAll;

      return {
        ...bev,
        purchasedPackages: purchased,
        purchasedLiters,
        purchasedCost,
        totalLitersConfirmed,
        totalCostConfirmed,
        packagesConfirmed,
        totalLitersAll,
        totalCostAll,
        packagesAll,
        balanceLiters: Number((purchasedLiters - totalLitersConfirmed).toFixed(1)),
        disabled: false
      };
    });

    // PASSO 2: Balanço de Sobras por Pool (Refrigerantes, Sucos, Cervejas, Gelo, Água)
    const poolSurplus = {
      soda: 0,
      juice: 0,
      water: 0,
      alcohol: 0,
      ice: 0
    };

    // Identifica quanto sobrou em Litros em cada categoria
    rawList.forEach(b => {
      if (!b.disabled && b.balanceLiters > 0) {
        poolSurplus[b.category] = (poolSurplus[b.category] || 0) + b.balanceLiters;
      }
    });

    // Cria cópia manipulável das sobras para abater déficits
    const availablePoolSurplus = { ...poolSurplus };

    // PASSO 3: Aplicação da compensação inteligente (Sobra de uma supre a outra)
    const list = rawList.map(bev => {
      if (bev.disabled) {
        return {
          ...bev,
          balancePackages: 0,
          missingPackages: 0,
          missingCost: 0,
          surplusPackages: 0,
          surplusLiters: 0,
          isCompensated: false,
          compensatedLiters: 0
        };
      }

      const rawDiffLiters = bev.balanceLiters;
      const packageVol = bev.packageVolume || 1;

      if (rawDiffLiters >= 0) {
        // Sobra própria
        const surplusPkgs = Math.floor(rawDiffLiters / packageVol);
        return {
          ...bev,
          balancePackages: surplusPkgs,
          missingPackages: 0,
          missingCost: 0,
          surplusPackages: surplusPkgs,
          surplusLiters: rawDiffLiters,
          isCompensated: false,
          compensatedLiters: 0
        };
      }

      // Déficit nesta bebida específica
      const neededLiters = Math.abs(rawDiffLiters);
      let coveredFromSameCategory = 0;
      let coveredFromCrossCategory = 0;

      // 1. Tenta cobrir com a sobra da mesma categoria (ex: Coca cobre Guaraná)
      if (availablePoolSurplus[bev.category] > 0) {
        const canTake = Math.min(availablePoolSurplus[bev.category], neededLiters);
        coveredFromSameCategory = canTake;
        availablePoolSurplus[bev.category] -= canTake;
      }

      // 2. Se for suco ou água e ainda faltar, verifica se sobrou refrigerante ou vice-versa (Intercâmbio de Hidratação)
      const remainingDeficit = neededLiters - coveredFromSameCategory;
      if (remainingDeficit > 0) {
        if (bev.category === 'juice' && availablePoolSurplus.soda > 0) {
          const crossTake = Math.min(availablePoolSurplus.soda, remainingDeficit);
          coveredFromCrossCategory = crossTake;
          availablePoolSurplus.soda -= crossTake;
        } else if (bev.category === 'soda' && availablePoolSurplus.juice > 0) {
          const crossTake = Math.min(availablePoolSurplus.juice, remainingDeficit);
          coveredFromCrossCategory = crossTake;
          availablePoolSurplus.juice -= crossTake;
        } else if (bev.category === 'water' && (availablePoolSurplus.soda > 0 || availablePoolSurplus.juice > 0)) {
          const poolKey = availablePoolSurplus.juice > 0 ? 'juice' : 'soda';
          const crossTake = Math.min(availablePoolSurplus[poolKey], remainingDeficit);
          coveredFromCrossCategory = crossTake;
          availablePoolSurplus[poolKey] -= crossTake;
        }
      }

      const totalCoveredLiters = Number((coveredFromSameCategory + coveredFromCrossCategory).toFixed(1));
      const effectiveDeficitLiters = Math.max(0, Number((neededLiters - totalCoveredLiters).toFixed(1)));
      const effectiveMissingPackages = Math.ceil(effectiveDeficitLiters / packageVol);
      const effectiveMissingCost = Number((effectiveMissingPackages * packageVol * bev.unitCostPerLiter).toFixed(2));

      return {
        ...bev,
        balancePackages: -effectiveMissingPackages,
        missingPackages: effectiveMissingPackages,
        missingCost: effectiveMissingCost,
        surplusPackages: 0,
        surplusLiters: 0,
        isCompensated: totalCoveredLiters > 0,
        compensatedLiters: totalCoveredLiters,
        compensatedSource: coveredFromCrossCategory > 0 ? 'Intercâmbio (Refri/Suco)' : 'Sobra do Grupo'
      };
    });

    const totalPurchasedCost = list.reduce((acc, b) => acc + (b.disabled ? 0 : b.purchasedCost), 0);
    // Custo pendente real considera as compensações
    const totalPendingCost = list.reduce((acc, b) => acc + (b.disabled ? 0 : b.missingCost), 0);

    // Resumo dos Grupos de Hidratação
    const nonAlcoholicLitersNeeded = list
      .filter(b => !b.disabled && (b.category === 'soda' || b.category === 'juice' || b.category === 'water'))
      .reduce((acc, b) => acc + b.totalLitersConfirmed, 0);

    const nonAlcoholicLitersPurchased = list
      .filter(b => !b.disabled && (b.category === 'soda' || b.category === 'juice' || b.category === 'water'))
      .reduce((acc, b) => acc + b.purchasedLiters, 0);

    const nonAlcoholicBalance = Number((nonAlcoholicLitersPurchased - nonAlcoholicLitersNeeded).toFixed(1));

    return { 
      list, 
      totalCostConfirmed: Math.round(totalBeveragesCostConfirmed), 
      totalCostAll: Math.round(totalBeveragesCostAll),
      totalPurchasedCost: Math.round(totalPurchasedCost),
      totalPendingCost: Math.round(totalPendingCost),
      poolSurplus,
      nonAlcoholicLitersNeeded: Number(nonAlcoholicLitersNeeded.toFixed(1)),
      nonAlcoholicLitersPurchased: Number(nonAlcoholicLitersPurchased.toFixed(1)),
      nonAlcoholicBalance
    };
  }, [beverages, config.durationHours, config.servesAlcohol, stats.confirmedCount, stats.confirmedDrinkers, stats.totalGuests, stats.allPotentialDrinkers]);

  // Cálculos de Louças, Rechauds, Mesas e Descartáveis
  const calculatedMaterials = useMemo(() => {
    const confirmed = stats.confirmedCount;
    const all = stats.totalGuests;
    const safety = 1 + ((Number(config.safetyMarginPct) || 15) / 100);
    const servesAlcohol = config.servesAlcohol !== false;

    const mainPlates = Math.ceil(confirmed * 1.25 * safety);
    const dessertPlates = Math.ceil(confirmed * 1.35 * safety);
    const forksAndKnives = Math.ceil(confirmed * 1.3 * safety);
    const waterGlasses = Math.ceil(confirmed * (servesAlcohol ? 1.5 : 2.0) * safety);
    const beerTulips = servesAlcohol ? Math.ceil(stats.confirmedDrinkers * 2 * safety) : 0;

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

  // --- MOTOR DE CÁLCULO DE BEBIDAS (DESCORCHA CALIBRATION) ---
  const handleApplyDescorchaCalculator = () => {
    const preset = BEVERAGE_CALCULATOR_PRESETS[calcEventType] || BEVERAGE_CALCULATOR_PRESETS.padrao_salvador;

    // Fator de intensidade
    const intensityMultiplier = calcIntensity === 'light' ? 0.85 : calcIntensity === 'heavy' ? 1.25 : 1.0;

    // Fator de clima (Salvador é quente por padrão)
    const weatherHydrationMultiplier = calcWeather === 'very_hot' ? 1.30 : calcWeather === 'hot' ? 1.15 : 0.95;

    const updated = beverages.map(bev => {
      let baseRate = bev.mlPerPersonPerHour;

      if (bev.category === 'alcohol') {
        if (bev.name.toLowerCase().includes('vinho') || bev.name.toLowerCase().includes('espumante')) {
          baseRate = preset.rates.alcohol_wine * intensityMultiplier;
        } else {
          baseRate = preset.rates.alcohol_beer * intensityMultiplier * (calcWeather === 'very_hot' ? 1.1 : 1.0);
        }
      } else if (bev.category === 'water') {
        baseRate = (bev.name.toLowerCase().includes('com gás') ? 40 : 80) * weatherHydrationMultiplier;
      } else if (bev.category === 'juice') {
        baseRate = 45 * weatherHydrationMultiplier;
      } else if (bev.category === 'soda') {
        baseRate = (bev.name.toLowerCase().includes('cola') ? 85 : 55) * weatherHydrationMultiplier;
      } else if (bev.category === 'ice') {
        baseRate = (bev.name.toLowerCase().includes('consumo') ? 80 : 110) * weatherHydrationMultiplier;
      }

      return {
        ...bev,
        mlPerPersonPerHour: Math.round(baseRate)
      };
    });

    setBeverages(updated);
    showToast(`Bebidas recalculadas pelo perfil "${preset.label}"!`);
  };

  // Função para restaurar exatamente os padrões de fábrica originais
  const handleRestoreDefaultBeverages = () => {
    setBeverages(INITIAL_BEVERAGE_TYPES);
    showToast('Parâmetros originais de bebidas restaurados com sucesso!');
  };

  // --- CRUD BEBIDAS ---
  const handleOpenBeverageModal = (bev = null) => {
    setEditingBeverage(bev);
    setBeverageModalOpen(true);
  };

  const handleUpdatePurchasedQty = (id, newPurchased) => {
    const qty = Math.max(0, parseInt(newPurchased, 10) || 0);
    setBeverages(beverages.map(b => b.id === id ? { ...b, purchasedPackages: qty } : b));
  };

  const handleSaveBeverage = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const mlPerPersonPerHour = Number(form.mlPerPersonPerHour.value) || 0;
    
    // Suporte robusto a decimais com vírgula ou ponto (ex: 7,39 ou 2.97)
    const rawCostStr = form.unitCostPerLiter.value.toString().replace(',', '.');
    const unitCostPerLiter = parseFloat(rawCostStr) || 0;
    
    const unitPackage = form.unitPackage.value.trim() || 'Garrafa 2L';
    const packageVolume = Number(form.packageVolume.value.toString().replace(',', '.')) || 1.0;
    const purchasedPackages = Math.max(0, parseInt(form.purchasedPackages?.value || 0, 10));

    if (!name) return;

    if (editingBeverage) {
      setBeverages(beverages.map(b => b.id === editingBeverage.id ? { ...b, name, category, mlPerPersonPerHour, unitCostPerLiter, unitPackage, packageVolume, purchasedPackages } : b));
      showToast('Bebida atualizada!');
    } else {
      const newBev = { id: 'bev-' + Date.now(), name, category, mlPerPersonPerHour, unitCostPerLiter, unitPackage, packageVolume, purchasedPackages };
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
2. BEBIDAS & GELO (BALANÇO DE ESTOQUE)
============================================================
${calculatedBeverages.list.map(bev => {
  const statusStr = bev.disabled 
    ? '[Não Servido]' 
    : bev.balancePackages === 0 
    ? '[OK - Quantidade Exata]' 
    : bev.balancePackages < 0 
    ? `[FALTAM: ${bev.missingPackages} un (~R$ ${bev.missingCost.toFixed(2)})]` 
    : `[SOBRA: +${bev.surplusPackages} un (~${bev.surplusLiters}L)]`;

  return `  - ${bev.name}:
      Necessário: ${bev.packagesConfirmed} un (${bev.totalLitersConfirmed} L) | Já Comprado: ${bev.purchasedPackages} un
      Status: ${statusStr}`;
}).join('\n')}

Subtotal Total Estimado de Bebidas: R$ ${calculatedBeverages.totalCostConfirmed.toLocaleString('pt-BR')}
Já Investido / Comprado: R$ ${calculatedBeverages.totalPurchasedCost.toLocaleString('pt-BR')}
Pendente a Comprar: R$ ${calculatedBeverages.totalPendingCost.toLocaleString('pt-BR')}

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
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Abrir Menu de Navegação"
            >
              <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            </button>
            <span className="font-bold text-sm truncate max-w-[140px] sm:max-w-none">{config.celebrantName || 'Meu Evento'}</span>
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
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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

        {/* DRAWER LATERAL MOBILE COMPLETO */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform ${
              darkMode ? 'bg-zinc-950 border-r border-zinc-800 text-zinc-100' : 'bg-white border-r border-zinc-200 text-zinc-900'
            }`}>
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold">
                      <Cake className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">FestPlanner</span>
                      <span className="text-[10px] text-zinc-400">Navegação Geral</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Resumo da festa mobile */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{config.celebrantName}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Início: {config.startTime} • {config.durationHours}h de festa</p>
                </div>

                {/* Abas */}
                <nav className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-sm'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-zinc-400'}`} />
                          <span>{item.label}</span>
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

              {/* Ações inferiores do drawer mobile */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <button
                  onClick={() => {
                    setRsvpSimModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Enviar Convite Digital</span>
                </button>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setEventEditModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-zinc-500 hover:text-emerald-500 flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ajustar Horário</span>
                  </button>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFruitCalcModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-xs hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                      >
                        <Scale className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Calculadora de Frutas & Sucos (kg ➔ L)</span>
                      </button>

                      <button
                        onClick={() => handleOpenBeverageModal(null)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nova Bebida</span>
                      </button>
                    </div>
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
                          <h3 className="text-base font-bold">Cardápio Cronológico (Entradas ➔ Principal ➔ Sobremesa)</h3>
                          <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            Ordem de Início
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Pratos agrupados cronologicamente pelo momento em que são servidos no evento.
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

                    {/* Lista Completa dos Pratos Agrupada por Etapas Cronológicas */}
                    <div className="space-y-6">
                      {['starter', 'protein', 'side', 'dessert'].map(catKey => {
                        const dishesInCat = calculatedMenu.itemsDetailed.filter(d => (d.category || 'protein') === catKey);
                        if (dishesInCat.length === 0) return null;

                        const catInfo = MENU_CATEGORY_ORDER[catKey] || { label: catKey };

                        return (
                          <div key={catKey} className="space-y-3">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-200 dark:border-zinc-800">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                {catInfo.label}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-normal">
                                ({dishesInCat.length} {dishesInCat.length === 1 ? 'opção' : 'opções'})
                              </span>
                            </div>

                            <div className="space-y-3">
                              {dishesInCat.map(dish => (
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
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-ABA 2: BEBIDAS E GELO (ORGANIZADAS EM ORDEM ALFABÉTICA) */}
              {cateringSubTab === 'beverages' && (
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold">Discriminação de Bebidas, Sucos & Gelo</h3>
                        <span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-400">
                          Ordem Alfabética (A-Z)
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">Estimativas dimensionadas para {config.durationHours} horas de celebração</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* TOGGLE: SERVIR BEBIDAS ALCOÓLICAS */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <Wine className={`w-4 h-4 ${config.servesAlcohol !== false ? 'text-emerald-500' : 'text-zinc-400'}`} />
                        <span className="text-xs font-semibold">Bebidas Alcoólicas:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextVal = !(config.servesAlcohol !== false);
                            setConfig({ ...config, servesAlcohol: nextVal });
                            showToast(nextVal ? 'Bebidas alcoólicas ativadas no cálculo!' : 'Bebidas alcoólicas desativadas (não alcoólico)!');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            config.servesAlcohol !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {config.servesAlcohol !== false ? 'SIM (Chopp/Vinho)' : 'NÃO (Sem Álcool)'}
                        </button>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-400 block uppercase">Total Bebidas (Confirmados)</span>
                        <strong className="text-lg font-bold text-emerald-600">R$ {calculatedBeverages.totalCostConfirmed.toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* CARDS DE SALDO DE COMPRAS DE BEBIDAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">Orçamento Total de Bebidas</span>
                      <strong className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">
                        R$ {calculatedBeverages.totalCostConfirmed.toLocaleString('pt-BR')}
                      </strong>
                      <span className="text-[11px] text-zinc-500">Custo planejado para {stats.confirmedCount} confirmados</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Já Comprado / Em Estoque</span>
                      <strong className="text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                        R$ {calculatedBeverages.totalPurchasedCost.toLocaleString('pt-BR')}
                      </strong>
                      <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Valor correspondente aos itens já adquiridos</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Pendente Real (Com Compensação)</span>
                      <strong className="text-base font-bold text-amber-700 dark:text-amber-300 mt-0.5 block">
                        R$ {calculatedBeverages.totalPendingCost.toLocaleString('pt-BR')}
                      </strong>
                      <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                        {calculatedBeverages.totalPendingCost === 0 ? 'Tudo suprido! As sobras cobriram os itens pendentes.' : 'Falta adquirir para atingir o volume total.'}
                      </span>
                    </div>
                  </div>

                  {/* PAINEL DE INTELIGÊNCIA: BALANÇO DE HIDRATAÇÃO TOTAL & COMPENSAÇÃO DE SOBRAS */}
                  <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Motor de Intercâmbio & Compensação de Sobras Ativo
                        </span>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                          Balanço Geral Não Alcoólico (Refri + Sucos + Águas): <strong>{calculatedBeverages.nonAlcoholicLitersPurchased} L</strong> comprados de <strong>{calculatedBeverages.nonAlcoholicLitersNeeded} L</strong> necessários.
                        </p>
                      </div>

                      <div className="shrink-0">
                        {calculatedBeverages.nonAlcoholicBalance >= 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Meta de Líquidos Atingida (+{calculatedBeverages.nonAlcoholicBalance}L de folga)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
                            <span>Déficit global: {Math.abs(calculatedBeverages.nonAlcoholicBalance)} L restantes</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {config.servesAlcohol === false && (
                    <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Wine className="w-4 h-4 shrink-0 text-amber-500" />
                      <span>
                        <strong>Modo Sem Álcool Ativo:</strong> Cervejas, chopp e vinhos foram zerados no orçamento. O consumo de refrigerantes, sucos e água foi compensado automaticamente (+25%).
                      </span>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                          <th className="pb-2.5">Bebida / Insumo</th>
                          <th className="pb-2.5">Consumo / Hora</th>
                          <th className="pb-2.5">Necessário (Meta)</th>
                          <th className="pb-2.5 text-center">Já Comprado (Estoque)</th>
                          <th className="pb-2.5">Balanço & Compensação</th>
                          <th className="pb-2.5 text-right">Custo Total</th>
                          <th className="pb-2.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {calculatedBeverages.list.map(bev => (
                          <tr key={bev.id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 ${bev.disabled ? 'opacity-40 line-through' : ''}`}>
                            <td className="py-3 font-medium">
                              {bev.name}
                              {bev.disabled && (
                                <span className="ml-2 text-[10px] no-underline px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-normal">
                                  Não servido
                                </span>
                              )}
                              <span className="block text-[10px] text-zinc-400 font-normal mt-0.5">
                                Embalagem: {bev.unitPackage} ({bev.packageVolume}L) • R$ {Number(bev.unitCostPerLiter).toFixed(2)}/L
                              </span>
                            </td>
                            <td className="py-3 text-zinc-500">{bev.disabled ? '0 ml/h' : `${bev.mlPerPersonPerHour} ml/h`}</td>
                            <td className="py-3">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{bev.packagesConfirmed} un</span>
                              <span className="text-[10px] text-zinc-400 block">{bev.totalLitersConfirmed} Litros</span>
                            </td>

                            {/* CONTROLE INLINE DE QUANTIDADE JÁ COMPRADA */}
                            <td className="py-3 text-center">
                              {bev.disabled ? (
                                <span className="text-zinc-400">-</span>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 justify-center">
                                  <input
                                    type="number"
                                    min="0"
                                    value={bev.purchasedPackages || 0}
                                    onChange={(e) => handleUpdatePurchasedQty(bev.id, e.target.value)}
                                    className="w-16 px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center font-bold text-xs text-zinc-900 dark:text-zinc-100 focus:border-emerald-500 outline-none"
                                    title="Digite quantas embalagens você já comprou"
                                  />
                                  <span className="text-[11px] text-zinc-400 font-medium">un</span>
                                </div>
                              )}
                            </td>

                            {/* BALANÇO INTELIGENTE: FALTA / SOBRA / COMPENSADO POR OUTRA BEBIDA */}
                            <td className="py-3">
                              {bev.disabled ? (
                                <span className="text-zinc-400 text-[11px]">-</span>
                              ) : bev.surplusPackages > 0 || (bev.purchasedPackages >= bev.packagesConfirmed && bev.missingPackages === 0) ? (
                                bev.surplusPackages > 0 ? (
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200/50 dark:border-cyan-800/50 text-[11px] font-bold">
                                      Sobra de +{bev.surplusPackages} un (+{bev.surplusLiters}L)
                                    </span>
                                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                                      ↳ Suprindo déficits do grupo
                                    </span>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 text-[11px] font-semibold">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>Tudo comprado</span>
                                  </span>
                                )
                              ) : bev.missingPackages === 0 && bev.isCompensated ? (
                                <div>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50 text-[11px] font-semibold">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>100% Suprido por sobra</span>
                                  </span>
                                  <span className="block text-[10px] text-zinc-400 mt-0.5">
                                    {bev.compensatedLiters}L cobertos ({bev.compensatedSource})
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 text-[11px] font-bold">
                                    Faltam {bev.missingPackages} un
                                  </span>
                                  {bev.isCompensated && (
                                    <span className="block text-[10px] text-teal-600 dark:text-teal-400 mt-0.5 font-medium">
                                      {bev.compensatedLiters}L já abatidos por sobras
                                    </span>
                                  )}
                                  <span className="block text-[10px] text-zinc-400 mt-0.5">
                                    A comprar: R$ {bev.missingCost.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </td>

                            <td className="py-3 text-right font-bold text-emerald-600">R$ {bev.totalCostConfirmed.toLocaleString('pt-BR')}</td>
                            <td className="py-3 text-right">
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
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStructureSubTab('rentals')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      structureSubTab === 'rentals'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    Locações de Brinquedos, Espaço & Móveis
                  </button>
                  <button
                    onClick={() => setStructureSubTab('tableware')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      structureSubTab === 'tableware'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    Calculadora de Louças, Rechauds & Mesas
                  </button>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Subtotal Estrutura</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    R$ {(budget.rentalsCost + budget.tablewareCostConfirmed).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {structureSubTab === 'rentals' && (
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-base font-bold tracking-tight">Locações, Brinquedos e Mobiliário</h2>
                      <p className="text-xs text-zinc-500 mt-1">Gerencie os equipamentos infantis, espaço físico e móveis contratados.</p>
                    </div>
                    <button
                      onClick={() => handleOpenRentalModal(null)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Item de Locação</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rentals.map(rental => (
                      <div key={rental.id} className={`p-4 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200/70'}`}>
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
                                title="Editar"
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
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            R$ {Number(rental.cost || 0).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {structureSubTab === 'tableware' && (
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-base font-bold tracking-tight">Calculadora de Louças, Rechauds, Mesas & Descartáveis</h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Dimensionamento técnico de pratos, talheres, taças e pastilhas de queima para rechauds inox.
                      </p>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl text-xs font-medium">
                      <button
                        onClick={() => setConfig({ ...config, materialMode: 'rental' })}
                        className={`px-3 py-1 rounded-lg transition ${config.materialMode === 'rental' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold' : 'text-zinc-500'}`}
                      >
                        Louças / Aluguel
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, materialMode: 'disposable' })}
                        className={`px-3 py-1 rounded-lg transition ${config.materialMode === 'disposable' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold' : 'text-zinc-500'}`}
                      >
                        Descartáveis
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <strong className="text-zinc-900 dark:text-zinc-100">{calculatedMaterials.guestTablesNeeded} jogos</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: CENTRO DE CUSTOS */}
          {/* ============================================================ */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-base font-bold tracking-tight">Centro de Custos Integrado & Sincronizado</h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Custo Real com Confirmados: <strong>R$ {budget.grandTotalConfirmed.toLocaleString('pt-BR')}</strong> | Se Todos Forem: <strong>R$ {budget.grandTotalAll.toLocaleString('pt-BR')}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenExpenseModal(null)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Despesa Manual</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-6">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Locações & Espaço</span>
                    <strong className="text-base block mt-1">R$ {budget.rentalsCost.toLocaleString('pt-BR')}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Buffet (Receitas & Carnes)</span>
                    <strong className="text-base block mt-1 text-emerald-600">R$ {budget.foodCostConfirmed.toLocaleString('pt-BR')}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Bebidas Detalhadas & Gelo</span>
                    <strong className="text-base block mt-1 text-emerald-600">R$ {budget.beveragesCostConfirmed.toLocaleString('pt-BR')}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                    <span className="text-zinc-400 block text-[11px]">Louças, Rechauds & Mesas</span>
                    <strong className="text-base block mt-1">R$ {budget.tablewareCostConfirmed.toLocaleString('pt-BR')}</strong>
                  </div>
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
                          <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">{expense.description}</td>
                          <td className="py-3 text-zinc-500">{expense.category}</td>
                          <td className="py-3 text-zinc-600 dark:text-zinc-300">R$ {Number(expense.estimated || 0).toLocaleString('pt-BR')}</td>
                          <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100">
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
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
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
          {/* TAB 6: LINHA DO TEMPO */}
          {/* ============================================================ */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                <h2 className="text-base font-bold tracking-tight">Linha do Tempo & Tarefas</h2>
                <p className="text-xs text-zinc-500 mt-1 mb-4">
                  {stats.completedChecklist} de {checklist.length} concluídas ({stats.checklistProgress}%)
                </p>
                <div className="space-y-2.5">
                  {checklist.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setChecklist(checklist.map(item => item.id === task.id ? { ...item, completed: !item.completed } : item))}
                      className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition ${
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
                      <span className="text-[10px] text-zinc-400 shrink-0 ml-3">{task.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: CONFIGURAÇÕES DO EVENTO */}
          {/* ============================================================ */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold tracking-tight">Parâmetros Gerais do Evento</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Configure aniversariante, local, tema e PIN de segurança</p>
                  </div>
                  <button
                    onClick={() => setEventEditModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ajustar Horário & Data</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Nome do Aniversariante</label>
                    <input
                      type="text"
                      value={config.celebrantName}
                      onChange={(e) => setConfig({ ...config, celebrantName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Título / Tema da Ocasião</label>
                    <input
                      type="text"
                      value={config.theme || ''}
                      onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                      placeholder="Ex: Aniversário de 36 anos"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Data da Festa</label>
                    <input
                      type="date"
                      value={config.date}
                      onChange={(e) => setConfig({ ...config, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Duração Total (horas)</label>
                    <input
                      type="number"
                      value={config.durationHours}
                      onChange={(e) => setConfig({ ...config, durationHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Nome do Salão / Local</label>
                    <input
                      type="text"
                      value={config.venueName}
                      onChange={(e) => setConfig({ ...config, venueName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Endereço Completo</label>
                    <input
                      type="text"
                      value={config.venueAddress}
                      onChange={(e) => setConfig({ ...config, venueAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                {/* Card de alteração de PIN */}
                <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Senha de Proteção do Painel (PIN)</h3>
                    <p className="text-[11px] text-zinc-500">Impede que convidados visualizem despesas e lista completa caso apaguem /rsvp da URL.</p>
                  </div>
                  <button
                    onClick={() => setChangePinModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-xs font-semibold"
                  >
                    Alterar PIN
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL: RECADO DO CONVIDADO */}
      {/* ============================================================ */}
      {guestMessageModalOpen && viewingGuestMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-100 space-y-3 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <strong className="text-sm font-bold">{viewingGuestMessage.name}</strong>
              <button onClick={() => setGuestMessageModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            {viewingGuestMessage.declineReason && (
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Motivo informado para ausência:</span>
                <p className="text-rose-400 font-medium mt-0.5">{viewingGuestMessage.declineReason}</p>
              </div>
            )}
            {viewingGuestMessage.messageToCelebrant && (
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Recado carinhoso:</span>
                <p className="text-zinc-200 italic mt-0.5 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                  "{viewingGuestMessage.messageToCelebrant}"
                </p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setGuestMessageModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ALTERAR PIN DE SEGURANÇA */}
      {/* ============================================================ */}
      {changePinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-3 text-xs shadow-2xl">
            <h3 className="font-bold text-sm">Alterar Senha do Anfitrião (PIN)</h3>
            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">PIN Atual</label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={currentPinAttempt}
                  onChange={(e) => setCurrentPinAttempt(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Novo PIN (mínimo 4 dígitos)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Confirmar Novo PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmNewPinValue}
                  onChange={(e) => setConfirmNewPinValue(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-center font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setChangePinModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white"
                >
                  Salvar PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIÇÃO RÁPIDA DE HORÁRIO E DATA */}
      {/* ============================================================ */}
      {eventEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold">Editar Programação & Horário</h3>
              </div>
              <button onClick={() => setEventEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const startTime = form.startTime.value;
              const endTime = form.endTime.value;
              const date = form.date.value;
              const theme = form.theme.value.trim();

              let duration = Number(config.durationHours) || 5;
              try {
                const [startH, startM] = startTime.split(':').map(Number);
                const [endH, endM] = endTime.split(':').map(Number);
                let diff = (endH + endM / 60) - (startH + startM / 60);
                if (diff <= 0) diff += 24;
                duration = Math.round(diff * 10) / 10;
              } catch (_) {}

              setConfig({
                ...config,
                date,
                startTime,
                endTime,
                theme: theme || config.theme,
                durationHours: duration
              });
              setEventEditModalOpen(false);
              showToast(`Horário atualizado para ${startTime} (${duration}h de festa)!`);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Título da Comemoração (ex: Aniversário de 36 anos)</label>
                <input
                  type="text"
                  name="theme"
                  defaultValue={config.theme || ''}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Data da Comemoração</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={config.date}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Início da Festa</label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue={config.startTime}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Término da Festa</label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue={config.endTime}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs font-semibold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEventEditModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LINK RSVP */}
      {rsvpSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4 text-xs">
            <h3 className="font-bold text-sm">Link de RSVP & Convite Digital</h3>
            <p className="text-zinc-400">Compartilhe o link do convite com seus convidados pelo WhatsApp:</p>
            {(() => {
              const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/rsvp` : 'https://seu-app.vercel.app/rsvp';
              return (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-emerald-400 break-all select-all">
                    {currentUrl}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(currentUrl);
                          showToast('Link copiado!');
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Copiar Link
                    </button>
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium"
                      title="Copiar mensagem pronta para WhatsApp"
                    >
                      Copiar Texto
                    </button>
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setRsvpSimModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CONVIDADO (CRIAR E EDITAR MANUALMENTE) */}
      {/* ============================================================ */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold">{editingGuest ? 'Editar Convidado' : 'Novo Convidado'}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setGuestModalOpen(false);
                  setEditingGuest(null);
                }} 
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">Nome Completo</label>
                <input
                  type="text"
                  required
                  defaultValue={editingGuest?.name || ''}
                  name="name"
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">Grupo / Categoria</label>
                  <select 
                    name="group" 
                    defaultValue={editingGuest?.group || 'Família'} 
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs dark:bg-zinc-900"
                  >
                    {PRESET_GROUPS.map((grp, i) => (
                      <option key={i} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">Faixa Etária</label>
                  <select 
                    name="category" 
                    defaultValue={editingGuest?.category || 'adult'} 
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs dark:bg-zinc-900"
                  >
                    <option value="adult">Adulto (Cota integral)</option>
                    <option value="child_6_11">Criança 6-11 anos (0.5 cota)</option>
                    <option value="child_0_5">Criança 0-5 anos (Isento)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">Status RSVP (Presença)</label>
                  <select 
                    name="status" 
                    defaultValue={editingGuest?.status || 'pending'} 
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs dark:bg-zinc-900 font-semibold"
                  >
                    <option value="confirmed">Confirmado (Irá comparecer)</option>
                    <option value="pending">Pendente (Aguardando resposta)</option>
                    <option value="declined">Ausente (Não comparecerá)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      name="drinksAlcohol" 
                      defaultChecked={editingGuest ? editingGuest.drinksAlcohol : true} 
                      className="rounded border-zinc-300 dark:border-zinc-700" 
                    />
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Consome Bebidas Alcoólicas</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">Restrições Alimentares</label>
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
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                          isSelected 
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-semibold shadow-xs' 
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => {
                    setGuestModalOpen(false);
                    setEditingGuest(null);
                  }} 
                  className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition"
                >
                  {editingGuest ? 'Salvar Alterações' : 'Adicionar Convidado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CALCULADORA DE RENDIMENTO DE FRUTAS & SUCOS (kg ➔ L) */}
      {/* ============================================================ */}
      {fruitCalcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Calculadora de Rendimento de Frutas & Sucos</h3>
              </div>
              <button onClick={() => setFruitCalcModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <p className="text-zinc-400 text-xs">
              Descubra exatamente quantos litros e copos de suco pronto cada quilo de fruta in natura vai produzir para sua festa.
            </p>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Qual fruta você comprou?</label>
                  <select
                    value={selectedFruit}
                    onChange={(e) => setSelectedFruit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-medium outline-none focus:border-emerald-500"
                  >
                    <option value="morango">🍓 Morango in Natura</option>
                    <option value="maracuja">🟡 Maracujá da Fruta</option>
                    <option value="laranja">🍊 Laranja Pêra (Suco Puro)</option>
                    <option value="limao">🍋 Limão (Limonada)</option>
                    <option value="abacaxi">🍍 Abacaxi Pérola</option>
                    <option value="uva">🍇 Uva Roxa Integral</option>
                    <option value="polpa_congelada">🧊 Polpa de Fruta Congelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Quantidade Comprada (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={fruitKgInput}
                    onChange={(e) => setFruitKgInput(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-base font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* RESULTADO DO CÁLCULO DE RENDIMENTO */}
              {(() => {
                const info = FRUIT_JUICE_YIELD_TABLE[selectedFruit] || FRUIT_JUICE_YIELD_TABLE.morango;
                const totalLitersProduced = Number((fruitKgInput * info.yieldPerKgLiters).toFixed(2));
                const totalGlasses200ml = Math.floor((totalLitersProduced * 1000) / 200);
                const totalGlasses300ml = Math.floor((totalLitersProduced * 1000) / 300);

                return (
                  <div className="mt-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                      Resultado Técnico de Produção:
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white">{totalLitersProduced} Litros</span>
                      <span className="text-xs text-emerald-300">de suco pronto para servir</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-900/60 text-xs">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Copos de 200ml:</span>
                        <strong className="text-white text-sm">~{totalGlasses200ml} copos</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Copos de 300ml:</span>
                        <strong className="text-white text-sm">~{totalGlasses300ml} copos</strong>
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-zinc-300">
                      💡 <strong>Proporção ideal:</strong> {info.waterRatio}
                      <p className="text-zinc-400 mt-0.5">{info.description}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* TABELA DE REFERÊNCIA RÁPIDA DE TODAS AS FRUTAS */}
            <div className="space-y-2">
              <span className="font-semibold text-zinc-300 block">Tabela Rápida de Rendimento (1 kg de cada fruta):</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {Object.entries(FRUIT_JUICE_YIELD_TABLE).map(([k, item]) => (
                  <div key={k} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-[11px]">
                    <div>
                      <strong className="text-white block">{item.name}</strong>
                      <span className="text-zinc-400 text-[10px]">{item.waterRatio}</span>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs shrink-0">
                      1kg ➔ {item.yieldPerKgLiters} Litros
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setFruitCalcModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs"
              >
                Fechar Calculadora
              </button>
            </div>
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
                  <input
                    type="number"
                    step="0.01"
                    name="unitCostPerLiter"
                    defaultValue={editingBeverage?.unitCostPerLiter !== undefined ? editingBeverage.unitCostPerLiter : 5.00}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Embalagem</label>
                  <input type="text" name="unitPackage" defaultValue={editingBeverage?.unitPackage || 'Garrafa 2L'} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Volume Emb. (L)</label>
                  <input type="number" step="0.01" name="packageVolume" defaultValue={editingBeverage?.packageVolume || 2.0} className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Já Comprado / Estoque Atual (Quantidade de Embalagens)</label>
                <input
                  type="number"
                  min="0"
                  name="purchasedPackages"
                  defaultValue={editingBeverage?.purchasedPackages || 0}
                  placeholder="Ex: 5"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Informe quantas unidades/garrafas você já tem em casa ou comprou. O sistema calculará o que falta ou a sobra automaticamente.
                </span>
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
