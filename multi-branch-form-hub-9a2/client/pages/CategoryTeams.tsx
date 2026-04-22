import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Users, Edit2, Trash2, Check, X } from "lucide-react";
import {
  branchConfigs,
  categoryCards,
  createTeamCard,
  persistTeams,
  readStoredTeams,
  type BranchKey,
  type CategoryKey,
  type TeamCard,
} from "@/lib/team-config";
import { UserProfile } from "@/components/UserProfile";

export default function CategoryTeams() {
  const { branch, category } = useParams<{
    branch: BranchKey;
    category: CategoryKey;
  }>();

  const isValidBranch = !!branch && branch in branchConfigs;
  const isValidCategory = !!category && category in categoryCards;
  const branchKey = isValidBranch ? (branch as BranchKey) : "branch1";
  const categoryKey = isValidCategory ? (category as CategoryKey) : "ink";
  const branchConfig = branchConfigs[branchKey];
  const categoryConfig = categoryCards[categoryKey];

  const [teams, setTeams] = useState<TeamCard[]>(() =>
    readStoredTeams(branchKey, categoryKey),
  );
  const [teamName, setTeamName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");

  useEffect(() => {
    if (!isValidBranch || !isValidCategory) {
      return;
    }

    setTeams(readStoredTeams(branchKey, categoryKey));
  }, [branchKey, categoryKey, isValidBranch, isValidCategory]);

  useEffect(() => {
    if (!isValidBranch || !isValidCategory) {
      return;
    }

    persistTeams(branchKey, categoryKey, teams);
  }, [branchKey, categoryKey, isValidBranch, isValidCategory, teams]);

  const handleAddTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!teamName.trim()) {
      return;
    }

    setTeams((previousTeams) => [
      ...previousTeams,
      createTeamCard(teamName, previousTeams),
    ]);
    setTeamName("");
  };

  const handleEditTeam = (team: TeamCard) => {
    setEditingTeamId(team.id);
    setEditingTeamName(team.name);
  };

  const handleSaveEdit = (teamId: string) => {
    if (!editingTeamName.trim()) {
      setEditingTeamId(null);
      return;
    }

    setTeams((previousTeams) =>
      previousTeams.map((team) =>
        team.id === teamId
          ? { ...team, name: editingTeamName.trim() }
          : team
      )
    );
    setEditingTeamId(null);
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setEditingTeamName("");
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams((previousTeams) =>
      previousTeams.filter((team) => team.id !== teamId)
    );
  };

  if (!isValidBranch || !isValidCategory) {
    return <Navigate to="/" replace />;
  }

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
                  {categoryConfig.label} teams
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={`/${branchKey}`}
                className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <UserProfile />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${categoryConfig.bgColor}`}>
              {categoryConfig.icon}
            </div>
            <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
              {branchConfig.title} {categoryConfig.label} Teams
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Select a team or add a new team under {categoryConfig.label.toLowerCase()}.
            </p>
          </div>

          <form
            onSubmit={handleAddTeam}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Add a team
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="Enter team name"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${branchConfig.accentColor} px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <Plus className="h-4 w-4" />
                Add team
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${team.color} opacity-0 transition-opacity duration-300 hover:opacity-5`}
              />

              <div className="relative flex h-full flex-col p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${team.bgColor} flex h-20 w-20 items-center justify-center rounded-2xl text-5xl`}>
                    {team.icon}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="rounded-lg p-2 text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      title="Edit team name"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="rounded-lg p-2 text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                      title="Delete team"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-grow">
                  {editingTeamId === team.id ? (
                    <div className="mb-4 flex gap-2">
                      <input
                        type="text"
                        value={editingTeamName}
                        onChange={(e) => setEditingTeamName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(team.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleSaveEdit(team.id)}
                        className="rounded-lg bg-green-500 p-2 text-white transition-all hover:bg-green-600"
                        title="Save"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-lg bg-slate-300 p-2 text-slate-700 transition-all hover:bg-slate-400 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        title="Cancel"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                      {team.name}
                    </h3>
                  )}
                </div>

                <Link
                  to={`/${branchKey}/${categoryKey}/team-${team.slug}`}
                  className="flex items-center gap-2 font-semibold text-slate-600 transition-all hover:gap-3 dark:text-slate-400"
                >
                  <Users className="h-5 w-5" />
                  <span>Add Budget</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
