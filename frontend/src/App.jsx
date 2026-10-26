import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Settings,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Building2,
  MoreHorizontal,
  Trash2,
  Download,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Sparkles,
  Filter,
  Mail,
  Phone,
  Hash,
  Layers3,
  CircleHelp,
  LogOut,
  Pencil,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STREAMS = {
  "Engineering & Technology": [
    "Computer Science & Engineering",
    "Artificial Intelligence & Data Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical & Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
  "Arts & Science": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Computer Science",
    "English",
  ],
  "Management & Commerce": [
    "Commerce",
    "Business Administration",
    "Accounting & Finance",
    "Economics",
  ],
};

const STREAM_COLORS = {
  "Engineering & Technology": "bg-indigo-50 text-indigo-700",
  "Arts & Science": "bg-emerald-50 text-emerald-700",
  "Management & Commerce": "bg-amber-50 text-amber-700",
};

const ENROLLMENT_DATA = [
  { month: "Jan", students: 320 },
  { month: "Feb", students: 350 },
  { month: "Mar", students: 340 },
  { month: "Apr", students: 410 },
  { month: "May", students: 390 },
  { month: "Jun", students: 460 },
  { month: "Jul", students: 480 },
  { month: "Aug", students: 530 },
  { month: "Sep", students: 510 },
  { month: "Oct", students: 590 },
  { month: "Nov", students: 620 },
  { month: "Dec", students: 680 },
];

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@campus.edu",
    rollNo: "CS2026001",
    stream: "Engineering & Technology",
    department: "Computer Science & Engineering",
    year: "2026–27",
    studyYear: "2nd Year",
    status: "Active",
  },
  {
    id: 2,
    name: "Diya Krishnan",
    email: "diya.krishnan@campus.edu",
    rollNo: "AI2026002",
    stream: "Engineering & Technology",
    department: "Artificial Intelligence & Data Science",
    year: "2026–27",
    studyYear: "1st Year",
    status: "Active",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    email: "rohan.mehta@campus.edu",
    rollNo: "AS2026003",
    stream: "Arts & Science",
    department: "Computer Science",
    year: "2026–27",
    studyYear: "3rd Year",
    status: "Active",
  },
  {
    id: 4,
    name: "Ananya Iyer",
    email: "ananya.iyer@campus.edu",
    rollNo: "MC2026004",
    stream: "Management & Commerce",
    department: "Business Administration",
    year: "2026–27",
    studyYear: "2nd Year",
    status: "Active",
  },
  {
    id: 5,
    name: "Vikram Patel",
    email: "vikram.patel@campus.edu",
    rollNo: "IT2026005",
    stream: "Engineering & Technology",
    department: "Information Technology",
    year: "2025–26",
    studyYear: "4th Year",
    status: "Pending",
  },
  {
    id: 6,
    name: "Meera Nair",
    email: "meera.nair@campus.edu",
    rollNo: "AS2026006",
    stream: "Arts & Science",
    department: "Mathematics",
    year: "2026–27",
    studyYear: "1st Year",
    status: "Active",
  },
  {
    id: 7,
    name: "Aditya Rao",
    email: "aditya.rao@campus.edu",
    rollNo: "ME2026007",
    stream: "Engineering & Technology",
    department: "Mechanical Engineering",
    year: "2025–26",
    studyYear: "3rd Year",
    status: "Inactive",
  },
  {
    id: 8,
    name: "Ishita Das",
    email: "ishita.das@campus.edu",
    rollNo: "MC2026008",
    stream: "Management & Commerce",
    department: "Commerce",
    year: "2026–27",
    studyYear: "2nd Year",
    status: "Active",
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New student admission",
    message: "A new student record has been added to the system.",
    time: "Recently",
    type: "student",
    read: false,
  },
  {
    id: 2,
    title: "Student record updated",
    message: "A student profile was recently updated.",
    time: "Earlier today",
    type: "update",
    read: false,
  },
  {
    id: 3,
    title: "Academic year reminder",
    message: "Review enrollment details for the selected academic year.",
    time: "Yesterday",
    type: "reminder",
    read: false,
  },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Students", icon: Users },
  { label: "Streams & Departments", icon: GraduationCap },
  { label: "Settings", icon: Settings },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState("");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [academicYear, setAcademicYear] = useState("2026–27");
  const [searchQuery, setSearchQuery] = useState("");
  const [streamFilter, setStreamFilter] = useState("All Streams");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [toast, setToast] = useState("");

  // Load student records from the CampusFlow Express/MongoDB API on startup.
  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      try {
        setLoadingStudents(true);
        setStudentsError("");

        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error(`Student API returned HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data || !Array.isArray(data.students)) {
          throw new Error("The student API response did not contain a students array.");
        }

        const formattedStudents = data.students.map((student) => ({
          id: student._id,
          name: student.fullName,
          email: student.email,
          rollNo: student.studentId,
          stream: student.stream,
          department: student.department,
          year: String(student.academicYear || "").replace(/-/g, "–"),
          studyYear: student.studyYear || "",
          status: student.status,
        }));

        if (!cancelled) setStudents(formattedStudents);
      } catch (error) {
        console.error("Error fetching CampusFlow students:", error);
        if (!cancelled) {
          setStudentsError(
            "Unable to load students. Check that the backend and MongoDB are running, then refresh this page."
          );
        }
      } finally {
        if (!cancelled) setLoadingStudents(false);
      }
    }

    fetchStudents();
    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const yearStudents = useMemo(
    () => students.filter((student) => student.year === academicYear),
    [students, academicYear]
  );

  const activeStudents = yearStudents.filter(
    (student) => student.status === "Active"
  ).length;

  const pendingStudents = yearStudents.filter(
    (student) => student.status === "Pending"
  ).length;

  const filteredStudents = useMemo(() => {
    return yearStudents.filter((student) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query);

      const matchesStream =
        streamFilter === "All Streams" || student.stream === streamFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || student.status === statusFilter;

      return matchesSearch && matchesStream && matchesStatus;
    });
  }, [yearStudents, searchQuery, streamFilter, statusFilter]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }


  async function addStudent(formData) {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: formData.rollNo,
        fullName: formData.name,
        email: formData.email,
        department: formData.department,
        stream: formData.stream,
        academicYear: formData.year.replace("–", "-"),
        phone: formData.phone,
        status: formData.status,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add student.");
    }

    const savedStudent = result.student;

    const newStudent = {
      id: savedStudent._id,
      name: savedStudent.fullName,
      email: savedStudent.email,
      rollNo: savedStudent.studentId,
      department: savedStudent.department,
      stream: savedStudent.stream,
      year: savedStudent.academicYear.replace("-", "–"),
      phone: savedStudent.phone,
      status: savedStudent.status,
    };

    setStudents((current) => [newStudent, ...current]);

    setNotifications((current) => [
      {
        id: Date.now(),
        title: "New student admission",
        message: `${newStudent.name} was added to the student directory.`,
        time: "Just now",
        type: "student",
        read: false,
      },
      ...current,
    ]);

    setAcademicYear(newStudent.year);
    setSearchQuery("");
    setStreamFilter("All Streams");
    setStatusFilter("All Statuses");
    setShowAddStudent(false);
    setEditingStudent(null);
    setActivePage("Students");

    showToast("Student added successfully!");
  } catch (error) {
    console.error("Error adding student:", error);
    showToast(error.message || "Unable to add student.");
  }
}



  async function updateStudent(formData) {
    if (!editingStudent?.id) {
      showToast("Cannot update this student: missing record ID.");
      return;
    }

    try {
      const response = await fetch(
        `/api/students/${encodeURIComponent(editingStudent.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: formData.rollNo,
            fullName: formData.name,
            email: formData.email,
            department: formData.department,
            stream: formData.stream,
            academicYear: String(formData.year || "").replace(/–/g, "-"),
            studyYear: formData.studyYear,
            status: formData.status,
          }),
        }
      );
      const result = response.status === 204 ? {} : await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || result.error || `Update failed (HTTP ${response.status}).`);
      }

      const record = result.student || result.data?.student || result.data || result;
      const updatedStudent = {
        id: record._id || record.id || editingStudent.id,
        name: record.fullName ?? formData.name,
        email: record.email ?? formData.email,
        rollNo: record.studentId ?? formData.rollNo,
        department: record.department ?? formData.department,
        stream: record.stream ?? formData.stream,
        year: String(record.academicYear ?? formData.year).replace(/-/g, "–"),
        studyYear: record.studyYear ?? formData.studyYear ?? "",
        status: record.status ?? formData.status,
      };

      setStudents((current) => current.map((student) =>
        student.id === editingStudent.id ? updatedStudent : student
      ));
      setNotifications((current) => [{
        id: Date.now(), title: "Student record updated",
        message: `${updatedStudent.name}'s student record was updated.`,
        time: "Just now", type: "update", read: false,
      }, ...current]);
      setAcademicYear(updatedStudent.year);
      setEditingStudent(null);
      setShowAddStudent(false);
      showToast("Student record updated and saved.");
    } catch (error) {
      console.error("Error updating CampusFlow student:", error);
      showToast(error.message || "Unable to update student. Check the backend.");
    }
  }

  async function deleteStudent(id) {
    const student = students.find((item) => item.id === id);
    if (!student) {
      setDeleteStudentId(null);
      showToast("Student record was not found.");
      return;
    }

    try {
      const response = await fetch(
       `/api/students/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const result = response.status === 204 ? {} : await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || result.error || `Delete failed (HTTP ${response.status}).`);
      }

      setStudents((current) => current.filter((item) => item.id !== id));
      setDeleteStudentId(null);
      setNotifications((current) => [{
        id: Date.now(), title: "Student record deleted",
        message: `${student.name}'s record was deleted from the database.`,
        time: "Just now", type: "update", read: false,
      }, ...current]);
      showToast("Student record deleted from the database.");
    } catch (error) {
      console.error("Error deleting CampusFlow student:", error);
      showToast(error.message || "Unable to delete student. Check the backend.");
    }
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }

  function markNotificationAsRead(id) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  function exportStudents() {
    const headers = [
      "Roll Number",
      "Name",
      "Email",
      "Stream",
      "Department",
      "Academic Year",
      "Study Year",
      "Status",
    ];

    const rows = filteredStudents.map((student) => [
      student.rollNo,
      student.name,
      student.email,
      student.stream,
      student.department,
      student.year,
      student.studyYear,
      student.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `students-${academicYear.replace("–", "-")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    showToast("Student data exported!");
  }

  function handleNavigation(label) {
    setActivePage(label);
    setShowMobileMenu(false);
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {showMobileMenu && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col bg-[#111a35] text-white transition-transform duration-300 ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-950/30">
            <GraduationCap size={23} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">CampusFlow</h1>
            <p className="text-[11px] text-slate-400">
              Student Management
            </p>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-white/10 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon }) => {
              const active = activePage === label;

              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => handleNavigation(label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
                    active
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/20"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span>{label}</span>
                  {active && (
                    <ChevronRight size={15} className="ml-auto opacity-80" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mx-5 mt-8 border-t border-white/10" />

        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
            Academic streams
          </p>

          {Object.entries(STREAMS).map(([stream, departments]) => (
            <button
              type="button"
              key={stream}
              onClick={() => {
                setActivePage("Streams & Departments");
                setShowMobileMenu(false);
              }}
              className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  stream === "Engineering & Technology"
                    ? "bg-indigo-400"
                    : stream === "Arts & Science"
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                }`}
              />
              <span className="flex-1">{stream}</span>
              <span className="text-[10px] text-slate-500">
                {departments.length}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-300">
              <Sparkles size={18} />
            </div>

            <p className="text-xs font-semibold">CampusFlow Workspace</p>
            <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
              Manage students and departments from one place.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-400/20 text-xs font-bold text-indigo-200">
              AD
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Admin User</p>
              <p className="mt-1 text-[10px] text-slate-400">
                System Administrator
              </p>
            </div>

            <button
              type="button"
              aria-label="Help"
              onClick={() =>
                showToast("CampusFlow Student Management System")
              }
              className="text-slate-400 hover:text-white"
            >
              <CircleHelp size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:ml-[258px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Workspace</span>
                <span>/</span>
                <span className="truncate text-slate-600">{activePage}</span>
              </div>

              <h2 className="mt-1 truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {activePage === "Dashboard"
                  ? "Overview"
                  : activePage === "Streams & Departments"
                    ? "Streams & Departments"
                    : activePage}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Academic year selector */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:flex">
              <CalendarDays size={15} className="text-slate-500" />

              <select
                aria-label="Select academic year"
                value={academicYear}
                onChange={(event) => setAcademicYear(event.target.value)}
                className="max-w-[115px] cursor-pointer bg-transparent text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="2024–25">2024–25</option>
                <option value="2025–26">2025–26</option>
                <option value="2026–27">2026–27</option>
                <option value="2027–28">2027–28</option>
              </select>

              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Notification button and panel */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={showNotifications}
                onClick={() => {
                  setShowNotifications((current) => !current);
                  setShowProfileMenu(false);
                }}
                className={`relative rounded-xl border p-2.5 transition ${
                  showNotifications
                    ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-[60] w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                          : "You're all caught up"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-10 text-center">
                        <Bell
                          size={24}
                          className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          No notifications yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          New activity will appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                          className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition hover:bg-slate-50 ${
                            !notification.read ? "bg-indigo-50/40" : ""
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              notification.type === "student"
                                ? "bg-indigo-50 text-indigo-600"
                                : notification.type === "reminder"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {notification.type === "student" ? (
                              <UserRound size={17} />
                            ) : notification.type === "reminder" ? (
                              <Clock3 size={17} />
                            ) : (
                              <CheckCircle2 size={17} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-800">
                                {notification.title}
                              </p>

                              {!notification.read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                              )}
                            </div>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-1.5 text-[10px] text-slate-400">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                    <p className="text-center text-[10px] text-slate-500">
                      CampusFlow activity centre
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu((current) => !current);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  AD
                </div>

                <ChevronDown
                  size={14}
                  className="hidden text-slate-400 sm:block"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage("Settings");
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Settings size={15} />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      showToast("You are using the CampusFlow demo.");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <LogOut size={15} />
                    Demo information
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
          {loadingStudents && (
            <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              Loading student records from the database…
            </div>
          )}
          {studentsError && (
            <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {studentsError}
            </div>
          )}

          {/* Dashboard */}
          {activePage === "Dashboard" && (
            <>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                    <Sparkles size={12} />
                    Academic overview
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    Welcome back, Admin 👋
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Here's what's happening across your campus.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setShowAddStudent(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Add new student
                </button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total students"
                  value={yearStudents.length}
                  description={`Academic year ${academicYear}`}
                  icon={Users}
                  color="indigo"
                  change="+12.5%"
                  up
                />

                <StatCard
                  title="Active students"
                  value={activeStudents}
                  description="Currently active"
                  icon={CheckCircle2}
                  color="emerald"
                  change="Active"
                  up
                />

                <StatCard
                  title="Pending verification"
                  value={pendingStudents}
                  description="Require attention"
                  icon={Clock3}
                  color="amber"
                  change="Review"
                  up={false}
                />

                <StatCard
                  title="Academic streams"
                  value={Object.keys(STREAMS).length}
                  description="Across the institution"
                  icon={Building2}
                  color="violet"
                  change="3 streams"
                  up
                />
              </div>

              {/* Chart and stream distribution */}
              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Student enrollment
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Illustrative enrollment trend throughout the year
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-2.5 py-2 text-[10px] font-semibold text-indigo-700">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      Enrollment trend
                    </div>
                  </div>

                  <div className="mt-6 h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={ENROLLMENT_DATA}
                        margin={{
                          top: 8,
                          right: 6,
                          left: -20,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="enrollmentGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366f1"
                              stopOpacity={0.22}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#eef0f6"
                          strokeDasharray="4 4"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          dy={10}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                        />

                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            fontSize: "12px",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="students"
                          stroke="#6366f1"
                          strokeWidth={2.5}
                          fill="url(#enrollmentGradient)"
                          activeDot={{
                            r: 5,
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="mt-3 text-[10px] text-slate-400">
                    Note: The chart uses demonstration data and is not connected
                    to the student database.
                  </p>
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Students by stream
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Distribution for {academicYear}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="View streams"
                      onClick={() =>
                        setActivePage("Streams & Departments")
                      }
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {Object.entries(STREAMS).map(([stream], index) => {
                      const count = yearStudents.filter(
                        (student) => student.stream === stream
                      ).length;

                      const percentage =
                        yearStudents.length > 0
                          ? (count / yearStudents.length) * 100
                          : 0;

                      const colors = [
                        "bg-indigo-500",
                        "bg-emerald-500",
                        "bg-amber-500",
                      ];

                      return (
                        <div key={stream}>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-slate-700">
                              {stream}
                            </p>
                            <span className="text-xs font-bold text-slate-800">
                              {count}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${colors[index]}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <p className="mt-1.5 text-[10px] text-slate-400">
                            {percentage.toFixed(0)}% of students
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePage("Streams & Departments")
                    }
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    Explore all streams
                    <ArrowUpRight size={14} />
                  </button>
                </section>
              </div>

              {/* Recent students */}
              <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Recent students
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Latest student records for {academicYear}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePage("Students")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View all students
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <StudentTable
                  students={yearStudents.slice(0, 5)}
                  onEdit={(student) => {
                    setEditingStudent(student);
                    setShowAddStudent(true);
                  }}
                  onDelete={(id) => setDeleteStudentId(id)}
                />
              </section>
            </>
          )}

          {/* Student directory */}
          {activePage === "Students" && (
            <>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Student directory
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Search, manage, and organize your student records.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={exportStudents}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Download size={15} />
                    Export CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingStudent(null);
                      setShowAddStudent(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Plus size={16} />
                    Add student
                  </button>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniStat
                  label="Total students"
                  value={yearStudents.length}
                  icon={Users}
                />
                <MiniStat
                  label="Active"
                  value={activeStudents}
                  icon={CheckCircle2}
                />
                <MiniStat
                  label="Pending"
                  value={pendingStudents}
                  icon={Clock3}
                />
              </div>

              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="search"
                      placeholder="Search by name, email, roll number..."
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <select
                        aria-label="Filter by stream"
                        value={streamFilter}
                        onChange={(event) =>
                          setStreamFilter(event.target.value)
                        }
                        className="max-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-8 text-xs text-slate-600 outline-none focus:border-indigo-300"
                      >
                        <option>All Streams</option>
                        {Object.keys(STREAMS).map((stream) => (
                          <option key={stream}>{stream}</option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>

                    <div className="relative">
                      <select
                        aria-label="Filter by status"
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(event.target.value)
                        }
                        className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-8 text-xs text-slate-600 outline-none focus:border-indigo-300"
                      >
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Inactive</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <StudentTable
                  students={filteredStudents}
                  onEdit={(student) => {
                    setEditingStudent(student);
                    setShowAddStudent(true);
                  }}
                  onDelete={(id) => setDeleteStudentId(id)}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                  <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {filteredStudents.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {yearStudents.length}
                    </span>{" "}
                    students
                  </p>

                  <span className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] text-slate-500">
                    Academic year: {academicYear}
                  </span>
                </div>
              </section>
            </>
          )}

          {/* Streams and departments */}
          {activePage === "Streams & Departments" && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Streams & Departments
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Explore the academic structure of your institution.
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                    <Layers3 size={23} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Academic organization
                    </h2>
                    <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-600">
                      CampusFlow organizes academic programs into three main
                      streams, each containing specialized departments. Student
                      records are associated with their selected stream and
                      department.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white bg-white/80 p-4">
                    <p className="text-xs text-slate-500">Main streams</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {Object.keys(STREAMS).length}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white bg-white/80 p-4">
                    <p className="text-xs text-slate-500">Departments</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {Object.values(STREAMS).flat().length}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white bg-white/80 p-4">
                    <p className="text-xs text-slate-500">
                      Students in {academicYear}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {yearStudents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {Object.entries(STREAMS).map(
                  ([stream, departments], index) => {
                    const streamStudents = yearStudents.filter(
                      (student) => student.stream === stream
                    );

                    const accents = [
                      {
                        icon: "bg-indigo-50 text-indigo-600",
                        line: "bg-indigo-500",
                        badge: "bg-indigo-50 text-indigo-700",
                      },
                      {
                        icon: "bg-emerald-50 text-emerald-600",
                        line: "bg-emerald-500",
                        badge: "bg-emerald-50 text-emerald-700",
                      },
                      {
                        icon: "bg-amber-50 text-amber-600",
                        line: "bg-amber-500",
                        badge: "bg-amber-50 text-amber-700",
                      },
                    ][index];

                    return (
                      <section
                        key={stream}
                        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents.icon}`}
                            >
                              {index === 0 ? (
                                <Building2 size={21} />
                              ) : index === 1 ? (
                                <BookOpen size={21} />
                              ) : (
                                <GraduationCap size={21} />
                              )}
                            </div>

                            <span
                              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${accents.badge}`}
                            >
                              {departments.length} departments
                            </span>
                          </div>

                          <h3 className="mt-4 text-base font-bold leading-6 text-slate-900">
                            {stream}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {streamStudents.length} students in {academicYear}
                          </p>

                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${accents.line}`}
                              style={{
                                width: `${
                                  yearStudents.length > 0
                                    ? (streamStudents.length /
                                        yearStudents.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-100 px-5 py-4">
                          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Departments
                          </p>

                          <div className="space-y-1">
                            {departments.map((department) => {
                              const departmentCount = streamStudents.filter(
                                (student) =>
                                  student.department === department
                              ).length;

                              return (
                                <div
                                  key={department}
                                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition hover:bg-slate-50"
                                >
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <span
                                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${accents.line}`}
                                    />
                                    <span className="text-xs leading-5 text-slate-600">
                                      {department}
                                    </span>
                                  </div>

                                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                                    {departmentCount}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="border-t border-slate-100 p-4">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePage("Students");
                              setStreamFilter(stream);
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            View students
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </section>
                    );
                  }
                )}
              </div>
            </>
          )}

          {/* Settings */}
          {activePage === "Settings" && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Settings
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Manage your CampusFlow workspace preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Settings size={20} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        General preferences
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Configure your academic workspace.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 pt-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Current academic year
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Choose the year used to filter student records.
                        </p>
                      </div>

                      <select
                        value={academicYear}
                        onChange={(event) =>
                          setAcademicYear(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-indigo-300"
                      >
                        <option>2024–25</option>
                        <option>2025–26</option>
                        <option>2026–27</option>
                        <option>2027–28</option>
                      </select>
                    </div>

                    <div className="border-t border-slate-100" />

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Student records
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Manage student information from the directory.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActivePage("Students")}
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Open directory
                      </button>
                    </div>

                    <div className="border-t border-slate-100" />

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Notification centre
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {unreadCount} unread notification
                          {unreadCount === 1 ? "" : "s"}.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowNotifications(true);
                          setActivePage("Dashboard");
                        }}
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View notifications
                      </button>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={22} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    Workspace status
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Your CampusFlow frontend is connected to the student API.
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-700">
                      Frontend interface active
                    </span>
                  </div>

                  <p className="mt-4 text-[11px] leading-5 text-slate-400">
                    Student records currently live in browser memory. Backend
                    database integration is required for persistent storage.
                  </p>
                </section>
              </div>
            </>
          )}

          <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200/70 py-5 text-[10px] text-slate-400 sm:flex-row sm:items-center">
            <p>© 2026 CampusFlow · Student Management System</p>
            <p className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Frontend demonstration
            </p>
          </footer>
        </main>
      </div>

      {/* Add/Edit student modal */}
      {showAddStudent && (
        <StudentModal
          student={editingStudent}
          onClose={() => {
            setShowAddStudent(false);
            setEditingStudent(null);
          }}
          onSubmit={(formData) => {
            if (editingStudent) {
              updateStudent(formData);
            } else {
              addStudent(formData);
            }
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteStudentId !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={22} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Delete student record?
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              This will permanently delete the student record from the database.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteStudentId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteStudent(deleteStudentId)}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Delete record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-40px)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-xl"
        >
          <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
          <span className="text-xs font-medium text-slate-700">{toast}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setToast("")}
            className="ml-2 text-slate-400 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

/* Reusable statistic card */
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  change,
  up,
}) {
  const styles = {
    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      badge: "bg-indigo-50 text-indigo-700",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-700",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      badge: "bg-violet-50 text-violet-700",
    },
  };

  const style = styles[color];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${style.badge}`}>
          {up ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {change}
        </span>

        <span className="text-[10px] text-slate-400">{description}</span>
      </div>
    </section>
  );
}

/* Small statistic card */
function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

/* Student table */
function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Users size={23} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          No students found
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Student
            </th>
            <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Roll number
            </th>
            <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Department
            </th>
            <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Study year
            </th>
            <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </th>
            <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr
              key={student.id}
              className="transition hover:bg-slate-50/70"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-bold text-indigo-700">
                    {student.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-xs font-semibold text-slate-800">
                      {student.name}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400">
                      {student.email}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <span className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-1.5 font-mono text-[10px] font-medium text-slate-600">
                  {student.rollNo}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="max-w-[190px]">
                  <p className="text-xs font-medium leading-5 text-slate-700">
                    {student.department}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {student.stream}
                  </p>
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                {student.studyYear}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={student.status} />
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${student.name}`}
                    title="Edit student"
                    onClick={() => onEdit(student)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${student.name}`}
                    title="Delete student"
                    onClick={() => onDelete(student.id)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Student status badge */
function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Inactive: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${styles[status] || styles.Inactive}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active"
            ? "bg-emerald-500"
            : status === "Pending"
              ? "bg-amber-500"
              : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}

/* Add/Edit student form */
function StudentModal({ student, onClose, onSubmit }) {
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [rollNo, setRollNo] = useState(student?.rollNo || "");
  const [stream, setStream] = useState(
    student?.stream || "Engineering & Technology"
  );
  const [department, setDepartment] = useState(
    student?.department ||
      STREAMS["Engineering & Technology"][0]
  );
  const [year, setYear] = useState(student?.year || "2026–27");
  const [studyYear, setStudyYear] = useState(
    student?.studyYear || "1st Year"
  );
  const [status, setStatus] = useState(student?.status || "Active");
  const [error, setError] = useState("");

  const availableDepartments = STREAMS[stream] || [];

  function handleStreamChange(newStream) {
    setStream(newStream);
    setDepartment(STREAMS[newStream][0]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !rollNo.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      rollNo: rollNo.trim(),
      stream,
      department,
      year,
      studyYear,
      status,
    });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {student ? "Edit student" : "Add new student"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Enter the student's academic and personal information.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close form"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full name" icon={UserRound}>
              <input
                autoFocus
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter full name"
                className={inputClass}
              />
            </FormField>

            <FormField label="Roll number" icon={Hash}>
              <input
                required
                value={rollNo}
                onChange={(event) => setRollNo(event.target.value)}
                placeholder="e.g. CS2026010"
                className={inputClass}
              />
            </FormField>

            <FormField label="Email address" icon={Mail}>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@campus.edu"
                className={inputClass}
              />
            </FormField>

            <FormField label="Academic year" icon={CalendarDays}>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={inputClass}
              >
                <option>2024–25</option>
                <option>2025–26</option>
                <option>2026–27</option>
                <option>2027–28</option>
              </select>
            </FormField>

            <FormField label="Academic stream" icon={Layers3}>
              <select
                value={stream}
                onChange={(event) => handleStreamChange(event.target.value)}
                className={inputClass}
              >
                {Object.keys(STREAMS).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Department" icon={Building2}>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className={inputClass}
              >
                {availableDepartments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Study year" icon={BookOpen}>
              <select
                value={studyYear}
                onChange={(event) => setStudyYear(event.target.value)}
                className={inputClass}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>5th Year</option>
              </select>
            </FormField>

            <FormField label="Status" icon={CheckCircle2}>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClass}
              >
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
            </FormField>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-3 text-xs text-rose-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              <CheckCircle2 size={15} />
              {student ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50";

function FormField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
        <Icon size={13} className="text-slate-400" />
        {label}
      </span>

      {children}
    </label>
  );
}

export default App;