import { Clock, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSimulationStorage } from '../../../hooks/useSimulationStorage'
import { Button } from '../../shared/Button'
import { PageHero } from '../../shared/PageHero'
import { CardHistory } from './CardHistory'

export function History() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(() => getAllSimulations())
  const navigate = useNavigate()

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations(getAllSimulations())
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Todas as suas simulações financeiras salvas localmente."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center justify-center rounded-2xl border border-(--border) px-6 py-16 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.08)]">
          <div className="bg-muted-primary mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Clock size={28} className="text-primary" />
          </div>
          <h2 className="text-foreground mb-2 text-lg font-semibold">
            Nenhuma simulação encontrada
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xs text-sm">
            Faça sua primeira simulação financeira e ela aparecerá aqui.
          </p>
          <Button
            variant="primary"
            icon={TrendingUp}
            onClick={() => void navigate('/')}
          >
            Criar simulação
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {simulations.map((simulation) => (
            <CardHistory
              key={simulation.id}
              simulation={simulation}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  )
}
