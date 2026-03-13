import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Users size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Users</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage registered users and access permissions.
      </p>
    </div>
  );
}
