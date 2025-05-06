"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Heading } from "./heading";
import { NcPlayIcon2, PlayIcon } from "../play-icon";

export interface VideoType {
  id: string;
  title: string;
  thumbnail: string;
}

export interface SectionVideosProps {
  videos?: VideoType[];
  className?: string;
}

const VIDEOS_DEMO: VideoType[] = [
  {
    id: "p4U5ArTFMEY",
    title: "Magical Scotland - 4K Scenic Relaxation Film with Calming Music",
    thumbnail:
      "https://images.pexels.com/photos/131423/pexels-photo-131423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "y7gKlzvg8xk",
    title: "Magical Scotland - 4K Scenic Relaxation Film with Calming Music",
    thumbnail:
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "fKXaypnVL8s",
    title: "Magical Scotland - 4K Scenic Relaxation Film with Calming Music",
    thumbnail:
      "https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "unPKJJjQP0A",
    title: "Magical Scotland - 4K Scenic Relaxation Film with Calming Music",
    thumbnail:
      "https://images.pexels.com/photos/4983184/pexels-photo-4983184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "vazwd0HOohE",
    title: "Magical Scotland - 4K Scenic Relaxation Film with Calming Music",
    thumbnail:
      "https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
];

export function ExperiencesSection({
  videos = VIDEOS_DEMO,
  className,
}: SectionVideosProps) {
  const [isPlay, setIsPlay] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  const renderMainVideo = () => {
    const video: VideoType | undefined = videos[currentVideo];

    if (!video) {
      return null;
    }

    return (
      <div
        className="sm:aspect-16/9 group aspect-[12/9] overflow-hidden rounded-3xl border-4 border-white bg-neutral-800 will-change-transform dark:border-neutral-900 sm:rounded-[50px] sm:border-[10px]"
        title={video.title}
      >
        {isPlay ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <div
              onClick={() => setIsPlay(true)}
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            >
              <PlayIcon />
            </div>

            <Image
              fill
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={video.thumbnail}
              title={video.title}
              alt={video.title}
              sizes="(max-width: 1000px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </>
        )}
      </div>
    );
  };

  const renderSubVideo = (video: VideoType, index: number) => {
    if (index === currentVideo) return null;
    return (
      <div
        className="sm:aspect-h-12 lg:aspect-h-9 group relative aspect-[12/9] cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl"
        onClick={() => {
          setCurrentVideo(index);
          if (!isPlay) {
            setIsPlay(true);
          }
        }}
        title={video.title}
        key={String(index)}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <NcPlayIcon2 />
        </div>
        <Image
          fill
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          src={video.thumbnail}
          title={video.title}
          alt={video.title}
          sizes="(max-width: 300px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
    );
  };

  return (
    <div className={`nc-SectionVideos ${className}`}>
      <Heading desc="Check out our hottest videos. View more and share more new perspectives on just about any topic. Everyone’s welcome.">
        🎬 The Videos
      </Heading>

      <div className="relative grid grid-cols-1 md:grid-cols-5">
        <div className="absolute -bottom-4 -top-4 z-0 w-full rounded-3xl bg-opacity-40 dark:bg-neutral-800 dark:bg-opacity-40 sm:rounded-[50px] md:bottom-0 md:end-0 md:top-0 md:w-2/3 md:bg-green-100 xl:w-1/2"></div>
        <div className="relative col-span-4 h-full flex-grow pb-2">
          {renderMainVideo()}
        </div>
        <div className="grid w-full flex-shrink-0 grid-cols-1 gap-3 p-0 py-2 md:p-5">
          {videos.map(renderSubVideo)}
        </div>
      </div>
    </div>
  );
}
