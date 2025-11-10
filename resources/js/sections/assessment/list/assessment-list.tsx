import {
    AlertTriangle,
    Archive,
    ArrowUpDown,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Edit,
    Eye,
    FileText,
    MoreHorizontal,
    Plus,
    Printer,
    Search,
    Share2,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// shadcn/ui components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import assessment from '@/routes/assessment';
import { router } from '@inertiajs/react';

// Inline Table components
const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className = '', ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={`w-full caption-bottom text-sm ${className}`}
            {...props}
        />
    </div>
));

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', ...props }, ref) => (
    <thead
        ref={ref}
        className={`border-b bg-gray-50 ${className}`}
        {...props}
    />
));

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', ...props }, ref) => (
    <tbody
        ref={ref}
        className={`[&_tr:last-child]:border-0 ${className}`}
        {...props}
    />
));

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className = '', ...props }, ref) => (
    <tr
        ref={ref}
        className={`border-b transition-colors hover:bg-gray-50 ${className}`}
        {...props}
    />
));

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className = '', ...props }, ref) => (
    <th
        ref={ref}
        className={`h-12 px-4 text-left align-middle font-medium text-gray-700 ${className}`}
        {...props}
    />
));

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className = '', ...props }, ref) => (
    <td ref={ref} className={`p-4 align-middle ${className}`} {...props} />
));

// Types
interface Assessment {
    id: string;
    title: string;
    type: 'personality' | 'cognitive' | 'clinical' | 'behavioral';
    status: 'draft' | 'active' | 'completed' | 'archived';
    participants: number;
    createdDate: string;
    description: string;
    domains: string[];
}

type SortField = 'title' | 'type' | 'status' | 'participants' | 'createdDate';
type SortDirection = 'asc' | 'desc' | null;

// Mock data generator
const generateMockData = (): Assessment[] => {
    const titles = [
        'Beck Depression Inventory (BDI-II)',
        'Minnesota Multiphasic Personality Inventory',
        'Hamilton Anxiety Rating Scale',
        'Cognitive Behavioral Assessment',
        'PTSD Checklist (PCL-5)',
        'Brief Symptom Inventory',
        'Wechsler Adult Intelligence Scale',
        'Clinical Stress Assessment',
        'Personality Disorder Questionnaire',
        'Anxiety Sensitivity Index',
        'Rorschach Inkblot Test',
        'Myers-Briggs Type Indicator',
    ];

    const types: Assessment['type'][] = [
        'personality',
        'cognitive',
        'clinical',
        'behavioral',
    ];
    const statuses: Assessment['status'][] = [
        'draft',
        'active',
        'completed',
        'archived',
    ];

    return titles.map((title, idx) => ({
        id: `assessment-${idx + 1}`,
        title,
        type: types[idx % types.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        participants: Math.floor(Math.random() * 500) + 10,
        createdDate: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        description: `Professional psychological assessment for ${title}`,
        domains: ['Anxiety', 'Depression', 'Stress'].slice(
            0,
            Math.floor(Math.random() * 3) + 1,
        ),
    }));
};

export default function AssessmentListPage() {
    const [allData] = useState<Assessment[]>(generateMockData());
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    // Filters and search
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    // Sorting
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dialog states
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        assessment: Assessment | null;
    }>({
        open: false,
        assessment: null,
    });
    const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

    // Status badge configuration
    const getStatusBadge = (status: Assessment['status']) => {
        const config = {
            draft: {
                variant: 'secondary' as const,
                label: 'Draft',
                className: '',
            },
            active: {
                variant: 'default' as const,
                label: 'Active',
                className: 'bg-green-100 text-green-800 hover:bg-green-100',
            },
            completed: {
                variant: 'default' as const,
                label: 'Completed',
                className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
            },
            archived: {
                variant: 'outline' as const,
                label: 'Archived',
                className: '',
            },
        };
        return config[status];
    };

    // Type badge configuration
    const getTypeBadge = (type: Assessment['type']) => {
        const config = {
            personality: {
                className: 'bg-purple-100 text-purple-800 border-purple-200',
                label: 'Personality',
            },
            cognitive: {
                className: 'bg-blue-100 text-blue-800 border-blue-200',
                label: 'Cognitive',
            },
            clinical: {
                className: 'bg-red-100 text-red-800 border-red-200',
                label: 'Clinical',
            },
            behavioral: {
                className: 'bg-orange-100 text-orange-800 border-orange-200',
                label: 'Behavioral',
            },
        };
        return config[type];
    };

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        const filtered = allData.filter((item) => {
            // Global search
            if (globalFilter) {
                const searchLower = globalFilter.toLowerCase();
                if (
                    !item.title.toLowerCase().includes(searchLower) &&
                    !item.description.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            // Status filter
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false;
            }

            // Type filter
            if (typeFilter !== 'all' && item.type !== typeFilter) {
                return false;
            }

            // Date filter
            if (dateFilter !== 'all') {
                const itemDate = new Date(item.createdDate);
                const now = new Date();
                const daysDiff = Math.floor(
                    (now.getTime() - itemDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                );

                if (dateFilter === 'week' && daysDiff > 7) return false;
                if (dateFilter === 'month' && daysDiff > 30) return false;
                if (dateFilter === 'quarter' && daysDiff > 90) return false;
            }

            return true;
        });

        // Sorting
        if (sortField && sortDirection) {
            filtered.sort((a, b) => {
                let aVal: any = a[sortField];
                let bVal: any = b[sortField];

                if (sortField === 'createdDate') {
                    aVal = new Date(aVal).getTime();
                    bVal = new Date(bVal).getTime();
                }

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [
        allData,
        globalFilter,
        statusFilter,
        typeFilter,
        dateFilter,
        sortField,
        sortDirection,
    ]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortField(null);
                setSortDirection(null);
            }
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const toggleRowSelection = (id: string) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedRows(newSelection);
    };

    const toggleAllSelection = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map((item) => item.id)));
        }
    };

    const handleAction = (action: string, assessment: Assessment) => {
        console.log(`${action} action for:`, assessment);
        alert(`${action.toUpperCase()} action for: ${assessment.title}`);
    };

    const handleDelete = () => {
        if (deleteDialog.assessment) {
            alert(`Deleted: ${deleteDialog.assessment.title}`);
            setDeleteDialog({ open: false, assessment: null });
        }
    };

    const handleBulkDelete = () => {
        alert(`${selectedRows.size} assessments deleted`);
        setSelectedRows(new Set());
        setBulkDeleteDialog(false);
    };

    const clearFilters = () => {
        setGlobalFilter('');
        setStatusFilter('all');
        setTypeFilter('all');
        setDateFilter('all');
        setCurrentPage(1);
    };

    const selectedCount = selectedRows.size;
    const hasActiveFilters =
        globalFilter ||
        statusFilter !== 'all' ||
        typeFilter !== 'all' ||
        dateFilter !== 'all';

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Psychological Assessments
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 md:text-base">
                            Manage and monitor all psychological evaluation
                            instruments
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Import</span>
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                                Create Assessment
                            </span>
                            <span className="sm:hidden">Create</span>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search assessments by title or description..."
                                    value={globalFilter}
                                    onChange={(e) => {
                                        setGlobalFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(v) => {
                                        setStatusFilter(v);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archived
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={typeFilter}
                                    onValueChange={(v) => {
                                        setTypeFilter(v);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="personality">
                                            Personality
                                        </SelectItem>
                                        <SelectItem value="cognitive">
                                            Cognitive
                                        </SelectItem>
                                        <SelectItem value="clinical">
                                            Clinical
                                        </SelectItem>
                                        <SelectItem value="behavioral">
                                            Behavioral
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={dateFilter}
                                    onValueChange={(v) => {
                                        setDateFilter(v);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Time
                                        </SelectItem>
                                        <SelectItem value="week">
                                            Last Week
                                        </SelectItem>
                                        <SelectItem value="month">
                                            Last Month
                                        </SelectItem>
                                        <SelectItem value="quarter">
                                            Last Quarter
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions Bar */}
                {selectedCount > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={true}
                                        onCheckedChange={() =>
                                            setSelectedRows(new Set())
                                        }
                                    />
                                    <span className="text-sm font-medium text-blue-900">
                                        {selectedCount} assessment
                                        {selectedCount > 1 ? 's' : ''} selected
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Archive className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Archive
                                        </span>
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Export
                                        </span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setBulkDeleteDialog(true)
                                        }
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Delete
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Table */}
                <Card className="overflow-hidden py-0">
                    <CardContent className="p-0">
                        {filteredAndSortedData.length === 0 ? (
                            <EmptyState
                                hasFilters={hasActiveFilters}
                                onClearFilters={clearFilters}
                            />
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={
                                                            selectedRows.size ===
                                                                paginatedData.length &&
                                                            paginatedData.length >
                                                                0
                                                        }
                                                        onCheckedChange={
                                                            toggleAllSelection
                                                        }
                                                        aria-label="Select all"
                                                    />
                                                </TableHead>
                                                <TableHead>
                                                    <button
                                                        className="flex items-center gap-1 hover:text-gray-900"
                                                        onClick={() =>
                                                            handleSort('title')
                                                        }
                                                    >
                                                        Assessment Title
                                                        {sortField ===
                                                            'title' && (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </TableHead>
                                                <TableHead>
                                                    <button
                                                        className="flex items-center gap-1 hover:text-gray-900"
                                                        onClick={() =>
                                                            handleSort('type')
                                                        }
                                                    >
                                                        Type
                                                        {sortField ===
                                                            'type' && (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </TableHead>
                                                <TableHead>
                                                    <button
                                                        className="flex items-center gap-1 hover:text-gray-900"
                                                        onClick={() =>
                                                            handleSort('status')
                                                        }
                                                    >
                                                        Status
                                                        {sortField ===
                                                            'status' && (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <button
                                                        className="mx-auto flex items-center gap-1 hover:text-gray-900"
                                                        onClick={() =>
                                                            handleSort(
                                                                'participants',
                                                            )
                                                        }
                                                    >
                                                        Participants
                                                        {sortField ===
                                                            'participants' && (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </TableHead>
                                                <TableHead>
                                                    <button
                                                        className="flex items-center gap-1 hover:text-gray-900"
                                                        onClick={() =>
                                                            handleSort(
                                                                'createdDate',
                                                            )
                                                        }
                                                    >
                                                        Created
                                                        {sortField ===
                                                            'createdDate' && (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </TableHead>
                                                <TableHead className="w-12"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedData.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedRows.has(
                                                                item.id,
                                                            )}
                                                            onCheckedChange={() =>
                                                                toggleRowSelection(
                                                                    item.id,
                                                                )
                                                            }
                                                            aria-label="Select row"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-md">
                                                            <div className="font-medium text-gray-900">
                                                                {item.title}
                                                            </div>
                                                            <div className="hidden truncate text-sm text-gray-500 md:block">
                                                                {
                                                                    item.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                getTypeBadge(
                                                                    item.type,
                                                                ).className
                                                            }
                                                        >
                                                            {
                                                                getTypeBadge(
                                                                    item.type,
                                                                ).label
                                                            }
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                getStatusBadge(
                                                                    item.status,
                                                                ).variant
                                                            }
                                                            className={
                                                                getStatusBadge(
                                                                    item.status,
                                                                ).className
                                                            }
                                                        >
                                                            {
                                                                getStatusBadge(
                                                                    item.status,
                                                                ).label
                                                            }
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        {item.participants}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600">
                                                        {new Date(
                                                            item.createdDate,
                                                        ).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-48"
                                                            >
                                                                <DropdownMenuLabel>
                                                                    Actions
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            assessment.show()
                                                                                .url,
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            'edit',
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                    Assessment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            'duplicate',
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <Copy className="mr-2 h-4 w-4" />
                                                                    Duplicate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            'print',
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <Printer className="mr-2 h-4 w-4" />
                                                                    Print
                                                                    Assessment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            'share',
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <Share2 className="mr-2 h-4 w-4" />
                                                                    Share/Export
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            'analytics',
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <BarChart3 className="mr-2 h-4 w-4" />
                                                                    View
                                                                    Analytics
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            'archive',
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <Archive className="mr-2 h-4 w-4" />
                                                                    Archive
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setDeleteDialog(
                                                                            {
                                                                                open: true,
                                                                                assessment:
                                                                                    item,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="text-red-600 focus:text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row md:px-6">
                                    <div className="text-sm text-gray-600">
                                        Showing{' '}
                                        {(currentPage - 1) * itemsPerPage + 1}{' '}
                                        to{' '}
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredAndSortedData.length,
                                        )}{' '}
                                        of {filteredAndSortedData.length}{' '}
                                        assessments
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="text-sm font-medium">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.min(totalPages, p + 1),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog({ open, assessment: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Delete Assessment
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "
                            {deleteDialog.assessment?.title}"? This action
                            cannot be undone and will permanently remove all
                            associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({
                                    open: false,
                                    assessment: null,
                                })
                            }
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Assessment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Dialog */}
            <Dialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Delete Multiple Assessments
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedCount}{' '}
                            assessment{selectedCount > 1 ? 's' : ''}? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBulkDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                        >
                            Delete {selectedCount} Assessment
                            {selectedCount > 1 ? 's' : ''}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Loading State Component
function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>
                <Card>
                    <CardContent className="space-y-4 p-6">
                        <Skeleton className="h-10 w-full" />
                        <div className="space-y-2">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState({
    hasFilters,
    onClearFilters,
}: {
    hasFilters: boolean;
    onClearFilters: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {hasFilters ? 'No assessments found' : 'No assessments yet'}
            </h3>
            <p className="mb-6 max-w-sm text-center text-gray-600">
                {hasFilters
                    ? "Try adjusting your filters to find what you're looking for."
                    : 'Get started by creating your first psychological assessment.'}
            </p>
            <div className="flex gap-2">
                {hasFilters ? (
                    <Button onClick={onClearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Assessment
                    </Button>
                )}
            </div>
        </div>
    );
}
