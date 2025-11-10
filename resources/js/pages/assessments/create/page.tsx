import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import assessment from '@/routes/assessment';
import AssessmentCreateEditForm from '@/sections/assessment/create-edit-form';
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
    {
        title: 'New Assessment',
        href: assessment.create().url,
    },
];

export default function AssessmentCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Assessment" />
            <div className="mx-auto w-full max-w-[1200px] py-4">
                <AssessmentCreateEditForm />
            </div>
        </AppLayout>
    );
}
