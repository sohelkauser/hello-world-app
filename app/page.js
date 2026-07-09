"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const OWNERS = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Edward",
];

const QUARTERS = ["All", "Q1", "Q2", "Q3", "Q4"];
const YEARS = ["All", "2024", "2025", "2026", "2027"];

export default function Home() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filterQuarter, setFilterQuarter] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadObjectives();
  }, []);

  const loadObjectives = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("objectives")
      .select(`*, key_results (*)`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading:", error);
      setError("Failed to load data");
    } else {
      setObjectives(data || []);
    }
    setLoading(false);
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addObjective = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("objectives")
      .insert({
        objective: "",
        owner: OWNERS[0],
        quarter: "Q1",
        year: "2026",
      })
      .select(`*, key_results (*)`)
      .single();

    if (error) {
      console.error("Error adding:", error);
    } else {
      setObjectives((prev) => [...prev, data]);
      showSaved();
    }
    setSaving(false);
  };

  const updateObjective = async (objId, field, value) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objId ? { ...obj, [field]: value } : obj
      )
    );
    const { error } = await supabase
      .from("objectives")
      .update({ [field]: value })
      .eq("id", objId);

    if (error) {
      console.error("Error updating:", error);
    } else {
      showSaved();
    }
  };

  const deleteObjective = async (objId) => {
    const { error } = await supabase
      .from("objectives")
      .delete()
      .eq("id", objId);

    if (error) {
      console.error("Error deleting:", error);
    } else {
      setObjectives((prev) =>
        prev.filter((obj) => obj.id !== objId)
      );
      showSaved();
    }
  };

  const addKeyResult = async (objId) => {
    setSaving(true);
    const { data, error } = await supabase
      .from("key_results")
      .insert({
        objective_id: objId,
        key_result: "",
        owner: OWNERS[0],
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding key result:", error);
    } else {
      setObjectives((prev) =>
        prev.map((obj) =>
          obj.id === objId
            ? {
                ...obj,
                key_results: [...(obj.key_results || []), data],
              }
            : obj
        )
      );
      showSaved();
    }
    setSaving(false);
  };

  const updateKeyResult = async (objId, krId, field, value) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objId
          ? {
              ...obj,
              key_results: obj.key_results.map((kr) =>
                kr.id === krId ? { ...kr, [field]: value } : kr
              ),
            }
          : obj
      )
    );
    const { error } = await supabase
      .from("key_results")
      .update({ [field]: value })
      .eq("id", krId);

    if (error) {
      console.error("Error updating key result:", error);
    } else {
      showSaved();
    }
  };

  const deleteKeyResult = async (objId, krId) => {
    const { error } = await supabase
      .from("key_results")
      .delete()
      .eq("id", krId);

    if (error) {
      console.error("Error deleting key result:", error);
    } else {
      setObjectives((prev) =>
        prev.map((obj) =>
          obj.id === objId
            ? {
                ...obj,
                key_results: obj.key_results.filter(
                  (kr) => kr.id !== krId
                ),
              }
            : obj
        )
      );
      showSaved();
    }
  };

  const filteredObjectives = objectives.filter((obj) => {
    const matchQuarter =
      filterQuarter === "All" || obj.quarter === filterQuarter;
    const matchYear =
      filterYear === "All" || obj.year === filterYear;
    return matchQuarter && matchYear;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-700 text-2xl font-bold mb-2">
            Loading OKRs...
          </div>
          <div className="text-gray-400 text-sm">
            Connecting to database
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow">
          <div className="text-red-500 text-2xl font-bold mb-2">
            Connection Error
          </div>
          <div className="text-gray-500 mb-4">{error}</div>
          <button
            onClick={loadObjectives}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          OKR Tracker
        </h1>
        <p className="text-gray-500 mt-2">
          Track your Objectives and Key Results
        </p>
        <div className="mt-2 h-6">
          {saving && (
            <span className="text-yellow-500 text-sm">
              ⏳ Saving...
            </span>
          )}
          {saved && !saving && (
            <span className="text-green-500 text-sm">
              ✅ Saved!
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6
                      flex gap-4 items-center flex-wrap">
        <span className="font-semibold text-gray-600">
          Filter by:
        </span>
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium">
            Quarter:
          </label>
          <select
            value={filterQuarter}
            onChange={(e) => setFilterQuarter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2
                       focus:outline-none focus:border-blue-500"
          >
            {QUARTERS.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium">
            Year:
          </label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-gray-300 rounded-lg p-2
                       focus:outline-none focus:border-blue-500"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setFilterQuarter("All");
            setFilterYear("All");
          }}
          className="text-blue-600 hover:text-blue-800
                     text-sm font-semibold"
        >
          Clear Filters
        </button>
        <span className="text-gray-400 text-sm ml-auto">
          Showing {filteredObjectives.length} of{" "}
          {objectives.length} objectives
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full bg-white text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Objective</th>
              <th className="p-4 text-left">Key Result</th>
              <th className="p-4 text-left">Quarter</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredObjectives.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-400"
                >
                  No objectives found.
                  Click Add Objective below!
                </td>
              </tr>
            ) : (
              filteredObjectives.map((obj, objIndex) => (
                <>
                  <tr
                    key={obj.id}
                    className="border-b-2 border-blue-100 bg-blue-50"
                  >
                    <td className="p-4 font-bold text-blue-700">
                      {objIndex + 1}
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={obj.objective}
                        onChange={(e) =>
                          updateObjective(
                            obj.id,
                            "objective",
                            e.target.value
                          )
                        }
                        placeholder="Enter objective..."
                        className="w-full border border-gray-300
                                   rounded-lg p-2 focus:outline-none
                                   focus:border-blue-500"
                      />
                    </td>
                    <td className="p-4 text-gray-400 italic">
                      Objective Row
                    </td>
                    <td className="p-4">
                      <select
                        value={obj.quarter}
                        onChange={(e) =>
                          updateObjective(
                            obj.id,
                            "quarter",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-lg
                                   p-2 focus:outline-none
                                   focus:border-blue-500"
                      >
                        {QUARTERS.filter((q) => q !== "All").map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={obj.owner}
                        onChange={(e) =>
                          updateObjective(
                            obj.id,
                            "owner",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-lg
                                   p-2 focus:outline-none
                                   focus:border-blue-500"
                      >
                        {OWNERS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </td>
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

                  {obj.key_results &&
                    obj.key_results.map((kr, krIndex) => (
                      <tr
                        key={kr.id}
                        className="border-b border-gray-100 bg-white
                                   hover:bg-gray-50"
                      >
                        <td className="p-4 text-gray-400 text-xs pl-8">
                          {objIndex + 1}.{krIndex + 1}
                        </td>
                        <td className="p-4 text-gray-400 italic text-xs">
                          Key Result
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={kr.key_result}
                            onChange={(e) =>
                              updateKeyResult(
                                obj.id,
                                kr.id,
                                "key_result",
                                e.target.value
                              )
                            }
                            placeholder="Enter key result..."
                            className="w-full border border-gray-300
                                       rounded-lg p-2 focus:outline-none
                                       focus:border-blue-500"
                          />
                        </td>
                        <td className="p-4 text-gray-500 text-xs">
                          {obj.quarter}
                        </td>
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
                            className="border border-gray-300 rounded-lg
                                       p-2 focus:outline-none
                                       focus:border-blue-500"
                          >
                            {OWNERS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              deleteKeyResult(obj.id, kr.id)
                            }
                            className="bg-red-400 text-white px-3 py-1
                                       rounded-lg hover:bg-red-500 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                  <tr className="bg-white border-b-2 border-blue-200">
                    <td colSpan={6} className="p-2 pl-8">
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
              ))
            )}
          </tbody>
        </table>
      </div>

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