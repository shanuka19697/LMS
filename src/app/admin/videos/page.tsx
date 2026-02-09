import { getAdminVideos } from "@/actions/video";
import VideoManagement from "@/components/admin/videos/VideoManagement";

export default async function VideosPage() {
    const videos = await getAdminVideos();

    return (
        <VideoManagement initialVideos={videos} />
    );
}
