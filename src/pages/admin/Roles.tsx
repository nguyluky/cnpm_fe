import { Search } from "lucide-react";
import { useApi } from "../../contexts/apiConetxt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../contexts/modalContext";
import { useEffect, useRef, useState } from "react";


function AutoCompletePermissions({
    onSelect,
    allPermissions,
    loading: isLoading
}: {
    onSelect?: (permission: { id: number; name: string }) => void;
    allPermissions?: Array<{ id: number; name: string }>;
    loading?: boolean;
}) {
    const api = useApi();
    const [showDropdown, setShowDropdown] = useState(false);
    const [index, setIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState("");


    const [permissions, setPermissions] = useState<Array<{ id: number, name: string }>>([]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setIndex((prev) => (prev + 1) % (permissions ? permissions.length : 1));
        } else if (e.key === 'ArrowUp') {
            setIndex((prev) => (prev - 1 + (permissions ? permissions.length : 1)) % (permissions ? permissions.length : 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            // Handle selection
            setSearch("");
            if (permissions && permissions.length > 0) {
                const selectedPermission = permissions[index];
                if (onSelect) {
                    onSelect(selectedPermission);
                }
            }
        }

    }

    useEffect(() => {
        if (listRef.current) {
            const selectedItem = listRef.current.children[index] as HTMLElement;
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [index]);

    useEffect(() => {
        setIndex(0);
        if (allPermissions) {
            const filtered = allPermissions.filter((perm: { id: number, name: string }) =>
                perm.name.toLowerCase().includes(search.toLowerCase())
            );
            setPermissions(filtered);
        }
    }, [search, allPermissions]);

    return <label
        className="flex w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
    >
        <input
            type="text"
            placeholder="Search permissions..."
            className="w-full focus:outline-none bg-none border-0 outline-none"
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
            onKeyDown={handleKeyDown}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        {/* Dropdown list - for demo purposes, static items */}
        <div
            ref={listRef}
            className={`absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10 ${showDropdown ? 'block' : 'hidden'}`}
        >
            {
                isLoading && <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
            }
            {
                (permissions && permissions.length > 0) ? permissions.map((perm, idx: number) => (
                    <div
                        key={idx}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${index === idx ? 'bg-blue-200' : ''
                            }`}
                    >
                        {perm.name}
                    </div>
                )) : !isLoading ? <div className="px-4 py-2 text-gray-500">No permissions found. Enter to create</div> : null
            }
        </div>
    </label>;
}


function EditAndCreateRoleModal({
    type,
    defaultValue
}: {
    type?: 'edit' | 'create';
    defaultValue?: {
        id: number;
        name: string;
        permissions: Array<string>;
    };
}) {
    const api = useApi();
    const queryClient = useQueryClient();
    const { closeModal } = useModal();
    const [rule, setRule] = useState<{
        id: number | null;
        name: string;
        permissions: Array<string>;
    }>(defaultValue ? defaultValue : {
        id: null,
        name: "",
        permissions: []
    });


    const { data, isLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await api.api.getAllPermissions();
            return response.data.data?.data || [];
        }
    })

    const updateRole = useMutation({
        mutationFn: async () => {
            const response = await api.api.addPermissionToRole({
                roleId: rule.id!,
                permissions: rule.permissions
            });
            return response.data.data!;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['roles'], (oldData: {
                id: number;
                name: string;
                permissions: Array<string>;
            }[] | undefined) => {
                if (!oldData) return [data];
                const index = oldData.findIndex(r => r.id === data.id);
                if (index !== -1) {
                    const newData = [...oldData];
                    newData[index] = data;
                    return newData;
                } else {
                    return [...oldData, data];
                }
            });
            closeModal();
        }
    });

    return <div
        className={"relative w-xl transform rounded-lg bg-white p-6 shadow-xl transition-all " +
            (updateRole.status == "pending" ? "pointer-events-none" : "")
        }
    >

        {
            updateRole.status == "pending" && <div className="absolute z-100 inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }

        <h2 className="text-2xl font-semibold mb-4">{
            type === 'edit' ? 'Edit Role' : 'Create New Role'
        }</h2>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (type === 'edit') {
                updateRole.mutate();
            } else {
                alert('Chức năng tạo role chưa được hỗ trợ trong phiên bản này.');
            }
        }}>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role Name</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={rule.name}
                    onChange={(e) => setRule({ ...rule, name: e.target.value })}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Permissions</label>
                <div className="mb-2 flex gap-1 flex-wrap">
                    {
                        rule.permissions.map((perm, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-gray-800 mr-2 leading-5"
                            >
                                {perm}
                                <button
                                    type="button"
                                    className="ml-1 text-green-500 hover:text-green-700"
                                    onClick={() => {
                                        const newPermissions = [...rule.permissions];
                                        newPermissions.splice(index, 1);
                                        setRule({ ...rule, permissions: newPermissions });
                                    }}
                                >
                                    &times;
                                </button>
                            </span>
                        ))
                    }
                    {
                        rule.permissions.length === 0 && <span className="text-gray-500">No permissions added yet.</span>
                    }
                </div>
                <div className="flex mb-2">
                    <button
                        className="bg-none text-blue-600 underline"
                        type="button"
                        onClick={() => {
                            // select all permissions
                            if (data) {
                                setRule({ ...rule, permissions: data.map(perm => perm.name) });
                            }
                        }}
                    >
                        select all
                    </button>
                    <button
                        className="bg-none text-blue-600 underline ml-4"
                        type="button"
                        onClick={() => {
                            // clear all permissions
                            setRule({ ...rule, permissions: [] });
                        }}
                    >
                        clear all
                    </button>
                </div>
                <AutoCompletePermissions
                    allPermissions={data}
                    loading={isLoading}
                    onSelect={(e) => {
                        if (!rule.permissions.includes(e.name)) {
                            setRule({ ...rule, permissions: [...rule.permissions, e.name] });
                        }
                    }} />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {
                        type === 'edit' ? 'Save Changes' : 'Create Role'
                    }
                </button>
            </div>
        </form>
    </div>;
}


export function Roles() {
    const api = useApi();
    const { openModal } = useModal();

    const { data: roles, isLoading, error, refetch } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.api.getAllRoles();
            return response.data.data?.data || [];
        }
    })


    const handleAddRole = () => {
        openModal(<EditAndCreateRoleModal
            type="create"
        />);
    }

    const handleEditRole = (role: {
        id: number;
        name: string;
        permissions: Array<string>;
    }) => {
        openModal(<EditAndCreateRoleModal
            type="edit"
            defaultValue={role}
        />);
    }

    return <div className="p-6 bg-gray-50 min-h-screen" >
        {
            // header with search and actions
        }
        <div className="flex items-center justify-between mb-6" >
            <div className="relative flex-1 max-w-md" >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search roles..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                onClick={handleAddRole}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Add Role
            </button>
        </div>

        {
            isLoading ?
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
                : error ?
                    <div className="text-center py-12 text-red-600">
                        <p className="mt-2">Đã có lỗi xảy ra khi tải dữ liệu.</p>
                    </div>
                    : null

        }

        {
            (roles && roles.length > 0) &&
            <div className="bg-white shadow rounded-lg overflow-hidden" >
                <table className="min-w-full divide-y divide-gray-200" >
                    <thead className="bg-gray-50" >
                        <tr >
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Role Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Permissions
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" >
                        {
                            roles.map((role: any) => (
                                <tr key={role.id} >
                                    <td className="px-6 py-4 whitespace-nowrap" >
                                        <div className="text-lg font-bold text-gray-900 uppercase" >{role.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap" >
                                        <div className="flex flex-wrap gap-2" >
                                            {
                                                role.permissions.map((perm: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 leading-5"
                                                    >
                                                        {perm}
                                                    </span>
                                                ))
                                            }

                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap" >
                                        <button
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            onClick={() => handleEditRole(role)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => alert('Chức năng xóa role chưa được hỗ trợ trong phiên bản này.')}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        }
    </div>;
}
