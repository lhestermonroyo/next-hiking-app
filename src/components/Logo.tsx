import { Mountain } from 'lucide-react';
import React, { Fragment } from 'react';

export default function Logo() {
  return (
    <p className="flex items-center gap-2 font-medium">
      <span className="bg-blue-500 text-accent-foreground flex size-8 items-center justify-center rounded-md">
        <Mountain className="size-4" />
      </span>
      Hiking App
    </p>
  );
}
