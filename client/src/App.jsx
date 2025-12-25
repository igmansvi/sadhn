import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LoadingState from "@/components/shared/LoadingState";
import { routes } from "@/routes";
import { SocketProvider } from "@/context/SocketContext";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/store/slices/authSlice";

const renderRoutes = (routeConfig) => {
  return routeConfig.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} element={route.element} path={route.path}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return (
      <Route
        key={index}
        path={route.path}
        element={route.element}
      />
    );
  });
};

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <SocketProvider>
        <Suspense fallback={<LoadingState fullScreen />}>
          <Routes>{renderRoutes(routes)}</Routes>
        </Suspense>
        <Toaster position="top-right" richColors closeButton />
      </SocketProvider>
    </BrowserRouter>
  );
}