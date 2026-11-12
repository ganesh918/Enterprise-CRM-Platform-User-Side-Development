import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { teamMembers } from "../../data/seed";
import { Button } from "../ui/Button";
import { InputField, SelectField } from "../ui/FormField";
import { Modal } from "../ui/Modal";
const emptyCustomerForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  location: "",
  tier: "standard",
  ownerId: teamMembers[0].id,
  lifetimeValue: 0,
  tags: []
};
function validateCustomer(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Contact name is required";
  if (!form.company.trim()) errors.company = "Company is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Valid email is required";
  if (form.lifetimeValue < 0) errors.lifetimeValue = "LTV must be zero or greater";
  return errors;
}
function CustomerFormModal({
  open,
  title,
  initial,
  loading,
  onClose,
  onSubmit
}) {
  const [form, setForm] = useState(initial);
  const [tagsInput, setTagsInput] = useState(initial.tags.join(", "));
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (open) {
      setForm(initial);
      setTagsInput(initial.tags.join(", "));
      setErrors({});
    }
  }, [open, initial]);
  const resetAndClose = () => {
    setForm(initial);
    setTagsInput(initial.tags.join(", "));
    setErrors({});
    onClose();
  };
  return /* @__PURE__ */ jsx(Modal, { open, onClose: resetAndClose, title, children: /* @__PURE__ */ jsxs(
    "form",
    {
      className: "space-y-4",
      onSubmit: (e) => {
        e.preventDefault();
        const payload = {
          ...form,
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        };
        const nextErrors = validateCustomer(payload);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        onSubmit(payload);
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Contact name",
              value: form.name,
              onChange: (e) => setForm({ ...form, name: e.target.value }),
              error: errors.name
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Company",
              value: form.company,
              onChange: (e) => setForm({ ...form, company: e.target.value }),
              error: errors.company
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Email",
              type: "email",
              value: form.email,
              onChange: (e) => setForm({ ...form, email: e.target.value }),
              error: errors.email
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Phone",
              value: form.phone,
              onChange: (e) => setForm({ ...form, phone: e.target.value })
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Industry",
              value: form.industry,
              onChange: (e) => setForm({ ...form, industry: e.target.value })
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Location",
              value: form.location,
              onChange: (e) => setForm({ ...form, location: e.target.value })
            }
          ),
          /* @__PURE__ */ jsxs(
            SelectField,
            {
              label: "Tier",
              value: form.tier,
              onChange: (e) => setForm({ ...form, tier: e.target.value }),
              children: [
                /* @__PURE__ */ jsx("option", { value: "standard", children: "Standard" }),
                /* @__PURE__ */ jsx("option", { value: "premium", children: "Premium" }),
                /* @__PURE__ */ jsx("option", { value: "enterprise", children: "Enterprise" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Lifetime value",
              type: "number",
              value: form.lifetimeValue,
              onChange: (e) => setForm({ ...form, lifetimeValue: Number(e.target.value) }),
              error: errors.lifetimeValue
            }
          ),
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
              label: "Tags (comma separated)",
              value: tagsInput,
              onChange: (e) => setTagsInput(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: resetAndClose, children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", loading, children: "Save customer" })
        ] })
      ]
    }
  ) });
}
export {
  CustomerFormModal,
  emptyCustomerForm,
  validateCustomer
};
