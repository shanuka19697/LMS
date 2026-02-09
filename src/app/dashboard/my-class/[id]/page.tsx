import { getLessonWithVideos } from "@/actions/lesson";
import VideoItemCard from "@/components/dashboard/VideoItemCard";
import { PlayCircle, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function VideoListPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const lesson = await getLessonWithVideos(params.id);

    if (!lesson) {
        notFound();
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Immersive Hero Section */}
            <div className="relative w-full rounded-[3rem] overflow-hidden bg-gray-900 text-white min-h-[400px] flex flex-col justify-end p-8 md:p-12">
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                    <Image
                        src={lesson.imageUrl || "/images/course_design.png"}
                        alt={lesson.name}
                        fill
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-4xl space-y-6">
                    <Link
                        href="/dashboard/my-class"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors group mb-4"
                    >
                        <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all backdrop-blur-md">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to My Classes
                    </Link>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-lg text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                                A/L {lesson.examYear}
                            </div>
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white/70 text-[10px] font-black uppercase tracking-widest">
                                {lesson.type.replace('_', ' ')}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight text-white shadow-sm">
                            {lesson.name}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                            {lesson.shortDescription}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                <PlayCircle className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Lessons</p>
                                <p className="text-white font-black text-xl">{lesson.videos.length}</p>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                <p className="text-white font-black text-xl">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video List Container */}
            <div className="max-w-5xl mx-auto space-y-8 px-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black font-heading text-gray-900">Your <span className="text-indigo-600">Learning Path</span></h2>
                        <p className="text-gray-500 font-medium mt-1">Watch lectures in sequence for the best result.</p>
                    </div>
                </div>

                <div className="relative space-y-6">
                    {/* Vertical Line for Timeline Effect (Optional - can be added via CSS on parent if needed, but let's stick to clean cards first) */}

                    {lesson.videos.length > 0 ? (
                        lesson.videos.map((video: any, index: number) => (
                            <VideoItemCard
                                key={video.id}
                                video={video}
                                lessonId={lesson.id}
                                index={index}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">No videos available for this lesson yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
