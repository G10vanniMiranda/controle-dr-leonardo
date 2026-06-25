"use client"

import { useEffect, useRef, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const chartColors = ["#2563eb", "#6b7280", "#9ca3af", "#3a3a3a"]

const tooltipStyle = {
  backgroundColor: "#2f2f2f",
  border: "1px solid #404040",
  borderRadius: "12px",
  color: "#ffffff",
}

const axisTick = { fill: "#9e9e9e", fontSize: 12 }
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
})

export type DashboardChartsData = {
  caseStatus: { name: string; total: number }[]
  categoryReceipts: { name: string; value: number }[]
  monthlyFlow: { entradas: number; month: string; saidas: number }[]
}

function ChartFrame({
  children,
  className,
}: {
  children: (size: { height: number; width: number }) => React.ReactNode
  className: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ height: 0, width: 0 })

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width)
      const height = Math.floor(entry.contentRect.height)

      if (width > 0 && height > 0) {
        setSize({ height, width })
      }
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {size.width > 0 && size.height > 0 ? (
        children(size)
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  )
}

export function DashboardChartsClient({ data }: { data: DashboardChartsData }) {
  const { caseStatus, categoryReceipts, monthlyFlow } = data

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="min-w-0 xl:col-span-2">
        <CardHeader>
          <CardTitle>Fluxo mensal</CardTitle>
          <CardDescription>Entradas e saidas previstas em reais.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartFrame className="h-80 min-w-0">
            {({ height, width }) => (
            <BarChart data={monthlyFlow} width={width} height={height}>
              <CartesianGrid vertical={false} stroke="#404040" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${Number(value) / 1000}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#3a3a3a", opacity: 0.35 }}
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(value))
                }
              />
              <Bar dataKey="entradas" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="saidas" fill="#6b7280" radius={[6, 6, 0, 0]} />
            </BarChart>
            )}
          </ChartFrame>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Recebimentos</CardTitle>
          <CardDescription>Distribuicao por categoria.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartFrame className="h-52 min-w-0">
            {({ height, width }) => (
              <PieChart width={width} height={height}>
                <Pie
                  data={categoryReceipts}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryReceipts.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) =>
                    currencyFormatter.format(Number(value) / 100)
                  }
                />
              </PieChart>
            )}
          </ChartFrame>
          <div className="grid gap-2">
            {categoryReceipts.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: chartColors[index % chartColors.length] }}
                  />
                  {item.name}
                </span>
                <span className="font-medium">
                  {currencyFormatter.format(item.value / 100)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0 xl:col-span-3">
        <CardHeader>
          <CardTitle>Status dos processos</CardTitle>
          <CardDescription>Visao operacional por fase atual.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartFrame className="h-72 min-w-0">
            {({ height, width }) => (
              <BarChart data={caseStatus} layout="vertical" width={width} height={height}>
              <CartesianGrid horizontal={false} stroke="#404040" strokeDasharray="3 3" />
              <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#3a3a3a", opacity: 0.35 }} />
              <Bar dataKey="total" fill="#2563eb" radius={[0, 6, 6, 0]} />
            </BarChart>
            )}
          </ChartFrame>
        </CardContent>
      </Card>
    </div>
  )
}
