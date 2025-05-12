import React from 'react';
import { CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface WelcomeCarouselItemProps {
  imgSrc: string;
  title: string;
  description: string;
  maxHeight?: string
}

const WelcomeCarouselItem: React.FC<WelcomeCarouselItemProps> = ({ imgSrc, title, description, maxHeight = '230.08px' }) => {
  return (
    <CarouselItem>
      <div className="p-1 w-full space-y-16 flex-grow">
        <img
          src={imgSrc}
          className={cn('mx-auto')}
          style={{ maxHeight }}
          alt={title}
        />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center">
            {title}
          </h1>
          <p className="text-center text-secondary-foreground">
            {description}
          </p>
        </div>
      </div>
    </CarouselItem>
  );
};

export default WelcomeCarouselItem;