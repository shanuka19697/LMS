import {
    User, Mail, Phone, MapPin, Building2,
    GraduationCap, Fingerprint, Calendar,
    MessageCircle, CreditCard, School,
    Globe
} from "lucide-react";
import Link from "next/link";
import { getStudentProfile } from "@/actions/student";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const studentIndex = await getSession();

    if (!studentIndex) {
        redirect("/login");
    }

    const profile = await getStudentProfile(studentIndex);

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500 font-medium">Profile not found.</p>
            </div>
        );
    }

    const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-16">
            {/* Page Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 lg:p-12 text-white shadow-2xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl lg:text-5xl font-bold border-4 border-white/30 shadow-2xl ring-4 ring-white/10">
                            {initials}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-indigo-600 w-8 h-8 rounded-full shadow-lg" title="Online" />
                    </div>

                    <div className="text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-4xl lg:text-5xl font-bold font-heading">{profile.firstName} {profile.lastName}</h1>
                            <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold border border-white/20">
                                Level 4 Student
                            </div>
                        </div>
                        <p className="text-indigo-100 text-lg font-medium opacity-90 max-w-xl">
                            Studying {profile.stream} at {profile.institute}. Committed to academic excellence and modern learning.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold">
                                <Fingerprint className="w-4 h-4 text-indigo-300" />
                                {profile.indexNumber}
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold">
                                <Calendar className="w-4 h-4 text-indigo-300" />
                                Exam Year: {profile.examYear}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact & Personal Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Info Grid */}
                    <SectionContainer title="Personal Details" icon={<User className="text-indigo-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoItem icon={<User />} label="First Name" value={profile.firstName} />
                            <InfoItem icon={<User />} label="Last Name" value={profile.lastName} />
                            <InfoItem icon={<CreditCard />} label="NIC Number" value={profile.nic} />
                            <InfoItem icon={<Mail />} label="Email Address" value={profile.email} isEmail />
                        </div>
                    </SectionContainer>

                    {/* Contact Details Grid */}
                    <SectionContainer title="Contact Information" icon={<Phone className="text-blue-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoItem icon={<Phone />} label="Phone Number" value={profile.phoneNumber} />
                            <InfoItem icon={<MessageCircle />} label="WhatsApp" value={profile.whatsappNumber} />
                            <div className="md:col-span-2">
                                <InfoItem icon={<MapPin />} label="Permanent Address" value={profile.address} />
                            </div>
                        </div>
                    </SectionContainer>
                </div>

                {/* Academic Details (Right Sidebar) */}
                <div className="space-y-8">
                    <SectionContainer title="Academic Path" icon={<GraduationCap className="text-orange-500" />}>
                        <div className="space-y-6">
                            <SidebarItem icon={<Building2 />} label="Institute" value={profile.institute} />
                            <SidebarItem icon={<Globe />} label="Stream" value={profile.stream} />
                            <SidebarItem icon={<School />} label="School" value={profile.school} />
                            <SidebarItem icon={<MapPin />} label="District" value={profile.district} />
                        </div>
                    </SectionContainer>

                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-8 rounded-[2rem] border border-indigo-200/40 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold text-indigo-900 mb-4">Account Management</h4>
                            <div className="space-y-3">
                                <Link href="/dashboard/profile/change-password" title="Change Password">
                                    <button className="w-full py-3 px-6 bg-white border border-indigo-200 rounded-2xl text-indigo-600 font-bold text-sm shadow-sm hover:shadow-md transition-all mb-3">
                                        Change Password
                                    </button>
                                </Link>
                                <Link href="/dashboard/profile/edit" title="Edit Profile">
                                    <button className="w-full py-3 px-6 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                                        Edit Full Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionContainer({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function InfoItem({ icon, label, value, isEmail }: { icon: React.ReactNode, label: string, value: string, isEmail?: boolean }) {
    return (
        <div className="flex flex-col gap-2 group">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em]">
                <span className="group-hover:text-indigo-500 transition-colors">
                    {icon}
                </span>
                {label}
            </div>
            <div className={`text-lg font-bold text-gray-800 ${isEmail ? 'truncate' : ''}`}>
                {value}
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
            <div className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-bold text-gray-900 leading-tight">{value}</p>
            </div>
        </div>
    );
}
