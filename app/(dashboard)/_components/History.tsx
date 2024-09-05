'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetFormatterForCurrency } from '@/lib/helpers'
import { UserSettings } from '@prisma/client'
import React, { useMemo, useState } from 'react'
import HistoryPeriodSelector from './HistoryPeriodSelector'
import { useQuery } from '@tanstack/react-query'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function History({userSettings} : {userSettings: UserSettings}) {
    const [timeFrame, setTimeFrame] = useState<"month" | "year">("month")
    const [period, setPeriod] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency)
    }, [userSettings.currency])

    const historyDataQuery = useQuery({
        queryKey: ["overview", "history", timeFrame, period],
        queryFn: () => 
            fetch(`/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`).then(res => res.json())
    })

    const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;
    console.log(historyDataQuery.data);
    

  return (
    <div className="container">
        <h2 className="mt-12 text-3xl font-bold">History</h2>
        <Card className='col-span-12 mt-2 w-full'>
            <CardHeader className='gap-2'>
                <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col'>
                    <HistoryPeriodSelector 
                        period={period}
                        setPeriod={setPeriod}
                        timeFrame={timeFrame}
                        setTimeFrame = {setTimeFrame}
                    />

                    <div className='flex h-10 gap-2'>
                        <Badge className='flex items-center gap-2 text-sm' variant={'outline'}>
                            <div className='h-4 w-4 rounded-full bg-[#22ca4e]'></div>
                            Income
                        </Badge>
                        <Badge className='flex items-center gap-2 text-sm' variant={'outline'}>
                            <div className='h-4 w-4 rounded-full bg-[#cb3b3b]'></div>
                            Expense
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
                    {dataAvailable && (
                        <ResponsiveContainer width={"100%"} height={300}>
                            <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                                <defs>
                                    <linearGradient id='incomeBar' x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
                                        <stop offset={"0"} stopColor='#28ff61' stopOpacity={"1"}>
                                            
                                        </stop>
                                        
                                        <stop offset={"1"} stopColor='#28ff61' stopOpacity={"0"}>

                                        </stop>
                                    </linearGradient>

                                    <linearGradient id='expenseBar' x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
                                        <stop offset={"0"} stopColor='#ff4a4a' stopOpacity={"1"}>
                                            
                                        </stop>

                                        <stop offset={"1"} stopColor='#ff4a4a' stopOpacity={"0"}>

                                        </stop>
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray={"5 5"}
                                    strokeOpacity={"0.2"}
                                    vertical={false}
                                />
                                <XAxis 
                                    stroke='#888888'
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    padding={{
                                        left:5,
                                        right:5
                                    }}
                                    dataKey={(data) => {
                                        const {year, month, day} = data;
                                        const date = new Date(year, month, day || 1)
                                        
                                        if(timeFrame=="year"){
                                            return date.toLocaleDateString("default", {
                                                month: "long"
                                            })
                                        }
                                        return date.toLocaleDateString("default", {
                                            day: "2-digit"
                                        })
                                    }}
                                />
                                <YAxis
                                    stroke='#888888'
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Bar
                                    dataKey={"income"}
                                    label={"Income"}
                                    fill='url(#incomeBar)'
                                    radius={4}
                                />
                                <Bar
                                    dataKey={"expense"}
                                    label={"Expense"}
                                    fill='url(#expenseBar)'
                                    radius={4}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                    
                    {!dataAvailable && (
                        <Card className='flex h-[300px] flex-col items-center justify-center bg-background'>
                            No data available.
                            <p className='text-sm text-muted-foreground'>
                                Try selecting a different period or adding new transactions.
                            </p>
                        </Card>
                    )}
                </SkeletonWrapper>
            </CardContent>
        </Card>
    </div>
  )
}

export default History

