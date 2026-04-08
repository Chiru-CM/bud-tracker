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

type BudgetTemplate = {
  validationRunName: string;
  tcCount: string;
  startDate: string;
  endDate: string;
  manualTcCount: string;
  automationTcCount: string;
  adhocRequest: string;
  totalTc: string;
  durationDays: string;
  durationWeeks: string;
  manualHc: string;
  automationHc: string;
  manualHcCost: string;
  automationHcCost: string;
  leadCost: string;
  sqpmCost: string;
  pl50: string;
  perWqe: string;
  asqpm: string;
  labTechCost: string;
  projectManagerCost: string;
};

type TemplateEntry = {
  id: string;
  data: BudgetTemplate;
  isExpanded: boolean;
  isSaved: boolean;
};

const createBudgetTemplate = (): BudgetTemplate => ({
  validationRunName: "",
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

const createTemplateEntry = (): TemplateEntry => ({
  id: crypto.randomUUID(),
  data: createBudgetTemplate(),
  isExpanded: true,
  isSaved: false,
});

const budgetRows: Array<{
  label: string;
  name: keyof BudgetTemplate;
  type: string;
  step?: string;
  placeholder?: string;
}> = [
  {
    label: "Validation run name",
    name: "validationRunName",
    type: "text",
    placeholder: "Enter validation run name",
  },
  { label: "TC Count", name: "tcCount", type: "number" },
  { label: "Start Date", name: "startDate", type: "date" },
  { label: "End Date", name: "endDate", type: "date" },
  { label: "Manual TC Count", name: "manualTcCount", type: "number" },
  { label: "Automation TC Count", name: "automationTcCount", type: "number" },
  { label: "Adhoc Request", name: "adhocRequest", type: "number" },
  { label: "Total TC", name: "totalTc", type: "number" },
  { label: "Duration in Days", name: "durationDays", type: "number" },
  { label: "Duration Weeks", name: "durationWeeks", type: "number" },
  { label: "Manual HC", name: "manualHc", type: "number" },
  { label: "Automation HC", name: "automationHc", type: "number" },
  {
    label: "Manual HC Cost",
    name: "manualHcCost",
    type: "number",
    step: "0.01",
    placeholder: "$0.00",
  },
  {
    label: "Automation HC Cost",
    name: "automationHcCost",
    type: "number",
    step: "0.01",
    placeholder: "$0.00",
  },
  { label: "Lead Cost", name: "leadCost", type: "number", step: "0.01", placeholder: "$0.00" },
  {
    label: "SQPM Cost of Boise 70%",
    name: "sqpmCost",
    type: "number",
    step: "0.01",
    placeholder: "$0.00",
  },
  { label: "PL-50%", name: "pl50", type: "number", step: "0.01", placeholder: "$0.00" },
  { label: "Per WQE - 40%", name: "perWqe", type: "number", step: "0.01", placeholder: "$0.00" },
  { label: "aSQPM - 80%", name: "asqpm", type: "number", step: "0.01", placeholder: "$0.00" },
  {
    label: "Lab Technician & Manager - 40%",
    name: "labTechCost",
    type: "number",
    step: "0.01",
    placeholder: "$0.00",
  },
  {
    label: "Project Manager - 40%",
    name: "projectManagerCost",
    type: "number",
    step: "0.01",
    placeholder: "$0.00",
  },
];

const totalBudgetFields: Array<keyof BudgetTemplate> = [
  "manualHcCost",
  "automationHcCost",
  "leadCost",
  "sqpmCost",
  "pl50",
  "perWqe",
  "asqpm",
  "labTechCost",
  "projectManagerCost",
];

export default function TeamForm() {
  const { teamPath, branch } = useParams<{ teamPath: string; branch: string }>();

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
  const accentColor = branch
    ? branchAccents[branch] ?? "from-blue-500 to-cyan-500"
    : "from-blue-500 to-cyan-500";
  const team = teamPath?.replace(/^team-/, "") ?? "";
  const teamName = team ? team.charAt(0).toUpperCase() + team.slice(1) : "";
  const teamIcons: Record<string, string> = {
    a: "🟦",
    b: "🟩",
    c: "🟥",
  };

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

  const getTotalBudget = (template: BudgetTemplate) =>
    totalBudgetFields.reduce((sum, fieldName) => {
      return sum + Number(template[fieldName] || 0);
    }, 0);

  const formatBudget = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

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
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-6xl mb-4">{teamIcons[team || "a"]}</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Team {teamName} - Budget Templates
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Add one or more budget templates for this team.
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
            const totalBudget = formatBudget(getTotalBudget(template.data));
            const title = template.data.validationRunName || `Template ${templateIndex + 1}`;

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
                        {template.isSaved ? `Saved • Total budget ${totalBudget}` : "Draft • Save to collapse"}
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
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {budgetRows.map((field) => (
                        <div
                          key={field.name}
                          className="grid gap-3 px-6 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)] sm:items-center"
                        >
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={template.data[field.name]}
                            onChange={(event) => handleInputChange(template.id, event)}
                            step={field.step}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Total Budget
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {totalBudget}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 bg-slate-50 px-6 py-5 dark:bg-slate-800">
                    <div className="grid gap-4 sm:grid-cols-2">
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
              className="flex-1 bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg dark:from-slate-700 dark:to-slate-500"
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
