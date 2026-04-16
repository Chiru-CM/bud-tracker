import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit3, Trash2, Save, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  branchConfigs,
  categoryCards,
  formatTeamNameFromSlug,
  type BranchKey,
  type CategoryKey,
} from "@/lib/team-config";

type BudgetTemplate = {
  validationRunName: string;
  tcCount: string;
  startDate: string;
  endDate: string;
  durationDays: string;
  progress: string;
  manualTcFactor: string;
  automationTcFactor: string;
  adhocRequestFactor: string;
  durationWeekFactor: string;
  manualHcDivisor: string;
  automationHcDivisor: string;
  sqpmFactor: string;
  plFactor: string;
  perWqeFactor: string;
  asqpmFactor: string;
  labTechFactor: string;
  projectManagerFactor: string;
  manualHcRate: string;
  automationHcRate: string;
  leadRate: string;
  sqpmRate: string;
  plRate: string;
  perWqeRate: string;
  asqpmRate: string;
  labTechRate: string;
  projectManagerRate: string;
};

type ComputedTemplateValues = {
  manualTcCount: number;
  automationTcCount: number;
  adhocRequest: number;
  totalTc: number;
  durationDays: number;
  durationWeeks: number;
  manualHc: number;
  automationHc: number;
  manualHcCost: number;
  automationHcCost: number;
  leadCost: number;
  sqpmCost: number;
  plCost: number;
  perWqeCost: number;
  asqpmCost: number;
  labTechCost: number;
  projectManagerCost: number;
  totalBudget: number;
};

type HistoryEntry = {
  id: string;
  data: BudgetTemplate;
  savedAt: string;
  computed: ComputedTemplateValues;
  comments: string;
  action: "created" | "edited";
  budgetId: string;
};

const createBudgetTemplate = (): BudgetTemplate => ({
  validationRunName: "",
  tcCount: "",
  startDate: "",
  endDate: "",
  durationDays: "",
  progress: "yet-to-start",
  manualTcFactor: "0.8",
  automationTcFactor: "0.2",
  adhocRequestFactor: "0.2",
  durationWeekFactor: "8",
  manualHcDivisor: "4",
  automationHcDivisor: "6",
  sqpmFactor: "0.7",
  plFactor: "0.5",
  perWqeFactor: "0.4",
  asqpmFactor: "0.8",
  labTechFactor: "0.4",
  projectManagerFactor: "0.4",
  manualHcRate: "100",
  automationHcRate: "80",
  leadRate: "150",
  sqpmRate: "120",
  plRate: "110",
  perWqeRate: "90",
  asqpmRate: "130",
  labTechRate: "85",
  projectManagerRate: "140",
});

const progressOptions = [
  { value: "yet-to-start", label: "Yet to Start" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
];

const inputRows: Array<Array<{
  label: string;
  name: keyof BudgetTemplate;
  type: string;
  step?: string;
  placeholder?: string;
}>> = [
  [
    {
      label: "Validation run name",
      name: "validationRunName",
      type: "text",
      placeholder: "Enter validation run name",
    },
  ],
  [
    { label: "TC Count", name: "tcCount", type: "number", step: "0.01" },
  ],
  [
    { label: "Start Date", name: "startDate", type: "date" },
    { label: "End Date", name: "endDate", type: "date" },
    { label: "Duration in days", name: "durationDays", type: "number", step: "0.01" },
  ],
  [
    { label: "Manual TC factor", name: "manualTcFactor", type: "number", step: "0.01" },
    { label: "Automation TC factor", name: "automationTcFactor", type: "number", step: "0.01" },
    { label: "Adhoc request factor", name: "adhocRequestFactor", type: "number", step: "0.01" },
  ],
  [
    { label: "Duration weeks factor", name: "durationWeekFactor", type: "number", step: "0.01" },
    { label: "Manual HC divisor", name: "manualHcDivisor", type: "number", step: "0.01" },
    { label: "Automation HC divisor", name: "automationHcDivisor", type: "number", step: "0.01" },
  ],
  [
    { label: "SQPM factor of Boise", name: "sqpmFactor", type: "number", step: "0.01" },
    { label: "PL factor", name: "plFactor", type: "number", step: "0.01" },
    { label: "Per WQE factor", name: "perWqeFactor", type: "number", step: "0.01" },
  ],
  [
    { label: "aSQPM factor", name: "asqpmFactor", type: "number", step: "0.01" },
    { label: "Lab technician and manager factor", name: "labTechFactor", type: "number", step: "0.01" },
    { label: "Project manager factor", name: "projectManagerFactor", type: "number", step: "0.01" },
  ],
];

const computedRows: Array<{ label: string; name: keyof ComputedTemplateValues; kind: "count" | "currency" }> = [
  { label: "Manual TC count", name: "manualTcCount", kind: "count" },
  { label: "Automation TC count", name: "automationTcCount", kind: "count" },
  { label: "Adhoc request", name: "adhocRequest", kind: "count" },
  { label: "Total TC", name: "totalTc", kind: "count" },
  { label: "Duration in days", name: "durationDays", kind: "count" },
  { label: "Duration in weeks", name: "durationWeeks", kind: "count" },
  { label: "Manual HC", name: "manualHc", kind: "count" },
  { label: "Automation HC", name: "automationHc", kind: "count" },
  { label: "Manual HC cost", name: "manualHcCost", kind: "currency" },
  { label: "Automation HC cost", name: "automationHcCost", kind: "currency" },
  { label: "Lead cost", name: "leadCost", kind: "currency" },
  { label: "SQPM cost of Boise", name: "sqpmCost", kind: "currency" },
  { label: "PL", name: "plCost", kind: "currency" },
  { label: "Per WQE", name: "perWqeCost", kind: "currency" },
  { label: "aSQPM", name: "asqpmCost", kind: "currency" },
  { label: "Lab technician and manager", name: "labTechCost", kind: "currency" },
  { label: "Project manager", name: "projectManagerCost", kind: "currency" },
  { label: "Total budget", name: "totalBudget", kind: "currency" },
];

const parseNumber = (value: string) => Number(value || 0);

const formatNumber = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const getBusinessDaysInclusive = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  if (end < start) {
    return 0;
  }

  let businessDays = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays += 1;
    }
    current.setDate(current.getDate() + 1);
  }

  return businessDays;
};

const calculateTemplateValues = (template: BudgetTemplate): ComputedTemplateValues => {
  const tcCount = parseNumber(template.tcCount);
  const manualHcRate = parseNumber(template.manualHcRate);
  const automationHcRate = parseNumber(template.automationHcRate);
  const leadRate = parseNumber(template.leadRate);
  const sqpmRate = parseNumber(template.sqpmRate);
  const plRate = parseNumber(template.plRate);
  const perWqeRate = parseNumber(template.perWqeRate);
  const asqpmRate = parseNumber(template.asqpmRate);
  const labTechRate = parseNumber(template.labTechRate);
  const projectManagerRate = parseNumber(template.projectManagerRate);
  const manualTcFactor = parseNumber(template.manualTcFactor);
  const automationTcFactor = parseNumber(template.automationTcFactor);
  const adhocRequestFactor = parseNumber(template.adhocRequestFactor);
  const durationWeekFactor = parseNumber(template.durationWeekFactor);
  const manualHcDivisor = parseNumber(template.manualHcDivisor) || 1;
  const automationHcDivisor = parseNumber(template.automationHcDivisor) || 1;
  const sqpmFactor = parseNumber(template.sqpmFactor);
  const plFactor = parseNumber(template.plFactor);
  const perWqeFactor = parseNumber(template.perWqeFactor);
  const asqpmFactor = parseNumber(template.asqpmFactor);
  const labTechFactor = parseNumber(template.labTechFactor);
  const projectManagerFactor = parseNumber(template.projectManagerFactor);
  const manualDurationDays = parseNumber(template.durationDays);
  const durationDays = manualDurationDays > 0 ? manualDurationDays : getBusinessDaysInclusive(template.startDate, template.endDate);
  const manualTcCount = tcCount * manualTcFactor;
  const automationTcCount = tcCount * automationTcFactor;
  const adhocRequest = tcCount * adhocRequestFactor;
  const totalTc = manualTcCount + automationTcCount + adhocRequest;
  const durationWeeks = durationDays * durationWeekFactor;
  const manualHc = durationDays > 0 ? (manualTcCount + adhocRequest) / durationDays / manualHcDivisor : 0;
  const automationHc = durationDays > 0 ? automationTcCount / durationDays / automationHcDivisor : 0;
  const manualHcCost = manualHc * manualHcRate * durationWeeks;
  const automationHcCost = automationHc * automationHcRate * durationWeeks;
  const leadCost = durationWeeks * leadRate;
  const sqpmCost = durationWeeks * sqpmRate * sqpmFactor;
  const plCost = durationWeeks * plRate * plFactor;
  const perWqeCost = durationWeeks * perWqeRate * perWqeFactor * 6;
  const asqpmCost = durationWeeks * asqpmRate * asqpmFactor;
  const labTechCost = durationWeeks * labTechRate * labTechFactor * 2;
  const projectManagerCost = durationWeeks * projectManagerRate * projectManagerFactor;
  const totalBudget =
    manualHcCost +
    automationHcCost +
    leadCost +
    sqpmCost +
    plCost +
    perWqeCost +
    asqpmCost +
    labTechCost +
    projectManagerCost;

  return {
    manualTcCount,
    automationTcCount,
    adhocRequest,
    totalTc,
    durationDays,
    durationWeeks,
    manualHc,
    automationHc,
    manualHcCost,
    automationHcCost,
    leadCost,
    sqpmCost,
    plCost,
    perWqeCost,
    asqpmCost,
    labTechCost,
    projectManagerCost,
    totalBudget,
  };
};

export default function RunDetails() {
  const { teamPath, branch, category, runId } = useParams<{
    teamPath: string;
    branch: string;
    category: string;
    runId: string;
  }>();
  const navigate = useNavigate();

  const branchKey = branch && branch in branchConfigs ? (branch as BranchKey) : null;
  const categoryKey = category && category in categoryCards ? (category as CategoryKey) : null;
  const branchTitle = branchKey ? branchConfigs[branchKey].title : "";
  const accentColor = branchKey
    ? branchConfigs[branchKey].accentColor
    : "from-blue-500 to-cyan-500";
  const categoryLabel = categoryKey ? categoryCards[categoryKey].label : "";
  const team = teamPath?.replace(/^team-/, "") ?? "";
  const teamName = formatTeamNameFromSlug(team);
  const backPath =
    branch && category ? `/${branch}/${category}/${teamPath}` : `/`;

  const [budgets, setBudgets] = useState<BudgetTemplate[]>([]);
  const [budgetIds, setBudgetIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [budgetIndex, setBudgetIndex] = useState<number | null>(null);
  const [budgetFormData, setBudgetFormData] = useState<BudgetTemplate>(createBudgetTemplate());
  const [originalBudgetData, setOriginalBudgetData] = useState<BudgetTemplate | null>(null);
  const [runName, setRunName] = useState<string>(runId || "");
  const [comments, setComments] = useState<string>("");
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const handleBudgetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBudgetFormData((previous) => {
      const updated = { ...previous, [name]: value };
      if ((name === "startDate" || name === "endDate") && updated.startDate && updated.endDate) {
        const calculatedDays = getBusinessDaysInclusive(updated.startDate, updated.endDate);
        updated.durationDays = calculatedDays > 0 ? String(calculatedDays) : "";
      }
      return updated;
    });
  };

  const addBudget = () => {
    setBudgetFormData(createBudgetTemplate());
    setOriginalBudgetData(null);
    setBudgetIndex(null);
    setIsBudgetModalOpen(true);
  };

  const editBudget = (index: number) => {
    setBudgetFormData(budgets[index]);
    setOriginalBudgetData(budgets[index]);
    setBudgetIndex(index);
    setIsBudgetModalOpen(true);
  };

  const saveBudget = () => {
    setComments("");
    setIsCommentsModalOpen(true);
  };

  const saveWithComments = () => {
    if (comments.trim() === "") return;

    const newBudgets = [...budgets];
    const newBudgetIds = [...budgetIds];
    let currentBudgetId: string;

    if (budgetIndex !== null) {
      newBudgets[budgetIndex] = budgetFormData;
      currentBudgetId = newBudgetIds[budgetIndex];
    } else {
      newBudgets.push(budgetFormData);
      currentBudgetId = crypto.randomUUID();
      newBudgetIds.push(currentBudgetId);
    }

    setBudgets(newBudgets);
    setBudgetIds(newBudgetIds);

    const computed = calculateTemplateValues(budgetFormData);
    const newHistoryEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      data: budgetFormData,
      savedAt: new Date().toLocaleString(),
      computed,
      comments,
      action: budgetIndex !== null ? "edited" : "created",
      budgetId: currentBudgetId,
    };

    setHistory((prev) => [newHistoryEntry, ...prev]);
    setIsBudgetModalOpen(false);
    setIsCommentsModalOpen(false);
    setBudgetIndex(null);
    setBudgetFormData(createBudgetTemplate());
    setOriginalBudgetData(null);
    setComments("");
  };

  const removeBudget = (index: number) => {
    setBudgets((prev) => prev.filter((_, i) => i !== index));
    setBudgetIds((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleVersionExpand = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const getChangedFields = (currentIndex: number): Array<{ field: string; oldValue: string; newValue: string }> => {
    if (currentIndex === 0) {
      return [];
    }
    const current = history[currentIndex];
    const previous = history[currentIndex - 1];
    const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];

    const fieldLabels: Record<string, string> = {
      tcCount: "TC Count",
      startDate: "Start Date",
      endDate: "End Date",
      durationDays: "Duration (Days)",
      progress: "Progress",
      manualTcFactor: "Manual TC Factor",
      automationTcFactor: "Automation TC Factor",
      adhocRequestFactor: "Adhoc Request Factor",
      durationWeekFactor: "Duration Week Factor",
      manualHcDivisor: "Manual HC Divisor",
      automationHcDivisor: "Automation HC Divisor",
      sqpmFactor: "SQPM Factor",
      plFactor: "PL Factor",
      perWqeFactor: "Per WQE Factor",
      asqpmFactor: "aSQPM Factor",
      labTechFactor: "Lab Tech Factor",
      projectManagerFactor: "Project Manager Factor",
      manualHcRate: "Manual HC Rate",
      automationHcRate: "Automation HC Rate",
      leadRate: "Lead Rate",
      sqpmRate: "SQPM Rate",
      plRate: "PL Rate",
      perWqeRate: "Per WQE Rate",
      asqpmRate: "aSQPM Rate",
      labTechRate: "Lab Tech Rate",
      projectManagerRate: "Project Manager Rate",
    };

    Object.keys(fieldLabels).forEach((key) => {
      const typedKey = key as keyof BudgetTemplate;
      if (current.data[typedKey] !== previous.data[typedKey]) {
        changes.push({
          field: fieldLabels[key],
          oldValue: String(previous.data[typedKey]),
          newValue: String(current.data[typedKey]),
        });
      }
    });

    return changes;
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
                  {categoryLabel ? `${categoryLabel} • ${teamName}` : teamName}
                </p>
              </div>
            </div>
            <Link
              to={backPath}
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
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {runName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage budgets for this validation run
          </p>
        </div>

        <div className="mb-8">
          <button
            type="button"
            onClick={addBudget}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
          >
            <Plus className="h-4 w-4" />
            Add Budget
          </button>
        </div>

        {/* Budgets List */}
        {history.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Budgets
            </h3>
            <div className="space-y-4">
              {history.map((entry, index) => {
                const isExpanded = expandedVersions.has(entry.id);
                return (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                  >
                    {/* Collapsed Header */}
                    <div className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleVersionExpand(entry.id)}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex-shrink-0"
                          >
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                Budget Version {history.length - index}
                              </h4>
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                {entry.action}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Total: {formatCurrency(entry.computed.totalBudget)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {entry.savedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => editBudget(budgets.findIndex((b) => JSON.stringify(b) === JSON.stringify(entry.data)))}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <div className="p-4 space-y-4">
                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">TC Count</p>
                              <p className="font-medium text-slate-900 dark:text-white">{entry.data.tcCount}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Date Range</p>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {entry.data.startDate && entry.data.endDate
                                  ? `${entry.data.startDate} to ${entry.data.endDate}`
                                  : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Duration (Days)</p>
                              <p className="font-medium text-slate-900 dark:text-white">{entry.data.durationDays}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Progress</p>
                              <p className="font-medium text-slate-900 dark:text-white capitalize">{entry.data.progress.replace("-", " ")}</p>
                            </div>
                          </div>

                          {/* Computed Values */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs p-3 bg-slate-100 dark:bg-slate-700 rounded">
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Manual TC</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(entry.computed.manualTcCount)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Automation TC</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(entry.computed.automationTcCount)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Manual HC</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(entry.computed.manualHc)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Automation HC</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(entry.computed.automationHc)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Weeks</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(entry.computed.durationWeeks)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Lead Cost</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(entry.computed.leadCost)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">SQPM Cost</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(entry.computed.sqpmCost)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">PL Cost</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(entry.computed.plCost)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Lab Tech Cost</p>
                              <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(entry.computed.labTechCost)}</p>
                            </div>
                          </div>

                          {/* Comments */}
                          {entry.comments && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                              <p className="text-sm text-amber-900 dark:text-amber-200">
                                <span className="font-semibold">Comment: </span>
                                {entry.comments}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Table */}
        {history.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Budget History
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Budget #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Date Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Total Budget
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Changes
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Comments
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Saved At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {history.map((entry, index) => {
                    const changes = getChangedFields(index);
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
                      >
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                          Budget {history.length - index}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {entry.data.startDate && entry.data.endDate
                            ? `${entry.data.startDate} to ${entry.data.endDate}`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(entry.computed.totalBudget)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {changes.length > 0 ? (
                            <div className="space-y-1 max-h-16 overflow-y-auto">
                              {changes.map((change, changeIndex) => (
                                <div key={changeIndex} className="text-xs p-1 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                                  <p className="font-medium text-blue-900 dark:text-blue-200">
                                    {change.field}:
                                  </p>
                                  <p className="text-blue-800 dark:text-blue-300">
                                    <span className="line-through">{change.oldValue}</span>
                                    <span className="mx-1">→</span>
                                    <span className="font-semibold">{change.newValue}</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">Initial creation</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                          {entry.comments}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {entry.savedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {budgetIndex !== null ? "Edit Budget" : "Add Budget Details"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsBudgetModalOpen(false);
                  setBudgetIndex(null);
                  setBudgetFormData(createBudgetTemplate());
                  setOriginalBudgetData(null);
                }}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Inputs and factors
                </h3>
                {inputRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid gap-4 ${
                      row.length === 1
                        ? "md:grid-cols-1"
                        : row.length === 2
                          ? "md:grid-cols-2"
                          : "md:grid-cols-3"
                    }`}
                  >
                    {row.map((field) => (
                      field.name !== "validationRunName" && (
                        <div key={field.name} className="space-y-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={budgetFormData[field.name]}
                            onChange={handleBudgetFormChange}
                            step={field.step}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                      )
                    ))}
                  </div>
                ))}
              </div>

              {(() => {
                const computed = calculateTemplateValues(budgetFormData);
                const costFieldsWithRates = [
                  { label: "Manual HC Cost", computedName: "manualHcCost" as const, rateName: "manualHcRate" as const },
                  { label: "Automation HC Cost", computedName: "automationHcCost" as const, rateName: "automationHcRate" as const },
                  { label: "Lead Cost", computedName: "leadCost" as const, rateName: "leadRate" as const },
                  { label: "SQPM Cost of Boise", computedName: "sqpmCost" as const, rateName: "sqpmRate" as const },
                  { label: "PL", computedName: "plCost" as const, rateName: "plRate" as const },
                  { label: "Per WQE", computedName: "perWqeCost" as const, rateName: "perWqeRate" as const },
                  { label: "aSQPM", computedName: "asqpmCost" as const, rateName: "asqpmRate" as const },
                  { label: "Lab technician and manager", computedName: "labTechCost" as const, rateName: "labTechRate" as const },
                  { label: "Project manager", computedName: "projectManagerCost" as const, rateName: "projectManagerRate" as const },
                ];

                return (
                  <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Computed Values
                    </h3>
                    <div className="space-y-3">
                      {computedRows.map((row) => {
                        const costField = costFieldsWithRates.find(f => f.computedName === row.name);
                        if (costField) {
                          return (
                            <div key={row.name} className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{row.label}</p>
                              </div>
                              <input
                                type="number"
                                name={costField.rateName}
                                value={budgetFormData[costField.rateName]}
                                onChange={handleBudgetFormChange}
                                step="0.01"
                                placeholder="Rate"
                                className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                              />
                              <p className="font-semibold text-slate-900 dark:text-white text-right min-w-[120px]">
                                {row.kind === "currency"
                                  ? formatCurrency(computed[row.name])
                                  : formatNumber(computed[row.name])}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div key={row.name} className="flex items-center justify-between">
                            <p className="text-sm text-slate-600 dark:text-slate-400">{row.label}</p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {row.kind === "currency"
                                ? formatCurrency(computed[row.name])
                                : formatNumber(computed[row.name])}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsBudgetModalOpen(false);
                  setBudgetIndex(null);
                  setBudgetFormData(createBudgetTemplate());
                  setOriginalBudgetData(null);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveBudget}
                className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-6 py-2 font-semibold text-white transition-all hover:shadow-lg`}
              >
                <Save className="h-4 w-4" />
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {isCommentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Save Changes
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCommentsModalOpen(false);
                  setComments("");
                }}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4 text-slate-600 dark:text-slate-400">
                Add comments about this budget update:
              </p>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your comments here..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
                rows={4}
              />
              {comments.trim() === "" && (
                <p className="mt-2 text-sm text-red-500">
                  Comments are required
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCommentsModalOpen(false);
                  setComments("");
                }}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveWithComments}
                disabled={comments.trim() === ""}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white transition-all ${
                  comments.trim() === ""
                    ? "bg-slate-300 cursor-not-allowed dark:bg-slate-700"
                    : `bg-gradient-to-r ${accentColor} hover:shadow-lg`
                }`}
              >
                <Save className="h-4 w-4" />
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
