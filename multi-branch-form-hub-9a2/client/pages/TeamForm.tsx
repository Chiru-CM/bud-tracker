import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function TeamForm() {
  const { team, branch } = useParams<{ team: string; branch: string }>();

  const branchTitles: Record<string, string> = {
    branch1: "NPI",
    branch2: "CPE",
    branch3: "CSS",
  };
  const branchAccents: Record<string, string> = {
    branch1: "from-blue-500 to-cyan-500",
    branch2: "from-purple-500 to-pink-500",
    branch3: "from-emerald-500 to-teal-500",
  };
  const branchTitle = branch ? branchTitles[branch] ?? branch : "";
  const accentColor = branch ? branchAccents[branch] ?? "from-blue-500 to-cyan-500" : "from-blue-500 to-cyan-500";
  const teamName = team ? team.charAt(0).toUpperCase() + team.slice(1) : "";
  const teamIcons: { [key: string]: string } = {
    a: "🟦",
    b: "🟩",
    c: "🟥",
  };

  const [formData, setFormData] = useState({
    tcCount: "",
    startDate: "",
    endDate: "",
    manualTcCount: "",
    automationTcCount: "",
    adhocRequest: "",
    totalTc: "",
    durationDays: "",
    durationWeeks: "",
    manualHc: "",
    automationHc: "",
    manualHcCost: "",
    automationHcCost: "",
    leadCost: "",
    sqpmCost: "",
    pl50: "",
    perWqe: "",
    asqpm: "",
    labTechCost: "",
    projectManagerCost: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${branchTitle} - Team ${teamName} Budget Data:`, formData);
    alert(`Budget saved for ${teamName}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-white/50 dark:bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {branchTitle}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Team {teamName}
                </p>
              </div>
            </div>
            <Link
              to={`/${branch}`}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12">
          {/* Heading */}
          <div className="mb-10">
            <div className="text-6xl mb-4">{teamIcons[team || "a"]}</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Team {teamName} - Budget Allocation
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Fill in the budget details for Team {teamName}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Test Case Counts */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Test Case Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    TC Count
                  </label>
                  <input
                    type="number"
                    name="tcCount"
                    value={formData.tcCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Manual TC Count
                  </label>
                  <input
                    type="number"
                    name="manualTcCount"
                    value={formData.manualTcCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Automation TC Count
                  </label>
                  <input
                    type="number"
                    name="automationTcCount"
                    value={formData.automationTcCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Adhoc Request
                  </label>
                  <input
                    type="number"
                    name="adhocRequest"
                    value={formData.adhocRequest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Duration & HC */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Duration & Hours
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Total TC
                  </label>
                  <input
                    type="number"
                    name="totalTc"
                    value={formData.totalTc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Duration in Days
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Duration Weeks
                  </label>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={formData.durationWeeks}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Manual HC
                  </label>
                  <input
                    type="number"
                    name="manualHc"
                    value={formData.manualHc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Automation HC
                  </label>
                  <input
                    type="number"
                    name="automationHc"
                    value={formData.automationHc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Costs */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Cost Allocation
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Manual HC Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="manualHcCost"
                    value={formData.manualHcCost}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Automation HC Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="automationHcCost"
                    value={formData.automationHcCost}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Lead Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="leadCost"
                    value={formData.leadCost}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    SQPM Cost (Boise 70%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="sqpmCost"
                    value={formData.sqpmCost}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    PL-50%
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="pl50"
                    value={formData.pl50}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Per WQE - 40%
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="perWqe"
                    value={formData.perWqe}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    aSQPM - 80%
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="asqpm"
                    value={formData.asqpm}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Lab Technician & Manager - 40%
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="labTechCost"
                    value={formData.labTechCost}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Project Manager - 40%
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="projectManagerCost"
                    value={formData.projectManagerCost}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className={`flex-1 bg-gradient-to-r ${accentColor} text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg`}
              >
                Save Budget
              </button>
              <Link
                to={`/${branch}`}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
