'use server';
import { createClientForServer } from '@/lib/supabase/server';

export const saveAvatarToStorage = async (file: File, path: string) => {
  const supabase = await createClientForServer();
  const { error } = await supabase.storage
    .from('hiking_app')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (error) {
    return { error: true, message: error.message };
  }

  const { data } = supabase.storage.from('hiking_app').getPublicUrl(path);
  return { error: false, message: 'Avatar uploaded successfully', data };
};
