import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

export default function Branch2() {
  const teams = [
    {
      id: 1,
      name: "Team A",
      slug: "a",
      icon: "🟦",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      id: 2,
      name: "Team B",
      slug: "b",
      icon: "🟩",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      id: 3,
      name: "Team C",
      slug: "c",
      icon: "🟥",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
  ];

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
                  CPE
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a Team
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950 rounded-2xl flex items-center justify-center text-3xl mb-4">
            ❄️
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            CPE Teams
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select a team to allocate budgets
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/branch2/team-${team.slug}`}
              className="group"
            >
              <div className="h-full relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-8">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${team.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className={`${team.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-6 transition-all duration-300 group-hover:scale-110`}>
                    {team.icon}
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {team.name}
                  </h3>

                  {/* Action */}
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold group-hover:gap-3 transition-all">
                    <Users className="w-5 h-5" />
                    <span>Add Budget</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
