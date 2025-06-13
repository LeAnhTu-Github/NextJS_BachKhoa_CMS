import React from "react";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListUserProps {
  users: User[];
  isLoading: boolean;
}

const statusOptions = [
  { label: "Kích hoạt", value: "ACTIVE" },
  { label: "Chưa kích hoạt", value: "INACTIVE" },
];

const ListUser = ({ users, isLoading }: ListUserProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span
          className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"
          aria-label="Đang tải..."
        />
      </div>
    );
  }

  return (
    <>
      <div className="block sm:hidden space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">Không có dữ liệu</div>
        ) : (
          users.map((user, idx) => (
            <div
              key={user.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2"
              tabIndex={0}
              aria-label={`Thông tin người dùng: ${user.fullName}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar>
                  <AvatarImage src={user.avatar || "/images/avatar.png"} />
                </Avatar>
                <span className="font-semibold text-red-700 text-lg">{user.fullName}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Số điện thoại</span>
                <span className="text-gray-800">{user.phone}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Chức vụ</span>
                <span className="text-gray-800">{user.position}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Nhóm người dùng</span>
                <span className="text-gray-800">{user.groups.map((group) => group.groupName).join(", ")}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <select
                  className="bg-red-700 text-white rounded px-3 py-1 text-sm focus:outline-none"
                  value={user.status}
                  aria-label="Trạng thái"
                  tabIndex={0}
                  onChange={() => {}}
                  disabled
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                  aria-label="Chức năng"
                  tabIndex={0}
                  onClick={() => {}}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-gray-600"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="4" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="10" cy="16" r="1.5" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full hidden sm:block rounded-lg border border-gray-200 bg-white mt-3 max-h-[475px] overflow-y-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          aria-label="Danh sách người dùng"
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                STT
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Họ tên
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Email
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Số điện thoại
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Chức vụ
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Nhóm người dùng
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
            {users.map((user, idx) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-700">{idx + 1}</td>
                <td className="px-3 py-2 flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/images/avatar.png"} />
                  </Avatar>

                  <span className="font-semibold text-red-700">
                    {user.fullName}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">{user.email}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{user.phone}</td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {user.position}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {user.groups.map((group) => group.groupName).join(", ")}
                </td>
                <td className="px-3 py-2">
                  <select
                    className="bg-red-700 text-white rounded px-3 py-1 text-sm focus:outline-none"
                    value={user.status}
                    aria-label="Trạng thái"
                    tabIndex={0}
                    onChange={() => {}}
                    disabled
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Chức năng"
                    tabIndex={0}
                    onClick={() => {}}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-gray-600"
                      aria-hidden="true"
                    >
                      <circle cx="10" cy="4" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="10" cy="16" r="1.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListUser;
