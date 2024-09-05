import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Card } from '@/components/ui/card'
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { TrendingDown, TrendingUp, WalletMinimal } from 'lucide-react'
import React, { ReactNode, useCallback, useMemo } from 'react'
import CountUp from 'react-countup'

function StatsCards({userSettings, from, to} : {
  userSettings: UserSettings; from: Date; to: Date
}) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", 'stats', from, to],
    queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json())
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  return (
    <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={income}
          title={"Income"}
          icon={
            <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-[#28ff61] bg-[#165126]' />
          }
        ></StatsCard>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={expense}
          title={"Expense"}
          icon={
            <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-[#ff4a4a] bg-[#671b1b]' />
          }
        ></StatsCard>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={income - expense}
          title={"Balance"}
          icon={
            <WalletMinimal className='h-12 w-12 items-center rounded-lg p-2 text-[#b619ff] bg-muted' />
          }
        ></StatsCard>
      </SkeletonWrapper>
    </div>
  )
}

export default StatsCards

function StatsCard({
  formatter,
  value,
  title,
  icon
} : {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: ReactNode
}){
  const formatFn = useCallback((value: number) => {
    return formatter.format(value)
  }, [formatter])

  return (
    <>
      <Card className='flex h-24 w-full items-center gap-4 p-3'>
        {icon}
        <div className='flex flex-col gap-0'>
          <p className='text-muted-foreground'>{title}</p>
            <CountUp
              preserveValue
              redraw={false}
              end={value}
              decimals={2}
              formattingFn={formatFn}
              className='text-2xl'
            />
        </div>
      </Card>
    </>
  )
}