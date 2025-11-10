import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import assessment from '@/routes/assessment';
import { type NavItem } from '@/types';
import { RouteDefinition } from '@/wayfinder';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { ScrollArea } from './ui/scroll-area';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

interface MainNavItem {
    title: string;
    url: string | RouteDefinition<'get'>;
    icon?: React.ElementType;
}
interface MainNav {
    title: string;
    items: MainNavItem[];
}

const navMain: MainNav[] = [
    {
        title: 'Platform',
        items: [
            {
                title: 'Dashboard',
                url: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Assessments',
        items: [
            {
                title: 'All Assessments',
                url: assessment.index(),
            },
            {
                title: 'Create New',
                url: assessment.create(),
            },
            {
                title: 'Assessment Templates',
                url: '#',
            },
        ],
    },
    {
        title: 'Examinees',
        items: [
            {
                title: 'Manage Examinees',
                url: '#',
            },
            {
                title: 'Pending Invitations',
                url: '#',
            },
            {
                title: 'Import Examinees',
                url: '#',
            },
        ],
    },
    {
        title: 'Getting Started',
        items: [
            {
                title: 'Installation',
                url: '#',
            },
            {
                title: 'Project Structure',
                url: '#',
            },
        ],
    },
    {
        title: 'Building Your Application',
        items: [
            {
                title: 'Routing',
                url: '#',
            },
            {
                title: 'Data Fetching',
                url: '#',
            },
            {
                title: 'Rendering',
                url: '#',
            },
            {
                title: 'Caching',
                url: '#',
            },
            {
                title: 'Styling',
                url: '#',
            },
            {
                title: 'Optimizing',
                url: '#',
            },
            {
                title: 'Configuring',
                url: '#',
            },
            {
                title: 'Testing',
                url: '#',
            },
            {
                title: 'Authentication',
                url: '#',
            },
            {
                title: 'Deploying',
                url: '#',
            },
            {
                title: 'Upgrading',
                url: '#',
            },
            {
                title: 'Examples',
                url: '#',
            },
        ],
    },
    {
        title: 'API Reference',
        items: [
            {
                title: 'Components',
                url: '#',
            },
            {
                title: 'File Conventions',
                url: '#',
            },
            {
                title: 'Functions',
                url: '#',
            },
            {
                title: 'next.config.js Options',
                url: '#',
            },
            {
                title: 'CLI',
                url: '#',
            },
            {
                title: 'Edge Runtime',
                url: '#',
            },
        ],
    },
    {
        title: 'Architecture',
        items: [
            {
                title: 'Accessibility',
                url: '#',
            },
            {
                title: 'Fast Refresh',
                url: '#',
            },
            {
                title: 'Next.js Compiler',
                url: '#',
            },
            {
                title: 'Supported Browsers',
                url: '#',
            },
            {
                title: 'Turbopack',
                url: '#',
            },
        ],
    },
    {
        title: 'Community',
        items: [
            {
                title: 'Contribution Guide',
                url: '#',
            },
        ],
    },
];

export function AppSidebar() {
    const page = usePage();
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea className="h-full" type="always">
                    <SidebarGroup>
                        <SidebarMenu>
                            {navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarGroupLabel>
                                        {item.title}
                                    </SidebarGroupLabel>
                                    {item.items?.length ? (
                                        <SidebarMenuSub>
                                            {item.items.map((item) => (
                                                <SidebarMenuSubItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={page.url.startsWith(
                                                            resolveUrl(
                                                                item.url,
                                                            ),
                                                        )}
                                                    >
                                                        <Link
                                                            href={item.url}
                                                            prefetch
                                                        >
                                                            {item.icon && (
                                                                <item.icon />
                                                            )}
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    ) : null}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
