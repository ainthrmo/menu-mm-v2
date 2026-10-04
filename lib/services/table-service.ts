import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type RestaurantTable = Database["public"]["Tables"]["restaurant_tables"]["Row"];
export type RestaurantTableInsert = Database["public"]["Tables"]["restaurant_tables"]["Insert"];
export type RestaurantTableUpdate = Database["public"]["Tables"]["restaurant_tables"]["Update"];

export type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];
export type ServiceRequestInsert = Database["public"]["Tables"]["service_requests"]["Insert"];
export type ServiceRequestUpdate = Database["public"]["Tables"]["service_requests"]["Update"];

export type CreateTableInput = {
  restaurantId: string;
  tableNumber: string;
  label?: string | null;
  qrToken?: string | null;
  isActive?: boolean;
};

export type UpdateTableInput = {
  tableNumber?: string;
  label?: string | null;
  qrToken?: string | null;
  isActive?: boolean;
};

export type CreateServiceRequestInput = {
  restaurantId: string;
  tableId: string;
  requestType: "call_waiter" | "request_bill";
  notes?: string | null;
};

/**
 * Validates that current caller has owner/manager write access to the given restaurant.
 * Reuses the database assert_restaurant_write_access RPC.
 */
export async function assertRestaurantAccess(
  supabase: SupabaseClient<Database>,
  restaurantId: string,
): Promise<string> {
  const { data: orgId, error } = await supabase.rpc(
    "assert_restaurant_write_access",
    { p_restaurant_id: restaurantId },
  );

  if (error || !orgId) {
    throw new Error(error?.message || "Access denied for restaurant.");
  }

  return orgId;
}

/**
 * List all tables for a given restaurant.
 * If requireActiveOnly is true, only returns active tables (safe for public/customer menu).
 * If caller is authenticated owner/manager, they can see all tables including inactive.
 */
export async function listRestaurantTables(
  supabase: SupabaseClient<Database>,
  restaurantId: string,
  options?: { requireActiveOnly?: boolean },
): Promise<RestaurantTable[]> {
  if (!restaurantId?.trim()) {
    throw new Error("Restaurant ID is required.");
  }

  let query = supabase
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("table_number", { ascending: true });

  if (options?.requireActiveOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Creates a new restaurant table.
 * Validates restaurant ownership/write access server-side.
 */
export async function createRestaurantTable(
  supabase: SupabaseClient<Database>,
  input: CreateTableInput,
): Promise<RestaurantTable> {
  const restaurantId = input.restaurantId?.trim();
  const tableNumber = input.tableNumber?.trim();

  if (!restaurantId) throw new Error("Restaurant ID is required.");
  if (!tableNumber) throw new Error("Table number is required.");

  // Verify write access to restaurant
  await assertRestaurantAccess(supabase, restaurantId);

  const { data, error } = await supabase
    .from("restaurant_tables")
    .insert({
      restaurant_id: restaurantId,
      table_number: tableNumber,
      label: input.label?.trim() || null,
      qr_token: input.qrToken?.trim() || null,
      is_active: input.isActive ?? true,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(`Table number "${tableNumber}" already exists for this restaurant.`);
    }
    throw error;
  }

  return data;
}

/**
 * Updates an existing table.
 * Validates restaurant ownership/write access server-side.
 */
export async function updateRestaurantTable(
  supabase: SupabaseClient<Database>,
  tableId: string,
  restaurantId: string,
  input: UpdateTableInput,
): Promise<RestaurantTable> {
  if (!tableId?.trim()) throw new Error("Table ID is required.");
  if (!restaurantId?.trim()) throw new Error("Restaurant ID is required.");

  // Verify write access
  await assertRestaurantAccess(supabase, restaurantId);

  const updates: RestaurantTableUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (input.tableNumber !== undefined) {
    const trimmedNumber = input.tableNumber.trim();
    if (!trimmedNumber) throw new Error("Table number cannot be empty.");
    updates.table_number = trimmedNumber;
  }

  if (input.label !== undefined) {
    updates.label = input.label?.trim() || null;
  }

  if (input.qrToken !== undefined) {
    updates.qr_token = input.qrToken?.trim() || null;
  }

  if (input.isActive !== undefined) {
    updates.is_active = input.isActive;
  }

  const { data, error } = await supabase
    .from("restaurant_tables")
    .update(updates)
    .eq("id", tableId)
    .eq("restaurant_id", restaurantId)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(`A table with this number or QR token already exists.`);
    }
    throw error;
  }

  return data;
}

/**
 * Enable or disable a restaurant table.
 * Convenient wrapper for toggling is_active with server-side auth verification.
 */
export async function toggleTableStatus(
  supabase: SupabaseClient<Database>,
  tableId: string,
  restaurantId: string,
  isActive: boolean,
): Promise<RestaurantTable> {
  return updateRestaurantTable(supabase, tableId, restaurantId, { isActive });
}

/**
 * Resolves a table by its unique table ID within a specific restaurant.
 * Returns null if not found.
 */
export async function resolveTableById(
  supabase: SupabaseClient<Database>,
  tableId: string,
  restaurantId?: string,
): Promise<RestaurantTable | null> {
  if (!tableId?.trim()) return null;

  let query = supabase
    .from("restaurant_tables")
    .select("*")
    .eq("id", tableId);

  if (restaurantId?.trim()) {
    query = query.eq("restaurant_id", restaurantId.trim());
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Resolves an active table by its qr_token (or table_number fallback) for customer menu context.
 */
export async function resolveTableByToken(
  supabase: SupabaseClient<Database>,
  restaurantId: string,
  tokenOrIdentifier: string,
): Promise<RestaurantTable | null> {
  const cleanRestaurantId = restaurantId?.trim();
  const cleanToken = tokenOrIdentifier?.trim();

  if (!cleanRestaurantId || !cleanToken) return null;

  // 1. Try matching by qr_token first
  const { data: byToken, error: tokenErr } = await supabase
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", cleanRestaurantId)
    .eq("qr_token", cleanToken)
    .maybeSingle();

  if (tokenErr) throw tokenErr;
  if (byToken) return byToken;

  // 2. Fallback: try matching by table_number
  const { data: byNumber, error: numberErr } = await supabase
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", cleanRestaurantId)
    .eq("table_number", cleanToken)
    .maybeSingle();

  if (numberErr) throw numberErr;
  return byNumber;
}

/**
 * Validates that table belongs to restaurant and is active.
 * Uses the security definer RPC validate_table_belongs_to_restaurant.
 */
export async function validateTableBelongsToRestaurant(
  supabase: SupabaseClient<Database>,
  restaurantId: string,
  tableId: string,
): Promise<boolean> {
  if (!restaurantId?.trim() || !tableId?.trim()) return false;

  const { data, error } = await supabase.rpc(
    "validate_table_belongs_to_restaurant",
    {
      p_restaurant_id: restaurantId.trim(),
      p_table_id: tableId.trim(),
    },
  );

  if (error) {
    console.error("Error validating table relationship:", error);
    return false;
  }

  return Boolean(data);
}

/**
 * Creates a service request (e.g. call waiter, request bill) with duplicate-pending prevention.
 * Validates the table-restaurant relationship before insertion.
 * Handles the PostgreSQL partial unique index conflict (code 23505) gracefully.
 */
export async function createServiceRequest(
  supabase: SupabaseClient<Database>,
  input: CreateServiceRequestInput,
): Promise<ServiceRequest> {
  const restaurantId = input.restaurantId?.trim();
  const tableId = input.tableId?.trim();
  const requestType = input.requestType;

  if (!restaurantId) throw new Error("Restaurant ID is required.");
  if (!tableId) throw new Error("Table ID is required.");
  if (!["call_waiter", "request_bill"].includes(requestType)) {
    throw new Error("Invalid request type.");
  }

  // Server-side validation of table <-> restaurant relationship & active status
  const isValid = await validateTableBelongsToRestaurant(supabase, restaurantId, tableId);
  if (!isValid) {
    throw new Error("Table not found, inactive, or does not belong to this restaurant.");
  }

  const { data, error } = await supabase.rpc("create_service_request", {
    p_restaurant_id: restaurantId,
    p_table_id: tableId,
    p_request_type: requestType,
    p_notes: input.notes?.trim() || null,
  });

  if (error) {
    // 23505: unique violation (handled duplicate pending request for this table and type)
    if (error.code === "23505") {
      throw new Error(
        `A pending ${requestType === "call_waiter" ? "waiter call" : "bill request"} already exists for this table.`,
      );
    }
    throw error;
  }

  return data;
}

/**
 * List service requests for a restaurant (for admin/staff dashboard).
 * Authenticated owner/manager access only.
 */
export async function listServiceRequests(
  supabase: SupabaseClient<Database>,
  restaurantId: string,
  options?: { status?: "pending" | "completed" | "cancelled" },
): Promise<ServiceRequest[]> {
  if (!restaurantId?.trim()) {
    throw new Error("Restaurant ID is required.");
  }

  // Guard anonymous users – they cannot read service_requests
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  let query = supabase
    .from("service_requests")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Updates status of a service request (e.g. pending -> completed / cancelled).
 * Requires owner/manager write access.
 */
export async function updateServiceRequestStatus(
  supabase: SupabaseClient<Database>,
  requestId: string,
  restaurantId: string,
  status: "completed" | "cancelled" | "pending",
): Promise<ServiceRequest> {
  if (!requestId?.trim()) throw new Error("Request ID is required.");
  if (!restaurantId?.trim()) throw new Error("Restaurant ID is required.");

  await assertRestaurantAccess(supabase, restaurantId);

  const { data, error } = await supabase
    .from("service_requests")
    .update({ status })
    .eq("id", requestId)
    .eq("restaurant_id", restaurantId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
