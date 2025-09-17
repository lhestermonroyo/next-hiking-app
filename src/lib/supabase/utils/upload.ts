'use server';
import { createClientForServer } from '@/lib/supabase/server';

type Bucket = 'profiles' | 'groups' | 'events' | 'mountains';

export async function uploadFile(file: File, path: string, bucket: Bucket) {
  const supabase = await createClientForServer();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type
  });

  if (error) {
    return { error: true, message: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { error: false, message: 'File uploaded successfully', data };
}
