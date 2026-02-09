import { getLessonWithVideos } from "@/actions/lesson";
import { ArrowLeft, Play, Info, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/dashboard/VideoPlayer";

export default async function VideoPlayerPage(props: {
    params: Promise<{ id: string; videoId: string }>
}) {
    const params = await props.params;
    const lesson = await getLessonWithVideos(params.id);

    if (!lesson) {
        notFound();
    }

    const video = lesson.videos.find((v: any) => v.videoItemID === params.videoId);

    if (!video) {
        notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link
                    href={`/dashboard/my-class/${params.id}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition-colors group"
                >
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Video List
                </Link>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Play size={12} fill="currentColor" />
                        Currently Playing
                    </div>
                </div>
            </div>

            {/* Video Player Section */}
            <VideoPlayer videoUrl={video.videoUrl} title={video.name} />

            {/* Video Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-600 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Module Details</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black font-heading text-gray-900 leading-tight mb-6">
                            {video.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-50 mb-8">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar size={16} />
                                <span className="text-xs font-bold">{new Date(video.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            {video.duration && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={16} />
                                    <span className="text-xs font-bold">{video.duration}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-400">
                                <Info size={16} />
                                <span className="text-xs font-bold">{lesson.name}</span>
                            </div>
                        </div>

                        <div className="prose prose-indigo max-w-none">
                            <h3 className="text-lg font-black font-heading text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {video.shortDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Could be Next Videos or Progress) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
                        <h3 className="text-xl font-black font-heading mb-4">Learning Note</h3>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                            Take notes while watching the video. Focus on the core concepts and practice the exercises.
                        </p>
                        <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-black uppercase tracking-widest transition-all">
                            Downloaded Materials
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-lg font-black font-heading text-gray-900 mb-6">In this Package</h3>
                        <div className="space-y-4">
                            {lesson.videos.slice(0, 5).map((v: any, idx: number) => (
                                <Link
                                    key={v.id}
                                    href={`/dashboard/my-class/${params.id}/${v.videoItemID}`}
                                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${v.videoItemID === params.videoId ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${v.videoItemID === params.videoId ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <Play size={14} fill={v.videoItemID === params.videoId ? "currentColor" : "none"} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-black truncate ${v.videoItemID === params.videoId ? 'text-indigo-600' : 'text-gray-900'}`}>
                                            {v.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold">{v.duration || "Video"}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
