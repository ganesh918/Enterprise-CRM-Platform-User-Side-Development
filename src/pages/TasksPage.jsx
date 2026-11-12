import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { InputField, SelectField, TextAreaField } from "../components/ui/FormField";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { PRIORITY_META } from "../constants/crm";
import { teamMembers } from "../data/seed";
import {
  addTask,
  deleteTask,
  setTaskFilter,
  setTasksError,
  setTasksLoading,
  updateTask
} from "../features/tasks/tasksSlice";
import { getTeamMember } from "../lib/lookups";
import { selectScopedTasks } from "../lib/scopedSelectors";
import { formatRelativeDate } from "../lib/utils";
const statusFilters = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" }
];
const emptyForm = {
  title: "",
  description: "",
  assigneeId: teamMembers[0].id,
  priority: "medium",
  status: "todo",
  dueDate: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)
};
function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectScopedTasks);
  const filter = useAppSelector((s) => s.tasks.filter);
  const error = useAppSelector((s) => s.tasks.error);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    dispatch(setTasksError(null));
    setModalOpen(true);
  };
  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.slice(0, 10)
    });
    dispatch(setTasksError(null));
    setModalOpen(true);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        eyebrow: "Task management",
        title: "Tasks",
        description: "Create, assign, prioritize, and track deadlines across your revenue team.",
        actions: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: openCreate, children: "New task" })
      }
    ),
    error && /* @__PURE__ */ jsx(Alert, { variant: "error", className: "mb-4", children: error }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex flex-wrap gap-2", children: statusFilters.map((f) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => dispatch(setTaskFilter(f.id)),
        className: `rounded-full px-3 py-1.5 text-xs font-medium ${filter === f.id ? "bg-sky-500/20 text-sky-200" : "bg-white/5 text-slate-400"}`,
        children: f.label
      },
      f.id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: tasks.map((task, index) => {
      const assignee = getTeamMember(task.assigneeId);
      const priority = PRIORITY_META[task.priority];
      return /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -8 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: index * 0.03 },
          className: "glass-panel flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => dispatch(
                    updateTask({
                      ...task,
                      status: task.status === "done" ? "todo" : "done"
                    })
                  ),
                  className: "mt-0.5 text-slate-400 transition hover:text-emerald-300",
                  "aria-label": "Toggle task completion",
                  children: /* @__PURE__ */ jsx(
                    CheckCircle2,
                    {
                      className: `h-5 w-5 ${task.status === "done" ? "text-emerald-400" : ""}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: `font-medium ${task.status === "done" ? "text-slate-500 line-through" : "text-white"}`,
                    children: task.title
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-400", children: task.description }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsx("span", { children: assignee?.name }),
                  /* @__PURE__ */ jsx("span", { children: "\xB7" }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                    "Due ",
                    formatRelativeDate(task.dueDate)
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:justify-end", children: [
              /* @__PURE__ */ jsx(Badge, { className: priority.className, children: priority.label }),
              /* @__PURE__ */ jsx(Badge, { className: "bg-white/10 text-slate-300", children: task.status.replace("_", " ") }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  className: "px-2 py-1.5",
                  onClick: () => openEdit(task),
                  "aria-label": "Edit task",
                  children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  className: "px-2 py-1.5",
                  onClick: () => dispatch(deleteTask(task.id)),
                  "aria-label": "Delete task",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-rose-300" })
                }
              )
            ] })
          ]
        },
        task.id
      );
    }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: modalOpen,
        onClose: () => setModalOpen(false),
        title: editing ? "Edit task" : "Create task",
        children: /* @__PURE__ */ jsxs(
          "form",
          {
            className: "space-y-4",
            onSubmit: async (e) => {
              e.preventDefault();
              if (!form.title.trim()) {
                dispatch(setTasksError("Task title is required"));
                return;
              }
              setSubmitting(true);
              dispatch(setTasksLoading(true));
              dispatch(setTasksError(null));
              await new Promise((r) => setTimeout(r, 350));
              const payload = {
                ...form,
                dueDate: new Date(form.dueDate).toISOString()
              };
              if (editing) {
                dispatch(updateTask({ ...editing, ...payload }));
              } else {
                dispatch(addTask(payload));
              }
              setSubmitting(false);
              dispatch(setTasksLoading(false));
              setModalOpen(false);
            },
            children: [
              /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Title",
                  value: form.title,
                  onChange: (e) => setForm({ ...form, title: e.target.value }),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextAreaField,
                {
                  label: "Description",
                  value: form.description,
                  onChange: (e) => setForm({ ...form, description: e.target.value })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(
                  SelectField,
                  {
                    label: "Assignee",
                    value: form.assigneeId,
                    onChange: (e) => setForm({ ...form, assigneeId: e.target.value }),
                    children: teamMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
                  }
                ),
                /* @__PURE__ */ jsx(
                  SelectField,
                  {
                    label: "Priority",
                    value: form.priority,
                    onChange: (e) => setForm({ ...form, priority: e.target.value }),
                    children: Object.entries(PRIORITY_META).map(([key, meta]) => /* @__PURE__ */ jsx("option", { value: key, children: meta.label }, key))
                  }
                ),
                /* @__PURE__ */ jsxs(
                  SelectField,
                  {
                    label: "Status",
                    value: form.status,
                    onChange: (e) => setForm({ ...form, status: e.target.value }),
                    children: [
                      statusFilters.filter((f) => f.id !== "all").map((f) => /* @__PURE__ */ jsx("option", { value: f.id, children: f.label }, f.id)),
                      /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Cancelled" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputField,
                  {
                    label: "Due date",
                    type: "date",
                    value: form.dueDate,
                    onChange: (e) => setForm({ ...form, dueDate: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setModalOpen(false), children: "Cancel" }),
                /* @__PURE__ */ jsx(Button, { type: "submit", loading: submitting, children: editing ? "Save task" : "Create task" })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  TasksPage
};
