"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { RestaurantTable } from "@/lib/services/table-service";
import { resolveTableByToken } from "@/lib/services/table-service";
import { createClient } from "@/lib/supabase/client";

interface TableContextType {
  activeTable: RestaurantTable | null;
  tableToken: string | null;
  isValidatingTable: boolean;
  tableError: string | null;
  restaurantId: string | null;
  setRestaurantId: (id: string | null) => void;
  buildTableAwareUrl: (path: string, extraParams?: Record<string, string>) => string;
}

const TableContext = createContext<TableContextType>({
  activeTable: null,
  tableToken: null,
  isValidatingTable: false,
  tableError: null,
  restaurantId: null,
  setRestaurantId: () => {},
  buildTableAwareUrl: (path) => path,
});

export const TableProvider: React.FC<{
  children: React.ReactNode;
  initialRestaurantId?: string | null;
}> = ({ children, initialRestaurantId = null }) => {
  const [restaurantId, setRestaurantId] = useState<string | null>(initialRestaurantId);
  const [tableToken, setTableToken] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<RestaurantTable | null>(null);
  const [isValidatingTable, setIsValidatingTable] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);

  // Parse table parameter from window.location.search
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const restParam = params.get("restaurantId");
      if (restParam) {
        setRestaurantId(restParam);
      }
      const rawTable = params.get("table") || params.get("table_number") || params.get("tableId");
      if (rawTable && rawTable.trim()) {
        setTableToken(rawTable.trim());
      }
    }
  }, []);

  // When both restaurantId and tableToken are present, resolve and validate via table-service
  useEffect(() => {
    let isMounted = true;

    async function validateTable() {
      if (!restaurantId || !tableToken || restaurantId === "demo") {
        setActiveTable(null);
        setTableError(null);
        return;
      }

      setIsValidatingTable(true);
      setTableError(null);

      try {
        const supabase = createClient();
        const table = await resolveTableByToken(supabase, restaurantId, tableToken);

        if (!isMounted) return;

        if (!table) {
          setActiveTable(null);
          setTableError("Table not found for this restaurant.");
        } else if (!table.is_active) {
          setActiveTable(null);
          setTableError(`Table ${table.table_number} is currently closed.`);
        } else {
          setActiveTable(table);
          setTableError(null);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error validating table in TableProvider:", err);
        setActiveTable(null);
        setTableError("Unable to verify table at this time.");
      } finally {
        if (isMounted) {
          setIsValidatingTable(false);
        }
      }
    }

    validateTable();

    return () => {
      isMounted = false;
    };
  }, [restaurantId, tableToken]);

  /**
   * Helper that takes any relative URL path and attaches restaurantId + table token
   * preserving full customer context across category links, search, etc.
   */
  const buildTableAwareUrl = (
    path: string,
    extraParams?: Record<string, string>,
  ): string => {
    const urlParts = path.split("?");
    const basePath = urlParts[0];
    const searchParams = new URLSearchParams(urlParts[1] || "");

    if (restaurantId && restaurantId !== "demo") {
      searchParams.set("restaurantId", restaurantId);
    } else if (restaurantId === "demo") {
      searchParams.set("demo", "true");
    }

    // Preserve table token if active
    const tokenToPreserve = activeTable?.qr_token || activeTable?.table_number || tableToken;
    if (tokenToPreserve && restaurantId !== "demo") {
      searchParams.set("table", tokenToPreserve);
    }

    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => {
        searchParams.set(k, v);
      });
    }

    const queryString = searchParams.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <TableContext.Provider
      value={{
        activeTable,
        tableToken,
        isValidatingTable,
        tableError,
        restaurantId,
        setRestaurantId,
        buildTableAwareUrl,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => useContext(TableContext);
