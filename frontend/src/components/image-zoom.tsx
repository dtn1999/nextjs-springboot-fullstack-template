"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Move, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  maxZoom?: number;
  initialZoom?: number;
  zoomStep?: number;
  rotationStep?: number;
  initialRotation?: number;
}

export function ImageZoom(props: ImageZoomProps) {
  const {
    src,
    alt,
    className,
    maxZoom = 4,
    initialZoom = 1,
    zoomStep = 0.5,
    rotationStep = 90,
    initialRotation = 0,
  } = props;

  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // Reset position when zoom changes to 1 or rotation changes
  useEffect(() => {
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom, rotation]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - zoomStep, 1));
  };

  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + rotationStep) % 360);
    // Reset position when rotating to avoid image going out of bounds
    setPosition({ x: 0, y: 0 });
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - rotationStep + 360) % 360);
    // Reset position when rotating to avoid image going out of bounds
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Disable wheel zooming
    e.preventDefault(); // Just prevent scrolling behavior
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      e.preventDefault(); // Prevent text selection during drag
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      const touch = e.touches[0] as Touch;
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Calculate boundaries to prevent dragging outside the image
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;
      const imageWidth = (imageWrapperRef.current?.offsetWidth || 0) * zoom;
      const imageHeight = (imageWrapperRef.current?.offsetHeight || 0) * zoom;

      // Adjust boundaries based on rotation
      const isVertical = rotation % 180 !== 0;
      const effectiveWidth = isVertical ? imageHeight : imageWidth;
      const effectiveHeight = isVertical ? imageWidth : imageHeight;

      const maxX = Math.max(0, (effectiveWidth - containerWidth) / 2);
      const maxY = Math.max(0, (effectiveHeight - containerHeight) / 2);

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      const touch = e.touches[0] as Touch;
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      // Calculate boundaries to prevent dragging outside the image
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;
      const imageWidth = (imageWrapperRef.current?.offsetWidth || 0) * zoom;
      const imageHeight = (imageWrapperRef.current?.offsetHeight || 0) * zoom;

      // Adjust boundaries based on rotation
      const isVertical = rotation % 180 !== 0;
      const effectiveWidth = isVertical ? imageHeight : imageWidth;
      const effectiveHeight = isVertical ? imageWidth : imageHeight;

      const maxX = Math.max(0, (effectiveWidth - containerWidth) / 2);
      const maxY = Math.max(0, (effectiveHeight - containerHeight) / 2);

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });

      // Prevent page scrolling when dragging
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-muted",
          zoom > 1 ? "cursor-move" : "cursor-default",
          className
        )}
        style={{
          touchAction: zoom > 1 ? "none" : "auto",
          aspectRatio: "16/9", // Enforce aspect ratio
          minHeight: "150px", // Ensure minimum height
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="img"
        aria-label={`Zoomable image: ${alt}`}
      >
        <div
          ref={imageWrapperRef}
          className="h-full w-full transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px) rotate(${rotation}deg)`,
            transformOrigin: "center",
          }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            draggable={false}
            priority
          />
        </div>
        {zoom > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
            <Move size={14} className="text-muted-foreground" />
            <span>Drag to pan</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleRotateCounterClockwise}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm hover:bg-muted"
            aria-label="Rotate counter-clockwise"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleRotateClockwise}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm hover:bg-muted"
            aria-label="Rotate clockwise"
          >
            <RotateCw size={16} />
          </button>
        </div>

        <div className="mx-2 h-6 border-l border-border"></div>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm hover:bg-muted disabled:opacity-50"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <div className="min-w-12 text-center text-sm">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= maxZoom}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm hover:bg-muted disabled:opacity-50"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
}
