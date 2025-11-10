import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import assessment from '@/routes/assessment';
import SingleAssessment from '@/sections/assessment/detail/single-assessment';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Assessments',
        href: assessment.index().url,
    },
    {
        title: 'Beck Depression Inventory (BDI-II)',
        href: '#',
    },
];

export default function AssessmentDetail() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beck Depression Inventory (BDI-II)" />
            <SingleAssessment />
        </AppLayout>
    );
}
