
import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  className?: string;
}

export function TagInput({
  placeholder = "Add item...",
  tags,
  setTags,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleRemoveTag = (index: number) => {
    setTags([...tags.slice(0, index), ...tags.slice(index + 1)]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  };

  const handleAddTag = () => {
    const trimmedInput = inputValue.trim();
    
    // Basic email validation
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput);
    
    if (trimmedInput && isEmail && !tags.includes(trimmedInput)) {
      setTags([...tags, trimmedInput]);
      setInputValue('');
    } else if (trimmedInput && !isEmail) {
      // Could add toast notification here
      console.error('Invalid email format');
    }
  };
  
  const containerClasses = cn(
    "flex flex-wrap items-center gap-2 p-2 border border-input rounded-md focus-within:ring-1 focus-within:ring-ring",
    className
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={containerClasses} onClick={focusInput}>
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tag}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveTag(index);
            }}
          />
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="email"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleAddTag}
        className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8"
        placeholder={tags.length === 0 ? placeholder : ""}
      />
    </div>
  );
}
