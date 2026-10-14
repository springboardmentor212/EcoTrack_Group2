import { useState, useEffect, useRef } from "react";

import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiUserX,
  FiUserCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";

const initialUsers = [];
const Admin_Api = import.meta.env.VITE_ADMIN_API;

const USERS_PER_PAGE = 8;

function AdminUserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (!Admin_Api) {
          throw new Error("VITE_ADMIN_API is not configured in frontend/.env");
        }

        const response = await fetch(`${Admin_Api}/user`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Unable to load users.");
        }

        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (error) {
        toast.error(error.message || "Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (user.isBlocked ? "blocked" : "active") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleUserAction = async (user) => {
    if (!Admin_Api || !user._id || actionLoadingId) return;

    const action = user.isBlocked ? "unblock" : "block";
    const actionLabel = action === "block" ? "Block" : "Unblock";

    try {
      setActionLoadingId(user._id);

      const response = await fetch(`${Admin_Api}/${action}/${user._id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || `Unable to ${action} user.`);
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id
            ? { ...currentUser, isBlocked: !user.isBlocked }
            : currentUser,
        ),
      );

      toast.success(
        data.message ||
          `User ${action === "block" ? "blocked" : "unblocked"} successfully.`,
      );
    } catch (error) {
      toast.error(
        error.message || `Failed to ${actionLabel.toLowerCase()} user.`,
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusOptions = [
    ["all", "All Users"],
    ["active", "Active"],
    ["blocked", "Blocked"],
  ];

  const selectedStatusLabel =
    statusOptions.find(([value]) => value === statusFilter)?.[1] || "All Users";

  const getInitials = (name = "") => {
    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 0) return "U";

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  };

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes topbarReveal {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes contentFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rowReveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-scroll::-webkit-scrollbar {
          height: 7px;
        }

        .admin-scroll::-webkit-scrollbar-track {
          background: #f3f8f4;
          border-radius: 10px;
        }

        .admin-scroll::-webkit-scrollbar-thumb {
          background: #cbdacf;
          border-radius: 10px;
        }

        .admin-scroll::-webkit-scrollbar-thumb:hover {
          background: #b8cbbd;
        }
      `}</style>

      <div className="min-h-screen bg-[#f7fbf8] text-[#173f2a] animate-[pageFadeIn_.7s_ease_both]">
        {/* Main */}
        <div className="w-full">
          {/* Page Content */}
          <main>
            {/* Page Heading */}
            <section className="mb-7 animate-[heroFadeUp_.6s_ease_.18s_both]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#27834d]">
                  User Management
                </p>

                <h1 className="mt-1 text-[28px] font-bold tracking-[-.02em] text-[#173f2a] max-sm:text-[24px]">
                  Manage Users
                </h1>

                <p className="mt-2 max-w-[650px] text-sm leading-6 text-[#718277]">
                  View registered users, check their account status, and manage
                  user access from one place.
                </p>
              </div>
            </section>

            {/* Search & Filter */}
            <section className="relative z-50 mb-6 overflow-visible rounded-[15px] border border-[#e1ebe4] bg-white p-5 shadow-[0_8px_25px_rgba(33,78,50,0.04)] animate-[contentFadeUp_.6s_ease_.26s_both]">
              <div className="flex items-center gap-3 max-md:flex-col">
                {/* Search */}
                <div className="relative min-w-0 flex-1 max-md:w-full">
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a998f]"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name or email..."
                    className="h-[45px] w-full rounded-lg border border-[#dce8df] bg-[#fbfdfb] pl-10 pr-4 text-sm text-[#294a36] outline-none transition-all duration-200 placeholder:text-[#9aa79f] focus:border-[#7eb493] focus:bg-white focus:ring-2 focus:ring-[#e8f3eb]"
                  />
                </div>

                {/* Status Filter */}
                <div
                  ref={filterRef}
                  className="relative w-[190px] shrink-0 max-md:w-full"
                >
                  <button
                    type="button"
                    onClick={() => setFilterOpen((open) => !open)}
                    className={`flex h-[45px] w-full items-center justify-between rounded-lg border px-4 text-sm outline-none transition-all duration-200 ${
                      filterOpen
                        ? "border-[#7eb493] bg-white ring-2 ring-[#e8f3eb]"
                        : "border-[#dce8df] bg-[#fbfdfb] hover:border-[#b8cbbd]"
                    }`}
                  >
                    <span className="text-[#53685b]">
                      {selectedStatusLabel}
                    </span>

                    <FiChevronDown
                      size={16}
                      className={`text-[#7b8c81] transition-transform duration-200 ${
                        filterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {filterOpen && (
                    <div className="absolute left-0 right-0 top-[50px] z-50 overflow-hidden rounded-xl border border-[#dce8df] bg-white p-1.5 shadow-[0_12px_30px_rgba(33,78,50,0.12)]">
                      {statusOptions.map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(value);
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                            statusFilter === value
                              ? "bg-[#eaf5ed] font-semibold text-[#27834d]"
                              : "text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              statusFilter === value
                                ? "bg-[#27834d]"
                                : "bg-[#cbdacf]"
                            }`}
                          />

                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* User Table */}
            <section className="relative z-10 overflow-hidden rounded-[15px] border border-[#e1ebe4] bg-white shadow-[0_8px_25px_rgba(33,78,50,0.04)] animate-[contentFadeUp_.6s_ease_.36s_both]">
              <div className="admin-scroll overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#e7eee9] bg-[#fbfdfb]">
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[.08em] text-[#718277]">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[.08em] text-[#718277]">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[.08em] text-[#718277]">
                        Location
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[.08em] text-[#718277]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[.08em] text-[#718277]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user, index) => (
                        <tr
                          key={user._id || user.email}
                          className="border-b border-[#edf2ee] transition-colors duration-200 hover:bg-[#fbfdfb] animate-[rowReveal_.4s_ease_both]"
                          style={{
                            animationDelay: `${index * 0.05}s`,
                          }}
                        >
                          {/* User */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {user.profilePhoto ? (
                                <img
                                  src={user.profilePhoto}
                                  alt={user.name || "User"}
                                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#edf5ef]"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf5ed] text-xs font-bold text-[#27834d] ring-2 ring-[#edf5ef]">
                                  {getInitials(user.name)}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#294a36]">
                                  {user.name || "Unknown User"}
                                </p>

                                <p className="mt-0.5 text-[11px] text-[#8a998f]">
                                  EcoTrack User
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#53685b]">
                              {user.email || "—"}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#53685b]">
                              {user.location || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                user.isBlocked
                                  ? "bg-[#fdf0f0] text-[#b34b4b]"
                                  : "bg-[#eaf5ed] text-[#27834d]"
                              }`}
                            >
                              {user.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              disabled={actionLoadingId === user._id}
                              onClick={() => handleUserAction(user)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-wait disabled:opacity-60 ${
                                user.isBlocked
                                  ? "bg-[#eaf5ed] text-[#27834d] hover:bg-[#dff1e4]"
                                  : "bg-[#fdf2f2] text-[#b34b4b] hover:bg-[#f9e7e7]"
                              }`}
                            >
                              {actionLoadingId === user._id ? (
                                "Updating..."
                              ) : user.isBlocked ? (
                                <>
                                  <FiUserCheck size={14} />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <FiUserX size={14} />
                                  Block
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-5 py-16 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf5ed] text-[#27834d]">
                              <FiSearch size={22} />
                            </div>

                            <h3 className="text-sm font-semibold text-[#294a36]">
                              {isLoading
                                ? "Loading users..."
                                : "No users found"}
                            </h3>

                            <p className="mt-1 text-sm leading-7 text-[#8a998f]">
                              {isLoading
                                ? "Please wait while user data is loaded."
                                : "Try adjusting your search or status filter."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between border-t border-[#e7eee9] px-5 py-4 max-sm:flex-col max-sm:gap-3">
                  <p className="text-xs text-[#8a998f]">
                    Showing {startIndex + 1}-
                    {Math.min(
                      startIndex + USERS_PER_PAGE,
                      filteredUsers.length,
                    )}{" "}
                    of {filteredUsers.length} users
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Previous */}
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce8df] bg-white text-[#718277] transition-all duration-200 hover:bg-[#f1f8f3] hover:text-[#27834d] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiChevronLeft size={15} />
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all duration-200 ${
                          currentPage === page
                            ? "bg-[#27834d] text-white shadow-sm"
                            : "border border-[#dce8df] bg-white text-[#718277] hover:bg-[#f1f8f3] hover:text-[#27834d]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce8df] bg-white text-[#718277] transition-all duration-200 hover:bg-[#f1f8f3] hover:text-[#27834d] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminUserManagement;
