"use client"

import dynamic from "next/dynamic"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardChartsData } from "./dashboard-charts-client"

function ChartsSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Fluxo mensal</CardTitle>
          <CardDescription>Entradas e saidas previstas em reais.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recebimentos</CardTitle>
          <CardDescription>Distribuicao por categoria.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Status dos processos</CardTitle>
          <CardDescription>Visao operacional por fase atual.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

const DashboardChartsClient = dynamic(
  () =>
    import("./dashboard-charts-client").then(
      (mod) => mod.DashboardChartsClient
    ),
  {
    ssr: false,
    loading: ChartsSkeleton,
  }
)

export function DashboardCharts({ data }: { data: DashboardChartsData }) {
  return <DashboardChartsClient data={data} />
}
