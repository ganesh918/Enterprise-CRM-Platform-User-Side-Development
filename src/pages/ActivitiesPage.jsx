import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Video
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { InputField, SelectField, TextAreaField } from "../components/ui/FormField";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { teamMembers } from "../data/seed";
import {
  addActivity,
  setActivitiesError,
  setActivitiesLoading,
  setActivityTypeFilter,
  toggleActivityComplete
} from "../features/activities/activitiesSlice";
import { getTeamMember } from "../lib/lookups";
import { selectScopedActivities } from "../lib/scopedSelectors";
import { formatRelativeDate } from "../lib/utils";
const typeFilters = [
  { id: "all", label: "All" },
  { id: "call", label: "Calls" },
  { id: "email", label: "Emails" },
  { id: "meeting", label: "Meetings" },
  { id: "note", label: "Notes" },
  { id: "follow_up", label: "Follow-ups" }
];
const typeIcons = {
  call: Phone,
  email: Mail,
  meeting: Video,
  note: MessageSquare,
  follow_up: CalendarClock
};
function ActivitiesPage() {
  const dispatch = useAppDispatch();
  const activities = useAppSelector(selectScopedActivities);
  const typeFilter = useAppSelector((s) => s.activities.typeFilter);
  const error = useAppSelector((s) => s.activities.error);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: "call",
    subject: "",
    description: "",
    ownerId: teamMembers[0].id,
    scheduledAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
    completed: false
  });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        eyebrow: "Activity tracking",
        title: "Activities",
        description: "Log calls, emails, meetings, notes, and follow-ups across every account.",
        actions: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => setModalOpen(true), children: "Log activity" })
      }
    ),
    error && /* @__PURE__ */ jsx(Alert, { variant: "error", className: "mb-4", children: error }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex flex-wrap gap-2", children: typeFilters.map((f) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => dispatch(setActivityTypeFilter(f.id)),
        className: `rounded-full px-3 py-1.5 text-xs font-medium ${typeFilter === f.id ? "bg-emerald-500/20 text-emerald-200" : "bg-white/5 text-slate-400"}`,
        children: f.label
      },
      f.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-emerald-400/40 via-white/10 to-transparent" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: activities.map((activity, index) => {
        const Icon = typeIcons[activity.type];
        const owner = getTeamMember(activity.ownerId);
        return /* @__PURE__ */ jsxs(
          motion.li,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: index * 0.04 },
            className: "relative pl-12",
            children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-2.5 top-4 flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" }),
              /* @__PURE__ */ jsx("div", { className: "glass-panel rounded-2xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-300", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: activity.subject }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-400", children: activity.description }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-slate-500", children: [
                      owner?.name,
                      " \xB7 ",
                      formatRelativeDate(activity.scheduledAt)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => dispatch(toggleActivityComplete(activity.id)),
                    className: `rounded-full px-3 py-1 text-xs font-medium transition ${activity.completed ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"}`,
                    children: activity.completed ? "Completed" : "Mark complete"
                  }
                )
              ] }) })
            ]
          },
          activity.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: "Log activity", children: /* @__PURE__ */ jsxs(
      "form",
      {
        className: "space-y-4",
        onSubmit: async (e) => {
          e.preventDefault();
          if (!form.subject.trim()) {
            dispatch(setActivitiesError("Subject is required"));
            return;
          }
          setSubmitting(true);
          dispatch(setActivitiesLoading(true));
          dispatch(setActivitiesError(null));
          await new Promise((r) => setTimeout(r, 350));
          dispatch(
            addActivity({
              ...form,
              scheduledAt: new Date(form.scheduledAt).toISOString()
            })
          );
          setSubmitting(false);
          dispatch(setActivitiesLoading(false));
          setModalOpen(false);
        },
        children: [
          /* @__PURE__ */ jsx(
            SelectField,
            {
              label: "Type",
              value: form.type,
              onChange: (e) => setForm({ ...form, type: e.target.value }),
              children: typeFilters.filter((f) => f.id !== "all").map((f) => /* @__PURE__ */ jsx("option", { value: f.id, children: f.label }, f.id))
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Subject",
              value: form.subject,
              onChange: (e) => setForm({ ...form, subject: e.target.value }),
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
                label: "Owner",
                value: form.ownerId,
                onChange: (e) => setForm({ ...form, ownerId: e.target.value }),
                children: teamMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Scheduled at",
                type: "datetime-local",
                value: form.scheduledAt,
                onChange: (e) => setForm({ ...form, scheduledAt: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setModalOpen(false), children: "Cancel" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", loading: submitting, children: "Save activity" })
          ] })
        ]
      }
    ) })
  ] });
}
export {
  ActivitiesPage
};
