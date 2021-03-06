import React from "react";
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    BarChart,
} from 'recharts';

function RenderBarChart({data, dataKey, layout}) {
    dataKey = !dataKey ? "name" : dataKey;
    layout = !layout ? "horizontal" : "vertical";

    if (!Array.isArray(data)) {

        data = Object.entries(data).map((e) => {
            var data = {
                vistas: e[1]
            };

            data[dataKey] = e[0];

            return data;
        });
    }

    const isHorizontal = layout === 'horizontal';

    return <div style={{height: !isHorizontal ? data.length * 50 : 300, width: "100%", marginBottom: 50}}>
        <ResponsiveContainer>
            <BarChart data={data}
                layout={!layout ? 'horizontal' : layout} 
                margin={{ left: isHorizontal ? 0 : 250}}
            >
                <XAxis
                    type={!isHorizontal ? 'number' : 'category'}
                    dataKey={isHorizontal ? dataKey : undefined}
                />
                <YAxis
                    type={isHorizontal ? 'number' : 'category'}
                    dataKey={!isHorizontal ? dataKey : undefined}
                />
                <CartesianGrid />
                <Tooltip />
                <Bar
                    dataKey="vistas"
                    fill="#03a9f4"
                    radius={[isHorizontal ? 5 : 0, 5, isHorizontal ? 0 : 5, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    </div>
}

export default RenderBarChart;
