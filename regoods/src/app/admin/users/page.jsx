import { getUsers } from "@/app/actions/admin";
import UserList from "@/components/admin/UserList";

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage platform users and sellers.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium border border-gray-200">
                    Total: {users.length}
                </div>
            </div>

            <UserList initialUsers={users} />
        </div>
    );
}
