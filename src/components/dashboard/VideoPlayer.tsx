"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, FastForward, Rewind, Settings, ChevronUp } from "lucide-react";

interface VideoPlayerProps {
    videoUrl: string;
    title: string;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [availableRates, setAvailableRates] = useState<number[]>([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]);

    // Stable ref for the player instance to avoid closure issues
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const iframeId = `yt-player-${generatedId.replace(/:/g, '')}`;

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const youtubeId = getYoutubeId(videoUrl);

    useEffect(() => {
        // Load YouTube API script if not already present
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            if (playerRef.current) return; // Already initialized

            playerRef.current = new window.YT.Player(iframeId, {
                videoId: youtubeId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                },
                events: {
                    onReady: (event: any) => {
                        setIsReady(true);
                        setDuration(event.target.getDuration());
                        if (event.target.getPlaybackRate) {
                            setPlaybackRate(event.target.getPlaybackRate());
                        }
                        if (event.target.getAvailablePlaybackRates) {
                            setAvailableRates(event.target.getAvailablePlaybackRates());
                        }
                    },
                    onStateChange: (event: any) => {
                        // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
                        if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
                        else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) setIsPlaying(false);

                        // Keep playback rate in sync
                        if (event.target.getPlaybackRate) {
                            setPlaybackRate(event.target.getPlaybackRate());
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            // Wait for API to be ready
            const prevHandler = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevHandler) prevHandler();
                initPlayer();
            };
        }

        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime && typeof playerRef.current.getCurrentTime === 'function') {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 100);

        return () => {
            clearInterval(interval);
            // We keep the player instance across re-renders for stability
        };
    }, [youtubeId, iframeId]);

    const togglePlay = () => {
        if (!playerRef.current || !isReady) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!playerRef.current || !isReady) return;
        const time = parseFloat(e.target.value);
        playerRef.current.seekTo(time, true);
        setCurrentTime(time);
    };

    const toggleMute = () => {
        if (!playerRef.current || !isReady) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!playerRef.current || !isReady) return;
        const vol = parseInt(e.target.value);
        playerRef.current.setVolume(vol);
        setVolume(vol);
        if (vol === 0) setIsMuted(true);
        else if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        }
    };

    const handleSpeedChange = (rate: number) => {
        if (!playerRef.current || !isReady || !playerRef.current.setPlaybackRate) return;
        try {
            playerRef.current.setPlaybackRate(rate);
            // Verify speed change
            setTimeout(() => {
                if (playerRef.current && playerRef.current.getPlaybackRate) {
                    setPlaybackRate(playerRef.current.getPlaybackRate());
                }
            }, 50);
        } catch (error) {
            console.error("Failed to set playback rate:", error);
        }
        setShowSpeedMenu(false);
    };

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
    }, []);

    return (
        <div
            className="flex flex-col gap-6"
            onContextMenu={handleContextMenu}
        >
            <div
                ref={containerRef}
                className="relative w-full aspect-video rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-black shadow-2xl group border border-white/10 select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setShowSpeedMenu(false); }}
            >
                {/* The Video Shell */}
                <div id={iframeId} className="absolute inset-0 w-full h-full pointer-events-none scale-105" />

                {/* Interaction layer */}
                <div className="absolute inset-0 z-1 cursor-pointer" onClick={togglePlay} />

                {/* Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 transition-opacity duration-500 z-2 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>

                    {/* Top Header */}
                    <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-white font-black text-sm md:text-base uppercase tracking-widest truncate max-w-xs md:max-w-md">{title}</h2>
                                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-tight">Antigravity Premium Stream</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Action (Play only when paused) */}
                    {!isPlaying && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 z-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                className="w-24 h-24 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl transform transition-all hover:scale-110 active:scale-95 group/play"
                            >
                                <Play size={36} fill="currentColor" className="ml-2 transform group-hover/play:scale-110 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Bottom Console */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-6">
                        {/* Timeline */}
                        <div className="relative group/timeline h-8 flex items-center cursor-pointer">
                            <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-75 relative"
                                        style={{ width: `${(currentTime / duration) * 100}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl shadow-black/20 opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-full opacity-0 cursor-pointer accent-indigo-500 z-1"
                            />
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 md:gap-10">
                                {/* Play/Pause */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    className="text-white hover:text-indigo-400 transition-all transform hover:scale-110 active:scale-90"
                                >
                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                </button>

                                {/* Volume */}
                                <div className="flex items-center gap-2 md:gap-4 group/volume relative">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                        className="text-white hover:text-red-500 transition-all transform hover:scale-110"
                                    >
                                        {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                    </button>
                                    <div className="w-0 group-hover/volume:w-20 md:group-hover/volume:w-28 transition-all duration-500 flex items-center h-8 overflow-hidden bg-white/5 rounded-full px-0 group-hover/volume:px-3 border border-transparent group-hover/volume:border-white/10 backdrop-blur-sm">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-20 md:w-24 h-1 rounded-full appearance-none cursor-pointer accent-red-600"
                                            style={{
                                                background: `linear-gradient(to right, #ef4444 ${(volume)}%, rgba(255, 255, 255, 0.1) ${(volume)}%)`
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Timer */}
                                <div className="flex items-center gap-2 text-[11px] font-black text-white/90 uppercase tracking-widest hidden sm:flex">
                                    <span className="text-white">{formatTime(currentTime)}</span>
                                    <span className="text-white/30">/</span>
                                    <span className="text-white/50">{formatTime(duration)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 md:gap-10">
                                {/* Speed Control */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <Settings size={14} className={showSpeedMenu ? 'animate-spin' : ''} />
                                        {playbackRate}x
                                    </button>

                                    {showSpeedMenu && (
                                        <div className="absolute bottom-full right-0 mb-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-[120px] animate-in fade-in slide-in-from-bottom-2 z-10">
                                            <div className="p-2 border-b border-white/5 bg-white/5">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Speed</span>
                                            </div>
                                            {availableRates.map((rate) => (
                                                <button
                                                    key={rate}
                                                    onClick={(e) => { e.stopPropagation(); handleSpeedChange(rate); }}
                                                    className={`w-full text-left px-4 py-3 text-[10px] font-black transition-all hover:bg-indigo-600 ${playbackRate === rate ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/70'}`}
                                                >
                                                    {rate}x {rate === 1 && <span className="text-[8px] opacity-50 ml-1">(Normal)</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Full Screen */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
                                    className="text-white hover:text-indigo-400 transition-all transform hover:scale-110 active:scale-95"
                                >
                                    <Maximize size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                input[type='range'] {
                    appearance: none;
                    background: transparent;
                    outline: none;
                }
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 0;
                    height: 0;
                }
                .group\\/volume input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #ef4444;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
                    border: 2px solid white;
                }
                /* Firefox support */
                input[type='range']::-moz-range-thumb {
                    width: 0;
                    height: 0;
                    border: none;
                }
                .group\\/volume input[type='range']::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: #ef4444;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
                }
            `}</style>
        </div>
    );
}
