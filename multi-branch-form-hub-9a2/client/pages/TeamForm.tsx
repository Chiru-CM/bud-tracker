import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Edit3,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
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

type ValidationRun = {
  id: string;
  name: string;
  isExpanded: boolean;
  budgets: BudgetTemplate[];
};

type TemplateEntry = {
  id: string;
  data: BudgetTemplate;
  isExpanded: boolean;
  isSaved: boolean;
  historyId?: string;
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
  manualHcRate: "",
  automationHcRate: "",
  leadRate: "",
  sqpmRate: "",
  plRate: "",
  perWqeRate: "",
  asqpmRate: "",
  labTechRate: "",
  projectManagerRate: "",
});

const createTemplateEntry = (): TemplateEntry => ({
  id: crypto.randomUUID(),
  data: createBudgetTemplate(),
  isExpanded: true,
  isSaved: false,
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

export default function TeamForm() {
  const { teamPath, branch, category } = useParams<{
    teamPath: string;
    branch: string;
    category: string;
  }>();

  const branchKey = branch && branch in branchConfigs ? (branch as BranchKey) : null;
  const categoryKey =
    category && category in categoryCards ? (category as CategoryKey) : null;
  const branchTitle = branchKey ? branchConfigs[branchKey].title : "";
  const accentColor = branchKey
    ? branchConfigs[branchKey].accentColor
    : "from-blue-500 to-cyan-500";
  const categoryLabel = categoryKey ? categoryCards[categoryKey].label : "";
  const categoryIcon = categoryKey ? categoryCards[categoryKey].icon : "👥";
  const team = teamPath?.replace(/^team-/, "") ?? "";
  const teamName = formatTeamNameFromSlug(team);
  const backPath =
    branch && category ? `/${branch}/${category}` : branch ? `/${branch}` : "/";

  const [validationRuns, setValidationRuns] = useState<ValidationRun[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationRunInput, setValidationRunInput] = useState("");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [modalValidationRunId, setModalValidationRunId] = useState<string | null>(null);
  const [modalBudgetIndex, setModalBudgetIndex] = useState<number | null>(null);
  const [budgetFormData, setBudgetFormData] = useState<BudgetTemplate>(createBudgetTemplate());

  const handleInputChange = (
    templateId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setTemplates((previousTemplates) =>
      previousTemplates.map((template) => {
        if (template.id !== templateId) return template;

        const updatedData = { ...template.data, [name as keyof BudgetTemplate]: value };

        // Auto-calculate duration in days when start or end date changes
        if ((name === "startDate" || name === "endDate") && updatedData.startDate && updatedData.endDate) {
          const calculatedDays = getBusinessDaysInclusive(updatedData.startDate, updatedData.endDate);
          updatedData.durationDays = calculatedDays > 0 ? String(calculatedDays) : "";
        }

        return {
          ...template,
          data: updatedData,
          isSaved: false,
        };
      }),
    );
  };

  const addValidationRun = () => {
    setValidationRunInput("");
    setIsValidationModalOpen(true);
  };

  const saveValidationRun = () => {
    if (validationRunInput.trim() === "") return;

    const newRun: ValidationRun = {
      id: crypto.randomUUID(),
      name: validationRunInput,
      isExpanded: true,
      budgets: [],
    };

    setValidationRuns((previousRuns) => [...previousRuns, newRun]);
    setIsValidationModalOpen(false);
    setValidationRunInput("");
  };

  const addBudgetToRun = (validationRunId: string) => {
    setBudgetFormData(createBudgetTemplate());
    setModalValidationRunId(validationRunId);
    setModalBudgetIndex(null); // For new budget
    setIsBudgetModalOpen(true);
  };

  const openBudgetFormModal = (validationRunId: string, budgetIndex: number) => {
    const run = validationRuns.find((r) => r.id === validationRunId);
    if (run && run.budgets[budgetIndex]) {
      setBudgetFormData(run.budgets[budgetIndex]);
      setModalValidationRunId(validationRunId);
      setModalBudgetIndex(budgetIndex);
      setIsBudgetModalOpen(true);
    }
  };

  const saveBudgetToRun = () => {
    if (!modalValidationRunId) return;

    setValidationRuns((previousRuns) =>
      previousRuns.map((run) => {
        if (run.id !== modalValidationRunId) return run;

        const newBudgets = [...run.budgets];
        if (modalBudgetIndex !== null) {
          newBudgets[modalBudgetIndex] = budgetFormData;
        } else {
          newBudgets.push(budgetFormData);
        }

        return { ...run, budgets: newBudgets };
      }),
    );
    setIsBudgetModalOpen(false);
    setModalValidationRunId(null);
    setModalBudgetIndex(null);
    setBudgetFormData(createBudgetTemplate());
  };

  const handleBudgetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBudgetFormData((previous) => {
      const updated = { ...previous, [name]: value };
      // Auto-calculate duration in days when start or end date changes
      if ((name === "startDate" || name === "endDate") && updated.startDate && updated.endDate) {
        const calculatedDays = getBusinessDaysInclusive(updated.startDate, updated.endDate);
        updated.durationDays = calculatedDays > 0 ? String(calculatedDays) : "";
      }
      return updated;
    });
  };

  const toggleValidationRun = (validationRunId: string) => {
    setValidationRuns((previousRuns) =>
      previousRuns.map((run) =>
        run.id === validationRunId ? { ...run, isExpanded: !run.isExpanded } : run,
      ),
    );
  };

  const removeValidationRun = (validationRunId: string) => {
    setValidationRuns((previousRuns) =>
      previousRuns.filter((run) => run.id !== validationRunId),
    );
  };

  const duplicateBudget = (validationRunId: string, budgetIndex: number) => {
    setValidationRuns((previousRuns) =>
      previousRuns.map((run) => {
        if (run.id !== validationRunId) return run;

        const budgetToDuplicate = run.budgets[budgetIndex];
        if (!budgetToDuplicate) return run;

        return {
          ...run,
          budgets: [...run.budgets, { ...budgetToDuplicate }],
        };
      }),
    );
  };

  const removeBudget = (validationRunId: string, budgetIndex: number) => {
    setValidationRuns((previousRuns) =>
      previousRuns.map((run) => {
        if (run.id !== validationRunId) return run;

        return {
          ...run,
          budgets: run.budgets.filter((_, i) => i !== budgetIndex),
        };
      }),
    );
  };

  const removeTemplate = (templateId: string) => {
    setTemplates((previousTemplates) =>
      previousTemplates.length === 1
        ? previousTemplates
        : previousTemplates.filter((template) => template.id !== templateId),
    );
  };

  const saveTemplate = (templateId: string) => {
    setTemplates((previousTemplates) =>
      previousTemplates.map((template) => {
        if (template.id === templateId) {
          const computed = calculateTemplateValues(template.data);

          if (template.historyId) {
            // Update existing history entry
            setHistory((previousHistory) =>
              previousHistory.map((entry) =>
                entry.id === template.historyId
                  ? {
                      ...entry,
                      data: { ...template.data },
                      computed,
                      savedAt: new Date().toLocaleString(),
                    }
                  : entry,
              ),
            );
          } else {
            // Create new history entry
            const newHistoryId = crypto.randomUUID();
            setHistory((previousHistory) => [
              ...previousHistory,
              {
                id: newHistoryId,
                data: { ...template.data },
                savedAt: new Date().toLocaleString(),
                computed,
              },
            ]);
            return { ...template, isSaved: true, isExpanded: false, historyId: newHistoryId };
          }

          return { ...template, isSaved: true, isExpanded: false };
        }
        return template;
      }),
    );
  };

  const toggleTemplate = (templateId: string) => {
    setTemplates((previousTemplates) =>
      previousTemplates.map((template) =>
        template.id === templateId
          ? { ...template, isExpanded: !template.isExpanded }
          : template,
      ),
    );
  };

  const duplicateTemplate = (templateId: string) => {
    setTemplates((previousTemplates) => {
      const templateToDuplicate = previousTemplates.find((t) => t.id === templateId);
      if (!templateToDuplicate) return previousTemplates;

      const newEntry: TemplateEntry = {
        id: crypto.randomUUID(),
        data: { ...templateToDuplicate.data },
        isExpanded: true,
        isSaved: false,
        // Don't copy historyId - this creates a new entry
      };

      return [...previousTemplates, newEntry];
    });
  };

  const editFromHistory = (historyEntry: HistoryEntry) => {
    const newEntry: TemplateEntry = {
      id: crypto.randomUUID(),
      data: { ...historyEntry.data },
      isExpanded: true,
      isSaved: false,
    };

    setTemplates((previousTemplates) => [...previousTemplates, newEntry]);
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
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {teamName} - Budget Allocation
          </h2>
          <button
            type="button"
            onClick={addValidationRun}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
          >
            <Plus className="h-4 w-4" />
            Add run
          </button>
        </div>

        <div className="space-y-8">
          {validationRuns.map((validationRun) => (
            <section
              key={validationRun.id}
              className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all"
            >
              {/* Validation Run Header */}
              <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => toggleValidationRun(validationRun.id)}
                  className="flex flex-1 items-center justify-between gap-4 text-left"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {validationRun.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {validationRun.isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => addBudgetToRun(validationRun.id)}
                    className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-3 py-2 text-sm font-semibold text-white transition-colors hover:shadow-lg`}
                  >
                    <Plus className="h-4 w-4" />
                    Add Budget
                  </button>
                  {validationRuns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeValidationRun(validationRun.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Budgets List */}
              {validationRun.isExpanded && validationRun.budgets.length > 0 && (
                <div className="space-y-4 px-6 py-5">
                  {validationRun.budgets.map((budget, budgetIndex) => {
                    const computed = calculateTemplateValues(budget);
                    const budgetTitle = `Budget ${budgetIndex + 1}`;

                    return (
                      <div
                        key={budgetIndex}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {budgetTitle}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Total: {formatCurrency(computed.totalBudget)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openBudgetFormModal(validationRun.id, budgetIndex)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateBudget(validationRun.id, budgetIndex)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Plus className="h-4 w-4" />
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBudget(validationRun.id, budgetIndex)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {validationRun.isExpanded && validationRun.budgets.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    No budgets added yet
                  </p>
                  <button
                    type="button"
                    onClick={() => addBudgetToRun(validationRun.id)}
                    className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-4 py-2 text-sm font-semibold text-white transition-colors hover:shadow-lg`}
                  >
                    <Plus className="h-4 w-4" />
                    Add your first budget
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>

        {history.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Allocation History
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Validation Run Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Date Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Total Budget
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Saved At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {history.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {entry.data.validationRunName || "—"}
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
                        {entry.savedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Validation Run Name Modal */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Add Run
              </h2>
              <button
                type="button"
                onClick={() => setIsValidationModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Validation run name
              </label>
              <input
                type="text"
                value={validationRunInput}
                onChange={(e) => setValidationRunInput(e.target.value)}
                placeholder="Enter validation run name"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsValidationModalOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              {validationRunInput.trim() !== "" && (
                <button
                  type="button"
                  onClick={saveValidationRun}
                  className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-6 py-2 font-semibold text-white transition-all hover:shadow-lg`}
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Budget Details Modal */}
      {isBudgetModalOpen && modalValidationRunId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {modalBudgetIndex !== null ? "Edit Budget" : "Add Budget Details"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsBudgetModalOpen(false);
                  setModalValidationRunId(null);
                  setModalBudgetIndex(null);
                  setBudgetFormData(createBudgetTemplate());
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
                return (
                  <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Budget Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total Budget</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(computed.totalBudget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total TC</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatNumber(computed.totalTc)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Duration (days)</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatNumber(computed.durationDays)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Manual HC</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatNumber(computed.manualHc)}
                        </p>
                      </div>
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
                  setModalValidationRunId(null);
                  setModalBudgetIndex(null);
                  setBudgetFormData(createBudgetTemplate());
                }}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveBudgetToRun}
                className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-6 py-2 font-semibold text-white transition-all hover:shadow-lg`}
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
