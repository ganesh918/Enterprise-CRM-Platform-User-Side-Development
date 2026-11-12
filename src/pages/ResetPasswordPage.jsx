import { jsx, jsxs } from "react/jsx-runtime";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { PasswordInput } from "../components/ui/PasswordInput";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { updateUserPassword } from "../lib/authUsers";
import { clearResetToken, validateResetToken } from "../lib/passwordReset";
function ResetPasswordPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";
  const email = validateResetToken(token);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  if (!email) return /* @__PURE__ */ jsx(Navigate, { to: "/forgot-password", replace: true });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = updateUserPassword(email, password);
    if (!result.ok) {
      setLoading(false);
      setError("message" in result ? result.message : "Unable to reset password.");
      return;
    }
    clearResetToken();
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Reset password",
      subtitle: "Choose a strong password for your account.",
      footer: /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-medium text-emerald-300 hover:text-emerald-200", children: "Back to sign in" }),
      children: [
        success && /* @__PURE__ */ jsx(Alert, { variant: "success", className: "mb-4", children: "Password updated. Redirecting to sign in\u2026" }),
        error && /* @__PURE__ */ jsx(Alert, { variant: "error", className: "mb-4", children: error }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit, children: [
          /* @__PURE__ */ jsx(PasswordInput, { label: "New password", value: password, onChange: setPassword }),
          /* @__PURE__ */ jsx(PasswordInput, { label: "Confirm password", value: confirm, onChange: setConfirm }),
          /* @__PURE__ */ jsx(Button, { type: "submit", loading, className: "w-full", icon: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), children: "Update password" })
        ] })
      ]
    }
  );
}
export {
  ResetPasswordPage
};
