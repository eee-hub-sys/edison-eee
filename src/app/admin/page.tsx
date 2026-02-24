"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Menu, Zap, Shield, RefreshCw, LogOut, Bell, Plus, Trash2, Calendar, Image as ImageIcon, Upload, Loader2, LayoutDashboard, Edit3, Save, X as CloseIcon, UserPlus, Users, CheckCircle2, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateRegistrationStatusAction, deleteRegistrationAction } from "@/app/actions/admin";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Registration {
    id: string;
    name: string;

    year: string;
    roll_number: string;
    email: string;
    club: string;
    mobile: string;
    created_at: string;
    status: 'pending' | 'accepted' | 'rejected';
}

interface Update {
    id: string;
    message: string;
    created_at: string;
}

interface Event {
    id: string;
    club: string;
    title: string;
    description: string;
    date: string;
    image: string;
    tags: string[];
    isLive?: boolean;
}

interface GalleryItem {
    id: string;
    club: string;
    title: string;
    image: string;
}

interface Club {
    id: string;
    name: string;
    description: string;
    faculty: string;
    student: string;
    icon: string;
    color?: string;
}

interface Coordinator {
    id: string;
    name: string;
    type: 'faculty' | 'student';
    roll_number?: string;
    mobile: string;
    image: string;
    club: string;
}

const AdminPage = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [updates, setUpdates] = useState<Update[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'registrations' | 'updates' | 'events' | 'gallery' | 'clubs' | 'coordinators'>('registrations');
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null);

    const router = useRouter();

    // Form States
    const [newUpdate, setNewUpdate] = useState("");
    const [newEvent, setNewEvent] = useState({ title: "", club: "", date: "", description: "", tags: "" });
    const [newGalleryItem, setNewGalleryItem] = useState({ title: "", club: "" });
    const [editingClub, setEditingClub] = useState<Club | null>(null);
    const [newCoordinator, setNewCoordinator] = useState({ name: "", type: "student", roll_number: "", mobile: "", club: "" });

    const [eventFile, setEventFile] = useState<File | null>(null);
    const [galleryFile, setGalleryFile] = useState<File | null>(null);
    const [coordinatorFile, setCoordinatorFile] = useState<File | null>(null);

    const eventInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const coordinatorInputRef = useRef<HTMLInputElement>(null);

    // Auth Check
    const fetchRegistrations = React.useCallback(async () => {
        const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
        setRegistrations(data || []);
    }, []);

    const fetchUpdates = React.useCallback(async () => {
        const { data } = await supabase.from('updates').select('*').order('created_at', { ascending: false });
        setUpdates(data || []);
    }, []);

    const fetchEvents = React.useCallback(async () => {
        const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
        setEvents(data || []);
    }, []);

    const fetchGallery = React.useCallback(async () => {
        const { data } = await supabase.from('gallery').select('*');
        setGallery(data || []);
    }, []);

    const fetchClubs = React.useCallback(async () => {
        const { data } = await supabase.from('clubs').select('*').order('name');
        setClubs(data || []);
    }, []);

    const fetchCoordinators = React.useCallback(async () => {
        const { data } = await supabase.from('coordinators').select('*').order('type', { ascending: true });
        setCoordinators(data || []);
    }, []);

    const fetchData = React.useCallback(async (isRefresh = false) => {
        if (isRefresh) setLoading(true);
        await Promise.all([fetchRegistrations(), fetchUpdates(), fetchEvents(), fetchGallery(), fetchClubs(), fetchCoordinators()]);
        setLoading(false);
    }, [fetchRegistrations, fetchUpdates, fetchEvents, fetchGallery, fetchClubs, fetchCoordinators]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            } else {
                setUserEmail(session.user.email || "Admin");
                setAuthLoading(false);
                fetchData();
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/admin/login");
            } else {
                setUserEmail(session.user.email || "Admin");
                setAuthLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, fetchData]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('portal-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('portal-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    // Update CRUD
    const handleAddUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUpdate.trim()) return;
        await supabase.from('updates').insert([{ message: newUpdate }]);
        setNewUpdate("");
        fetchUpdates();
    };

    const handleDeleteUpdate = async (id: string) => {
        await supabase.from('updates').delete().eq('id', id);
        fetchUpdates();
    };

    // Event CRUD
    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventFile) return alert("Please select an image");

        setUploading(true);
        try {
            const imageUrl = await uploadImage(eventFile);
            const tagsArray = newEvent.tags.split(',').map(t => t.trim());

            const { error } = await supabase.from('events').insert([{
                ...newEvent,
                image: imageUrl,
                tags: tagsArray
            }]);

            if (!error) {
                setNewEvent({ title: "", club: "", date: "", description: "", tags: "" });
                setEventFile(null);
                fetchEvents();
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        await supabase.from('events').delete().eq('id', id);
        fetchEvents();
    };

    // Gallery CRUD
    const handleAddGalleryItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryFile) return alert("Please select an image");

        setUploading(true);
        try {
            const imageUrl = await uploadImage(galleryFile);
            const { error } = await supabase.from('gallery').insert([{
                ...newGalleryItem,
                image: imageUrl
            }]);

            if (!error) {
                setNewGalleryItem({ title: "", club: "" });
                setGalleryFile(null);
                fetchGallery();
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGalleryItem = async (id: string) => {
        await supabase.from('gallery').delete().eq('id', id);
        fetchGallery();
    };

    // Club CRUD
    const handleUpdateClub = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClub) return;

        const { error } = await supabase
            .from('clubs')
            .update({
                name: editingClub.name,
                description: editingClub.description,
                faculty: editingClub.faculty,
                student: editingClub.student,
                icon: editingClub.icon
            })
            .eq('id', editingClub.id);

        if (!error) {
            setEditingClub(null);
            fetchClubs();
        } else {
            alert("Error updating club");
        }
    };

    // Coordinator CRUD
    const handleAddCoordinator = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coordinatorFile) return alert("Please select a photo");

        setUploading(true);
        try {
            const imageUrl = await uploadImage(coordinatorFile);
            const { error } = await supabase.from('coordinators').insert([{
                ...newCoordinator,
                image: imageUrl
            }]);

            if (!error) {
                setNewCoordinator({ name: "", type: "student", roll_number: "", mobile: "", club: "" });
                setCoordinatorFile(null);
                fetchCoordinators();
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Error uploading photo");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCoordinator = async (id: string) => {
        await supabase.from('coordinators').delete().eq('id', id);
        fetchCoordinators();
    };

    const handleUpdateStatus = async (id: string, newStatus: 'accepted' | 'rejected') => {
        const result = await updateRegistrationStatusAction(id, newStatus);

        if (!result.success) {
            console.error("Error updating status:", result.error);
            alert("Failed to update status: " + result.error);
        } else {
            fetchRegistrations();
            // Email Sending Logic for Accepted Status in background
            if (newStatus === 'accepted') {
                const reg = registrations.find(r => r.id === id);
                if (reg && reg.email) {
                    emailjs.send(
                        "service_hmbpntj", // Your Service ID
                        "template_krpimmo", // Replace with your Acceptance Template ID
                        {
                            to_name: reg.name,
                            to_email: reg.email,
                            club_name: reg.club,
                            message: `Congratulations! Your application for ${reg.club} has been accepted. Welcome to the team!`,
                        },
                        "wkedLSVzh-u7CXVRU" // Replace with your Public Key
                    ).catch(emailError => {
                        console.error("Acceptance Email Error:", emailError);
                    });
                }
            }
        }
    };

    const handleDeleteRegistration = async (id: string) => {
        if (!confirm("Are you sure you want to delete this registration? This cannot be undone.")) return;

        const result = await deleteRegistrationAction(id);
        if (!result.success) {
            alert("Failed to delete: " + result.error);
        } else {
            fetchRegistrations();
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="text-primary animate-spin" size={40} />
                    <span className="text-text-muted text-xs font-black uppercase tracking-[0.3em]">Validating Session</span>
                </div>
            </div>
        );
    }


    const navItems = [
        { id: 'registrations', label: 'Dashboard', icon: Shield },
        { id: 'updates', label: 'Pulsar Feed', icon: Bell },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'clubs', label: 'Club Hubs', icon: LayoutDashboard },
        { id: 'coordinators', label: 'Network', icon: Users },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "flex flex-col w-72 bg-background lg:bg-secondary/50 backdrop-blur-3xl border-r border-black/10 p-6 lg:p-8 fixed inset-y-0 left-0 z-50 transition-transform duration-300 overflow-y-auto pb-24 lg:pb-8",
                isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex items-center gap-4 justify-center mb-10 pt-4 lg:pt-0">
                    <div className="flex items-center gap-3 bg-secondary/70 px-4 py-2 rounded-2xl border border-black/10 backdrop-blur-sm shadow-lg">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_30px_-10px_rgba(168,35,35,0.5)]">
                            <Zap className="text-primary fill-current" size={24} />
                        </div>
                        <span className="text-2xl font-black montserrat tracking-tighter text-foreground">EDISON</span>
                    </div>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as 'registrations' | 'updates' | 'events' | 'gallery' | 'clubs' | 'coordinators');
                                setIsSidebarOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold",
                                activeTab === item.id ? "bg-primary/10 text-primary shadow-sm" : "text-text-muted hover:bg-black/5"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-red-400 hover:bg-red-400/5 transition-all font-bold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    <Link href="/" className="flex items-center gap-3 px-5 py-4 rounded-xl text-text-muted hover:text-white transition-all">
                        <Shield className="shrink-0" size={20} />
                        <span>Site Preview</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 p-6 md:p-12 w-full overflow-hidden">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 bg-black/5 rounded-xl text-primary shrink-0"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                                Security Gateway
                            </span>
                            <h1 className="text-2xl md:text-4xl font-black montserrat">Admin Console</h1>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="text-text-muted text-xs uppercase tracking-widest block mb-1">Connected as</span>
                        <span className="text-primary font-bold">{userEmail}</span>
                    </div>
                </header>

                {activeTab === 'registrations' && (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 hover:border-primary/30 transition-colors border-primary/20 bg-primary/5">
                                <span className="text-4xl font-black montserrat block mb-2 text-primary">{registrations.length}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/80">Total Applicants</span>
                            </motion.div>

                            {clubs.map((club, i) => (
                                <motion.div
                                    key={club.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-6 md:p-8 hover:border-primary/30 transition-colors"
                                >
                                    <span className="text-4xl font-black montserrat block mb-2 text-primary">
                                        {registrations.filter(r => r.club === club.name).length}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/80">{club.name}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="glass-card p-6 md:p-10">

                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold montserrat">Live Feed</h3>
                                <button onClick={() => fetchData(true)} className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-all text-primary">
                                    <RefreshCw size={20} className={cn(loading && "animate-spin")} />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                                            <th className="px-4 py-4">Applicant</th>
                                            <th className="px-4 py-4">Roll ID</th>
                                            <th className="px-4 py-4">Domain</th>

                                            <th className="px-4 py-4 text-right min-w-[120px]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {registrations.map((reg) => (
                                            <tr key={reg.id} className="text-sm">
                                                <td className="px-4 py-6 font-bold">{reg.name}</td>
                                                <td className="px-4 py-6 font-mono text-accent">{reg.roll_number}</td>
                                                <td className="px-4 py-6 text-primary">{reg.club}</td>

                                                <td className="px-4 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleDeleteRegistration(reg.id)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-400/20 transition-all mr-2"
                                                            title="Delete Registration"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        {reg.status === 'accepted' ? (
                                                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase">Accepted</span>
                                                        ) : reg.status === 'rejected' ? (
                                                            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase">Rejected</span>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleUpdateStatus(reg.id, 'accepted')}
                                                                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                                                                    title="Accept Application"
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-400/20 transition-all"
                                                                    title="Reject Application"
                                                                >
                                                                    <CloseIcon size={16} />
                                                                </button>
                                                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">Active Review</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'updates' && (
                    <div className="space-y-8">
                        <div className="glass-card p-6 md:p-8">

                            <h3 className="text-xl font-bold montserrat mb-6 flex items-center gap-2"><Plus className="text-primary" /> Broadcast News</h3>
                            <form onSubmit={handleAddUpdate} className="flex flex-col sm:flex-row gap-4">
                                <input type="text" value={newUpdate} onChange={(e) => setNewUpdate(e.target.value)} placeholder="Enter circular message..." className="flex-1 bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" />
                                <button type="submit" className="btn-primary py-4 px-8 font-bold whitespace-nowrap">Broadcast</button>
                            </form>
                        </div>
                        <div className="glass-card p-6 md:p-8">

                            <h3 className="text-xl font-bold montserrat mb-8">Active Feed</h3>
                            <div className="space-y-4">
                                {updates.map((upd) => (
                                    <div key={upd.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-black/5 border border-black/10 group gap-4">
                                        <div className="flex items-start sm:items-center gap-4">
                                            <Bell size={20} className="text-primary shrink-0 mt-1 sm:mt-0" />
                                            <div>
                                                <p className="font-medium">{upd.message}</p>
                                                <p className="text-[10px] text-text-muted uppercase mt-1">{new Date(upd.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteUpdate(upd.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg self-end sm:self-auto"><Trash2 size={20} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="space-y-8">
                        <div className="glass-card p-6 md:p-10">

                            <h3 className="text-xl font-bold montserrat mb-6 flex items-center gap-2"><Plus className="text-primary" /> Create Event</h3>
                            <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" required />
                                <select value={newEvent.club} onChange={e => setNewEvent({ ...newEvent, club: e.target.value })} className="bg-secondary border border-black/10 rounded-xl px-5 py-4 outline-none" required>
                                    <option value="">Select Club</option>
                                    {clubs.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" required />
                                <div onClick={() => eventInputRef.current?.click()} className="bg-black/5 border-2 border-dashed border-black/10 rounded-xl px-5 py-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group">
                                    <input type="file" ref={eventInputRef} hidden accept="image/*" onChange={(e) => setEventFile(e.target.files?.[0] || null)} />
                                    {eventFile ? <div className="flex items-center gap-2 text-primary font-bold"><ImageIcon size={20} /><span className="truncate max-w-[200px]">{eventFile.name}</span></div> : <div className="flex flex-col items-center gap-1 text-text-muted group-hover:text-primary transition-colors"><Upload size={24} /><span className="text-xs font-bold uppercase tracking-widest">Select Cover Image</span></div>}
                                </div>
                                <input type="text" placeholder="Tags (comma separated)" value={newEvent.tags} onChange={e => setNewEvent({ ...newEvent, tags: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none col-span-full" />
                                <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none col-span-full h-32" required />
                                <button type="submit" disabled={uploading} className="btn-primary py-4 font-bold col-span-full flex items-center justify-center gap-2">{uploading ? <Loader2 className="animate-spin" /> : "Publish Event"}</button>
                            </form>
                        </div>
                        <div className="glass-card p-6 md:p-8">

                            <h3 className="text-xl font-bold montserrat mb-8">Event Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {events.map(ev => (
                                    <div key={ev.id} className="bg-secondary/50 border border-black/10 rounded-2xl overflow-hidden group">
                                        <div className="h-40 overflow-hidden relative">
                                            <Image
                                                src={ev.image}
                                                alt={ev.title}
                                                fill
                                                unoptimized
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest">{ev.club}</div>
                                        </div>
                                        <div className="p-6"><h4 className="font-bold text-lg mb-2">{ev.title}</h4><p className="text-xs text-text-muted mb-4 line-clamp-2">{ev.description}</p><div className="flex items-center justify-between"><span className="text-xs font-mono text-accent">{ev.date}</span><button onClick={() => handleDeleteEvent(ev.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button></div></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-8">
                        <div className="glass-card p-6 md:p-10">

                            <h3 className="text-xl font-bold montserrat mb-6 flex items-center gap-2"><Plus className="text-primary" /> Add Gallery Item</h3>
                            <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Title" value={newGalleryItem.title} onChange={e => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" required />
                                <select value={newGalleryItem.club} onChange={e => setNewGalleryItem({ ...newGalleryItem, club: e.target.value })} className="bg-secondary border border-black/10 rounded-xl px-5 py-4 outline-none" required>
                                    <option value="">Select Club</option>
                                    {clubs.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <div onClick={() => galleryInputRef.current?.click()} className="bg-black/5 border-2 border-dashed border-black/10 rounded-xl px-5 py-4 col-span-full flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group">
                                    <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} />
                                    {galleryFile ? <div className="flex items-center gap-2 text-primary font-bold"><ImageIcon size={20} /><span className="truncate max-w-[200px]">{galleryFile.name}</span></div> : <div className="flex flex-col items-center gap-1 text-text-muted group-hover:text-primary transition-colors"><Upload size={24} /><span className="text-xs font-bold uppercase tracking-widest">Select Image from Device</span></div>}
                                </div>
                                <button type="submit" disabled={uploading} className="btn-primary py-4 font-bold col-span-full flex items-center justify-center gap-2">{uploading ? <Loader2 className="animate-spin" /> : "Upload to Grid"}</button>
                            </form>
                        </div>
                        <div className="glass-card p-6 md:p-8">
                            <h3 className="text-xl font-bold montserrat mb-8">Gallery Management</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {gallery.map(item => (
                                    <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-video border border-black/10">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                            <p className="text-xs font-bold mb-1">{item.title}</p><p className="text-[10px] text-primary font-black uppercase mb-3">{item.club}</p><button onClick={() => handleDeleteGalleryItem(item.id)} className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/40 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'clubs' && (
                    <div className="space-y-8">
                        {editingClub ? (
                            <div className="glass-card p-6 md:p-10">

                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold montserrat flex items-center gap-2"><Edit3 size={20} className="text-primary" /> Edit {editingClub.name}</h3>
                                    <button onClick={() => setEditingClub(null)} className="p-2 hover:bg-white/5 rounded-lg text-text-muted"><CloseIcon size={20} /></button>
                                </div>
                                <form onSubmit={handleUpdateClub} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Club Name</label>
                                        <input type="text" value={editingClub.name} onChange={e => setEditingClub({ ...editingClub, name: e.target.value })} className="w-full bg-black/5 border border-black/10 rounded-xl px-5 py-4 outline-none focus:border-primary" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Icon (Emoji or SVG)</label>
                                        <input type="text" value={editingClub.icon} onChange={e => setEditingClub({ ...editingClub, icon: e.target.value })} className="w-full bg-black/5 border border-black/10 rounded-xl px-5 py-4 outline-none focus:border-primary" required />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Description</label>
                                        <textarea value={editingClub.description} onChange={e => setEditingClub({ ...editingClub, description: e.target.value })} className="w-full bg-black/5 border border-black/10 rounded-xl px-5 py-4 outline-none focus:border-primary h-32" required />
                                    </div>

                                    <button type="submit" className="btn-primary py-4 font-bold col-span-full flex items-center justify-center gap-2"><Save size={18} /> Update Hub Info</button>
                                </form>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {clubs.map(club => (
                                    <div key={club.id} className="glass-card group flex flex-col p-6 md:p-8">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary/20 transition-colors">{club.icon}</div>
                                        <h4 className="text-xl md:text-2xl font-black montserrat mb-3">{club.name}</h4>
                                        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-8 flex-1">{club.description}</p>

                                        <button
                                            onClick={() => setEditingClub(club)}
                                            className="w-full bg-black/5 hover:bg-primary/20 border border-black/10 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 text-text-muted hover:text-primary group/btn mt-auto"
                                        >
                                            <Edit3 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            Configure Hub
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'coordinators' && (
                    <div className="space-y-8">
                        <div className="glass-card p-6 md:p-10">

                            <h3 className="text-xl font-bold montserrat mb-6 flex items-center gap-2"><UserPlus className="text-primary" /> Recruit Coordinator</h3>
                            <form onSubmit={handleAddCoordinator} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name" value={newCoordinator.name} onChange={e => setNewCoordinator({ ...newCoordinator, name: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" required />
                                <select value={newCoordinator.type} onChange={e => setNewCoordinator({ ...newCoordinator, type: e.target.value as 'student' | 'faculty' })} className="bg-secondary border border-black/10 rounded-xl px-5 py-4 outline-none" required>
                                    <option value="student">Student Lead</option>
                                    <option value="faculty">Faculty Coordinator</option>
                                </select>
                                <input type="text" placeholder="Roll Number (Students only)" value={newCoordinator.roll_number} onChange={e => setNewCoordinator({ ...newCoordinator, roll_number: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" />
                                <input type="text" placeholder="Mobile Number" value={newCoordinator.mobile} onChange={e => setNewCoordinator({ ...newCoordinator, mobile: e.target.value })} className="bg-black/5 border border-black/10 rounded-xl px-5 py-4 focus:border-primary outline-none" required />
                                <select value={newCoordinator.club} onChange={e => setNewCoordinator({ ...newCoordinator, club: e.target.value })} className="bg-secondary border border-black/10 rounded-xl px-5 py-4 outline-none col-span-full" required>
                                    <option value="">Associated Club</option>
                                    {clubs.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>

                                <div
                                    onClick={() => coordinatorInputRef.current?.click()}
                                    className="bg-black/5 border-2 border-dashed border-black/10 rounded-xl px-5 py-4 col-span-full flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group"
                                >
                                    <input
                                        type="file"
                                        ref={coordinatorInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => setCoordinatorFile(e.target.files?.[0] || null)}
                                    />
                                    {coordinatorFile ? (
                                        <div className="flex items-center gap-2 text-primary font-bold">
                                            <ImageIcon size={20} />
                                            <span className="truncate max-w-[200px]">{coordinatorFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-text-muted group-hover:text-primary transition-colors">
                                            <Upload size={24} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Select Profile Photo</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="btn-primary py-4 font-bold col-span-full flex items-center justify-center gap-2"
                                >
                                    {uploading ? <Loader2 className="animate-spin" /> : "Onboard Coordinator"}
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coordinators.map(coord => (
                                <div
                                    key={coord.id}
                                    className="glass-card group relative p-6 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                    onClick={() => setSelectedCoordinator(coord)}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0 relative">
                                            <Image
                                                src={coord.image}
                                                alt={coord.name}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                                    coord.type === 'faculty' ? "bg-purple-500/20 text-purple-400" : "bg-primary/20 text-primary"
                                                )}>
                                                    {coord.type}
                                                </span>
                                            </div>
                                            <h4 className="font-bold truncate text-white uppercase tracking-tight">{coord.name}</h4>
                                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 truncate">{coord.club}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCoordinator(coord.id); }}
                                            className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block">Identity</span>
                                            <span className="text-[10px] font-bold text-white/80">{coord.roll_number || 'N/A'}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block">Contact</span>
                                            <span className="text-[10px] font-bold text-white/80">{coord.mobile}</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">Click to view ID</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ID Card Modal */}
                        {selectedCoordinator && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
                                onClick={() => setSelectedCoordinator(null)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.85, y: 30 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                    className="relative w-full max-w-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* ID Card */}
                                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                                        {/* Card Header Strip */}
                                        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #a82323, #c0392b, #e74c3c)' }} />

                                        {/* Institution Header */}
                                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40">
                                                    <Zap className="text-primary fill-current" size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50">Edison EEE</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Dept. of EEE</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Identity Card</p>
                                                <p className="text-[10px] font-bold text-primary">2025–2026</p>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            <div className="flex gap-5 mb-6">
                                                {/* Photo */}
                                                <div className="shrink-0">
                                                    <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-lg shadow-primary/20 relative">
                                                        <Image
                                                            src={selectedCoordinator.image}
                                                            alt={selectedCoordinator.name}
                                                            fill
                                                            unoptimized
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className={cn(
                                                        "mt-2 text-center py-1 rounded-lg text-[8px] font-black uppercase tracking-wider",
                                                        selectedCoordinator.type === 'faculty' ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-primary/20 text-primary border border-primary/30"
                                                    )}>
                                                        {selectedCoordinator.type === 'faculty' ? 'Faculty' : 'Student Lead'}
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0 space-y-3">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">Full Name</p>
                                                        <p className="text-base font-black uppercase tracking-tight text-white leading-tight">{selectedCoordinator.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">Club</p>
                                                        <p className="text-xs font-bold text-primary uppercase tracking-widest">{selectedCoordinator.club}</p>
                                                    </div>
                                                    {selectedCoordinator.roll_number && (
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">Roll Number</p>
                                                            <p className="text-sm font-black font-mono text-yellow-400 tracking-wider">{selectedCoordinator.roll_number}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-5" />

                                            {/* Bottom Info Row */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Contact</p>
                                                    <p className="text-xs font-bold text-white font-mono">{selectedCoordinator.mobile}</p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Department</p>
                                                    <p className="text-xs font-bold text-white">EEE</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-6 pb-5">
                                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/80">Vignan Institute of Technology and Science</p>
                                            </div>
                                        </div>

                                        {/* Bottom Strip */}
                                        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #e74c3c, #c0392b, #a82323)' }} />
                                    </div>

                                    {/* Close button */}
                                    <button
                                        onClick={() => setSelectedCoordinator(null)}
                                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all shadow-lg"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;
