import type { SimulationRecord } from '../data/simulation'
import { parseCurrency } from '../utils/currency'

export function buildChatSystemPrompt(simulation: SimulationRecord): string {
  const monthlySavings =
    parseCurrency(simulation.income) -
    parseCurrency(simulation.expenses) -
    parseCurrency(simulation.debts)

  return `Você é um consultor financeiro pessoal do app Planej.ai. 
Responda de forma clara, objetiva e encorajadora em português do Brasil.
Fale sempre em segunda pessoa. Nunca use markdown como **, ## ou listas com hífens.
Mantenha respostas curtas (máximo 3 parágrafos). 

Contexto financeiro do usuário:
- Renda mensal bruta: R$ ${simulation.income}
- Custos fixos essenciais: R$ ${simulation.expenses}
- Dívidas e parcelas mensais: R$ ${simulation.debts}
- Valor disponível por mês: R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Meta: ${simulation.goalName}
- Custo da meta: R$ ${simulation.goalAmount}
- Prazo desejado: ${simulation.goalDeadline} meses

Use esses dados para personalizar suas respostas quando relevante.`
}
