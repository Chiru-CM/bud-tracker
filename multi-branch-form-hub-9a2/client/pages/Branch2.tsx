import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { branchConfigs, getCategoryCards } from "@/lib/team-config";

export default function Branch2() {
  const branchConfig = branchConfigs.branch2;
  const categories = getCategoryCards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-lg font-bold text-white">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {branchConfig.title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a Category
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${branchConfig.iconBg}`}>
            {branchConfig.icon}
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            {branchConfig.pageTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {branchConfig.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.key}
              to={`/branch2/${category.key}`}
              className="group"
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                <div className="relative">
                  <div className={`${category.bgColor} mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-5xl transition-all duration-300 group-hover:scale-110`}>
                    {category.icon}
                  </div>

                  <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                    {category.label}
                  </h3>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-2 font-semibold text-slate-600 transition-all group-hover:gap-3 dark:text-slate-400">
                    <Users className="h-5 w-5" />
                    <span>View Teams</span>
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
