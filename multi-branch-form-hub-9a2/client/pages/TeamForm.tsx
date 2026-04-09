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
  budget: string;
  tcCount: string;
  startDate: string;
  endDate: string;
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
};

type TemplateEntry = {
  id: string;
  data: BudgetTemplate;
  isExpanded: boolean;
  isSaved: boolean;
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

const createBudgetTemplate = (): BudgetTemplate => ({
  validationRunName: "",
  budget: "",
  tcCount: "",
  startDate: "",
  endDate: "",
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
});

const createTemplateEntry = (): TemplateEntry => ({
  id: crypto.randomUUID(),
  data: createBudgetTemplate(),
  isExpanded: true,
  isSaved: false,
});

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
    { label: "Rate card", name: "budget", type: "number", step: "0.01", placeholder: "$0.00" },
    { label: "TC Count", name: "tcCount", type: "number", step: "0.01" },
  ],
  [
    { label: "Start Date", name: "startDate", type: "date" },
    { label: "End Date", name: "endDate", type: "date" },
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
  const budget = parseNumber(template.budget);
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
  const durationDays = getBusinessDaysInclusive(template.startDate, template.endDate);
  const manualTcCount = tcCount * manualTcFactor;
  const automationTcCount = tcCount * automationTcFactor;
  const adhocRequest = tcCount * adhocRequestFactor;
  const totalTc = manualTcCount + automationTcCount + adhocRequest;
  const durationWeeks = durationDays * durationWeekFactor;
  const manualHc = durationDays > 0 ? (manualTcCount + adhocRequest) / durationDays / manualHcDivisor : 0;
  const automationHc = durationDays > 0 ? automationTcCount / durationDays / automationHcDivisor : 0;
  const manualHcCost = manualHc * budget * durationWeeks;
  const automationHcCost = automationHc * budget * durationWeeks;
  const leadCost = durationWeeks * budget;
  const sqpmCost = durationWeeks * budget * sqpmFactor;
  const plCost = durationWeeks * budget * plFactor;
  const perWqeCost = durationWeeks * budget * perWqeFactor;
  const asqpmCost = durationWeeks * budget * asqpmFactor;
  const labTechCost = durationWeeks * budget * labTechFactor;
  const projectManagerCost = durationWeeks * budget * projectManagerFactor;
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

  const [templates, setTemplates] = useState<TemplateEntry[]>([
    createTemplateEntry(),
  ]);

  const handleInputChange = (
    templateId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setTemplates((previousTemplates) =>
      previousTemplates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              data: { ...template.data, [name as keyof BudgetTemplate]: value },
              isSaved: false,
            }
          : template,
      ),
    );
  };

  const addTemplate = () => {
    setTemplates((previousTemplates) => [
      ...previousTemplates,
      createTemplateEntry(),
    ]);
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
      previousTemplates.map((template) =>
        template.id === templateId
          ? { ...template, isSaved: true, isExpanded: false }
          : template,
      ),
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
          <div>
            <div className="text-6xl mb-4">{categoryIcon}</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {teamName} - Budget Templates
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Add one or more budget templates for this {categoryLabel.toLowerCase() || "selected"} team.
            </p>
          </div>
          <button
            type="button"
            onClick={addTemplate}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
          >
            <Plus className="h-4 w-4" />
            Add budget template
          </button>
        </div>

        <div className="space-y-8">
          {templates.map((template, templateIndex) => {
            const computed = calculateTemplateValues(template.data);
            const title = template.data.validationRunName || `Template ${templateIndex + 1}`;
            const totalBudget = formatCurrency(computed.totalBudget);

            return (
              <section
                key={template.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => toggleTemplate(template.id)}
                    className="flex flex-1 items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Budget template {templateIndex + 1}
                      </p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {template.isSaved
                          ? `Saved • Total budget ${totalBudget}`
                          : "Draft • Save to collapse"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {template.isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => saveTemplate(template.id)}
                      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${accentColor} px-3 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg`}
                    >
                      <Save className="h-4 w-4" />
                      {template.isSaved ? "Save changes" : "Save"}
                    </button>
                    {template.isSaved ? (
                      <button
                        type="button"
                        onClick={() => toggleTemplate(template.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                    ) : null}
                    {templates.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeTemplate(template.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>

                {template.isExpanded ? (
                  <>
                    <div className="bg-slate-50 px-6 py-5 dark:bg-slate-800">
                      <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Inputs and factors
                      </h4>
                      <div className="space-y-4">
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
                              <div key={field.name} className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {field.label}
                                </label>
                                <input
                                  type={field.type}
                                  name={field.name}
                                  value={template.data[field.name]}
                                  onChange={(event) => handleInputChange(template.id, event)}
                                  step={field.step}
                                  placeholder={field.placeholder}
                                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {computedRows.map((field) => (
                        <div
                          key={field.name}
                          className="grid gap-3 px-6 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)] sm:items-center"
                        >
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                          </label>
                          <input
                            readOnly
                            value={
                              field.kind === "currency"
                                ? formatCurrency(computed[field.name])
                                : formatNumber(computed[field.name])
                            }
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 bg-slate-50 px-6 py-5 dark:bg-slate-800">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Validation run name
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {template.data.validationRunName || "—"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Budget
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(parseNumber(template.data.budget))}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Total budget
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {totalBudget}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This template is saved. Click Edit to open it again.
                    </p>
                  </div>
                )}
              </section>
            );
          })}

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={addTemplate}
              className="flex-1 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg dark:from-slate-700 dark:to-slate-500"
            >
              Add another template
            </button>
            <Link
              to={`/${branch}`}
              className="rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
