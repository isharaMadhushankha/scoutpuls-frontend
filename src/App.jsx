import React, { useState, useEffect } from "react";
import {
  Compass,
  Users,
  Sparkles,
  AlertCircle,
  Search,
  Grid,
  List,
  FolderKanban,
  Shield,
  Award,
  ChevronDown,
  ChevronRight,
  X,
  BookOpen,
  UserPlus,
  Calendar,
  LogOut,
  CheckCircle2,
  Lock,
  Download,
  Clock,
  MapPin,
  Mail,
  ArrowRight,
  RefreshCw,
  Edit,
} from "lucide-react";
import EnrollForm from "./components/EnrollForm";
import ScoutCard from "./components/ScoutCard";
import ScoutListRow from "./components/ScoutListRow";
import Sidebar from "./components/Sidebar";
import VoiceNewsPublisher from "./components/VoiceNewsPublisher";

// Hardcoded official badge definitions
const SYSTEM_BADGES = [
  {
    id: 1,
    name: "Camping",
    description: "Prepare outdoor shelters.",
    iconUrl: "https://img.icons8.com/color/96/camping-tent.png",
  },
  {
    id: 2,
    name: "First Aid",
    description: "Demonstrate immediate care skills.",
    iconUrl: "https://img.icons8.com/color/96/first-aid-kit.png",
  },
  {
    id: 3,
    name: "Navigation",
    description: "Use maps and compasses.",
    iconUrl: "https://img.icons8.com/color/96/compass.png",
  },
  {
    id: 4,
    name: "Cooking",
    description: "Prepare a 3-course patrol meal.",
    iconUrl: "https://img.icons8.com/color/96/cooking-pot.png",
  },
  {
    id: 5,
    name: "Pioneering",
    description: "Build structural lashings.",
    iconUrl: "https://img.icons8.com/color/96/bridge.png",
  },
];

const MOCK_PROGRAMS = [
  {
    id: "cub",
    name: "Cub Scouting Program",
    description:
      "For young children aged 7 to 11. Focuses on character development, basic safety, and team play through star badges.",
    ageGroup: "7 - 11 Years",
    fileUrl: "/Cub_Scout_Handbook.txt",
    downloadName: "Cub_Scout_Handbook.txt",
    syllabus: [
      "Understand the Cub Scout Promise and Law",
      "Learn basic scouting knots: Reef Knot, Clove Hitch",
      "Earn the Bronze, Silver, and Gold Star proficiency milestones",
      "Participate in outdoor nature walks and flag ceremonies",
    ],
  },
  {
    id: "scout",
    name: "Standard Scout Program",
    description:
      "For adolescents aged 11 to 17. The core training track covering survival craft, outdoor camping, navigation, pioneering, and leadership.",
    ageGroup: "11 - 17 Years",
    fileUrl: "/Standard_Scout_Handbook.txt",
    downloadName: "Standard_Scout_Handbook.txt",
    syllabus: [
      "Master the 8 basic knots and pioneering lashings",
      "Demonstrate complete First Aid & emergency care skills",
      "Map reading, compass navigation, and orienteering",
      "Qualify for the President's Scout Badge assessment",
    ],
  },
  {
    id: "rover",
    name: "Rover Scouting Program",
    description:
      "For young adults aged 17 to 26. Focused on community service, disaster mitigation, vocational skills, and advanced wood badge training.",
    ageGroup: "17 - 26 Years",
    fileUrl: "/Rover_Scout_Manual.txt",
    downloadName: "Rover_Scout_Manual.txt",
    syllabus: [
      "Plan and execute a district-level community service project",
      "Complete advanced wilderness survival training",
      "Acquire wood badge leadership credentials",
      "Assist in Galle District disaster mitigation drills",
    ],
  },
];

const MOCK_LEADERS = [
  {
    id: 1,
    name: "Dr. Ruwan Wijewardene",
    role: "District Commissioner",
    troop: "Galle District Scout Headquarters",
    email: "dc.galle@slscouts.lk",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Mrs. Sandya Kanthi",
    role: "Assistant District Commissioner (Cubs)",
    troop: "Galle District Scout Headquarters",
    email: "adc.cubs.galle@slscouts.lk",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    name: "Mr. Lasantha Perera",
    role: "District Scout Leader",
    troop: "01-Galle Scout Group",
    email: "lasantha.p@slscouts.lk",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 4,
    name: "Mr. Dimuthu Silva",
    role: "Pioneering Instructor & Leader",
    troop: "04-Karapitiya Scout Group",
    email: "dimuthu.silva@slscouts.lk",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Galle District Camporee 2026",
    date: "July 15 - July 19, 2026",
    location: "District Camp Site, Koggala",
    description:
      "The annual district gathering of all patrols for competition, camping, and qualification review.",
    category: "Camporee",
  },
  {
    id: 2,
    title: "President's Scout Badge Evaluation",
    date: "August 08, 2026",
    location: "Richmond College, Galle",
    description:
      "Strict qualification assessment for intermediate scouts aiming to achieve the President's Scout Badge.",
    category: "Evaluation",
  },
  {
    id: 3,
    title: "Advanced First Aid & CPR Meet",
    date: "September 12, 2026",
    location: "Mahinda College, Galle",
    description:
      "Practical training session organized with Galle Hospital officers for the First Aid proficiency badge.",
    category: "Workshop",
  },
  {
    id: 4,
    title: "District Patrol Leaders Training",
    date: "October 03, 2026",
    location: "District HQ, Galle Fort",
    description:
      "Leadership workshop focusing on patrol management, lashings instruction, and planning skills.",
    category: "Training",
  },
];

const MOCK_NEWS = [
  {
    id: 1,
    title: "Galle District Camporee 2026 Registration Open",
    date: "June 10, 2026",
    summary:
      "Registration for the annual district camporee at Koggala is now open. All patrols must submit their lists before July 1st.",
    content:
      "All troops in the Galle District are hereby notified that the registration portal for the Galle District Camporee 2026 is officially open. The camporee will run from July 15 to July 19 at the Koggala campsite. Please coordinate with your Scoutmasters to submit patrol details and payments.",
    category: "Announcements",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Flood Relief Service Project by Galle Rover Scouts",
    date: "June 05, 2026",
    summary:
      "Rover Scouts from Richmond and Mahinda College completed a joint community support program in flooded areas of Hiniduma.",
    content:
      "In response to recent heavy rains, the Rover Scouts of Galle District organized a disaster response and clean-up operation in Hiniduma. Over 50 Rovers participated in distribution of essentials, sanitization, and setting up temporary aid tents.",
    category: "Community Service",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "Baden-Powell Leadership Day in Galle Fort",
    date: "May 22, 2026",
    summary:
      "District Scout HQ held a leadership and wood badge seminar for scoutmasters and senior patrol leaders.",
    content:
      "Wood badge leadership and patrol-level instruction day held at headquarters. Over 120 Scoutmasters and Patrol Leaders from 15 schools attended. Topics covered modern pioneering lashings and community involvement programs.",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
  },
];

export default function App() {
  const [scouts, setScouts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication / login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState(null); // 'admin' | 'scout'
  const [loggedInScoutId, setLoggedInScoutId] = useState(null);
  const [loginTab, setLoginTab] = useState("scout"); // 'admin' | 'scout'
  const [adminPasscode, setAdminPasscode] = useState("");
  const [tempScoutId, setTempScoutId] = useState("");

  // Portal view, active navigation view, and selected scout profile
  const [role, setRole] = useState("Admin"); // 'Admin' | 'Scout'
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedScoutId, setSelectedScoutId] = useState(null);

  // Search/Filter states (for Admin Dashboard listing)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTroop, setSelectedTroop] = useState("All");
  const [groupByTroop, setGroupByTroop] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [collapsedTroops, setCollapsedTroops] = useState({});
  const [badgeSystemCategory, setBadgeSystemCategory] = useState("All");
  const [progressCategory, setProgressCategory] = useState("All");
  const [editingBadge, setEditingBadge] = useState(null);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programSubmitLoading, setProgramSubmitLoading] = useState(false);
  const [news, setNews] = useState([]);

  const fetchScouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch scouts directory.");
      }
      const data = await response.json();
      setScouts(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/badges",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch badges catalog.");
      }
      const data = await response.json();
      setBadges(data);
    } catch (err) {
      console.error("Error fetching badges:", err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/programs",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch programs.");
      }
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/news",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch news.");
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  const handleUpdateBadge = async (e) => {
    e.preventDefault();
    if (!editingBadge) return;
    setEditSubmitLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("badgeName");
    const category = formData.get("badgeCategory");
    const description = formData.get("badgeDescription");
    const file = formData.get("badgeIcon");

    const sendData = new FormData();
    sendData.append("name", name);
    sendData.append("category", category);
    sendData.append("description", description);
    if (file && file.size > 0) {
      sendData.append("icon", file);
    }

    try {
      const response = await fetch(
        `https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/badges/${editingBadge.id}`,
        {
          method: "PUT",
          body: sendData,
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update badge.");
      }

      alert("Badge updated successfully!");
      setEditingBadge(null);
      fetchBadges();
      fetchScouts();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setEditSubmitLoading(false);
    }
  };

  const handleUpdateProgram = async (e) => {
    e.preventDefault();
    if (!editingProgram) return;
    setProgramSubmitLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("programName");
    const ageGroup = formData.get("programAgeGroup");
    const description = formData.get("programDescription");
    const syllabusText = formData.get("programSyllabus");
    const imageFile = formData.get("programImage");
    const handbookFile = formData.get("programHandbook");

    const syllabusArray = syllabusText
      ? syllabusText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : [];

    const sendData = new FormData();
    sendData.append("name", name);
    sendData.append("ageGroup", ageGroup);
    sendData.append("description", description);
    sendData.append("syllabus", JSON.stringify(syllabusArray));

    if (imageFile && imageFile.size > 0) {
      sendData.append("image", imageFile);
    }
    if (handbookFile && handbookFile.size > 0) {
      sendData.append("file", handbookFile);
    }

    try {
      const response = await fetch(
        `https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/programs/${editingProgram.id}`,
        {
          method: "PUT",
          body: sendData,
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update program.");
      }

      alert("Program updated successfully!");
      setEditingProgram(null);
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setProgramSubmitLoading(false);
    }
  };

  useEffect(() => {
    fetchScouts();
    fetchBadges();
    fetchPrograms();
    fetchNews();
  }, []);

  // Auto-select a scout profile when entering Scout view for the first time
  useEffect(() => {
    if (role === "Scout" && scouts.length > 0 && !selectedScoutId) {
      setSelectedScoutId(scouts[0].id);
    }
  }, [role, scouts, selectedScoutId]);

  // Find currently active scout in Scout view
  const activeScout = scouts.find((s) => s.id === selectedScoutId);

  // Unique list of troops (for Admin dashboard filtering pills)
  const uniqueTroops = [
    "All",
    ...new Set(
      scouts
        .map((s) => s.troopNo)
        .filter(Boolean)
        .sort(),
    ),
  ];

  // Troop counts for indicators
  const troopCounts = scouts.reduce((acc, s) => {
    const troop = s.troopNo || "Unknown";
    acc[troop] = (acc[troop] || 0) + 1;
    return acc;
  }, {});

  // Compute live dashboard statistics
  const totalScouts = scouts.length;
  const totalTroopsCount = Object.keys(troopCounts).length;
  const totalBadgesCount = scouts.reduce(
    (acc, s) => acc + (s.badges ? s.badges.length : 0),
    0,
  );

  // Live filter and sort logic for Admin Dashboard
  const filteredScouts = scouts
    .filter((scout) => {
      // 1. Filter by Troop Pill selection
      if (selectedTroop !== "All" && scout.troopNo !== selectedTroop) {
        return false;
      }

      // 2. Filter by search input (Name, Troop, or Badge name)
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const nameMatch = scout.name?.toLowerCase().includes(query);
        const troopMatch = scout.troopNo?.toLowerCase().includes(query);
        const badgeMatch = scout.badges?.some((b) =>
          b.name?.toLowerCase().includes(query),
        );
        return nameMatch || troopMatch || badgeMatch;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "badges-count") {
        return (b.badges?.length || 0) - (a.badges?.length || 0);
      }
      return 0;
    });

  // Grouping structure if "Group by Troop" is toggled
  const groupedScouts = filteredScouts.reduce((acc, scout) => {
    const troop = scout.troopNo || "Unknown";
    if (!acc[troop]) acc[troop] = [];
    acc[troop].push(scout);
    return acc;
  }, {});

  const toggleTroopCollapse = (troop) => {
    setCollapsedTroops((prev) => ({
      ...prev,
      [troop]: !prev[troop],
    }));
  };

  const handleLogout = () => {
    alert("Logging out from Galle District Scout Branch Portal...");
    setIsLoggedIn(false);
    setLoginRole(null);
    setLoggedInScoutId(null);
    setRole("Admin");
    setActiveView("dashboard");
    setSelectedScoutId(scouts.length > 0 ? scouts[0].id : null);
    setAdminPasscode("");
    setTempScoutId("");
    setLoginTab("scout");
  };

  // --- SUBVIEW RENDERING FUNCTIONS ---

  // 1. Admin Dashboard View (Scouts Directory & Stats)
  const renderDashboardView = () => {
    const rankCounts = scouts.reduce(
      (acc, scout) => {
        const earnedIds = scout.badges?.map((b) => b.id) || [];
        let r = "Tenderfoot Scout";
        if (earnedIds.includes(5)) r = "President's Scout";
        else if (earnedIds.includes(4)) r = "Prime Minister's Scout";
        else if (earnedIds.includes(3)) r = "Chief Commissioner's Scout";
        else if (earnedIds.includes(2)) r = "Scout Awardee";
        else if (earnedIds.includes(1)) r = "Membership Scout";
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      },
      {
        "Tenderfoot Scout": 0,
        "Membership Scout": 0,
        "Scout Awardee": 0,
        "Chief Commissioner's Scout": 0,
        "Prime Minister's Scout": 0,
        "President's Scout": 0,
      },
    );

    const presentScoutsCount = scouts.filter(
      (s) => s.status === "Present",
    ).length;
    const absentScoutsCount = totalScouts - presentScoutsCount;
    const attendanceRate =
      totalScouts > 0 ? (presentScoutsCount / totalScouts) * 100 : 0;

    const troopList = Object.keys(troopCounts)
      .filter((t) => t !== "Unknown" && t !== "All")
      .map((t) => ({
        name: t,
        count: troopCounts[t],
        percent: totalScouts > 0 ? (troopCounts[t] / totalScouts) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return (
      <div className="space-y-6">
        {/* Stats Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {/* Card 1: Total Scouts */}
          <div className="bg-emerald-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-all">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(5,196,107,0.15)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                Total Scouts
              </span>
              <span className="text-xl font-black text-white mt-0.5 block text-left">
                {totalScouts}
              </span>
            </div>
          </div>

          {/* Card 2: Attendance / Present Scouts */}
          <div className="bg-emerald-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-all">
            <div className="bg-green-500/10 p-3.5 rounded-xl border border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Present Scouts
              </span>
              <span className="text-xl font-black text-white mt-0.5 block">
                {presentScoutsCount}{" "}
                <span className="text-xs font-medium text-slate-400">
                  / {totalScouts}
                </span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
                {attendanceRate.toFixed(0)}% Present Today
              </span>
            </div>
          </div>

          {/* Card 3: Active Troops */}
          <div className="bg-emerald-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-all">
            <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(255,179,0,0.15)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                Active Troops
              </span>
              <span className="text-xl font-black text-white mt-0.5 block text-left">
                {totalTroopsCount}
              </span>
            </div>
          </div>

          {/* Card 4: Awarded Badges */}
          <div className="bg-emerald-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-all">
            <div className="bg-cyan-500/10 p-3.5 rounded-xl border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                Badges Awarded
              </span>
              <span className="text-xl font-black text-white mt-0.5 block text-left">
                {totalBadgesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Left Widget: Rank Distribution Chart */}
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full">
            <div className="border-b border-white/5 pb-2.5 mb-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Rank Distribution & Enrollment</span>
              </h3>
            </div>

            {/* Chart Area */}
            <div className="flex gap-4 items-stretch h-56 pt-2">
              {/* Y-Axis Labels */}
              <div className="flex flex-col justify-between text-[9px] font-bold text-slate-500 w-6 text-right pb-6">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Chart Grid/Canvas */}
              <div className="flex-1 flex items-end justify-between gap-1.5 border-l border-b border-white/10 pb-1 px-2 relative h-48">
                {/* Horizontal Guide Lines */}
                <div className="absolute left-0 right-0 top-0 border-t border-dashed border-white/5 pointer-events-none" />
                <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-white/5 pointer-events-none" />
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/5 pointer-events-none" />
                <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-white/5 pointer-events-none" />

                {Object.keys(rankCounts).map((rank) => {
                  const count = rankCounts[rank];
                  const percent =
                    totalScouts > 0 ? (count / totalScouts) * 100 : 0;

                  let barColor =
                    "from-emerald-500 to-teal-400 hover:shadow-emerald-500/20";
                  if (rank === "President's Scout")
                    barColor =
                      "from-amber-500 to-amber-300 hover:shadow-amber-500/20";
                  else if (rank === "Prime Minister's Scout")
                    barColor =
                      "from-orange-500 to-amber-400 hover:shadow-orange-500/20";
                  else if (rank === "Chief Commissioner's Scout")
                    barColor =
                      "from-cyan-500 to-blue-400 hover:shadow-cyan-500/20";
                  else if (rank === "Scout Awardee")
                    barColor =
                      "from-indigo-500 to-cyan-400 hover:shadow-indigo-500/20";
                  else if (rank === "Membership Scout")
                    barColor =
                      "from-purple-500 to-indigo-400 hover:shadow-purple-500/20";
                  else
                    barColor =
                      "from-slate-600 to-slate-400 hover:shadow-slate-600/20";

                  // Abbreviated label for display
                  let shortName = rank.split(" ")[0];
                  if (rank === "Chief Commissioner's Scout")
                    shortName = "Chief Comm.";
                  if (rank === "Prime Minister's Scout") shortName = "PM Scout";
                  if (rank === "President's Scout") shortName = "President";

                  return (
                    <div
                      key={rank}
                      className="flex-1 flex flex-col justify-end items-center group relative h-full"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-slate-950 border border-white/10 px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none text-left">
                        <span className="block text-[8px] text-slate-400 uppercase font-black">
                          {rank}
                        </span>
                        {count} {count === 1 ? "Scout" : "Scouts"} (
                        {percent.toFixed(0)}%)
                      </div>

                      {/* Bar */}
                      <div
                        className={`w-full max-w-[28px] rounded-t bg-gradient-to-t ${barColor} transition-all duration-1000 ease-out hover:brightness-110 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                        style={{ height: `${Math.max(percent, 4)}%` }}
                      />

                      {/* Label below axis */}
                      <span
                        className="text-[9px] font-bold text-slate-400 mt-2 truncate w-full text-center group-hover:text-white transition-colors"
                        title={rank}
                      >
                        {shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Widget: Daily Attendance Analysis (SVG Doughnut Chart) */}
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full">
            <div className="border-b border-white/5 pb-2.5 mb-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Daily Attendance Analysis</span>
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              {/* SVG Doughnut Chart */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 120 120"
                >
                  {/* Background Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-slate-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Foreground Present Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-emerald-400 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={314.16}
                    strokeDashoffset={314.16 - (314.16 * attendanceRate) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {attendanceRate.toFixed(0)}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Present
                  </span>
                </div>
              </div>

              {/* Stats & Controls */}
              <div className="space-y-4 text-left w-full sm:w-auto">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span>
                      Present: <strong>{presentScoutsCount}</strong> scouts
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-slate-700" />
                    <span>
                      Absent: <strong>{absentScoutsCount}</strong> scouts
                    </span>
                  </div>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={async () => {
                      if (!confirm("Mark all enrolled scouts as Present?"))
                        return;
                      try {
                        for (let scout of scouts) {
                          if (scout.status !== "Present") {
                            await fetch(
                              `https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/${scout.id}/status`,
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: "Present" }),
                              },
                            );
                          }
                        }
                        fetchScouts();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-600 text-emerald-400 hover:text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-300"
                  >
                    All Present
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        !confirm(
                          "Clear attendance and mark all scouts as Absent?",
                        )
                      )
                        return;
                      try {
                        for (let scout of scouts) {
                          if (scout.status !== "Absent") {
                            await fetch(
                              `https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/${scout.id}/status`,
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: "Absent" }),
                              },
                            );
                          }
                        }
                        fetchScouts();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School / Troop Participation progress spanning full width (Vertical Bar Chart) */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg animate-fade-in">
          <div className="border-b border-white/5 pb-2.5 mb-4 text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>School / Troop Participation Progress</span>
            </h3>
          </div>

          <div className="flex gap-4 items-stretch h-60 pt-2 overflow-x-auto custom-scrollbar">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-500 w-6 text-right pb-8 shrink-0">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Chart Grid/Canvas */}
            <div className="flex-1 flex items-end justify-between gap-3 border-l border-b border-white/10 pb-1 px-3 relative h-48 min-w-[500px]">
              {/* Horizontal Guide Lines */}
              <div className="absolute left-0 right-0 top-0 border-t border-dashed border-white/5 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-white/5 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/5 pointer-events-none" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-white/5 pointer-events-none" />

              {troopList.length > 0 ? (
                troopList.map((troop) => {
                  let barColor =
                    "from-emerald-500 to-teal-400 hover:shadow-emerald-500/20";

                  // Abbreviate long school names
                  const words = troop.name.split(" ");
                  let displayName = words.slice(0, 2).join(" ");
                  if (displayName.length > 18)
                    displayName = displayName.substring(0, 18) + "...";

                  return (
                    <div
                      key={troop.name}
                      className="flex-1 min-w-[50px] flex flex-col justify-end items-center group relative h-full"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-slate-950 border border-white/10 px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none text-left">
                        <span className="block text-[8px] text-slate-400 uppercase font-black">
                          {troop.name}
                        </span>
                        {troop.count} Enrolled ({troop.percent.toFixed(0)}%)
                      </div>

                      {/* Bar */}
                      <div
                        className={`w-full max-w-[32px] rounded-t bg-gradient-to-t ${barColor} transition-all duration-1000 ease-out hover:brightness-110 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                        style={{ height: `${Math.max(troop.percent, 4)}%` }}
                      />

                      {/* Label below axis */}
                      <span
                        className="text-[9px] font-bold text-slate-400 mt-2 truncate w-full text-center group-hover:text-white transition-colors"
                        title={troop.name}
                      >
                        {displayName}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 italic py-10 w-full text-center">
                  No troop enrollment data available.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search & Controls Panel */}
        <div className="bg-emerald-950/10 backdrop-blur-xl border border-white/5 rounded-2xl p-4 space-y-4 animate-fade-in shadow-lg">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, troop, or badge name (e.g. Camping)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 hover:border-white/15 focus:border-emerald-400 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters, Grouping, Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Sorting dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950/60 border border-white/10 hover:border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer transition-all"
              >
                <option value="newest">Newest Enrolled</option>
                <option value="oldest">Oldest Enrolled</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="badges-count">Most Badges</option>
              </select>

              {/* Group by Troop Toggle */}
              <button
                onClick={() => setGroupByTroop((prev) => !prev)}
                className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 ${
                  groupByTroop
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(5,196,107,0.1)]"
                    : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/15 hover:text-white"
                }`}
                title="Group scouts by their troop numbers"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Group by Troop</span>
              </button>

              {/* View Mode Grid/List */}
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-0.5 flex items-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Troop horizontal scrollable filter pills */}
          {uniqueTroops.length > 2 && (
            <div className="border-t border-white/5 pt-3">
              <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-0.5">
                Filter by Troop
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
                {uniqueTroops.map((troop) => {
                  const count =
                    troop === "All" ? totalScouts : troopCounts[troop] || 0;
                  const isSelected = selectedTroop === troop;
                  return (
                    <button
                      key={troop}
                      onClick={() => setSelectedTroop(troop)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
                        isSelected
                          ? "bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_10px_rgba(5,196,107,0.3)]"
                          : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {troop}{" "}
                      <span className="text-[9px] opacity-70 ml-0.5">
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Directory Section Header */}
        <div className="flex justify-between items-center bg-white/2 border border-white/5 rounded-2xl px-6 py-4">
          <span className="text-xs font-bold text-slate-300">
            Scouts Directory ({filteredScouts.length} of {scouts.length} shown)
          </span>
          <button
            onClick={fetchScouts}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>
              {error}. Please verify the backend API server is online.
            </span>
          </div>
        )}

        {/* Directory Content list */}
        {filteredScouts.length > 0 ? (
          groupByTroop ? (
            // Grouped listing
            <div className="space-y-4">
              {Object.keys(groupedScouts)
                .sort()
                .map((troop) => {
                  const scoutsInTroop = groupedScouts[troop];
                  const isCollapsed = !!collapsedTroops[troop];
                  return (
                    <div
                      key={troop}
                      className="bg-emerald-950/5 border border-white/5 rounded-2xl overflow-hidden shadow-sm hover:border-white/10 transition-all"
                    >
                      {/* Collapsible header */}
                      <button
                        onClick={() => toggleTroopCollapse(troop)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-white/2 hover:bg-white/5 transition-colors border-b border-white/5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-white">
                            {troop === "Unknown"
                              ? "No Assigned Troop"
                              : `Troop: ${troop}`}
                          </h3>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {scoutsInTroop.length}{" "}
                            {scoutsInTroop.length === 1 ? "Scout" : "Scouts"}
                          </span>
                        </div>
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {/* Collapsible Content */}
                      {!isCollapsed && (
                        <div className="p-4 space-y-4 animate-fade-in">
                          {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {scoutsInTroop.map((scout) => (
                                <ScoutCard
                                  key={scout.id}
                                  scout={scout}
                                  badges={
                                    badges.length > 0 ? badges : SYSTEM_BADGES
                                  }
                                  onBadgeAwarded={fetchScouts}
                                  onScoutDeleted={fetchScouts}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {scoutsInTroop.map((scout) => (
                                <ScoutListRow
                                  key={scout.id}
                                  scout={scout}
                                  badges={
                                    badges.length > 0 ? badges : SYSTEM_BADGES
                                  }
                                  onBadgeAwarded={fetchScouts}
                                  onScoutDeleted={fetchScouts}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : // Flat list rendering
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {filteredScouts.map((scout) => (
                <ScoutCard
                  key={scout.id}
                  scout={scout}
                  badges={badges.length > 0 ? badges : SYSTEM_BADGES}
                  onBadgeAwarded={fetchScouts}
                  onScoutDeleted={fetchScouts}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              {filteredScouts.map((scout) => (
                <ScoutListRow
                  key={scout.id}
                  scout={scout}
                  badges={badges.length > 0 ? badges : SYSTEM_BADGES}
                  onBadgeAwarded={fetchScouts}
                  onScoutDeleted={fetchScouts}
                />
              ))}
            </div>
          )
        ) : (
          <div className="bg-emerald-950/10 border border-dashed border-white/10 rounded-2xl py-20 flex flex-col items-center justify-center text-slate-400 text-center animate-fade-in">
            <Compass className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
            <h3 className="text-base font-bold text-white mb-1">
              No Scouts Found
            </h3>
            <p className="text-xs max-w-xs px-4">
              No scouts match your search or filter criteria. Try clearing the
              filters or search query.
            </p>
          </div>
        )}
      </div>
    );
  };

  // 2. Scout Progress Dashboard View (Personalized progress page)
  const renderScoutProgressView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="animate-spin h-8 w-8 text-emerald-400" />
          <span className="text-sm text-slate-400 font-medium">
            Loading Scout Profile...
          </span>
        </div>
      );
    }

    if (!activeScout) {
      return (
        <div className="bg-emerald-950/5 border border-dashed border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-2">
            No Active Profile Selected
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Please select a scout profile from the sidebar to track active
            progress.
          </p>
        </div>
      );
    }

    const activeBadgesList = badges.length > 0 ? badges : SYSTEM_BADGES;
    const earnedIds = activeScout.badges.map((b) => b.id);
    const earnedCount = activeScout.badges.length;
    const totalCount = activeBadgesList.length;

    // Calculate rank and progress percentage based on core milestone badges (IDs 1-5)
    let scoutRank = "Tenderfoot Scout";
    let rankDesc = "Enrolled and started their scouting journey.";
    let milestoneProgress = 10;

    if (earnedIds.includes(5)) {
      scoutRank = "President's Scout";
      rankDesc =
        "Pinnacle rank: Awarded for exceptional mastery of survival, service, and leadership.";
      milestoneProgress = 100;
    } else if (earnedIds.includes(4)) {
      scoutRank = "Prime Minister's Scout";
      rankDesc =
        "Advanced rank: Fitness, mapping navigation, organizing exploratory hikes, and public health tasks.";
      milestoneProgress = 80;
    } else if (earnedIds.includes(3)) {
      scoutRank = "Chief Commissioner's Scout";
      rankDesc =
        "Intermediate rank: Advanced pioneering structures, service projects, and environmental conservation.";
      milestoneProgress = 60;
    } else if (earnedIds.includes(2)) {
      scoutRank = "Scout Awardee";
      rankDesc =
        "Baseline outdoor rank: CAMPER, simple pioneering, map reading, and basic first aid.";
      milestoneProgress = 40;
    } else if (earnedIds.includes(1)) {
      scoutRank = "Membership Scout";
      rankDesc =
        "First rank: Covered promise, law, salute, sign, and Baden-Powell history.";
      milestoneProgress = 20;
    }

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Profile Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-950/30 to-slate-900/30 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-400/50 bg-slate-950 shrink-0 shadow-[0_0_15px_rgba(5,196,107,0.2)]">
            <img
              src={
                activeScout.profileImageUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              }
              alt={activeScout.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
              }}
            />
          </div>
          <div className="text-center md:text-left space-y-1">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {scoutRank}
            </span>
            <h2 className="text-2xl font-black text-white pt-1">
              {activeScout.name}
            </h2>
            <p className="text-xs text-slate-400">
              Troop Group:{" "}
              <strong className="text-slate-200">{activeScout.troopNo}</strong>{" "}
              &bull; Enrollment ID: #{activeScout.id}
            </p>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Progress Circle Card */}
          <div className="lg:col-span-1 bg-emerald-950/20 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider self-start border-b border-white/5 pb-2 w-full text-left">
              Overall Progress
            </h3>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-400 transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * milestoneProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">
                  {earnedCount}
                </span>
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">
                  of {totalCount} Badges
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-200 block">
                {milestoneProgress}% Milestone Progress
              </span>
              <p className="text-[11px] text-slate-400 max-w-xs">{rankDesc}</p>
            </div>
          </div>

          {/* Right Column (2 spans): Badge Tracker List */}
          <div className="lg:col-span-2 bg-emerald-950/20 border border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Badge Checklist Tracker
              </h3>

              {/* Category Filter Pills for Progress Checklist */}
              {badges.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                  {[
                    "All",
                    "Milestone",
                    "Leadership",
                    "Group A: Public Service",
                    "Group B: Camp Craft",
                    "Group C: Science & Tech",
                    "Group D: Hobbies & Culture",
                    "Group E: Air Scouting",
                    "Group F: Sea Scouting",
                    "Group G: Global Alignment",
                  ].map((cat) => {
                    const isSelected = progressCategory === cat;
                    const displayCat = cat
                      .replace("Group ", "Gr. ")
                      .replace(": Public Service", "")
                      .replace(": Camp Craft", "")
                      .replace(": Science & Tech", "")
                      .replace(": Hobbies & Culture", "")
                      .replace(": Air Scouting", "")
                      .replace(": Sea Scouting", "")
                      .replace(": Global Alignment", "");
                    return (
                      <button
                        key={cat}
                        onClick={() => setProgressCategory(cat)}
                        className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-all shrink-0 ${
                          isSelected
                            ? "bg-emerald-400 text-emerald-950 font-bold"
                            : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {displayCat}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {activeBadgesList
                .filter(
                  (b) =>
                    progressCategory === "All" ||
                    b.category === progressCategory,
                )
                .map((badge) => {
                  const isEarned = activeScout.badges.some(
                    (b) => b.id === badge.id,
                  );
                  return (
                    <div
                      key={badge.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                        isEarned
                          ? "bg-emerald-500/5 border-emerald-500/20 text-slate-200 shadow-sm"
                          : "bg-slate-950/40 border-white/5 text-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl border shrink-0 ${
                            isEarned
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-slate-900 border-white/5 text-slate-700"
                          }`}
                        >
                          {isEarned ? (
                            <CheckCircle2 className="w-4.5 h-4.5" />
                          ) : (
                            <Lock className="w-4.5 h-4.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`text-xs font-bold block ${isEarned ? "text-white" : "text-slate-500"}`}
                          >
                            {badge.name}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                            {badge.description}
                          </p>
                          {badge.category && (
                            <span className="inline-block mt-1 text-[8px] bg-white/5 text-slate-500 px-1.5 py-0.5 rounded uppercase font-semibold">
                              {badge.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        {badge.iconUrl && (
                          <img
                            src={badge.iconUrl}
                            alt=""
                            className="w-7 h-7 object-contain"
                          />
                        )}
                        {isEarned ? (
                          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Awarded
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-900 border border-white/5 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. Program & Handbook Downloads View
  const renderProgramView = () => {
    const activeProgramsList = programs.length > 0 ? programs : MOCK_PROGRAMS;

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-black text-white">
            Galle District training programs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review official training programs and download student syllabus
            handbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeProgramsList.map((program) => (
            <div
              key={program.id || program.ProgramID}
              className="bg-emerald-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/15 transition-all shadow-lg group relative"
            >
              {role === "Admin" && (
                <button
                  onClick={() => setEditingProgram(program)}
                  className="absolute top-4 right-4 bg-slate-950/60 hover:bg-emerald-500 border border-white/10 hover:border-emerald-400 text-slate-400 hover:text-slate-950 p-1.5 rounded-lg text-[10px] font-bold transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-1 shadow-md z-10"
                  title="Edit Program Details"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {program.ageGroup}
                  </span>
                  <BookOpen className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>

                {program.imageUrl && (
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-white/5 bg-slate-950/50">
                    <img
                      src={program.imageUrl}
                      alt={program.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Syllabus points */}
                {program.syllabus && program.syllabus.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      Key Syllabus Requirements
                    </span>
                    <ul className="space-y-1.5">
                      {program.syllabus.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-[10px] text-slate-300 flex items-start gap-1.5"
                        >
                          <ArrowRight className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Handbook download link */}
              {program.fileUrl ? (
                <a
                  href={program.fileUrl}
                  download={
                    program.downloadName ||
                    `${program.name.replace(/\s+/g, "_")}_Handbook.txt`
                  }
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-[0_0_15px_rgba(5,196,107,0.3)] mt-6 w-full shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Handbook</span>
                </a>
              ) : (
                <div className="text-[10px] text-slate-500 italic text-center mt-6">
                  No Handbook Available
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 4. Badge System view (detailed requirements and who earned them)
  const renderBadgesView = () => {
    const activeBadgesList = badges.length > 0 ? badges : SYSTEM_BADGES;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">
              District Badge System
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Qualifying requirements for the {activeBadgesList.length} official
              badges and dynamic list of scouts who earned them.
            </p>
          </div>

          {/* Category Filter Pills for Badge Catalog */}
          {badges.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 max-w-full custom-scrollbar">
              {[
                "All",
                "Milestone",
                "Leadership",
                "Group A: Public Service",
                "Group B: Camp Craft",
                "Group C: Science & Tech",
                "Group D: Hobbies & Culture",
                "Group E: Air Scouting",
                "Group F: Sea Scouting",
                "Group G: Global Alignment",
              ].map((cat) => {
                const isSelected = badgeSystemCategory === cat;
                const displayCat = cat
                  .replace("Group ", "Gr. ")
                  .replace(": Public Service", "")
                  .replace(": Camp Craft", "")
                  .replace(": Science & Tech", "")
                  .replace(": Hobbies & Culture", "")
                  .replace(": Air Scouting", "")
                  .replace(": Sea Scouting", "")
                  .replace(": Global Alignment", "");
                return (
                  <button
                    key={cat}
                    onClick={() => setBadgeSystemCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                      isSelected
                        ? "bg-emerald-400 text-emerald-950 shadow-[0_0_10px_rgba(5,196,107,0.3)]"
                        : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {displayCat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeBadgesList
            .filter(
              (b) =>
                badgeSystemCategory === "All" ||
                b.category === badgeSystemCategory,
            )
            .map((badge) => {
              // Find scouts who earned this specific badge
              const achievers = scouts.filter((s) =>
                s.badges.some((b) => b.id === badge.id),
              );

              return (
                <div
                  key={badge.id}
                  className="bg-emerald-950/20 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-5 hover:border-white/15 transition-all duration-300 relative group/card"
                >
                  {role === "Admin" && (
                    <button
                      onClick={() => setEditingBadge(badge)}
                      className="absolute top-4 right-4 bg-slate-950/60 hover:bg-emerald-500 border border-white/10 hover:border-emerald-400 text-slate-400 hover:text-slate-950 p-1.5 rounded-lg text-[10px] font-bold transition-all opacity-0 group-hover/card:opacity-100 focus:opacity-100 flex items-center gap-1 shadow-md z-10"
                      title="Edit Badge Details"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 p-2 shrink-0 border border-white/5 flex items-center justify-center shadow-inner">
                      <img
                        src={
                          badge.iconUrl ||
                          "https://img.icons8.com/color/96/medal.png"
                        }
                        alt={badge.name}
                        className="w-full h-full object-contain"
                        onError={(e) =>
                          (e.target.src =
                            "https://img.icons8.com/color/96/medal.png")
                        }
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {badge.description}
                      </p>

                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {badge.category && (
                          <span className="text-[9px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md font-semibold">
                            Category: {badge.category}
                          </span>
                        )}
                        <span className="text-[9px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md font-semibold">
                          Required for:{" "}
                          {badge.id === 1
                            ? "Tenderfoot & Above"
                            : badge.id <= 5
                              ? "Milestone Ranks"
                              : "Proficiency Awards"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Earned Scouts Avatars Group */}
                  <div className="border-t border-white/5 pt-4 mt-auto">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                      Scouts Who Earned This Badge ({achievers.length})
                    </span>
                    {achievers.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2.5 overflow-hidden">
                          {achievers.slice(0, 5).map((scout) => (
                            <img
                              key={scout.id}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                              src={
                                scout.profileImageUrl ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                              }
                              alt={scout.name}
                              title={`${scout.name} (${scout.troopNo})`}
                              onError={(e) =>
                                (e.target.src =
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200")
                              }
                            />
                          ))}
                        </div>
                        {achievers.length > 5 && (
                          <span className="text-[10px] text-slate-400 font-bold ml-1">
                            +{achievers.length - 5} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic block">
                        No scouts awarded this badge yet
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  // Edit Badge Modal
  const renderEditBadgeModal = () => {
    if (!editingBadge) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in animate-duration-300">
        <div className="fixed inset-0" onClick={() => setEditingBadge(null)} />

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full z-10 shadow-2xl relative space-y-5">
          <button
            onClick={() => setEditingBadge(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <h3 className="text-base font-bold text-white">
              Edit Badge Details
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Modify badge name, description, category, or upload a custom icon.
            </p>
          </div>

          <form onSubmit={handleUpdateBadge} className="space-y-4 text-left">
            {/* Badge Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Badge Name
              </label>
              <input
                type="text"
                required
                defaultValue={editingBadge.name}
                name="badgeName"
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Category / Group
              </label>
              <select
                name="badgeCategory"
                defaultValue={editingBadge.category || "Milestone"}
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer transition-all"
              >
                <option value="Milestone">Milestone</option>
                <option value="Leadership">Leadership</option>
                <option value="Group A: Public Service">
                  Group A: Public Service
                </option>
                <option value="Group B: Camp Craft">Group B: Camp Craft</option>
                <option value="Group C: Science & Tech">
                  Group C: Science & Tech
                </option>
                <option value="Group D: Hobbies & Culture">
                  Group D: Hobbies & Culture
                </option>
                <option value="Group E: Air Scouting">
                  Group E: Air Scouting
                </option>
                <option value="Group F: Sea Scouting">
                  Group F: Sea Scouting
                </option>
                <option value="Group G: Global Alignment">
                  Group G: Global Alignment
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="badgeDescription"
                defaultValue={editingBadge.description || ""}
                rows={3}
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all resize-none"
              />
            </div>

            {/* Badge Icon Upload */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Badge Icon Image
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-950 border border-white/5 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={
                      editingBadge.iconUrl ||
                      "https://img.icons8.com/color/96/medal.png"
                    }
                    alt=""
                    className="w-full h-full object-contain"
                    id="edit-badge-preview"
                    onError={(e) =>
                      (e.target.src =
                        "https://img.icons8.com/color/96/medal.png")
                    }
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    name="badgeIcon"
                    id="badge-icon-file-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          document.getElementById("edit-badge-preview").src =
                            event.target.result;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="badge-icon-file-input"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all w-max"
                  >
                    Choose Image File
                  </label>
                  <span className="block text-[9px] text-slate-500 mt-1">
                    Recommended size: PNG square, max 4MB.
                  </span>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingBadge(null)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSubmitLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-emerald-800 disabled:to-teal-800 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                {editSubmitLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 5. Leaders View (district leaders directory)
  const renderLeadersView = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black text-white">
          District Leaders Directory
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Officers, commissioners, and instructors of the Galle District Scout
          Branch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_LEADERS.map((leader) => (
          <div
            key={leader.id}
            className="bg-emerald-950/20 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg group hover:border-white/15 transition-all"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-slate-900 shrink-0 group-hover:scale-105 transition-all duration-300">
              <img
                src={leader.photoUrl}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors leading-tight">
              {leader.name}
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase mt-1 leading-normal">
              {leader.role}
            </span>

            <div className="w-full border-t border-white/5 pt-3.5 mt-4 space-y-1.5 text-left text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{leader.troop}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <a
                  href={`mailto:${leader.email}`}
                  className="truncate hover:text-emerald-400 transition-colors"
                >
                  {leader.email}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 6. Events View (upcoming camporees and meets)
  const renderEventsView = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black text-white">
          Upcoming Events Calendar
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Galle District camporees, badge meets, workshops, and qualifying
          evaluations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-emerald-950/20 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 hover:border-white/15 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    event.category === "Camporee"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : event.category === "Evaluation"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  }`}
                >
                  {event.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{event.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="border-t border-white/5 pt-3.5 space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 7. Add Scout View (enrollment form page)
  const renderAddScoutView = () => (
    <div className="max-w-xl mx-auto py-4 animate-fade-in w-full">
      <EnrollForm onScoutEnrolled={fetchScouts} />
    </div>
  );

  // 8. News & Announcements View
  const renderNewsView = () => {
    // Merge database news and mock news. Map db attributes to match UI card structures.
    const displayNews = (news.length > 0 ? news : MOCK_NEWS).map((item) => ({
      id: item.id,
      title: item.title,
      date: item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : item.date || new Date().toLocaleDateString(),
      summary:
        item.summary ||
        (item.content.length > 120
          ? item.content.substring(0, 120) + "..."
          : item.content),
      content: item.content,
      category: item.category || "Voice Announcement",
      image:
        item.image ||
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400",
    }));

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-black text-white">
            District News & Announcements
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated with local news, disaster relief missions, and general
            announcements.
          </p>
        </div>

        {/* Voice Announcement Publisher widget (Visible only to Admins) */}
        {role === "Admin" && (
          <div className="max-w-2xl">
            <VoiceNewsPublisher onNewsPublished={fetchNews} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayNews.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-all shadow-lg flex flex-col group text-left"
            >
              {item.image && (
                <div className="h-40 w-full overflow-hidden border-b border-white/5 relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-md px-2 py-0.5 shadow-sm uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold">
                    {item.date}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <details className="cursor-pointer group/details">
                    <summary className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors list-none select-none flex items-center gap-1">
                      <span>Read Full Article</span>
                      <ChevronDown className="w-3 h-3 transition-transform group-open/details:rotate-180" />
                    </summary>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2.5 pt-2 border-t border-white/5 border-dashed">
                      {item.content}
                    </p>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 9. Login/Landing Screen View
  const renderLoginScreen = () => {
    const handleAdminSubmit = (e) => {
      e.preventDefault();
      if (adminPasscode.toLowerCase() === "admin" || adminPasscode === "1234") {
        setLoginRole("admin");
        setRole("Admin");
        setIsLoggedIn(true);
        setActiveView("dashboard");
      } else {
        alert("Invalid admin passcode! Hint: use 'admin'");
      }
    };

    const handleScoutSubmit = (e) => {
      e.preventDefault();
      if (!tempScoutId) {
        alert("Please select your scout profile to login.");
        return;
      }
      const sId = parseInt(tempScoutId);
      setLoggedInScoutId(sId);
      setSelectedScoutId(sId);
      setLoginRole("scout");
      setRole("Scout");
      setIsLoggedIn(true);
      setActiveView("dashboard");
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans w-full">
        {/* Decorative background glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#05c46b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl relative z-10 min-h-[500px]">
          {/* Left panel: Branding and welcome */}
          <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 p-8 flex flex-col justify-between border-r border-white/5 relative text-left">
            <div className="absolute inset-0 opacity-5 flex items-center justify-center select-none pointer-events-none">
              <Compass className="w-64 h-64 text-emerald-400" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <img
                src="/galle_district.png"
                alt="Galle Logo"
                className="w-12 h-12 object-contain bg-slate-900/50 rounded-xl p-1 border border-emerald-500/30"
                onError={(e) => {
                  e.target.src = "https://img.icons8.com/color/96/compass.png";
                }}
              />
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider leading-tight">
                  Galle District
                </h2>
                <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">
                  Scout Branch
                </span>
              </div>
            </div>

            <div className="space-y-4 my-12 relative z-10">
              <h1 className="text-2xl font-black text-white leading-tight">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  ScoutPuls Portal
                </span>
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Official resource coordination platform for the Galle District
                Scout Branch. Access Handbooks, track rank achievements, view
                upcoming events, and coordinate proficiency badge workflows.
              </p>
            </div>

            <div className="text-[10px] text-slate-500 font-semibold relative z-10">
              © 2026 Sri Lanka Scouts Association & bull; Galle Branch
            </div>
          </div>

          {/* Right panel: Login forms */}
          <div className="p-8 flex flex-col justify-center space-y-6">
            <div className="space-y-1 text-left">
              <h2 className="text-lg font-black text-white">Portal Sign In</h2>
              <p className="text-xs text-slate-400">
                Choose your account type to access the system resources.
              </p>
            </div>

            {/* Portal type toggle */}
            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-white/5 shrink-0">
              <button
                onClick={() => setLoginTab("scout")}
                type="button"
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  loginTab === "scout"
                    ? "bg-emerald-400 text-emerald-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Scout Member
              </button>
              <button
                onClick={() => setLoginTab("admin")}
                type="button"
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  loginTab === "admin"
                    ? "bg-emerald-400 text-emerald-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Scoutmaster (Admin)
              </button>
            </div>

            {loginTab === "admin" ? (
              /* Admin Login Form */
              <form
                onSubmit={handleAdminSubmit}
                className="space-y-4 text-left"
              >
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Admin Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter admin passcode (e.g. admin)"
                    className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Access Scoutmaster Portal</span>
                </button>
              </form>
            ) : (
              /* Scout Login Form */
              <form
                onSubmit={handleScoutSubmit}
                className="space-y-4 text-left"
              >
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Select Scout Profile
                  </label>
                  {scouts.length > 0 ? (
                    <select
                      value={tempScoutId}
                      onChange={(e) => setTempScoutId(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer transition-all"
                    >
                      <option value="">-- Choose your profile --</option>
                      {scouts.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.troopNo})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-slate-950/50 border border-dashed border-white/10 rounded-xl p-4 text-center text-xs text-slate-500">
                      No registered scouts found. Please ask your Scoutmaster to
                      enroll you.
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={scouts.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-emerald-800 disabled:to-teal-800 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Access Scout Member Portal</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Edit Program Modal
  const renderEditProgramModal = () => {
    if (!editingProgram) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in animate-duration-300">
        <div
          className="fixed inset-0"
          onClick={() => setEditingProgram(null)}
        />

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full z-10 shadow-2xl relative space-y-5">
          <button
            onClick={() => setEditingProgram(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <h3 className="text-base font-bold text-white">
              Edit Program Details
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Modify program name, age group, description, syllabus, or upload
              cover/handbook files.
            </p>
          </div>

          <form
            onSubmit={handleUpdateProgram}
            className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar"
          >
            {/* Program Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Program Name
              </label>
              <input
                type="text"
                required
                defaultValue={editingProgram.name}
                name="programName"
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
              />
            </div>

            {/* Age Group */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Age Group
              </label>
              <input
                type="text"
                required
                defaultValue={editingProgram.ageGroup}
                name="programAgeGroup"
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="programDescription"
                defaultValue={editingProgram.description || ""}
                rows={3}
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all resize-none"
              />
            </div>

            {/* Syllabus */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Syllabus Requirements (One per line)
              </label>
              <textarea
                name="programSyllabus"
                defaultValue={
                  editingProgram.syllabus
                    ? editingProgram.syllabus.join("\n")
                    : ""
                }
                rows={4}
                placeholder="Learn to work in small packs&#10;Understand the Sigithi Scout Law"
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all resize-none"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Cover Image
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-lg bg-slate-950 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={
                      editingProgram.imageUrl ||
                      "https://via.placeholder.com/150?text=No+Cover"
                    }
                    alt=""
                    className="w-full h-full object-cover"
                    id="edit-program-image-preview"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/150?text=No+Cover")
                    }
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    name="programImage"
                    id="program-image-file-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          document.getElementById(
                            "edit-program-image-preview",
                          ).src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="program-image-file-input"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all w-max"
                  >
                    Choose Image File
                  </label>
                  <span className="block text-[8px] text-slate-500 mt-1">
                    PNG/JPG, max 4MB.
                  </span>
                </div>
              </div>
            </div>

            {/* Handbook File Upload */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Handbook Document File
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    name="programHandbook"
                    id="program-handbook-file-input"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const label = document.getElementById(
                        "program-handbook-filename-label",
                      );
                      if (file && label) {
                        label.textContent = `Selected: ${file.name}`;
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="program-handbook-file-input"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all w-max shrink-0"
                    >
                      Choose Handbook File
                    </label>
                    <span
                      id="program-handbook-filename-label"
                      className="text-[10px] text-slate-400 truncate max-w-[200px]"
                      title={
                        editingProgram.fileUrl
                          ? editingProgram.fileUrl.split("/").pop()
                          : "No file chosen"
                      }
                    >
                      {editingProgram.fileUrl
                        ? editingProgram.fileUrl.split("/").pop()
                        : "No file chosen"}
                    </span>
                  </div>
                  <span className="block text-[8px] text-slate-500 mt-1">
                    PDF or TXT documents, max 4MB.
                  </span>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingProgram(null)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={programSubmitLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-emerald-800 disabled:to-teal-800 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                {programSubmitLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Master view router helper
  const renderActiveView = () => {
    if (role === "Admin") {
      switch (activeView) {
        case "dashboard":
          return renderDashboardView();
        case "program":
          return renderProgramView();
        case "add_scout":
          return renderAddScoutView();
        case "badges":
          return renderBadgesView();
        case "leaders":
          return renderLeadersView();
        case "events":
          return renderEventsView();
        case "news":
          return renderNewsView();
        default:
          return renderDashboardView();
      }
    } else {
      switch (activeView) {
        case "dashboard":
          return renderScoutProgressView();
        case "program":
          return renderProgramView(); // Handbooks page
        case "badges":
          return renderBadgesView(); // Reused badges view
        case "events":
          return renderEventsView(); // Reused events view
        case "news":
          return renderNewsView();
        default:
          return renderScoutProgressView();
      }
    }
  };

  if (!isLoggedIn) {
    return renderLoginScreen();
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-row font-sans">
      {/* Left Sidebar */}
      <Sidebar
        role={role}
        setRole={setRole}
        activeView={activeView}
        setActiveView={setActiveView}
        scouts={scouts}
        selectedScoutId={selectedScoutId}
        setSelectedScoutId={setSelectedScoutId}
        onLogout={handleLogout}
        hideSwitcher={loginRole === "scout"}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-950/10">
        {/* Simple top info bar */}
        <header className="bg-slate-900/40 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Galle District Scout Branch &bull;{" "}
              {role === "Admin" ? "Admin Panel" : "Scout Portal"}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
              {role === "Admin"
                ? "Role: Scoutmaster"
                : `Active Scout: ${activeScout?.name || "Guest"}`}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs shadow-inner">
              {role === "Admin"
                ? "A"
                : activeScout?.name
                  ? activeScout.name[0].toUpperCase()
                  : "S"}
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <div className="p-8 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-start">
          {renderActiveView()}
        </div>

        {/* Footer */}
        <footer className="bg-slate-950/40 border-t border-white/5 py-5 text-center text-xs text-slate-500 shrink-0">
          <p>
            ScoutPuls &mdash; Galle District Scout Branch Portal. Built for
            Azure Free Tier & SQL Database.
          </p>
        </footer>
      </div>

      {/* Edit Badge Modal */}
      {renderEditBadgeModal()}

      {/* Edit Program Modal */}
      {renderEditProgramModal()}
    </div>
  );
}
