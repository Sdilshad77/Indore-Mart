import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { getAllUsers, userUpdate } from "../../features/admin/adminSlice";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

function AdminAllUsers() {
    const { user } = useSelector((state) => state.auth);
    const { adminLoading, adminError, adminSuccess, adminErrorMessage, allUsers } =
        useSelector((state) => state.admin);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const handleUpdateUser = (userDetails) => {
        dispatch(userUpdate(userDetails));
    };

    useEffect(() => {
        if (user?.isAdmin) {
            dispatch(getAllUsers());
        }
        if (!user?.isAdmin || !user) {
            navigate("/login");
        }
        if (adminError && adminErrorMessage) {
            toast.error(adminErrorMessage, { position: "top-center" });
        }
    }, [user, adminError, adminErrorMessage]);

    const filtered = useMemo(() => {
        if (!allUsers) return [];
        return allUsers.filter((u) => {
            const q = search.toLowerCase().trim();
            const matchQ =
                !q ||
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q);
            const matchR =
                roleFilter === "all" ||
                (roleFilter === "shop" && u.isShopOwner) ||
                (roleFilter === "user" && !u.isShopOwner);
            return matchQ && matchR;
        });
    }, [allUsers, search, roleFilter]);

    const stats = useMemo(() => {
        const total = allUsers?.length || 0;
        const active = allUsers?.filter((u) => u.isActive).length || 0;
        const shops = allUsers?.filter((u) => u.isShopOwner).length || 0;
        return { total, active, shops, inactive: total - active };
    }, [allUsers]);

    const initials = (name = "") =>
        name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

    const timeAgo = (date) => {
        const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (s < 60) return `${s}s ago`;
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        const d = Math.floor(s / 86400);
        if (d < 30) return `${d}d ago`;
        return new Date(date).toLocaleDateString("en-IN");
    };

    if (adminLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm tracking-widest uppercase text-white/60">
                        loading users...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex h-screen overflow-hidden bg-black text-white"
            style={{
                backgroundImage:
                    "radial-gradient(circle at 20% 0%, rgba(22,213,129,0.15), transparent 50%), radial-gradient(circle at 80% 100%, rgba(22,213,129,0.08), transparent 50%)",
            }}
        >
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />

                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
                    {/* Hero */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Users · Live
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                the <span className="text-emerald-400">people</span> 👥
                            </h1>
                            <p className="text-sm text-white/50 mt-2">
                                everyone who's vibing on the platform rn
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="search by name / email..."
                                    className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                    🔍
                                </span>
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-400/50 transition cursor-pointer"
                            >
                                <option value="all" className="bg-black">All Roles</option>
                                <option value="user" className="bg-black">Customers</option>
                                <option value="shop" className="bg-black">Shop Owners</option>
                            </select>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total", value: stats.total, emoji: "👤", accent: "from-emerald-400/20" },
                            { label: "Active", value: stats.active, emoji: "✅", accent: "from-emerald-400/20" },
                            { label: "Inactive", value: stats.inactive, emoji: "💤", accent: "from-rose-400/20" },
                            { label: "Shop Owners", value: stats.shops, emoji: "🏪", accent: "from-amber-400/20" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 hover:-translate-y-1 hover:border-emerald-400/30 transition-all duration-300"
                            >
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.accent} to-transparent blur-2xl`} />
                                <div className="relative">
                                    <div className="text-2xl mb-2">{s.emoji}</div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                                        {s.label}
                                    </div>
                                    <div className="text-3xl font-black mt-1">{s.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Users table card */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold tracking-tight">
                                    user directory
                                </h2>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                                    {filtered.length} shown
                                </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                                Sorted · Newest
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/10">
                                        <th className="px-6 py-4 text-left font-medium">User</th>
                                        <th className="px-6 py-4 text-left font-medium">Contact</th>
                                        <th className="px-6 py-4 text-left font-medium">Role</th>
                                        <th className="px-6 py-4 text-left font-medium">Status</th>
                                        <th className="px-6 py-4 text-left font-medium">Joined</th>
                                        <th className="px-6 py-4 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="text-5xl mb-3">🫥</div>
                                                <div className="text-white/50 text-sm">
                                                    no users match your vibe check
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {filtered.map((u) => (
                                        <tr
                                            key={u._id}
                                            className="border-b border-white/5 hover:bg-white/[0.04] transition group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-sm shrink-0">
                                                        {initials(u.name)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-white">
                                                            {u.name}
                                                        </div>
                                                        <div className="text-[11px] text-white/40 font-mono">
                                                            #{u._id?.slice(-6)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-white/80">{u.email}</div>
                                                {u.phone && (
                                                    <div className="text-[11px] text-white/40">{u.phone}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                        u.isShopOwner
                                                            ? "bg-amber-400/10 text-amber-300 border-amber-400/20"
                                                            : "bg-white/5 text-white/70 border-white/10"
                                                    }`}
                                                >
                                                    {u.isShopOwner ? "🏪 Shop Owner" : "👤 Customer"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                        u.isActive
                                                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                                                            : "bg-rose-400/10 text-rose-400 border border-rose-400/20"
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            u.isActive
                                                                ? "bg-emerald-400 animate-pulse"
                                                                : "bg-rose-400"
                                                        }`}
                                                    />
                                                    {u.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-white/70">
                                                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                                                </div>
                                                <div className="text-[11px] text-white/40">
                                                    {timeAgo(u.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {u.isActive ? (
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateUser({
                                                                userId: u._id,
                                                                isActive: false,
                                                            })
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-rose-400/10 text-rose-400 border border-rose-400/20 text-xs font-semibold hover:bg-rose-400 hover:text-black transition"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateUser({
                                                                userId: u._id,
                                                                isActive: true,
                                                            })
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-xs font-semibold hover:bg-emerald-400 hover:text-black transition"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminAllUsers;
