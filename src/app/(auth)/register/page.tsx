"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Fingerprint, Lock, ArrowRight, ArrowLeft,
    Loader2, Sparkles, User, Mail, GraduationCap,
    Building2, Phone, MapPin, CheckCircle2,
    BookOpen, Calendar
} from "lucide-react";
import Link from "next/link";
import { registerStudent, getSession } from "@/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/ToastProvider";

import { getExamYears } from "@/actions/examYear";

const DISTRICTS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
    'Mannar', 'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export default function RegisterPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [examYears, setExamYears] = useState<any[]>([]); // exam years state
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "",
        institute: "", stream: "", examYear: "",
        nic: "", phoneNumber: "", whatsappNumber: "", school: "",
        district: "", address: ""
    });

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (session) {
                router.push("/dashboard");
            }
        };
        const fetchYears = async () => {
            const years = await getExamYears(true);
            setExamYears(years);
            if (years.length > 0) {
                setFormData(prev => ({ ...prev, examYear: years[0].year }));
            }
        };

        checkSession();
        fetchYears();
    }, [router]);

    // ... existing next/prev logic ...
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            nextStep();
            return;
        }
        setIsLoading(true);

        try {
            const result = await registerStudent(formData);

            if (result.success) {
                showToast("Account created successfully!", "success");
                window.location.href = "/dashboard";
            } else {
                setIsLoading(false);
                showToast(result.error || "Registration failed.", "error");
            }
        } catch (error) {
            setIsLoading(false);
            showToast("Connection error occurred.", "error");
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* ... Background and Sidebar ... */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-50/50 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[800px] relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl p-8 lg:p-12 flex flex-col md:flex-row gap-12 overflow-hidden min-h-[600px]">

                    {/* Sidebar Info (Left) */}
                    <div className="md:w-1/3 flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl mb-8">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold font-heading text-gray-900 tracking-tight mb-4">Join Us</h2>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                                Start your professional academic journey with our modern LMS platform.
                            </p>
                        </div>
                        {/* Progress Indicator */}
                        <div className="space-y-6">
                            <ProgressStep active={step >= 1} current={step === 1} num={1} label="Account Info" />
                            <ProgressStep active={step >= 2} current={step === 2} num={2} label="Academic" />
                            <ProgressStep active={step >= 3} current={step === 3} num={3} label="Personal" />
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Steps to Success</p>
                        </div>
                    </div>

                    {/* Form Section (Right) */}
                    <div className="md:w-2/3 flex flex-col">
                        <form onSubmit={handleRegister} className="flex-1 flex flex-col">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Create Account</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField icon={<User />} label="First Name" value={formData.firstName} onChange={(v) => updateField('firstName', v)} placeholder="John" />
                                            <InputField icon={<User />} label="Last Name" value={formData.lastName} onChange={(v) => updateField('lastName', v)} placeholder="Doe" />
                                        </div>
                                        <InputField icon={<Mail />} label="Email Address" type="email" value={formData.email} onChange={(v) => updateField('email', v)} placeholder="john@example.com" />
                                        <InputField icon={<Lock />} label="Create Password" type="password" value={formData.password} onChange={(v) => updateField('password', v)} placeholder="••••••••" />
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Record</h3>
                                        {/* Auto-generated Index Number - Field Removed */}
                                        <InputField icon={<Building2 />} label="Institute Name" value={formData.institute} onChange={(v) => updateField('institute', v)} placeholder="Horizon Tech" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField icon={<BookOpen />} label="Stream" value={formData.stream} onChange={(v) => updateField('stream', v)} placeholder="Physical Sci" />
                                            {/* Exam Year Select */}
                                            <div className="space-y-1.5 flex-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Exam Year</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-600 transition-colors">
                                                        <Calendar />
                                                    </div>
                                                    <select
                                                        value={formData.examYear}
                                                        onChange={(e) => updateField('examYear', e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-sm appearance-none"
                                                    >
                                                        {examYears.length === 0 && <option value="" disabled>Loading...</option>}
                                                        {examYears.map(year => (
                                                            <option key={year.id} value={year.year}>{year.year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Final Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField icon={<CheckCircle2 />} label="NIC" value={formData.nic} onChange={(v) => updateField('nic', v)} placeholder="2000XXXXXX" />
                                            <InputField icon={<Phone />} label="Phone" value={formData.phoneNumber} onChange={(v) => updateField('phoneNumber', v)} placeholder="+94 XX" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField icon={<GraduationCap />} label="School" value={formData.school} onChange={(v) => updateField('school', v)} placeholder="Royal College" />

                                            {/* District Dropdown */}
                                            <div className="space-y-1.5 flex-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">District</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-600 transition-colors">
                                                        <MapPin />
                                                    </div>
                                                    <select
                                                        value={formData.district}
                                                        onChange={(e) => updateField('district', e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-sm appearance-none"
                                                    >
                                                        <option value="" disabled>Select District</option>
                                                        {DISTRICTS.map(district => (
                                                            <option key={district} value={district}>{district}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <InputField icon={<MapPin />} label="Mailing Address" value={formData.address} onChange={(v) => updateField('address', v)} placeholder="123 Main St..." />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="mt-auto pt-10 flex items-center justify-between">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                ) : (
                                    <Link href="/login" className="text-sm font-bold text-indigo-600 hover:underline">
                                        Already have an account?
                                    </Link>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-gray-800 transition-all flex items-center gap-3 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            {step === 3 ? "Complete Registration" : "Next Step"}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ProgressStep({ active, current, num, label }: { active: boolean, current: boolean, num: number, label: string }) {
    return (
        <div className={`flex items-center gap-4 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${current ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : active ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                {active && !current && num < 3 ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
            <span className={`text-sm font-bold ${current ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}

function InputField({ icon, label, value, onChange, placeholder, type = "text" }: { icon: React.ReactNode, label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
    return (
        <div className="space-y-1.5 flex-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-600 transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-sm"
                />
            </div>
        </div>
    );
}
