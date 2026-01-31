// ProgressGraph.tsx - Visual representation of student progress over time

// import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SubjectProgress, } from "../../utils/types";
import { MATH_LEVELS, ENGLISH_LEVELS } from "../../utils/types";

interface ProgressGraphProps {
  subjectProgress: SubjectProgress;
  showTimeline: boolean; // true = timeline view, false = level progression view
}

export default function ProgressGraph({
  subjectProgress,
  showTimeline,
}: ProgressGraphProps) {
  const levels =
    subjectProgress.subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;

  // Prepare data for timeline view (X-axis = time, Y-axis = level)
  const prepareTimelineData = () => {
    const data: any[] = [];

    subjectProgress.levelHistory.forEach((lp) => {
      const levelIndex = levels.indexOf(lp.level);

      // Add start point
      data.push({
        date: lp.startDate.getTime(),
        dateLabel: lp.startDate.toLocaleDateString(),
        level: lp.level,
        levelIndex: levelIndex,
        type: lp.isComplete ? "completed" : "current",
        monthsToComplete: lp.customMonthsToComplete,
      });

      // Add end point
      const endDate = lp.endDate || lp.estimatedCompletion;
      data.push({
        date: endDate.getTime(),
        dateLabel: endDate.toLocaleDateString(),
        level: lp.level,
        levelIndex: levelIndex,
        type: lp.isComplete ? "completed" : "projected",
        monthsToComplete: lp.customMonthsToComplete,
      });
    });

    return data.sort((a, b) => a.date - b.date);
  };

  // Prepare data for level progression view (X-axis = level, Y-axis = months)
  const prepareLevelProgressionData = () => {
    return subjectProgress.levelHistory.map((lp, index) => {
      const startDate = lp.startDate;
      const endDate = lp.endDate || lp.estimatedCompletion;
      const monthsDiff =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      return {
        level: lp.level,
        months: Math.round(monthsDiff * 10) / 10,
        type: lp.isComplete ? "completed" : "projected",
        customPace: lp.customMonthsToComplete,
        index,
      };
    });
  };

  const timelineData = showTimeline ? prepareTimelineData() : [];
  const levelProgressionData = !showTimeline
    ? prepareLevelProgressionData()
    : [];

  // Custom tooltip for timeline view
  const TimelineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{data.level}</p>
          <p className="text-sm">{data.dateLabel}</p>
          <p className="text-xs text-gray-600 capitalize">{data.type}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for level progression view
  const LevelProgressionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{data.level}</p>
          <p className="text-sm">{data.months} months</p>
          <p className="text-xs text-gray-600 capitalize">{data.type}</p>
          {data.customPace && (
            <p className="text-xs text-blue-600">Custom pace set</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (showTimeline) {
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(timestamp: any) =>
                new Date(timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  year: "2-digit",
                })
              }
              label={{
                value: "Date",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              dataKey="levelIndex"
              type="number"
              domain={[0, levels.length - 1]}
              tickFormatter={(index: number) => levels[index] || ""}
              label={{
                value: "Level",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<TimelineTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="levelIndex"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const color =
                  payload.type === "completed"
                    ? "#10b981"
                    : payload.type === "current"
                    ? "#3b82f6"
                    : "#9ca3af";
                return <circle cx={cx} cy={cy} r={4} fill={color} />;
              }}
              name="Progress"
            />
            {/* Add reference line for today */}
            <ReferenceLine
              x={new Date().getTime()}
              stroke="red"
              strokeDasharray="3 3"
              label="Today"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={levelProgressionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="level"
              label={{
                value: "Level",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Months to Complete",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<LevelProgressionTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="months"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const color =
                  payload.type === "completed" ? "#10b981" : "#9ca3af";
                return <circle cx={cx} cy={cy} r={4} fill={color} />;
              }}
              name="Time per Level"
            />
            {/* Reference line for default pace */}
            <ReferenceLine
              y={3.3}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label="Default (3.3 mo)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}