import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Home } from "lucide-react";
import { branchConfigs, categoryCards, readStoredTeams, type BranchKey, type CategoryKey } from "@/lib/team-config";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedBranch, setExpandedBranch] = useState<BranchKey | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const location = useLocation();

  // Update CSS variable and main content margin
  useEffect(() => {
    const mainContent = document.querySelector(".sidebar-content") as HTMLElement;
    if (mainContent) {
      mainContent.style.marginLeft = isOpen ? "256px" : "80px";
    }
  }, [isOpen]);

  // Parse current location
  useEffect(() => {
    const pathSegments = location.pathname.slice(1).split("/");
    if (pathSegments[0] === "branch1" || pathSegments[0] === "branch2" || pathSegments[0] === "branch3") {
      setExpandedBranch(pathSegments[0] as BranchKey);
      if (pathSegments[1]) {
        setExpandedCategory(pathSegments[1]);
      }
    }
  }, [location.pathname]);

  const branches = [
    { key: "branch1" as BranchKey, title: "NPI" },
    { key: "branch2" as BranchKey, title: "CPE" },
    { key: "branch3" as BranchKey, title: "CSS" },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-white transition-all duration-300 z-40 border-r border-slate-200 dark:border-slate-800 overflow-y-auto ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          {isOpen && <h2 className="text-sm font-bold tracking-wider text-slate-900 dark:text-white">NAVIGATION</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-900 dark:text-white"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Dashboard</span>}
          </Link>

          {/* Branches */}
          {branches.map((branch) => {
            const branchConfig = branchConfigs[branch.key];
            const isExpanded = expandedBranch === branch.key;
            const branchPath = `/${branch.key}`;
            const branchActive = isActive(branchPath);

            return (
              <div key={branch.key}>
                <button
                  onClick={() => {
                    setExpandedBranch(isExpanded ? null : branch.key);
                    setExpandedCategory(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    branchActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{branchConfig.icon}</span>
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{branch.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>

                {/* Categories */}
                {isOpen && isExpanded && (
                  <div className="ml-2 mt-2 space-y-1 border-l border-slate-300 dark:border-slate-700 pl-2">
                    {Object.entries(categoryCards).map(([categoryKey, categoryConfig]) => {
                      const categoryActive = isActive(`/${branch.key}/${categoryKey}`);
                      const teams = readStoredTeams(branch.key, categoryKey as CategoryKey);
                      const isExpanded = expandedCategory === categoryKey;

                      return (
                        <div key={categoryKey}>
                          <button
                            onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                              categoryActive
                                ? "bg-blue-500/50 text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="flex-shrink-0">{categoryConfig.icon}</span>
                            <span className="flex-1 text-left">{categoryConfig.label}</span>
                            {teams.length > 0 && (
                              <ChevronDown
                                className={`w-3 h-3 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            )}
                          </button>

                          {/* Teams */}
                          {isExpanded && teams.length > 0 && (
                            <div className="ml-2 mt-1 space-y-1 border-l border-slate-300 dark:border-slate-700 pl-2">
                              {teams.map((team) => {
                                const teamPath = `/${branch.key}/${categoryKey}/team-${team.slug}`;
                                const teamActive = isActive(teamPath);

                                return (
                                  <Link
                                    key={team.id}
                                    to={teamPath}
                                    className={`block px-4 py-2 rounded-lg text-xs transition-colors ${
                                      teamActive
                                        ? "bg-blue-500/50 text-white"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                                    }`}
                                  >
                                    {team.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
