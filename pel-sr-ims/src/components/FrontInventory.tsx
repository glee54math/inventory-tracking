import React from "react";
// import data from "../assets/data.json"; // This was imported just for testing purposes.

interface FrontInventoryProps {
  data: object;
}
interface Subsection {
  range: string;
  count: number;
}

function FrontInventory({ data }: FrontInventoryProps) {
  // values, entries, keys
  console.log(data);
  const levels = Object.keys(data);
  const subsections: Subsection = Object.values(data)[0];
  //   console.log(data[levels[1]]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="border border-gray-400 px-2 py-1 text-left">
              Level
            </th>
            {subsections.map((section: Subsection) => (
              <th
                key={section.range}
                className="border border-gray-400 px-2 py-1 text-left"
              >
                {section.range}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.map((level: string) => (
            <tr
              key={level}
              className="border border-gray-400 px-2 py-1 text-center"
            >
              <td>{level}</td>
              {data[level].map(({ range, count }: Subsection) => (
                <td
                  key={range}
                  className="border border-gray-400 px-2 py-1 text-center"
                >
                  {count}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FrontInventory;

// type InventoryData = {
//   [level: string]: {
//     [range: string]: number;
//   };
// };

// const InventoryTable: React.FC = () => {
//   const inventory: InventoryData = data;

//   // Get all unique headers across all levels
//   const allHeaders = Array.from(
//     new Set(Object.values(inventory).flatMap((ranges) => Object.keys(ranges)))
//   ).sort((a, b) => {
//     const getStart = (s: string) => parseInt(s.split("-")[0]);
//     return getStart(a) - getStart(b);
//   });

//   const levels = Object.keys(inventory);

//   return (
//     <div className="overflow-x-auto p-4">
//       <table className="table-auto border-separate border border-gray-400">
//         <thead>
//           <tr>
//             <th className="border border-gray-400 px-2 py-1 text-left">
//               Level
//             </th>
//             {allHeaders.map((header) => (
//               <th key={header} className="border border-gray-400 px-2 py-1">
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {levels.map((level) => (
//             <tr key={level}>
//               <td className="border border-gray-400 px-2 py-1 font-medium">
//                 {level}
//               </td>
//               {allHeaders.map((range) => (
//                 <td
//                   key={range}
//                   className="border border-gray-400 px-2 py-1 text-center"
//                 >
//                   {inventory[level][range] ?? ""}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InventoryTable;
