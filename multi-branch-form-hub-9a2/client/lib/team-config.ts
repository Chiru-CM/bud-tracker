export type BranchKey = "branch1" | "branch2" | "branch3";
export type CategoryKey = "ink" | "laser";

export type BranchConfig = {
  title: string;
  pageTitle: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  accentColor: string;
};

export type CategoryCard = {
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
};

export type TeamCard = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bgColor: string;
};

const teamCardStyles = [
  {
    icon: "🟦",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  {
    icon: "🟩",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  {
    icon: "🟥",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
  {
    icon: "🟨",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
];

const defaultTeamNames = ["Team A", "Team B", "Team C"];

export const branchConfigs: Record<BranchKey, BranchConfig> = {
  branch1: {
    title: "NPI",
    pageTitle: "NPI Teams",
    subtitle: "Select a category to manage budgets",
    icon: "🔥",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    accentColor: "from-blue-500 to-cyan-500",
  },
  branch2: {
    title: "CPE",
    pageTitle: "CPE Teams",
    subtitle: "Select a category to manage budgets",
    icon: "❄️",
    iconBg: "bg-purple-100 dark:bg-purple-950",
    accentColor: "from-purple-500 to-pink-500",
  },
  branch3: {
    title: "CSS",
    pageTitle: "CSS Teams",
    subtitle: "Select a category to manage budgets",
    icon: "⚙️",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    accentColor: "from-emerald-500 to-teal-500",
  },
};

export const categoryCards: Record<CategoryKey, CategoryCard> = {
  ink: {
    label: "Ink",
    description: "Open the ink teams list and add new teams",
    icon: "🖋️",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  laser: {
    label: "Laser",
    description: "Open the laser teams list and add new teams",
    icon: "⚡",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
};

export const getCategoryCards = () =>
  (Object.entries(categoryCards) as Array<[CategoryKey, CategoryCard]>).map(
    ([key, value]) => ({
      key,
      ...value,
    }),
  );

export const slugifyTeamName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatTeamNameFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildTeamCard = (name: string, index: number, slug?: string): TeamCard => {
  const teamCardStyle = teamCardStyles[index % teamCardStyles.length];

  return {
    id: `${slug ?? slugifyTeamName(name)}-${index}`,
    name,
    slug: slug ?? slugifyTeamName(name),
    ...teamCardStyle,
  };
};

const getDefaultTeams = () =>
  defaultTeamNames.map((teamName, index) => buildTeamCard(teamName, index));

const getTeamsStorageKey = (branch: BranchKey, category: CategoryKey) =>
  `budget-teams:${branch}:${category}`;

export const readStoredTeams = (
  branch: BranchKey,
  category: CategoryKey,
): TeamCard[] => {
  const defaultTeams = getDefaultTeams();

  if (typeof window === "undefined") {
    return defaultTeams;
  }

  const storedTeams = window.localStorage.getItem(
    getTeamsStorageKey(branch, category),
  );

  if (!storedTeams) {
    return defaultTeams;
  }

  try {
    const parsedTeams = JSON.parse(storedTeams);

    if (!Array.isArray(parsedTeams)) {
      return defaultTeams;
    }

    return parsedTeams.map((team, index) =>
      buildTeamCard(
        typeof team?.name === "string" && team.name.trim()
          ? team.name.trim()
          : `Team ${index + 1}`,
        index,
        typeof team?.slug === "string" && team.slug.trim()
          ? team.slug.trim()
          : undefined,
      ),
    );
  } catch {
    return defaultTeams;
  }
};

export const persistTeams = (
  branch: BranchKey,
  category: CategoryKey,
  teams: TeamCard[],
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getTeamsStorageKey(branch, category),
    JSON.stringify(teams.map(({ name, slug }) => ({ name, slug }))),
  );
};

export const createTeamCard = (name: string, existingTeams: TeamCard[]) => {
  const trimmedName = name.trim();
  const baseSlug = slugifyTeamName(trimmedName) || `team-${existingTeams.length + 1}`;
  let nextSlug = baseSlug;
  let duplicateCount = 2;

  while (existingTeams.some((team) => team.slug === nextSlug)) {
    nextSlug = `${baseSlug}-${duplicateCount}`;
    duplicateCount += 1;
  }

  return buildTeamCard(trimmedName, existingTeams.length, nextSlug);
};
