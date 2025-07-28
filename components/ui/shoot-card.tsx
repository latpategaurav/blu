import Image from 'next/image'

interface ShootCardProps {
  imageSrc: string
  imageAlt: string
  number: string | number
  title: string
  subtitle: string
  className?: string
  onClick?: () => void
  opacity?: boolean
  available?: boolean // new prop
}

export default function ShootCard({
  imageSrc,
  imageAlt,
  number,
  title,
  subtitle,
  className = '',
  onClick,
  opacity = false,
  available = true, // default to true
}: ShootCardProps) {
  return (
    <div
      className={`w-90 overflow-hidden shadow-md bg-white mx-auto border ${opacity ? 'opacity-75' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      {/* Header: Number + Icon */}
      <div className="flex items-center justify-start px-4 py-2">
        <span className="text-lg font-semibold text-black">{number}</span>
        <div className={`w-3 h-3 ${available ? 'bg-black' : 'bg-red-500'} ml-4 border`} />
      </div>
      {/* Image */}
      <div className="relative w-full h-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
      {/* Text */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
} 