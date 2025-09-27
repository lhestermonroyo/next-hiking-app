'use client';

import React, { useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Upload, UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadableAvatar({
  initialUrl,
  onChange
}: {
  initialUrl?: string | undefined;
  onChange: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialUrl);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('File size exceeds 3MB limit.');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    onChange(file);
    setAvatarUrl(fileUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Avatar className="h-30 w-30 overflow-hidden">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt="avatar"
              className="object-cover object-top h-full w-full"
            />
          ) : (
            <AvatarFallback>
              <UserIcon className="size-16" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <Input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <Button
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
        variant="secondary"
      >
        <Upload /> {avatarUrl ? 'Change' : 'Upload'} Avatar
      </Button>
    </div>
  );
}
