import { jsx, jsxs } from "react/jsx-runtime";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  DollarSign,
  Edit2,
  GripVertical,
  Layers,
  Plus,
  Target,
  Trash2,
  TrendingUp
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/Button";
import { InputField, SelectField } from "../components/ui/FormField";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Avatar } from "../components/ui/Avatar";
import { PIPELINE_STAGES } from "../constants/crm";
import { teamMembers } from "../data/seed";
import { Alert } from "../components/ui/Alert";
import {
  addDeal,
  deleteDeal,
  moveDeal,
  setPipelineError,
  setPipelineLoading,
  updateDeal
} from "../features/pipeline/pipelineSlice";
import { getTeamMember } from "../lib/lookups";
import { selectScopedDeals } from "../lib/scopedSelectors";
import { cn, formatCurrency } from "../lib/utils";
function DealCardPreview({ deal }) {
  const owner = getTeamMember(deal.ownerId);
  return /* @__PURE__ */ jsxs("div", { className: "w-56 rounded-xl border border-emerald-400/30 bg-surface-800 p-3 shadow-2xl shadow-emerald-500/20", children: [
    /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-white", children: deal.title }),
    /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-slate-400", children: deal.company }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold text-emerald-200", children: formatCurrency(deal.value) }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] text-slate-500", children: owner?.name.split(" ")[0] })
  ] });
}
function DealCard({
  deal,
  dragging,
  onEdit,
  onDelete
}) {
  const owner = getTeamMember(deal.ownerId);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
    data: { stage: deal.stage }
  });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : void 0;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      ref: setNodeRef,
      style,
      layout: true,
      className: cn(
        "rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-3 shadow-sm transition",
        dragging ? "opacity-40" : "hover:border-emerald-400/25"
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "mt-0.5 shrink-0 cursor-grab text-slate-500 active:cursor-grabbing",
            ...listeners,
            ...attributes,
            "aria-label": "Drag deal",
            children: /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm font-medium leading-snug text-white", children: deal.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-xs text-slate-400", children: deal.company }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold text-emerald-200", children: formatCurrency(deal.value) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-1 flex justify-between text-[10px] text-slate-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Win chance" }),
              /* @__PURE__ */ jsxs("span", { children: [
                deal.probability,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-1 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500",
                style: { width: `${deal.probability}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between gap-2", children: [
            owner ? /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Avatar, { initials: owner.avatar, size: "sm" }),
              /* @__PURE__ */ jsx("span", { className: "truncate text-[10px] text-slate-400", children: owner.name })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500", children: "Unassigned" }),
            /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 gap-0.5", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-emerald-200",
                  onClick: () => onEdit(deal),
                  "aria-label": "Edit deal",
                  children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-rose-300",
                  onClick: () => onDelete(deal.id),
                  "aria-label": "Delete deal",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
}
function StageColumn({
  stageId,
  label,
  color,
  deals,
  onEditDeal,
  onDeleteDeal
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId });
  const total = deals.reduce((sum, d) => sum + d.value, 0);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      className: cn(
        "glass-panel flex min-h-[280px] min-w-0 flex-col rounded-2xl p-3 transition md:min-h-[320px]",
        isOver && "border-emerald-400/40 bg-emerald-500/5 ring-1 ring-emerald-400/20"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: cn("mb-2 h-1 w-full max-w-[4rem] rounded-full bg-gradient-to-r", color) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: label }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300", children: deals.length })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: formatCurrency(total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5", children: [
          deals.map((deal) => /* @__PURE__ */ jsx(
            DealCard,
            {
              deal,
              onEdit: onEditDeal,
              onDelete: onDeleteDeal
            },
            deal.id
          )),
          deals.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-2 text-center text-[11px] text-slate-500", children: "Drop deals here" })
        ] })
      ]
    }
  );
}
const emptyDealForm = {
  title: "",
  company: "",
  stage: "discovery",
  value: 5e4,
  probability: 25,
  ownerId: teamMembers[0].id,
  expectedClose: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)
};
function PipelinePage() {
  const dispatch = useAppDispatch();
  const allDeals = useAppSelector(selectScopedDeals);
  const globalSearch = useAppSelector((s) => s.ui.globalSearch);
  const pipelineError = useAppSelector((s) => s.pipeline.error);
  const [activeId, setActiveId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyDealForm);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const deals = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return allDeals;
    return allDeals.filter(
      (d) => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)
    );
  }, [allDeals, globalSearch]);
  const openDealModal = (deal) => {
    if (deal) {
      setEditingDeal(deal);
      setForm({
        title: deal.title,
        company: deal.company,
        stage: deal.stage,
        value: deal.value,
        probability: deal.probability,
        ownerId: deal.ownerId,
        expectedClose: deal.expectedClose.slice(0, 10)
      });
    } else {
      setEditingDeal(null);
      setForm(emptyDealForm);
    }
    dispatch(setPipelineError(null));
    setModalOpen(true);
  };
  const stats = useMemo(() => {
    const open = deals.filter(
      (d) => d.stage !== "closed_won" && d.stage !== "closed_lost"
    );
    const openValue = open.reduce((sum, d) => sum + d.value, 0);
    const weighted = open.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
    const won = deals.filter((d) => d.stage === "closed_won");
    const wonValue = won.reduce((sum, d) => sum + d.value, 0);
    return {
      openCount: open.length,
      openValue,
      weighted,
      wonCount: won.length,
      wonValue,
      avgDeal: open.length ? openValue / open.length : 0
    };
  }, [deals]);
  const onDragStart = (event) => {
    setActiveId(String(event.active.id));
  };
  const onDragEnd = (event) => {
    setActiveId(null);
    const dealId = String(event.active.id);
    const overId = event.over?.id;
    if (!overId) return;
    const stage = String(overId);
    if (PIPELINE_STAGES.some((s) => s.id === stage)) {
      dispatch(moveDeal({ id: dealId, stage }));
    }
  };
  const activeDeal = deals.find((d) => d.id === activeId);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 overflow-x-hidden pb-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-800/80 via-surface-900/90 to-surface-950 p-6 md:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 animate-shimmer opacity-30" }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/90", children: "Sales pipeline" }),
          /* @__PURE__ */ jsxs("h2", { className: "mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl", children: [
            "Move deals from",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "discovery to close" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm text-slate-400", children: "Drag cards between stages to update momentum. All columns fit your screen \u2014 scroll vertically inside a stage when you add more deals." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[440px]", children: [
          { label: "Open deals", value: String(stats.openCount), icon: Layers },
          { label: "Pipeline", value: formatCurrency(stats.openValue), icon: DollarSign },
          { label: "Forecast", value: formatCurrency(stats.weighted), icon: Target },
          { label: "Closed won", value: formatCurrency(stats.wonValue), icon: TrendingUp }
        ].map((item, i) => {
          const Icon = item.icon;
          return /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.05 },
              className: "glass-panel rounded-2xl p-3",
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "mb-2 h-4 w-4 text-sky-300" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white", children: item.value }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: item.label })
              ]
            },
            item.label
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        eyebrow: "Kanban board",
        title: "Visual deal pipeline",
        description: "Drag deals across stages to track momentum from discovery to close.",
        actions: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => openDealModal(), children: "Add deal" })
      }
    ),
    pipelineError && /* @__PURE__ */ jsx(Alert, { variant: "error", className: "mb-4", children: pipelineError }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: PIPELINE_STAGES.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage.id);
      const value = stageDeals.reduce((s, d) => s + d.value, 0);
      return /* @__PURE__ */ jsxs(
        "span",
        {
          className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300",
          children: [
            /* @__PURE__ */ jsx("span", { className: cn("h-2 w-2 rounded-full bg-gradient-to-r", stage.color) }),
            stage.label,
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-white", children: stageDeals.length }),
            /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
              "\xB7 ",
              formatCurrency(value)
            ] })
          ]
        },
        stage.id
      );
    }) }),
    /* @__PURE__ */ jsxs(DndContext, { sensors, onDragStart, onDragEnd, children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6", children: PIPELINE_STAGES.map((stage, index) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.04 },
          className: "min-w-0",
          children: /* @__PURE__ */ jsx(
            StageColumn,
            {
              stageId: stage.id,
              label: stage.label,
              color: stage.color,
              deals: deals.filter((d) => d.stage === stage.id),
              onEditDeal: openDealModal,
              onDeleteDeal: (id) => dispatch(deleteDeal(id))
            }
          )
        },
        stage.id
      )) }),
      /* @__PURE__ */ jsx(DragOverlay, { children: activeDeal ? /* @__PURE__ */ jsx(DealCardPreview, { deal: activeDeal }) : null })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-panel grid gap-4 rounded-2xl p-5 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Avg open deal" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-white", children: formatCurrency(stats.avgDeal) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Deals won" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-emerald-300", children: stats.wonCount })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Coverage ratio" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-emerald-200", children: stats.openCount ? `${Math.round(stats.weighted / stats.openValue * 100)}%` : "\u2014" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500", children: "Weighted vs raw pipeline" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: modalOpen,
        onClose: () => setModalOpen(false),
        title: editingDeal ? "Edit deal" : "Add deal",
        children: /* @__PURE__ */ jsxs(
          "form",
          {
            className: "space-y-4",
            onSubmit: async (e) => {
              e.preventDefault();
              if (!form.title.trim() || !form.company.trim()) {
                dispatch(setPipelineError("Title and company are required"));
                return;
              }
              setSubmitting(true);
              dispatch(setPipelineLoading(true));
              dispatch(setPipelineError(null));
              await new Promise((r) => setTimeout(r, 350));
              const payload = {
                ...form,
                expectedClose: new Date(form.expectedClose).toISOString()
              };
              if (editingDeal) {
                dispatch(updateDeal({ ...editingDeal, ...payload }));
              } else {
                dispatch(addDeal(payload));
              }
              setSubmitting(false);
              dispatch(setPipelineLoading(false));
              setModalOpen(false);
            },
            children: [
              /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Deal title",
                  value: form.title,
                  onChange: (e) => setForm({ ...form, title: e.target.value }),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Company",
                  value: form.company,
                  onChange: (e) => setForm({ ...form, company: e.target.value }),
                  required: true
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(
                  SelectField,
                  {
                    label: "Stage",
                    value: form.stage,
                    onChange: (e) => setForm({ ...form, stage: e.target.value }),
                    children: PIPELINE_STAGES.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.label }, s.id))
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputField,
                  {
                    label: "Value",
                    type: "number",
                    value: form.value,
                    onChange: (e) => setForm({ ...form, value: Number(e.target.value) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputField,
                  {
                    label: "Probability %",
                    type: "number",
                    min: 0,
                    max: 100,
                    value: form.probability,
                    onChange: (e) => setForm({ ...form, probability: Number(e.target.value) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputField,
                  {
                    label: "Expected close",
                    type: "date",
                    value: form.expectedClose,
                    onChange: (e) => setForm({ ...form, expectedClose: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                SelectField,
                {
                  label: "Owner",
                  value: form.ownerId,
                  onChange: (e) => setForm({ ...form, ownerId: e.target.value }),
                  children: teamMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setModalOpen(false), children: "Cancel" }),
                /* @__PURE__ */ jsx(Button, { type: "submit", loading: submitting, children: editingDeal ? "Save deal" : "Create deal" })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  PipelinePage
};
