// ProgressGraph.tsx - Visual representation of student progress over time

import { useState, useMemo } from "react";
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
  Scatter,
  ScatterChart,
} from "recharts";
import type { SubjectProgress, GradeSkip } from "../../utils/types";
import { MATH_LEVELS, ENGLISH_LEVELS } from "../../utils/types";
import { calculateGradeLevelLine } from "../../utils/gradeProgressService";

interface ProgressGraphProps {
  subjectProgress: SubjectProgress;
  showTimeline: boolean;
  startingGrade?: string;
  gradeSkips?: GradeSkip[];
}

export default function ProgressGraph({
  subjectProgress,
  showTimeline,
  startingGrade,
  gradeSkips = [],
}: ProgressGraphProps) {
  const [showMonthsSinceProgramStart, setShowMonthsSinceProgramStart] = useState(false);
  
  const levels =
    subjectProgress.subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;

  // Get program start date
  const programStartDate = subjectProgress.programStartDate;
  
  // Calculate student's end date from their last level (works for Math or English)
  // Add a small buffer (1 month) so the orange line extends slightly past the blue line's last point
  const studentEndDate = useMemo(() => {
    const lastLevel = subjectProgress.levelHistory[subjectProgress.levelHistory.length - 1];
    
    if (!lastLevel) {
      // Fallback to estimated completion if no level history exists
      const bufferedDate = new Date(subjectProgress.estimatedCompletionDate);
      bufferedDate.setMonth(bufferedDate.getMonth() + 1);
      return bufferedDate;
    }
    
    // Use the last level's end date (actual or estimated)
    const endDate = lastLevel.endDate || lastLevel.estimatedCompletion;
    
    // Add 1 month buffer so orange line extends slightly beyond blue line's last point
    const bufferedDate = new Date(endDate);
    bufferedDate.setMonth(bufferedDate.getMonth() + 1);
    
    // console.log("Student end date:", bufferedDate.toLocaleDateString(), "from level:", lastLevel.level);
    
    return bufferedDate;
  }, [subjectProgress]);
  
  // Calculate grade level points
  const gradeLevelPoints = useMemo(() => {
    if (!startingGrade || !programStartDate) {
      // console.log("Missing startingGrade or programStartDate:", { startingGrade, programStartDate });
      return [];
    }
    
    // console.log("Calculating grade level line:", {
    //   startingGrade,
    //   programStartDate: programStartDate.toLocaleDateString(),
    //   subject: subjectProgress.subject,
    //   gradeSkips,
    //   studentEndDate: studentEndDate.toLocaleDateString()
    // });
    
    try {
      const points = calculateGradeLevelLine(
        startingGrade,
        programStartDate,
        subjectProgress.subject,
        gradeSkips,
        studentEndDate  // Pass the end date to stop calculation
      );
      // console.log("Grade level points calculated:", points.length, "points");
      return points;
    } catch (error) {
      console.error("Error calculating grade level line:", error);
      return [];
    }
  }, [startingGrade, programStartDate, subjectProgress.subject, gradeSkips, studentEndDate]);

  // Generate Y-axis ticks (show all levels)
  const getYAxisTicks = () => {
    const ticks: number[] = [];
    // Show every level
    for (let i = 0; i < levels.length; i++) {
      ticks.push(i);
    }
    return ticks;
  };

  // Generate X-axis ticks based on 3 month intervals
  const getXAxisTicks = (minDate: number, maxDate: number) => {
    const ticks: number[] = [];
    const startDate = new Date(minDate);
    const endDate = new Date(maxDate);
    
    // Start from the beginning of the month
    startDate.setDate(1);
    
    let currentDate = new Date(startDate);
    const msPerMonth = 30.44 * 24 * 60 * 60 * 1000; // Average days per month
    const tickInterval = 3 * msPerMonth; // 3 months in milliseconds
    
    while (currentDate.getTime() <= endDate.getTime()) {
      ticks.push(currentDate.getTime());
      currentDate = new Date(currentDate.getTime() + tickInterval);
    }
    
    // Add one more tick beyond the end for better visualization
    ticks.push(currentDate.getTime());
    
    return ticks;
  };

  // Prepare data for timeline view (X-axis = time, Y-axis = level)
  const prepareTimelineData = () => {
    const data: any[] = [];

    subjectProgress.levelHistory.forEach((lp) => {
      const levelIndex = levels.indexOf(lp.level);

      // ONLY add start point (no end point)
      // This creates a smooth diagonal line instead of step-ladder
      data.push({
        date: lp.startDate.getTime(),
        dateLabel: lp.startDate.toLocaleDateString(),
        level: lp.level,
        levelIndex: levelIndex,
        type: lp.isComplete ? "completed" : "current",
        monthsToComplete: lp.customMonthsToComplete,
      });
    });

    // Add final point for the last level's completion
    // This ensures the graph extends to the projected end
    const lastLevel = subjectProgress.levelHistory[subjectProgress.levelHistory.length - 1];
    if (lastLevel) {
      const endDate = lastLevel.endDate || lastLevel.estimatedCompletion;
      const levelIndex = levels.indexOf(lastLevel.level);
      
      data.push({
        date: endDate.getTime(),
        dateLabel: endDate.toLocaleDateString(),
        level: lastLevel.level,
        levelIndex: levelIndex,
        type: lastLevel.isComplete ? "completed" : "projected",
        monthsToComplete: lastLevel.customMonthsToComplete,
      });
    }

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

  // Calculate X-axis domain and ticks for timeline
  let xAxisTicks: number[] = [];
  if (showTimeline && timelineData.length > 0) {
    const minDate = Math.min(...timelineData.map(d => d.date));
    const maxDate = Math.max(...timelineData.map(d => d.date));
    xAxisTicks = getXAxisTicks(minDate, maxDate);
  }

  // Calculate months since program start
  const getMonthsSinceProgramStart = (timestamp: number): number => {
    const msPerMonth = 30.44 * 24 * 60 * 60 * 1000;
    const monthsDiff = (timestamp - programStartDate.getTime()) / msPerMonth;
    return Math.round(monthsDiff * 10) / 10; // Round to 1 decimal
  };

  // Custom tooltip for timeline view
  const TimelineTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    const isGradeLevel = data.type === "grade-level";
    
    return (
      <div className="bg-white p-3 border-2 border-gray-400 rounded shadow-lg">
        <p className={`text-xs font-semibold mb-1 ${isGradeLevel ? 'text-orange-600' : 'text-blue-600'}`}>
          {isGradeLevel ? 'Expected (Grade Level)' : 'Student Progress'}
        </p>
        <p className="font-bold text-lg">{data.level}</p>
        {isGradeLevel && data.gradePosition && (
          <p className="text-sm text-orange-600 mt-1">{data.gradePosition}</p>
        )}
        <p className="text-sm mt-1">{data.dateLabel}</p>
        {!isGradeLevel && data.type && (
          <p className="text-xs text-gray-600 capitalize mt-1">{data.type}</p>
        )}
        {!isGradeLevel && data.monthsToComplete && (
          <p className="text-xs text-blue-600 mt-1">Custom pace</p>
        )}
      </div>
    );
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
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={xAxisTicks}
              tickFormatter={(timestamp: any) => {
                if (showMonthsSinceProgramStart) {
                  return getMonthsSinceProgramStart(timestamp).toString();
                } else {
                  return new Date(timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }
              }}
              angle={-45}
              textAnchor="end"
              height={80}
              onClick={() => setShowMonthsSinceProgramStart(!showMonthsSinceProgramStart)}
              style={{ cursor: 'pointer' }}
              label={{
                value: showMonthsSinceProgramStart ? "Months Since Program Start" : "Date",
                position: "insideBottom",
                offset: -20,
              }}
            />
            <YAxis
              dataKey="levelIndex"
              type="number"
              domain={[0, levels.length - 1]}
              ticks={getYAxisTicks()}
              tickFormatter={(index: number) => levels[index] || ""}
              width={60}
              label={{
                value: "Level",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip 
              content={<TimelineTooltip />}
              cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
              allowEscapeViewBox={{ x: true, y: true }}
              offset={10}
            />
            <Legend 
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            
            {/* Orange grade level line - already calculated up to student's end date */}
            {gradeLevelPoints.length > 0 && (() => {
              // No filtering needed - points already stop at student's end date
              const gradeLineData = gradeLevelPoints.map(point => ({
                date: point.date.getTime(),
                levelIndex: point.isPartialLevel ? point.levelIndex : levels.indexOf(point.level),
                level: point.level,
                grade: point.grade,
                gradePosition: point.gradePosition,
                type: "grade-level", // Mark as grade level for tooltip
              }));
              
              // console.log("Grade line data (pre-calculated to student end):", gradeLineData);
              
              return (
                <Line
                  data={gradeLineData}
                  type="monotone"
                  dataKey="levelIndex"
                  stroke="#FF8C00"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: "#FF8C00", r: 4 }}
                  name="Expected (Grade Level)"
                  isAnimationActive={false}
                  activeDot={false}  // Disable active dot on hover for orange line
                  hide={false}  // Keep visible in legend
                />
              );
            })()}
            
            {/* Blue student progress line - RENDER LAST for hover priority */}
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
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#3b82f6" }}  // Bigger active dot
              name="Student Progress"
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
        
        {/* Instructions for toggling */}
        <div className="text-center mt-2 text-sm text-gray-500">
          Click on X-axis to toggle between dates and months since program start
        </div>
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