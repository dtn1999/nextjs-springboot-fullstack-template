import { SessionUser } from "@/server/types/domain";
import { AccountRole } from "../generated/app.backend.api";

export enum ModalType {
  LOGIN_OR_REGISTRATION = "login_or_registration",
  REGISTRATION_COMPLETION = "registration_completion",
}

export enum OAuthProvider {
  GOOGLE = "google",
  FACEBOOK = "facebook",
}

export const MODAL_TYPE_PARAM = "modal_type";
export const MODAL_PROVIDER_PARAM = "provider";

export function isHost(user?: SessionUser) {
  return (
    user &&
    (hasRole(user, AccountRole.HOST) || hasRole(user, AccountRole.ADMIN))
  );
}

export function isAdmin(user?: SessionUser) {
  return user && hasRole(user, AccountRole.ADMIN);
}

export function hasRole(user: SessionUser, role?: AccountRole) {
  if (!user || !role) {
    console.warn("Trying to check role for an undefined user or role");
    return false;
  }

  switch (role) {
    case AccountRole.GUEST:
      // Per definition, all authenticated users are guests
      // Thus, if the role is properly set, we can return true
      return Boolean(user.role);
    case AccountRole.HOST:
      // Admin is a superuser, so can be everything
      return user.role === AccountRole.HOST || user.role === AccountRole.ADMIN;
    case AccountRole.ADMIN:
      return user.role === AccountRole.ADMIN;
    default:
      console.warn("Trying to check role for an undefined user or role", role);
      return false;
  }
}
