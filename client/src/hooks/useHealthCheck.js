import { useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

const HEALTH_ENDPOINT = "/health";
const RETRY_INTERVAL = 10000;
const MAX_RETRIES = 10;

export function useHealthCheck() {
  const toastId = useRef(null);
  const retryCount = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      try {
        const { data } = await api.get(HEALTH_ENDPOINT, { timeout: 30000 });

        if (cancelled) return;

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

        showConnecting();
        scheduleRetry();
      } catch {
        if (cancelled) return;
        showConnecting();
        scheduleRetry();
      }
    };

    const showConnecting = () => {
      if (!toastId.current) {
        toastId.current = toast.loading("Connecting to server...", {
          description:
            "Our server is waking up — this may take a few seconds.",
          duration: Infinity,
        });
      } else {
        const attempt = retryCount.current;
        toast.loading("Connecting to server...", {
          id: toastId.current,
          description:
            attempt >= 3
              ? `Still waking up the server... (attempt ${attempt}/${MAX_RETRIES})`
              : "Our server is waking up — this may take a few seconds.",
          duration: Infinity,
        });
      }
    };

    const scheduleRetry = () => {
      retryCount.current += 1;

      if (retryCount.current >= MAX_RETRIES) {
        toast.error("Could not connect to server", {
          id: toastId.current,
          description:
            "Please try refreshing the page or check back later.",
          duration: 5000,
        });
        toastId.current = null;
        return;
      }

      timerRef.current = setTimeout(checkHealth, RETRY_INTERVAL);
    };

    checkHealth();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    };
  }, []);
}
