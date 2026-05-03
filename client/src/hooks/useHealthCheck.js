import { useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

const HEALTH_ENDPOINT = "/health";
const MAX_RETRIES = 5;
const BASE_RETRY_MS = 1000;
const MAX_RETRY_MS = 30000;
const SHOW_ATTEMPT_AFTER = 2;

const getRetryDelay = (attempt) =>
  Math.min(BASE_RETRY_MS * Math.pow(2, attempt), MAX_RETRY_MS);

export function useHealthCheck() {
  const toastId = useRef(null);
  const retryCount = useRef(0);
  const timerRef = useRef(null);
  const initialToastTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    initialToastTimer.current = setTimeout(() => {
      if (!toastId.current) {
        toastId.current = toast.loading("Connecting to server...", {
          description:
            "Our server is waking up — this may take a few seconds.",
          duration: Infinity,
        });
      }
    }, 500);

    const checkHealth = async () => {
      try {
        const { data } = await api.get(HEALTH_ENDPOINT, { timeout: 5000 });
        if (cancelled) return;

        clearTimeout(initialToastTimer.current);

        if (data.success && data.database?.connected) {
          if (toastId.current) {
            toast.success("Server connected", {
              id: toastId.current,
              description: "Backend is ready — you're all set!",
              duration: 3000,
            });
            toastId.current = null;
          }
          retryCount.current = 0;
          return;
        }

        scheduleRetry();
      } catch {
        if (cancelled) return;
        scheduleRetry();
      }
    };

    const scheduleRetry = () => {
      retryCount.current += 1;

      if (retryCount.current >= MAX_RETRIES) {
        clearTimeout(initialToastTimer.current);

        toast.error("Could not connect to server", {
          id: toastId.current,
          description:
            "Please try refreshing the page or check back later.",
          duration: Infinity,
        });
        toastId.current = null;
        return;
      }

      const delay = getRetryDelay(retryCount.current);
      const delayLabel =
        delay >= 1000 ? `${delay / 1000}s` : `${delay}ms`;

      if (retryCount.current >= SHOW_ATTEMPT_AFTER) {
        if (!toastId.current) {
          toastId.current = toast.loading("Still connecting...", {
            description: `Attempt ${retryCount.current} of ${MAX_RETRIES} — retrying in ${delayLabel}.`,
            duration: Infinity,
          });
        } else {
          toast.loading("Still connecting...", {
            id: toastId.current,
            description: `Attempt ${retryCount.current} of ${MAX_RETRIES} — retrying in ${delayLabel}.`,
            duration: Infinity,
          });
        }
      }

      timerRef.current = setTimeout(checkHealth, delay);
    };

    checkHealth();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (initialToastTimer.current)
        clearTimeout(initialToastTimer.current);
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    };
  }, []);
}