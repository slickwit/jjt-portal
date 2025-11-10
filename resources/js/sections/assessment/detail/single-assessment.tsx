import {
    Activity,
    AlertTriangle,
    Archive,
    Bell,
    Calendar,
    Clock,
    Copy,
    Download,
    Edit,
    Eye,
    MoreHorizontal,
    Plus,
    Printer,
    Send,
    Share2,
    Shield,
    Trash2,
    TrendingUp,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

// shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// ----------------------------------------------------------------------

// Inline Table components
const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
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
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={`border-b bg-gray-50 ${className}`}
        {...props}
    />
));

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={`[&_tr:last-child]:border-0 ${className}`}
        {...props}
    />
));

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={`border-b transition-colors hover:bg-gray-50 ${className}`}
        {...props}
    />
));

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={`h-12 px-4 text-left align-middle font-medium text-gray-700 ${className}`}
        {...props}
    />
));

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td ref={ref} className={`p-4 align-middle ${className}`} {...props} />
));

// Types
interface AssessmentDetail {
    id: string;
    title: string;
    description: string;
    type: 'personality' | 'cognitive' | 'clinical' | 'behavioral';
    status: 'draft' | 'active' | 'completed' | 'archived';
    createdDate: string;
    duration: number;
    domains: string[];
    totalParticipants: number;
    completionRate: number;
    averageScore: number;
    averageTime: number;
}

interface Question {
    id: string;
    text: string;
    type: 'likert' | 'multiple-choice' | 'semantic-differential' | 'open-ended';
    required: boolean;
    scalePoints?: number;
    options?: string[];
    weight: number;
}

interface Participant {
    id: string;
    name: string;
    email: string;
    status: 'invited' | 'in-progress' | 'completed' | 'expired';
    progress: number;
    lastActivity?: string;
    score?: number;
}

// Mock Data
const mockAssessment: AssessmentDetail = {
    id: 'assessment-1',
    title: 'Beck Depression Inventory (BDI-II)',
    description:
        'A 21-item self-report inventory measuring the severity of depression in adolescents and adults. This standardized instrument assesses cognitive, affective, somatic, and vegetative symptoms of depression.',
    type: 'clinical',
    status: 'active',
    createdDate: '2024-10-15',
    duration: 15,
    domains: ['Depression', 'Mood', 'Cognitive Function', 'Physical Symptoms'],
    totalParticipants: 247,
    completionRate: 78.5,
    averageScore: 18.3,
    averageTime: 12.5,
};

const mockQuestions: Question[] = [
    {
        id: 'q1',
        text: 'Over the past two weeks, how often have you felt down, depressed, or hopeless?',
        type: 'likert',
        required: true,
        scalePoints: 5,
        weight: 1,
    },
    {
        id: 'q2',
        text: 'Have you experienced significant changes in your sleep patterns?',
        type: 'multiple-choice',
        required: true,
        options: ['No changes', 'Sleeping more', 'Sleeping less', 'Insomnia'],
        weight: 1.2,
    },
    {
        id: 'q3',
        text: 'Rate your overall mood over the past week',
        type: 'semantic-differential',
        required: true,
        scalePoints: 7,
        weight: 1,
    },
    {
        id: 'q4',
        text: 'Please describe any additional symptoms you have experienced',
        type: 'open-ended',
        required: false,
        weight: 0,
    },
];

const mockParticipants: Participant[] = [
    {
        id: 'p1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        status: 'completed',
        progress: 100,
        lastActivity: '2024-11-05',
        score: 12,
    },
    {
        id: 'p2',
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        status: 'in-progress',
        progress: 65,
        lastActivity: '2024-11-08',
    },
    {
        id: 'p3',
        name: 'Emily Rodriguez',
        email: 'emily.r@example.com',
        status: 'completed',
        progress: 100,
        lastActivity: '2024-11-07',
        score: 24,
    },
    {
        id: 'p4',
        name: 'David Kim',
        email: 'd.kim@example.com',
        status: 'invited',
        progress: 0,
    },
    {
        id: 'p5',
        name: 'Jessica Taylor',
        email: 'j.taylor@example.com',
        status: 'expired',
        progress: 30,
        lastActivity: '2024-10-28',
    },
];

const scoreDistributionData = [
    { range: '0-5', count: 23 },
    { range: '6-10', count: 45 },
    { range: '11-15', count: 67 },
    { range: '16-20', count: 54 },
    { range: '21-25', count: 38 },
    { range: '26-30', count: 20 },
];

const domainData = [
    { domain: 'Depression', score: 72 },
    { domain: 'Mood', score: 65 },
    { domain: 'Cognitive', score: 58 },
    { domain: 'Physical', score: 48 },
    { domain: 'Social', score: 55 },
];

const completionTrendData = [
    { date: 'Week 1', completed: 45 },
    { date: 'Week 2', completed: 78 },
    { date: 'Week 3', completed: 112 },
    { date: 'Week 4', completed: 154 },
    { date: 'Week 5', completed: 194 },
];

export default function SingleAssessment() {
    const [assessment] = useState<AssessmentDetail>(mockAssessment);
    const [questions] = useState<Question[]>(mockQuestions);
    const [participants] = useState<Participant[]>(mockParticipants);
    const [loading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [shareDialog, setShareDialog] = useState(false);

    const getStatusBadge = (status: AssessmentDetail['status']) => {
        const config = {
            draft: {
                variant: 'secondary' as const,
                label: 'Draft',
                className: '',
            },
            active: {
                variant: 'default' as const,
                label: 'Active',
                className: 'bg-green-100 text-green-800',
            },
            completed: {
                variant: 'default' as const,
                label: 'Completed',
                className: 'bg-blue-100 text-blue-800',
            },
            archived: {
                variant: 'outline' as const,
                label: 'Archived',
                className: '',
            },
        };
        return config[status];
    };

    const getParticipantStatusBadge = (status: Participant['status']) => {
        const config = {
            invited: {
                variant: 'outline' as const,
                label: 'Invited',
                className: '',
            },
            'in-progress': {
                variant: 'default' as const,
                label: 'In Progress',
                className: 'bg-yellow-100 text-yellow-800',
            },
            completed: {
                variant: 'default' as const,
                label: 'Completed',
                className: 'bg-green-100 text-green-800',
            },
            expired: {
                variant: 'destructive' as const,
                label: 'Expired',
                className: '',
            },
        };
        return config[status];
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                                {assessment.title}
                            </h1>
                            <Badge
                                variant={
                                    getStatusBadge(assessment.status).variant
                                }
                                className={
                                    getStatusBadge(assessment.status).className
                                }
                            >
                                {getStatusBadge(assessment.status).label}
                            </Badge>
                        </div>
                        <p className="mt-2 text-gray-600">
                            {assessment.description}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShareDialog(true)}
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    More Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setDeleteDialog(true)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="results">
                            Results & Analytics
                        </TabsTrigger>
                        <TabsTrigger value="participants">
                            Participants
                        </TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>
                                        Total Participants
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="text-3xl font-bold">
                                            {assessment.totalParticipants}
                                        </div>
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>
                                        Completion Rate
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="text-3xl font-bold">
                                            {assessment.completionRate}%
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-600" />
                                    </div>
                                    <Progress
                                        value={assessment.completionRate}
                                        className="mt-2"
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>
                                        Average Score
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="text-3xl font-bold">
                                            {assessment.averageScore}
                                        </div>
                                        <Activity className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Out of 63 possible
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>
                                        Avg. Completion Time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="text-3xl font-bold">
                                            {assessment.averageTime}m
                                        </div>
                                        <Clock className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Est. {assessment.duration} minutes
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Assessment Info */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Assessment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-gray-600">
                                            Type
                                        </Label>
                                        <p className="mt-1 font-medium capitalize">
                                            {assessment.type} Assessment
                                        </p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-gray-600">
                                            Created
                                        </Label>
                                        <p className="mt-1 flex items-center gap-2 font-medium">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(
                                                assessment.createdDate,
                                            ).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-gray-600">
                                            Estimated Duration
                                        </Label>
                                        <p className="mt-1 flex items-center gap-2 font-medium">
                                            <Clock className="h-4 w-4" />
                                            {assessment.duration} minutes
                                        </p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-gray-600">
                                            Psychological Domains
                                        </Label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {assessment.domains.map(
                                                (domain) => (
                                                    <Badge
                                                        key={domain}
                                                        variant="secondary"
                                                    >
                                                        {domain}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Completion Trend</CardTitle>
                                    <CardDescription>
                                        Participant completion over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={250}
                                    >
                                        <LineChart data={completionTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="completed"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Clinical Guidelines Alert */}
                        <Alert className="border-blue-200 bg-blue-50">
                            <AlertTriangle className="h-4 w-4 text-blue-600" />
                            <AlertTitle>
                                Clinical Interpretation Guidelines
                            </AlertTitle>
                            <AlertDescription>
                                Scores 0-13: Minimal depression | 14-19: Mild
                                depression | 20-28: Moderate depression | 29-63:
                                Severe depression. Professional interpretation
                                required for clinical decision-making.
                            </AlertDescription>
                        </Alert>
                    </TabsContent>

                    {/* Questions Tab */}
                    <TabsContent value="questions" className="mt-6 space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Assessment Questions
                                        </CardTitle>
                                        <CardDescription>
                                            {questions.length} questions total
                                        </CardDescription>
                                    </div>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Question
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {questions.map((q, idx) => (
                                        <Card
                                            key={q.id}
                                            className="border-l-4 border-l-blue-500"
                                        >
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-start gap-3">
                                                            <Badge
                                                                variant="outline"
                                                                className="mt-1"
                                                            >
                                                                {idx + 1}
                                                            </Badge>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">
                                                                    {q.text}
                                                                </p>
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="capitalize"
                                                                    >
                                                                        {q.type.replace(
                                                                            '-',
                                                                            ' ',
                                                                        )}
                                                                    </Badge>
                                                                    {q.required && (
                                                                        <Badge
                                                                            variant="default"
                                                                            className="bg-red-100 text-red-800"
                                                                        >
                                                                            Required
                                                                        </Badge>
                                                                    )}
                                                                    {q.scalePoints && (
                                                                        <Badge variant="outline">
                                                                            {
                                                                                q.scalePoints
                                                                            }
                                                                            -Point
                                                                            Scale
                                                                        </Badge>
                                                                    )}
                                                                    <Badge variant="outline">
                                                                        Weight:{' '}
                                                                        {
                                                                            q.weight
                                                                        }
                                                                        x
                                                                    </Badge>
                                                                </div>
                                                                {q.options && (
                                                                    <div className="mt-3 border-l-2 border-gray-200 pl-4">
                                                                        <p className="mb-1 text-sm text-gray-600">
                                                                            Response
                                                                            Options:
                                                                        </p>
                                                                        <ul className="list-inside list-disc text-sm text-gray-700">
                                                                            {q.options.map(
                                                                                (
                                                                                    opt,
                                                                                    i,
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            opt
                                                                                        }
                                                                                    </li>
                                                                                ),
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Results & Analytics Tab */}
                    <TabsContent value="results" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Score Distribution</CardTitle>
                                    <CardDescription>
                                        Distribution of participant scores
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart data={scoreDistributionData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="range" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Bar
                                                dataKey="count"
                                                fill="#3b82f6"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Domain Breakdown</CardTitle>
                                    <CardDescription>
                                        Performance across psychological domains
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <RadarChart data={domainData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="domain" />
                                            <PolarRadiusAxis
                                                angle={90}
                                                domain={[0, 100]}
                                            />
                                            <Radar
                                                name="Score"
                                                dataKey="score"
                                                stroke="#8b5cf6"
                                                fill="#8b5cf6"
                                                fillOpacity={0.6}
                                            />
                                            <RechartsTooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Severity Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Clinical Severity Levels</CardTitle>
                                <CardDescription>
                                    Distribution of participants by depression
                                    severity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-2 flex justify-between">
                                            <span className="text-sm font-medium">
                                                Minimal (0-13)
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                68 participants (28%)
                                            </span>
                                        </div>
                                        <Progress value={28} className="h-3" />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex justify-between">
                                            <span className="text-sm font-medium">
                                                Mild (14-19)
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                112 participants (45%)
                                            </span>
                                        </div>
                                        <Progress value={45} className="h-3" />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex justify-between">
                                            <span className="text-sm font-medium">
                                                Moderate (20-28)
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                48 participants (19%)
                                            </span>
                                        </div>
                                        <Progress
                                            value={19}
                                            className="h-3 bg-orange-100"
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex justify-between">
                                            <span className="text-sm font-medium">
                                                Severe (29-63)
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                19 participants (8%)
                                            </span>
                                        </div>
                                        <Progress
                                            value={8}
                                            className="h-3 bg-red-100"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Participants Tab */}
                    <TabsContent
                        value="participants"
                        className="mt-6 space-y-4"
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Participants</CardTitle>
                                        <CardDescription>
                                            {participants.length} total
                                            participants
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Reminders
                                        </Button>
                                        <Button size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Participant
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Participant</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Last Activity</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {participants.map((participant) => (
                                            <TableRow key={participant.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>
                                                                {participant.name
                                                                    .split(' ')
                                                                    .map(
                                                                        (n) =>
                                                                            n[0],
                                                                    )
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    participant.name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    participant.email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            getParticipantStatusBadge(
                                                                participant.status,
                                                            ).variant
                                                        }
                                                        className={
                                                            getParticipantStatusBadge(
                                                                participant.status,
                                                            ).className
                                                        }
                                                    >
                                                        {
                                                            getParticipantStatusBadge(
                                                                participant.status,
                                                            ).label
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-32">
                                                        <div className="mb-1 flex justify-between text-xs">
                                                            <span>
                                                                {
                                                                    participant.progress
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={
                                                                participant.progress
                                                            }
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {participant.lastActivity
                                                        ? new Date(
                                                              participant.lastActivity,
                                                          ).toLocaleDateString()
                                                        : 'Not started'}
                                                </TableCell>
                                                <TableCell>
                                                    {participant.score !==
                                                    undefined ? (
                                                        <span className="font-medium">
                                                            {participant.score}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            -
                                                        </span>
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
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Response
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Send className="mr-2 h-4 w-4" />
                                                                Send Reminder
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Access & Confidentiality</CardTitle>
                                <CardDescription>
                                    Configure security and privacy settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">
                                            Anonymous Responses
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Allow participants to respond
                                            without identifying information
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">
                                            Professional Interpretation Required
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Results require licensed
                                            professional review
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Confidentiality Level</Label>
                                    <Select defaultValue="high">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">
                                                Standard
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High Security
                                            </SelectItem>
                                            <SelectItem value="critical">
                                                Critical (HIPAA Compliant)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Scheduling & Availability</CardTitle>
                                <CardDescription>
                                    Control when this assessment is available
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            type="date"
                                            defaultValue="2024-10-15"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            type="date"
                                            defaultValue="2024-12-31"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Time Limit (minutes)</Label>
                                    <Input type="number" defaultValue="30" />
                                    <p className="text-sm text-gray-500">
                                        Maximum time allowed for completion
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Configure email and alert preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="flex items-center gap-2 text-base">
                                            <Bell className="h-4 w-4" />
                                            Completion Notifications
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Receive alerts when participants
                                            complete the assessment
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="flex items-center gap-2 text-base">
                                            <AlertTriangle className="h-4 w-4" />
                                            Risk Alert Notifications
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Immediate alerts for high-risk
                                            responses
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">
                                            Weekly Summary Reports
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Receive weekly analytics and
                                            progress reports
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Risk Assessment Thresholds
                                </CardTitle>
                                <CardDescription>
                                    Configure automatic risk flagging parameters
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="border-orange-200 bg-orange-50">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    <AlertTitle>
                                        Risk Assessment Active
                                    </AlertTitle>
                                    <AlertDescription>
                                        Responses meeting threshold criteria
                                        will trigger immediate professional
                                        review alerts.
                                    </AlertDescription>
                                </Alert>
                                <div className="space-y-2">
                                    <Label>High Risk Score Threshold</Label>
                                    <Input type="number" defaultValue="29" />
                                    <p className="text-sm text-gray-500">
                                        Scores at or above this value trigger
                                        risk alerts
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Notification Recipients</Label>
                                    <Textarea
                                        placeholder="Enter email addresses (comma-separated)"
                                        defaultValue="clinical-team@example.com, supervisor@example.com"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-900">
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>
                                    Irreversible actions for this assessment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label className="text-base">
                                            Archive Assessment
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Move this assessment to archived
                                            status
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archive
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                                    <div>
                                        <Label className="text-base text-red-900">
                                            Delete Assessment
                                        </Label>
                                        <p className="text-sm text-red-700">
                                            Permanently delete this assessment
                                            and all associated data
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setDeleteDialog(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Delete Assessment
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete "
                            {assessment.title}"? This action cannot be undone
                            and will remove:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
                            <li>
                                All {assessment.totalParticipants} participant
                                responses
                            </li>
                            <li>All analytics and historical data</li>
                            <li>Question configurations and scoring rules</li>
                            <li>Access permissions and sharing settings</li>
                        </ul>
                        <Alert className="mt-4 border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-900">
                                This is a permanent action and cannot be
                                reversed. Consider archiving instead.
                            </AlertDescription>
                        </Alert>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setDeleteDialog(false);
                                alert('Assessment deleted successfully');
                            }}
                        >
                            Permanently Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Share Dialog */}
            <Dialog open={shareDialog} onOpenChange={setShareDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Share Assessment
                        </DialogTitle>
                        <DialogDescription>
                            Generate a shareable link or invite participants
                            directly
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Assessment Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    value="https://assessments.example.com/bdi-ii/a3f7k9"
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button variant="outline" size="sm">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Access Control</Label>
                            <Select defaultValue="restricted">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">
                                        Public - Anyone with link
                                    </SelectItem>
                                    <SelectItem value="restricted">
                                        Restricted - Invited only
                                    </SelectItem>
                                    <SelectItem value="password">
                                        Password Protected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Invite via Email</Label>
                            <Textarea
                                placeholder="Enter email addresses (one per line)"
                                rows={4}
                            />
                        </div>
                        <Alert className="border-blue-200 bg-blue-50">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <AlertDescription>
                                All shared links are encrypted and comply with
                                HIPAA regulations.
                            </AlertDescription>
                        </Alert>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShareDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setShareDialog(false);
                                alert('Invitations sent successfully');
                            }}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Send Invitations
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
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-10 w-96" />
                        <Skeleton className="h-4 w-full max-w-2xl" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-96 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
