"use client";

import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const logout = async () => {
    await signOutAction();
  };

  return <Button onClick={logout}>Logout</Button>;
}

