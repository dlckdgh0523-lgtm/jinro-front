import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { appGetWithMeta, appPatch, buildSseStreamUrl } from "../utils/appApi";

export interface NotificationItem {
  id: string;
  type: "danger" | "warning" | "info" | "success";
  category: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  popups: NotificationItem[];
  dismiss: (id: string) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
  error: string;
  role: "student" | "teacher";
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  popups: [],
  dismiss: () => {},
  markRead: async () => {},
  markAllRead: async () => {},
  refresh: async () => {},
  isLoading: false,
  error: "",
  role: "student"
});

interface NotificationProviderProps {
  children: React.ReactNode;
  role?: "student" | "teacher";
}

type NotificationListResponse = NotificationItem[];

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "알림을 불러오지 못했습니다.";

const STREAM_EVENTS = [
  "notification.created",
  "notification.updated",
  "notification.bulk-read",
  "counseling.request.created",
  "counseling.request.updated",
  "counseling.memo.created"
] as const;

export function NotificationProvider({ children, role = "student" }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [popups, setPopups] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const knownIdsRef = useRef<Set<string>>(new Set());
  const eventSourceRef = useRef<EventSource | null>(null);

  const dismiss = useCallback((id: string) => {
    setPopups((prev) => prev.filter((popup) => popup.id !== id));
  }, []);

  const refresh = useCallback(
    async (showNewPopups = false) => {
      setError("");

      try {
        const result = await appGetWithMeta<NotificationListResponse>(
          "/v1/notifications?page=1&pageSize=20&tab=all"
        );

        setNotifications(result.data);

        const currentIds = new Set(result.data.map((item) => item.id));
        const previousIds = knownIdsRef.current;

        if (showNewPopups) {
          const nextPopups = result.data.filter((item) => !item.read && !previousIds.has(item.id));

          if (nextPopups.length > 0) {
            setPopups((prev) => {
              const existing = new Set(prev.map((item) => item.id));
              return [...prev, ...nextPopups.filter((item) => !existing.has(item.id))];
            });
          }
        }

        knownIdsRef.current = currentIds;
      } catch (requestError) {
        setError(normalizeError(requestError));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const markRead = useCallback(async (id: string) => {
    try {
      const updated = await appPatch<NotificationItem>(`/v1/notifications/${id}/read`);
      setNotifications((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setPopups((prev) => prev.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(normalizeError(requestError));
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await appPatch<{ updated: true }>("/v1/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      setPopups([]);
    } catch (requestError) {
      setError(normalizeError(requestError));
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    void refresh(false);
  }, [refresh]);

  useEffect(() => {
    const streamUrl = buildSseStreamUrl();

    if (!streamUrl || typeof EventSource === "undefined") {
      return;
    }

    const eventSource = new EventSource(streamUrl);
    eventSourceRef.current = eventSource;

    const handleRefresh = () => {
      void refresh(true);
    };

    STREAM_EVENTS.forEach((eventName) => {
      eventSource.addEventListener(eventName, handleRefresh as EventListener);
    });

    eventSource.onerror = () => {
      setError((prev) => prev || "실시간 알림 연결이 일시적으로 끊어졌습니다.");
    };

    return () => {
      STREAM_EVENTS.forEach((eventName) => {
        eventSource.removeEventListener(eventName, handleRefresh as EventListener);
      });

      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      notifications,
      popups,
      dismiss,
      markRead,
      markAllRead,
      refresh: () => refresh(false),
      isLoading,
      error,
      role
    }),
    [dismiss, error, isLoading, markAllRead, markRead, notifications, popups, refresh, role]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
  return useContext(NotificationContext);
}
