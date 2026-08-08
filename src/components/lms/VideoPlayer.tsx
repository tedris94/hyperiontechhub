'use client'

import { useEffect, useRef, useState } from 'react'

type VideoPlayerProps = {
  lessonId: number
  initialPosition?: number
  onProgress?: (position: number) => void
  onComplete?: () => void
}

export function VideoPlayer({
  lessonId,
  initialPosition = 0,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/lms/video/token?lessonId=${lessonId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load video')
        if (!cancelled) setPlaybackUrl(data.playbackUrl)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Video unavailable')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [lessonId])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !playbackUrl || initialPosition <= 0) return
    video.currentTime = initialPosition
  }, [playbackUrl, initialPosition])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      onProgress?.(Math.floor(video.currentTime))
    }
    const handleEnded = () => onComplete?.()

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onProgress, onComplete, playbackUrl])

  if (loading) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
        Loading video…
      </div>
    )
  }

  if (error || !playbackUrl) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 p-6 text-center">
        {error || 'Video not available. Configure Bunny Stream or upload a lesson video.'}
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      src={playbackUrl}
      controls
      className="w-full aspect-video rounded-lg bg-black"
      playsInline
    />
  )
}
