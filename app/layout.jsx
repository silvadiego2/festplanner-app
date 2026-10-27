import './globals.css';

export const metadata = {
  title: 'FestPlanner Pro - Gestão de Aniversários e Eventos',
  description: 'Calculadora de buffet, louças, convidados e custos de aniversários',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
