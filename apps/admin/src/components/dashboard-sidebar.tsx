import type { ComponentProps } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@aow/ui/components/sidebar';
import { Link } from '@tanstack/react-router';

const data = {
  navMain: [
    {
      title: 'Главная',
      url: '/dashboard',
      items: [
        {
          title: 'Категории товаров',
          url: '/dashboard/product-categories',
        },
        {
          title: 'Товары',
          url: '/dashboard/products',
        },
        {
          title: 'Типы праздников',
          url: '/dashboard/event-types',
        },
        {
          title: 'Заявки на праздники',
          url: '/dashboard/event-requests',
        },
      ],
    },
  ],
};

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar
      {...props}
      className='border-border bg-card border-r'
    >
      <SidebarContent className='p-2'>
        {data.navMain.map(group => (
          <SidebarGroup
            key={group.title}
            className='py-4'
          >
            <SidebarGroupLabel className='px-4 font-black tracking-widest uppercase'>
              <Link to={group.url}>{group.title}</Link>
            </SidebarGroupLabel>
            <SidebarGroupContent className='mt-2'>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className='hover:bg-muted/50 group relative h-11 px-4 transition-all duration-300'
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Link
                        to={item.url}
                        activeProps={{
                          className: 'bg-primary/5 text-primary ',
                        }}
                      >
                        <span className='group-[.active]:text-primary text-[11px] font-bold tracking-widest uppercase transition-colors'>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
