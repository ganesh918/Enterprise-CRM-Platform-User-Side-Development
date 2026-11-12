import { jsx, jsxs } from "react/jsx-runtime";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/FormField";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { issueResetToken, readOtpSession, verifyOtp } from "../lib/passwordReset";
function OtpVerificationPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? readOtpSession()?.email ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  if (!email) return /* @__PURE__ */ jsx(Navigate, { to: "/forgot-password", replace: true });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    if (!verifyOtp(email, code)) {
      setLoading(false);
      setError("Invalid or expired code. Request a new one.");
      return;
    }
    const token = issueResetToken(email);
    setLoading(false);
    navigate(`/reset-password?token=${encodeURIComponent(token)}`);
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Verify OTP",
      subtitle: `Enter the code sent to ${email}.`,
      footer: /* @__PURE__ */ jsx(Link, { to: "/forgot-password", className: "font-medium text-emerald-300 hover:text-emerald-200", children: "Request a new code" }),
      children: [
        error && /* @__PURE__ */ jsx(Alert, { variant: "error", className: "mb-4", children: error }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit, children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "6-digit code",
              inputMode: "numeric",
              maxLength: 6,
              value: code,
              onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
              placeholder: "000000",
              autoComplete: "one-time-code"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              loading,
              className: "w-full",
              icon: /* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4" }),
              children: "Verify and continue"
            }
          )
        ] })
      ]
    }
  );
}
export {
  OtpVerificationPage
};
