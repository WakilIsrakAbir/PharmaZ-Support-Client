import { useEffect, useSyncExternalStore } from "react";
import { api } from "@/lib/api";

// One shared copy of the product's setup (problem areas, statuses, priorities and extra
// fields). It is loaded once and shared by every form, filter and badge. The Settings
// pages put the saved version back with setProductSetup, so the rest of the app updates.
let state = { setup: null, error: "" };
let request = null;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

export function setProductSetup(setup) {
  update({ setup, error: "" });
}

function loadProductSetup() {
  request ??= api("/product/setup")
    .then(({ data }) => setProductSetup(data))
    .catch((error) => {
      request = null;
      update({ error: error.message });
    });
}

/** Loads it again, e.g. after the super admin opens another product. */
export function reloadProductSetup() {
  request = null;
  loadProductSetup();
}

/** `{ setup, error }`. `setup` is null while it's still loading. */
export function useProductSetup() {
  useEffect(() => {
    loadProductSetup();
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

/**
 * Saves part of the setup (e.g. saveProductSetup("/statuses", { body })) and shares the
 * new version with the whole app. Throws the ApiError if the server refuses it.
 */
export async function saveProductSetup(path, { method = "PUT", body }) {
  const { data } = await api(`/product${path}`, { method, body });
  setProductSetup(data);
  return data;
}
