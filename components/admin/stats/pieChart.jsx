import React from "react";

import {
    Legend,
    LabelList,
    ResponsiveContainer,
    Pie,
    PieChart,
    Cell,
    Tooltip
} from 'recharts';
import colors from "../../../lib/colors.json";

function RenderPieChart({data}) {
  if (!Array.isArray(data)) {
    data = Object.entries(data).map((e) => ({
      name: e[0],
      value: e[1],
    }));
  }
  
  return <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <PieChart width={800} height={400}>
        <Legend paylodUniqBy />
        <Tooltip />
        <Pie
          data={data}
          dataKey="value"
          label
        >
          {
            data.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={colors[index * 4]} />
            ))
          }
          <LabelList />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
}

export default RenderPieChart;
