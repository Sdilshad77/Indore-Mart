import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, getAllShops, getAllUsers } from "../../features/admin/adminSlice";
import ShopApprovalListGroup from "../../components/admin/ShopApprovalListGroup";
import { toast } from "react-toastify";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const {
    adminLoading,
    adminError,
    adminErrorMessage,
    allUsers,
    allOrders,
    allShops,
  } = useSelector((state) => state.admin);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(getAllUsers());
      dispatch(getAllOrders());
      dispatch(getAllShops());
    }
    if (!user?.isAdmin) navigate("/login");
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: "top-center" });
    }
  }, [user]);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-black text-emerald-400 flex items-center justify-center text-4xl font-black tracking-tight animate-pulse">
        loading the chaos...
      </div>
    );
  }

  // Totals
  const totalRevenue = allOrders?.reduce((sum, o) => sum + (o?.totalBillAmount || 0), 0) || 0;
  const pendingShops = allShops?.filter((s) => s.status !== "accepted").length || 0;

  // Transactions = recent orders treated as txns
  const transactions = [...(allOrders || [])]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

  // Duration helper
  const timeAgo = (date) => {
    if (!date) return "just now";
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const statusPill = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver") || s.includes("complete") || s.includes("accept"))
      return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
    if (s.includes("pend") || s.includes("process"))
      return "bg-amber-400/10 text-amber-400 border-amber-400/30";
    if (s.includes("cancel") || s.includes("reject"))
      return "bg-rose-400/10 text-rose-400 border-rose-400/30";
    return "bg-white/5 text-white/70 border-white/10";
  };

  const stats = [
    {
      label: "Total Users",
      value: allUsers?.length || 0,
      delta: "+12%",
      emoji: "👥",
      accent: "from-emerald-400/20 to-emerald-400/0",
      ring: "ring-emerald-400/30",
    },
    {
      label: "Total Orders",
      value: allOrders?.length || 0,
      delta: "+8%",
      emoji: "📦",
      accent: "from-sky-400/20 to-sky-400/0",
      ring: "ring-sky-400/30",
    },
    {
      label: "Total Shops",
      value: allShops?.length || 0,
      delta: "+23%",
      emoji: "🏪",
      accent: "from-amber-400/20 to-amber-400/0",
      ring: "ring-amber-400/30",
    },
    {
      label: "Pending Approvals",
      value: pendingShops,
      delta: "urgent",
      emoji: "⚡",
      accent: "from-rose-400/20 to-rose-400/0",
      ring: "ring-rose-400/30",
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main
          className="flex-1 overflow-y-auto p-6 relative"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(16,185,129,0.10), transparent 40%), radial-gradient(circle at 80% 100%, rgba(16,185,129,0.06), transparent 40%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "auto, auto, 40px 40px, 40px 40px",
          }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Hero strip */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  LIVE • ADMIN CONTROL
                </span>
                <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tighter leading-none">
                  yo, <span className="text-emerald-400">{user?.name?.split(" ")[0] || "boss"}</span> 👋
                </h1>
                <p className="mt-2 text-white/60 text-sm">
                  here's what's cooking on IndoreMart today.
                </p>
              </div>

              <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-2xl px-5 py-4 backdrop-blur">
                <p className="text-xs text-emerald-300/80 uppercase tracking-widest">Revenue today</p>
                <p className="text-3xl font-black text-emerald-400">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 ring-1 ${s.ring}`}
                >
                  <div
                    className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${s.accent} blur-2xl rounded-full pointer-events-none`}
                  />
                  <div className="flex items-center justify-between mb-6 relative">
                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl">
                      {s.emoji}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 rounded-full">
                      {s.delta}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                    {s.label}
                  </p>
                  <p className="text-4xl font-black tracking-tight">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Transactions */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Recent Transactions 💸</h3>
                  <p className="text-xs text-white/50 mt-1">live feed from your shops</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-full">
                  {transactions.length} new
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[10px] uppercase tracking-widest text-white/40 bg-white/[0.02]">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Txn</th>
                      <th className="text-left px-5 py-3 font-semibold">Customer</th>
                      <th className="text-left px-5 py-3 font-semibold">Shop</th>
                      <th className="text-left px-5 py-3 font-semibold">Duration</th>
                      <th className="text-left px-5 py-3 font-semibold">Status</th>
                      <th className="text-right px-5 py-3 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-white/40">
                          no transactions yet — it's quiet out here 🦗
                        </td>
                      </tr>
                    )}
                    {transactions.map((order) => (
                      <tr
                        key={order._id}
                        className="border-t border-white/5 hover:bg-emerald-400/[0.04] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-emerald-400">
                            #{order._id?.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-sm">
                              {order?.user?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-semibold text-white/90">
                              {order?.user?.name || "anon"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-white/70">{order?.shop?.name || "—"}</td>
                        <td className="px-5 py-4 text-white/50 text-xs">
                          {timeAgo(order?.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusPill(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-black text-emerald-400">
                            ₹{order?.totalBillAmount?.toLocaleString("en-IN")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shop approvals */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Shop Approvals 🏪</h3>
                  <p className="text-xs text-white/50 mt-1">vendors waiting for the green light</p>
                </div>
                <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
                  {pendingShops} pending
                </span>
              </div>
              <ShopApprovalListGroup allShops={allShops} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
