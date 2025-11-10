import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import assessment from '@/routes/assessment';
import AssessmentListPage from '@/sections/assessment/list/assessment-list';
// import DataTablePage from '@/sections/data-table/page';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Assessment List',
        href: assessment.index().url,
    },
];

export default function AssessmentList() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessment List" />
            <AssessmentListPage />
            {/* <DataTablePage /> */}
        </AppLayout>
    );
}
