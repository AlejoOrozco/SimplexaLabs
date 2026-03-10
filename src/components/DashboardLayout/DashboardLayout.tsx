import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { useIsMobile } from "../../hooks/useMediaQuery";
import "./DashboardLayout.css";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div
      className={`dashboard-layout ${isMobile ? "dashboard-layout--mobile" : ""} ${isMobile && sidebarExpanded ? "dashboard-layout--sidebar-open" : ""}`}
    >
      <Sidebar
        isMobile={isMobile}
        expanded={!isMobile || sidebarExpanded}
        onExpand={() => setSidebarExpanded(true)}
        onCollapse={() => setSidebarExpanded(false)}
      />
      <main className="dashboard-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
