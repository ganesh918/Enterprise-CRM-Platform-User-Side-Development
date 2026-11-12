import { jsx, jsxs } from "react/jsx-runtime";
import { Bell, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { selectCurrentTeamMemberId } from "../features/auth/authSlice";
import {
  markAllRead,
  markRead,
  selectAllNotifications
} from "../features/notifications/notificationsSlice";
import { formatRelativeDate } from "../lib/utils";
import { cn } from "../lib/utils";
const kindLabels = {
  lead_assignment: "Lead",
  task_reminder: "Task",
  meeting: "Meeting",
  update: "Update"
};
function NotificationsPage() {
  const dispatch = useAppDispatch();
  const teamMemberId = useAppSelector(selectCurrentTeamMemberId);
  const all = useAppSelector(selectAllNotifications);
  const items = teamMemberId ? all.filter((n) => n.recipientId === teamMemberId) : all;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Notifications",
        description: "Lead assignments, task reminders, meetings, and important updates.",
        actions: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "secondary",
            icon: /* @__PURE__ */ jsx(CheckCheck, { className: "h-4 w-4" }),
            onClick: () => dispatch(markAllRead(teamMemberId)),
            children: "Mark all read"
          }
        )
      }
    ),
    items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "glass-panel flex flex-col items-center rounded-2xl py-16 text-center", children: [
      /* @__PURE__ */ jsx(Bell, { className: "h-10 w-10 text-slate-500" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-slate-400", children: "You're all caught up." })
    ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: items.map((n) => /* @__PURE__ */ jsx(
      "li",
      {
        className: cn(
          "glass-panel rounded-2xl border p-4 transition",
          n.read ? "border-white/5 opacity-80" : "border-emerald-400/20"
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { className: "bg-white/10 text-slate-200", children: kindLabels[n.kind] }),
              !n.read && /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400", "aria-hidden": true })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium text-white", children: n.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-400", children: n.message }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500", children: formatRelativeDate(n.createdAt) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            n.link && /* @__PURE__ */ jsx(
              Link,
              {
                to: n.link,
                className: "text-xs font-medium text-emerald-300 hover:text-emerald-200",
                onClick: () => dispatch(markRead(n.id)),
                children: "Open"
              }
            ),
            !n.read && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "text-xs text-slate-400 hover:text-white",
                onClick: () => dispatch(markRead(n.id)),
                children: "Mark read"
              }
            )
          ] })
        ] })
      },
      n.id
    )) })
  ] });
}
export {
  NotificationsPage
};
