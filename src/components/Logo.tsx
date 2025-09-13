import { Mountain } from 'lucide-react';
import React, { Fragment } from 'react';

export default function Logo() {
  return (
    <p className="flex items-center gap-2 font-medium">
      <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <Mountain className="size-4" />
      </span>
      Hiking App
    </p>
  );
}
