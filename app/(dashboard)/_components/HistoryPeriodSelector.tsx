import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

export default function HistoryPeriodSelector({period, setPeriod, timeFrame, setTimeFrame}: {
    period: {month: number ; year: number},
    setPeriod:(period: {month: number ; year: number}) => void,
    timeFrame: "month" | "year",
    setTimeFrame: (timeFrame: "month" | "year") => void 
}){

    const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ["overview", "history", "periods"],
        queryFn: () => fetch("/api/history-periods").then(res=>res.json())
    })

    return(
        <div className='flex flex-wrap items-center gap-4'>
            <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as typeof timeFrame)}>
                    <TabsList>
                        <TabsTrigger value='year'>Year</TabsTrigger>
                        <TabsTrigger value='month'>Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>
            <div className="flex flex-wrap items-center gap-2">
                <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                    <YearSelector 
                        period={period}
                        setPeriod={setPeriod}
                        years={historyPeriods.data || []}
                    />
                </SkeletonWrapper>
                {timeFrame==="month" && (
                    <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                        <MonthSelector 
                            period={period}
                            setPeriod={setPeriod}
                        />
                    </SkeletonWrapper>
                )}
            </div>
        </div>
    )
}

function YearSelector({
    period,
    setPeriod,
    years
}:{
    period: {month: number ; year: number},
    setPeriod:(period: {month: number ; year: number}) => void,
    years: number[]
}){
    return(
        <Select
            value={period.year.toString()}
            onValueChange={(value) => setPeriod({
                month: period.month,
                year: parseInt(value)
            })}
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </SelectTrigger>
        </Select>
    )
}

function MonthSelector({
    period,
    setPeriod,
}:{
    period: {month: number ; year: number},
    setPeriod:(period: {month: number ; year: number}) => void,
}){
    return(
        <Select
            value={period.month.toString()}
            onValueChange={(value) => setPeriod({
                year: period.year,
                month: parseInt(value)
            })}
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
                <SelectContent>
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map((month) => {
                        const monthStr = new Date(period.year, month, 1).toLocaleString(
                            "default",
                            {month: "long"}
                        )
                        return(
                            <SelectItem key="month" value={month.toString()}>
                                {monthStr}
                            </SelectItem>
                        )
                    }
                    )}
                </SelectContent>
            </SelectTrigger>
        </Select>
    )
}