import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Edit, Plus, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// shadcn/ui components
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
// Table component implemented inline
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// ----------------------------------------------------------------------

interface Question {
    id: string;
    text: string;
    type: 'likert' | 'multiple-choice' | 'semantic-differential' | 'open-ended';
    scalePoints?: number;
    options?: string[];
    scoringWeight?: number;
    riskFlag?: boolean;
}

// Zod Schema
const assessmentSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters'),
    testType: z.enum(['personality', 'cognitive', 'clinical', 'behavioral']),
    domains: z.string().min(1, 'At least one domain is required'),
    anonymousResponses: z.boolean(),
    scoringMethodology: z.enum(['likert', 'binary', 'weighted']),
    completionTime: z.number().min(1).max(180),
    confidentialityLevel: z.enum(['standard', 'high', 'critical']),
    professionalInterpretation: z.boolean(),
    clinicalMinScore: z.number().min(0),
    clinicalMaxScore: z.number().min(1),
    riskAssessmentEnabled: z.boolean(),
    professionalGuidelines: z.string().optional(),
    consentContent: z.string().min(20, 'Consent content is required'),
    ethicalApproval: z.boolean().refine((val) => val === true, {
        message: 'Ethical approval must be confirmed',
    }),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

export default function AssessmentCreateEditForm() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null,
    );
    const [domains, setDomains] = useState<string[]>([]);

    const form = useForm<AssessmentFormData>({
        resolver: zodResolver(assessmentSchema),
        defaultValues: {
            title: '',
            description: '',
            testType: 'clinical',
            domains: '',
            anonymousResponses: true,
            scoringMethodology: 'likert',
            completionTime: 15,
            confidentialityLevel: 'high',
            professionalInterpretation: true,
            clinicalMinScore: 0,
            clinicalMaxScore: 100,
            riskAssessmentEnabled: true,
            professionalGuidelines: '',
            consentContent:
                'I consent to participate in this psychological assessment. I understand that my responses will be kept confidential and used for clinical/research purposes only.',
            ethicalApproval: false,
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const completionTime = form.watch('completionTime');
    console.log(form.formState.errors);

    const onSubmit = (data: AssessmentFormData) => {
        console.log('Assessment Data:', { ...data, questions });
        alert('Assessment created successfully! Check console for data.');
    };

    const addDomain = (domain: string) => {
        if (domain && !domains.includes(domain)) {
            const newValue = [...domains, domain];
            setDomains(newValue);
            form.setValue('domains', newValue.join(','));
            form.clearErrors('domains');
        }
    };

    const removeDomain = (domain: string) => {
        const newValue = domains.filter((d) => d !== domain);
        setDomains(newValue);
        form.setValue('domains', newValue.join(','));
        form.clearErrors('domains');
    };

    return (
        <div className="rounded-md bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create Psychological Assessment
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Design a professional psychological evaluation
                        instrument
                    </p>
                </div>

                <Form {...form}>
                    <div className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basic">
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    Settings
                                </TabsTrigger>
                                <TabsTrigger value="questions">
                                    Questions
                                </TabsTrigger>
                                <TabsTrigger value="ethics">
                                    Ethics & Consent
                                </TabsTrigger>
                            </TabsList>

                            {/* Basic Information Tab */}
                            <TabsContent value="basic" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Assessment Details
                                        </CardTitle>
                                        <CardDescription>
                                            Define the core information for your
                                            psychological assessment
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Assessment Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g., Beck Depression Inventory (BDI-II)"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Professional Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Provide a detailed description of the assessment purpose, target population, and clinical applications..."
                                                            rows={4}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="testType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Test Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select test type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="personality">
                                                                Personality
                                                                Assessment
                                                            </SelectItem>
                                                            <SelectItem value="cognitive">
                                                                Cognitive
                                                                Evaluation
                                                            </SelectItem>
                                                            <SelectItem value="clinical">
                                                                Clinical
                                                                Screening
                                                            </SelectItem>
                                                            <SelectItem value="behavioral">
                                                                Behavioral
                                                                Analysis
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-2">
                                            <Label>Psychological Domains</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {domains.map((domain) => (
                                                    <Badge
                                                        key={domain}
                                                        variant="secondary"
                                                        className="px-3 py-1"
                                                    >
                                                        {domain}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDomain(
                                                                    domain,
                                                                )
                                                            }
                                                            className="ml-2 hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-full">
                                                    <Input
                                                        placeholder="Add domain (e.g., Stress, Mood)"
                                                        onKeyPress={(e) => {
                                                            if (
                                                                e.key ===
                                                                'Enter'
                                                            ) {
                                                                e.preventDefault();
                                                                addDomain(
                                                                    (
                                                                        e.target as HTMLInputElement
                                                                    ).value,
                                                                );
                                                                (
                                                                    e.target as HTMLInputElement
                                                                ).value = '';
                                                            }
                                                        }}
                                                        aria-invalid={
                                                            !!form.formState
                                                                .errors?.domains
                                                                ?.message
                                                        }
                                                    />
                                                    {form.formState.errors
                                                        ?.domains?.message && (
                                                        <p className="mt-2 text-sm text-destructive">
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    ?.domains
                                                                    ?.message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Assessment Configuration
                                        </CardTitle>
                                        <CardDescription>
                                            Configure scoring, privacy, and
                                            administrative settings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="anonymousResponses"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>
                                                                Anonymous
                                                                Responses
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Allow
                                                                participants to
                                                                respond
                                                                anonymously
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="professionalInterpretation"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>
                                                                Professional
                                                                Interpretation
                                                                Required
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Results require
                                                                licensed
                                                                professional
                                                                review
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="riskAssessmentEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="flex items-center gap-2">
                                                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                                                Risk Assessment
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Enable automated
                                                                risk flagging
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="scoringMethodology"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Scoring Methodology
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="likert">
                                                                    Likert Scale
                                                                </SelectItem>
                                                                <SelectItem value="binary">
                                                                    Binary
                                                                    (Yes/No)
                                                                </SelectItem>
                                                                <SelectItem value="weighted">
                                                                    Weighted
                                                                    Scoring
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="confidentialityLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Shield className="h-4 w-4" />
                                                            Confidentiality
                                                            Level
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="standard">
                                                                    Standard
                                                                </SelectItem>
                                                                <SelectItem value="high">
                                                                    High
                                                                    Security
                                                                </SelectItem>
                                                                <SelectItem value="critical">
                                                                    Critical
                                                                    (HIPAA
                                                                    Compliant)
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="completionTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Estimated Completion
                                                            Time (minutes)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="clinicalMinScore"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Clinical Min Score
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="clinicalMaxScore"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Clinical Max Score
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="professionalGuidelines"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Professional Guidelines
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Enter interpretation guidelines, scoring thresholds, and clinical considerations..."
                                                            rows={4}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Guidelines for
                                                        professionals
                                                        interpreting results
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Questions Tab */}
                            <TabsContent
                                value="questions"
                                className="space-y-4"
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Assessment Questions
                                                </CardTitle>
                                                <CardDescription>
                                                    Build your psychological
                                                    assessment items
                                                </CardDescription>
                                            </div>
                                            <Dialog
                                                open={isQuestionDialogOpen}
                                                onOpenChange={
                                                    setIsQuestionDialogOpen
                                                }
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        onClick={() =>
                                                            setEditingQuestion(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Question
                                                    </Button>
                                                </DialogTrigger>
                                                <QuestionDialog
                                                    question={editingQuestion}
                                                    onSave={(q) => {
                                                        if (editingQuestion) {
                                                            setQuestions(
                                                                questions.map(
                                                                    (qu) =>
                                                                        qu.id ===
                                                                        q.id
                                                                            ? q
                                                                            : qu,
                                                                ),
                                                            );
                                                        } else {
                                                            setQuestions([
                                                                ...questions,
                                                                {
                                                                    ...q,
                                                                    id: Date.now().toString(),
                                                                },
                                                            ]);
                                                        }
                                                        setIsQuestionDialogOpen(
                                                            false,
                                                        );
                                                        setEditingQuestion(
                                                            null,
                                                        );
                                                    }}
                                                    onClose={() => {
                                                        setIsQuestionDialogOpen(
                                                            false,
                                                        );
                                                        setEditingQuestion(
                                                            null,
                                                        );
                                                    }}
                                                />
                                            </Dialog>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {questions.length === 0 ? (
                                            <div className="py-12 text-center text-gray-500">
                                                <p>
                                                    No questions added yet.
                                                    Click "Add Question" to
                                                    begin.
                                                </p>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12">
                                                            #
                                                        </TableHead>
                                                        <TableHead>
                                                            Question
                                                        </TableHead>
                                                        <TableHead>
                                                            Type
                                                        </TableHead>
                                                        <TableHead className="w-24">
                                                            Risk
                                                        </TableHead>
                                                        <TableHead className="w-24">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {questions.map((q, idx) => (
                                                        <TableRow key={q.id}>
                                                            <TableCell>
                                                                {idx + 1}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {q.text}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {q.type.replace(
                                                                        '-',
                                                                        ' ',
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {q.riskFlag && (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="gap-1"
                                                                    >
                                                                        <AlertTriangle className="h-3 w-3" />
                                                                        Risk
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setEditingQuestion(
                                                                                q,
                                                                            );
                                                                            setIsQuestionDialogOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            setQuestions(
                                                                                questions.filter(
                                                                                    (
                                                                                        qu,
                                                                                    ) =>
                                                                                        qu.id !==
                                                                                        q.id,
                                                                                ),
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Ethics & Consent Tab */}
                            <TabsContent value="ethics" className="space-y-4">
                                <Alert className="border-blue-200 bg-blue-50">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <AlertTitle>
                                        Ethical Requirements
                                    </AlertTitle>
                                    <AlertDescription>
                                        All psychological assessments must
                                        comply with ethical guidelines and
                                        obtain proper informed consent.
                                    </AlertDescription>
                                </Alert>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Informed Consent & Ethics
                                        </CardTitle>
                                        <CardDescription>
                                            Configure consent procedures and
                                            ethical compliance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="consentContent"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Informed Consent
                                                        Statement
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            rows={6}
                                                            placeholder="Enter the complete informed consent text that participants will review..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Must include purpose,
                                                        risks, benefits,
                                                        confidentiality, and
                                                        right to withdraw
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="ethicalApproval"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start space-y-0 space-x-3 rounded-md border border-green-200 bg-green-50 p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            I confirm this
                                                            assessment has
                                                            received ethical
                                                            approval or
                                                            exemption from an
                                                            IRB/Ethics Committee
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Required for all
                                                            clinical and
                                                            research assessments
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Alert>
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>
                                                Confidentiality Notice
                                            </AlertTitle>
                                            <AlertDescription>
                                                This assessment will be stored
                                                securely. Responses are
                                                confidential and will only be
                                                accessible to authorized
                                                professionals. Data will be
                                                encrypted and stored in
                                                compliance with HIPAA/GDPR
                                                regulations.
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card className="sticky bottom-6 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        {questions.length} question(s) •{' '}
                                        {completionTime} minutes
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="button" variant="outline">
                                            Save as Draft
                                        </Button>
                                        <Button
                                            onClick={form.handleSubmit(
                                                onSubmit,
                                            )}
                                        >
                                            Create Assessment
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Form>
            </div>
        </div>
    );
}

// Question Dialog Component
function QuestionDialog({
    question,
    onSave,
    onClose,
}: {
    question: Question | null;
    onSave: (q: Question) => void;
    onClose: () => void;
}) {
    const [questionData, setQuestionData] = useState<Question>(
        question || {
            id: '',
            text: '',
            type: 'likert',
            scalePoints: 5,
            options: [],
            scoringWeight: 1,
            riskFlag: false,
        },
    );

    const [optionInput, setOptionInput] = useState('');

    const handleSave = () => {
        if (questionData.text.trim()) {
            onSave(questionData);
        }
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {question ? 'Edit Question' : 'Add New Question'}
                </DialogTitle>
                <DialogDescription>
                    Create a psychological assessment item with appropriate
                    response format
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea
                        value={questionData.text}
                        onChange={(e) =>
                            setQuestionData({
                                ...questionData,
                                text: e.target.value,
                            })
                        }
                        placeholder="e.g., Over the past two weeks, how often have you felt down, depressed, or hopeless?"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Question Type</Label>
                    <RadioGroup
                        value={questionData.type}
                        onValueChange={(value) =>
                            setQuestionData({
                                ...questionData,
                                type: value as
                                    | 'likert'
                                    | 'multiple-choice'
                                    | 'semantic-differential'
                                    | 'open-ended',
                            })
                        }
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="likert" id="likert" />
                            <Label
                                htmlFor="likert"
                                className="cursor-pointer font-normal"
                            >
                                Likert Scale (e.g., 1-5, 1-7)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multiple-choice" id="mc" />
                            <Label
                                htmlFor="mc"
                                className="cursor-pointer font-normal"
                            >
                                Multiple Choice
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="semantic-differential"
                                id="sd"
                            />
                            <Label
                                htmlFor="sd"
                                className="cursor-pointer font-normal"
                            >
                                Semantic Differential
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="open-ended" id="open" />
                            <Label
                                htmlFor="open"
                                className="cursor-pointer font-normal"
                            >
                                Open-Ended Response
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {questionData.type === 'likert' && (
                    <div className="space-y-2">
                        <Label>Scale Points: {questionData.scalePoints}</Label>
                        <Slider
                            value={[questionData.scalePoints || 5]}
                            onValueChange={([value]) =>
                                setQuestionData({
                                    ...questionData,
                                    scalePoints: value,
                                })
                            }
                            min={3}
                            max={10}
                            step={1}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-500">
                            Range: 1 to {questionData.scalePoints}
                        </p>
                    </div>
                )}

                {questionData.type === 'multiple-choice' && (
                    <div className="space-y-2">
                        <Label>Response Options</Label>
                        <div className="space-y-2">
                            {(questionData.options || []).map((opt, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                >
                                    <Input value={opt} readOnly />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const newOptions = [
                                                ...(questionData.options || []),
                                            ];
                                            newOptions.splice(idx, 1);
                                            setQuestionData({
                                                ...questionData,
                                                options: newOptions,
                                            });
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <Input
                                    value={optionInput}
                                    onChange={(e) =>
                                        setOptionInput(e.target.value)
                                    }
                                    placeholder="Add option..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (optionInput.trim()) {
                                                setQuestionData({
                                                    ...questionData,
                                                    options: [
                                                        ...(questionData.options ||
                                                            []),
                                                        optionInput,
                                                    ],
                                                });
                                                setOptionInput('');
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (optionInput.trim()) {
                                            setQuestionData({
                                                ...questionData,
                                                options: [
                                                    ...(questionData.options ||
                                                        []),
                                                    optionInput,
                                                ],
                                            });
                                            setOptionInput('');
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Scoring Weight</Label>
                        <Input
                            type="number"
                            value={questionData.scoringWeight}
                            onChange={(e) =>
                                setQuestionData({
                                    ...questionData,
                                    scoringWeight: parseFloat(e.target.value),
                                })
                            }
                            step="0.1"
                            min="0"
                            max="10"
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                Risk Flag
                            </Label>
                            <p className="text-xs text-gray-500">
                                Trigger alert on certain responses
                            </p>
                        </div>
                        <Switch
                            checked={questionData.riskFlag}
                            onCheckedChange={(checked) =>
                                setQuestionData({
                                    ...questionData,
                                    riskFlag: checked,
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                    {question ? 'Update' : 'Add'} Question
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
