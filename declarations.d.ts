declare module 'expo-video-thumbnails';
declare module 'expo-av';

declare module '*.png' {
  const value: number;
  export default value;
}

declare module '*.mov' {
  const value: number;
  export default value;
}

// Interface pour les stories
interface Story {
  id: string;
  user_id: string;
  image_url?: string;
  video_url?: string;
  media_type?: 'image' | 'video';
  is_video?: boolean;
  created_at: string;
  is_complete_story?: boolean;
  metadata?: any;
  profiles?: {
    id: string;
    username: string;
    photo?: string;
  } | null;
  // Nouvelles propriétés pour les vues
  views_count?: number;
  viewers?: StoryViewer[];
  is_viewed_by_current_user?: boolean;
}

interface StoryViewer {
  viewer_id: string;
  username: string;
  photo?: string;
  viewed_at: string;
  view_duration_ms?: number;
  is_complete_view: boolean;
}

// Déclarations TypeScript pour les modules externes
