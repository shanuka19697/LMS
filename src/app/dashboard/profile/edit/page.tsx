"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User, Mail, Phone, MapPin, Building2,
    GraduationCap, Fingerprint, School,
    ArrowLeft, Save, Loader2, Sparkles,
    MessageCircle, Globe, CreditCard
} from "lucide-react";
import Link from "next/link";
import { getStudentProfile, updateStudentProfile } from "@/actions/student";
import { getSession } from "@/actions/auth";
import { getExamYears } from "@/actions/examYear";
import { useToast } from "@/components/ui/ToastProvider";

const DISTRICTS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
    'Mannar', 'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export default function EditProfilePage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [studentIndex, setStudentIndex] = useState("");
    const [examYears, setExamYears] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "",
        indexNumber: "", institute: "", stream: "", examYear: "",
        nic: "", phoneNumber: "", whatsappNumber: "", school: "",
        district: "", address: ""
    });

    useEffect(() => {
        const loadData = async () => {
            const index = await getSession();
            if (!index) {
                router.push("/login");
                return;
            }
            setStudentIndex(index);

            // Parallel fetching
            const [profile, years] = await Promise.all([
                getStudentProfile(index),
                getExamYears(true)
            ]);

            setExamYears(years);

            if (profile) {
                setFormData({
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    email: profile.email || "",
                    indexNumber: profile.indexNumber || "",
                    institute: profile.institute || "",
                    stream: profile.stream || "",
                    examYear: profile.examYear || (years.length > 0 ? years[0].year : ""),
                    nic: profile.nic || "",
                    phoneNumber: profile.phoneNumber || "",
                    whatsappNumber: profile.whatsappNumber || "",
                    school: profile.school || "",
                    district: profile.district || "",
                    address: profile.address || "",
                });
            }
            setIsLoading(false);
        };
        loadData();
    }, [router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation check
        if (!formData.firstName || !formData.lastName || !formData.email) {
            showToast("Required fields are missing!", "error");
            return;
        }

        setIsSaving(true);
        try {
            const result = await updateStudentProfile(studentIndex, formData);
            if (result.success) {
                showToast("Save successful! Profile updated.", "success");
                router.refresh();
                router.push("/dashboard/profile");
            } else {
                showToast(result.error || "Failed to save changes.", "error");
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Form Submission Error:", error);
            showToast("A connection error occurred. Please try again.", "error");
            setIsSaving(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-medium font-heading animate-pulse">Fetching your details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/profile"
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900">Edit Profile</h1>
                        <p className="text-gray-500 text-sm">Update your personal and academic information</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
                {/* Section 1: Personal Info */}
                <Section icon={<User />} title="Personal Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input icon={<User />} label="First Name" value={formData.firstName} onChange={(v: string) => updateField("firstName", v)} />
                        <Input icon={<User />} label="Last Name" value={formData.lastName} onChange={(v: string) => updateField("lastName", v)} />
                        <Input icon={<Mail />} label="Email Address" value={formData.email} onChange={(v: string) => updateField("email", v)} type="email" />
                        <Input icon={<CreditCard />} label="NIC Number" value={formData.nic} onChange={(v: string) => updateField("nic", v)} />
                    </div>
                </Section>

                {/* Section 2: Academic Info */}
                <Section icon={<GraduationCap />} title="Academic Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input icon={<Fingerprint />} label="Index Number" value={formData.indexNumber} disabled />
                        <Input icon={<Building2 />} label="Institute" value={formData.institute} onChange={(v: string) => updateField("institute", v)} />
                        <Input icon={<Globe />} label="Stream" value={formData.stream} onChange={(v: string) => updateField("stream", v)} />

                        {/* Exam Year Dropdown */}
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                Exam Year
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                    <Sparkles size={20} />
                                </div>
                                <select
                                    value={formData.examYear}
                                    onChange={(e) => updateField("examYear", e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all text-gray-700 font-medium appearance-none"
                                >
                                    {examYears.length === 0 && <option value="" disabled>Loading...</option>}
                                    {examYears.map(year => (
                                        <option key={year.id} value={year.year}>{year.year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </Section>

                {/* Section 3: Contact Info */}
                <Section icon={<Phone />} title="Contact & Address">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input icon={<Phone />} label="Phone Number" value={formData.phoneNumber} onChange={(v: string) => updateField("phoneNumber", v)} />
                        <Input icon={<MessageCircle />} label="WhatsApp Number" value={formData.whatsappNumber} onChange={(v: string) => updateField("whatsappNumber", v)} />
                        <Input icon={<School />} label="School" value={formData.school} onChange={(v: string) => updateField("school", v)} />

                        {/* District Dropdown */}
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                District
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                    <MapPin size={20} />
                                </div>
                                <select
                                    value={formData.district}
                                    onChange={(e) => updateField("district", e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all text-gray-700 font-medium appearance-none"
                                >
                                    <option value="" disabled>Select District</option>
                                    {DISTRICTS.map((dist) => (
                                        <option key={dist} value={dist}>{dist}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <Input icon={<MapPin />} label="Full Address" value={formData.address} onChange={(v: string) => updateField("address", v)} isTextArea />
                        </div>
                    </div>
                </Section>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link
                        href="/dashboard/profile"
                        className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/20"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
                    {icon}
                </div>
                <h2 className="text-xl font-bold font-heading text-gray-800">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}

interface InputProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange?: (val: string) => void;
    type?: string;
    disabled?: boolean;
    isTextArea?: boolean;
}

function Input({ icon, label, value, onChange, type = "text", disabled = false, isTextArea = false }: InputProps) {
    return (
        <div className="space-y-2 group">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                {label}
            </label>
            <div className={`relative flex items-center transition-all ${disabled ? 'opacity-60' : ''}`}>
                <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    {icon}
                </div>
                {isTextArea ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all resize-none min-h-[100px] text-gray-700 font-medium"
                        placeholder={`Enter ${label}...`}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all text-gray-700 font-medium"
                        placeholder={`Enter ${label}...`}
                    />
                )}
            </div>
        </div>
    );
}
