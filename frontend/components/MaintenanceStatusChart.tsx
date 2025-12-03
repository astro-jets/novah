// MaintenanceStatusChart.tsx
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

type ChartDataItem = {
    name: string;
    value: number;
    color: string;
};

interface MaintenanceStatusChartProps {
    data: ChartDataItem[];
}

// Custom tooltip for better display
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#1e1e1e] p-2 border border-gray-600 rounded-lg shadow-xl">
                <p className="text-sm font-semibold text-white">{`${data.name}: ${data.value}`}</p>
                <p className="text-xs text-gray-400">{`${((data.value / data.total) * 100).toFixed(1)}%`}</p>
            </div>
        );
    }
    return null;
};

export default function MaintenanceStatusChart({ data }: MaintenanceStatusChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Augment data with the total for the tooltip calculation
    const dataWithTotal = data.map(item => ({ ...item, total }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={dataWithTotal}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" // Center X
                    cy="50%" // Center Y
                    outerRadius={120}
                    fill="#8884d8"
                    labelLine={false}
                    // Display the percentage label inside the pie slices
                    label={({ percent }) => `${((percent as number) * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {/* Legend at the bottom */}
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}