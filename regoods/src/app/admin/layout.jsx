import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 ml-32 lg:ml-36 flex flex-col min-h-screen">
                {/* Admin Navbar */}
                <AdminHeader adminName={session.user.name} adminImage={session.user.image} />

                {/* Page Content */}
                <main className="flex-1 px-10 pb-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
