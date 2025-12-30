"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
} from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { GenericAlertDialog } from "@/components/child/alert-dialog";
import { toastService } from "@/lib/toast";

// TODO: need to move this to zod folder and export from there
// Make DataTable generic and driven by props. No hard-coded columns or status values.

type TabItem = {
  value: string;
  label?: string;
  badgeCount?: number;
};

type DropdownItem = {
  value: string;
  label?: string;
};

const DragHandle = React.memo(({ id }: { id: UniqueIdentifier }) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
});

DragHandle.displayName = "DragHandle";

const DraggableRow = React.memo(<T,>({ row }: { row: Row<T> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});

DraggableRow.displayName = "DraggableRow";

type DataTableProps<T> = {
  data?: T[];
  columns: ColumnDef<T>[];
  meta?: Record<string, any> | null;
  pageCount?: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  tabs?: TabItem[];
  dropdownItems?: DropdownItem[];
  currentTab?: string;
  onTabChange?: (value?: string) => void;
  onBulkAction?: (ids: string[], value: string) => Promise<any> | void;
  onDelete?: (ids: string[]) => Promise<any> | void;
  onRowsUpdated?: (updatedRows: T[], statusKey: string) => void;
  rowId?: (row: T) => UniqueIdentifier;
  statusKey?: string;
  enableDrag?: boolean;
};

export function DataTable<T extends Record<string, any>>({
  data: initialData,
  columns,
  meta,
  pageCount,
  pagination,
  setPagination,
  tabs,
  dropdownItems,
  currentTab,
  onTabChange,
  onBulkAction,
  onDelete,
  onRowsUpdated,
  rowId,
  statusKey = "status",
  enableDrag = true,
}: DataTableProps<T>) {
  const [data, setData] = React.useState<T[]>(initialData || []);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const activeTab = currentTab || (tabs && tabs[0]?.value) || "";

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((row) => (rowId ? rowId(row) : (row as any).id)) || [],
    [data],
  );

  React.useEffect(() => {
    setData(initialData || []);
  }, [initialData]);

  const effectiveColumns = React.useMemo<ColumnDef<T>[]>(() => {
    if (!enableDrag) return columns;

    const dragColumn: ColumnDef<T> = {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.id} />,
      enableSorting: false,
      enableHiding: false,
    };

    return [dragColumn, ...columns];
  }, [columns, enableDrag]);

  const table = useReactTable<T>({
    data,
    columns: effectiveColumns,
    manualPagination: true,
    pageCount: pageCount ?? meta?.totalPages,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row) => String(rowId ? rowId(row) : (row as any).id),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        setData((data) => {
          const oldIndex = data.findIndex(
            (item) =>
              String(rowId ? rowId(item) : (item as any).id) ===
              String(active.id),
          );
          const newIndex = data.findIndex(
            (item) =>
              String(rowId ? rowId(item) : (item as any).id) ===
              String(over.id),
          );
          return arrayMove(data, oldIndex, newIndex);
        });
      }
    },
    [rowId],
  );

  const handleTabChange = React.useCallback(
    (value: string) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      if (onTabChange) {
        onTabChange(value === "outline" ? undefined : value);
      }
    },
    [setPagination, onTabChange],
  );

  const invokeBulkAction = async (newStatus: string) => {
    if (!newStatus || newStatus.trim() === "") {
      toastService.error("Please select a valid action.");
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toastService.warning("Please select at least one row to update.");
      return;
    }

    if (!onBulkAction) {
      toastService.error("No bulk action handler provided.");
      return;
    }

    // Convert row IDs to strings for the handler
    const allUpdateIds: string[] = selectedRows.map((row) => String(row.id));
    const rowsToUpdate = selectedRows.map((row) => row.original);
    const previousStatuses = new Map(
      selectedRows.map((row) => [
        String(row.id),
        (row.original as any)[statusKey],
      ]),
    );

    // Optimistic UI: update local state immediately
    setData((prevData) =>
      prevData.map((row) =>
        allUpdateIds.includes(String(rowId ? rowId(row) : (row as any).id))
          ? { ...row, [statusKey]: newStatus }
          : row,
      ),
    );

    // Clear selection after status update
    setRowSelection({});

    try {
      const promiseOrResult = onBulkAction(allUpdateIds, newStatus);
      const isPromise =
        promiseOrResult && typeof (promiseOrResult as any).then === "function";

      if (isPromise) {
        toastService.promise(promiseOrResult as Promise<any>, {
          loading: "Updating status...",
          success: () =>
            `${allUpdateIds.length} item(s) updated to ${newStatus}.`,
          error: () => "Failed to update status. Please try again.",
        });

        const response = await (promiseOrResult as Promise<any>);

        // On success, notify parent about updated rows for tab-based filtering
        if (onRowsUpdated) {
          const updatedRows = rowsToUpdate.map((row) => ({
            ...row,
            [statusKey]: newStatus,
          }));
          onRowsUpdated(updatedRows, newStatus);
        }

        return response;
      } else {
        // Handler returned void/sync result
        if (onRowsUpdated) {
          const updatedRows = rowsToUpdate.map((row) => ({
            ...row,
            [statusKey]: newStatus,
          }));
          onRowsUpdated(updatedRows, newStatus);
        }
      }
    } catch (err) {
      // Rollback optimistic update on error
      setData((prevData) =>
        prevData.map((row) => {
          const rowIdStr = String(rowId ? rowId(row) : (row as any).id);
          if (allUpdateIds.includes(rowIdStr)) {
            const previousStatus = previousStatuses.get(rowIdStr);
            return { ...row, [statusKey]: previousStatus };
          }
          return row;
        }),
      );
      toastService.error(
        (err as any)?.message || "Failed to update status. Please try again.",
      );
    }
  };

  // Delete handler will be delegated to parent if provided
  const handleDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toastService.warning("Please select at least one row to delete.");
      return;
    }

    if (!onDelete) {
      toastService.error("No delete handler provided.");
      return;
    }

    // Convert row IDs to strings for the handler
    const allDeleteIds: string[] = selectedRows.map((row) => String(row.id));

    try {
      const promiseOrResult = onDelete(allDeleteIds);
      const isPromise =
        promiseOrResult && typeof (promiseOrResult as any).then === "function";

      if (isPromise) {
        toastService.promise(promiseOrResult as Promise<any>, {
          loading: "Deleting...",
          success: () => `${allDeleteIds.length} item(s) deleted successfully.`,
          error: "Failed to delete. Please try again.",
        });
        await (promiseOrResult as Promise<any>);
      }

      // Optimistically remove rows from local state
      setData((prevData) =>
        prevData.filter(
          (row) =>
            !allDeleteIds.includes(
              String(rowId ? rowId(row) : (row as any).id),
            ),
        ),
      );

      // Clear selection
      setRowSelection({});
    } catch (err) {
      toastService.error(
        (err as any)?.message || "Failed to delete items. Please try again.",
      );
    }
  };

  return (
    <Tabs
      className="w-full flex-col justify-start gap-6"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <span>
              {tabs?.find((t) => t.value === activeTab)?.label ?? activeTab}
            </span>
          </SelectTrigger>
          <SelectContent>
            {tabs?.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label ?? t.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          {tabs?.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label ?? t.value}
              {typeof t.badgeCount === "number" ? (
                <Badge variant="secondary">{t.badgeCount}</Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {dropdownItems?.map((it, index) => (
                <DropdownMenuItem
                  onClick={() => invokeBulkAction(it.value)}
                  key={index}
                >
                  {it.label ?? it.value}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <GenericAlertDialog
                trigger={
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete
                  </DropdownMenuItem>
                }
                actionButtonColor="destructive"
                title="Are you absolutely sure?"
                description="This action is permanent and cannot be undone. If you don’t want to proceed with this appointment, you can simply cancel or ignore it instead of deleting."
                confirmText="Yes"
                cancelText="No"
                onResult={(confirmed) => {
                  if (confirmed) {
                    handleDelete();
                  }
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {tabs?.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-lg border">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={effectiveColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
