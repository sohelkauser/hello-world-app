"use client";
import { useState } from "react";

const OWNERS = [
  "Sohel",
  "Test1",
  "Test2",
  "Test3",
  "Test4",
];

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

const YEARS = ["2024", "2025", "2026", "2027"];

const emptyObjective = {
  id: Date.now(),
  objective: "",
  owner: OWNERS[0],
  quarter: QUARTERS[0],
  year: YEARS[0],
  keyResults: [
    {
      id: Date.now() + 1,
      keyResult: "",
      owner: OWNERS[0],
    },
  ],
};

export default function Home() {
  const [objectives, setObjectives] = useState([emptyObjective]);

  // Update objective field
  const updateObjective = (objId, field, value) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objId ? { ...obj, [field]: value } : obj
      )
    );
  };

  // Update key result field
  const updateKeyResult = (objId, krId, field, value) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objId
          ? {
              ...obj,
              keyResults: obj.keyResults.map((kr) =>
                kr.id === krId ? { ...kr, [field]: value } : kr
              ),
            }
          : obj
      )
    );
  };

  // Add new objective row
  const addObjective = () => {
    setObjectives((prev) => [
      ...prev,
      {
        id: Date.now(),
        objective: "",
        owner: OWNERS[0],
        quarter: QUARTERS[0],
        year: YEARS[0],
        keyResults: [
          {
            id: Date.now() + 1,
            keyResult: "",
            owner: OWNERS[0],
          },
        ],
      },
    ]);
  };

  // Add key result to objective
  const addKeyResult = (objId) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objId
          ? {
              ...obj,
              keyResults: [
                ...obj.keyResults,
                {
                  id: Date.now(),
                  keyResult: "",
                  owner: OWNERS[0],
                },
              ],
            }
          : obj
      )
    );
  };

  // Delete objective
  const deleteObjective = (objId) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== objId));
  };

  // Delete key result
  const deleteKeyResult = (objId, krId) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objId
          ? {
              ...obj,
              keyResults: obj.keyResults.filter((kr) => kr.id !== krId),
            }
          : obj
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          OKR Tracker
        </h1>
        <p className="text-gray-500 mt-2">
          Track your Objectives and Key Results
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full bg-white text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-4 text-left w-8">#</th>
              <th className="p-4 text-left">Objective</th>
              <th className="p-4 text-left">Key Result</th>
              <th className="p-4 text-left">Quarter</th>
              <th className="p-4 text-left">Year</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {objectives.map((obj, objIndex) => (
              <>
                {/* Objective Row */}
                <tr
                  key={obj.id}
                  className="border-b-2 border-blue-100 bg-blue-50"
                >
                  <td className="p-4 font-bold text-blue-700">
                    {objIndex + 1}
                  </td>

                  {/* Objective Input */}
                  <td className="p-4">
                    <input
                      type="text"
                      value={obj.objective}
                      onChange={(e) =>
                        updateObjective(obj.id, "objective", e.target.value)
                      }
                      placeholder="Enter objective..."
                      className="w-full border border-gray-300 rounded-lg 
                                 p-2 focus:outline-none focus:border-blue-500"
                    />
                  </td>

                  {/* Empty Key Result cell for objective row */}
                  <td className="p-4 text-gray-400 italic">
                    — Objective Row —
                  </td>

                  {/* Quarter Dropdown */}
                  <td className="p-4">
                    <select
                      value={obj.quarter}
                      onChange={(e) =>
                        updateObjective(obj.id, "quarter", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg p-2
                                 focus:outline-none focus:border-blue-500"
                    >
                      {QUARTERS.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Year Dropdown */}
                  <td className="p-4">
                    <select
                      value={obj.year}
                      onChange={(e) =>
                        updateObjective(obj.id, "year", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg p-2
                                 focus:outline-none focus:border-blue-500"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Owner Dropdown */}
                  <td className="p-4">
                    <select
                      value={obj.owner}
                      onChange={(e) =>
                        updateObjective(obj.id, "owner", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg p-2
                                 focus:outline-none focus:border-blue-500"
                    >
                      {OWNERS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <button
                      onClick={() => deleteObjective(obj.id)}
                      className="bg-red-500 text-white px-3 py-1 
                                 rounded-lg hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Key Result Rows */}
                {obj.keyResults.map((kr, krIndex) => (
                  <tr
                    key={kr.id}
                    className="border-b border-gray-100 bg-white 
                               hover:bg-gray-50"
                  >
                    {/* Number */}
                    <td className="p-4 text-gray-400 text-xs pl-8">
                      {objIndex + 1}.{krIndex + 1}
                    </td>

                    {/* Empty Objective cell */}
                    <td className="p-4 text-gray-400 italic text-xs">
                      — Key Result —
                    </td>

                    {/* Key Result Input */}
                    <td className="p-4">
                      <input
                        type="text"
                        value={kr.keyResult}
                        onChange={(e) =>
                          updateKeyResult(
                            obj.id,
                            kr.id,
                            "keyResult",
                            e.target.value
                          )
                        }
                        placeholder="Enter key result..."
                        className="w-full border border-gray-300 rounded-lg 
                                   p-2 focus:outline-none focus:border-blue-500"
                      />
                    </td>

                    {/* Quarter - inherited from objective */}
                    <td className="p-4 text-gray-500 text-xs">
                      {obj.quarter}
                    </td>

                    {/* Year - inherited from objective */}
                    <td className="p-4 text-gray-500 text-xs">
                      {obj.year}
                    </td>

                    {/* KR Owner Dropdown */}
                    <td className="p-4">
                      <select
                        value={kr.owner}
                        onChange={(e) =>
                          updateKeyResult(
                            obj.id,
                            kr.id,
                            "owner",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-lg p-2
                                   focus:outline-none focus:border-blue-500"
                      >
                        {OWNERS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <button
                        onClick={() => deleteKeyResult(obj.id, kr.id)}
                        className="bg-red-400 text-white px-3 py-1 
                                   rounded-lg hover:bg-red-500 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Add Key Result Button Row */}
                <tr className="bg-white border-b-2 border-blue-200">
                  <td colSpan={7} className="p-2 pl-8">
                    <button
                      onClick={() => addKeyResult(obj.id)}
                      className="text-blue-600 hover:text-blue-800 
                                 text-xs font-semibold"
                    >
                      + Add Key Result
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Objective Button */}
      <div className="mt-6 text-center">
        <button
          onClick={addObjective}
          className="bg-blue-700 text-white px-8 py-3 rounded-xl 
                     hover:bg-blue-800 font-semibold shadow-lg"
        >
          + Add Objective
        </button>
      </div>
    </main>
  );
}
