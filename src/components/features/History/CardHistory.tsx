import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Goal,
  Landmark,
  PiggyBank,
  Trash2,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import type { SimulationRecord } from '../../../data/simulation'
import { parseCurrency } from '../../../utils/currency'

interface CardHistoryProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
}

function formatCurrency(value: string) {
  return `R$ ${parseCurrency(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function calcMonthlySavings(data: SimulationRecord) {
  return parseCurrency(data.income) - parseCurrency(data.expenses) - parseCurrency(data.debts)
}

interface DeleteModalProps {
  goalName: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ goalName, onConfirm, onCancel }: DeleteModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="bg-card mx-4 w-full max-w-sm rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-500/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <Trash2 size={22} className="text-red-500" />
        </div>

        <h2 className="text-foreground mb-1 text-base font-semibold">Excluir simulação?</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          A simulação{' '}
          <span className="text-foreground font-medium">"{goalName}"</span> será removida
          permanentemente do histórico.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-secondary-button text-foreground flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function CardHistory({ simulation, onDelete }: CardHistoryProps) {
  const [expanded, setExpanded] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  const monthlySavings = calcMonthlySavings(simulation)
  const monthsToGoal = Math.ceil(
    parseCurrency(simulation.goalAmount) / Math.max(monthlySavings, 0.01),
  )

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    onDelete(simulation.id)
    setShowDeleteModal(false)
  }

  const handleViewResult = (e: React.MouseEvent) => {
    e.stopPropagation()
    void navigate(`/resultado/${simulation.id}`)
  }

  const details = [
    { icon: Wallet, label: 'Renda mensal', value: formatCurrency(simulation.income) },
    { icon: CreditCard, label: 'Custos fixos', value: formatCurrency(simulation.expenses) },
    { icon: Landmark, label: 'Dívidas / parcelas', value: formatCurrency(simulation.debts) },
    { icon: Goal, label: 'Custo da meta', value: formatCurrency(simulation.goalAmount) },
    { icon: CalendarClock, label: 'Prazo desejado', value: `${simulation.goalDeadline} meses` },
  ]

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          goalName={simulation.goalName}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div
        className={[
          'bg-card rounded-2xl shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)] transition-all duration-300',
          'border border-(--border) overflow-hidden',
        ].join(' ')}
      >
        {/* Header do card — sempre visível */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-(--border)/30"
        >
          {/* Ícone da meta */}
          <div className="bg-muted-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <PiggyBank size={20} className="text-primary" />
          </div>

          {/* Título e economia */}
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-semibold">{simulation.goalName}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Economize{' '}
              <span className="text-primary font-semibold">
                {`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês`}
              </span>{' '}
              — ~
              {monthsToGoal > Number(simulation.goalDeadline) ? (
                <span className="text-red-500">{monthsToGoal} meses</span>
              ) : (
                <span>{monthsToGoal} meses</span>
              )}
            </p>
          </div>

          {/* Ações */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteClick}
              title="Deletar simulação"
              className="text-muted-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 size={15} />
            </button>

            <div className="text-muted-foreground">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </button>

        {/* Conteúdo expandido */}
        {expanded && (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-(--border) px-5 py-4 duration-200">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-(--border)/30 px-4 py-3"
                >
                  <div className="bg-muted-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{label}</p>
                    <p className="text-foreground text-sm font-semibold">{value}</p>
                  </div>
                </div>
              ))}

              {/* Economia mensal destaque */}
              <div className="bg-primary flex items-center gap-3 rounded-xl px-4 py-3 sm:col-span-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <PiggyBank size={15} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-primary-foreground/70 text-xs">Economia mensal necessária</p>
                  <p className="text-primary-foreground text-sm font-semibold">
                    {`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Botão ver resultado completo */}
            <button
              type="button"
              onClick={handleViewResult}
              className="bg-primary text-primary-foreground mt-4 w-full cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Ver resultado completo →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
