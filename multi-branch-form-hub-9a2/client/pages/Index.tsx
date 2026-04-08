import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Index() {
  const branches = [
    {
      id: 1,
      title: "NPI",
      description: "",
      icon: "🔥",
      path: "/branch1",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      id: 2,
      title: "CPE",
      description: "",
      icon: "❄️",
      path: "/branch2",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      id: 3,
      title: "CSS",
      description: "",
      icon: "⚙️",
      path: "/branch3",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-white/50 dark:bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Fusion
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Multi-Step Form
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Budget Allocation Tracker
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {branches.map((branch) => (
            <Link
              key={branch.id}
              to={branch.path}
              className="group h-full"
            >
              <div className="h-full relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${branch.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`${branch.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 transition-all duration-300 group-hover:scale-110`}>
                    {branch.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {branch.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {branch.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mt-6 group-hover:gap-3 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer hint */}
        <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>Click on any card to start allocating the budgets</p>
        </div>
      </div>
    </div>
  );
}
