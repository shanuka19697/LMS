"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    CheckCircle2,
    Truck,
    UploadCloud,
    ShieldCheck,
    Info,
    CreditCard,
    ChevronRight,
    AlertCircle,
    Video,
    Eye,
    X
} from "lucide-react";
import { purchaseLessonPack } from "@/actions/lesson";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoCard from "@/components/dashboard/VideoCard";
import ImageUpload from "@/components/ui/ImageUpload";

interface LessonDetailClientProps {
    lesson: any;
}

export default function LessonDetailClient({ lesson }: LessonDetailClientProps) {
    const [tuteDelivery, setTuteDelivery] = useState(false);
    const [slipUrl, setSlipUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSlipModal, setShowSlipModal] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    // Robust URL validation for Next.js Image component
    const getSafeImageUrl = (url: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return "/placeholder-lesson.jpg";
        try {
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
            }
            return "/placeholder-lesson.jpg";
        } catch (e) {
            return "/placeholder-lesson.jpg";
        }
    };

    const safeImageUrl = getSafeImageUrl(lesson.imageUrl);

    const tutePrice = 300;
    const totalPrice = lesson.price + (tuteDelivery ? tutePrice : 0);

    // Get existing purchase status
    const existingPurchase = lesson.purchases?.[0];
    const isEnrolled = existingPurchase?.status === "APPROVED";
    const isPending = existingPurchase?.status === "PENDING";
    const hasRejected = existingPurchase?.status === "REJECTED";

    const handlePurchase = async () => {
        if (!slipUrl) {
            showToast("Please upload your payment slip to proceed.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            await purchaseLessonPack({
                lessonId: lesson.id,
                tuteDelivery,
                totalPrice,
                slipUrl
            });
            showToast("Your payment slip is being verified by the admin.", "success");
            router.push("/dashboard/lesson-store");
        } catch (error) {
            showToast("Something went wrong. Please try again later.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Left Column: Lesson Info */}
            <div className="xl:col-span-2 space-y-12">
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    <div className="relative aspect-[16/9]">
                        <Image
                            src={safeImageUrl}
                            alt={lesson.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                                    {lesson.lessonPackID}
                                </span>
                                <span className="bg-amber-500/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                                    {lesson.type?.replace('_', ' ')}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black font-heading text-white">{lesson.name}</h2>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        <div>
                            <h3 className="text-xl font-black font-heading text-gray-900 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-indigo-500" />
                                Lesson Description
                            </h3>
                            <div className="prose prose-indigo max-w-none text-gray-600 font-medium leading-relaxed">
                                {lesson.longDescription}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Unlimited Video Access",
                                "Downloadable PDF Tutes",
                                "Monthly Paper Discussions",
                                "Direct Mentorship Access"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-sm font-bold text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Slip Upload & Instruction */}
                <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-indigo-300" />
                            </div>
                            <h3 className="text-2xl font-black font-heading">Payment Instructions</h3>
                        </div>
                        <p className="text-indigo-100/80 font-medium max-w-xl">
                            Please deposit the total amount to the bank account below and upload a clear photo of the bank slip or transfer receipt for manual verification.
                        </p>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
                            <p className="text-xs uppercase tracking-widest font-black text-indigo-300">Bank Details</p>
                            <p className="text-lg font-bold">Bank of Ceylon - Kandy Branch</p>
                            <p className="text-2xl font-black tracking-tight">Acc: 7452 819 001</p>
                            <p className="text-sm font-medium text-indigo-200">Name: LMS Academy (PVT) LTD</p>
                        </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 group-hover:scale-150 transition-transform duration-1000" />
                </div>

                {/* Video Gallery Section */}
                {lesson.videos && lesson.videos.length > 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black font-heading text-gray-900 flex items-center gap-3">
                                <Video className="w-6 h-6 text-rose-500" />
                                Lesson <span className="text-rose-600">Video Gallery</span>
                            </h3>
                            <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                {lesson.videos.length} Videos Available
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lesson.videos.map((video: any, idx: number) => (
                                <VideoCard key={video.id || idx} video={video} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Checkout Sidebar */}
            <div className="space-y-8">
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-10 sticky top-24">
                    <h3 className="text-xl font-black font-heading text-gray-900 mb-8 pb-4 border-b border-gray-100">Checkout</h3>

                    <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Lesson Price</span>
                            <span className="text-gray-900">Rs: {lesson.price?.toLocaleString()}</span>
                        </div>

                        {/* Tute Delivery Toggle (Only show if not already enrolled/pending) */}
                        {!isEnrolled && !isPending && (
                            <button
                                onClick={() => setTuteDelivery(!tuteDelivery)}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${tuteDelivery
                                    ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-500/20'
                                    : 'bg-gray-50 border-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-colors ${tuteDelivery ? 'bg-amber-500 text-white' : 'bg-white text-gray-400'}`}>
                                        <Truck size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-black ${tuteDelivery ? 'text-amber-900' : 'text-gray-700'}`}>Tute Delivery</p>
                                        <p className="text-[10px] font-bold text-gray-400">Hard copy delivery</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-black ${tuteDelivery ? 'text-amber-600' : 'text-gray-400'}`}>+ Rs: 300</span>
                            </button>
                        )}

                        <div className="h-px w-full bg-gray-100" />

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-black uppercase tracking-widest text-gray-400">Total Price</span>
                            <span className="text-4xl font-black font-heading text-indigo-600 tracking-tighter">
                                Rs: {(isEnrolled || isPending) ? existingPurchase.totalPrice.toLocaleString() : totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Conditional Action Section */}
                    {isEnrolled ? (
                        <div className="space-y-4">
                            <div className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-emerald-200 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Enrolled Successfully
                            </div>
                            <Link
                                href="/dashboard/my-class"
                                className="w-full py-5 bg-white border border-gray-100 hover:border-indigo-600 hover:text-indigo-600 text-gray-900 rounded-[2.5rem] font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                            >
                                Enter Classroom
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : isPending ? (
                        <div className="space-y-4">
                            <div className="w-full py-6 bg-amber-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-amber-200 flex items-center justify-center gap-2">
                                <AlertCircle className="w-5 h-5 animate-pulse" />
                                Pending Verification
                            </div>
                            <p className="text-[10px] text-amber-600 font-bold text-center uppercase tracking-widest px-4 leading-relaxed">
                                Our admins are currently verifying your payment slip. Please check back later.
                            </p>

                            {existingPurchase?.slipUrl && (
                                <button
                                    onClick={() => setShowSlipModal(true)}
                                    className="w-full py-5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 rounded-[2.5rem] font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Eye size={16} />
                                    View Submitted Slip
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Rejection Alert */}
                            {hasRejected && existingPurchase?.rejectionReason && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 bg-rose-50 rounded-[2rem] border-2 border-rose-100 flex gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-rose-600">Rejection Reason</h4>
                                        <p className="text-sm font-bold text-rose-900 leading-relaxed">
                                            {existingPurchase.rejectionReason}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Slip Upload Field */}
                            <div className="space-y-4 mb-10">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <UploadCloud size={14} />
                                    Payment Slip (Upload Image)
                                </label>

                                <ImageUpload
                                    value={slipUrl ? [slipUrl] : []}
                                    onChange={(url) => setSlipUrl(url)}
                                    onRemove={() => setSlipUrl("")}
                                    disabled={isSubmitting}
                                />

                                {hasRejected && (
                                    <p className="text-[10px] text-rose-500 font-bold leading-relaxed px-2">
                                        * Your previous slip was rejected. Please re-upload with correct details.
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handlePurchase}
                                disabled={isSubmitting}
                                className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        Confirm & Enroll
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    <p className="text-center mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Your data is secured with AES-256 encryption
                    </p>
                </div>
            </div>

            {/* Student Slip Preview Modal */}
            <AnimatePresence>
                {showSlipModal && existingPurchase?.slipUrl && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSlipModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-2xl max-h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    <Eye className="text-amber-500" size={20} />
                                    My Submitted Slip
                                </h3>
                                <button
                                    onClick={() => setShowSlipModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="p-4 md:p-8 overflow-auto max-h-[70vh] flex items-center justify-center bg-gray-50">
                                <div className="relative w-full aspect-auto min-h-[300px]">
                                    <Image
                                        src={existingPurchase.slipUrl}
                                        alt="My Payment Slip"
                                        width={800}
                                        height={1100}
                                        className="rounded-xl object-contain shadow-lg"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
                                <button
                                    onClick={() => setShowSlipModal(false)}
                                    className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-lg"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
