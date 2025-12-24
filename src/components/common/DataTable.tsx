import { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, unknown>[];
    searchPlaceholder?: string;
}

export function DataTable<TData>({ data, columns, searchPlaceholder = "Search records..." }: DataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { pagination: { pageSize: 5 } },
    });

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {searchPlaceholder && (
                    <div className="relative flex-1 max-w-sm group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm group-hover:border-blue-300"
                            placeholder={searchPlaceholder}
                        />
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-slate-900 dark:bg-slate-950 text-white">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 sm:px-8 py-4 sm:py-6 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] cursor-pointer select-none group"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                                <span className="text-slate-400">
                                                    {{
                                                        asc: <ChevronDown size={14} className="rotate-180 transition-transform" />,
                                                        desc: <ChevronDown size={14} className="transition-transform" />,
                                                    }[header.column.getIsSorted() as string] ?? <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group active:bg-blue-50/50">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-8 py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <Search size={40} className="text-slate-200 dark:text-slate-700 mb-4" />
                                            <p className="text-base font-bold text-slate-900 dark:text-white">No matching records found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 sm:px-8 py-4 sm:py-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Page</span>
                        <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{table.getState().pagination.pageIndex + 1}</span>
                        <span>of</span>
                        <span className="text-slate-900 dark:text-white">{table.getPageCount()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white active:scale-90 disabled:opacity-20 transition-all shadow-sm"><ChevronLeft size={16} /></button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white active:scale-90 disabled:opacity-20 transition-all shadow-sm"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
