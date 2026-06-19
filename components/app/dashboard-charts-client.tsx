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
  caseStatus,
  categoryReceipts,
  monthlyFlow,
} from "@/lib/dashboard-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const chartColors = ["#18181b", "#52525b", "#a1a1aa", "#d4d4d8"]

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

export function DashboardChartsClient() {
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
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${Number(value) / 1000}k`}
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(value))
                }
              />
              <Bar dataKey="entradas" fill="#18181b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="saidas" fill="#a1a1aa" radius={[6, 6, 0, 0]} />
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
                <Tooltip formatter={(value) => `${value}%`} />
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
                <span className="font-medium">{item.value}%</span>
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
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="total" fill="#27272a" radius={[0, 6, 6, 0]} />
            </BarChart>
            )}
          </ChartFrame>
        </CardContent>
      </Card>
    </div>
  )
}
