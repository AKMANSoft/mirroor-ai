import { useEffect, useState } from "react";
import { BaseTable, DataTableColumnHeader } from "./table";
import { AudioBlock } from "@/types/audio-block";
import { TablePagination } from "./pagination";
import { Checkbox } from "../ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { PaginatedAudioBlocks } from "@/types/api";
import api from "@/lib/api";



export default function AudiosTable() {

    const [tableData, setTableData] = useState<PaginatedAudioBlocks | null>({
        data: [{
            id: "3b72b0c8-a806-4003-851c-e2d5e3e99c54",
            audio: "https://deploy-mirror-web-audio-files.s3.eu-west-2.amazonaws.com/es/Sabi%20Haider2023-08-02-06-31-42.ogg?AWSAccessKeyId=AKIAYMYU5S5NLW6RE77K&Signature=FAkRbEaV3PHXKDm%2FldS0YpRkIZo%3D&Expires=1690961502",
            createdAt: new Date(),
            keywords: "keyword 1, keyword 2, keyword 3",
            markino: -18,
            text: "Com rice este liga. Y les encare.",
            user_id: "ff65057a-256f-4b40-b695-246896129411",
            language: "es",
            zshot: [{ "key": "stress", "value": 55.7 }, { "key": "dolore fisico", "value": 0 }, { "key": "concentrazione", "value": 59.6 }, { "key": "riposo", "value": 59.7 }]
        }],
        succeed: true,
        pagination: {
            count: 1,
            page: 1,
            perPage: 10,
            totalPages: 1
        }
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const loadData = async () => {
        setTableData(null)
        const res = await api.getUserData({ page: currentPage, perPage: perPage });
        console.log(res)
        setTableData(res)
    }


    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage])


    const pagination: TablePagination = {
        onPageChange: setCurrentPage,
        currentPage: currentPage,
        perPage: perPage,
        setPerPage: setPerPage,
        totalPages: tableData?.pagination?.totalPages ?? 1
    }



    return (
        <div className="bg-secondary py-20">
            <div className="mx-auto max-w-screen-xl px-4 md:px-5">
                {/* <h1 className="text-2xl font-bold text-primary">History</h1> */}
                <BaseTable
                    data={tableData?.data}
                    columns={columns()}
                    pagination={pagination}
                />
            </div>
        </div>
    )
}




function columns(): ColumnDef<AudioBlock>[] {
    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //             className="translate-y-[2px]"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //             className="translate-y-[2px]"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        // {
        //     id: "index",
        //     header: ({ column }) => (
        //         <DataTableColumnHeader column={column} title="#" />
        //     ),
        //     cell: ({ row }) => <div className="w-[30px]">{row.index + 1}</div>,
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            id: "audio",
            accessorFn: (audio) => {
                const pathname = new URL(audio.audio ?? "").pathname.split("/")
                const audioname = (pathname.length > 1 ? pathname[pathname.length - 1] : (pathname.length <= 0 ? "" : pathname[0]))?.replaceAll("%20", " ")
                return audioname
            },
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="audio" />
            ),
            cell: ({ row }) => {
                const pathname = new URL(row.original.audio ?? "").pathname.split("/")
                const audioname = (pathname.length > 1 ? pathname[pathname.length - 1] : (pathname.length <= 0 ? "" : pathname[0]))?.replaceAll("%20", " ")
                return (
                    <div className="flex space-x-2">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a href={row.original.audio ?? "#"} className="max-w-[200px] truncate font-medium text-accent">
                                        {audioname}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <a href={row.original.audio ?? "#"} className="font-medium text-accent">
                                        {audioname}
                                    </a>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                )
            },
        },
        {
            accessorKey: "language",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="language" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[200px] truncate font-medium">
                            {row.original.language}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "text",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="text" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="max-w-[200px] truncate font-medium">
                                        {row.original.text}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className="font-medium">
                                        {row.original.text}
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                )
            },
        },
        {
            accessorKey: "markino",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="markino" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[200px] truncate font-medium">
                            {row.original.markino}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "keywords",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="keywords" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[200px] truncate whitespace-pre-line font-medium">
                            {row.original.keywords?.split(",")?.join("\n")}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "zshot",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="zshot" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[200px] truncate whitespace-pre-line font-medium">
                            {row.original.zshot?.map((z) => (
                                <div className="flex justify-between gap-5">
                                    <strong className="">{z.key}:</strong> <span>{z.value}</span>
                                </div>
                            ))}
                        </span>
                    </div>
                )
            },
        },
        {
            id: "timestamp",
            accessorFn: (audioBlock) => (new Date(audioBlock.createdAt)).toLocaleString(),
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Timestamp" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[200px] truncate font-medium whitespace-pre-line">
                            {(new Date(row.original.createdAt)).toLocaleString().split(",").join("\n")}
                        </span>
                    </div>
                )
            },
        },
        // {
        //     id: "actions",
        //     header: ({ column }) => (
        //         <DataTableColumnHeader column={column} title="Actions" />
        //     ),
        //     cell: ({ row }) => <DataTableRowActions row={row} {...rowActions} />,
        // },
    ]
}

