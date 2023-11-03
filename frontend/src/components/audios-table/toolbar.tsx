import {
    Table as TTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./table";
import { handleTranslation } from "@/lib/i18n";



interface DataTableToolbarProps<TData> {
    table: TTable<TData>;
    filterValue: string;
    setFilterValue: (value: string) => void;
}

export function DataTableToolbar<TData>({
    table,
    filterValue,
    setFilterValue,
}: DataTableToolbarProps<TData>) {
    const { trans } = handleTranslation()
    const isFiltered = table.getState().columnFilters.length > 0


    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={`${trans("search")}...`}
                    value={filterValue}
                    onChange={(event) =>
                        setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        {trans("reset")}
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-3">
                <DataTableViewOptions table={table} />
            </div>
        </div >
    )
}





