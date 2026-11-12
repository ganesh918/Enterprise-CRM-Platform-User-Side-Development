import { useMemo } from "react";
import { NAV_ITEMS } from "../constants/crm";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSlice";
import { canAccessModule } from "../lib/permissions";
function useNavItems() {
  const user = useAppSelector(selectAuthUser);
  return useMemo(
    () => NAV_ITEMS.filter(
      (item) => canAccessModule(user?.userRole ?? user?.role, item.module)
    ),
    [user?.role, user?.userRole]
  );
}
export {
  useNavItems
};
