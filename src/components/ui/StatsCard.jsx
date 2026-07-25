import { Card, CardContent } from "@/components/ui/card"

const StatsCard = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">
                  {isLoading ? "-" : stat.count}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsCard
