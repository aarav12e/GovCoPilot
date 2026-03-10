import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, buttonVariants } from './button';
import { cn } from '../../lib/utils';
import { MenuToggleIcon } from './menu-toggle-icon';
import { useScroll } from './use-scroll';

const NAV = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/documents', label: 'Documents' },
    { to: '/draft', label: 'Drafts' },
    { to: '/chat', label: 'AI Chat' },
    { to: '/constituency', label: 'Constituency' },
    { to: '/meeting', label: 'Meetings' },
    { to: '/scheduler', label: 'Scheduler' },
];

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

    React.useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const handleNavigation = (e, path) => {
        e.preventDefault();
        navigate(path);
        setOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("is_logged_in");
        window.location.href = '/login';
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-50 mx-auto w-full max-w-7xl border-b border-transparent md:rounded-b-2xl md:border-x md:border-b md:transition-all md:ease-out',
                {
                    'bg-surface/95 supports-[backdrop-filter]:bg-surface/50 border-border1 backdrop-blur-xl md:top-4 md:shadow-2xl shadow-black':
                        scrolled && !open,
                    'bg-surface/95 backdrop-blur-xl border-border1': open,
                },
            )}
        >
            <nav
                className={cn(
                    'flex h-16 w-full items-center justify-between px-4 md:transition-all md:ease-out',
                    { 'md:px-6 md:h-14': scrolled, 'md:px-4': !scrolled }
                )}
            >
                <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleNavigation(e, '/')}>
                    <WordmarkIcon className="h-6 text-indigo-400" />
                    <span className="font-display font-black text-xl tracking-tight hidden sm:block text-white">Gov<span className="text-indigo-400">CoPilot</span></span>
                </div>

                <div className="hidden items-center gap-1 md:flex">
                    {isLoggedIn && NAV.map((link, i) => {
                        const isActive = pathname === link.to || (pathname === '/' && link.to === '/dashboard');
                        return (
                            <a
                                key={i}
                                className={cn(buttonVariants({ variant: 'ghost' }), "transition-colors font-medium text-sm", isActive ? "bg-indigo-500/10 text-indigo-300" : "text-text2 hover:text-white")}
                                href={link.to}
                                onClick={(e) => handleNavigation(e, link.to)}
                            >
                                {link.label}
                            </a>
                        )
                    })}

                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border1">
                            <Button variant="ghost" onClick={(e) => handleNavigation(e, '/login')} className="text-text2">Sign In</Button>
                            <Button onClick={(e) => handleNavigation(e, '/login')} className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">Get Started</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-text1">Arjun K.</span>
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-300 text-sm font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]">AK</div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-text3 hover:text-rose-400" title="Sign Out">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </Button>
                        </div>
                    )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden text-text1 hover:text-white">
                    <MenuToggleIcon open={open} className="size-6" duration={300} />
                </Button>
            </nav>

            <div
                className={cn(
                    'bg-surface/95 backdrop-blur-xl fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-y-auto border-t border-border1 md:hidden',
                    open ? 'block' : 'hidden',
                )}
            >
                <div
                    data-slot={open ? 'open' : 'closed'}
                    className={cn(
                        'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
                        'flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between p-6',
                    )}
                >
                    <div className="flex flex-col gap-2">
                        {isLoggedIn && NAV.map((link) => {
                            const isActive = pathname === link.to || (pathname === '/' && link.to === '/dashboard');
                            return (
                                <a
                                    key={link.label}
                                    className={cn(buttonVariants({ variant: 'ghost' }), "justify-start text-lg h-14 font-medium", isActive ? "bg-indigo-500/10 text-indigo-300" : "text-text2")}
                                    href={link.to}
                                    onClick={(e) => handleNavigation(e, link.to)}
                                >
                                    {link.label}
                                </a>
                            )
                        })}
                    </div>
                    <div className="flex flex-col gap-4 mt-8 pb-12">
                        {!isLoggedIn ? (
                            <>
                                <Button variant="outline" className="w-full h-12 text-lg border-border1 text-text1" onClick={(e) => handleNavigation(e, '/login')}>
                                    Sign In
                                </Button>
                                <Button className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]" onClick={(e) => handleNavigation(e, '/login')}>Get Started</Button>
                            </>
                        ) : (
                            <Button variant="ghost" className="w-full h-12 text-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20" onClick={handleLogout}>Sign Out</Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export const WordmarkIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3v19M5 10l7-7 7 7" />
    </svg>
);
