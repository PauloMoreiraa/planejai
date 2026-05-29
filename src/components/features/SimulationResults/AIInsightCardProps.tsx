import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

import type { SimulationRecord } from '../../../data/simulation'
import { useInsight } from '../../../hooks/useInsight'

import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'
import { ChatBox } from '../Insights/ChatBox'

interface AIInsightCardProps {
  simulationId: string
  simulation: SimulationRecord
}

export function AIInsightsCard({ simulationId, simulation }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      {/* Insight section */}
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && insight && !error && <Content insight={insight} />}

      {/* Divider */}
      <div className="border-t border-(--border) my-6" />

      {/* Chat section */}
      <ChatBox simulation={simulation} />
    </div>
  )
}