"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    if (!isMounted) {
        return null; // Server-side rendering hydration fix
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-sm transition-colors"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={onUpload} // Changed from onUpload to onSuccess for newer v6 compatibility or use options
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "lms_unsigned"} // Fallback or env
                options={{
                    maxFiles: 1
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onClick}
                            className="w-full group relative flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 active:scale-95 disabled:opacity-50"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300">
                                <ImagePlus className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-slate-900 mb-1">Upload Payment Slip</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG or PDF (Max 10MB)</p>
                            </div>

                            {/* Decorative background pulse */}
                            <div className="absolute inset-0 rounded-[2rem] bg-indigo-50 opacity-0 group-hover:opacity-10 scale-95 group-hover:scale-100 transition-all duration-500" />
                        </button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;
