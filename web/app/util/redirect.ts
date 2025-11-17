"use server";

import { redirect, RedirectType } from "next/navigation";

export async function serverRedirect(
  url: string,
  type: RedirectType
) {
  // Perform any auth / logic before redirect if needed
  redirect(url, type);
}
