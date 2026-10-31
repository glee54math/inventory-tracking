import { useState, useRef, useEffect } from "react";
import { useNameContext } from "./NameContext";
import { useNavigate } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  Users,
  Clock,
  ScanLine,
  PencilLine,
  Layers,
  Presentation,
  LayoutDashboard,
  UserRound,
  FlaskConical,
  IdCard,
  GraduationCap,
  UsersRound,
  Coins,
  Gift,
  ListChecks,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";

interface SideBarProps {
  showInventory: boolean;
  toggleInventory: () => void;
  showStudentDatabase: boolean;
  toggleStudentDatabase: () => void;
  showTimesheet: boolean;
  toggleTimesheet: () => void;
  showScanStation: boolean;
  toggleScanStation: () => void;
  showDataEntry: boolean;
  toggleDataEntry: () => void;
  showActions: boolean;
  toggleActions: () => void;
}

// ─── Shared row components ──────────────────────────────────────────────────

// A single-line label that clips at rest and, on hover, slides left to reveal
// any text cut off by the sidebar's width — then snaps back and loops for as
// long as the pointer stays over it. Overflow is measured lazily on first
// hover (not on mount) so it stays correct across the collapse/expand width
// change without needing a resize observer.
interface MarqueeLabelProps {
  text: string;
  className?: string;
}

function MarqueeLabel({ text, className = "min-w-0 flex-1" }: MarqueeLabelProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [shift, setShift] = useState(0);

  const handleMouseEnter = () => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    const overflow = textEl.scrollWidth - container.clientWidth;
    setShift(overflow > 2 ? overflow + 6 : 0);
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`overflow-hidden whitespace-nowrap text-left ${className}`}
    >
      <span
        ref={textRef}
        style={shift > 0 ? ({ "--marquee-shift": `${-shift}px` } as React.CSSProperties) : undefined}
        className={`inline-block ${shift > 0 ? "marquee-hover" : ""}`}
      >
        {text}
      </span>
    </span>
  );
}

// Two accent tracks: "primary" (blue) for everyday Workspace/Operations items,
// "tertiary" (purple) for the Admin section — mirrors how the lab pages use
// --qc (purple) for gated/special content, so Admin visually reads as a
// distinct, elevated area rather than just more blue rows.
type Accent = "primary" | "tertiary";

// Full literal class strings (not template-interpolated) so Tailwind's
// content scanner can statically find them.
const ACCENT_ACTIVE: Record<Accent, string> = {
  primary: "bg-primary-100 text-primary-700",
  tertiary: "bg-tertiary-100 text-tertiary-700",
};
const ACCENT_HOVER: Record<Accent, string> = {
  primary: "hover:bg-primary-50",
  tertiary: "hover:bg-tertiary-50",
};
const ACCENT_ICON: Record<Accent, string> = {
  primary: "text-primary-400",
  tertiary: "text-tertiary-400",
};

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick: () => void;
  id?: string;
  accent?: Accent;
}

function NavItem({ icon: Icon, label, collapsed, active, onClick, id, accent = "primary" }: NavItemProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={label}
      className={`flex w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? `${ACCENT_ACTIVE[accent]} font-medium`
          : `text-gray-700 ${ACCENT_HOVER[accent]}`
      }`}
    >
      <Icon size={18} className={`shrink-0 ${active ? "" : ACCENT_ICON[accent]}`} />
      {!collapsed && <MarqueeLabel text={label} />}
    </button>
  );
}

function SectionLabel({ children, collapsed }: { children: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-1.5 border-t border-gray-200" />;
  return (
    <p className="mt-2.5 mb-0.5 px-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </p>
  );
}

export default function Sidebar({
  showInventory,
  toggleInventory,
  showStudentDatabase,
  toggleStudentDatabase,
  showTimesheet,
  toggleTimesheet,
  showScanStation,
  toggleScanStation,
  showDataEntry,
  toggleDataEntry,
  showActions,
  toggleActions,
}: SideBarProps) {
  const { nameOfWorker } = useNameContext();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isProfileButtonPressed, setIsProfileButtonPressed] = useState<boolean>(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const levelsDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isLevelsButtonPressed, setIsLevelsButtonPressed] = useState<boolean>(false);
  const [levelsArray] = useState<string[]>([
    "MK1", "MK2", "MK3", "MK4",
    "MG1", "MG2", "MG3", "MG4", "MG5", "MG6", "MG7", "MG8", "MG9", "MG10", "MG11",
    "MM1", "MM2", "MM3",
    "MH1", "MH2", "MH3", "MH4", "MH5", "MH6", "MHG", "MHT",

    "EK1", "EK2", "EK3", "EK4", "EK5",
    "EG1", "EG1B", "EG2", "EG2B", "EG3", "EG4", "EG5", "EG6", "EG7", "EG8", "EG9", "EG10",
    "EM1", "EM2", "EM3", "EM4", "EM5",
    "EH1", "EH2", "EH3", "EH4", "EH5", "EH6",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mouseTarget = event.target as Node;

      if (profileDropdownRef.current && !profileDropdownRef.current.contains(mouseTarget)) {
        setIsProfileButtonPressed(false);
      }

      if (levelsDropdownRef.current && !levelsDropdownRef.current.contains(mouseTarget)) {
        setIsLevelsButtonPressed(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      id="sidebar"
      className={`relative flex h-full flex-col transition-all duration-300 ${collapsed ? "w-14" : "w-64"}`}
    >
      {/* Collapse toggle — floats in the corner so it doesn't claim its own row */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute right-0.5 top-0.5 z-10 flex items-center justify-center rounded-md p-1 text-primary-300 hover:bg-primary-50 hover:text-primary-600"
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Profile */}
      <div
        id="profile-button"
        ref={profileDropdownRef}
        className={`relative mb-1 ${collapsed ? "" : "pr-7"}`}
      >
        <button
          onClick={() => setIsProfileButtonPressed((prev) => !prev)}
          title={collapsed ? `Logged in as ${nameOfWorker}` : undefined}
          className={`flex w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-gray-700 hover:bg-primary-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <UserRound size={18} className="shrink-0 text-primary-400" />
          {!collapsed && (
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[10px] uppercase tracking-wide text-gray-400">
                Logged in as
              </span>
              <MarqueeLabel text={nameOfWorker} className="block w-full" />
            </span>
          )}
        </button>
        {isProfileButtonPressed && (
          <ul className="absolute left-0 top-full z-20 mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            <li>
              <button
                onClick={() => window.location.reload()}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Workspace */}
        <SectionLabel collapsed={collapsed}>Workspace</SectionLabel>
        <div className="flex flex-col">
          <NavItem
            id="Inventory"
            icon={Boxes}
            label="Inventory"
            collapsed={collapsed}
            active={showInventory}
            onClick={toggleInventory}
          />
          <NavItem
            id="Actions"
            icon={ClipboardList}
            label="Actions"
            collapsed={collapsed}
            active={showActions}
            onClick={toggleActions}
          />
        </div>

        {/* Operations */}
        <SectionLabel collapsed={collapsed}>Operations</SectionLabel>
        <div className="flex flex-col">
          <NavItem
            id="student-database"
            icon={Users}
            label="Student Database"
            collapsed={collapsed}
            active={showStudentDatabase}
            onClick={toggleStudentDatabase}
          />
          <NavItem
            id="timesheet"
            icon={Clock}
            label="Time Card"
            collapsed={collapsed}
            active={showTimesheet}
            onClick={toggleTimesheet}
          />
          <NavItem
            id="scan-station"
            icon={ScanLine}
            label="PEL Dollars Scan"
            collapsed={collapsed}
            active={showScanStation}
            onClick={toggleScanStation}
          />
          <NavItem
            id="data-entry"
            icon={PencilLine}
            label="Data Entry"
            collapsed={collapsed}
            active={showDataEntry}
            onClick={toggleDataEntry}
          />
        </div>

        {/* Admin — Mr. Lee only */}
        {nameOfWorker === "Mr. Lee" && (
          <>
            <SectionLabel collapsed={collapsed}>Admin</SectionLabel>
            <div className="flex flex-col">
              {/* Levels dropdown */}
              <div id="levels-dropdown" ref={levelsDropdownRef} className="relative">
                <button
                  id="level-dropdown-button"
                  onClick={() => setIsLevelsButtonPressed((prev) => !prev)}
                  title={collapsed ? "Levels" : undefined}
                  className={`flex w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isLevelsButtonPressed
                      ? "bg-tertiary-100 text-tertiary-700 font-medium"
                      : "text-gray-700 hover:bg-tertiary-50"
                  }`}
                >
                  <Layers size={18} className={`shrink-0 ${isLevelsButtonPressed ? "" : "text-tertiary-400"}`} />
                  {!collapsed && (
                    <>
                      <span className="min-w-0 flex-1 truncate text-left">Levels</span>
                      <ChevronDown
                        size={14}
                        className={`shrink-0 transition-transform ${
                          isLevelsButtonPressed ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>
                {isLevelsButtonPressed && (
                  <ul
                    id="level-dropdown-button-list"
                    className={`absolute top-full z-20 mt-1 max-h-56 w-40 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ${
                      collapsed ? "left-full ml-1" : "left-0"
                    }`}
                  >
                    <li id="all-levels-page-redirect" key="all-levels-page-redirect">
                      <button
                        className="w-full px-3 py-1.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          navigate(`/levels/LevelsPage`);
                          setIsLevelsButtonPressed(false);
                        }}
                      >
                        All Levels
                      </button>
                    </li>
                    {levelsArray.map((level: string) => (
                      <li id={level + "-button-redirect"} key={level + "-button-redirect"}>
                        <button
                          onClick={() => {
                            navigate(`/levels/${level}`);
                            setIsLevelsButtonPressed(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {level}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <NavItem
                icon={Presentation}
                label="Presentation"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => {}}
              />
              <NavItem
                id="dashboard"
                icon={LayoutDashboard}
                label="Progress Dashboard"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/dashboard")}
              />
              <NavItem
                id="parent-login"
                icon={UsersRound}
                label="Parent Portal"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/parent-login")}
              />
              <NavItem
                id="planning-research"
                icon={FlaskConical}
                label="Planning & Research"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/planning-research")}
              />
              <NavItem
                id="id-cards"
                icon={IdCard}
                label="PEL Dollars ID Cards"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/id-cards")}
              />
              <NavItem
                id="manage-students"
                icon={GraduationCap}
                label="Manage Students"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/manage-students")}
              />
              <NavItem
                id="manage-workers"
                icon={Users}
                label="Manage Workers"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/manage-workers")}
              />
              <NavItem
                id="earning-rules"
                icon={Coins}
                label="PEL Dollars Earning Rules"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/pel-admin/earning-rules")}
              />
              <NavItem
                id="prize-list"
                icon={Gift}
                label="PEL Dollars Prize List"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/pel-admin/prizes")}
              />
              <NavItem
                id="wishlist-review"
                icon={ListChecks}
                label="PEL Dollars Wishlist Review"
                collapsed={collapsed}
                accent="tertiary"
                onClick={() => navigate("/pel-admin/wishlist-review")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
