import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { ArrowLeft, Edit2, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  CustomerFormModal
} from "../components/customers/CustomerFormModal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { selectAllActivities } from "../features/activities/activitiesSlice";
import {
  selectCustomerById,
  setCustomersLoading,
  updateCustomer
} from "../features/customers/customersSlice";
import { getTeamMember } from "../lib/lookups";
import { formatCurrency, formatRelativeDate } from "../lib/utils";
function CustomerDetailPage() {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomerById(id));
  const activities = useAppSelector(selectAllActivities).filter(
    (a) => a.customerId === id
  );
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  if (!customer) {
    return /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-white", children: "Customer not found." }),
      /* @__PURE__ */ jsx(Link, { to: "/customers", className: "mt-4 inline-block text-emerald-300", children: "Back to customers" })
    ] });
  }
  const owner = getTeamMember(customer.ownerId);
  const formInitial = {
    name: customer.name,
    company: customer.company,
    email: customer.email,
    phone: customer.phone,
    industry: customer.industry,
    location: customer.location,
    tier: customer.tier,
    ownerId: customer.ownerId,
    lifetimeValue: customer.lifetimeValue,
    tags: customer.tags
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/customers",
        className: "mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Back to customers"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-800/90 to-surface-950 p-6 md:p-8",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                Avatar,
                {
                  initials: customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2),
                  size: "lg"
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-white", children: customer.name }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: customer.company }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsx(Badge, { className: "bg-white/10 text-slate-200", children: customer.industry }),
                  /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-500/20 text-emerald-200", children: customer.tier })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "secondary",
                  icon: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }),
                  onClick: () => setEditOpen(true),
                  children: "Edit profile"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Lifetime value" }),
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold text-white", children: formatCurrency(customer.lifetimeValue) }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-slate-400", children: [
                  "Account owner: ",
                  owner?.name
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 lg:col-span-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Contact information" }),
        /* @__PURE__ */ jsxs("ul", { className: "mt-4 space-y-3 text-sm text-slate-300", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-emerald-300" }),
            customer.email
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-emerald-300" }),
            customer.phone
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-emerald-300" }),
            customer.location
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Interaction history" }),
        activities.length === 0 ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-slate-400", children: "No activities logged yet." }) : /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: activities.map((activity) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "rounded-xl border border-white/5 bg-white/[0.03] p-4",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-slate-100", children: activity.subject }),
                /* @__PURE__ */ jsx("span", { className: "text-xs capitalize text-slate-500", children: activity.type.replace("_", " ") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-400", children: activity.description }),
              /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-slate-500", children: [
                formatRelativeDate(activity.scheduledAt),
                " \xB7",
                " ",
                activity.completed ? "Completed" : "Scheduled"
              ] })
            ]
          },
          activity.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      CustomerFormModal,
      {
        open: editOpen,
        title: "Edit customer",
        initial: formInitial,
        loading: submitting,
        onClose: () => setEditOpen(false),
        onSubmit: async (values) => {
          setSubmitting(true);
          dispatch(setCustomersLoading(true));
          await new Promise((r) => setTimeout(r, 350));
          dispatch(updateCustomer({ ...customer, ...values }));
          setSubmitting(false);
          dispatch(setCustomersLoading(false));
          setEditOpen(false);
        }
      },
      customer.id
    )
  ] });
}
export {
  CustomerDetailPage
};
